import { db } from "@/db";
import { storageItems, syncLog } from "@/db/schema";
import type { StorageItem, StorageResponse } from "@/lib/types";
import { asc, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function buildResponse(): Promise<StorageResponse> {
  const items = await db.select().from(storageItems).orderBy(asc(storageItems.name));
  const [last] = await db.select().from(syncLog).orderBy(desc(syncLog.createdAt)).limit(1);
  return {
    items: items.map((i) => ({ name: i.name, count: i.count, unit: i.unit })),
    lastSync: last ? { source: last.source, itemCount: last.itemCount, createdAt: last.createdAt.toISOString() } : null,
  };
}

export async function GET() {
  try {
    return Response.json(await buildResponse());
  } catch (error) {
    console.error("GET /api/storage", error);
    return Response.json({ error: "Сбой чтения запасов склада" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { items?: StorageItem[]; source?: string };
    const source = String(body.source ?? "manual").slice(0, 40);
    const items = (Array.isArray(body.items) ? body.items : [])
      .map((i) => ({
        name: String(i.name ?? "").trim().slice(0, 200),
        count: Math.max(0, Math.floor(Number(i.count ?? 0))),
        unit: String(i.unit ?? "шт.").slice(0, 10),
      }))
      .filter((i) => i.name && Number.isFinite(i.count) && i.count > 0);

    await db.transaction(async (tx) => {
      await tx.delete(storageItems);
      for (let i = 0; i < items.length; i += 200) {
        const chunk = items.slice(i, i + 200);
        if (chunk.length) await tx.insert(storageItems).values(chunk);
      }
      await tx.insert(syncLog).values({ source, itemCount: items.length });
    });

    return Response.json(await buildResponse());
  } catch (error) {
    console.error("PUT /api/storage", error);
    return Response.json({ error: "Сбой записи запасов склада" }, { status: 500 });
  }
}
