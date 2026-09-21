import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cx } from "../lib/format";

export function Panel({
  children,
  className,
  corners = true,
}: {
  children: ReactNode;
  className?: string;
  corners?: boolean;
}) {
  return <div className={cx("panel rounded-md", corners && "panel-corners", className)}>{children}</div>;
}

export function PanelTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cx("panel-title", className)}>{children}</h2>;
}

export function HudLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("hud-label", className)}>{children}</div>;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="backdrop-in fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={cx("modal-in panel panel-corners w-full rounded-md", width)}>
        <div className="flex items-center justify-between border-b border-[var(--line-2)] px-4 py-3">
          <span className="panel-title">{title}</span>
          <button
            className="flex h-7 w-7 items-center justify-center rounded border border-[var(--line-2)] text-white/60 transition hover:border-[var(--danger)] hover:text-red-300"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X size={14} />
          </button>
        </div>
        <div className="max-h-[78vh] overflow-y-auto p-4 scroll-area">{children}</div>
      </div>
    </div>
  );
}

export function CornerTick({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        "pointer-events-none absolute h-3 w-3 border-accent/70 opacity-70",
        className,
      )}
      style={{ borderColor: "var(--accent)", borderStyle: "solid", borderWidth: 0 }}
    />
  );
}

export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="panel panel-corners flex flex-col items-center justify-center gap-3 rounded-md px-6 py-12 text-center">
      <div className="text-accent/70">{icon}</div>
      <div className="text-sm font-semibold text-white/90">{title}</div>
      {hint && <div className="hud-label text-white/40">{hint}</div>}
    </div>
  );
}
