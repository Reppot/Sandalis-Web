import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, validateSessionById } from "@/lib/auth/session";

/** Публичные маршруты: вход, health и статика. Всё остальное — только с валидной сессией в БД. */
function isPublicPath(pathname: string): boolean {
  if (
    pathname === "/" ||
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/logout" ||
    pathname === "/api/auth/me" ||
    pathname.startsWith("/api/auth/discord/") ||
    pathname === "/api/health" ||
    pathname.startsWith("/_next/")
  ) {
    return true;
  }
  // Статические файлы из public/ (иконки, фоны, видео, gif и т.д.) — по расширению.
  return /\.[a-z0-9]{2,5}$/i.test(pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  let authorized = false;
  if (sessionId) {
    try {
      authorized = Boolean(await validateSessionById(sessionId));
    } catch (error) {
      console.error("[SIND][PROXY] session check failed:", error instanceof Error ? error.message : error);
    }
  }

  if (authorized) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/", request.url);
  loginUrl.searchParams.set("next", pathname);
  const response = NextResponse.redirect(loginUrl);
  // Протухшие cookie чистим, чтобы TerminalShell не зациклился.
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete("sindaris_session_expires_at");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
