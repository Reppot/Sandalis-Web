import {
  Clock3,
  Hourglass,
  MapPin,
  Package,
  Plus,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  TimerReset,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, HudLabel, Modal, Panel, PanelTitle } from "../components/ui";
import { DEFAULT_RESET_SECONDS, FOXHOLE_REGIONS } from "../lib/data";
import { cx, formatCountdown, formatDateTime, severityOf, useNow, type Severity } from "../lib/format";
import { useTerminal, type Stockpile } from "../lib/state";

const SEV_COLOR: Record<Severity, string> = {
  critical: "#ff5555",
  warning: "#f59e0b",
  safe: "#a3e635",
};

const SEV_LABEL: Record<Severity, string> = {
  critical: "КРИТИЧЕСКИ",
  warning: "ВНИМАНИЕ",
  safe: "СТАБИЛЬНО",
};

export function TimersView() {
  const { stockpiles } = useTerminal();
  const now = useNow(1000);
  const [query, setQuery] = useState("");
  const [managedId, setManagedId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  const risk = useMemo(() => {
    let critical = 0,
      warning = 0,
      safe = 0;
    for (const s of stockpiles) {
      const sev = severityOf((s.expiresAt - now) / 1000);
      if (sev === "critical") critical++;
      else if (sev === "warning") warning++;
      else safe++;
    }
    return { critical, warning, safe };
  }, [stockpiles, now]);

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...stockpiles]
      .filter((s) => !q || s.region.toLowerCase().includes(q) || s.location.toLowerCase().includes(q))
      .sort((a, b) => a.expiresAt - b.expiresAt);
  }, [stockpiles, query]);

  const managed = managedId === null ? null : stockpiles.find((s) => s.id === managedId) ?? null;

  return (
    <div className="tab-fade flex flex-col gap-3">
      {/* Телеметрия рисков */}
      <Panel className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-accent/50 bg-accent/10 text-accent">
              <Clock3 size={15} />
            </span>
            <PanelTitle>Матрица таймеров деспавна</PanelTitle>
          </div>
          <RiskStat icon={<ShieldAlert size={13} />} label="КРИТИЧЕСКИ (<1Ч)" value={risk.critical} color={SEV_COLOR.critical} />
          <RiskStat icon={<Hourglass size={13} />} label="ВНИМАНИЕ (<24Ч)" value={risk.warning} color={SEV_COLOR.warning} />
          <RiskStat icon={<ShieldCheck size={13} />} label="В БЕЗОПАСНОСТИ (>1Д)" value={risk.safe} color={SEV_COLOR.safe} />
          <div className="ml-auto flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <input
              className="field h-9 w-full text-[0.72rem] sm:w-44"
              placeholder="Поиск сектора..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary h-9" onClick={() => setAdding(true)}>
              <Plus size={14} /> Регистрация склада
            </button>
          </div>
        </div>
      </Panel>

      {/* Карточки */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={<Package size={34} />}
          title={stockpiles.length ? "По запросу ничего не найдено" : "Ни один склад не поставлен на мониторинг"}
          hint="ПРАВИЛО: СКЛАД ЖИВЁТ 48 ЧАСОВ БЕЗ ОБНОВЛЕНИЯ"
        />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {sorted.map((s, i) => (
            <StockpileCard key={s.id} stockpile={s} now={now} index={i} onManage={() => setManagedId(s.id)} />
          ))}
        </ul>
      )}

      <ManagerModal stockpile={managed} onClose={() => setManagedId(null)} />
      <AddModal open={adding} onClose={() => setAdding(false)} />
    </div>
  );
}

function RiskStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[0.7rem] font-bold tracking-wide" style={{ color }}>
      {icon}
      <span className="hud-label !text-[0.62rem]">{label}:</span>
      <span className="rounded-sm border px-1.5 py-0.5 tabular-nums" style={{ borderColor: color, background: "rgba(0,0,0,0.35)" }}>
        {value} БАЗ
      </span>
    </div>
  );
}

