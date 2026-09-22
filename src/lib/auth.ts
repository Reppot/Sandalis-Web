import { timingSafeEqual } from "node:crypto";

/**
 * Единая точка констант сессии. С задачи B1-a сессии хранятся в БД (таблица sessions),
 * cookie содержит UUID сессии, а не сам токен. См. src/lib/auth/session.ts.
 */
export {
  SESSION_COOKIE,
  SESSION_EXPIRY_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  SESSION_MAX_AGE_DAYS,
} from "@/lib/auth/session";

function constantTimeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Список валидных резервных ключей: ACCESS_TOKENS_JSON (строки или {token}) или одиночный ACCESS_TOKEN. */
function getValidTokens(): string[] {
  const tokens = new Set<string>();
  const rawList = process.env.ACCESS_TOKENS_JSON?.trim();
  if (rawList) {
    try {
      const parsed = JSON.parse(rawList) as unknown;
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          if (typeof entry === "string" && entry.trim()) tokens.add(entry.trim());
          else if (entry && typeof entry === "object" && typeof (entry as { token?: unknown }).token === "string") {
            const t = ((entry as { token: string }).token ?? "").trim();
            if (t) tokens.add(t);
          }
        }
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
