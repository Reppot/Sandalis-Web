import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, database: "online" });
  } catch (error) {
    console.error("GET /api/health", error);
    const code = error instanceof Error && /ECONNREFUSED|ENOTFOUND|ETIMEDOUT/i.test(error.message)
      ? "DATABASE_UNREACHABLE"
      : "DATABASE_QUERY_FAILED";
    return Response.json({ ok: false, database: "offline", code }, { status: 500 });
  }
}
