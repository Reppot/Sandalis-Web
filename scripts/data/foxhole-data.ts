/**
 * Нормализованный датамайн-слой Foxhole.
 *
 * Файл генерируется scripts/import-foxhole-data.mjs из:
 * - data/catalog.json
 * - data/fs_vanilla.h5 (если внутри находится JSON-фрагмент)
 *
 * Пустой fallback намеренно оставлен валидным: приложение продолжает работать
 * даже до первого запуска импортёра.
 */
export interface FoxholeDataEntry {
  code: string;
  nameEn: string | null;
  nameRu: string;
  icon: string | null;
  origin: string | null;
  faction: string | null;
  category: string | null;
  quantityPerCrate: number | null;
  productionTime: number | null;
  weight: number | null;
  stackLimit: number | null;
  source: "catalog.json" | "fs_vanilla.h5" | "merged";
}

export const FOXHOLE_DATA: Readonly<Record<string, FoxholeDataEntry>> = {};

export const FOXHOLE_DATA_SOURCE = "fallback: run node scripts/import-foxhole-data.mjs after placing files in data/";
