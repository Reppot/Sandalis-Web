import { NextRequest, NextResponse } from "next/server";
import { isValidToken, SESSION_COOKIE, SESSION_EXPIRY_COOKIE } from "@/lib/auth";

function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/api/auth/login" ||
    pathname === "/api/health" ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/_next/")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const expiryRaw = request.cookies.get(SESSION_EXPIRY_COOKIE)?.value ?? "0";
  const sessionExpiresAt = Number(expiryRaw);
  const sessionIsFresh = Number.isFinite(sessionExpiresAt) && sessionExpiresAt > Date.now();
  const authorized = sessionIsFresh && isValidToken(sessionToken);

  if (authorized) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const loginUrl = new URL("/", request.url);
  if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
