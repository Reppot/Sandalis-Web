/**
 * Простой in-memory rate limiter для авторизации.
 * Подходит для одного инстанса (Render Free).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 10 * 60 * 1000; // 10 минут
const MAX_ATTEMPTS = 10;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_ATTEMPTS;
}

export function rateLimitResetAt(key: string): number | null {
  const bucket = buckets.get(key);
  return bucket && Date.now() < bucket.resetAt ? bucket.resetAt : null;
}
