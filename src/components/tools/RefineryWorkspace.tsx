"use client";

import { copyText } from "@/lib/exporters";
import { useMemo, useState } from "react";
import { useNotify } from "../providers/NotificationProvider";
import { ResourceSummaryPanel } from "./ResourceSummaryPanel";
import { QuantityStepper, ToolItemIcon } from "./ToolControls";
import {
  REFINERY_GROUP_LABELS,
  REFINERY_RECIPES,
  REFINERY_RESOURCE_ORDER,
  REFINERY_RESOURCES,
  calculateRefinery,
  convertQuantity,
  formatRefineryTime,
  rawFor,
  secondsFor,
  unitsFor,
  type RefineryGroup,
  type RefineryInputUnit,
  type RefineryPlanEntry,
  type RefineryRecipe,
} from "./refinery-data";
import { buildToolReportText, type ToolReport } from "./tool-export";

/** Крупные иконки (задача 5): плитки каталога и строки очереди — те же размеры, что в калькуляторе фабрики. */
const CATALOG_ICON_SIZE = 88;
const QUEUE_ICON_SIZE = 56;
const GROUPS = Object.keys(REFINERY_GROUP_LABELS) as RefineryGroup[];

const TOOL_NAME = "Калькулятор молотка (Refinery)";

function formatNumber(value: number): string {
  return value.toLocaleString("ru-RU");
}

function formatRate(seconds: number): string {
  return `${seconds.toLocaleString("ru-RU", { maximumFractionDigits: 3 })} с`;
}

/**
 * Калькулятор молотка (Refinery): выбираете продукт, вводите количество (ящики или штуки) —
 * калькулятор считает нужное сырьё, ящики продукции и время переработки.
 * Данные и формулы — в ./refinery-data.ts.
 */
