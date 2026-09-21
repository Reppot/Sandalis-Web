import { NextResponse } from "next/server";
import { isAccessConfigured, isValidToken, SESSION_COOKIE, SESSION_EXPIRY_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAccessConfigured()) {
    return Response.json({ error: "[СИСТЕМА] ACCESS_TOKEN НЕ НАСТРОЕН В ОКРУЖЕНИИ СЕРВЕРА" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "[ОТКАЗАНО В ДОСТУПЕ] НЕВЕРНЫЙ СЕКРЕТНЫЙ КОД" }, { status: 401 });
  }

  const token = body && typeof body === "object" && "token" in body && typeof body.token === "string" ? body.token.trim() : "";

  if (!isValidToken(token)) {
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
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  response.cookies.set({
    name: SESSION_EXPIRY_COOKIE,
    value: String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
