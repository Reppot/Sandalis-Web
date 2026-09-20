"use client";

import { backgroundAsset, FOXHOLE_REGIONS, iconPath } from "@/lib/constants";
import { formatCountdown, secondsLeft, severityOf } from "@/lib/time";
import type { StockpileDTO } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { useNotify } from "../providers/NotificationProvider";
import { useClock, useTerminal } from "../providers/TerminalProvider";
import { Modal } from "../ui/Modal";

const SEV_COLOR = { critical: "#ff5555", warning: "#ff9900", safe: "#a3e635" } as const;

function TimeInputs({ days, hours, minutes, onChange }: { days: string; hours: string; minutes: string; onChange: (k: "days" | "hours" | "minutes", v: string) => void }) {
  const clean = (v: string) => v.replace(/[^\d]/g, "").slice(0, 4);
  return (
    <div className="panel-inner flex flex-wrap items-center justify-center gap-3 rounded px-3 py-3">
      {(
        [
          ["ДНИ", "days", days],
          ["ЧАСЫ", "hours", hours],
          ["МИНУТЫ", "minutes", minutes],
        ] as const
      ).map(([label, key, value]) => (
        <label key={key} className="flex items-center gap-2">
          <span className="hud-label text-white/80">{label}:</span>
          <input className="field field-mono w-[62px] text-center" placeholder="0" inputMode="numeric" value={value} onChange={(e) => onChange(key, clean(e.target.value))} />
        </label>
      ))}
    </div>
  );
}

export function StockpileManagerModal({ stockpile, onClose }: { stockpile: StockpileDTO | null; onClose: () => void }) {
  const { patchStockpile, deleteStockpile, stockpiles } = useTerminal();
  const notify = useNotify();
  const now = useClock();
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // актуальная версия из контекста (после PATCH история обновляется)
  const live = stockpile ? (stockpiles.find((s) => s.id === stockpile.id) ?? stockpile) : null;

  useEffect(() => {
    if (!stockpile) return;
    setDays("");
    setHours("");
    setMinutes("");
    setNote("");
    setConfirmDelete(false);
  }, [stockpile]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [live?.history.length]);

  if (!live) return null;
  const ts = secondsLeft(live.expiresAt, now);
  const sev = severityOf(ts);

  const run = async (fn: () => Promise<unknown>, okMsg: string) => {
    setBusy(true);
    try {
      await fn();
      notify({ title: "КАНАЛ СВЯЗИ", message: okMsg, tone: "success" });
    } catch (e) {
      notify({ title: "СБОЙ", message: (e as Error).message, tone: "danger" });
    } finally {
      setBusy(false);
    }
  };

  const apply = () => {
    const d = days.trim() || "0";
    const h = hours.trim() || "0";
    const m = minutes.trim() || "0";
    if (![d, h, m].every((v) => /^\d+$/.test(v))) {
      notify({ title: "СБОЙ СИНТАКСИСА", message: "Заполняйте поля только числовыми значениями!", tone: "danger" });
      return;
    }
    const total = Number(d) * 86400 + Number(h) * 3600 + Number(m) * 60;
    if (total <= 0) {
      notify({ title: "СБОЙ", message: "Итоговое время должно быть больше 0 секунд!", tone: "danger" });
      return;
    }
    void run(async () => {
      await patchStockpile(live.id, { action: "set", days: Number(d), hours: Number(h), minutes: Number(m) });
      setDays("");
      setHours("");
      setMinutes("");
    }, `Установлено новое время удержания: ${d}д ${h}ч ${m}м.`);
  };

  return (
    <Modal open={!!stockpile} onClose={onClose} title={`🛠️ Канал связи: ${live.location}`} icon={iconPath("24-hour-clock")} widthClass="max-w-2xl" backdropImage={backgroundAsset("timers").src}>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="space-y-1 text-[0.85rem]">
          <div>🗺️ Регион: <span className="text-accent">{live.region}</span></div>
          <div>📍 Локация: <span className="text-accent">{live.location}</span></div>
        </div>
        <div className="panel-inner rounded px-4 py-2 text-center">
          <div className="hud-label text-muted">Осталось</div>
          <div className="timer-value" style={{ color: SEV_COLOR[sev], textShadow: `0 0 14px ${SEV_COLOR[sev]}66` }}>{ts > 0 ? formatCountdown(ts) : "ИСТЁК"}</div>
        </div>
      </div>

      <div className="hud-label mt-4 text-white/80">📜 История обновлений и логов склада:</div>
      <div ref={logRef} className="console-log scroll-area mt-1 h-44 rounded px-3 py-2 leading-relaxed">
        {live.history.length === 0 ? <div className="opacity-60">[СИСТЕМА]: Записей нет.</div> : live.history.map((h) => <div key={h.id}>{h.message}</div>)}
      </div>

      <div className="mt-3 flex gap-2">
        <input className="field field-mono flex-1 text-xs" placeholder="Заметка интенданта в журнал..." value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && note.trim() && void run(async () => { await patchStockpile(live.id, { action: "note", note }); setNote(""); }, "Запись добавлена в журнал.")} />
        <button className="btn" disabled={busy || !note.trim()} onClick={() => void run(async () => { await patchStockpile(live.id, { action: "note", note }); setNote(""); }, "Запись добавлена в журнал.")}>
          📝 В журнал
        </button>
      </div>

      <div className="mt-4">
        <TimeInputs days={days} hours={hours} minutes={minutes} onChange={(k, v) => (k === "days" ? setDays(v) : k === "hours" ? setHours(v) : setMinutes(v))} />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button className="btn" style={{ background: "#1e291b", color: "#a3e635", borderColor: "#16a34a" }} disabled={busy} onClick={() => void run(() => patchStockpile(live.id, { action: "reset48" }), "Интендант выполнил быстрый сброс таймера на базовые 48 часов.")}>
          ♻️ Сбросить на 48 часов
        </button>
        <button className="btn btn-primary" disabled={busy} onClick={apply}>
          ✅ Задать таймер
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
        <span className="hud-label text-muted">ID склада: {live.id}</span>
        <button
          className={`btn btn-danger ${confirmDelete ? "btn-active" : ""}`}
          disabled={busy}
          onClick={() => {
            if (!confirmDelete) {
              setConfirmDelete(true);
              window.setTimeout(() => setConfirmDelete(false), 3500);
              return;
            }
            void run(async () => {
              await deleteStockpile(live.id);
              onClose();
            }, `Склад «${live.location}» снят с мониторинга.`);
          }}
        >
          {confirmDelete ? "⚠️ Подтвердить снятие" : "🗑 Снять с мониторинга"}
        </button>
      </div>
    </Modal>
  );
}

