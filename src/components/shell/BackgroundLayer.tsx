"use client";

import { backgroundForPath, type BackgroundAsset } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function BackgroundLayer() {
  const pathname = usePathname();
  const target = backgroundForPath(pathname ?? "/");
  const [layers, setLayers] = useState<BackgroundAsset[]>([target]);

  useEffect(() => {
    setLayers((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.src === target.src) return prev;
      return [...prev.slice(-1), target];
    });
  }, [target]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-neutral-950" aria-hidden>
      {layers.map((layer, idx) => (
        <div
          key={layer.src}
          className={`bg-layer ${idx === layers.length - 1 && layers.length > 1 ? "bg-fade-in" : ""}`}
          style={{ backgroundImage: `url(${layer.src})`, backgroundPosition: layer.position }}
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
