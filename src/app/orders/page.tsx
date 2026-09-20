import type { Metadata } from "next";
import { OrdersWorkspace } from "@/components/orders/OrdersWorkspace";

export const metadata: Metadata = { title: "Заказы — SINDARIS Терминал" };

export default function OrdersPage() {
  return <OrdersWorkspace />;
}
