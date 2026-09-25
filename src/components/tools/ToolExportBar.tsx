"use client";

import { iconPath } from "@/lib/constants";
import { canvasToBlob, copyBlobToClipboard, copyText, downloadBlob } from "@/lib/exporters";
import { fileStamp } from "@/lib/time";
import type { ExportFormat } from "@/lib/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useNotify } from "../providers/NotificationProvider";
import { Modal } from "../ui/Modal";
import { buildToolReportText, exportToolTxt, exportToolXlsx, renderToolReportPages, type ToolReport } from "./tool-export";

/**
 * Кнопки экспорта для блока итогов калькуляторов.
 * Форматы, иконки, размеры кнопок и тексты уведомлений повторяют src/components/orders/ExportBar.tsx
 * и handleAction из OrdersWorkspace.tsx. Режима импорта здесь нет — инструменты только выгружают расчёт.
 */
const FORMATS: { fmt: ExportFormat; label: string; icon: string; hint: string }[] = [
  { fmt: "txt", label: "TXT", icon: iconPath("txt-file"), hint: "Выгрузить расчёт в TXT" },
  { fmt: "xlsx", label: "XLSX", icon: iconPath("xls"), hint: "Выгрузить таблицу XLSX" },
  { fmt: "png", label: "PNG", icon: iconPath("png-file"), hint: "Сформировать графические страницы расчёта" },
  { fmt: "clipboard", label: "БУФЕР", icon: iconPath("log-file"), hint: "Скопировать первую страницу расчёта в буфер обмена" },
];

interface ToolExportBarProps {
  report: ToolReport;
}

