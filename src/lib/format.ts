import { useEffect, useState } from "react";

// ─────────── ВРЕМЯ ───────────
export function useNow(stepMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), stepMs);
    return () => window.clearInterval(t);
  }, [stepMs]);
  return now;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return d > 0 ? `${d}д ${pad2(h)}:${pad2(m)}:${pad2(sec)}` : `${pad2(h)}:${pad2(m)}:${pad2(sec)}`;
}

export function formatDateTime(ts: number): string {
  const d = new Date(ts);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function formatClock(ts: number): string {
  const d = new Date(ts);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

export type Severity = "critical" | "warning" | "safe";

export function severityOf(secondsLeft: number): Severity {
  if (secondsLeft <= 3600) return "critical";
  if (secondsLeft <= 86400) return "warning";
  return "safe";
}

// ─────────── ПАРСЕР ОТЧЁТОВ СКЛАДА ───────────
export interface ParsedRow {
  name: string;
  count: number;
}

const UNIT_RE = /\b(шт\.?|штук\w*|ящ(?:\.|иков|ика|ик)?|crates?|units?)\b\.?/gi;

/** Понимает: «Название, 50» · «Название -> 50 шт.» · «Название: 12 ящ» · «- Название x40» */
export function parseScannerReport(text: string): ParsedRow[] {
  const rows: ParsedRow[] = [];
  let skipped = 0;
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line) continue;
    line = line.replace(/^[\-*•·►▶»>]+\s*/, "").trim();
    const match =
      line.match(/^(.*?)\s*(?:->|=>|:|;|,|—|-)\s*(\d[\d\s]*)\s*([^\d]*)$/) ||
      line.match(/^(.*?)\s+[xх×]\s*(\d[\d\s]*)$/i);
    if (!match) {
      skipped++;
      continue;
    }
    const name = match[1].replace(UNIT_RE, "").replace(/[\s.,;:]+$/, "").trim();
    const count = parseInt(match[2].replace(/\s+/g, ""), 10);
    if (!name || !Number.isFinite(count) || count <= 0) {
      skipped++;
      continue;
    }
    rows.push({ name, count });
  }
  void skipped;
  return rows;
}

// ─────────── ЭКСПОРТ ───────────
export function downloadText(filename: string, content: string, mime = "text/plain;charset=utf-8"): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");
