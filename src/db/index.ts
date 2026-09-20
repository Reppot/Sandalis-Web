import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim();
const hasPlaceholder = (value: string) => /<project-ref>|<password>|<YOUR-PASSWORD>|\[YOUR-PASSWORD\]|<user>/i.test(value);

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Create a .env file in the SIND-site project root with a PostgreSQL/Supabase connection string.",
  );
}

if (hasPlaceholder(databaseUrl)) {
  throw new Error(
    "DATABASE_URL still contains a placeholder such as <project-ref> or <password>. Replace every placeholder with the real Supabase project reference and URL-encoded database password.",
  );
}

const isSupabaseOrCloudPostgres = /supabase\.com|pooler\.supabase\.com|neon\.tech|neon\.com/i.test(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __sindarisPostgresqlPool?: Pool;
};

/**
 * Drizzle + node-postgres.
 *
 * This intentionally uses the already-installed `pg` driver instead of
 * `postgres-js`, so a clean Windows checkout does not fail with:
 * "Can't resolve 'postgres'" when node_modules is rebuilt from package.json.
 * Supabase Transaction Pooler is compatible with regular pg queries here;
 * no named prepared statements are configured.
 */
export const pool =
  globalForDb.__sindarisPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: isSupabaseOrCloudPostgres ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 30000,
    keepAlive: true,
    max: 5,
    maxUses: 500,
    maxLifetimeSeconds: 300,
  });

pool.on("error", (error) => {
  console.error("[DB_POOL_ERROR] PostgreSQL client was disconnected; the pool will replace it.", error);
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.__sindarisPostgresqlPool = pool;
}

export const db = drizzle(pool);
