"use client";

/**
 * Экспорт расчётов калькуляторов клана (Factory / MPF / Refinery).
 *
 * Подход скопирован с раздела ЗАКАЗЫ (src/lib/exporters.ts + OrdersWorkspace.tsx):
 *  - TXT  — строки «Название -> N ед.» (как buildTxt), файл `${база}_${fileStamp()}.txt`;
 *  - XLSX — колонки «Название / Количество / Ед. изм.» (как exportXlsx). Первый лист «Предметы»
 *           совместим с импортом XLSX в конструкторе заказов;
 *  - PNG  — тактические страницы 650×1000 в оформлении рапорта склада (та же текстура, рамки, шрифты);
 *  - БУФЕР — первая PNG-страница в буфер, при запрете браузера — текстовый рапорт.
 * Общие помощники (downloadBlob и др.) берутся из src/lib/exporters.ts без изменений.
 */

import { backgroundAsset } from "@/lib/constants";
import { downloadBlob } from "@/lib/exporters";
import { fileStamp, formatDateTime } from "@/lib/time";
import * as XLSX from "xlsx";

/** Одна строка рапорта: выбранный предмет, итоговый ресурс или показатель сводки. */
export interface ToolReportLine {
  name: string;
  quantity: number | string;
  unit: string;
  /** Необязательное пояснение, например «= 500 шт.». */
  note?: string;
  /** Иконка для интерфейса (в файлы экспорта не попадает). */
  icon?: string | null;
}

/** Всё, что нужно для экспорта расчёта любого калькулятора клана. */
export interface ToolReport {
  /** Название инструмента: «Калькулятор фабрики», «MPF…», «Калькулятор молотка (Refinery)». */
  toolName: string;
  /** Режим / пояснение: «Factory • PRODUCTION (игровые лимиты)». */
  subtitle: string;
  /** Основа имени файла без даты: «SINDARIS_фабрика». */
  fileBase: string;
  /** Выбранные предметы и их количество. */
  items: ToolReportLine[];
  /** Итоговый список ресурсов. */
  resources: ToolReportLine[];
  /** Дополнительные показатели: ящики, время и т.п. */
  stats: ToolReportLine[];
}

// ─────────────────────────────────────────────────────────────
// TXT
// ─────────────────────────────────────────────────────────────
function formatLine(line: ToolReportLine): string {
  const unit = line.unit ? ` ${line.unit}` : "";
  const note = line.note ? ` (${line.note})` : "";
  return `${line.name} -> ${line.quantity}${unit}${note}`;
}

/** Текстовый рапорт: шапка с названием инструмента, выбранные предметы, итоговые ресурсы, сводка. */
export function buildToolReportText(report: ToolReport, date: Date = new Date()): string {
  const lines: string[] = [`SINDARIS • ${report.toolName}`];
  if (report.subtitle) lines.push(`Режим: ${report.subtitle}`);
  lines.push(`Сформировано: ${formatDateTime(date)}`, "");
  lines.push(`ВЫБРАННЫЕ ПРЕДМЕТЫ (${report.items.length}):`, ...report.items.map(formatLine), "");
  lines.push(`ИТОГОВЫЕ РЕСУРСЫ (${report.resources.length}):`);
  lines.push(...(report.resources.length ? report.resources.map(formatLine) : ["—"]));
  if (report.stats.length) lines.push("", "СВОДКА:", ...report.stats.map(formatLine));
  return lines.join("\n") + "\n";
}

