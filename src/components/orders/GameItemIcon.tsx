"use client";

import { ITEM_CATALOG, type ItemCategory } from "@/lib/item-catalog";
import { useMemo } from "react";

const CATEGORY_EMOJI: Record<ItemCategory, string> = {
  Оружие: "🔫",
  Боеприпасы: "🧨",
  Материалы: "🧱",
  Снаряжение: "🎒",
  Техника: "🚚",
  Сооружения: "🏗️",
  Прочее: "📦",
};

function normalize(value: string): string {
  return value.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").replace(/[^a-z0-9а-я]+/giu, "");
}

interface GameItemIconProps {
  name: string;
  size?: number;
  className?: string;
}

/** Значок предмета на основе категории каталога (эмодзи вместо внешних файлов иконок). */
export function GameItemIcon({ name, size = 32, className = "" }: GameItemIconProps) {
  const emoji = useMemo(() => {
    const key = normalize(name);
    const found = ITEM_CATALOG.find((item) => normalize(item.name) === key || normalize(item.en ?? "") === key);
    return CATEGORY_EMOJI[found?.category ?? "Прочее"];
  }, [name]);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded border border-emerald-900/30 bg-black/30 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      aria-hidden
      title={name}
    >
      {emoji}
    </span>
  );
}
