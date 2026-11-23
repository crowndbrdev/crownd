import { integer, sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";

/** Paid board listings — one board per country. Money in minor units. */
export const listings = sqliteTable(
  "listings",
  {
    id: text("id").primaryKey(),
    country: text("country").notNull(),
    key: text("key").notNull(),
    url: text("url").notNull(),
    host: text("host").notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    bidTotal: integer("bid_total").notNull(),
    reachedAt: integer("reached_at").notNull(),
    createdAt: integer("created_at").notNull(),
    clicks: integer("clicks").notNull().default(0),
    ownerEmail: text("owner_email").notNull(),
    status: text("status", { enum: ["active", "removed"] }).notNull().default("active"),
  },
  (t) => [
    uniqueIndex("listings_country_key").on(t.country, t.key),
    uniqueIndex("listings_country_slug").on(t.country, t.slug),
    index("listings_board").on(t.country, t.status, t.bidTotal),
  ],
);

/** Every checkout attempt. A listing only changes when a payment is confirmed. */
export const payments = sqliteTable(
  "payments",
  {
    id: text("id").primaryKey(),
    country: text("country").notNull(),
    kind: text("kind", { enum: ["bid", "launch_highlight", "tool_highlight"] }).notNull(),
    key: text("key").notNull(),
    url: text("url").notNull(),
    host: text("host").notNull(),
    email: text("email").notNull(),
    amount: integer("amount").notNull(),
    targetTotal: integer("target_total").notNull(),
    currency: text("currency").notNull(),
    provider: text("provider").notNull(),
    providerRef: text("provider_ref"),
    name: text("name"),
    status: text("status", { enum: ["pending", "paid", "expired", "refunded"] }).notNull().default("pending"),
    createdAt: integer("created_at").notNull(),
    expiresAt: integer("expires_at").notNull(),
    paidAt: integer("paid_at"),
  },
  (t) => [index("payments_ref").on(t.providerRef)],
);

/** Free daily launches (10/day/country), ranked by unique clicks. */
export const launches = sqliteTable(
  "launches",
  {
    id: text("id").primaryKey(),
    country: text("country").notNull(),
    day: text("day").notNull(),
    key: text("key").notNull(),
    url: text("url").notNull(),
    host: text("host").notNull(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull().default(""),
    clicks: integer("clicks").notNull().default(0),
    highlightedUntil: integer("highlighted_until"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [uniqueIndex("launches_country_key").on(t.country, t.key), index("launches_day").on(t.country, t.day)],
);

/** Hall of Fame: every reign of #1, per country. */
export const reigns = sqliteTable(
  "reigns",
  {
    id: text("id").primaryKey(),
    country: text("country").notNull(),
    listingId: text("listing_id").notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    bidAtStart: integer("bid_at_start").notNull(),
    startedAt: integer("started_at").notNull(),
    endedAt: integer("ended_at"),
  },
  (t) => [index("reigns_country").on(t.country, t.startedAt)],
);

/** One click per visitor per target per day (hashed, no raw IPs stored). */
export const clicks = sqliteTable(
  "clicks",
  {
    id: text("id").primaryKey(),
    targetId: text("target_id").notNull(),
    visitor: text("visitor").notNull(),
    day: text("day").notNull(),
  },
  (t) => [uniqueIndex("clicks_unique").on(t.targetId, t.visitor, t.day)],
);

export const subscribers = sqliteTable("subscribers", {
  email: text("email").primaryKey(),
  country: text("country").notNull(),
  createdAt: integer("created_at").notNull(),
});

export type Listing = typeof listings.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Launch = typeof launches.$inferSelect;
export type Reign = typeof reigns.$inferSelect;
