import type { Metadata } from "next";
import { ToolsWorkspace } from "@/components/tools/ToolsWorkspace";

export const metadata: Metadata = {
  title: "Инструменты — SINDARIS Терминал",
  description: "Внешние инструменты Foxhole для клана SINDARIS.",
};

export default function ToolsPage() {
  return <ToolsWorkspace />;
}
