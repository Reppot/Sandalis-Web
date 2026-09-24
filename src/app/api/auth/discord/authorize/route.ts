import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { getPublicAppUrl } from "@/lib/auth/public-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const OAUTH_STATE_COOKIE = "sindaris_oauth_state";

function getRedirectUri(): string {
  const configured = process.env.DISCORD_REDIRECT_URI?.trim();
  if (configured) return configured;
  return `${getPublicAppUrl()}/api/auth/discord/callback`;
}

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`discord_authorize:${ip}`)) {
    return NextResponse.redirect(new URL("/?error=rate_limited", getPublicAppUrl()));
  }

  const clientId = process.env.DISCORD_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.redirect(new URL("/?error=oauth_not_configured", getPublicAppUrl()));
  }

  const state = randomBytes(32).toString("hex");

  const authorizeUrl = new URL("https://discord.com/oauth2/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", getRedirectUri());
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "identify guilds.members.read");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("prompt", "consent");

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set({
    name: OAUTH_STATE_COOKIE,
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return response;
}

