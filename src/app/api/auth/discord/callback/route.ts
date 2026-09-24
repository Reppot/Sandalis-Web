import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { attachSessionCookies, createSession } from "@/lib/auth/session";
import { accessLevelFromRoles, mapDiscordRoles } from "@/lib/discord-roles";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { getPublicAppUrl } from "@/lib/auth/public-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const OAUTH_STATE_COOKIE = "sindaris_oauth_state";
const GUILD_ID = process.env.DISCORD_GUILD_ID?.trim() || process.env.DISCORD_SERVER_ID?.trim() || "762509239683776512";

function getRedirectUri(): string {
  const configured = process.env.DISCORD_REDIRECT_URI?.trim();
  if (configured) return configured;
  return `${getPublicAppUrl()}/api/auth/discord/callback`;
}

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface DiscordUser {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
}

interface DiscordGuildMember {
  roles: string[];
  joined_at?: string;
  nick?: string | null;
}

async function exchangeCode(code: string, redirectUri: string): Promise<DiscordTokenResponse> {
  const clientId = process.env.DISCORD_CLIENT_ID?.trim();
  const clientSecret = process.env.DISCORD_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error("Discord OAuth credentials are not configured");
  }

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Discord token exchange failed: ${response.status} ${text}`);
  }

  return (await response.json()) as DiscordTokenResponse;
}

async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Discord user fetch failed: ${response.status}`);
  }
  return (await response.json()) as DiscordUser;
}

async function fetchGuildMember(accessToken: string): Promise<DiscordGuildMember> {
  const response = await fetch(`https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (response.status === 404) {
    throw new Error("NOT_ON_SERVER");
  }
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Discord guild member fetch failed: ${response.status} ${text}`);
  }
  return (await response.json()) as DiscordGuildMember;
}

function avatarUrl(userId: string, avatarHash: string | null | undefined): string {
  if (avatarHash) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=128`;
  }
  return "https://cdn.discordapp.com/embed/avatars/0.png";
}

async function upsertMember(user: DiscordUser, guildMember: DiscordGuildMember): Promise<number> {
  const mappedRoles = mapDiscordRoles(guildMember.roles ?? []);
  const accessLevel = accessLevelFromRoles(mappedRoles);
  const avatar = avatarUrl(user.id, user.avatar);
  const displayName = guildMember.nick?.trim() || user.global_name?.trim() || user.username;
  const memberSince = guildMember.joined_at ? new Date(guildMember.joined_at) : null;
  const now = new Date();

  const [existing] = await db
    .select({ id: members.id })
    .from(members)
    .where(eq(members.discordId, user.id))
    .limit(1);

  if (existing) {
    await db
      .update(members)
      .set({
        discordName: user.username,
        displayName,
        avatarUrl: avatar,
        roles: mappedRoles,
        accessLevel,
        ...(memberSince ? { memberSince } : {}),
        lastSeenAt: now,
        updatedAt: now,
      })
      .where(eq(members.id, existing.id));
    return existing.id;
  }

  const [created] = await db
    .insert(members)
    .values({
      discordId: user.id,
      discordName: user.username,
      displayName,
      avatarUrl: avatar,
      roles: mappedRoles,
      accessLevel,
      memberSince,
      lastSeenAt: now,
    })
    .returning({ id: members.id });

  return created.id;
}

function redirectWithError(publicUrl: string, code: string): NextResponse {
  const response = NextResponse.redirect(
    new URL(`/?error=${code}`, publicUrl),
  );
  response.cookies.delete({
    name: OAUTH_STATE_COOKIE,
    path: "/",
  });
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const publicUrl = getPublicAppUrl();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(`discord_callback:${ip}`)) {
    return redirectWithError(publicUrl, "rate_limited");
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const savedState = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${OAUTH_STATE_COOKIE}=`))
    ?.slice(OAUTH_STATE_COOKIE.length + 1);

  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    return redirectWithError(publicUrl, "oauth_failed");
  }
  if (!savedState || !state || savedState !== state) {
    console.error("[SIND][DISCORD_CALLBACK] state mismatch");
    return redirectWithError(publicUrl, "state_mismatch");
  }
  if (!code) {
    return redirectWithError(publicUrl, "oauth_failed");
  }

  try {
    const tokenData = await exchangeCode(code, getRedirectUri());
    const user = await fetchDiscordUser(tokenData.access_token);
    const guildMember = await fetchGuildMember(tokenData.access_token);
    const memberId = await upsertMember(user, guildMember);

    const session = await createSession(memberId, {
      ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    console.log(`[SIND][DISCORD_CALLBACK] login ok: member=${memberId} discord=${user.id} roles=${guildMember.roles.length}`);

    const response = NextResponse.redirect(new URL("/cabinet", publicUrl));
    response.cookies.delete(OAUTH_STATE_COOKIE);
    return attachSessionCookies(response, session);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === "NOT_ON_SERVER") {
      return redirectWithError(publicUrl, "not_on_server");
    }
    console.error("[SIND][DISCORD_CALLBACK] ERROR:", message);
    return redirectWithError(publicUrl, "oauth_failed");
  }
}
