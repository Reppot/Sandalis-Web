import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { createSession, setSessionCookies } from "@/lib/auth/session";
import { findAccessProfile } from "@/lib/auth-profiles";
import { isRateLimited } from "@/lib/auth/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Резервный вход по мастер-токену или персональным токенам.
 * Создаёт запись в members (если нужно) и сессию в БД.
 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (isRateLimited(`token_login:${ip}`)) {
    return Response.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
  }

  if (!process.env.ACCESS_TOKEN?.trim() && !process.env.ACCESS_TOKENS_JSON?.trim()) {
    return Response.json(
      { error: "[СИСТЕМА] ACCESS_TOKEN НЕ НАСТРОЕН В ОКРУЖЕНИИ СЕРВЕРА" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "[ОТКАЗАНО В ДОСТУПЕ] НЕВЕРНЫЙ СЕКРЕТНЫЙ КОД" }, { status: 401 });
  }

  const token =
    body && typeof body === "object" && "token" in body && typeof body.token === "string"
      ? body.token.trim()
      : "";

  const accessProfile = findAccessProfile(token);
  if (!accessProfile) {
    return Response.json({ error: "[ОТКАЗАНО В ДОСТУПЕ] НЕВЕРНЫЙ СЕКРЕТНЫЙ КОД" }, { status: 401 });
  }

  const profile = accessProfile.profile;
  const now = new Date();

  // Ищем участника по discordId; если нет — создаём
  let [member] = await db
    .select()
    .from(members)
    .where(eq(members.discordId, profile.discordId))
    .limit(1);

  if (!member) {
    const [created] = await db
      .insert(members)
      .values({
        discordId: profile.discordId,
        discordName: profile.username,
        displayName: profile.displayName,
        avatarUrl: profile.avatar,
        serverId: process.env.DISCORD_GUILD_ID?.trim() || process.env.DISCORD_SERVER_ID?.trim() || "762509239683776512",
        serverName: profile.server,
        roles: profile.roles.length ? profile.roles : ["member"],
        accessLevel: "full",
        isActive: true,
        memberSince: null,
        lastSeenAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    member = created;
  } else {
    await db
      .update(members)
      .set({ lastSeenAt: now, updatedAt: now })
      .where(eq(members.id, member.id));
  }

  const session = await createSession(member.id, {
    ip,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });
  await setSessionCookies(session);

  return NextResponse.json({ ok: true });
}
