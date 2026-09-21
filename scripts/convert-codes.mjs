import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("scripts/data/itemCodes.ts", "utf8");
const listing = readFileSync("scripts/data/wiki-icons.txt", "utf8").split("\n").filter(Boolean);
const normF = (s) => s.toLowerCase();
const listSet = new Set(listing.map(normF));

// Источник истины: эталонный JSON-экспорт (codes-export.json)
// origin добирается из itemCodes.ts
const originRe = /"([^"]+)":\s*\{\s*"name_en":[^,]+,\s*"name_ru":[^,]+,\s*"icon":\s*("(?:[^"\\]|\\.)*"|null),\s*"origin":\s*"([^"]+)"\s*\}/g;
const origins = {};
const srcIcons = {};
for (const m of src.matchAll(originRe)) {
  origins[m[1]] = m[3];
  srcIcons[m[1]] = m[2] === "null" ? null : JSON.parse(m[2]);
}
const exportJson = JSON.parse(readFileSync("scripts/data/codes-export.json", "utf8"));
const overrides = {};
const raw = exportJson.map((e) => ({ code: e.code, nameEn: e.nameEn, nameRu: e.nameRu, icon: srcIcons[e.code] ?? null, origin: origins[e.code] ?? null, iconCode: e.iconCode }));
console.log("parsed:", raw.length);

// Классификация (портировано из code-base.ts)
const AMMO_RE = /ammo|shell|rocket|grenade|torpedo|round|flare|patron|снаряд|гранат|патрон|боеприпас|ракета|торпед|мина/i;
const MATERIAL_RE = /material|resource|fuel|coal|oil|metal|iron|copper|aluminum|component|suppl|water|wood|salvage|powder|порох|материал|топлив|металл|медь|алюмин|компонент|припас|вода|уголь|сера|сталь|бревно/i;
const WEAPON_RE = /rifle|pistol|shotgun|mortar|launcher|rpg|grenade|mine|sword|flame|mg|gun|cannon|bomb|explosive|tripod|винтов|ружь|пистолет|мином|гранат|рпг|оруди|пулем|оруж/i;
const KIT_RE = /uniform|backpack|binocular|radio|mask|shovel|hammer|wrench|tripod|kit|bucket|flag|banner|siren|gear|форма|рюкзак|бинокл|раци|противогаз|лопат|молот|ключ|набор|флаг|сирен|снаряж/i;

function categoryOf(code, nameEn, nameRu, origin) {
  const value = `${code} ${nameEn ?? ""} ${nameRu}`;
  if (origin === "vehicle") return "Техника";
  if (origin === "structure") return "Сооружения";
  if (AMMO_RE.test(value)) return "Боеприпасы";
  if (MATERIAL_RE.test(value)) return "Материалы";
  if (WEAPON_RE.test(value)) return "Оружие";
  if (KIT_RE.test(value)) return "Снаряжение";
  if (origin === "item") return "Предметы";
  return "Другое";
}
function factionOf(code, nameEn, nameRu) {
  if (/W(?:Icon)?$|W\b/.test(code) || /warden|варден/i.test(`${nameEn ?? ""} ${nameRu}`)) return "Варден";
  if (/C(?:Icon)?$|C\b/.test(code) || /colonial|колонист/i.test(`${nameEn ?? ""} ${nameRu}`)) return "Колонисты";
  return "Нейтральные";
}
function resolveIcon(code, icon, origin) {
  const cand = [overrides[code], icon, `${code}.webp`, `${code}Icon.webp`, icon?.replace(/Icon\.webp$/, ".webp")].filter(Boolean);
  for (const c of cand) if (listSet.has(normF(c))) return listing.find((f) => normF(f) === normF(c));
  return null;
}

const entries = raw.map((e) => {
  const iconFile = e.iconCode;
  const resolved = resolveIcon(e.code, iconFile, e.origin);
  const review = !resolved;
  return {
    code: e.code,
    nameEn: e.nameEn ?? e.nameRu,
    nameRu: e.nameRu,
    iconCode: iconFile ?? `${e.code}Icon.webp`,
    icon: resolved,
    category: categoryOf(e.code, e.nameEn, e.nameRu, e.origin),
    faction: factionOf(e.code, e.nameEn, e.nameRu),
    review,
  };
});

const catOrder = ["Предметы", "Боеприпасы", "Материалы", "Оружие", "Техника", "Сооружения", "Снаряжение", "Другое"];
const usedIcons = [...new Set(entries.filter((e) => e.icon).map((e) => e.icon))];
writeFileSync("scripts/data/codes-icons-used.txt", usedIcons.join("\n"));

const ts = `// СГЕНЕРИРОВАНО scripts/convert-codes.mjs — официальный реестр item_codes.py (${entries.length} записей)
export type RegistryCategory = "Предметы" | "Боеприпасы" | "Материалы" | "Оружие" | "Техника" | "Сооружения" | "Снаряжение" | "Другое";
export type RegistryFaction = "Колонисты" | "Варден" | "Нейтральные";

export interface RegistryEntry {
  code: string;
  nameEn: string;
  nameRu: string;
  iconCode: string;
  icon: string | null;
  category: RegistryCategory;
  faction: RegistryFaction;
  review: boolean;
}

export const REGISTRY_CATEGORIES: RegistryCategory[] = [${catOrder.map((c) => JSON.stringify(c)).join(", ")}];
export const REGISTRY_FACTIONS: RegistryFaction[] = ["Колонисты", "Варден", "Нейтральные"];

export const CODE_REGISTRY: RegistryEntry[] = [
${entries
  .map(
    (e) =>
      `  { code: ${JSON.stringify(e.code)}, nameEn: ${JSON.stringify(e.nameEn)}, nameRu: ${JSON.stringify(e.nameRu)}, iconCode: ${JSON.stringify(e.iconCode)}, icon: ${e.icon ? JSON.stringify(e.icon) : "null"}, category: ${JSON.stringify(e.category)}, faction: ${JSON.stringify(e.faction)}, review: ${e.review} },`,
  )
  .join("\n")}
];
`;
writeFileSync("src/lib/codes-registry.ts", ts);
console.log(`entries: ${entries.length}, with icons: ${entries.filter((e) => e.icon).length}, review: ${entries.filter((e) => e.review).length}, icons to fetch: ${usedIcons.length}`);
