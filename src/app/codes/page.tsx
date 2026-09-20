import type { Metadata } from "next";
import { CodeBaseWorkspace } from "@/components/codes/CodeBaseWorkspace";

export const metadata: Metadata = { title: "База кодов — SINDARIS Терминал" };

export default function CodesPage() {
  return <CodeBaseWorkspace />;
}
