import { NextResponse } from "next/server";
import { findAccessProfile } from "@/lib/auth-profiles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SESSION_COOKIE = "sindaris_session_token";
const SESSION_EXPIRY_COOKIE = "sindaris_session_expires_at";
const SESSION_MAX_AGE = 60 * 30;

export async function POST(request: Request) {
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

  const token = body && typeof body === "object" && "token" in body && typeof body.token === "string"
    ? body.token.trim()
    : "";

  const accessProfile = findAccessProfile(token);
  if (!accessProfile) {
    return Response.json({ error: "[ОТКАЗАНО В ДОСТУПЕ] НЕВЕРНЫЙ СЕКРЕТНЫЙ КОД" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  response.cookies.set({
    name: SESSION_EXPIRY_COOKIE,
    value: String(Date.now() + SESSION_MAX_AGE * 1000),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
