"use client";

import { STORAGE_KEYS } from "@/lib/constants";
import { buildTxt, canvasToBlob, copyBlobToClipboard, copyText, exportTxt, exportXlsx, importXlsx, renderReportPages, type ExportRow, type ReportMeta } from "@/lib/exporters";
import { parseInventoryPayload, toOrderLines, toStorageItems, type ParsedLine } from "@/lib/parsers";
import type { ExportFormat, OrderLine, PanelMode, SavedOrderDTO, StorageItem, StorageResponse, SyncInfo } from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotify } from "../providers/NotificationProvider";
import { OrderBuilder } from "./OrderBuilder";
import { ReportPreviewModal } from "./ReportPreviewModal";
import { StorageMonitor } from "./StorageMonitor";

type Target = "storage" | "order";

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export function OrdersWorkspace() {
  const notify = useNotify();

  const [storage, setStorage] = useState<StorageItem[]>([]);
  const [storageSync, setStorageSync] = useState<SyncInfo | null>(null);
  const [storageLoading, setStorageLoading] = useState(true);
  const [storageBusy, setStorageBusy] = useState(false);

  const [order, setOrder] = useState<OrderLine[]>([]);
  const [orderHydrated, setOrderHydrated] = useState(false);
  const [savedOrders, setSavedOrders] = useState<SavedOrderDTO[]>([]);
  const [savedOrdersLoading, setSavedOrdersLoading] = useState(true);

  const [leftMode, setLeftMode] = useState<PanelMode>("export");
  const [rightMode, setRightMode] = useState<PanelMode>("export");
  const [pasteTarget, setPasteTarget] = useState<Target | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [preview, setPreview] = useState<{ rows: ExportRow[] } | null>(null);
  const [reportMeta, setReportMeta] = useState<ReportMeta>({ title: "SINDARIS • Рапорт снабжения", region: "Clanshead Valley", type: "ПОРТ", name: "Public" });

  const textInput = useRef<HTMLInputElement>(null);
  const xlsxInput = useRef<HTMLInputElement>(null);
  const fileTarget = useRef<Target>("storage");

  const refreshSavedOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (res.ok) setSavedOrders(((await res.json()) as { orders: SavedOrderDTO[] }).orders);
    } catch {
      /* ignore — журнал остаётся прежним, повтор запроса произойдёт при следующем действии */
    } finally {
      setSavedOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.order);
      if (raw) setOrder(JSON.parse(raw) as OrderLine[]);
    } catch {
      /* ignore */
    }
    setOrderHydrated(true);

    void (async () => {
      try {
        const res = await fetch("/api/storage", { cache: "no-store" });
        if (!res.ok) throw new Error(await readError(res));
        const data = (await res.json()) as StorageResponse;
        setStorage(data.items);
        setStorageSync(data.lastSync);
      } catch {
        notify({ title: "БАЗА ДАННЫХ", message: "Не удалось загрузить склад — проверьте подключение.", tone: "danger" });
      } finally {
        setStorageLoading(false);
      }
    })();

    // Общий архив рапортов — загружается независимо от собственного черновика заказа.
    void refreshSavedOrders();
  }, [notify, refreshSavedOrders]);

  useEffect(() => {
    if (!orderHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.order, JSON.stringify(order));
    } catch {
      /* ignore */
    }
  }, [order, orderHydrated]);

  const saveStorage = useCallback(
    async (items: StorageItem[], source: string) => {
      setStorageBusy(true);
      setStorage(items);
      try {
        const res = await fetch("/api/storage", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, source }),
        });
        if (!res.ok) throw new Error(await readError(res));
        const data = (await res.json()) as StorageResponse;
        setStorage(data.items);
        setStorageSync(data.lastSync);
        notify({ title: "СИНХРОНИЗАЦИЯ", message: `Успешно загружено предметов: ${data.items.length}.`, tone: "success" });
      } catch (e) {
        notify({ title: "БАЗА ДАННЫХ", message: `Данные показаны локально, но не сохранены: ${(e as Error).message}`, tone: "danger" });
      } finally {
        setStorageBusy(false);
      }
    },
    [notify],
  );

  const importLines = useCallback(
    (lines: ParsedLine[], target: Target) => {
      if (!lines.length) {
        notify({
          title: "ОШИБКА ФОРМАТА",
          message: "Не удалось распознать данные. Формат: «Название, Количество» или «Название -> Количество».",
          tone: "danger",
          ttl: 8000,
        });
        return;
      }
      if (target === "storage") void saveStorage(toStorageItems(lines), "manual");
      else {
        setOrder(toOrderLines(lines));
        notify({ title: "ИМПОРТ ЗАКАЗА", message: `В конструктор загружено позиций: ${lines.length}`, tone: "success" });
      }
    },
    [notify, saveStorage],
  );

  const readClipboard = useCallback(
    async (target: Target) => {
      try {
        const text = await navigator.clipboard.readText();
        if (!text.trim()) {
          notify({ title: "БУФЕР ОБМЕНА", message: "Буфер обмена пуст или не содержит текстовых данных!", tone: "warning" });
          return;
        }
        importLines(parseInventoryPayload(text), target);
      } catch {
        setPasteText("");
        setPasteTarget(target);
      }
    },
    [importLines, notify],
  );

  const onTextFile = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    importLines(parseInventoryPayload(text), fileTarget.current);
  };

  const onXlsxFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      importLines(await importXlsx(file), fileTarget.current);
    } catch (e) {
      notify({ title: "XLSX", message: `Сбой чтения таблицы: ${(e as Error).message}`, tone: "danger" });
    }
  };

  const pickFile = (ref: React.RefObject<HTMLInputElement | null>, target: Target) => {
    fileTarget.current = target;
    if (ref.current) {
      ref.current.value = "";
      ref.current.click();
    }
  };

  const addToOrder = (line: OrderLine) => {
    setOrder((prev) => {
      const existing = prev.find((l) => l.name === line.name);
      if (!existing) return [...prev, line];
      return prev.map((l) => (l.name === line.name ? (l.unit === line.unit ? { ...l, count: l.count + line.count } : { ...line }) : l));
    });
  };
  const adjustLine = (name: string, delta: number) => setOrder((prev) => prev.map((l) => (l.name === name ? { ...l, count: Math.max(1, l.count + delta) } : l)));
  const removeLine = (name: string) => setOrder((prev) => prev.filter((l) => l.name !== name));
  const clearOrder = () => {
    setOrder([]);
    notify({ title: "КОНСТРУКТОР", message: "Текущий заказ полностью очищен.", tone: "warning" });
  };

  const saveOrder = async (title: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, items: order }),
      });
      if (!res.ok) throw new Error(await readError(res));
      const data = (await res.json()) as { orders: SavedOrderDTO[] };
      setSavedOrders(data.orders);
      notify({ title: "РАПОРТ ПРИНЯТ", message: `Заказ на ${order.length} позиций сохранён в общем архиве штаба.`, tone: "success" });
      return true;
    } catch (e) {
      notify({ title: "РАПОРТ", message: `Штаб не принял рапорт: ${(e as Error).message}`, tone: "danger" });
      return false;
    }
  };

  const deleteSaved = async (id: number) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await readError(res));
      setSavedOrders((prev) => prev.filter((o) => o.id !== id));
      notify({ title: "АРХИВ", message: "Рапорт удалён из журнала.", tone: "info" });
    } catch (e) {
      notify({ title: "АРХИВ", message: (e as Error).message, tone: "danger" });
    }
  };

  const toggleMode = (side: Target) => {
    const current = side === "storage" ? leftMode : rightMode;
    const next: PanelMode = current === "export" ? "import" : "export";
    (side === "storage" ? setLeftMode : setRightMode)(next);
    notify(
      next === "import"
        ? { title: "⚙️ РЕЖИМ ИМПОРТА", message: "Панель переключена в режим импорта — нижние кнопки теперь читают внешние файлы.", tone: "warning" }
        : { title: "📡 РЕЖИМ ЭКСПОРТА", message: "Панель переключена в режим экспорта — доступна выгрузка рапортов в TXT, XLSX и PNG.", tone: "info" },
    );
  };

  const storageRows = useMemo<ExportRow[]>(() => storage.map((i) => ({ name: i.name, count: i.count, unit: "шт." })), [storage]);
  const orderRows = useMemo<ExportRow[]>(() => order.map((l) => ({ name: l.name, count: l.count, unit: l.unit })), [order]);

  const handleAction = async (side: Target, fmt: ExportFormat) => {
    const mode = side === "storage" ? leftMode : rightMode;
    if (mode === "import") {
      if (fmt === "txt") pickFile(textInput, side);
      else if (fmt === "xlsx") pickFile(xlsxInput, side);
      else if (fmt === "clipboard") void readClipboard(side);
      else notify({ title: "ИМПОРТ", message: "Импорт из PNG недоступен: используйте JSON/TXT, XLSX или буфер обмена.", tone: "warning" });
      return;
    }
    const rows = side === "storage" ? storageRows : orderRows;
    const base = side === "storage" ? "SINDARIS_склад" : "SINDARIS_заказ";
    if (!rows.length) {
      notify({ title: "ПУСТЫЕ ДАННЫЕ", message: "Нет элементов для формирования рапорта!", tone: "warning" });
      return;
    }
    const meta: ReportMeta = { ...reportMeta, title: side === "storage" ? "SINDARIS • Запасы склада" : "SINDARIS • Заказ снабжения" };
    setReportMeta(meta);
    if (fmt === "txt") {
      exportTxt(rows, base);
      notify({ title: "ЭКСПОРТ TXT", message: `Рапорт из ${rows.length} позиций сформирован.`, tone: "success" });
    } else if (fmt === "xlsx") {
      exportXlsx(rows, base, side === "storage" ? "Склад" : "Заказ");
      notify({ title: "УСПЕХ", message: "Таблица сформирована!", tone: "success" });
    } else if (fmt === "png") {
      setPreview({ rows });
    } else {
      const [first] = await renderReportPages(rows, meta);
      const blob = first ? await canvasToBlob(first) : null;
      const ok = blob ? await copyBlobToClipboard(blob) : false;
      if (ok) notify({ title: "FAST SHARE", message: "Первая страница отчёта скопирована в буфер обмена!", tone: "success" });
      else {
        const okText = await copyText(buildTxt(rows));
        notify(
          okText
            ? { title: "БУФЕР ОБМЕНА", message: "Браузер не разрешил копировать изображение — рапорт скопирован как текст.", tone: "warning" }
            : { title: "БУФЕР ОБМЕНА", message: "Буфер обмена недоступен в этом браузере.", tone: "danger" },
        );
      }
    }
  };

  return (
    <div className="tab-fade flex min-h-full flex-col gap-2.5 md:gap-3">
      <div className="grid min-h-0 flex-1 gap-2.5 md:gap-3 lg:grid-cols-2">
        <div className="min-w-0">
          <StorageMonitor
            items={storage}
            loading={storageLoading}
            busy={storageBusy}
            sync={storageSync}
            mode={leftMode}
            onToggleMode={() => toggleMode("storage")}
            onAction={(fmt) => void handleAction("storage", fmt)}
            onPickTextFile={() => pickFile(textInput, "storage")}
            onClipboard={() => void readClipboard("storage")}
            onClear={() => void saveStorage([], "manual")}
          />
        </div>
        <div className="min-w-0">
          <OrderBuilder
            order={order}
            onAdd={addToOrder}
            onRemove={removeLine}
            onAdjust={adjustLine}
            onClear={clearOrder}
            savedOrders={savedOrders}
            savedOrdersLoading={savedOrdersLoading}
            onSave={saveOrder}
            onLoadSaved={(o) => {
              setOrder(o.items);
              notify({ title: "АРХИВ", message: `Рапорт «${o.title}» загружен в конструктор.`, tone: "info" });
            }}
            onDeleteSaved={(id) => void deleteSaved(id)}
            mode={rightMode}
            onToggleMode={() => toggleMode("order")}
            onAction={(fmt) => void handleAction("order", fmt)}
            busy={storageBusy}
          />
        </div>
      </div>

      <input ref={textInput} type="file" accept=".json,.txt,application/json,text/plain" className="hidden" onChange={(e) => void onTextFile(e.target.files?.[0])} />
      <input ref={xlsxInput} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => void onXlsxFile(e.target.files?.[0])} />

      {pasteTarget && (
        <div className="modal-backdrop fixed inset-0 z-[85] flex items-center justify-center p-3" onMouseDown={(e) => e.target === e.currentTarget && setPasteTarget(null)}>
          <div className="panel panel-corners w-full max-w-lg rounded-md p-4">
            <h2 className="panel-title mb-2">Вставка данных скирнера</h2>
            <p className="hud-label text-muted">Браузер не дал прямой доступ к буферу. Вставьте текст вручную (Ctrl+V):</p>
            <textarea
              className="field field-mono mt-2 h-48 w-full resize-y text-xs"
              placeholder={"Название предмета, 50\nНазвание предмета -> 12 ящ.\nНазвание предмета: 7"}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              autoFocus
            />
            <div className="mt-3 flex justify-end gap-2">
              <button className="btn" onClick={() => setPasteTarget(null)}>Отмена</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (pasteTarget) importLines(parseInventoryPayload(pasteText), pasteTarget);
                  setPasteTarget(null);
                }}
              >
                Распознать
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportPreviewModal open={!!preview} onClose={() => setPreview(null)} rows={preview?.rows ?? []} meta={reportMeta} onMetaChange={setReportMeta} />
    </div>
  );
}
