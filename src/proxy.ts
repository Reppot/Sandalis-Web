import { NextRequest, NextResponse } from "next/server";
import { findAccessProfile } from "@/lib/auth-profiles";

const SESSION_COOKIE = "sindaris_session_token";
const SESSION_EXPIRY_COOKIE = "sindaris_session_expires_at";

function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/api/auth/login" ||
    pathname === "/api/health" ||
    pathname === "/favicon.ico" ||
    pathname === "/clan-logo.png" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/FoxholeWikiPhotos/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/bg/") ||
    pathname.startsWith("/Videos/")
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
  const authorized = Boolean(findAccessProfile(sessionToken) && sessionIsFresh);

  if (authorized) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/", request.url);
  if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
