// Извлекает матрицу предметов из HTML-дампов (части 1–3) и генерирует каталог TS.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

// Читаем ВСЕ части распечатки из scripts/data
const parts = readdirSync("scripts/data").filter((f) => f.endsWith(".html")).sort();
const html = parts.map((f) => readFileSync(`scripts/data/${f}`, "utf8")).join("\n");
console.log(`parts merged: ${parts.join(", ")}`);
const listing = readFileSync("scripts/data/wiki-icons.txt", "utf8").split("\n").filter(Boolean);

const norm = (s) => s.toLowerCase().replace(/\.(webp|png|jpg|jpeg|jfif)$/i, "").replace(/\.\.webp$/i, "").replace(/[^a-z0-9а-яё]/gi, "");
const listingMap = new Map(listing.map((f) => [norm(f), f]));

// Алиасы: битые имена из скрейпа → реальные файлы репозитория
const ALIASES = {
  "motorcycleoffensivevehicleicon": "MotorcycleOffensiveVehicleC.webp",
  "llandingcraftoffensivevehiclec": "LandingCraftOffensiveVehicleC.webp",
  "assemblymaterials3.webp": "AssemblyMaterials3.webp",
  "largeshipresource.webp": "LargeShipResource.webp",
  "armoredcaratwvehicleicon": "ArmoredCarATWVehicleW.webp",
};

function resolveIcon(raw) {
  if (!raw) return null;
  let name = raw.replace(/^\/FoxholeWikiPhotos\//, "");
  try {
    name = decodeURIComponent(name);
  } catch {
    /* грязные URL-коды оставляем как есть */
  }
  const alias = ALIASES[norm(name)];
  if (alias && listingMap.has(norm(alias))) return listingMap.get(norm(alias));
  if (/сборочные\s*материалы\s*2/i.test(name)) return listingMap.get(norm("AssemblyMaterials2.webp")) ?? null;
  if (listingMap.has(norm(name))) return listingMap.get(norm(name));
  // вторая попытка: без двойного расширения
  const n2 = norm(name.replace(/\.webp$/, ""));
  if (listingMap.has(n2)) return listingMap.get(n2);
  // третья: начинается с
  for (const [k, v] of listingMap) {
    if (k.startsWith(n2) && n2.length > 8) return v;
  }
  return null;
}

const decode = (s) =>
  s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

const items = [];
const seen = new Set();
const btnRe = /<button class="matrix-item[^"]*"\s+title="([^"]*)">([\s\S]*?)<\/button>/g;
let m;
while ((m = btnRe.exec(html))) {
  const title = decode(m[1]).trim();
  const body = m[2];
  const cat = decode((body.match(/matrix-cat[^>]*>([^<]+)</) || [])[1] || "Прочее").trim();
  const srcMatch = body.match(/src="(\/FoxholeWikiPhotos\/[^"]+)"/);
  const altMatch = body.match(/alt="Иконка предмета: ([^"]+)"/);
  const noIconMatch = body.match(/aria-label="Нет игровой иконки: ([^"]+)"/);
  const icon = resolveIcon(srcMatch ? srcMatch[1] : null);
  let ru = altMatch ? decode(altMatch[1]).trim() : noIconMatch ? decode(noIconMatch[1]).trim() : title;
  // починка известных битых записей скрейпа
  if (ru === "O") ru = title;
  if (ru.length <= 1) ru = title;
  const key = `${ru}|${cat}`;
  if (seen.has(key)) continue;
  seen.add(key);
  // точечные починки по имени позиции (скрейп с битыми ссылками)
  const RU_FIXES = {
    "Assembly Materials II": "AssemblyMaterials2.webp",
    "Mark II Raidbreaker": "AerialBombs.webp",
  };
  const fixedIcon = icon ?? (listingMap.get(norm(RU_FIXES[ru] ?? "")) || null);
  items.push({ title, ru, cat, icon: fixedIcon });
}

items.sort((a, b) => a.ru.localeCompare(b.ru, "ru"));

const cats = ["Оружие", "Боеприпасы", "Материалы", "Медицина", "Снаряжение", "Техника", "Сооружения", "Прочее"].filter(
  (c) => items.some((i) => i.cat === c),
);

const slug = (t) =>
  t
    .toLowerCase()
    .replace(/[«»“”"']/g, "")
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "item";

const ts = `// СГЕНЕРИРОВАНО scripts/extract-matrix.mjs — матрица предметов из дистрибутива штаба (часть 3)
export type ItemCategory = ${cats.map((c) => JSON.stringify(c)).join(" | ")};

export interface GeneItem {
  id: string;
  /** Англ. / вики-название (код из рапорта сканера) */
  title: string;
  /** Отображаемое название */
  ru: string;
  cat: ItemCategory;
  /** Файл иконки в /FoxholeWikiPhotos или null */
  icon: string | null;
}

export const ITEM_CATEGORIES: ItemCategory[] = [${cats.map((c) => JSON.stringify(c)).join(", ")}];

export const GENE_ITEMS: GeneItem[] = [
${items
  .map(
    (i, idx) =>
      `  { id: ${JSON.stringify(slug(i.title) + "-" + idx)}, title: ${JSON.stringify(i.title)}, ru: ${JSON.stringify(i.ru)}, cat: ${JSON.stringify(i.cat)}, icon: ${i.icon ? JSON.stringify(i.icon) : "null"} },`,
  )
  .join("\n")}
];

export const itemIconPath = (item: GeneItem | null | undefined): string | null =>
  item?.icon ? \`/FoxholeWikiPhotos/\${item.icon}\` : null;
`;

writeFileSync("src/lib/items-catalog.ts", ts);
const used = [...new Set(items.filter((i) => i.icon).map((i) => i.icon))];
writeFileSync("scripts/data/icons-used.txt", used.join("\n"));
console.log(`items: ${items.length}, with icons: ${items.filter((i) => i.icon).length}, icons to download: ${used.length}`);
console.log(`no-icon entries: ${items.filter((i) => !i.icon).map((i) => i.ru).join(" | ")}`);