export function RefineryWorkspace() {
  const notify = useNotify();
  const [group, setGroup] = useState<RefineryGroup | "all">("all");
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState<Record<string, RefineryPlanEntry>>({});

  const visibleRecipes = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ru-RU");
    return REFINERY_RECIPES.filter((recipe) => {
      const input = REFINERY_RESOURCES[recipe.input];
      const text = `${recipe.name} ${recipe.nameEn} ${recipe.short} ${input.name} ${input.nameEn}`.toLocaleLowerCase("ru-RU");
      return (group === "all" || recipe.group === group) && (!needle || text.includes(needle));
    });
  }, [group, query]);

  const rows = useMemo(
    () =>
      REFINERY_RECIPES.flatMap((recipe) => {
        const entry = plan[recipe.id];
        return entry && entry.quantity > 0 ? [{ recipe, entry, units: unitsFor(recipe, entry) }] : [];
      }),
    [plan],
  );
  const totals = useMemo(() => calculateRefinery(rows), [rows]);

  // Единые данные для блока итогов и экспорта (название инструмента, предметы, ресурсы, сводка).
  const report = useMemo<ToolReport>(
    () => ({
      toolName: TOOL_NAME,
      subtitle: "Refinery • сырьё → материалы • рецепты идут параллельно",
      fileBase: "SINDARIS_молоток",
      items: rows.map(({ recipe, entry, units }) => ({
        name: `${recipe.name} (${recipe.short})`,
        quantity: entry.quantity,
        unit: entry.unit === "crate" ? "ящ." : recipe.unitLabel,
        note: entry.unit === "crate" ? `= ${units} ${recipe.unitLabel}` : undefined,
        icon: recipe.icon,
      })),
      resources: REFINERY_RESOURCE_ORDER.flatMap((key) => {
        const amount = totals.resources[key];
        const resource = REFINERY_RESOURCES[key];
        return amount ? [{ name: resource.name, quantity: amount, unit: "шт.", icon: resource.icon }] : [];
      }),
      stats: [
        { name: "Время", quantity: formatRefineryTime(totals.seconds), unit: "" },
        { name: "Ящики продукции", quantity: totals.outputCrates, unit: "ящ." },
      ],
    }),
    [rows, totals],
  );

  function add(recipe: RefineryRecipe) {
    setPlan((previous) => {
      const current = previous[recipe.id];
      const next: RefineryPlanEntry = current
        ? { ...current, quantity: current.quantity + 1 }
        : { quantity: 1, unit: recipe.crateSize > 1 ? "crate" : "unit" };
      return { ...previous, [recipe.id]: next };
    });
  }

  function setQuantity(recipe: RefineryRecipe, requested: number) {
    const quantity = Math.max(0, Math.floor(requested));
    setPlan((previous) => {
      const current = previous[recipe.id];
      if (!current) return previous;
      const copy = { ...previous };
      if (quantity) copy[recipe.id] = { ...current, quantity };
      else delete copy[recipe.id];
      return copy;
    });
  }

  function setUnit(recipe: RefineryRecipe, unit: RefineryInputUnit) {
    setPlan((previous) => {
      const current = previous[recipe.id];
      if (!current || current.unit === unit) return previous;
      return { ...previous, [recipe.id]: { unit, quantity: convertQuantity(recipe, current, unit) } };
    });
  }

  async function copySummary() {
    const ok = await copyText(buildToolReportText(report));
    notify(
      ok
        ? { title: "REFINERY", message: "Расчёт переработки скопирован в буфер.", tone: "success" }
        : { title: "БУФЕР", message: "Не удалось скопировать расчёт.", tone: "warning" },
    );
  }

  return (
    // pb-24 на < lg: место под плавающий аккордеон итогов, чтобы он не закрывал последние карточки.
    <div className="tab-fade factory-page pb-24 lg:pb-0">
      <section className="panel panel-corners factory-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <ToolItemIcon sources={[REFINERY_RESOURCES.salvage.icon]} size={44} label="Refinery" />
          <div className="min-w-0">
            <div className="hud-label text-muted">OFFLINE REFINERY PLANNER • FOXHOLE</div>
            <h2 className="panel-title mt-1 text-[1.1rem] md:text-[1.45rem]">🔨 {TOOL_NAME}</h2>
            <p className="mt-1 text-sm text-white/65">Выберите продукты переработки и укажите количество — калькулятор посчитает сырьё, ящики и время работы Refinery.</p>
          </div>
        </div>
        <div className="factory-controls">
          <button type="button" className="btn btn-primary" onClick={() => void copySummary()}>⧉ Поделиться расчётом</button>
        </div>
      </section>

      <div className="grid min-h-0 flex-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
        <section className="panel panel-corners factory-catalog">
          <div className="factory-filters">
            <input className="field h-11 flex-1" placeholder="Поиск продукта или сырья..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="factory-categories scroll-area">
            <button type="button" className={`chip ${group === "all" ? "is-active" : ""}`} onClick={() => setGroup("all")}>Все</button>
            {GROUPS.map((value) => (
              <button type="button" key={value} className={`chip ${group === value ? "is-active" : ""}`} onClick={() => setGroup(value)}>
                {REFINERY_GROUP_LABELS[value]}
              </button>
            ))}
          </div>
          <div className="factory-count hud-label">Показано: {visibleRecipes.length} / {REFINERY_RECIPES.length} • данные: foxhole.wiki.gg (Update 1.66)</div>

          {/* Плитки с крупными иконками; auto-fill-сетка сама переносит карточки на узких экранах. */}
          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-2.5">
            {visibleRecipes.map((recipe) => {
              const input = REFINERY_RESOURCES[recipe.input];
              const queued = plan[recipe.id];
              return (
                <button
                  type="button"
                  key={recipe.id}
                  className={`factory-item-card relative min-h-[14.5rem] flex-col justify-start gap-2 p-3 text-center ${queued ? "border-accent" : ""}`}
                  onClick={() => add(recipe)}
                  title={`${recipe.nameEn}: ${recipe.inputPerUnit} × ${input.nameEn} → 1`}
                >
                  <span className="factory-add absolute top-2 right-2">＋</span>
                  {queued ? (
                    <span className="absolute top-2 left-2 rounded-sm border border-[#16a34a] bg-[#1e291b] px-1.5 py-0.5 font-mono text-[0.65rem] text-accent">
                      {queued.quantity} {queued.unit === "crate" ? "ящ." : recipe.unitLabel}
                    </span>
                  ) : null}
                  <ToolItemIcon sources={[recipe.icon]} size={CATALOG_ICON_SIZE} label={recipe.name} className="mt-3" />
                  <strong className="line-clamp-2 min-h-[2.5em] w-full text-[0.82rem] leading-tight text-white">{recipe.name}</strong>
                  <small className="hud-label text-accent">{recipe.short} • {REFINERY_GROUP_LABELS[recipe.group]}</small>
                  <span className="mt-auto flex items-center justify-center gap-1.5 rounded-sm border border-white/10 bg-black/30 px-2 py-1 font-mono text-[0.68rem] text-white/85">
                    <ToolItemIcon sources={[input.icon]} size={22} label={input.name} />
                    {recipe.inputPerUnit} × {input.name} → 1
                  </span>
                  <small className="text-[0.66rem] text-muted">
                    {formatRate(recipe.secondsPerUnit)} / {recipe.unitLabel} • {recipe.crateSize > 1 ? `ящик: ${recipe.crateSize}` : recipe.hint ?? "без ящиков"}
                  </small>
                </button>
              );
            })}
          </div>
        </section>

        <ResourceSummaryPanel report={report} title="Очередь переработки" emptyHint="Нажимайте ＋ на карточках, чтобы собрать заказ для Refinery." onClear={() => setPlan({})}>
          {rows.map(({ recipe, entry, units }) => {
            const input = REFINERY_RESOURCES[recipe.input];
            const overLimit = units > recipe.personalLimit;
            return (
              <div className="factory-plan-row flex-wrap" key={recipe.id}>
                <ToolItemIcon sources={[recipe.icon]} size={QUEUE_ICON_SIZE} label={recipe.name} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-white">{recipe.name}</span>
                  <span className="hud-label mt-0.5 block truncate text-muted">
                    = {formatNumber(units)} {recipe.unitLabel} • {formatNumber(rawFor(recipe, units))} {input.name} • {formatRefineryTime(secondsFor(recipe, units))}
                  </span>
                  {overLimit ? (
                    <span className="hud-label mt-0.5 block text-warn">
                      ⚠ Больше личного слота ({formatNumber(recipe.personalLimit)}); отряд — {formatNumber(recipe.personalLimit * 2)}
                    </span>
                  ) : null}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <QuantityStepper value={entry.quantity} unit={entry.unit === "crate" ? "ящ." : recipe.unitLabel} label={recipe.name} onChange={(next) => setQuantity(recipe, next)} />
                  {recipe.crateSize > 1 ? (
                    <div className="flex overflow-hidden rounded border border-white/10" role="group" aria-label={`Единицы ввода: ${recipe.name}`}>
                      <button type="button" className={`btn rounded-none border-0 px-1.5 py-1 text-[0.6rem] ${entry.unit === "crate" ? "btn-active" : ""}`} onClick={() => setUnit(recipe, "crate")} title={`Ящики по ${recipe.crateSize}`}>
                        ЯЩ
                      </button>
                      <button type="button" className={`btn rounded-none border-0 px-1.5 py-1 text-[0.6rem] ${entry.unit === "unit" ? "btn-active" : ""}`} onClick={() => setUnit(recipe, "unit")} title="Поштучно">
                        ШТ
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </ResourceSummaryPanel>
      </div>
    </div>
  );
}
