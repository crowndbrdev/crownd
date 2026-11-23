import "server-only";
import { and, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { createHash, randomUUID } from "node:crypto";
import { getDb, schema } from "@/db";
import type { Country } from "@/config/countries";
import { sortBoard } from "./bidding";
import { slugify } from "./slug";
import { dayKey, lastNDays } from "./time";
import { refreshEdition } from "./indexing";
import { sendOutbidEmail } from "./mail";

export const LAUNCH_SLOTS = 10;
export const CHECKOUT_TTL_MS = 30 * 60_000;

export async function getBoard(country: string) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.listings)
    .where(and(eq(schema.listings.country, country), eq(schema.listings.status, "active")));
  return sortBoard(rows);
}

/** Board + the timestamp of its latest real change (used for honest dateModified / lastmod). */
export async function getBoardSnapshot(country: string) {
  const board = await getBoard(country);
  const updatedAt = board.reduce((max, l) => Math.max(max, l.reachedAt, l.createdAt), Date.UTC(2026, 10, 13));
  return { board, updatedAt };
}

export async function getListing(country: string, slug: string) {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(schema.listings)
    .where(and(eq(schema.listings.country, country), eq(schema.listings.slug, slug)));
  return row;
}

export async function getCurrentReign(country: string) {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(schema.reigns)
    .where(and(eq(schema.reigns.country, country), isNull(schema.reigns.endedAt)))
    .orderBy(desc(schema.reigns.startedAt))
    .limit(1);
  // fetchedAt lets the UI render an accurate reign duration server-side without impure renders.
  return row ? { ...row, fetchedAt: Date.now() } : undefined;
}

/** Number of recorded reigns per edition (one query; used by the sitemap to skip empty Halls of Fame). */
export async function getReignCounts(): Promise<Map<string, number>> {
  const db = await getDb();
  const rows = await db.select({ country: schema.reigns.country, n: sql<number>`count(*)` }).from(schema.reigns).groupBy(schema.reigns.country);
  return new Map(rows.map((r) => [r.country, Number(r.n)]));
}

export async function getReigns(country: string) {
  const db = await getDb();
  const rows = await db.select().from(schema.reigns).where(eq(schema.reigns.country, country)).orderBy(desc(schema.reigns.startedAt));
  const now = Date.now();
  return rows.map((r) => ({ ...r, durationMs: (r.endedAt ?? now) - r.startedAt }));
}

/** Current #1 of every edition, for the global Crown Map. */
export async function getAllCrowns() {
  const db = await getDb();
  const rows = await db.select().from(schema.listings).where(eq(schema.listings.status, "active"));
  const byCountry = new Map<string, (typeof rows)[number]>();
  for (const r of sortBoard(rows)) if (!byCountry.has(r.country)) byCountry.set(r.country, r);
  return byCountry;
}

export async function getTotals() {
  const db = await getDb();
  const [l] = await db.select({ n: sql<number>`count(*)`, c: sql<number>`coalesce(sum(clicks),0)` }).from(schema.listings);
  const [x] = await db.select({ c: sql<number>`coalesce(sum(clicks),0)` }).from(schema.launches);
  return { products: Number(l.n), clicks: Number(l.c) + Number(x.c) };
}

// ── Launches ────────────────────────────────────────────────────────────────

export async function getLaunches(c: Country, range: "today" | "week") {
  const db = await getDb();
  const days = range === "today" ? [dayKey(c.timezone)] : lastNDays(c.timezone, 7);
  const rows = await db
    .select()
    .from(schema.launches)
    .where(and(eq(schema.launches.country, c.slug), inArray(schema.launches.day, days)));
  const now = Date.now();
  // Pinned (paid, active) first, then by unique clicks, then oldest first.
  return rows
    .map((r) => ({ ...r, pinned: !!r.highlightedUntil && r.highlightedUntil > now }))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.clicks - a.clicks || a.createdAt - b.createdAt);
}

