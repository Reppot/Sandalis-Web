import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

function formatDate(value: Date | null | undefined): string {
  if (!value) return "Дата не загружена";
  return new Date(value).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

export async function GET() {
  const session = await readSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    profile: {
      discordId: session.discordId,
      displayName: session.displayName,
      username: session.discordName,
      avatar: session.avatarUrl ?? "/clan-logo.png",
      status: "В сети",
      memberSince: formatDate(session.memberSince),
      profileUpdated: formatDate(session.profileUpdatedAt),
      server: session.serverName,
      serverId: session.serverId,
      roles: session.roles,
      accessLevel: session.accessLevel,
    },
    // Клиент (CabinetWorkspace) ожидает число — epoch-ms.
    sessionExpiresAt: session.expiresAt.getTime(),
  });
}
