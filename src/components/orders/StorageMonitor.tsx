"use client";

import { formatDateTime } from "@/lib/time";
import type { ExportFormat, PanelMode, StorageItem, SyncInfo } from "@/lib/types";
import { useMemo, useState } from "react";
import { ExportBar } from "./ExportBar";
import { GameItemIcon } from "./GameItemIcon";

interface Props {
  items: StorageItem[];
  loading: boolean;
  busy: boolean;
  sync: SyncInfo | null;
  mode: PanelMode;
  onToggleMode: () => void;
  onAction: (fmt: ExportFormat) => void;
  onPickTextFile: () => void;
  onClipboard: () => void;
  onClear: () => void;
}

const SOURCE_LABEL: Record<string, string> = {
  json: "JSON",
  txt: "TXT",
  clipboard: "БУФЕР",
  xlsx: "XLSX",
  manual: "РУЧНОЙ",
};

export function StorageMonitor({ items, loading, busy, sync, mode, onToggleMode, onAction, onPickTextFile, onClipboard, onClear }: Props) {
  const [query, setQuery] = useState("");
  const total = useMemo(() => items.reduce((acc, i) => acc + i.count, 0), [items]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.name.toLowerCase().includes(q)) : items;
  }, [items, query]);

  return (
    <section className="panel panel-corners flex flex-col rounded-md p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="panel-title">📦 Содержимое закреплённого склада</h2>
        <div className="flex items-center gap-2">
          <span className="badge-count" title="Позиций">{items.length} ПОЗ.</span>
          <span className="badge-count" title="Суммарное количество">Σ {total}</span>
        </div>
      </div>
      <div className="stencil-line mt-2" />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="btn btn-icon" onClick={onPickTextFile} title="Загрузить JSON/TXT" disabled={busy}>
          📥
        </button>
        <button className="btn btn-icon" onClick={onClipboard} title="Вставить из буфера обмена" disabled={busy}>
          📋
        </button>
        <div className="ml-auto flex items-center gap-2">
          <input className="field w-36 py-1.5 text-xs sm:w-44" placeholder="Фильтр склада..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn btn-danger px-2" onClick={onClear} title="Очистить монитор склада" disabled={busy || !items.length}>
            ✕
          </button>
        </div>
      </div>

      <div className="hud-label mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
        <span>
          Синхр:{" "}
          <span className="text-white/80">{sync ? `${formatDateTime(sync.createdAt)} • ${SOURCE_LABEL[sync.source] ?? sync.source.toUpperCase()} • ${sync.itemCount} поз.` : "нет данных"}</span>
        </span>
        {busy && <span className="pulse text-warn">● ОБРАБОТКА...</span>}
      </div>

      <div className="scroll-area panel-inner mt-3 min-h-[220px] flex-1 rounded p-1.5">
        {loading ? (
          <div className="hud-label flex h-full min-h-[160px] items-center justify-center text-muted">
            <span className="pulse">📡 ЗАПРОС ДАННЫХ СКЛАДА...</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 px-4 text-center">
            <span className="text-3xl opacity-70" aria-hidden>📭</span>
            <div className="text-sm text-white/85">{items.length ? "Ничего не найдено по фильтру" : "Склад пуст. Загрузите JSON/TXT или вставьте данные из буфера"}</div>
            <div className="hud-label text-muted">Формат строк: «Название предмета, 50» или «Название предмета -&gt; 50»</div>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {visible.map((item, idx) => (
              <li key={`${item.name}-${idx}`} className="row-item">
                <span className="flex min-w-0 items-center gap-2">
                  <GameItemIcon name={item.name} size={32} />
                  <span className="truncate text-[0.82rem] text-white">• {item.name}</span>
                </span>
                <span className="badge-count">{item.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ExportBar mode={mode} onToggleMode={onToggleMode} onAction={onAction} busy={busy} />
    </section>
  );
}
