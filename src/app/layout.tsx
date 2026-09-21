import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, Russo_One } from "next/font/google";
import type { ReactNode } from "react";
import { THEME_INIT_SCRIPT } from "@/components/providers/ThemeProvider";
import { TerminalShell } from "@/components/shell/TerminalShell";
import "./globals.css";

const display = Russo_One({
  variable: "--font-russo",
  subsets: ["cyrillic", "latin"],
  display: "swap",
  weight: "400",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["cyrillic", "latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SINDARIS Терминал — Logistics Overwatch",
  description: "Тактический логистический терминал клана SINDARIS для Foxhole: заказы, склады, таймеры деспавна.",
  icons: { icon: "/clan-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#090d0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" data-theme="dark" suppressHydrationWarning className={`${display.variable} ${mono.variable}`}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <TerminalShell>{children}</TerminalShell>
      </body>
    </html>
  );
}
