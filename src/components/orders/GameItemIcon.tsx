"use client";

import { ITEM_CATALOG } from "@/lib/item-catalog";
import { getItemIconPath } from "@/lib/itemCodes";
import { useMemo, useState } from "react";

interface GameItemIconProps {
  name: string;
  size?: number;
  className?: string;
}

/** Игровая иконка предмета. Системные иконки интерфейса сюда не попадают. */
function lookupKey(value: string): string {
  return value
    .replace(/\s*\((?:ящик|ящ|штука|шт|crate|crates?)\)\s*$/iu, "")
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^a-z0-9а-я]+/giu, "")
    .trim();
}

export function GameItemIcon({ name, size = 32, className = "" }: GameItemIconProps) {
  const src = useMemo(() => {
    const direct = getItemIconPath(name);
    if (direct) return direct;

    const key = lookupKey(name);
    const catalogItem = ITEM_CATALOG.find((item) => {
      return [item.name, item.en, item.code].filter(Boolean).some((value) => lookupKey(value as string) === key);
    });

    return catalogItem?.code ? getItemIconPath(catalogItem.code) : null;
  }, [name]);
  const [failed, setFailed] = useState(false);
  const frameClass = `inline-flex shrink-0 items-center justify-center overflow-hidden rounded border border-emerald-900/20 bg-neutral-900 ${className}`;

  if (!src || failed) {
    return <span className={frameClass} style={{ width: size, height: size }} aria-label={`Нет игровой иконки: ${name}`} />;
  }

  return (
    <span className={frameClass} style={{ width: size, height: size }}>
      {/* Native img allows the onError fallback for optional user-provided Wiki assets. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Иконка предмета: ${name}`}
        width={size}
        height={size}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
