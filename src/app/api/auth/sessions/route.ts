import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { readSession, clearSessionCookies } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: sessions.id,
      createdAt: sessions.createdAt,
      expiresAt: sessions.expiresAt,
      lastSeenAt: sessions.lastSeenAt,
      lastIp: sessions.lastIp,
      userAgent: sessions.userAgent,
    })
    .from(sessions)
    .where(eq(sessions.memberId, session.memberId))
    .orderBy(sessions.createdAt);

  return NextResponse.json({
    current: session.sessionId,
    sessions: rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      expiresAt: r.expiresAt.toISOString(),
      lastSeenAt: r.lastSeenAt?.toISOString() ?? null,
    })),
  });
}

export async function DELETE(request: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const all = searchParams.get("all") === "true";

  if (all) {
    // Удаляем все сессии участника, кроме текущей
    await db
      .delete(sessions)
      .where(and(eq(sessions.memberId, session.memberId), ne(sessions.id, session.sessionId)));
    return NextResponse.json({ ok: true });
  }

  if (id) {
    await db
      .delete(sessions)
      .where(eq(sessions.id, id));
    if (id === session.sessionId) {
      await clearSessionCookies();
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Укажите id или all=true" }, { status: 400 });
}
