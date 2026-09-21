import {
  Activity,
  BadgeCheck,
  Clock3,
  FileText,
  IdCard,
  KeyRound,
  Package,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { HudLabel, Panel, PanelTitle } from "../components/ui";
import { RANKS } from "../lib/data";
import { cx, formatCountdown, formatDateTime, useNow } from "../lib/format";
import { useTerminal } from "../lib/state";

export function CabinetView() {
  const { session, archive, stockpiles, activity, notify, logout, updateProfile } = useTerminal();
  const now = useNow(1000);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(session?.callsign ?? "");
  const [rank, setRank] = useState(session?.rank ?? RANKS[0]);

  const critical = useMemo(
    () => stockpiles.filter((s) => s.expiresAt - now <= 3600_000).length,
    [stockpiles, now],
  );
  const myRaports = archive.length;
  const totalUnits = archive.reduce((a, r) => a + r.totalUnits, 0);
  const shiftSec = Math.floor((now - (session?.startedAt ?? now)) / 1000);

  const saveProfile = () => {
    if (!session) return;
    const trimmed = name.trim().toUpperCase();
    if (!trimmed) return;
    updateProfile(trimmed, rank);
    setEditing(false);
    notify("ok", "Удостоверение обновлено");
  };

  const wipeAll = () => {
    if (!window.confirm("Стереть все локальные данные терминала (склады, архив, карту)?")) return;
    ["sindaris_stockpiles_v1", "sindaris_archive_v1", "sindaris_regions_v1", "sindaris_activity_v1", "sindaris-order-draft-v1"].forEach((k) =>
      localStorage.removeItem(k),
    );
    notify("warn", "Локальные данные стёрты — терминал перезагружается");
    window.setTimeout(() => window.location.reload(), 900);
  };

  if (!session) return null;

  return (
    <div className="tab-fade flex flex-col gap-3">
      {/* ═══ УДОСТОВЕРЕНИЕ ═══ */}
      <Panel className="p-4 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="relative shrink-0 self-center">
            <img
              src="/images/clan-logo.jpg"
              alt="Герб клана"
              className="crest-frame h-28 w-28 rounded-md object-cover"
              draggable={false}
            />
            <span className="absolute -right-2.5 -bottom-2.5 flex h-9 w-9 items-center justify-center rounded-md border border-accent/50 bg-[#0b100b] text-accent">
              <BadgeCheck size={17} />
            </span>
          </div>

          <div className="min-w-0 flex-1 text-center md:text-left">
            <HudLabel className="text-white/45">УДОСТОВЕРЕНИЕ ОПЕРАТОРА · КАНАЛ-07</HudLabel>
            {editing ? (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  className="field max-w-64"
                  value={name}
                  maxLength={18}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
                <select className="field max-w-64" value={rank} onChange={(e) => setRank(e.target.value)}>
                  {RANKS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={saveProfile}>
                  Сохранить
                </button>
                <button className="btn" onClick={() => setEditing(false)}>
                  Отмена
                </button>
              </div>
            ) : (
              <>
                <h1 className="title-brand mt-1 text-3xl text-white md:text-4xl">{session.callsign}</h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <span className="badge-count">{session.rank}</span>
                  <span className="badge-count !border-[var(--line-2)] !text-white/50">
                    СМЕНА: {formatCountdown(shiftSec)}
                  </span>
                  <span className="badge-count !border-[var(--line-2)] !text-white/50">
                    С {formatDateTime(session.startedAt)}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2 self-center">
            {!editing && (
              <button
                className="btn"
                onClick={() => {
                  setName(session.callsign);
                  setRank(session.rank);
                  setEditing(true);
                }}
              >
                <IdCard size={14} /> Редактировать
              </button>
            )}
            <button className="btn btn-danger" onClick={logout}>
              <KeyRound size={14} /> Завершить смену
            </button>
          </div>
        </div>

        <div className="stencil-line my-5" />

        {/* ═══ ТЕЛЕМЕТРИЯ ═══ */}
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          <Stat icon={<FileText size={15} />} label="РАПОРТОВ В АРХИВЕ" value={String(myRaports)} />
          <Stat icon={<Package size={15} />} label="СНАБЖЕНО ЕДИНИЦ" value={String(totalUnits)} />
          <Stat icon={<Clock3 size={15} />} label="СКЛАДОВ НА МОНИТОРИНГЕ" value={String(stockpiles.length)} />
          <Stat
            icon={<ShieldAlert size={15} />}
            label="НА ГРАНИ ДЕСПАВНА"
            value={String(critical)}
            tone={critical > 0 ? "danger" : "ok"}
          />
        </div>
      </Panel>

      <div className="grid gap-3 xl:grid-cols-[1.5fr_1fr]">
        {/* ═══ ЖУРНАЛ АКТИВНОСТИ ═══ */}
        <Panel className="flex min-h-[320px] flex-col p-4">
          <div className="flex items-center gap-2.5">
            <Activity size={15} className="text-accent" />
            <PanelTitle>Журнал терминала</PanelTitle>
            <span className="badge-count ml-auto">{activity.length} ЗАП.</span>
          </div>
          <div className="console-log scroll-area mt-3 min-h-0 flex-1 overflow-y-auto rounded-sm px-3.5 py-3 text-[0.7rem] leading-[2]">
            {activity.length === 0 && <div className="text-white/40">Журнал пуст — события появятся по мере работы.</div>}
            {[...activity].reverse().map((a, i) => (
              <div key={i}>
                <span className="text-accent/60">{formatDateTime(a.at)}</span>
                <span className="mx-2 text-white/15">|</span>
                <span className="text-white/80">{a.message}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* ═══ УСТАВ И ОПАСНАЯ ЗОНА ═══ */}
        <div className="flex flex-col gap-3">
          <Panel className="p-4">
            <PanelTitle>Устав дежурной смены</PanelTitle>
            <div className="console-log mt-3 rounded-sm px-3.5 py-3 text-[0.72rem] leading-[1.9]">
              <p>1. Проверяй таймеры секторов каждые 6 часов.</p>
              <p>2. Любой отъём снабжения — через рапорт штабу.</p>
              <p>3. Критический склад — приоритет над заказами.</p>
              <p>4. Экран терминала не покидать без блокировки.</p>
              <p>5. Сделай САНДАЛИС снова великим.</p>
            </div>
          </Panel>

          <Panel className="p-4 !border-[#ef4444]/40">
            <div className="flex items-center gap-2.5">
              <ShieldAlert size={15} className="text-[#ff6b6b]" />
              <PanelTitle className="!text-[#ff8080]">Опасная зона</PanelTitle>
            </div>
            <p className="mt-2.5 text-[0.76rem] leading-relaxed text-white/55">
              Полный сброс локальных данных: матрица складов, архив рапортов, карта сектора, черновик заказа.
            </p>
            <button className="btn btn-danger mt-3 w-full" onClick={wipeAll}>
              <Trash2 size={14} /> Стереть локальные данные
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "default" | "ok" | "danger";
}) {
  return (
    <div
      className={cx(
        "panel-inner rounded-sm px-3.5 py-3",
        tone === "danger" && "!border-[#ef4444]/50",
        tone === "ok" && "!border-accent/40",
      )}
    >
      <div className={cx("flex items-center gap-1.5", tone === "danger" ? "text-[#ff6b6b]" : "text-accent")}>
        {icon}
        <HudLabel className="!text-[0.55rem]">{label}</HudLabel>
      </div>
      <div
        className={cx(
          "mt-2 font-mono text-2xl font-extrabold tabular-nums",
          tone === "danger" ? "text-[#ff6b6b]" : "text-white",
        )}
      >
        {value}
      </div>
    </div>
  );
}
