"use client";

import { iconPath } from "@/lib/constants";
import { downloadBlob } from "@/lib/exporters";
import { fileStamp, formatDateTime } from "@/lib/time";
import Image from "next/image";
import { useState } from "react";
import * as XLSX from "xlsx";
import { useNotify } from "../providers/NotificationProvider";

export interface SummaryItem {
  id: string;
  name: string;
  count: number;
  unit: string;
  icon?: string;
  subtext?: string;
  onAdjust: (delta: number) => void;
  onRemove: () => void;
}

export interface SummaryTotalResource {
  key: string;
  label: string;
  value: number;
  unit?: string;
  icon?: string;
}

export interface SummaryExtraStat {
  label: string;
  value: string;
}

interface ToolSummarySidebarProps {
  toolTitle: string;
  badge?: string;
  modeLabel?: string;
  items: SummaryItem[];
  totals: SummaryTotalResource[];
  extraStats?: SummaryExtraStat[];
  onClear: () => void;
  fileBaseName?: string;
}

export function ToolSummarySidebar({
  toolTitle,
  badge = "ИНСТРУМЕНТ",
  modeLabel,
  items,
  totals,
  extraStats = [],
  onClear,
  fileBaseName = "SINDARIS_расчёт",
}: ToolSummarySidebarProps) {
  const notify = useNotify();
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const totalPositions = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.count, 0);

  // Форматирование полного текстового рапорта для экспорта
  function buildExportText(): string {
    const lines: string[] = [
      "==================================================",
      `SINDARIS ТЕРМИНАЛ • ${toolTitle.toUpperCase()}`,
      `Дата формирования: ${formatDateTime(new Date())}`,
      modeLabel ? `Режим: ${modeLabel}` : "",
      "==================================================",
      "",
      `[ ВЫБРАННЫЕ ПРЕДМЕТЫ (${totalPositions} поз., всего ${totalQuantity}) ]`,
      "--------------------------------------------------",
    ];

    if (items.length === 0) {
      lines.push("• (Список пуст)");
    } else {
      items.forEach((item) => {
        lines.push(`• ${item.name} -> ${item.count} ${item.unit}${item.subtext ? ` (${item.subtext})` : ""}`);
      });
    }

    lines.push("");
    lines.push("[ ИТОГОВЫЙ СПИСОК РЕСУРСОВ ]");
    lines.push("--------------------------------------------------");

    const validTotals = totals.filter((t) => t.value > 0);
    if (validTotals.length === 0) {
      lines.push("• Ресурсы не требуются или очередь пуста");
    } else {
      validTotals.forEach((tot) => {
        lines.push(`• ${tot.label}: ${Math.round(tot.value).toLocaleString("ru-RU")} ${tot.unit ?? "ед."}`);
      });
    }

    if (extraStats.length > 0) {
      lines.push("");
      lines.push("[ СТАТИСТИКА ПРОИЗВОДСТВА ]");
      lines.push("--------------------------------------------------");
      extraStats.forEach((st) => {
        lines.push(`• ${st.label}: ${st.value}`);
      });
    }

    lines.push("");
    lines.push("==================================================");
    lines.push("SINDARIS LOGISTICS CONTROL • FOXHOLE");
    return lines.filter(Boolean).join("\n") + "\n";
  }

  // Экспорт в TXT
  function handleExportTxt() {
    if (items.length === 0) {
      notify({
        title: "ПУСТЫЕ ДАННЫЕ",
        message: "Добавьте предметы в калькулятор перед экспортом!",
        tone: "warning",
      });
      return;
    }
    const text = buildExportText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `${fileBaseName}_${fileStamp()}.txt`);
    notify({
      title: "ЭКСПОРТ TXT",
      message: `Рапорт «${toolTitle}» из ${items.length} позиций сформирован.`,
      tone: "success",
    });
  }

  // Экспорт в XLSX
  function handleExportXlsx() {
    if (items.length === 0) {
      notify({
        title: "ПУСТЫЕ ДАННЫЕ",
        message: "Добавьте предметы в калькулятор перед экспортом!",
        tone: "warning",
      });
      return;
    }

    // Лист 1: Предметы
    const itemsData = items.map((it) => ({
      "Инструмент": toolTitle,
      "Предмет": it.name,
      "Количество": it.count,
      "Ед. изм.": it.unit,
      "Примечание": it.subtext ?? "",
    }));

    // Лист 2: Итоговые ресурсы
    const totalsData = totals.map((tot) => ({
      "Ресурс": tot.label,
      "Требуется": Math.round(tot.value),
      "Ед. изм.": tot.unit ?? "ед.",
    }));

    const wb = XLSX.utils.book_new();

    const wsItems = XLSX.utils.json_to_sheet(itemsData);
    wsItems["!cols"] = [{ wch: 25 }, { wch: 35 }, { wch: 14 }, { wch: 10 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsItems, "Очередь");

    const wsTotals = XLSX.utils.json_to_sheet(totalsData);
    wsTotals["!cols"] = [{ wch: 30 }, { wch: 16 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsTotals, "Ресурсы");

    XLSX.writeFile(wb, `${fileBaseName}_${fileStamp()}.xlsx`);
    notify({
      title: "УСПЕХ",
      message: `Таблица XLSX «${toolTitle}» сформирована!`,
      tone: "success",
    });
  }

  // Быстрое копирование в буфер обмена (Fast Share)
  async function handleClipboard() {
    if (items.length === 0) {
      notify({
        title: "ПУСТЫЕ ДАННЫЕ",
        message: "Добавьте предметы в калькулятор перед копированием!",
        tone: "warning",
      });
      return;
    }

    const text = buildExportText();
    try {
      setIsExporting(true);
      await navigator.clipboard.writeText(text);
      notify({
        title: "FAST SHARE",
        message: "План и итоговые ресурсы скопированы в буфер обмена для Discord!",
        tone: "success",
      });
    } catch {
      notify({
        title: "БУФЕР ОБМЕНА",
        message: "Браузер не разрешил прямой доступ к буферу обмена.",
        tone: "warning",
      });
    } finally {
      setIsExporting(false);
    }
  }

  const content = (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="hud-label text-accent font-mono tracking-wider">{badge}</span>
            {modeLabel && <span className="badge-count px-1.5 py-0.5 text-[0.68rem]">{modeLabel}</span>}
          </div>
          <h2 className="panel-title mt-0.5 truncate text-[0.95rem] md:text-[1.05rem]">Итоги ресурсов</h2>
        </div>
        <button
          className="btn btn-danger px-2.5 py-1 text-xs"
          onClick={onClear}
          disabled={items.length === 0}
          title="Очистить очередь"
        >
          ✕ Очистить
        </button>
      </div>

      {/* Список выбранных предметов */}
      <div className="my-2.5 flex items-center justify-between text-xs text-white/60">
        <span>Очередь: {totalPositions} позиций</span>
        <span>Всего: {totalQuantity} шт./ящ.</span>
      </div>

      <div className="scroll-area min-h-[140px] max-h-[300px] flex-1 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center p-4 text-center">
            <span className="text-2xl opacity-40">📦</span>
            <span className="hud-label mt-2 text-white/40">Очередь пуста</span>
            <span className="mt-1 text-[0.72rem] text-white/35">Выберите предметы слева для расчёта</span>
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2.5 rounded border border-white/5 bg-black/35 p-2 transition hover:border-lime-500/30"
              >
                {item.icon ? (
                  <img
                    src={item.icon}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded border border-lime-500/20 bg-neutral-900 object-contain p-0.5"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-lime-500/20 bg-neutral-900 text-xs text-lime-400">
                    📦
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-white" title={item.name}>
                    {item.name}
                  </div>
                  {item.subtext && <div className="truncate text-[0.68rem] text-white/50">{item.subtext}</div>}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    className="btn h-7 w-7 p-0 text-xs"
                    onClick={() => item.onAdjust(-1)}
                    title="Уменьшить"
                  >
                    −
                  </button>
                  <span className="font-mono text-xs font-semibold text-accent min-w-[36px] text-center">
                    {item.count}
                  </span>
                  <button
                    className="btn h-7 w-7 p-0 text-xs"
                    onClick={() => item.onAdjust(1)}
                    title="Увеличить"
                  >
                    ＋
                  </button>
                  <button
                    className="btn btn-danger h-7 w-7 p-0 text-[10px] opacity-70 hover:opacity-100 ml-1"
                    onClick={item.onRemove}
                    title="Удалить"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Сетка итоговых ресурсов */}
      <div className="mt-3 rounded border border-lime-500/25 bg-black/40 p-2.5">
        <div className="hud-label mb-2 text-accent">НЕОБХОДИМЫЕ МАТЕРИАЛЫ</div>
        <div className="grid grid-cols-2 gap-2">
          {totals.map((tot) => (
            <div
              key={tot.key}
              className="flex flex-col gap-0.5 rounded border border-white/10 bg-black/30 p-2"
            >
              <div className="flex items-center gap-1.5 truncate text-[0.7rem] text-white/60">
                {tot.icon && (
                  <img src={tot.icon} alt="" className="h-4 w-4 shrink-0 object-contain" />
                )}
                <span className="truncate">{tot.label}</span>
              </div>
              <div className="font-mono text-sm font-bold text-accent">
                {Math.round(tot.value).toLocaleString("ru-RU")}{" "}
                <span className="text-[0.68rem] font-normal text-white/50">{tot.unit ?? "ед."}</span>
              </div>
            </div>
          ))}
        </div>

        {extraStats.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 text-xs">
            {extraStats.map((st) => (
              <div key={st.label} className="flex items-center gap-1.5">
                <span className="text-white/50">{st.label}:</span>
                <strong className="font-mono text-white">{st.value}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Панель экспорта (стилизована под ExportBar) */}
      <div className="mt-3 border-t border-white/10 pt-3">
        <div className="hud-label mb-2 flex items-center justify-between text-white/70">
          <span>ЭКСПОРТ РАСЧЁТА</span>
          <span className="font-mono text-[0.65rem] text-accent">SINDARIS DISPATCH</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            className="btn h-[42px] px-2 flex items-center justify-center gap-1.5 text-xs font-semibold"
            onClick={handleExportTxt}
            disabled={isExporting || items.length === 0}
            title="Выгрузить отчёт в текстовый файл (.txt)"
          >
            <Image
              src={iconPath("txt-file")}
              alt=""
              width={20}
              height={20}
              unoptimized
              className="ui-icon h-5 w-5 object-contain"
            />
            <span>TXT</span>
          </button>

          <button
            className="btn h-[42px] px-2 flex items-center justify-center gap-1.5 text-xs font-semibold"
            onClick={handleExportXlsx}
            disabled={isExporting || items.length === 0}
            title="Выгрузить расчёт в таблицу Excel (.xlsx)"
          >
            <Image
              src={iconPath("xls")}
              alt=""
              width={20}
              height={20}
              unoptimized
              className="ui-icon h-5 w-5 object-contain"
            />
            <span>XLSX</span>
          </button>

          <button
            className="btn btn-primary h-[42px] px-2 flex items-center justify-center gap-1.5 text-xs font-semibold"
            onClick={() => void handleClipboard()}
            disabled={isExporting || items.length === 0}
            title="Скопировать отчёт в буфер обмена для отправки в чат"
          >
            <Image
              src={iconPath("log-file")}
              alt=""
              width={20}
              height={20}
              unoptimized
              className="ui-icon h-5 w-5 object-contain"
            />
            <span>БУФЕР</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Версия для ПК: Sticky боковая колонка справа (не перекрывает шапку) */}
      <aside className="hidden lg:flex panel panel-corners sticky top-[76px] z-20 w-[360px] xl:w-[400px] shrink-0 flex-col max-h-[calc(100vh-90px)] p-4 shadow-2xl backdrop-blur-md">
        {content}
      </aside>

      {/* Версия для Мобильных и Планшетов: Плавающий аккордеон внизу экрана */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 border-t-2 border-lime-500/50 p-2 shadow-2xl backdrop-blur-md transition-all">
        <div className="flex items-center justify-between gap-3 px-2 py-1">
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            onClick={() => setMobileExpanded((prev) => !prev)}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime-500/20 text-lime-400 font-mono text-xs font-bold">
              {totalPositions}
            </span>
            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-white flex items-center gap-1.5">
                <span>{toolTitle}</span>
                <span className="text-lime-400">({totalQuantity} шт./ящ.)</span>
              </div>
              <div className="truncate text-[0.7rem] text-white/60">
                {totals
                  .filter((t) => t.value > 0)
                  .slice(0, 2)
                  .map((t) => `${t.label}: ${Math.round(t.value)}`)
                  .join(" • ") || "Нажмите, чтобы развернуть расчёт"}
              </div>
            </div>
          </button>

          <button
            type="button"
            className={`btn px-3 py-1.5 text-xs font-semibold shrink-0 ${mobileExpanded ? "btn-warn" : "btn-primary"}`}
            onClick={() => setMobileExpanded((prev) => !prev)}
          >
            {mobileExpanded ? "Свернуть ▴" : "Итоги ▾"}
          </button>
        </div>

        {mobileExpanded && (
          <div className="mt-2 max-h-[68vh] overflow-y-auto border-t border-white/10 p-2 panel panel-corners">
            {content}
          </div>
        )}
      </div>
    </>
  );
}
