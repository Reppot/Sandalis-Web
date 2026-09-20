import { db } from "@/db";
import { stockpileHistory, stockpiles } from "@/db/schema";
import { INITIAL_STOCKPILES } from "@/lib/constants";
import type { StockpileDTO } from "@/lib/types";
import { asc, desc, eq } from "drizzle-orm";

let seeded = false;

function isTransientDatabaseError(error: unknown): boolean {
  const value = error as { code?: string; message?: string; cause?: { code?: string; message?: string } };
  const text = `${value?.message ?? ""} ${value?.cause?.message ?? ""}`.toLowerCase();
  const code = value?.code ?? value?.cause?.code ?? "";
  return (
    ["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EPIPE", "57P01", "57P02", "57P03"].includes(code) ||
    text.includes("connection terminated") ||
    text.includes("connection ended unexpectedly") ||
    text.includes("server closed the connection")
  );
}

async function withDatabaseRetry<T>(operation: () => Promise<T>, attempts = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isTransientDatabaseError(error) || attempt === attempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 120 * (attempt + 1)));
    }
  }
  throw lastError;
}

export async function ensureSeed() {
  if (seeded) return;

  await withDatabaseRetry(async () => {
    const existing = await db.select({ id: stockpiles.id }).from(stockpiles).limit(1);
    if (existing.length > 0) return;

    const now = Date.now();
    for (const s of INITIAL_STOCKPILES) {
      const [row] = await db
        .insert(stockpiles)
        .values({ region: s.region, location: s.location, expiresAt: new Date(now + s.timeLeft * 1000) })
        .returning();
      if (row) {
        await db.insert(stockpileHistory).values(s.history.map((message) => ({ stockpileId: row.id, message })));
      }
    }
  });

  seeded = true;
}

export async function loadStockpiles(): Promise<StockpileDTO[]> {
  return withDatabaseRetry(async () => {
    const rows = await db.select().from(stockpiles).orderBy(asc(stockpiles.expiresAt));
    const history = await db.select().from(stockpileHistory).orderBy(desc(stockpileHistory.createdAt), desc(stockpileHistory.id));
    const byStockpile = new Map<number, StockpileDTO["history"]>();
    for (const h of history) {
      const list = byStockpile.get(h.stockpileId) ?? [];
      if (list.length < 60) list.push({ id: h.id, message: h.message, createdAt: h.createdAt.toISOString() });
      byStockpile.set(h.stockpileId, list);
    }
    return rows.map((r) => ({
      id: r.id,
      region: r.region,
      location: r.location,
      expiresAt: r.expiresAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      history: (byStockpile.get(r.id) ?? []).reverse(),
    }));
  });
}

export async function loadStockpile(id: number): Promise<StockpileDTO | null> {
  return withDatabaseRetry(async () => {
    const [row] = await db.select().from(stockpiles).where(eq(stockpiles.id, id)).limit(1);
    if (!row) return null;
    const history = await db
      .select()
      .from(stockpileHistory)
      .where(eq(stockpileHistory.stockpileId, id))
      .orderBy(asc(stockpileHistory.createdAt), asc(stockpileHistory.id));
    return {
      id: row.id,
      region: row.region,
      location: row.location,
      expiresAt: row.expiresAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      history: history.map((h) => ({ id: h.id, message: h.message, createdAt: h.createdAt.toISOString() })),
    };
  });
}

export async function addHistory(stockpileId: number, message: string) {
  return withDatabaseRetry(() => db.insert(stockpileHistory).values({ stockpileId, message }));
}
