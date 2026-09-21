import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import type { OrderLine, SavedOrderDTO } from "@/lib/types";
import { asc, desc, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Возвращает ВСЕ сохранённые рапорты штаба — общий архив, доступный любому участнику. */
async function listOrders(): Promise<SavedOrderDTO[]> {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
  if (!rows.length) return [];
  const items = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((r) => r.id)))
    .orderBy(asc(orderItems.id));
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    items: items
      .filter((i) => i.orderId === r.id)
      .map((i) => ({ name: i.name, count: i.count, unit: (i.unit === "шт." ? "шт." : "ящ.") as OrderLine["unit"] })),
  }));
}

export async function GET() {
  try {
    return Response.json({ orders: await listOrders() });
  } catch (error) {
    console.error("[SIND] GET /api/orders", error);
    return Response.json({ error: "Сбой чтения архива рапортов" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { title?: string; items?: OrderLine[] };
    const title = String(body.title ?? "").trim().slice(0, 120) || `Рапорт снабжения ${new Date().toLocaleString("ru-RU")}`;
    const lines = (Array.isArray(body.items) ? body.items : [])
      .map((l) => ({
        name: String(l.name ?? "").trim().slice(0, 200),
        count: Math.floor(Number(l.count ?? 0)),
        unit: l.unit === "шт." ? "шт." : "ящ.",
      }))
      .filter((l) => l.name && Number.isFinite(l.count) && l.count > 0);
    if (!lines.length) return Response.json({ error: "Заказ пуст — нечего отправлять в штаб" }, { status: 400 });

    const [order] = await db.insert(orders).values({ title, status: "submitted" }).returning();
    await db.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));
    return Response.json({ orders: await listOrders(), createdId: order.id }, { status: 201 });
  } catch (error) {
    console.error("[SIND] POST /api/orders", error);
    return Response.json({ error: "Не удалось сохранить рапорт" }, { status: 500 });
  }
}
