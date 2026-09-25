import type { Metadata } from "next";
import { ToolsWorkspace } from "@/components/tools/ToolsWorkspace";

export const metadata: Metadata = {
  title: "Инструменты — SINDARIS Терминал",
  description: "Калькуляторы клана SINDARIS (Factory, MPF, Refinery) и внешние инструменты Foxhole.",
};

interface ToolsPageProps {
  /** Next 16: searchParams — промис. ?tool=factory|mpf|refinery сразу открывает нужную вкладку. */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const { tool } = await searchParams;
  const initialTool = typeof tool === "string" ? tool : null;
  // key: при переходе по ссылке с другим ?tool= рабочая область монтируется заново с нужной вкладкой.
  return <ToolsWorkspace key={initialTool ?? "none"} initialTool={initialTool} />;
}
