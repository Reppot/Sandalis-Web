import { timingSafeEqual } from "node:crypto";

/**
 * Сравнение строк в постоянном времени.
 * Используется для проверки токенов, чтобы не утекать через timing-атаки.
 */
export function constantTimeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
