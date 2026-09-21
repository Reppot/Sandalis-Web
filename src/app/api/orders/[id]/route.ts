import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const orderId = Number(id);
    if (!Number.isFinite(orderId)) {
      return Response.json({ error: "Некорректный идентификатор рапорта" }, { status: 400 });
    }
    await db.delete(orders).where(eq(orders.id, orderId));
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[SIND] DELETE /api/orders/[id]", error);
    return Response.json({ error: "Не удалось удалить рапорт" }, { status: 500 });
  }
}
