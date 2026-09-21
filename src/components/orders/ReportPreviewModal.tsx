"use client";

import { canvasToBlob, copyBlobToClipboard, downloadBlob, renderReportPages, type ExportRow, type ReportMeta } from "@/lib/exporters";
import { fileStamp } from "@/lib/time";
import { useEffect, useState } from "react";
import { useNotify } from "../providers/NotificationProvider";
import { Modal } from "../ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  rows: ExportRow[];
  meta: ReportMeta;
  onMetaChange: (meta: ReportMeta) => void;
}

export function ReportPreviewModal({ open, onClose, rows, meta, onMetaChange }: Props) {
  const notify = useNotify();
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) setRendering(true);
    }, 0);
    void renderReportPages(rows, meta).then((c) => {
      if (!cancelled) {
        setPages(c);
        setRendering(false);
      }
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, rows, meta]);

  const downloadAll = async () => {
    const folder = `${fileStamp()}_${meta.region}_${meta.type}_${meta.name}`.replace(/[^\wа-яА-ЯёЁ.-]+/g, "_");
    for (let i = 0; i < pages.length; i++) {
      const blob = await canvasToBlob(pages[i]);
      if (blob) downloadBlob(blob, `${folder}_Стр_${i + 1}_из_${pages.length}.png`);
      await new Promise((r) => setTimeout(r, 350));
    }
    notify({ title: "ПЕЙДЖИНГ ЗАВЕРШЁН", message: `Успешно сформирована тактическая папка:\n${folder}\nСтраниц: ${pages.length}`, tone: "success" });
  };

  const copyPage = async (idx: number) => {
    const blob = await canvasToBlob(pages[idx]);
    const ok = blob ? await copyBlobToClipboard(blob) : false;
    notify(
      ok
        ? { title: "FAST SHARE", message: `Страница ${idx + 1} скопирована в буфер обмена — вставляйте в Discord через Ctrl+V!`, tone: "success" }
        : { title: "БУФЕР ОБМЕНА", message: "Браузер не разрешил копирование изображения. Скачайте PNG кнопкой ниже.", tone: "warning" },
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Графический рапорт • ${rows.length} поз. • ${pages.length || "…"} стр.`}
      icon="🖼️"
      widthClass="max-w-4xl"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="hud-label text-muted">Страницы 650×1000 px • до 14 позиций на лист</span>
          <div className="flex gap-2">
            <button className="btn" onClick={onClose}>Закрыть</button>
            <button className="btn btn-primary" onClick={downloadAll} disabled={!pages.length || rendering}>⬇ Скачать все страницы</button>
          </div>
        </div>
      }
    >
      <div className="grid gap-2 sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="hud-label text-muted">Гекс</span>
          <input className="field text-xs" value={meta.region} onChange={(e) => onMetaChange({ ...meta, region: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="hud-label text-muted">Тип</span>
          <input className="field text-xs" value={meta.type} onChange={(e) => onMetaChange({ ...meta, type: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="hud-label text-muted">Склад</span>
          <input className="field text-xs" value={meta.name} onChange={(e) => onMetaChange({ ...meta, name: e.target.value })} />
        </label>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rendering && !pages.length ? (
          <div className="hud-label pulse col-span-full py-10 text-center text-muted">РЕНДЕРИНГ СТРАНИЦ...</div>
        ) : (
          pages.map((c, i) => (
            <figure key={i} className="panel-inner flex flex-col gap-2 rounded p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.toDataURL("image/png")} alt={`Страница ${i + 1}`} className="w-full rounded border border-white/10" />
              <figcaption className="flex items-center justify-between gap-2">
                <span className="hud-label text-muted">Стр. {i + 1}/{pages.length}</span>
                <span className="flex gap-1">
                  <button className="btn px-2 py-1" onClick={() => copyPage(i)} title="В буфер обмена">📋</button>
                  <button
                    className="btn px-2 py-1"
                    onClick={async () => {
                      const blob = await canvasToBlob(c);
                      if (blob) downloadBlob(blob, `Стр_${i + 1}_из_${pages.length}.png`);
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
