import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Create a .env file in the project root with a PostgreSQL connection string.");
}

const isCloudPostgres = /supabase\.com|pooler\.supabase\.com|neon\.tech|neon\.com|render\.com/i.test(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __sindarisPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__sindarisPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: isCloudPostgres ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 30000,
    keepAlive: true,
    max: 5,
  });

pool.on("error", (error) => {
  console.error("[SIND][DB_POOL_ERROR] PostgreSQL client was disconnected; the pool will replace it.", error);
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.__sindarisPostgresqlPool = pool;
}

export const db = drizzle(pool);
