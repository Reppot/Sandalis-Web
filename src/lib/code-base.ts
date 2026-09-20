import { ITEM_CODES, type ItemConfig } from "./itemCodes";
import { ITEM_ICON_OVERRIDES } from "./item-icon-overrides";
import { FOXHOLE_DATA, type FoxholeDataEntry } from "./foxhole-data";

export type CodeCategory = "Предметы" | "Боеприпасы" | "Материалы" | "Оружие" | "Техника" | "Сооружения" | "Снаряжение" | "Другое";
export type CodeFaction = "Колонисты" | "Варден" | "Нейтральные";

export interface CodeBaseEntry {
  code: string;
  nameEn: string;
  nameRu: string;
  iconCode: string | null;
  iconFile: string | null;
  origin: string | null;
  category: CodeCategory;
  faction: CodeFaction;
  needsReview: boolean;
}

const AMMO_RE = /ammo|shell|rocket|grenade|torpedo|round|flare|patron|снаряд|гранат|патрон|боеприпас|ракета|торпед|мина/i;
const MATERIAL_RE = /material|resource|fuel|coal|oil|metal|iron|copper|aluminum|component|suppl|water|wood|salvage|powder|порох|материал|топлив|металл|медь|алюмин|компонент|припас|вода|уголь|сера|сталь|бревно/i;
const WEAPON_RE = /rifle|pistol|shotgun|mortar|launcher|rpg|grenade|mine|sword|flame|mg|gun|cannon|bomb|explosive|tripod|grenade|винтов|ружь|пистолет|мином|гранат|рпг|оруди|пулем|оруж/i;
const KIT_RE = /uniform|backpack|binocular|radio|mask|shovel|hammer|wrench|tripod|kit|bucket|flag|banner|siren|gear|форма|рюкзак|бинокл|раци|противогаз|лопат|молот|ключ|набор|флаг|сирен|снаряж/i;

function categoryOf(code: string, item: ItemConfig): CodeCategory {
  const value = `${code} ${item.name_en ?? ""} ${item.name_ru}`;
  if (item.origin === "vehicle") return "Техника";
  if (item.origin === "structure") return "Сооружения";
  if (AMMO_RE.test(value)) return "Боеприпасы";
  if (MATERIAL_RE.test(value)) return "Материалы";
  if (WEAPON_RE.test(value)) return "Оружие";
  if (KIT_RE.test(value)) return "Снаряжение";
  if (item.origin === "item") return "Предметы";
  return "Другое";
}

function factionOf(code: string, item: ItemConfig): CodeFaction {
  if (/W(?:Icon)?$|W\b/.test(code) || /warden|варден/i.test(`${item.name_en ?? ""} ${item.name_ru}`)) return "Варден";
  if (/C(?:Icon)?$|C\b/.test(code) || /colonial|колонист/i.test(`${item.name_en ?? ""} ${item.name_ru}`)) return "Колонисты";
  return "Нейтральные";
}

function iconCodeOf(code: string, icon: string | null): string | null {
  if (ITEM_ICON_OVERRIDES[code]) return ITEM_ICON_OVERRIDES[code];
  if (!icon && !code) return null;
  return `${code}Icon.webp`;
}

function entryToConfig(entry: FoxholeDataEntry): ItemConfig {
  return { name_en: entry.nameEn, name_ru: entry.nameRu, icon: entry.icon, origin: entry.origin };
}

/** UI-реестр базы кодов: item_codes.py + импортированный Foxhole datamining layer. */
const CODE_CONFIGS = new Map<string, { item: ItemConfig; enriched?: FoxholeDataEntry }>();
for (const [code, item] of Object.entries(ITEM_CODES)) CODE_CONFIGS.set(code, { item });
for (const [code, entry] of Object.entries(FOXHOLE_DATA)) CODE_CONFIGS.set(code, { item: entryToConfig(entry), enriched: entry });

export const CODE_BASE: CodeBaseEntry[] = [...CODE_CONFIGS.entries()].map(([code, { item, enriched }]) => ({
  code,
  nameEn: item.name_en ?? item.name_ru,
  nameRu: item.name_ru,
  iconCode: iconCodeOf(code, ITEM_ICON_OVERRIDES[code] ?? item.icon ?? enriched?.icon),
  iconFile: ITEM_ICON_OVERRIDES[code] ?? item.icon ?? enriched?.icon,
  origin: item.origin,
  category: categoryOf(code, item),
  faction: factionOf(code, item),
  needsReview: (!item.icon && !enriched?.icon && !ITEM_ICON_OVERRIDES[code]) || !item.name_en || !item.origin,
}));

export const CODE_BASE_CATEGORIES: CodeCategory[] = ["Предметы", "Боеприпасы", "Материалы", "Оружие", "Техника", "Сооружения", "Снаряжение", "Другое"];
export const CODE_BASE_FACTIONS: CodeFaction[] = ["Колонисты", "Варден", "Нейтральные"];

export function codeBaseToJson(entries: CodeBaseEntry[]): string {
  return JSON.stringify(entries.map(({ code, nameEn, nameRu, iconCode }) => ({ code, nameEn, nameRu, iconCode })), null, 2);
}

export function codeBaseToCsv(entries: CodeBaseEntry[]): string {
  const escape = (value: string | null) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [
    ["Код JSON", "English name", "Русское название", "Код иконки"].map(escape).join(","),
    ...entries.map((entry) => [entry.code, entry.nameEn, entry.nameRu, entry.iconCode].map(escape).join(",")),
  ].join("\n");
}
