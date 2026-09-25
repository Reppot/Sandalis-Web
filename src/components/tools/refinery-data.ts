/**
 * Конфиг и формулы «Калькулятора молотка» (Refinery).
 *
 * ИСТОЧНИКИ ДАННЫХ (ничего не выдумано):
 *  - рецепты, время и лимиты слотов — официальная вики Foxhole: https://foxhole.wiki.gg/wiki/Refinery
 *    (статья помечена как актуальная для Update 1.66);
 *  - русские названия и размеры ящиков — датамайн репозитория data/catalog.json
 *    (DisplayNameLocales.ru и ItemDynamicData.QuantityPerCrate).
 * В data/catalog.json самих рецептов Refinery нет (там только Concrete Mixer), поэтому таблица
 * рецептов перенесена вручную из вики.
 * TODO: после крупных обновлений игры сверять значения с вики/игрой — правится только этот файл.
 */

export type RefineryResourceKey = "salvage" | "components" | "sulfur" | "coal" | "aluminum" | "copper" | "iron";
export type RefineryGroup = "materials" | "fuel" | "construction" | "alloys";
/** Как пользователь вводит количество продукта: ящиками или поштучно. */
export type RefineryInputUnit = "crate" | "unit";

/** Сырьё, которое сдаётся в Refinery. */
export interface RefineryResource {
  key: RefineryResourceKey;
  /** Русское название из игры. */
  name: string;
  nameEn: string;
  icon: string | null;
}

/** Рецепт переработки: `inputPerUnit` сырья → 1 единица продукта. */
export interface RefineryRecipe {
  id: string;
  /** Русское название продукта из игры. */
  name: string;
  nameEn: string;
  /** Короткая клановая подпись (как MATERIAL_LABELS в калькуляторе фабрики). */
  short: string;
  group: RefineryGroup;
  icon: string | null;
  input: RefineryResourceKey;
  /** Сколько сырья уходит на 1 единицу продукта (вики: колонка Input при выходе 1 шт.). */
  inputPerUnit: number;
  /** Время переработки 1 единицы продукта, сек (вики: колонка Time). */
  secondsPerUnit: number;
  /** Единиц продукта в одном ящике. 1 — ящиков нет, ввод только поштучно. */
  crateSize: number;
  /** Подпись единицы продукта. */
  unitLabel: string;
  /** Лимит личного слота выдачи (вики: Personal Output Limit). Слот отряда — ×2 (Update 1.66). */
  personalLimit: number;
  /** Необязательная пометка для карточки. */
  hint?: string;
}

const wikiIcon = (file: string) => `/FoxholeWikiPhotos/${file}`;

export const REFINERY_RESOURCES: Record<RefineryResourceKey, RefineryResource> = {
  salvage: { key: "salvage", name: "Металлолом", nameEn: "Salvage", icon: wikiIcon("Salvage.webp") },
  components: { key: "components", name: "Компоненты", nameEn: "Components", icon: wikiIcon("ComponentsIcon.webp") },
  sulfur: { key: "sulfur", name: "Сера", nameEn: "Sulfur", icon: wikiIcon("Sulfur.webp") },
  coal: { key: "coal", name: "Уголь", nameEn: "Coal", icon: wikiIcon("CoalIcon.webp") },
  aluminum: { key: "aluminum", name: "Алюминий", nameEn: "Aluminum", icon: wikiIcon("ResouceAluminum.webp") },
  // Иконки сырой меди в public/FoxholeWikiPhotos нет — ToolItemIcon покажет буквенную заглушку.
  copper: { key: "copper", name: "Медь", nameEn: "Copper", icon: null },
  iron: { key: "iron", name: "Железо", nameEn: "Iron", icon: wikiIcon("ResouceIron.png") },
};

/** Порядок сырья в блоке итогов и в экспорте. */
export const REFINERY_RESOURCE_ORDER: RefineryResourceKey[] = ["salvage", "components", "sulfur", "coal", "aluminum", "copper", "iron"];

export const REFINERY_GROUP_LABELS: Record<RefineryGroup, string> = {
  materials: "Материалы",
  fuel: "Топливо",
  construction: "Стройматериалы",
  alloys: "Сплавы",
};

