"use client";

import { copyText } from "@/lib/exporters";
import { FACTORY_ITEMS, type FactoryFacility, type FactoryFaction, type FactoryItem } from "@/lib/factory-data";
import { getItemIconPath } from "@/lib/itemCodes";
import { useMemo, useState } from "react";
import { useNotify } from "../providers/NotificationProvider";
import { ResourceSummaryPanel } from "./ResourceSummaryPanel";
import { QuantityStepper, ToolItemIcon } from "./ToolControls";
import { buildToolReportText, type ToolReport } from "./tool-export";

const CATEGORY_LABELS: Record<string, string> = {
  small_arms: "Малое оружие",
  heavy_arms: "Тяжёлое оружие",
  heavy_ammunition: "Тяжёлые боеприпасы",
  utilities: "Снаряжение",
  resource: "Ресурсы",
  medical: "Медицина",
  uniforms: "Форма",
  vehicles: "Техника",
  shipables: "Сооружения",
  supplies: "Припасы",
};
const MATERIAL_LABELS: Record<string, string> = { bmat: "БМАТ", rmat: "РМАТ", emat: "ЭМАТ", hemat: "ТЯЖ. ЭМАТ" };
/** Иконки материалов для блока итогов (файлы из public/FoxholeWikiPhotos). */
const MATERIAL_ICONS: Record<string, string> = {
  bmat: "/FoxholeWikiPhotos/BasicMaterials.webp",
  rmat: "/FoxholeWikiPhotos/RefinedMaterials.webp",
  emat: "/FoxholeWikiPhotos/ExplosiveMaterial.webp",
  hemat: "/FoxholeWikiPhotos/HeavyExplosiveMaterials.webp",
};
const FACTIONS: Array<FactoryFaction | "all"> = ["all", "neutral", "colonial", "warden"];
const FACILITIES: Array<{ key: FactoryFacility; label: string }> = [
  { key: "factory", label: "FACTORY" },
  { key: "mpf", label: "MPF" },
];

/** Крупные иконки предметов (задача 5): плитки каталога и строки очереди. Было 48px / 38px. */
const CATALOG_ICON_SIZE = 88;
const QUEUE_ICON_SIZE = 56;

function iconFor(item: FactoryItem): string {
  // The downloaded factory icon is local; fallback resolves an existing FoxholeWiki icon.
  return `/factory-icons/${item.imgName}`;
}

function formatSeconds(value: number): string {
  if (!value) return "—";
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  return hours ? `${hours}ч ${String(minutes).padStart(2, "0")}м` : `${minutes}м`;
}

function discountSum(base: number, crates: number, facility: FactoryFacility): number {
  if (facility !== "mpf") return base * crates;
  let total = 0;
  for (let i = 1; i <= crates; i += 1) total += Math.floor(base * (1 - Math.min(0.5, i * 0.1)));
  return total;
}

/** Игровой лимит ящиков в очереди (режим PRODUCTION) — вынесен из старой функции add без изменения значений. */
function queueLimit(item: FactoryItem, facility: FactoryFacility): number {
  return facility === "factory" ? (item.itemCategory === "vehicles" || item.itemCategory === "shipables" ? 5 : 4) : 9;
}

/** Иконка предмета: локальная /factory-icons → иконка FoxholeWiki → буквенная заглушка (вместо битой картинки). */
function FactoryItemIcon({ item, size, className }: { item: FactoryItem; size: number; className?: string }) {
  return <ToolItemIcon sources={[iconFor(item), getItemIconPath(item.itemName)]} size={size} label={item.itemName} className={className} />;
}

interface FactoryWorkspaceProps {
  /**
   * Объект производства задаётся снаружи вкладками раздела «Инструменты» («Калькулятор фабрики» / «MPF»).
   * Если проп не передан, работает старый внутренний переключатель FACTORY / MPF.
   */
  facility?: FactoryFacility;
}

