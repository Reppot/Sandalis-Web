"use client";

import { FACTORY_ITEMS, type FactoryFacility, type FactoryFaction, type FactoryItem } from "@/lib/factory-data";
import { getItemIconPath } from "@/lib/itemCodes";
import { useMemo, useState } from "react";
import { useNotify } from "../providers/NotificationProvider";

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
const FACTIONS: Array<FactoryFaction | "all"> = ["all", "neutral", "colonial", "warden"];
const FACILITIES: Array<{ key: FactoryFacility; label: string }> = [
  { key: "factory", label: "FACTORY" },
  { key: "mpf", label: "MPF" },
];

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

function FactoryItemIcon({ item }: { item: FactoryItem }) {
  const [failed, setFailed] = useState(false);
  const fallback = getItemIconPath(item.itemName);
  if (failed && fallback) {
    return <img src={fallback} alt="" className="factory-item-icon" loading="lazy" onError={() => setFailed(false)} />;
  }
  return (
    <img
      src={iconFor(item)}
      alt=""
      className="factory-item-icon"
      loading="lazy"
      onError={(event) => {
        if (fallback && event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
        else setFailed(true);
      }}
    />
  );
}

export function FactoryWorkspace() {
  const notify = useNotify();
  const [facility, setFacility] = useState<FactoryFacility>("factory");
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

  function add(item: FactoryItem) {
    const current = plan[item.itemName] ?? 0;
    const limit = facility === "factory" ? (item.itemCategory === "vehicles" || item.itemCategory === "shipables" ? 5 : 4) : 9;
    if (!planning && current >= limit) {
      notify({ title: "ЛИМИТ ОЧЕРЕДИ", message: `${item.itemName}: максимум ${limit} ящиков в режиме Production. Переключитесь на Planning для свободного расчёта.`, tone: "warning" });
      return;
    }
    setPlan((previous) => ({ ...previous, [item.itemName]: current + 1 }));
  }

  function change(itemName: string, delta: number) {
    setPlan((previous) => {
      const next = Math.max(0, (previous[itemName] ?? 0) + delta);
      const copy = { ...previous };
      if (next) copy[itemName] = next;
      else delete copy[itemName];
      return copy;
    });
  }

  async function copySummary() {
    const text = [
      `SINDARIS FACTORY PLAN • ${facility.toUpperCase()} • ${planning ? "PLANNING" : "PRODUCTION"}`,
      ...rows.map(({ item, crates }) => `${item.itemName} -> ${crates} ящ.`),
      "",
      `Материалы: ${Object.entries(totals.materials).map(([key, value]) => `${MATERIAL_LABELS[key] ?? key} ${Math.round(value)}`).join(" • ")}`,
      `Ящиков: ${totals.crates} • Время: ${formatSeconds(totals.seconds)}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      notify({ title: "FACTORY PLAN", message: "План производства скопирован в буфер.", tone: "success" });
    } catch {
      notify({ title: "БУФЕР", message: "Не удалось скопировать план.", tone: "warning" });
    }
  }

  return (
    <div className="tab-fade factory-page">
      <section className="panel panel-corners factory-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <img src="/icons/business.png" alt="" className="ui-icon h-10 w-10 object-contain" />
          <div className="min-w-0">
            <div className="hud-label text-muted">OFFLINE PRODUCTION PLANNER • FOXHOLE</div>
            <h1 className="panel-title mt-1 text-[1.1rem] md:text-[1.45rem]">⚙ Factory Calculator</h1>
            <p className="mt-1 text-sm text-white/65">Соберите производственную очередь и мгновенно рассчитайте ресурсы, ящики и ориентировочное время.</p>
          </div>
        </div>
        <div className="factory-controls">
          <div className="factory-toggle-group">
            {FACILITIES.map((option) => <button key={option.key} className={`btn ${facility === option.key ? "btn-active" : ""}`} onClick={() => setFacility(option.key)}>{option.label}</button>)}
          </div>
          <button className={`btn ${planning ? "btn-warn btn-active" : ""}`} onClick={() => setPlanning((value) => !value)}>{planning ? "PLANNING" : "PRODUCTION"}</button>
          <button className="btn btn-primary" onClick={() => void copySummary()}>⧉ Поделиться планом</button>
        </div>
      </section>

      <div className="factory-layout">
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
          <div className="factory-item-grid scroll-area">
            {visibleItems.map((item) => (
              <button key={item.itemName} className="factory-item-card" onClick={() => add(item)} title={item.itemDesc}>
                <FactoryItemIcon item={item} />
                <span className="min-w-0 flex-1 text-left">
                  <strong className="block truncate text-white">{item.itemName}</strong>
                  <small className="mt-1 block truncate text-muted">{item.itemClass ?? CATEGORY_LABELS[item.itemCategory] ?? item.itemCategory} • x{item.numberProduced}</small>
                </span>
                <span className="factory-add">＋</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="panel panel-corners factory-plan">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="panel-title">Производственная очередь</div>
              <div className="hud-label mt-1 text-muted">{facility === "factory" ? "Factory" : "Mass Production Factory"} • {planning ? "без лимитов" : "игровые лимиты"}</div>
            </div>
            <button className="btn btn-danger px-2" onClick={() => setPlan({})} disabled={!rows.length}>✕</button>
          </div>
          <div className="factory-rule" />
          <div className="factory-plan-list scroll-area">
            {rows.length === 0 ? <div className="hud-label py-10 text-center text-muted">Нажимайте ＋ на предметах слева, чтобы собрать очередь.</div> : rows.map(({ item, crates }) => (
              <div className="factory-plan-row" key={item.itemName}>
                <FactoryItemIcon item={item} />
                <span className="min-w-0 flex-1 truncate text-white">{item.itemName}</span>
                <button className="btn px-2 py-1" onClick={() => change(item.itemName, -1)}>−</button>
                <span className="factory-qty">{crates} ящ.</span>
                <button className="btn px-2 py-1" onClick={() => add(item)}>＋</button>
              </div>
            ))}
          </div>
          <div className="factory-totals">
            <div className="factory-total-grid">
              {Object.entries(totals.materials).map(([key, value]) => <div key={key}><span className="hud-label text-muted">{MATERIAL_LABELS[key] ?? key}</span><strong>{Math.round(value)}</strong></div>)}
              <div><span className="hud-label text-muted">ЯЩИКИ</span><strong>{totals.crates}</strong></div>
              <div><span className="hud-label text-muted">ВРЕМЯ</span><strong>{formatSeconds(totals.seconds)}</strong></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
