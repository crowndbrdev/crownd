import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";
import { seedDemo } from "./seed";

/**
 * Cloudflare D1 (SQLite at the edge), bound as `DB` in wrangler.jsonc.
 *  - Production / preview: the real D1 database.
 *  - `next dev`: a local D1 (in .wrangler/state) provided by initOpenNextCloudflareForDev().
 * Schema lives in migrations/*.sql (applied by `wrangler d1 migrations apply`).
 */
type DB = DrizzleD1Database<typeof schema>;
type D1Binding = Parameters<typeof drizzle>[0];

let seeded: Promise<void> | null = null;

export async function getDb(): Promise<DB> {
  const { env } = await getCloudflareContext({ async: true });
  const binding = (env as unknown as { DB?: D1Binding }).DB;
  if (!binding) throw new Error("D1 binding `DB` missing — check wrangler.jsonc");
  const db = drizzle(binding, { schema });
  // Demo data only ever in local development (fictional *.example products).
  if (process.env.NODE_ENV === "development" && process.env.SEED_DEMO !== "0") {
    seeded ??= seedDemo(db).catch((e) => {
      seeded = null;
      throw e;
    });
    await seeded;
  }
  return db;
}

export { schema };
