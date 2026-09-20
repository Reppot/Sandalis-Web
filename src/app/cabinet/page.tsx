import type { Metadata } from "next";
import { CabinetWorkspace } from "@/components/cabinet/CabinetWorkspace";

export const metadata: Metadata = { title: "Личный кабинет — SINDARIS Терминал" };

export default function CabinetPage() {
  return <CabinetWorkspace />;
}
