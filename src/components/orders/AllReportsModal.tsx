"use client";

import { iconPath } from "@/lib/constants";
import { formatDateTime } from "@/lib/time";
import type { SavedOrderDTO } from "@/lib/types";
import { useMemo, useState } from "react";
import { GameItemIcon } from "./GameItemIcon";
import { Modal } from "../ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  orders: SavedOrderDTO[];
  loading: boolean;
  onLoad: (order: SavedOrderDTO) => void;
  onDelete: (id: number) => void;
}

const STATUS_LABEL: Record<string, string> = {
  submitted: "ОТПРАВЛЕН",
  draft: "ЧЕРНОВИК",
};

/**
 * Общий журнал ВСЕХ рапортов, сохранённых любым участником штаба.
 * Просмотр и загрузка не требуют, чтобы у текущего пользователя уже был собственный рапорт —
 * список приходит из /api/orders независимо от состояния локального конструктора.
 */
export function AllReportsModal({ open, onClose, orders, loading, onLoad, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => o.title.toLowerCase().includes(q) || o.items.some((i) => i.name.toLowerCase().includes(q)));
  }, [orders, query]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`📋 Логи заказов • Все рапорты штаба (${orders.length})`}
      icon={iconPath("log-file")}
      widthClass="max-w-3xl"
      footer={
        <div className="flex items-center justify-between gap-2">
          <span className="hud-label text-muted">Показано: {filtered.length} / {orders.length}</span>
          <button className="btn" onClick={onClose}>Закрыть</button>
        </div>
      }
    >
      <input
        className="field field-mono mb-3 w-full text-xs"
        placeholder="🔍 Поиск по названию рапорта или предмету..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {loading ? (
        <div className="hud-label flex h-40 items-center justify-center text-muted">
          <span className="pulse">📡 ЗАГРУЗКА АРХИВА РАПОРТОВ...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted">
          <span className="text-3xl" aria-hidden>🗂️</span>
          <div className="text-sm text-white/80">{orders.length ? "Ничего не найдено по запросу" : "Архив пуст — ни один рапорт ещё не отправлен в штаб"}</div>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((order) => {
            const expanded = expandedId === order.id;
            const totalUnits = order.items.reduce((acc, l) => acc + l.count, 0);
            return (
              <li key={order.id} className="panel-inner rounded p-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button className="flex min-w-0 flex-1 items-center gap-2 text-left" onClick={() => setExpandedId(expanded ? null : order.id)}>
                    <span className="shrink-0 text-white/50">{expanded ? "▾" : "▸"}</span>
                    <span className="min-w-0 truncate text-[0.85rem] font-semibold text-white">{order.title}</span>
                  </button>
                  <span className="hud-label shrink-0 text-muted">{formatDateTime(order.createdAt)}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 pl-5">
                  <span className="badge-count">{order.items.length} поз.</span>
                  <span className="badge-count">Σ {totalUnits}</span>
                  <span className="hud-label rounded border border-white/10 px-1.5 py-0.5 text-accent">{STATUS_LABEL[order.status] ?? order.status.toUpperCase()}</span>
                  <span className="ml-auto flex gap-1.5">
                    <button className="btn px-2 py-1 text-xs" onClick={() => onLoad(order)} title="Загрузить в конструктор">⤴ Загрузить</button>
                    <button
                      className={`btn btn-danger px-2 py-1 text-xs ${confirmDeleteId === order.id ? "btn-active" : ""}`}
                      onClick={() => {
                        if (confirmDeleteId !== order.id) {
                          setConfirmDeleteId(order.id);
                          window.setTimeout(() => setConfirmDeleteId((current) => (current === order.id ? null : current)), 3000);
                          return;
                        }
                        onDelete(order.id);
                        setConfirmDeleteId(null);
                      }}
                      title="Удалить рапорт"
                    >
                      {confirmDeleteId === order.id ? "Подтвердить?" : "✕"}
                    </button>
                  </span>
                </div>
                {expanded && (
                  <ul className="mt-2 grid gap-1 border-t border-white/10 pt-2 pl-5 sm:grid-cols-2">
                    {order.items.map((line, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[0.78rem] text-white/85">
                        <GameItemIcon name={line.name} size={24} />
                        <span className="min-w-0 truncate">{line.name}</span>
                        <span className="badge-count ml-auto shrink-0">{line.count} {line.unit}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
