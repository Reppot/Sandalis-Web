import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) return Response.json({ error: "Некорректный ID" }, { status: 400 });
  try {
    await db.delete(orders).where(eq(orders.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/orders/:id", error);
    return Response.json({ error: "Не удалось удалить рапорт" }, { status: 500 });
  }
}
