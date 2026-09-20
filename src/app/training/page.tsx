import type { Metadata } from "next";
import { TrainingWorkspace } from "@/components/training/TrainingWorkspace";

export const metadata: Metadata = { title: "Обучение — SINDARIS Терминал" };

export default function TrainingPage() {
  return <TrainingWorkspace />;
}
