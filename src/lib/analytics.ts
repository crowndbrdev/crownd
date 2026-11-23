import "server-only";
import { createHash } from "node:crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { COUNTRY_BY_SLUG } from "@/config/countries";
import { cleanPath, isBot } from "./text";

export { cleanPath, isBot };

/**
 * First-party analytics on D1 — privacy by design:
 *  - no cookies, no localStorage, no IP stored;
 *  - visitor = sha256(salt | day | ip | user-agent) truncated → rotates every day (like Plausible),
 *    so nobody can be tracked across days and no consent banner is required.
 * "Online now" = distinct visitors seen in the last 5 minutes (pageview or heartbeat).
 */
const ONLINE_WINDOW_MS = 5 * 60_000;

async function d1() {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as unknown as { DB?: D1Like }).DB;
  if (!db) throw new Error("D1 binding `DB` missing");
  return db;
}

type D1Like = {
  prepare(sql: string): { bind(...v: unknown[]): { run(): Promise<unknown>; first<T>(): Promise<T | null>; all<T>(): Promise<{ results: T[] }> } };
  batch(stmts: unknown[]): Promise<unknown>;
};

export function visitorId(ip: string, ua: string, day: string) {
  const salt = process.env.CLICK_SALT ?? "crownd-dev-salt";
  return createHash("sha256").update(`${salt}|${day}|${ip}|${ua}`).digest("hex").slice(0, 24);
}

export async function track(input: { kind: "pageview" | "ping"; path: string; ip: string; ua: string; country: string | null }) {
  const now = Date.now();
  const day = new Date(now).toISOString().slice(0, 10);
  const visitor = visitorId(input.ip, input.ua, day);
  const edition = input.path.split("/")[1];
  const ed = edition && COUNTRY_BY_SLUG[edition] ? edition : null;
  const country = input.country && /^[A-Z]{2}$/.test(input.country) ? input.country : null;
  const db = await d1();

  if (input.kind === "ping") {
    await db.prepare("UPDATE visits SET last_seen = ? WHERE visitor = ? AND day = ?").bind(now, visitor, day).run();
    return;
  }
  await db.batch([
    db
      .prepare(
        `INSERT INTO visits (visitor, day, edition, country, first_seen, last_seen, pageviews) VALUES (?, ?, ?, ?, ?, ?, 1)
         ON CONFLICT(visitor, day) DO UPDATE SET last_seen = excluded.last_seen, pageviews = pageviews + 1`,
      )
      .bind(visitor, day, ed, country, now, now),
    db
      .prepare(`INSERT INTO page_stats (day, path, views) VALUES (?, ?, 1) ON CONFLICT(day, path) DO UPDATE SET views = views + 1`)
      .bind(day, input.path),
  ]);
}

export type LiveStats = { online: number; visitors: number; pageviews: number };

export async function liveStats(): Promise<LiveStats> {
  try {
    const db = await d1();
    const since = Date.now() - ONLINE_WINDOW_MS;
    const [online, totals] = await Promise.all([
      db.prepare("SELECT COUNT(*) AS n FROM visits WHERE last_seen > ?").bind(since).first<{ n: number }>(),
      db.prepare("SELECT COUNT(*) AS v, COALESCE(SUM(pageviews), 0) AS p FROM visits").bind().first<{ v: number; p: number }>(),
    ]);
    return { online: Number(online?.n ?? 0), visitors: Number(totals?.v ?? 0), pageviews: Number(totals?.p ?? 0) };
  } catch {
    return { online: 0, visitors: 0, pageviews: 0 };
  }
}

export type Report = LiveStats & {
  days: { day: string; visitors: number; pageviews: number }[];
  editions: { edition: string; visitors: number }[];
  countries: { country: string; visitors: number }[];
  pages: { path: string; views: number }[];
};

export async function report(daysBack = 30): Promise<Report> {
  const db = await d1();
  const from = new Date(Date.now() - (daysBack - 1) * 86_400_000).toISOString().slice(0, 10);
  const [live, days, editions, countries, pages] = await Promise.all([
    liveStats(),
    db.prepare("SELECT day, COUNT(*) AS visitors, SUM(pageviews) AS pageviews FROM visits WHERE day >= ? GROUP BY day ORDER BY day").bind(from).all<{ day: string; visitors: number; pageviews: number }>(),
    db.prepare("SELECT edition, COUNT(*) AS visitors FROM visits WHERE day >= ? AND edition IS NOT NULL GROUP BY edition ORDER BY visitors DESC").bind(from).all<{ edition: string; visitors: number }>(),
    db.prepare("SELECT country, COUNT(*) AS visitors FROM visits WHERE day >= ? AND country IS NOT NULL GROUP BY country ORDER BY visitors DESC LIMIT 15").bind(from).all<{ country: string; visitors: number }>(),
    db.prepare("SELECT path, SUM(views) AS views FROM page_stats WHERE day >= ? GROUP BY path ORDER BY views DESC LIMIT 15").bind(from).all<{ path: string; views: number }>(),
  ]);
  // Fill missing days with zeros so the chart has a continuous x-axis.
  const byDay = new Map(days.results.map((d) => [d.day, d]));
  const series = Array.from({ length: daysBack }, (_, i) => {
    const day = new Date(Date.now() - (daysBack - 1 - i) * 86_400_000).toISOString().slice(0, 10);
    const d = byDay.get(day);
    return { day, visitors: Number(d?.visitors ?? 0), pageviews: Number(d?.pageviews ?? 0) };
  });
  return { ...live, days: series, editions: editions.results, countries: countries.results, pages: pages.results };
}

/** Where "see the analytics" points: Himetrica's public dashboard if configured, else our own page. */
export function analyticsUrl() {
  return process.env.NEXT_PUBLIC_ANALYTICS_URL || "/analytics";
}