export function exportToolTxt(report: ToolReport) {
  const blob = new Blob([buildToolReportText(report)], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${report.fileBase}_${fileStamp()}.txt`);
}

// ─────────────────────────────────────────────────────────────
// XLSX: «Предметы» (импортируемый лист) + «Ресурсы» + «Сводка»
// ─────────────────────────────────────────────────────────────
export function exportToolXlsx(report: ToolReport) {
  const wb = XLSX.utils.book_new();

  const items = XLSX.utils.json_to_sheet(
    report.items.map((line) => ({ Название: line.name, Количество: line.quantity, "Ед. изм.": line.unit, Инструмент: report.toolName })),
    { header: ["Название", "Количество", "Ед. изм.", "Инструмент"] },
  );
  items["!cols"] = [{ wch: 44 }, { wch: 14 }, { wch: 10 }, { wch: 34 }];
  XLSX.utils.book_append_sheet(wb, items, "Предметы");

  const resources = XLSX.utils.json_to_sheet(
    report.resources.map((line) => ({ Ресурс: line.name, Количество: line.quantity, "Ед. изм.": line.unit })),
    { header: ["Ресурс", "Количество", "Ед. изм."] },
  );
  resources["!cols"] = [{ wch: 36 }, { wch: 14 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, resources, "Ресурсы");

  const summary = XLSX.utils.aoa_to_sheet([
    ["Инструмент", report.toolName],
    ["Режим", report.subtitle],
    ["Сформировано", formatDateTime(new Date())],
    ["Позиций", report.items.length],
    [],
    ["Показатель", "Значение", "Ед. изм."],
    ...report.stats.map((line) => [line.name, line.quantity, line.unit]),
  ]);
  summary["!cols"] = [{ wch: 24 }, { wch: 40 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, summary, "Сводка");

  XLSX.writeFile(wb, `${report.fileBase}_${fileStamp()}.xlsx`);
}

// ─────────────────────────────────────────────────────────────
// PNG: страницы 650×1000 (оформление как у drawPage в src/lib/exporters.ts)
// ─────────────────────────────────────────────────────────────
const PAGE_W = 650;
const PAGE_H = 1000;
const ENTRIES_PER_PAGE = 14;
const ENTRY_STEP = 52;

type PageEntry = { kind: "section"; label: string } | { kind: "row"; name: string; value: string };

let textureCache: HTMLImageElement | null = null;
function loadTexture(): Promise<HTMLImageElement | null> {
  if (textureCache) return Promise.resolve(textureCache);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      textureCache = img;
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = backgroundAsset("report").src;
  });
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  let label = text;
  while (ctx.measureText(label).width > maxWidth && label.length > 6) label = label.slice(0, -2) + "…";
  return label;
}

function formatQuantity(line: ToolReportLine): string {
  const value = typeof line.quantity === "number" ? line.quantity.toLocaleString("ru-RU") : line.quantity;
  return line.unit ? `x ${value} ${line.unit}` : value;
}

function buildEntries(report: ToolReport): PageEntry[] {
  const toRow = (line: ToolReportLine): PageEntry => ({
    kind: "row",
    name: line.note ? `${line.name} (${line.note})` : line.name,
    value: formatQuantity(line),
  });
  const entries: PageEntry[] = [
    { kind: "section", label: `ВЫБРАННЫЕ ПРЕДМЕТЫ • ${report.items.length}` },
    ...report.items.map(toRow),
    { kind: "section", label: `ИТОГОВЫЕ РЕСУРСЫ • ${report.resources.length}` },
    ...report.resources.map(toRow),
  ];
  if (report.stats.length) entries.push({ kind: "section", label: "СВОДКА" }, ...report.stats.map(toRow));
  return entries;
}

/** Делит строки на страницы; заголовок секции не остаётся последней строкой листа. */
function paginate(entries: PageEntry[]): PageEntry[][] {
  const pages: PageEntry[][] = [[]];
  for (const entry of entries) {
    const current = pages[pages.length - 1];
    const limit = entry.kind === "section" ? ENTRIES_PER_PAGE - 1 : ENTRIES_PER_PAGE;
    if (current.length >= limit) pages.push([entry]);
    else current.push(entry);
  }
  return pages;
}

function drawToolPage(
  ctx: CanvasRenderingContext2D,
  texture: HTMLImageElement | null,
  entries: PageEntry[],
  page: number,
  total: number,
  report: ToolReport,
) {
  ctx.fillStyle = "#1f2321";
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  if (texture) {
    const scale = Math.max(PAGE_W / texture.width, PAGE_H / texture.height);
    const w = texture.width * scale;
    const h = texture.height * scale;
    ctx.drawImage(texture, (PAGE_W - w) / 2, (PAGE_H - h) / 2, w, h);
    ctx.fillStyle = "rgba(10,14,11,0.72)";
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  }
  // рамка
  ctx.strokeStyle = "rgba(163,230,53,0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, PAGE_W - 36, PAGE_H - 36);
  ctx.strokeStyle = "rgba(156,143,128,0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, PAGE_W - 52, PAGE_H - 52);

  // шапка: название инструмента, режим, количество позиций
  ctx.fillStyle = "#a3e635";
  ctx.font = "bold 22px Arial";
  ctx.fillText(fitText(ctx, `SINDARIS • ${report.toolName}`.toUpperCase(), 450), 40, 62);
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "18px Arial";
  ctx.fillText(fitText(ctx, `Инструмент: ${report.toolName}`, 570), 40, 96);
  ctx.fillText(fitText(ctx, `Режим: ${report.subtitle || "—"}`, 570), 40, 122);
  ctx.fillText(`Позиций: ${report.items.length} • Ресурсов: ${report.resources.length}`, 40, 148);
  ctx.fillStyle = "#60a5fa";
  ctx.font = "16px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Стр. ${page}/${total}`, PAGE_W - 40, 62);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "13px Arial";
  ctx.fillText(formatDateTime(new Date()), PAGE_W - 40, 86);
  ctx.textAlign = "left";

  ctx.strokeStyle = "#4b5563";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 170);
  ctx.lineTo(PAGE_W - 40, 170);
  ctx.stroke();

  let y = 200;
  let rowIndex = 0;
  for (const entry of entries) {
    if (entry.kind === "section") {
      ctx.fillStyle = "#60a5fa";
      ctx.font = "bold 15px Arial";
      ctx.fillText(entry.label, 44, y + 4);
      ctx.strokeStyle = "rgba(96,165,250,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(44, y + 14);
      ctx.lineTo(PAGE_W - 44, y + 14);
      ctx.stroke();
      rowIndex = 0;
    } else {
      if (rowIndex % 2 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.045)";
        ctx.fillRect(34, y - 26, PAGE_W - 68, 46);
      }
      ctx.fillStyle = "#e5e7eb";
      ctx.font = "18px Arial";
      ctx.fillText(fitText(ctx, `•  ${entry.name}`, 400), 44, y + 4);
      ctx.fillStyle = "#a3e635";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "right";
      ctx.fillText(entry.value, PAGE_W - 48, y + 4);
      ctx.textAlign = "left";
      rowIndex += 1;
    }
    y += ENTRY_STEP;
  }

  ctx.fillStyle = "rgba(163,230,53,0.7)";
  ctx.font = "bold 12px Arial";
  ctx.fillText("SINDARIS LOGISTICS OVERWATCH • РАСЧЁТ ИНСТРУМЕНТОВ КЛАНА", 40, PAGE_H - 40);
}

export async function renderToolReportPages(report: ToolReport): Promise<HTMLCanvasElement[]> {
  const texture = await loadTexture();
  const pages = paginate(buildEntries(report));
  return pages.map((entries, index) => {
    const canvas = document.createElement("canvas");
    canvas.width = PAGE_W;
    canvas.height = PAGE_H;
    const ctx = canvas.getContext("2d");
    if (ctx) drawToolPage(ctx, texture, entries, index + 1, pages.length, report);
    return canvas;
  });
}
