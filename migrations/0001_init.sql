-- Crownd schema (Cloudflare D1 / SQLite). Mirrors src/db/schema.ts.
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY, country TEXT NOT NULL, key TEXT NOT NULL, url TEXT NOT NULL, host TEXT NOT NULL,
  slug TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', bid_total INTEGER NOT NULL,
  reached_at INTEGER NOT NULL, created_at INTEGER NOT NULL, clicks INTEGER NOT NULL DEFAULT 0,
  owner_email TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active');
CREATE UNIQUE INDEX IF NOT EXISTS listings_country_key ON listings(country, key);
CREATE UNIQUE INDEX IF NOT EXISTS listings_country_slug ON listings(country, slug);
CREATE INDEX IF NOT EXISTS listings_board ON listings(country, status, bid_total);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY, country TEXT NOT NULL, kind TEXT NOT NULL, key TEXT NOT NULL, url TEXT NOT NULL,
  host TEXT NOT NULL, email TEXT NOT NULL, amount INTEGER NOT NULL, target_total INTEGER NOT NULL,
  currency TEXT NOT NULL, provider TEXT NOT NULL, provider_ref TEXT, status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, paid_at INTEGER);
CREATE INDEX IF NOT EXISTS payments_ref ON payments(provider_ref);

CREATE TABLE IF NOT EXISTS launches (
  id TEXT PRIMARY KEY, country TEXT NOT NULL, day TEXT NOT NULL, key TEXT NOT NULL, url TEXT NOT NULL,
  host TEXT NOT NULL, name TEXT NOT NULL, tagline TEXT NOT NULL DEFAULT '', clicks INTEGER NOT NULL DEFAULT 0,
  highlighted_until INTEGER, created_at INTEGER NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS launches_country_key ON launches(country, key);
CREATE INDEX IF NOT EXISTS launches_day ON launches(country, day);

CREATE TABLE IF NOT EXISTS reigns (
  id TEXT PRIMARY KEY, country TEXT NOT NULL, listing_id TEXT NOT NULL, name TEXT NOT NULL, url TEXT NOT NULL,
  bid_at_start INTEGER NOT NULL, started_at INTEGER NOT NULL, ended_at INTEGER);
CREATE INDEX IF NOT EXISTS reigns_country ON reigns(country, started_at);

CREATE TABLE IF NOT EXISTS clicks (
  id TEXT PRIMARY KEY, target_id TEXT NOT NULL, visitor TEXT NOT NULL, day TEXT NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS clicks_unique ON clicks(target_id, visitor, day);

CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, country TEXT NOT NULL, created_at INTEGER NOT NULL);
