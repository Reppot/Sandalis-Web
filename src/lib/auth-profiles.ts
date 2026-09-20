import { timingSafeEqual } from "node:crypto";

export interface DiscordProfile {
  discordId: string;
  displayName: string;
  username: string;
  avatar: string;
  status: string;
  memberSince: string;
  profileUpdated: string;
  server: string;
  roles: string[];
}

export interface AccessProfile {
  token: string;
  profile: DiscordProfile;
}

/** Профили клана. Секреты не хранятся в этом файле. */
export const DISCORD_PROFILES: Record<string, DiscordProfile> = {
  "450743910327910410": {
    discordId: "450743910327910410",
    displayName: "Глеб С. (Reppot)",
    username: "reppots",
    avatar: "/clan-logo.png",
    status: "В сети",
    memberSince: "28 мая 2018 г.",
    profileUpdated: "8 янв. 2026 г.",
    server: "KUNI",
    roles: [
      "Офицерский состав",
      "Служба обеспечения",
      "Сотрудник штаба",
      "Офицер обеспечения",
      "Мл. Лейтенант",
      "[FOXHOLE] Корпус Фоксхол",
    ],
  },
};

function constantTimeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function profileForDiscordId(discordId: string): DiscordProfile {
  return DISCORD_PROFILES[discordId] ?? {
    discordId,
    displayName: "Неизвестный участник",
    username: "unknown",
    avatar: "/clan-logo.png",
    status: "Профиль ожидает синхронизации",
    memberSince: "Дата не загружена",
    profileUpdated: "Дата не загружена",
    server: "SINDARIS",
    roles: ["Участник клана"],
  };
}

/**
 * Список ключей доступа:
 * 1) ACCESS_TOKENS_JSON — массив [{ token, discordId }] для нескольких участников;
 * 2) ACCESS_TOKEN — текущий одиночный ключ, автоматически привязанный к первому профилю.
 */
export function getAccessProfiles(): AccessProfile[] {
  const result: AccessProfile[] = [];
  const rawList = process.env.ACCESS_TOKENS_JSON?.trim();

  if (rawList) {
    try {
      const parsed = JSON.parse(rawList) as Array<{ token?: string; discordId?: string }>;
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          if (typeof entry.token === "string" && entry.token.trim() && typeof entry.discordId === "string" && entry.discordId.trim()) {
            result.push({ token: entry.token.trim(), profile: profileForDiscordId(entry.discordId.trim()) });
          }
        }
      }
    } catch {
      // Некорректный JSON не должен ломать одиночный ACCESS_TOKEN.
    }
  }

  const singleToken = process.env.ACCESS_TOKEN?.trim();
  if (singleToken && !result.some((entry) => constantTimeEqual(entry.token, singleToken))) {
    const firstProfileId = Object.keys(DISCORD_PROFILES)[0] ?? "450743910327910410";
    result.push({ token: singleToken, profile: profileForDiscordId(firstProfileId) });
  }

  return result;
}

export function findAccessProfile(token: string | null | undefined): AccessProfile | null {
  const candidate = token?.trim() ?? "";
  if (!candidate) return null;
  return getAccessProfiles().find((entry) => constantTimeEqual(entry.token, candidate)) ?? null;
}