export function ToolExportBar({ report }: ToolExportBarProps) {
  const notify = useNotify();
  const [busy, setBusy] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleAction = async (fmt: ExportFormat) => {
    if (!report.items.length) {
      notify({ title: "ПУСТЫЕ ДАННЫЕ", message: "Нет элементов для формирования рапорта!", tone: "warning" });
      return;
    }
    if (fmt === "txt") {
      exportToolTxt(report);
      notify({ title: "ЭКСПОРТ TXT", message: `Рапорт «${report.toolName}» из ${report.items.length} позиций сформирован.`, tone: "success" });
      return;
    }
    if (fmt === "xlsx") {
      exportToolXlsx(report);
      notify({ title: "УСПЕХ", message: "Таблица сформирована!", tone: "success" });
      return;
    }
    if (fmt === "png") {
      setPreviewOpen(true);
      return;
    }
    setBusy(true);
    try {
      const [first] = await renderToolReportPages(report);
      const blob = first ? await canvasToBlob(first) : null;
      const ok = blob ? await copyBlobToClipboard(blob) : false;
      if (ok) {
        notify({ title: "FAST SHARE", message: "Первая страница расчёта скопирована в буфер обмена — вставляйте в Discord через Ctrl+V!", tone: "success" });
        return;
      }
      const okText = await copyText(buildToolReportText(report));
      notify(
        okText
          ? { title: "БУФЕР ОБМЕНА", message: "Браузер не разрешил копировать изображение — расчёт скопирован как текст.", tone: "warning" }
          : { title: "БУФЕР ОБМЕНА", message: "Буфер обмена недоступен в этом браузере.", tone: "danger" },
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="hud-label flex items-center gap-2 text-accent">
          <span className="status-dot" style={{ color: "var(--accent)", background: "var(--accent)" }} />
          ЭКСПОРТ РАСЧЁТА
        </span>
        <span className="hud-label opacity-70">⬆ выгрузка рапорта</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {FORMATS.map((f) => (
          <button key={f.fmt} type="button" className="btn h-[42px] px-1" disabled={busy} onClick={() => void handleAction(f.fmt)} title={f.hint}>
            <Image src={f.icon} alt="" width={22} height={22} unoptimized className="ui-icon h-[22px] w-[22px] object-contain" />
            <span className="hidden sm:inline">{f.label}</span>
          </button>
        ))}
      </div>
      <ToolReportPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} report={report} />
    </div>
  );
}

interface ToolReportPreviewModalProps {
  open: boolean;
  onClose: () => void;
  report: ToolReport;
}

/** Превью PNG-страниц расчёта — по образцу ReportPreviewModal (без полей «Гекс/Тип/Склад»). */
function ToolReportPreviewModal({ open, onClose, report }: ToolReportPreviewModalProps) {
  const notify = useNotify();
  // Страницы хранятся вместе с отчётом, из которого они нарисованы: «идёт рендеринг» вычисляется,
  // а не выставляется синхронно в эффекте (правило react-hooks/set-state-in-effect).
  const [rendered, setRendered] = useState<{ source: ToolReport; pages: HTMLCanvasElement[] } | null>(null);
  const pages = rendered?.source === report ? rendered.pages : [];
  const rendering = open && rendered?.source !== report;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void renderToolReportPages(report).then((canvases) => {
      if (!cancelled) setRendered({ source: report, pages: canvases });
    });
    return () => {
      cancelled = true;
    };
  }, [open, report]);

  const downloadAll = async () => {
    const folder = `${fileStamp()}_${report.fileBase}`.replace(/[^\wа-яА-ЯёЁ.-]+/g, "_");
    for (let i = 0; i < pages.length; i++) {
      const blob = await canvasToBlob(pages[i]);
      if (blob) downloadBlob(blob, `${folder}_Стр_${i + 1}_из_${pages.length}.png`);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
    notify({ title: "ПЕЙДЖИНГ ЗАВЕРШЁН", message: `Расчёт «${report.toolName}» выгружен.\n${folder}\nСтраниц: ${pages.length}`, tone: "success" });
  };

  const copyPage = async (index: number) => {
    const blob = await canvasToBlob(pages[index]);
    const ok = blob ? await copyBlobToClipboard(blob) : false;
    notify(
      ok
        ? { title: "FAST SHARE", message: `Страница ${index + 1} скопирована в буфер обмена — вставляйте в Discord через Ctrl+V!`, tone: "success" }
        : { title: "БУФЕР ОБМЕНА", message: "Браузер не разрешил копирование изображения. Скачайте PNG кнопкой ниже.", tone: "warning" },
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${report.toolName} • ${report.items.length} поз. • ${pages.length || "…"} стр.`}
      icon={iconPath("png-file")}
      widthClass="max-w-4xl"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="hud-label text-muted">Страницы 650×1000 px • до 14 строк на лист</span>
          <div className="flex gap-2">
            <button className="btn" onClick={onClose}>Закрыть</button>
            <button className="btn btn-primary" onClick={() => void downloadAll()} disabled={!pages.length || rendering}>⬇ Скачать все страницы</button>
          </div>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rendering && !pages.length ? (
          <div className="hud-label pulse col-span-full py-10 text-center text-muted">РЕНДЕРИНГ СТРАНИЦ...</div>
        ) : (
          pages.map((canvas, index) => (
            <figure key={index} className="panel-inner flex flex-col gap-2 rounded p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={canvas.toDataURL("image/png")} alt={`Страница ${index + 1}`} className="w-full rounded border border-white/10" />
              <figcaption className="flex items-center justify-between gap-2">
                <span className="hud-label text-muted">Стр. {index + 1}/{pages.length}</span>
                <span className="flex gap-1">
                  <button className="btn px-2 py-1" onClick={() => void copyPage(index)} title="В буфер обмена">📋</button>
                  <button
                    className="btn px-2 py-1"
                    onClick={async () => {
                      const blob = await canvasToBlob(canvas);
                      if (blob) downloadBlob(blob, `${report.fileBase}_Стр_${index + 1}_из_${pages.length}.png`);
                    }}
                    title="Скачать PNG"
                  >
                    ⬇
                  </button>
                </span>
              </figcaption>
            </figure>
          ))
        )}
      </div>
    </Modal>
  );
}
