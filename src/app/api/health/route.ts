import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, db: "up" });
  } catch (error) {
    console.error("[SIND][health] database check failed", error);
    return Response.json({ ok: false, db: "down", error: "DATABASE_UNREACHABLE" }, { status: 503 });
  }
}
