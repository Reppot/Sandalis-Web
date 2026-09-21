import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "SINDARIS Терминал — Logistics Overwatch",
  description: "Тактический логистический терминал клана SINDARIS для Foxhole: заказы, склады, инструменты.",
};

export const viewport: Viewport = {
  themeColor: "#090d0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
        <NotificationProvider>
          <AppShell>{children}</AppShell>
        </NotificationProvider>
      </body>
    </html>
  );
}
