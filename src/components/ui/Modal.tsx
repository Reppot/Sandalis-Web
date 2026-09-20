"use client";

import Image from "next/image";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  children: ReactNode;
  widthClass?: string;
  backdropImage?: string;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, icon, children, widthClass = "max-w-xl", backdropImage, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center p-3" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-panel panel panel-corners relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-md ${widthClass}`} role="dialog" aria-modal="true" aria-label={title}>
        {backdropImage && (
          <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${backdropImage})` }} aria-hidden />
        )}
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,12,9,0.55), rgba(8,12,9,0.85))" }} aria-hidden />
        <header className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3">
          {icon && <Image src={icon} alt="" width={34} height={34} unoptimized className="ui-icon h-[34px] w-[34px] object-contain drop-shadow" />}
          <h2 className="panel-title truncate text-[0.82rem]">{title}</h2>
          <button onClick={onClose} className="btn ml-auto px-2 py-1" aria-label="Закрыть">
            ✕
          </button>
        </header>
        <div className="scroll-area relative flex-1 px-4 py-4">{children}</div>
        {footer && <footer className="relative border-t border-white/10 px-4 py-3">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
