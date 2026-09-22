import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { eq, and, gt, desc, ne } from "drizzle-orm";
import { db } from "@/db";
import { members, sessions } from "@/db/schema";

export const SESSION_COOKIE = "sindaris_session_id";
export const SESSION_EXPIRY_COOKIE = "sindaris_session_expires_at";
export const SESSION_MAX_AGE_DAYS = 30;
export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_DAYS * 24 * 60 * 60;
export const SESSION_EXTENSION_THRESHOLD_MS = 12 * 60 * 60 * 1000; // 12 часов

export interface SessionMember {
  sessionId: string;
  memberId: number;
  discordId: string;
  discordName: string;
  displayName: string;
  avatarUrl: string | null;
  serverId: string;
  serverName: string;
  roles: string[];
  accessLevel: string;
  memberSince: Date | null;
  profileUpdatedAt: Date;
  expiresAt: Date;
}

type MemberRow = typeof members.$inferSelect;

interface CookieSetOptions {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
  maxAge?: number;
}

interface CookieStoreLike {
  get(name: string): { value: string } | undefined;
  set(options: CookieSetOptions): void;
  delete(name: string): void;
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

/** Cookie с UUID сессии — httpOnly. */
export function sessionIdCookie(sessionId: string): CookieSetOptions {
  return {
    name: SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/**
 * Cookie со временем истечения — НЕ httpOnly, читается клиентом
 * (TerminalShell / CabinetWorkspace делают Number(value)), поэтому значение — epoch-ms.
 */
export function sessionExpiryCookie(expiresAt: Date): CookieSetOptions {
  return {
    name: SESSION_EXPIRY_COOKIE,
    value: String(expiresAt.getTime()),
    httpOnly: false,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

function toSessionMember(sessionId: string, member: MemberRow, expiresAt: Date): SessionMember {
  return {
    sessionId,
    memberId: member.id,
    discordId: member.discordId,
    discordName: member.discordName,
    displayName: member.displayName,
    avatarUrl: member.avatarUrl,
    serverId: member.serverId,
    serverName: member.serverName,
    roles: member.roles ?? [],
    accessLevel: member.accessLevel,
    memberSince: member.memberSince,
    profileUpdatedAt: member.updatedAt,
    expiresAt,
  };
}

export async function createSession(
  memberId: number,
  metadata?: { ip?: string; userAgent?: string },
): Promise<SessionMember> {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  const [session] = await db
    .insert(sessions)
    .values({
      memberId,
      expiresAt,
      lastIp: metadata?.ip?.slice(0, 100) ?? null,
      userAgent: metadata?.userAgent?.slice(0, 300) ?? null,
    })
    .returning();

  const [member] = await db.select().from(members).where(eq(members.id, memberId)).limit(1);
  if (!member) {
    throw new Error(`Member ${memberId} not found during session creation`);
  }

  return toSessionMember(session.id, member, session.expiresAt);
}

/** Ставит обе cookie через next/headers (для Route Handlers, возвращающих JSON). */
export async function setSessionCookies(sessionMember: SessionMember): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(sessionIdCookie(sessionMember.sessionId));
  cookieStore.set(sessionExpiryCookie(sessionMember.expiresAt));
}

/** Ставит обе cookie прямо на объект ответа (надёжно для redirect-ответов). */
export function attachSessionCookies(response: NextResponse, sessionMember: SessionMember): NextResponse {
  response.cookies.set(sessionIdCookie(sessionMember.sessionId));
  response.cookies.set(sessionExpiryCookie(sessionMember.expiresAt));
  return response;
}

export async function clearSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(SESSION_EXPIRY_COOKIE);
}

/** Чтение сессии с продлением (для Route Handlers / Server Components). */
export async function readSessionFromCookieStore(cookieStore: CookieStoreLike): Promise<SessionMember | null> {
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!session) {
    await db.delete(sessions).where(eq(sessions.id, sessionId)).catch(() => undefined);
    return null;
  }

  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, session.memberId), eq(members.isActive, true)))
    .limit(1);

  if (!member) {
    await db.delete(sessions).where(eq(sessions.id, sessionId)).catch(() => undefined);
    return null;
  }

  const now = new Date();
  const shouldExtend =
    !session.lastSeenAt ||
    now.getTime() - new Date(session.lastSeenAt).getTime() > SESSION_EXTENSION_THRESHOLD_MS;

  if (!shouldExtend) {
    return toSessionMember(session.id, member, session.expiresAt);
  }

  const newExpiresAt = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);
  await db
    .update(sessions)
    .set({ lastSeenAt: now, expiresAt: newExpiresAt })
    .where(eq(sessions.id, session.id));

  try {
    cookieStore.set(sessionIdCookie(session.id));
    cookieStore.set(sessionExpiryCookie(newExpiresAt));
  } catch {
    // В Server Components cookies().set недоступен — продление в БД уже записано,
    // cookie обновится при следующем запросе к Route Handler.
  }

  return toSessionMember(session.id, member, newExpiresAt);
}

export async function readSession(): Promise<SessionMember | null> {
  const cookieStore = await cookies();
  return readSessionFromCookieStore(cookieStore);
}

/** Проверка сессии без продления и без записи cookie (используется в proxy.ts). */
export async function validateSessionById(sessionId: string): Promise<SessionMember | null> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!session) {
    await db.delete(sessions).where(eq(sessions.id, sessionId)).catch(() => undefined);
    return null;
  }

  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, session.memberId), eq(members.isActive, true)))
    .limit(1);

  if (!member) {
    await db.delete(sessions).where(eq(sessions.id, sessionId)).catch(() => undefined);
    return null;
  }

  return toSessionMember(session.id, member, session.expiresAt);
}

export async function destroySession(sessionId?: string): Promise<void> {
  const id = sessionId ?? (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return;
  await db.delete(sessions).where(eq(sessions.id, id)).catch(() => undefined);
  if (!sessionId) {
    await clearSessionCookies();
  }
}

export async function listMemberSessions(memberId: number) {
  return db
    .select()
    .from(sessions)
    .where(eq(sessions.memberId, memberId))
    .orderBy(desc(sessions.createdAt));
}

export async function destroyOtherSessions(memberId: number, currentSessionId: string): Promise<void> {
  await db
    .delete(sessions)
    .where(and(eq(sessions.memberId, memberId), ne(sessions.id, currentSessionId)));
}