export function AddStockpileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { createStockpile } = useTerminal();
  const notify = useNotify();
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");
  const [days, setDays] = useState("2");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setRegion("");
      setLocation("");
      setDays("2");
      setHours("0");
      setMinutes("0");
    }
  }, [open]);

  const submit = async () => {
    const seconds = Number(days || 0) * 86400 + Number(hours || 0) * 3600 + Number(minutes || 0) * 60;
    if (!region.trim() || !location.trim()) {
      notify({ title: "РЕГИСТРАЦИЯ", message: "Укажите регион (гекс) и локацию склада.", tone: "warning" });
      return;
    }
    if (seconds <= 0) {
      notify({ title: "РЕГИСТРАЦИЯ", message: "Время удержания должно быть больше 0.", tone: "warning" });
      return;
    }
    setBusy(true);
    try {
      await createStockpile({ region: region.trim(), location: location.trim(), seconds });
      notify({ title: "СКЛАД ЗАРЕГИСТРИРОВАН", message: `${region} ▶ ${location} поставлен на мониторинг.`, tone: "success" });
      onClose();
    } catch (e) {
      notify({ title: "СБОЙ", message: (e as Error).message, tone: "danger" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Регистрация склада в матрице секторов" icon={iconPath("barracks")} widthClass="max-w-lg" backdropImage={backgroundAsset("storage").src}>
      <div className="grid gap-3">
        <label className="flex flex-col gap-1">
          <span className="hud-label text-muted">Регион / гекс</span>
          <input className="field" list="foxhole-regions" placeholder="Clanshead Valley" value={region} onChange={(e) => setRegion(e.target.value)} autoFocus />
          <datalist id="foxhole-regions">
            {FOXHOLE_REGIONS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </label>
        <label className="flex flex-col gap-1">
          <span className="hud-label text-muted">Локация / тип склада</span>
          <input className="field" placeholder="Порт, Склад снабжения, Бункерная база..." value={location} onChange={(e) => setLocation(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void submit()} />
        </label>
        <div>
          <div className="hud-label mb-1 text-muted">Стартовое удержание (по умолчанию 48 ч)</div>
          <TimeInputs days={days} hours={hours} minutes={minutes} onChange={(k, v) => (k === "days" ? setDays(v) : k === "hours" ? setHours(v) : setMinutes(v))} />
        </div>
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Отмена</button>
          <button className="btn btn-primary" disabled={busy} onClick={() => void submit()}>
            {busy ? "ПЕРЕДАЧА..." : "🏳️ Поставить на мониторинг"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
