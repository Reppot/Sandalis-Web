"use client";

import { backgroundAsset } from "./constants";
import * as XLSX from "xlsx";
import { fileStamp, formatDateTime } from "./time";
import type { OrderUnit } from "./types";
import { parseInventoryText, type ParsedLine } from "./parsers";

export interface ExportRow {
  name: string;
  count: number;
  unit: string;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function buildTxt(rows: ExportRow[]): string {
  return rows.map((r) => `${r.name} -> ${r.count} ${r.unit}`).join("\n") + "\n";
}

export function exportTxt(rows: ExportRow[], baseName: string) {
  const blob = new Blob([buildTxt(rows)], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${baseName}_${fileStamp()}.txt`);
}

export function exportXlsx(rows: ExportRow[], baseName: string, sheetName = "SINDARIS") {
  const data = rows.map((r) => ({ Название: r.name, Количество: r.count, "Ед. изм.": r.unit }));
  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = [{ wch: 44 }, { wch: 14 }, { wch: 10 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 30));
  XLSX.writeFile(wb, `${baseName}_${fileStamp()}.xlsx`);
}

export async function importXlsx(file: File): Promise<ParsedLine[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  const out: ParsedLine[] = [];
  for (const row of rows) {
    const keys = Object.keys(row);
    const nameKey = keys.find((k) => /назван|name|item|предмет/i.test(k)) ?? keys[0];
    const countKey = keys.find((k) => /кол|count|qty|quantity|amount/i.test(k)) ?? keys[1];
    const unitKey = keys.find((k) => /ед|unit/i.test(k));
    if (!nameKey || !countKey) continue;
    const name = String(row[nameKey] ?? "").trim();
    const count = Number(String(row[countKey] ?? "").replace(/[^\d.-]/g, ""));
    const unitRaw = unitKey ? String(row[unitKey] ?? "") : "";
    const unit: OrderUnit = /шт/i.test(unitRaw) ? "шт." : "ящ.";
    if (name && Number.isFinite(count) && count > 0) out.push({ name, count: Math.round(count), unit });
  }
  if (!out.length) {
    // fallback: лист как текст
    const csv = XLSX.utils.sheet_to_csv(sheet);
    return parseInventoryText(csv);
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// PNG: тактические страницы отчёта (650x1000, до 14 позиций)
// ─────────────────────────────────────────────────────────────
export interface ReportMeta {
  title: string;
  region: string;
  type: string;
  name: string;
}

const PAGE_W = 650;
const PAGE_H = 1000;
const ITEMS_PER_PAGE = 14;

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

function drawPage(
  ctx: CanvasRenderingContext2D,
  texture: HTMLImageElement | null,
  rows: ExportRow[],
  page: number,
  total: number,
  meta: ReportMeta,
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

  ctx.fillStyle = "#a3e635";
  ctx.font = "bold 22px Arial";
  ctx.fillText(meta.title.toUpperCase(), 40, 62);
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "18px Arial";
  ctx.fillText(`Гекс: ${meta.region}`, 40, 96);
  ctx.fillText(`Тип: ${meta.type}`, 40, 122);
  ctx.fillText(`Склад: ${meta.name}`, 40, 148);
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
  rows.forEach((r, i) => {
    if (i % 2 === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      ctx.fillRect(34, y - 26, PAGE_W - 68, 46);
    }
    ctx.fillStyle = "#e5e7eb";
    ctx.font = "18px Arial";
    let label = `•  ${r.name}`;
    while (ctx.measureText(label).width > 400 && label.length > 6) label = label.slice(0, -2) + "…";
    ctx.fillText(label, 44, y + 4);
    ctx.fillStyle = "#a3e635";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`x ${r.count} ${r.unit}`, PAGE_W - 48, y + 4);
    ctx.textAlign = "left";
    y += 52;
  });

  ctx.fillStyle = "rgba(163,230,53,0.7)";
  ctx.font = "bold 12px Arial";
  ctx.fillText("SINDARIS LOGISTICS OVERWATCH • ТАКТИЧЕСКИЙ РАПОРТ", 40, PAGE_H - 40);
}

export async function renderReportPages(rows: ExportRow[], meta: ReportMeta): Promise<HTMLCanvasElement[]> {
  const texture = await loadTexture();
  const chunks: ExportRow[][] = [];
  for (let i = 0; i < rows.length; i += ITEMS_PER_PAGE) chunks.push(rows.slice(i, i + ITEMS_PER_PAGE));
  if (!chunks.length) chunks.push([]);
  return chunks.map((chunk, idx) => {
    const canvas = document.createElement("canvas");
    canvas.width = PAGE_W;
    canvas.height = PAGE_H;
    const ctx = canvas.getContext("2d");
    if (ctx) drawPage(ctx, texture, chunk, idx + 1, chunks.length, meta);
    return canvas;
  });
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

export async function copyBlobToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    return true;
  } catch {
    return false;
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
