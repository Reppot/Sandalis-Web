import type { OrderLine, OrderUnit, StorageItem } from "./types";

const HEADER_HINTS = /public|private|x:\s*[-\d.]+|y:\s*[-\d.]+|valley|port|king/i;
const CRATE_SUFFIX = /\s*\((?:ящик|ящ|штука|шт|crate|crates?)\)\s*$/iu;
const UNIT_SUFFIX = /\s+(?:ящиков|ящика|ящик|ящ|штук|штука|шт)\.?\s*$/iu;

function cleanName(raw: string): string {
  return raw
    .replace(/[•*]/g, "")
    .replace(/^[-–—]\s+/, "")
    .replace(CRATE_SUFFIX, "")
    .replace(UNIT_SUFFIX, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Извлекает число из "50 шт.", "x 12 ящ", "12 ящиков", " 7" ... */
function parseCount(raw: string): number | null {
  const cleaned = raw
    .toLowerCase()
    .replace(/ящиков|ящика|ящик|ящ\.?|шт\.?|крат|crates?|crate|штук|шт/g, " ")
    .replace(/[x×]/g, " ")
    .trim();
  const m = cleaned.match(/-?\d+/);
  if (!m) return null;
  const n = parseInt(m[0], 10);
  return Number.isFinite(n) ? n : null;
}

function detectUnit(raw: string, rawName = ""): OrderUnit {
  if (CRATE_SUFFIX.test(rawName) || /ящ/i.test(raw)) return "ящ.";
  if (/шт/i.test(raw)) return "шт.";
  return rawName ? "шт." : "ящ.";
}

export interface ParsedLine {
  name: string;
  count: number;
  unit: OrderUnit;
}

/**
 * Разбирает текстовый отчёт сканера / сообщение из Discord.
 * Поддерживает разделители: запятая, "->", двоеточие, а также "Название 50".
 */
export function parseInventoryText(text: string): ParsedLine[] {
  const out: ParsedLine[] = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) return;
    if (/^(?:Clanshead|.+?\s-\s.+?\s-\s.+?\s-\s(?:Public|Private)).*X:\s*[-\d.]+\s+Y:\s*[-\d.]+.*,/iu.test(line)) return;

    let namePart = "";
    let countPart = "";
    if (line.includes("->")) {
      const i = line.lastIndexOf("->");
      namePart = line.slice(0, i);
      countPart = line.slice(i + 2);
    } else if (line.includes(",")) {
      const i = line.lastIndexOf(",");
      namePart = line.slice(0, i);
      countPart = line.slice(i + 1);
    } else if (/:\s*[x×]?\s*\d+/.test(line)) {
      const i = line.lastIndexOf(":");
      namePart = line.slice(0, i);
      countPart = line.slice(i + 1);
    } else {
      const m = line.match(/^(.*?\S)\s+[x×]?\s*(\d+)\s*(шт\.?|ящ\.?|ящиков|crates?)?\.?$/i);
      if (!m) return;
      namePart = m[1];
      countPart = `${m[2]} ${m[3] ?? ""}`;
    }

    const count = parseCount(countPart);
    const name = cleanName(namePart);
    // Первая строка clipboard-отчёта — метаданные склада, например:
    // "Clanshead Valley - The King - Морской порт - Public - X: ...,2026..."
    if (idx === 0 && HEADER_HINTS.test(line)) return;
    if (!name || count === null || count < 0) return;
    out.push({ name, count, unit: detectUnit(countPart, namePart) });
  });
  return out;
}

type JsonRecord = Record<string, unknown>;

function pick(obj: JsonRecord, keys: string[]): unknown {
  for (const k of keys) {
    const found = Object.keys(obj).find((key) => key.toLowerCase() === k.toLowerCase());
    if (found !== undefined) return obj[found];
  }
  return undefined;
}

function fromJsonValue(value: unknown): ParsedLine[] | null {
  if (Array.isArray(value)) {
    const out: ParsedLine[] = [];
    for (const entry of value) {
      if (entry && typeof entry === "object") {
        const rec = entry as JsonRecord;
        const name = pick(rec, ["name", "Name", "item", "Item", "title", "название"]);
        const count = pick(rec, ["count", "Count", "quantity", "qty", "amount", "количество"]);
        const unit = pick(rec, ["unit", "Unit", "ед", "ед. изм."]);
        const n = typeof count === "number" ? count : parseCount(String(count ?? ""));
        if (typeof name === "string" && n !== null && n > 0) {
          out.push({ name: cleanName(name), count: n, unit: typeof unit === "string" ? detectUnit(unit) : "ящ." });
        }
      } else if (typeof entry === "string") {
        out.push(...parseInventoryText(entry));
      }
    }
    return out;
  }
  if (value && typeof value === "object") {
    const rec = value as JsonRecord;
    const nested = pick(rec, ["items", "Items", "data", "stockpile", "inventory"]);
    if (nested !== undefined) return fromJsonValue(nested);
    const out: ParsedLine[] = [];
    for (const [k, v] of Object.entries(rec)) {
      const n = typeof v === "number" ? v : parseCount(String(v ?? ""));
      if (n !== null && n > 0) out.push({ name: cleanName(k), count: n, unit: "ящ." });
    }
    return out;
  }
  return null;
}

/** Универсальный вход: JSON (массив/словарь) либо текстовые строки */
export function parseInventoryPayload(text: string): ParsedLine[] {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = fromJsonValue(JSON.parse(trimmed));
      if (parsed && parsed.length) return parsed;
    } catch {
      // не JSON — пробуем как текст
    }
  }
  return parseInventoryText(trimmed);
}

function mergeKey(name: string): string {
  return name.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").replace(/[^a-z0-9а-я]+/giu, "");
}

export function toStorageItems(lines: ParsedLine[]): StorageItem[] {
  const merged = new Map<string, StorageItem>();
  for (const l of lines) {
    if (l.count <= 0) continue;
    const key = mergeKey(l.name);
    const previous = merged.get(key);
    if (previous) previous.count += l.count;
    else merged.set(key, { name: l.name, count: l.count, unit: l.unit });
  }
  return [...merged.values()];
}

export function toOrderLines(lines: ParsedLine[]): OrderLine[] {
  const merged = new Map<string, OrderLine>();
  for (const l of lines) {
    if (l.count <= 0) continue;
    const key = mergeKey(l.name);
    const prev = merged.get(key);
    if (prev && prev.unit === l.unit) prev.count += l.count;
    else if (prev) prev.count += l.count;
    else merged.set(key, { name: l.name, count: l.count, unit: l.unit });
  }
  return [...merged.values()];
}