function StockpileCard({
  stockpile,
  now,
  index,
  onManage,
}: {
  stockpile: Stockpile;
  now: number;
  index: number;
  onManage: () => void;
}) {
  const left = Math.floor((stockpile.expiresAt - now) / 1000);
  const sev: Severity = left <= 0 ? "critical" : severityOf(left);
  const pct = Math.max(0, Math.min(100, (left / DEFAULT_RESET_SECONDS) * 100));
  const last = stockpile.history[stockpile.history.length - 1];
  const color = SEV_COLOR[sev];

  return (
    <li
      className={`timer-card rise-in sev-${sev}`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[0.92rem] font-bold text-white">
            <MapPin size={14} style={{ color }} className="shrink-0" />
            <span className="truncate tracking-wide uppercase">{stockpile.region}</span>
            <span className="opacity-40">▸</span>
            <span className="truncate text-white/80">{stockpile.location}</span>
          </div>
          <div className="progress-track mt-2.5 max-w-md">
            <div
              className="progress-bar"
              style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}` }}
            />
          </div>
          <div className="hud-label mt-2 truncate text-white/45" title={last?.message}>
            {last ? `${formatDateTime(last.at)} · ${last.message}` : "ЖУРНАЛ ПУСТ"}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="text-right">
            <HudLabel className="text-white/50">
              {left > 0 ? SEV_LABEL[sev] : "ТАЙМЕР ИСТЁК"}
            </HudLabel>
            <div className={cx("timer-value", left > 0 && sev === "critical" && "pulse")}>
              {left > 0 ? formatCountdown(left) : "00:00:00"}
            </div>
          </div>
          <button className="btn h-[38px] min-w-[118px]" onClick={onManage}>
            Управление
          </button>
        </div>
      </div>
    </li>
  );
}

// ─────────── МОДАЛ УПРАВЛЕНИЯ ───────────
function ManagerModal({ stockpile, onClose }: { stockpile: Stockpile | null; onClose: () => void }) {
  const { resetStockpile, setStockpileTime, removeStockpile } = useTerminal();
  const [hours, setHours] = useState("24");
  const now = useNow(1000);
  if (!stockpile) return null;

  const left = Math.floor((stockpile.expiresAt - now) / 1000);
  const sev = severityOf(left);

  return (
    <Modal open onClose={onClose} title={`Сектор: ${stockpile.region}`} width="max-w-xl">
      <div className="flex flex-col gap-4">
        <div className="panel-inner flex flex-wrap items-center justify-between gap-3 rounded-sm px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <MapPin size={15} style={{ color: SEV_COLOR[sev] }} />
            <div>
              <div className="text-[0.85rem] font-bold text-white">{stockpile.region}</div>
              <div className="hud-label text-white/40">{stockpile.location}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={cx("timer-value !text-[1.1rem]", left > 0 && sev === "critical" && "pulse")}>
              {left > 0 ? formatCountdown(left) : "00:00:00"}
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <button
            className="btn btn-primary h-11"
            onClick={() => {
              resetStockpile(stockpile.id);
              onClose();
            }}
          >
            <RotateCcw size={14} /> Сброс на 48:00
          </button>
          <div className="flex gap-1.5 sm:col-span-1">
            <input
              className="field h-11 text-center tabular-nums"
              type="number"
              min={0.1}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
            <button
              className="btn h-11 shrink-0"
              onClick={() => {
                const h = parseFloat(hours);
                if (Number.isFinite(h) && h > 0) setStockpileTime(stockpile.id, h);
                onClose();
              }}
            >
              <TimerReset size={14} /> Часы
            </button>
          </div>
          <button
            className="btn btn-danger h-11"
            onClick={() => {
              removeStockpile(stockpile.id);
              onClose();
            }}
          >
            <Trash2 size={14} /> Снять с мониторинга
          </button>
        </div>

        <div>
          <HudLabel className="mb-2 text-white/45">ЖУРНАЛ СЕКТОРА</HudLabel>
          <div className="console-log scroll-area max-h-48 overflow-y-auto rounded-sm px-3 py-2.5 text-[0.68rem] leading-[1.9]">
            {[...stockpile.history].reverse().map((h, i) => (
              <div key={i}>
                <span className="text-accent/60">{formatDateTime(h.at)}</span>
                <span className="mx-2 text-white/20">|</span>
                {h.message}
              </div>
            ))}
            {stockpile.history.length === 0 && <div>Записей нет.</div>}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─────────── МОДАЛ РЕГИСТРАЦИИ ───────────
function AddModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addStockpile } = useTerminal();
  const [region, setRegion] = useState<string>(FOXHOLE_REGIONS[0]);
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("48");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(hours);
    if (!location.trim() || !Number.isFinite(h) || h <= 0) return;
    addStockpile(region, location.trim(), h);
    setLocation("");
    setHours("48");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Регистрация склада" width="max-w-md">
      <form onSubmit={submit} className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5">
          <span className="hud-label text-accent/80">Регион</span>
          <select className="field" value={region} onChange={(e) => setRegion(e.target.value)}>
            {FOXHOLE_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="hud-label text-accent/80">Точка / позывной склада</span>
          <input
            className="field"
            placeholder="НАПР.: Склад снабжения «Восток»"
            value={location}
            maxLength={40}
            onChange={(e) => setLocation(e.target.value)}
            autoFocus
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="hud-label text-accent/80">Осталось до деспавна (часов)</span>
          <input
            className="field tabular-nums"
            type="number"
            min={0.1}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-primary h-11" disabled={!location.trim()}>
          <Plus size={15} /> Поставить на мониторинг
        </button>
      </form>
    </Modal>
  );
}
