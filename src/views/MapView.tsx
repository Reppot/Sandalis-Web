import { ClipboardList, Map as MapIcon, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { HudLabel, Panel, PanelTitle } from "../components/ui";
import { REGION_LAYOUT, type Faction } from "../lib/data";
import { copyToClipboard, cx } from "../lib/format";
import { useTerminal } from "../lib/state";

const FACTION_META: Record<Faction, { label: string; color: string; fill: string; stroke: string }> = {
  warden: { label: "ВАРДЕНЫ", color: "#93c5fd", fill: "rgba(59, 130, 246, 0.32)", stroke: "#3b82f6" },
  colonial: { label: "КОЛОНИСТЫ", color: "#a3e635", fill: "rgba(163, 230, 53, 0.26)", stroke: "#84cc16" },
  contested: { label: "СПОРНЫЙ", color: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)", stroke: "#f59e0b" },
};

const HEX_R = 34;
const COLS = 6;

export function MapView() {
  const { regions, cycleRegion, resetRegions, notify } = useTerminal();
  const [filter, setFilter] = useState<Faction | "all">("all");
  const [last, setLast] = useState<string | null>(null);

  const stats = useMemo(() => {
    let w = 0,
      c = 0,
      k = 0;
    for (const r of REGION_LAYOUT) {
      const f = regions[r.name] ?? "contested";
      if (f === "warden") w++;
      else if (f === "colonial") c++;
      else k++;
    }
    return { warden: w, colonial: c, contested: k };
  }, [regions]);

  const reset = () => {
    resetRegions();
  };

  const width = COLS * HEX_R * 1.78 + HEX_R;
  const height = 4 * HEX_R * 1.78 + HEX_R * 2;

  return (
    <div className="tab-fade flex flex-col gap-3">
      <Panel className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-accent/50 bg-accent/10 text-accent">
              <MapIcon size={15} />
            </span>
            <PanelTitle>Карта сектора Sandalis</PanelTitle>
          </div>
          {(Object.keys(FACTION_META) as Faction[]).map((f) => (
            <span key={f} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rotate-45" style={{ background: FACTION_META[f].stroke }} />
              <span className="hud-label" style={{ color: FACTION_META[f].color }}>
                {FACTION_META[f].label}: {stats[f]}
              </span>
            </span>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button
              className="btn h-8"
              onClick={async () => {
                const lines = REGION_LAYOUT.map(
                  (r) => `${r.name}: ${FACTION_META[regions[r.name] ?? "contested"].label}`,
                );
                const ok = await copyToClipboard(`=== СВОДКА СЕКТОРА SANDALIS ===\n${lines.join("\n")}`);
                notify(ok ? "ok" : "err", ok ? "Сводка скопирована в буфер" : "Не удалось скопировать");
              }}
            >
              <ClipboardList size={13} /> Сводка
            </button>
            <button className="btn btn-danger h-8" onClick={reset}>
              <RefreshCw size={13} /> Сброс
            </button>
          </div>
        </div>
        <HudLabel className="mt-2.5 text-white/35">
          КЛИК ПО ГЕКСУ МЕНЯЕТ КОНТРОЛЬ: ВАРДЕНЫ → СПОРНЫЙ → КОЛОНИСТЫ · ДАННЫЕ ХРАНЯТСЯ ЛОКАЛЬНО
        </HudLabel>
      </Panel>

      <div className="grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <Panel className="overflow-hidden">
          <div className="relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="block w-full">
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="rgba(163,230,53,0.08)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect width={width} height={height} fill="url(#mapGlow)" />
              {REGION_LAYOUT.map((r) => {
                const faction = regions[r.name] ?? "contested";
                const meta = FACTION_META[faction];
                const hx = HEX_R + r.x * HEX_R * 1.78 + ((r.y % 2) * HEX_R * 0.89);
                const hy = HEX_R + r.y * HEX_R * 1.52;
                const points = Array.from({ length: 6 }, (_, k) => {
                  const a = (Math.PI / 3) * k + Math.PI / 6;
                  return `${(hx + HEX_R * 0.94 * Math.cos(a)).toFixed(1)},${(hy + HEX_R * 0.94 * Math.sin(a)).toFixed(1)}`;
                }).join(" ");
                const dim = filter !== "all" && filter !== faction;
                const isLast = last === r.name;
                return (
                  <g
                    key={r.name}
                    className="cursor-pointer transition-opacity duration-200"
                    opacity={dim ? 0.22 : 1}
                    onClick={() => {
                      cycleRegion(r.name);
                      setLast(r.name);
                    }}
                  >
                    {isLast && (
                      <polygon
                        points={points}
                        fill="none"
                        stroke={meta.color}
                        strokeWidth="5"
                        opacity="0.35"
                        className="pulse"
                      />
                    )}
                    <polygon
                      points={points}
                      fill={meta.fill}
                      stroke={meta.stroke}
                      strokeWidth="1.6"
                      style={{ filter: `drop-shadow(0 0 6px ${meta.fill})` }}
                    />
                    <text
                      x={hx}
                      y={hy - 2}
                      textAnchor="middle"
                      fill={meta.color}
                      fontSize="8.6"
                      fontWeight="800"
                      fontFamily="JetBrains Mono, monospace"
                      style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}
                    >
                      {r.name.length > 14 ? r.name.slice(0, 13) + "…" : r.name.toUpperCase()}
                    </text>
                    <text
                      x={hx}
                      y={hy + 9}
                      textAnchor="middle"
                      fill={meta.color}
                      opacity="0.7"
                      fontSize="6.6"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {meta.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Panel>

        <div className="flex flex-col gap-3">
          <Panel className="p-3">
            <PanelTitle className="!text-[0.7rem]">Фильтр отображения</PanelTitle>
            <div className="mt-2.5 grid grid-cols-4 gap-1.5">
              {([["all", "ВСЕ"], ["warden", "ВАРДЕНЫ"], ["contested", "СПОРНЫЕ"], ["colonial", "КОЛОНИСТЫ"]] as const).map(
                ([f, label]) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cx(
                      "hud-label rounded-sm border px-1 py-2 text-center transition",
                      filter === f
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-[var(--line-2)] text-white/40 hover:text-white",
                    )}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </Panel>

          <Panel className="flex-1 p-3">
            <div className="flex items-center justify-between">
              <PanelTitle className="!text-[0.7rem]">Протокол линии фронта</PanelTitle>
              <span className="badge-count">{REGION_LAYOUT.length} СЕКТ.</span>
            </div>
            <ul className="scroll-area mt-2.5 max-h-[360px] space-y-1 overflow-y-auto pr-1">
              {REGION_LAYOUT.map((r) => {
                const f = regions[r.name] ?? "contested";
                const meta = FACTION_META[f];
                return (
                  <li key={r.name}>
                    <button
                      className="flex w-full items-center gap-2.5 rounded-sm border border-[var(--line)] bg-black/25 px-2.5 py-2 text-left transition hover:border-[var(--line-2)]"
                      onClick={() => {
                        cycleRegion(r.name);
                        setLast(r.name);
                      }}
                    >
                      <span className="h-2 w-2 rotate-45" style={{ background: meta.stroke }} />
                      <span className="min-w-0 flex-1 truncate text-[0.76rem] font-semibold text-white/85">{r.name}</span>
                      <span className="hud-label shrink-0" style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

