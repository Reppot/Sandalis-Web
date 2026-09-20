#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");
const output = path.join(root, "src", "lib", "foxhole-data.ts");
const inputs = [
  { file: path.join(dataDir, "catalog.json"), source: "catalog.json" },
  { file: path.join(dataDir, "fs_vanilla.h5"), source: "fs_vanilla.h5" },
];

function readJsonLike(filename) {
  const raw = fs.readFileSync(filename, "utf8").replace(/^\uFEFF/, "").trim();
  try {
    return JSON.parse(raw);
  } catch {
    // Some exported .h5 files contain a JSON fragment surrounded by metadata.
    const starts = [raw.indexOf("["), raw.indexOf("{")].filter((value) => value >= 0).sort((a, b) => a - b);
    for (const start of starts) {
      for (let end = raw.length; end > start; end -= 1) {
        const candidate = raw.slice(start, end);
        try {
          return JSON.parse(candidate);
        } catch {
          // Continue shrinking the candidate until a valid JSON root is found.
        }
      }
    }
  }
  throw new Error(`${path.basename(filename)} does not contain a readable JSON object/array`);
}

function flatten(value, output = []) {
  if (Array.isArray(value)) {
    for (const item of value) flatten(item, output);
    return output;
  }
  if (!value || typeof value !== "object") return output;
  const record = value;
  if (typeof record.CodeName === "string" || typeof record.code === "string") output.push(record);
  for (const child of Object.values(record)) {
    if (child && typeof child === "object") flatten(child, output);
  }
  return output;
}

function firstString(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() ?? null;
}

function locale(record, field, lang) {
  const locales = record[`${field}Locales`];
  return locales && typeof locales === "object" ? firstString(locales[lang], locales.en) : null;
}

function numberValue(...values) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  }
  return null;
}

function sourceIcon(record) {
  const raw = firstString(record.Icon, record.icon, record.IconCode, record.iconCode);
  if (!raw) return null;
  const basename = raw.split(/[\\/]/).pop() ?? raw;
  return basename.replace(/\.0$/, "").replace(/\.(?:webp|png|jpg|jpeg)$/i, "") || null;
}

function normalize(record, source) {
  const code = firstString(record.CodeName, record.code);
  if (!code) return null;
  const nameEn = firstString(record.DisplayNameLocales?.en, record.nameEn, record.name_en, record.DisplayName) ?? code;
  const nameRu = firstString(record.DisplayNameLocales?.ru, record.nameRu, record.name_ru, record.DisplayName) ?? nameEn;
  const profile = record.ItemProfileData ?? record.itemProfileData ?? {};
  const dynamic = record.ItemDynamicData ?? record.itemDynamicData ?? {};
  const category = firstString(record.ItemCategory, record.itemCategory, record.category);
  const faction = firstString(record.FactionVariant, record.faction, record.origin);
  return {
    code,
    nameEn,
    nameRu,
    icon: sourceIcon(record),
    origin: record.origin === "vehicle" || record.origin === "structure" ? record.origin : "item",
    faction,
    category,
    quantityPerCrate: numberValue(dynamic.QuantityPerCrate, record.QuantityPerCrate, profile.QuantityPerCrate),
    productionTime: numberValue(dynamic.CrateProductionTime, dynamic.ProductionTime, record.ProductionTime),
    weight: numberValue(record.Weight, record.weight),
    stackLimit: numberValue(record.StackLimit, record.stackLimit, profile.StackTransferLimit),
    source,
  };
}

const available = inputs.filter((input) => fs.existsSync(input.file));
if (!available.length) {
  console.error("No Foxhole data files found. Expected data/catalog.json and/or data/fs_vanilla.h5");
  process.exit(1);
}

const merged = new Map();
for (const input of available) {
  const records = flatten(readJsonLike(input.file));
  for (const record of records) {
    const entry = normalize(record, input.source);
    if (!entry) continue;
    const previous = merged.get(entry.code);
    merged.set(entry.code, previous ? {
      ...previous,
      ...entry,
      nameEn: entry.nameEn || previous.nameEn,
      nameRu: entry.nameRu || previous.nameRu,
      icon: entry.icon || previous.icon,
      origin: entry.origin || previous.origin,
      faction: entry.faction || previous.faction,
      category: entry.category || previous.category,
      source: previous.source === entry.source ? entry.source : "merged",
    } : entry);
  }
}

const entries = [...merged.values()].sort((a, b) => a.code.localeCompare(b.code));
const json = JSON.stringify(Object.fromEntries(entries.map((entry) => [entry.code, entry])), null, 2);
const outputText = `/** Generated by scripts/import-foxhole-data.mjs. Do not edit manually. */\nexport interface FoxholeDataEntry {\n  code: string; nameEn: string | null; nameRu: string; icon: string | null; origin: string | null; faction: string | null; category: string | null; quantityPerCrate: number | null; productionTime: number | null; weight: number | null; stackLimit: number | null; source: "catalog.json" | "fs_vanilla.h5" | "merged";\n}\n\nexport const FOXHOLE_DATA: Readonly<Record<string, FoxholeDataEntry>> = ${json} as const;\nexport const FOXHOLE_DATA_SOURCE = ${JSON.stringify(available.map((item) => item.source).join(" + "))};\n`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, outputText, "utf8");
console.log(`Imported ${entries.length} Foxhole records from ${available.map((item) => item.source).join(", ")}`);
