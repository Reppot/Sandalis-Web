"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
 * Общие элементы калькуляторов клана (Factory / MPF / Refinery).
 * ───────────────────────────────────────────────────────────── */

interface ToolItemIconProps {
  /** Кандидаты на картинку по приоритету. Пустые значения пропускаются, битые отбрасываются по onError. */
  sources: ReadonlyArray<string | null | undefined>;
  /** Сторона квадрата в px — крупные значения делают иконку легко читаемой (задача 5). */
  size: number;
  /** Название предмета: alt и буква-заглушка, если картинок нет. */
  label: string;
  className?: string;
}

/**
 * Крупная игровая иконка предмета (аналог GameItemIcon/FactoryItemIcon).
 * Перебирает источники по очереди; если ни один не загрузился — рисует заглушку с первой буквой
 * вместо «битой» картинки. Размер задаётся inline-стилем, поэтому не зависит от CSS-классов сетки.
 */
export function ToolItemIcon({ sources, size, label, className = "" }: ToolItemIconProps) {
  const [failed, setFailed] = useState<string[]>([]);
  const src = sources.find((candidate): candidate is string => typeof candidate === "string" && candidate.length > 0 && !failed.includes(candidate));
  const frameClass = `inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-[rgba(163,230,53,0.18)] bg-[#0b100c] ${className}`;

  if (!src) {
    return (
      <span className={`${frameClass} font-display text-accent/60`} style={{ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.38)) }} aria-label={`Нет игровой иконки: ${label}`}>
        {label.replace(/[^a-z0-9а-яё]+/giu, "").charAt(0).toUpperCase() || "?"}
      </span>
    );
  }

  return (
    <span className={frameClass} style={{ width: size, height: size, padding: Math.max(2, Math.round(size * 0.06)) }}>
      {/* Нативный img нужен для цепочки onError-фолбэков (как в GameItemIcon). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={src}
        src={src}
        alt={`Иконка предмета: ${label}`}
        width={size}
        height={size}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={() => setFailed((previous) => (previous.includes(src) ? previous : [...previous, src]))}
      />
    </span>
  );
}

interface QuantityStepperProps {
  value: number;
  /** Получает запрошенное целое число ≥ 0. Лимиты и уведомления проверяет родитель; 0 = удалить строку. */
  onChange: (next: number) => void;
  /** Подпись единицы рядом с числом: «ящ.», «шт.», «кан.». */
  unit?: string;
  /** Название позиции для aria-подписей. */
  label: string;
}

/** «− [количество] ＋» с ручным вводом числа. Пустое поле во время набора не удаляет строку сразу. */
export function QuantityStepper({ value, onChange, unit, label }: QuantityStepperProps) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button type="button" className="btn px-2 py-1" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`Уменьшить: ${label}`}>
        −
      </button>
      <label className="factory-qty flex min-w-[78px] items-center justify-center gap-1">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={`Количество: ${label}`}
          className="w-12 min-w-0 bg-transparent text-center text-[0.8rem] font-bold text-white outline-none"
          value={draft ?? String(value)}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => {
            const raw = event.target.value.replace(/\D/g, "").slice(0, 6);
            if (!raw) {
              setDraft("");
              return;
            }
            setDraft(null);
            onChange(Number(raw));
          }}
          onBlur={() => {
            if (draft === "") {
              setDraft(null);
              onChange(0);
            }
          }}
        />
        {unit ? <span className="shrink-0">{unit}</span> : null}
      </label>
      <button type="button" className="btn px-2 py-1" onClick={() => onChange(value + 1)} aria-label={`Увеличить: ${label}`}>
        ＋
      </button>
    </div>
  );
}
