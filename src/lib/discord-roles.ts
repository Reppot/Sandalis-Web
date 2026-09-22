/**
 * Маппинг Discord Role ID → внутренняя роль SINDARIS.
 *
 * Чтобы получить Role ID: Discord → настройки сервера → роли → правый клик по роли → Copy Role ID
 * (требуется включённый Developer Mode).
 *
 * Пока карта пустая, всем входящим через Discord присваивается роль 'member'.
 * Заполните строки по мере сбора ID.
 */
export type MemberRole = "officer" | "officer_supply" | "lieutenant" | "staff" | "logistics" | "member";

export const DISCORD_ROLE_MAP: Record<string, MemberRole> = {
  // Примеры (замените на реальные ID ролей):
  // "1234567890123456789": "officer",
  // "1234567890123456790": "logistics",
};

/**
 * Преобразует массив Discord Role IDs в наши роли.
 * Если ни одна роль не распознана — возвращает ['member'].
 */
export function mapDiscordRoles(discordRoleIds: string[]): MemberRole[] {
  const mapped = discordRoleIds
    .map((id) => DISCORD_ROLE_MAP[id])
    .filter((role): role is MemberRole => Boolean(role));

  const unique = Array.from(new Set(mapped));
  return unique.length > 0 ? unique : ["member"];
}

/**
 * Вычисляет уровень доступа на основе ролей.
 */
export function accessLevelFromRoles(roles: MemberRole[]): "full" | "partial" | "minimal" {
  if (roles.includes("officer")) return "full";
  if (roles.includes("officer_supply") || roles.includes("lieutenant") || roles.includes("staff") || roles.includes("logistics")) {
    return "partial";
  }
  return "minimal";
}
