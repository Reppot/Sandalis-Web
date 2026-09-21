import { timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "sindaris_session_token";
export const SESSION_EXPIRY_COOKIE = "sindaris_session_expires_at";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 часов — единая точка настройки срока сессии.

function constantTimeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Список валидных ключей доступа. ACCESS_TOKENS_JSON (массив строк) или одиночный ACCESS_TOKEN. */
function getValidTokens(): string[] {
  const tokens = new Set<string>();
  const rawList = process.env.ACCESS_TOKENS_JSON?.trim();
  if (rawList) {
    try {
      const parsed = JSON.parse(rawList) as unknown;
      if (Array.isArray(parsed)) {
        for (const entry of parsed) if (typeof entry === "string" && entry.trim()) tokens.add(entry.trim());
      }
    } catch {
      // некорректный JSON не должен ломать одиночный ACCESS_TOKEN
    }
  }
  const single = process.env.ACCESS_TOKEN?.trim();
  if (single) tokens.add(single);
  return [...tokens];
}

export function isAccessConfigured(): boolean {
  return getValidTokens().length > 0;
}

export function isValidToken(candidate: string | null | undefined): boolean {
  const value = candidate?.trim() ?? "";
  if (!value) return false;
  return getValidTokens().some((token) => constantTimeEqual(token, value));
}