export const REFINERY_RECIPES: RefineryRecipe[] = [
  { id: "bmat", name: "Базовые материалы", nameEn: "Basic Materials", short: "БМАТ", group: "materials", icon: wikiIcon("BasicMaterials.webp"), input: "salvage", inputPerUnit: 2, secondsPerUnit: 0.48, crateSize: 100, unitLabel: "шт.", personalLimit: 12500 },
  { id: "emat", name: "Порох", nameEn: "Explosive Powder", short: "ЭМАТ", group: "materials", icon: wikiIcon("ExplosiveMaterial.webp"), input: "salvage", inputPerUnit: 5, secondsPerUnit: 9.375, crateSize: 40, unitLabel: "шт.", personalLimit: 12000 },
  { id: "rmat", name: "Рафинированные материалы", nameEn: "Refined Materials", short: "РМАТ", group: "materials", icon: wikiIcon("RefinedMaterials.webp"), input: "components", inputPerUnit: 20, secondsPerUnit: 40, crateSize: 20, unitLabel: "шт.", personalLimit: 6000 },
  { id: "hemat", name: "Тяжёлый порох", nameEn: "Heavy Explosive Powder", short: "ТЯЖ. ЭМАТ", group: "materials", icon: wikiIcon("HeavyExplosiveMaterials.webp"), input: "sulfur", inputPerUnit: 5, secondsPerUnit: 15, crateSize: 30, unitLabel: "шт.", personalLimit: 6000 },
  { id: "diesel", name: "Дизель", nameEn: "Diesel", short: "ДИЗЕЛЬ", group: "fuel", icon: wikiIcon("ResourceFuel.webp"), input: "salvage", inputPerUnit: 10, secondsPerUnit: 12, crateSize: 1, unitLabel: "кан.", personalLimit: 6000, hint: "1 кан. = 100 л" },
  { id: "gravel-coal", name: "Гравий (из угля)", nameEn: "Gravel", short: "ГРАВИЙ", group: "construction", icon: wikiIcon("GroundMaterials.webp"), input: "coal", inputPerUnit: 5, secondsPerUnit: 1.2, crateSize: 20, unitLabel: "шт.", personalLimit: 6000 },
  { id: "gravel-salvage", name: "Гравий (из металлолома)", nameEn: "Gravel", short: "ГРАВИЙ", group: "construction", icon: wikiIcon("GroundMaterials.webp"), input: "salvage", inputPerUnit: 6, secondsPerUnit: 1.2, crateSize: 20, unitLabel: "шт.", personalLimit: 6000 },
  { id: "alloy-aluminum", name: "Алюминиевый сплав", nameEn: "Aluminum Alloy", short: "AL-СПЛАВ", group: "alloys", icon: wikiIcon("ResouceAluminumRefined.png"), input: "aluminum", inputPerUnit: 1, secondsPerUnit: 0.24, crateSize: 20, unitLabel: "шт.", personalLimit: 1000 },
  { id: "alloy-copper", name: "Медный сплав", nameEn: "Copper Alloy", short: "CU-СПЛАВ", group: "alloys", icon: wikiIcon("ResourceCopperRefined.png"), input: "copper", inputPerUnit: 1, secondsPerUnit: 0.24, crateSize: 20, unitLabel: "шт.", personalLimit: 1000 },
  { id: "alloy-iron", name: "Железный сплав", nameEn: "Iron Alloy", short: "FE-СПЛАВ", group: "alloys", icon: wikiIcon("ResouceIronRefined.png"), input: "iron", inputPerUnit: 1, secondsPerUnit: 0.24, crateSize: 20, unitLabel: "шт.", personalLimit: 1000 },
];

// ─────────────────────────────────────────────────────────────
// ФОРМУЛЫ
// ─────────────────────────────────────────────────────────────

export interface RefineryPlanEntry {
  quantity: number;
  unit: RefineryInputUnit;
}

/** Количество продукта в штуках: ящики × размер ящика или поштучный ввод. */
export function unitsFor(recipe: RefineryRecipe, entry: RefineryPlanEntry): number {
  return entry.unit === "crate" && recipe.crateSize > 1 ? entry.quantity * recipe.crateSize : entry.quantity;
}

/** Сырьё на заданное количество продукта. */
export function rawFor(recipe: RefineryRecipe, units: number): number {
  return units * recipe.inputPerUnit;
}

/** Время переработки заданного количества продукта одним рецептом, сек. */
export function secondsFor(recipe: RefineryRecipe, units: number): number {
  return units * recipe.secondsPerUnit;
}

/** Пересчёт количества при смене единиц ввода, чтобы объём продукта не терялся. */
export function convertQuantity(recipe: RefineryRecipe, entry: RefineryPlanEntry, nextUnit: RefineryInputUnit): number {
  if (entry.unit === nextUnit || recipe.crateSize <= 1) return entry.quantity;
  return nextUnit === "unit" ? entry.quantity * recipe.crateSize : Math.max(1, Math.ceil(entry.quantity / recipe.crateSize));
}

export interface RefineryTotals {
  /** Итог по сырью: ключ → количество. */
  resources: Partial<Record<RefineryResourceKey, number>>;
  /** Ожидание до готовности всего заказа, сек. */
  seconds: number;
  /** Сколько ящиков продукции получится (только для продуктов, которые пакуются в ящики). */
  outputCrates: number;
}

export function calculateRefinery(rows: ReadonlyArray<{ recipe: RefineryRecipe; units: number }>): RefineryTotals {
  const resources: Partial<Record<RefineryResourceKey, number>> = {};
  let seconds = 0;
  let outputCrates = 0;
  for (const { recipe, units } of rows) {
    resources[recipe.input] = (resources[recipe.input] ?? 0) + rawFor(recipe, units);
    // Вики: «All refining recipes from all players are processed concurrently» — разные рецепты
    // идут параллельно, поэтому общее ожидание = самый долгий рецепт, а не сумма.
    seconds = Math.max(seconds, secondsFor(recipe, units));
    if (recipe.crateSize > 1) outputCrates += Math.ceil(units / recipe.crateSize);
  }
  return { resources, seconds, outputCrates };
}

/** «48с», «6м 40с», «1ч 05м». */
export function formatRefineryTime(totalSeconds: number): string {
  if (!totalSeconds) return "—";
  const seconds = Math.ceil(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours) return `${hours}ч ${String(minutes).padStart(2, "0")}м`;
  if (minutes) return `${minutes}м ${String(rest).padStart(2, "0")}с`;
  return `${rest}с`;
}