export function FactoryWorkspace({ facility: controlledFacility }: FactoryWorkspaceProps = {}) {
  const notify = useNotify();
  const [ownFacility, setOwnFacility] = useState<FactoryFacility>("factory");
  const facility = controlledFacility ?? ownFacility;
  const [planning, setPlanning] = useState(false);
  const [faction, setFaction] = useState<FactoryFaction | "all">("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState<Record<string, number>>({});

  const categories = useMemo(() => Array.from(new Set(FACTORY_ITEMS.map((item) => item.itemCategory))), []);
  const visibleItems = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ru-RU");
    return FACTORY_ITEMS.filter((item) => {
      const factionMatch = faction === "all" || item.faction.includes(faction);
      const facilityMatch = planning || item.craftLocation.includes(facility);
      const categoryMatch = category === "all" || item.itemCategory === category;
      const text = `${item.itemName} ${item.itemClass ?? ""} ${item.itemDesc ?? ""}`.toLocaleLowerCase("ru-RU");
      return factionMatch && facilityMatch && categoryMatch && (!needle || text.includes(needle));
    });
  }, [category, facility, faction, planning, query]);

  const rows = useMemo(() => Object.entries(plan).map(([name, crates]) => ({ item: FACTORY_ITEMS.find((entry) => entry.itemName === name), crates })).filter((row): row is { item: FactoryItem; crates: number } => Boolean(row.item && row.crates > 0)), [plan]);
  const totals = useMemo(() => {
    const materials: Record<string, number> = {};
    let crates = 0;
    let seconds = 0;
    for (const { item, crates: quantity } of rows) {
      crates += quantity;
      seconds += quantity * 60;
      for (const [key, value] of Object.entries(item.cost ?? {})) materials[key] = (materials[key] ?? 0) + discountSum(Number(value) || 0, quantity, facility);
    }
    return { materials, crates, seconds };
  }, [facility, rows]);

  // Единые данные для блока итогов и экспорта: название инструмента, выбранные предметы, ресурсы, сводка.
  const report = useMemo<ToolReport>(() => {
    const isFactory = facility === "factory";
    return {
      toolName: isFactory ? "Калькулятор фабрики" : "MPF — Mass Production Factory",
      subtitle: `${isFactory ? "Factory" : "Mass Production Factory"} • ${planning ? "PLANNING (без лимитов)" : "PRODUCTION (игровые лимиты)"}`,
      fileBase: isFactory ? "SINDARIS_фабрика" : "SINDARIS_MPF",
      items: rows.map(({ item, crates }) => ({ name: item.itemName, quantity: crates, unit: "ящ.", icon: getItemIconPath(item.itemName) })),
      resources: Object.entries(totals.materials).map(([key, value]) => ({ name: MATERIAL_LABELS[key] ?? key, quantity: Math.round(value), unit: "шт.", icon: MATERIAL_ICONS[key] ?? null })),
      stats: [
        { name: "Ящики", quantity: totals.crates, unit: "ящ." },
        { name: "Время", quantity: formatSeconds(totals.seconds), unit: "" },
      ],
    };
  }, [facility, planning, rows, totals]);

  function add(item: FactoryItem) {
    const current = plan[item.itemName] ?? 0;
    const limit = queueLimit(item, facility);
    if (!planning && current >= limit) {
      notify({ title: "ЛИМИТ ОЧЕРЕДИ", message: `${item.itemName}: максимум ${limit} ящиков в режиме Production. Переключитесь на Planning для свободного расчёта.`, tone: "warning" });
      return;
    }
    setPlan((previous) => ({ ...previous, [item.itemName]: current + 1 }));
  }

  /** Точное количество из поля ввода/кнопок степпера; в режиме Production режется до игрового лимита. */
  function setQuantity(item: FactoryItem, requested: number) {
    const limit = queueLimit(item, facility);
    let next = Math.max(0, Math.floor(requested));
    if (!planning && next > limit) {
      notify({ title: "ЛИМИТ ОЧЕРЕДИ", message: `${item.itemName}: максимум ${limit} ящиков в режиме Production. Переключитесь на Planning для свободного расчёта.`, tone: "warning" });
      next = limit;
    }
    setPlan((previous) => {
      const copy = { ...previous };
      if (next) copy[item.itemName] = next;
      else delete copy[item.itemName];
      return copy;
    });
  }

  async function copySummary() {
    const ok = await copyText(buildToolReportText(report));
    notify(
      ok
        ? { title: "FACTORY PLAN", message: "План производства скопирован в буфер.", tone: "success" }
        : { title: "БУФЕР", message: "Не удалось скопировать план.", tone: "warning" },
    );
  }

  return (
    // pb-24 на < lg: место под плавающий аккордеон итогов, чтобы он не закрывал последние карточки.
    <div className="tab-fade factory-page pb-24 lg:pb-0">
      <section className="panel panel-corners factory-topbar">
        <div className="flex min-w-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={facility === "factory" ? "/icons/business.png" : "/icons/conveyor-belt.png"} alt="" className="ui-icon h-10 w-10 object-contain" />
          <div className="min-w-0">
            <div className="hud-label text-muted">OFFLINE PRODUCTION PLANNER • FOXHOLE</div>
            <h2 className="panel-title mt-1 text-[1.1rem] md:text-[1.45rem]">⚙ {facility === "factory" ? "Калькулятор фабрики" : "MPF — Mass Production Factory"}</h2>
            <p className="mt-1 text-sm text-white/65">
              {facility === "factory"
                ? "Соберите производственную очередь и мгновенно рассчитайте ресурсы, ящики и ориентировочное время."
                : "Очередь MPF: каждый следующий ящик в партии дешевле на 10% (максимум −50%), лимит — 9 ящиков."}
            </p>
          </div>
        </div>
        <div className="factory-controls">
          {controlledFacility ? null : (
            <div className="factory-toggle-group">
              {FACILITIES.map((option) => <button key={option.key} className={`btn ${facility === option.key ? "btn-active" : ""}`} onClick={() => setOwnFacility(option.key)}>{option.label}</button>)}
            </div>
          )}
          <button className={`btn ${planning ? "btn-warn btn-active" : ""}`} onClick={() => setPlanning((value) => !value)}>{planning ? "PLANNING" : "PRODUCTION"}</button>
          <button className="btn btn-primary" onClick={() => void copySummary()}>⧉ Поделиться планом</button>
        </div>
      </section>

      <div className="grid min-h-0 flex-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
        <section className="panel panel-corners factory-catalog">
          <div className="factory-filters">
            <input className="field h-11 flex-1" placeholder="Поиск предмета, класса или описания..." value={query} onChange={(event) => setQuery(event.target.value)} />
            <select className="field h-11 w-full md:w-44" value={faction} onChange={(event) => setFaction(event.target.value as FactoryFaction | "all")}>
              {FACTIONS.map((value) => <option key={value} value={value}>{value === "all" ? "Все фракции" : value}</option>)}
            </select>
          </div>
          <div className="factory-categories scroll-area">
            <button className={`chip ${category === "all" ? "is-active" : ""}`} onClick={() => setCategory("all")}>Все</button>
            {categories.map((value) => <button key={value} className={`chip ${category === value ? "is-active" : ""}`} onClick={() => setCategory(value)}>{CATEGORY_LABELS[value] ?? value}</button>)}
          </div>
          <div className="factory-count hud-label">Показано: {visibleItems.length} / {FACTORY_ITEMS.length}</div>

          {/* Плитки с крупными иконками; auto-fill-сетка сама переносит карточки на узких экранах. */}
          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-2.5">
            {visibleItems.map((item) => {
              const queued = plan[item.itemName] ?? 0;
              return (
                <button
                  key={item.itemName}
                  type="button"
                  className={`factory-item-card relative min-h-[14rem] flex-col justify-start gap-2 p-3 text-center ${queued ? "border-accent" : ""}`}
                  onClick={() => add(item)}
                  title={item.itemDesc}
                >
                  <span className="factory-add absolute top-2 right-2">＋</span>
                  {queued ? (
                    <span className="absolute top-2 left-2 rounded-sm border border-[#16a34a] bg-[#1e291b] px-1.5 py-0.5 font-mono text-[0.65rem] text-accent">{queued} ящ.</span>
                  ) : null}
                  <FactoryItemIcon item={item} size={CATALOG_ICON_SIZE} className="mt-3" />
                  <strong className="line-clamp-2 min-h-[2.5em] w-full text-[0.82rem] leading-tight text-white">{item.itemName}</strong>
                  <small className="block w-full truncate text-[0.7rem] text-muted">{item.itemClass ?? CATEGORY_LABELS[item.itemCategory] ?? item.itemCategory} • x{item.numberProduced}</small>
                  <span className="mt-auto flex flex-wrap justify-center gap-1">
                    {Object.entries(item.cost ?? {}).map(([key, value]) => (
                      <span key={key} className="rounded-sm border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[0.62rem] text-white/80">
                        {MATERIAL_LABELS[key] ?? key} {value}
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <ResourceSummaryPanel report={report} title="Производственная очередь" emptyHint="Нажимайте ＋ на карточках, чтобы собрать очередь." onClear={() => setPlan({})}>
          {rows.map(({ item, crates }) => (
            <div className="factory-plan-row" key={item.itemName}>
              <FactoryItemIcon item={item} size={QUEUE_ICON_SIZE} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-white">{item.itemName}</span>
                <span className="hud-label mt-0.5 block truncate text-muted">{planning ? "без лимита" : `лимит ${queueLimit(item, facility)} ящ.`}</span>
              </span>
              <QuantityStepper value={crates} unit="ящ." label={item.itemName} onChange={(next) => setQuantity(item, next)} />
            </div>
          ))}
        </ResourceSummaryPanel>
      </div>
    </div>
  );
}
