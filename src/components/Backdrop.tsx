import { useEffect, useRef, useState } from "react";

/** Фоновый слой терминала: смена арта по разделу с кроссфейдом + HUD-эффекты. */
export function Backdrop({ src }: { src: string }) {
  const [layers, setLayers] = useState<string[]>([src]);
  const current = useRef(src);

  useEffect(() => {
    if (current.current === src) return;
    current.current = src;
    setLayers((prev) => [...prev.slice(-1), src]);
  }, [src]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050705]" aria-hidden>
      {layers.map((layer, i) => (
        <div
          key={layer}
          className={`bg-layer ${i === layers.length - 1 && layers.length > 1 ? "bg-fade-in" : ""}`}
          style={{ backgroundImage: `url(${layer})` }}
          onAnimationEnd={() => setLayers((prev) => prev.slice(-1))}
        />
      ))}
      <div className="fx-overlay absolute inset-0" />
      <div className="fx-glow absolute inset-0" />
      <div className="fx-grid absolute inset-0" />
      <div className="fx-scanlines absolute inset-0" />
      <div className="fx-grain absolute inset-0" />
      <div className="fx-sweep absolute inset-x-0 top-0" />
      <div className="fx-vignette absolute inset-0" />
    </div>
  );
}