export async function createLaunch(c: Country, input: { url: string; key: string; host: string; name: string; tagline: string }) {
  const db = await getDb();
  const day = dayKey(c.timezone);
  const today = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.launches)
    .where(and(eq(schema.launches.country, c.slug), eq(schema.launches.day, day)));
  if (Number(today[0].n) >= LAUNCH_SLOTS) return { error: "full" as const };
  const [dupe] = await db
    .select({ id: schema.launches.id })
    .from(schema.launches)
    .where(and(eq(schema.launches.country, c.slug), eq(schema.launches.key, input.key)));
  if (dupe) return { error: "duplicate" as const };
  const id = randomUUID();
  await db.insert(schema.launches).values({ id, country: c.slug, day, createdAt: Date.now(), ...input });
  refreshEdition(c.slug, [`/${c.slug}/launches`]);
  return { id };
}

// ── Clicks (one per visitor per target per day; IPs are hashed, never stored) ──

export async function recordClick(targetId: string, kind: "listing" | "launch", ip: string, ua: string) {
  const db = await getDb();
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.CLICK_SALT ?? "crownd-dev-salt";
  const visitor = createHash("sha256").update(`${salt}|${day}|${ip}|${ua}`).digest("hex").slice(0, 32);
  const inserted = await db
    .insert(schema.clicks)
    .values({ id: randomUUID(), targetId, visitor, day })
    .onConflictDoNothing()
    .returning({ id: schema.clicks.id });
  if (!inserted.length) return;
  if (kind === "listing")
    await db.update(schema.listings).set({ clicks: sql`${schema.listings.clicks} + 1` }).where(eq(schema.listings.id, targetId));
  else await db.update(schema.launches).set({ clicks: sql`${schema.launches.clicks} + 1` }).where(eq(schema.launches.id, targetId));
}

export async function getClickTarget(id: string) {
  const db = await getDb();
  const [l] = await db.select({ url: schema.listings.url }).from(schema.listings).where(eq(schema.listings.id, id));
  if (l) return { url: l.url, kind: "listing" as const };
  const [x] = await db.select({ url: schema.launches.url }).from(schema.launches).where(eq(schema.launches.id, id));
  if (x) return { url: x.url, kind: "launch" as const };
  return null;
}

// ── Payments ────────────────────────────────────────────────────────────────

export async function createPayment(p: Omit<typeof schema.payments.$inferInsert, "id" | "createdAt" | "expiresAt" | "status">) {
  const db = await getDb();
  const now = Date.now();
  const row: typeof schema.payments.$inferSelect = {
    providerRef: null, paidAt: null, name: null, ...p, id: randomUUID(), createdAt: now, expiresAt: now + CHECKOUT_TTL_MS, status: "pending",
  };
  await db.insert(schema.payments).values(row);
  return row;
}

export async function getPayment(id: string) {
  const db = await getDb();
  const [row] = await db.select().from(schema.payments).where(eq(schema.payments.id, id));
  return row;
}

export async function setProviderRef(id: string, ref: string) {
  const db = await getDb();
  await db.update(schema.payments).set({ providerRef: ref }).where(eq(schema.payments.id, id));
}

/**
 * Idempotent: applying the same payment twice is a no-op.
 * Ties are ordered by when checkout STARTED (payment.createdAt) — that is the
 * "hold": nobody who starts later can beat you with the same amount.
 */
