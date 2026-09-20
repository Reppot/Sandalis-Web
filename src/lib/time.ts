import type { Severity } from "./types";

export const HOUR = 3600;
export const DAY = 86400;

export function secondsLeft(expiresAt: string | Date, now: number = Date.now()): number {
  const t = typeof expiresAt === "string" ? new Date(expiresAt).getTime() : expiresAt.getTime();
  return Math.max(0, Math.floor((t - now) / 1000));
}

export function severityOf(seconds: number): Severity {
  if (seconds < HOUR) return "critical";
  if (seconds < DAY) return "warning";
  return "safe";
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Формат как в оригинале: "1д 03ч 05м 09с" или "03:05:09" */
export function formatCountdown(ts: number): string {
  const d = Math.floor(ts / DAY);
  const h = Math.floor((ts % DAY) / HOUR);
  const m = Math.floor((ts % HOUR) / 60);
  const s = ts % 60;
  return d > 0 ? `${d}д ${pad(h)}ч ${pad(m)}м ${pad(s)}с` : `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function formatClock(date: Date | number | string | null | undefined): string {
  if (!date) return "--:--:--";
  const d = typeof date === "object" ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "--:--:--";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Штамп вида "dd.mm / HH:MM:SS" */
export function stamp(date: Date = new Date()): string {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)} / ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function fileStamp(date: Date = new Date()): string {
  return `${pad(date.getHours())}-${pad(date.getMinutes())}_${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
