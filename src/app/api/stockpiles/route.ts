import { db } from "@/db";
import { stockpileHistory, stockpiles } from "@/db/schema";
import { ensureSeed, loadStockpile, loadStockpiles } from "@/lib/server/stockpile-repo";
import { stamp } from "@/lib/time";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeed();
    const data = await loadStockpiles();
    return Response.json({ stockpiles: data, serverTime: new Date().toISOString() });
  } catch (error) {
    console.error("GET /api/stockpiles", error);
    const message = error instanceof Error && /ECONNREFUSED|ENOTFOUND|ETIMEDOUT/i.test(error.message)
      ? "База данных недоступна. Проверьте DATABASE_URL в корневом .env и доступность PostgreSQL/Supabase."
      : "Сбой канала связи с базой секторов";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { region?: string; location?: string; seconds?: number };
    const region = String(body.region ?? "").trim();
    const location = String(body.location ?? "").trim();
    const seconds = Math.floor(Number(body.seconds ?? 0));
    if (!region || !location) {
      return Response.json({ error: "Укажите регион и локацию склада" }, { status: 400 });
    }
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return Response.json({ error: "Время удержания должно быть больше 0" }, { status: 400 });
    }
    const [row] = await db
      .insert(stockpiles)
      .values({ region, location, expiresAt: new Date(Date.now() + seconds * 1000) })
      .returning();
    await db.insert(stockpileHistory).values({
      stockpileId: row.id,
      message: `[${stamp()}] Склад зарегистрирован интендантской службой. Стартовое удержание: ${Math.round(seconds / 3600)} ч.`,
    });
    const dto = await loadStockpile(row.id);
    return Response.json(dto, { status: 201 });
  } catch (error) {
    console.error("POST /api/stockpiles", error);
    return Response.json({ error: "Не удалось зарегистрировать склад" }, { status: 500 });
  }
}
