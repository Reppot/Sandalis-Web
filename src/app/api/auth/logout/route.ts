import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_EXPIRY_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(SESSION_EXPIRY_COOKIE);
  return response;
}
