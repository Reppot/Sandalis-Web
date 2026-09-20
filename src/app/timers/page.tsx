import type { Metadata } from "next";
import { TimersWorkspace } from "@/components/timers/TimersWorkspace";

export const metadata: Metadata = { title: "Таймеры — SINDARIS Терминал" };

export default function TimersPage() {
  return <TimersWorkspace />;
}
