import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("sindaris_session_token");
  response.cookies.delete("sindaris_session_expires_at");
  return response;
}