/** `description` comes from the Stripe session metadata (no DB column needed on payments). */
export async function confirmPayment(paymentId: string, name?: string, description?: string) {
  const db = await getDb();
  const p = await getPayment(paymentId);
  if (!p || p.status === "paid") return p;
  const now = Date.now();

  // Atomically flip pending|expired → paid; if another worker already did it, stop.
  // "expired" is included on purpose: Boleto/OXXO/Konbini settle days after the 30-min hold.
  // When Stripe says the money arrived, the bid must count — never take money and drop the bid.
  const flipped = await db
    .update(schema.payments)
    .set({ status: "paid", paidAt: now })
    .where(and(eq(schema.payments.id, p.id), inArray(schema.payments.status, ["pending", "expired"])))
    .returning({ id: schema.payments.id });
  if (!flipped.length) return p;

  if (p.kind === "launch_highlight") {
    await db
      .update(schema.launches)
      .set({ highlightedUntil: sql`max(coalesce(${schema.launches.highlightedUntil}, ${now}), ${now}) + ${24 * 3600_000}` })
      .where(and(eq(schema.launches.country, p.country), eq(schema.launches.key, p.key)));
    refreshEdition(p.country, [`/${p.country}/launches`]);
    return p;
  }
  if (p.kind !== "bid") return p;

  const before = (await getBoard(p.country))[0];
  const [existing] = await db
    .select()
    .from(schema.listings)
    .where(and(eq(schema.listings.country, p.country), eq(schema.listings.key, p.key)));

  if (existing) {
    await db
      .update(schema.listings)
      .set({
        bidTotal: sql`${schema.listings.bidTotal} + ${p.amount}`, reachedAt: p.createdAt, status: "active",
        // A top-up can add or improve the description (it is what makes the product page indexable).
        ...(description?.trim() ? { description: description.trim() } : {}),
      })
      .where(eq(schema.listings.id, existing.id));
  } else {
    const display = name?.trim() || p.name?.trim() || prettyHost(p.host);
    let slug = slugify(display);
    const [clash] = await db
      .select({ id: schema.listings.id })
      .from(schema.listings)
      .where(and(eq(schema.listings.country, p.country), eq(schema.listings.slug, slug)));
    if (clash) slug = `${slug}-${p.id.slice(0, 6)}`;
    await db.insert(schema.listings).values({
      id: randomUUID(), country: p.country, key: p.key, url: p.url, host: p.host, slug, name: display,
      bidTotal: p.amount, reachedAt: p.createdAt, createdAt: now, ownerEmail: p.email, description: description?.trim() ?? "",
    });
  }

  const fresh = await getBoard(p.country);
  const after = fresh[0];
  const mine = fresh.find((l) => l.key === p.key);
  refreshEdition(p.country, mine ? [`/${p.country}/p/${mine.slug}`, `/${p.country}/guide`] : []);
  if (after && after.id !== before?.id) {
    await db.update(schema.reigns).set({ endedAt: now }).where(and(eq(schema.reigns.country, p.country), isNull(schema.reigns.endedAt)));
    await db.insert(schema.reigns).values({
      id: randomUUID(), country: p.country, listingId: after.id, name: after.name, url: after.url,
      bidAtStart: after.bidTotal, startedAt: now,
    });
    if (before) await notifyOutbid(before.ownerEmail, before.name, p.country);
  }
  return p;
}

/** Outbid alert (Resend). Localised, and a no-op until e-mail is live — see lib/mail.ts. */
async function notifyOutbid(email: string, name: string, country: string) {
  await sendOutbidEmail(email, name, country);
}

export function prettyHost(host: string) {
  const base = host.replace(/\.(example|com|dev|io|app|co|ai|so|xyz|net|org)$/, "").split(".").pop() ?? host;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export async function subscribe(email: string, country: string) {
  const db = await getDb();
  await db.insert(schema.subscribers).values({ email: email.toLowerCase(), country, createdAt: Date.now() }).onConflictDoNothing();
}

export async function expirePayment(id: string) {
  const db = await getDb();
  await db
    .update(schema.payments)
    .set({ status: "expired" })
    .where(and(eq(schema.payments.id, id), eq(schema.payments.status, "pending")));
}

export async function expireStalePayments() {
  const db = await getDb();
  await db
    .update(schema.payments)
    .set({ status: "expired" })
    .where(and(eq(schema.payments.status, "pending"), gte(sql`${Date.now()}`, schema.payments.expiresAt)));
}

