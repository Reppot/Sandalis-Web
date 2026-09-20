import type { Metadata } from "next";
import { FactoryWorkspace } from "@/components/tools/FactoryWorkspace";

export const metadata: Metadata = {
  title: "Factory Calculator — SINDARIS Инструменты",
  description: "Офлайн-калькулятор производства Foxhole для Factory и MPF.",
};

export default function FactoryPage() {
  return <FactoryWorkspace />;
}
