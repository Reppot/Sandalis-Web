"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "./Header";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/";

  if (isLoginRoute) {
    return <div className="relative min-h-dvh bg-neutral-950">{children}</div>;
  }

  return (
    <div className="app-shell relative flex min-h-dvh flex-col gap-3 p-2.5 md:p-3">
      <Header />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
