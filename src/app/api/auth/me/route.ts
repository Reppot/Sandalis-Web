import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findAccessProfile } from "@/lib/auth-profiles";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sindaris_session_token")?.value ?? "";
  const expiresAt = Number(cookieStore.get("sindaris_session_expires_at")?.value ?? 0);
  const accessProfile = findAccessProfile(token);

  if (!accessProfile || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    profile: accessProfile.profile,
    sessionExpiresAt: expiresAt,
  });
}
