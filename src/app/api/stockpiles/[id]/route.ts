import { db } from "@/db";
import { stockpileHistory, stockpiles } from "@/db/schema";
import { DEFAULT_RESET_SECONDS } from "@/lib/constants";
import { loadStockpile } from "@/lib/server/stockpile-repo";
import { stamp } from "@/lib/time";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

interface PatchBody {
  action?: "reset48" | "set" | "note";
  days?: number;
  hours?: number;
  minutes?: number;
  note?: string;
}

export async function PATCH(req: Request, { params }: Params) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) return Response.json({ error: "Некорректный ID" }, { status: 400 });

  try {
    const body = (await req.json()) as PatchBody;
    const existing = await loadStockpile(id);
    if (!existing) return Response.json({ error: "Склад не найден" }, { status: 404 });

    if (body.action === "reset48") {
      await db
        .update(stockpiles)
        .set({ expiresAt: new Date(Date.now() + DEFAULT_RESET_SECONDS * 1000), updatedAt: new Date() })
        .where(eq(stockpiles.id, id));
      await db.insert(stockpileHistory).values({
        stockpileId: id,
        message: `[${stamp()}] Интендант выполнил быстрый сброс таймера на базовые 48 часов.`,
      });
    } else if (body.action === "note") {
      const note = String(body.note ?? "").trim();
      if (!note) return Response.json({ error: "Пустая запись журнала" }, { status: 400 });
      await db.insert(stockpileHistory).values({ stockpileId: id, message: `[${stamp()}] ${note}` });
    } else {
      const d = Math.max(0, Math.floor(Number(body.days ?? 0)));
      const h = Math.max(0, Math.floor(Number(body.hours ?? 0)));
      const m = Math.max(0, Math.floor(Number(body.minutes ?? 0)));
      if ([d, h, m].some((v) => !Number.isFinite(v))) {
        return Response.json({ error: "Заполняйте поля только числовыми значениями!" }, { status: 400 });
      }
      const total = d * 86400 + h * 3600 + m * 60;
      if (total <= 0) return Response.json({ error: "Итоговое время должно быть больше 0 секунд!" }, { status: 400 });
      await db
        .update(stockpiles)
        .set({ expiresAt: new Date(Date.now() + total * 1000), updatedAt: new Date() })
        .where(eq(stockpiles.id, id));
      await db.insert(stockpileHistory).values({
        stockpileId: id,
        message: `[${stamp()}] Установлено новое время удержания: ${d}д ${h}ч ${m}м.`,
      });
    }

    const dto = await loadStockpile(id);
    return Response.json(dto);
  } catch (error) {
    console.error("PATCH /api/stockpiles/:id", error);
    return Response.json({ error: "Сбой обновления таймера" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) return Response.json({ error: "Некорректный ID" }, { status: 400 });
  try {
    await db.delete(stockpiles).where(eq(stockpiles.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/stockpiles/:id", error);
    return Response.json({ error: "Не удалось снять склад с мониторинга" }, { status: 500 });
  }
}
