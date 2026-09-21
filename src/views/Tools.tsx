import { ArrowUpRight, Boxes, Clock3, ExternalLink, Factory, Layers, Minus, PackageOpen, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, HudLabel, Panel, PanelTitle } from "../components/ui";
import { FACTORY_RECIPES, TOOL_LINKS, type Recipe } from "../lib/data";
import { cx, formatCountdown } from "../lib/format";

interface CalcLine {
  recipe: Recipe;
  crates: number;
}

const COST_META = [
  { key: "bmat" as const, label: "BMAT", color: "#a3e635" },
  { key: "rmat" as const, label: "RMAT", color: "#93c5fd" },
  { key: "emat" as const, label: "EMAT", color: "#f59e0b" },
  { key: "hemat" as const, label: "HEMAT", color: "#f87171" },
];

export function ToolsView() {
  const [group, setGroup] = useState<Recipe["group"] | "Все">("Все");
  const [lines, setLines] = useState<CalcLine[]>([]);
  const [query, setQuery] = useState("");

  const groups = useMemo(() => ["Все", ...Array.from(new Set(FACTORY_RECIPES.map((r) => r.group)))] as const, []);

  const recipes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FACTORY_RECIPES.filter(
      (r) =>
        (group === "Все" || r.group === group) &&
        (!q || r.ru.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)),
    );
  }, [group, query]);

  const totals = useMemo(() => {
    let bmat = 0,
      rmat = 0,
      emat = 0,
      hemat = 0,
      sec = 0,
      crates = 0;
    for (const l of lines) {
      bmat += l.recipe.bmat * l.crates;
      rmat += l.recipe.rmat * l.crates;
      emat += l.recipe.emat * l.crates;
      hemat += l.recipe.hemat * l.crates;
      sec += l.recipe.secPerCrate * l.crates;
      crates += l.crates;
    }
    return { bmat, rmat, emat, hemat, sec, crates };
  }, [lines]);

  const add = (r: Recipe) => {
    setLines((ls) => {
      const i = ls.findIndex((x) => x.recipe.id === r.id);
      return i >= 0 ? ls.map((x, j) => (j === i ? { ...x, crates: x.crates + 1 } : x)) : [...ls, { recipe: r, crates: 1 }];
    });
  };

  const bump = (id: string, d: number) =>
    setLines((ls) =>
      ls.map((x) => (x.recipe.id === id ? { ...x, crates: Math.max(0, x.crates + d) } : x)).filter((x) => x.crates > 0),
    );

  const fmtTime = (sec: number) => {
    if (sec < 3600) return formatCountdown(sec);
    return formatCountdown(sec).replace(/^(\d+)д /, "$1 Д ");
  };

  return (
    <div className="tab-fade flex flex-col gap-3">
      <Panel className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-accent/50 bg-accent/10 text-accent">
              <Factory size={15} />
            </span>
            <div>
              <PanelTitle>Factory Calculator</PanelTitle>
              <HudLabel className="mt-1 text-white/35">ВНУТРЕННИЙ МОДУЛЬ · OFFLINE READY</HudLabel>
            </div>
          </div>
          <HudLabel className="ml-auto hidden max-w-sm text-white/35 md:block">
            ПЛАНИРОВАНИЕ ПРОИЗВОДСТВА FACTORY / MPF: ЯЩИКИ, МАТЕРИАЛЫ, ВРЕМЯ ОЧЕРЕДИ
          </HudLabel>
        </div>
      </Panel>

      <div className="grid gap-3 xl:grid-cols-2">
        {/* ═══ РЕЦЕПТЫ ═══ */}
        <Panel className="flex min-h-[440px] flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line-2)] px-4 py-3">
            <PackageOpen size={15} className="text-accent" />
            <PanelTitle>Производственные линии</PanelTitle>
            <input
              className="field ml-auto h-8 max-w-44 text-[0.72rem]"
              placeholder="Поиск рецепта..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5 border-b border-[var(--line)] px-3 py-2.5">
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g as Recipe["group"] | "Все")}
                className={cx(
                  "hud-label rounded-sm border px-2 py-1 transition",
                  group === g ? "border-accent bg-accent/10 text-accent" : "border-[var(--line-2)] text-white/45 hover:text-white",
                )}
              >
                {g}
              </button>
            ))}
          </div>
          <ul className="scroll-area max-h-[420px] min-h-0 flex-1 overflow-y-auto p-3">
            {recipes.map((r) => (
              <li
                key={r.id}
                className="mb-1.5 flex items-center gap-3 rounded-sm border border-[var(--line)] bg-black/25 px-3 py-2 last:mb-0 hover:border-[var(--line-2)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.8rem] font-bold text-white/90">{r.ru}</div>
                  <div className="hud-label mt-1 flex flex-wrap gap-x-2 text-[0.55rem] text-white/35">
                    <span>ЯЩ = {r.crate} ШТ</span>
                    {COST_META.filter((c) => r[c.key] > 0).map((c) => (
                      <span key={c.key} style={{ color: c.color }}>
                        {c.label} {r[c.key]}
                      </span>
                    ))}
                    <span>{r.secPerCrate} С/ЯЩ</span>
                  </div>
                </div>
                <button className="btn h-8 w-8 shrink-0 !p-0" onClick={() => add(r)} title="Добавить в очередь">
                  <Plus size={14} />
                </button>
              </li>
            ))}
            {recipes.length === 0 && (
              <li className="console-log rounded-sm px-3 py-6 text-center text-[0.7rem]">Рецепты не найдены.</li>
            )}
          </ul>
        </Panel>

        {/* ═══ ОЧЕРЕДЬ ═══ */}
        <Panel className="flex min-h-[440px] flex-col">
          <div className="flex items-center gap-2 border-b border-[var(--line-2)] px-4 py-3">
            <Layers size={15} className="text-accent" />
            <PanelTitle>Производственная очередь</PanelTitle>
            <button
              className="btn btn-danger ml-auto h-8 !px-2"
              onClick={() => setLines([])}
              disabled={!lines.length}
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-4">
              <EmptyState
                icon={<Boxes size={32} />}
                title="Очередь пуста"
                hint="ДОБАВЬТЕ ПРОИЗВОДСТВЕННЫЕ ЛИНИИ СЛЕВА"
              />
            </div>
          ) : (
            <>
              <ul className="scroll-area max-h-[300px] min-h-0 flex-1 overflow-y-auto p-3">
                {lines.map((l) => (
                  <li
                    key={l.recipe.id}
                    className="mb-1.5 flex items-center gap-3 rounded-sm border border-[var(--line)] bg-black/25 px-3 py-2 last:mb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[0.8rem] font-bold text-white/90">{l.recipe.ru}</div>
                      <div className="hud-label mt-0.5 text-[0.55rem] text-white/35">
                        {l.crates} ЯЩ = {l.crates * l.recipe.crate} ШТ · {fmtTime(l.crates * l.recipe.secPerCrate)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="btn h-7 w-7 !p-0" onClick={() => bump(l.recipe.id, -1)}>
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center font-mono text-[0.85rem] font-bold text-accent tabular-nums">
                        {l.crates}
                      </span>
                      <button className="btn h-7 w-7 !p-0" onClick={() => bump(l.recipe.id, 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="panel-inner border-t p-3.5">
                <HudLabel className="text-white/45">ИТОГО ПО ОЧЕРЕДИ · {totals.crates} ЯЩ</HudLabel>
                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {COST_META.map((c) => (
                    <div key={c.key} className="rounded-sm border border-[var(--line-2)] bg-black/30 px-2.5 py-2">
                      <div className="hud-label text-[0.55rem]" style={{ color: c.color }}>
                        {c.label}
                      </div>
                      <div className="mt-1 font-mono text-[0.95rem] font-extrabold text-white tabular-nums">
                        {totals[c.key]}
                      </div>
                    </div>
                  ))}
                  <div className="rounded-sm border border-accent/40 bg-accent/5 px-2.5 py-2">
                    <div className="hud-label flex items-center gap-1 text-[0.55rem] text-accent">
                      <Clock3 size={9} /> ВРЕМЯ
                    </div>
                    <div className="mt-1 font-mono text-[0.95rem] font-extrabold text-accent tabular-nums">
                      {fmtTime(totals.sec)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Panel>
      </div>

      {/* ═══ ВНЕШНИЕ ИНСТРУМЕНТЫ ═══ */}
      <Panel className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <ExternalLink size={15} className="text-accent" />
          <PanelTitle>Внешние инструменты Foxhole</PanelTitle>
          <span className="badge-count ml-auto">{TOOL_LINKS.length} СЕРВ.</span>
        </div>
        <ul className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {TOOL_LINKS.map((t, i) => (
            <li key={t.url} className="rise-in" style={{ animationDelay: `${i * 40}ms` }}>
              <a
                href={t.url}
                target="_blank"
                rel="noreferrer noopener"
                className="panel-inner group flex h-full flex-col gap-2 rounded-sm px-3.5 py-3 transition hover:border-accent/50 hover:bg-accent/[0.04]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.82rem] font-extrabold tracking-wide text-white group-hover:text-accent">
                    {t.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="hud-label rounded-sm border border-[var(--line-2)] px-1.5 py-0.5 text-[0.5rem] text-white/40">
                      {t.tag}
                    </span>
                    <ArrowUpRight size={13} className="text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </span>
                </div>
                <p className="text-[0.74rem] leading-relaxed text-white/55">{t.desc}</p>
              </a>
            </li>
          ))}
        </ul>
        <HudLabel className="mt-3 text-white/30">
          СТОРОННИЕ СЕРВИСЫ ОТКРЫВАЮТСЯ В НОВОЙ ВКЛАДКЕ · ШТАБ НЕ ОТВЕЧАЕТ ЗА ИХ ДАННЫЕ
        </HudLabel>
      </Panel>
    </div>
  );
}
