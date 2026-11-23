/**
 * Pure bidding rules. No I/O here — everything is unit-tested in bidding.test.ts.
 *
 * Rules (improved from the reference site):
 *  - A listing's position is decided by its total paid (bidTotal, minor units).
 *  - Equal totals: whoever reached that total first stays ahead.
 *  - Raising your own listing: pay only the difference, at least one step.
 *  - Stores (App Store / Play / Chrome Web Store) and GitHub are keyed by path,
 *    so two apps on the same host never share a bid.
 */

export type BoardEntry = {
  id: string;
  key: string;
  bidTotal: number;
  /** ms epoch when bidTotal was last reached */
  reachedAt: number;
};

const PATH_KEYED_HOSTS = new Set([
  "apps.apple.com",
  "github.com",
  "chromewebstore.google.com",
  "marketplace.visualstudio.com",
  "x.com",
]);

const BLOCKED_HOSTS = [
  "wa.me", "chat.whatsapp.com", "whatsapp.com", "t.me", "telegram.me", "telegram.org",
  "discord.gg", "discord.com", "signal.me", "signal.group", "m.me", "messenger.com",
  "line.me", "open.kakao.com",
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "ow.ly", "rebrand.ly", "cutt.ly",
];

const ADULT_HINTS = ["porn", "xxx", "onlyfans", "xvideos", "sex", "escort", "nsfw"];

export type NormalizedUrl = { url: string; key: string; host: string };

export class ListingError extends Error {
  constructor(public code: "invalid_url" | "blocked_host" | "adult" | "shortener" | "too_low" | "step") {
    super(code);
  }
}

/** Accepts a URL, a bare domain or an @handle (mapped to x.com). */
export function normalizeUrl(input: string): NormalizedUrl {
  let raw = input.trim();
  if (!raw) throw new ListingError("invalid_url");

  if (/^@[A-Za-z0-9_]{1,30}$/.test(raw)) raw = `https://x.com/${raw.slice(1)}`;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;

  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new ListingError("invalid_url");
  }
  if (!u.hostname.includes(".")) throw new ListingError("invalid_url");

  let host = u.hostname.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
  if (host === "twitter.com") host = "x.com";

  const bare = host.split(".").slice(-2).join(".");
  if (BLOCKED_HOSTS.some((b) => host === b || host.endsWith(`.${b}`) || bare === b)) {
    const shorteners = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "ow.ly", "rebrand.ly", "cutt.ly"];
    throw new ListingError(shorteners.includes(host) ? "shortener" : "blocked_host");
  }
  if (ADULT_HINTS.some((w) => host.includes(w))) throw new ListingError("adult");

  const segments = u.pathname.split("/").filter(Boolean);
  let path = "";
  let keepQuery = "";

  if (host === "play.google.com") {
    const id = u.searchParams.get("id");
    if (!id) throw new ListingError("invalid_url");
    path = "/store/apps/details";
    keepQuery = `?id=${id}`;
  } else if (host === "github.com" || host === "x.com") {
    // github.com/org/repo  ·  x.com/handle
    const take = host === "github.com" ? 2 : 1;
    if (segments.length < take) throw new ListingError("invalid_url");
    path = "/" + segments.slice(0, take).join("/").toLowerCase();
  } else if (PATH_KEYED_HOSTS.has(host)) {
    path = "/" + segments.join("/");
  } else {
    // Product sites: keep the path (minus trailing slash) for the link, key by host.
    path = segments.length ? "/" + segments.join("/") : "";
  }

  const url = `https://${host}${path}${keepQuery}`;
  const pathKeyed = PATH_KEYED_HOSTS.has(host) || host === "play.google.com";
  const key = pathKeyed ? `${host}${path}${keepQuery}`.toLowerCase() : host;
  return { url, key, host };
}

/** Sort: highest total first; on a tie, whoever reached it first. */
export function sortBoard<T extends BoardEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.bidTotal - a.bidTotal || a.reachedAt - b.reachedAt);
}

/**
 * Minimum total needed to land at `rank` (1-based) on the current board.
 * A newcomer ties lose to incumbents, so they must beat the current holder by one step.
 */
export function priceForRank(board: BoardEntry[], rank: number, step: number, minBid: number): number {
  const sorted = sortBoard(board);
  const target = sorted[rank - 1];
  if (!target) return minBid;
  return Math.max(minBid, target.bidTotal + step);
}

export type Quote =
  | { kind: "new"; total: number; charge: number }
  | { kind: "raise"; listingId: string; previous: number; total: number; charge: number };

/**
 * Turn a desired total into what the buyer pays now.
 * Existing listing → pay the difference (≥ one step). New → pay the total (≥ minBid).
 */
export function quote(
  board: BoardEntry[],
  key: string,
  desiredTotal: number,
  step: number,
  minBid: number,
): Quote {
  if (!Number.isFinite(desiredTotal) || desiredTotal <= 0) throw new ListingError("too_low");
  const existing = board.find((e) => e.key === key);
  if (existing) {
    const charge = desiredTotal - existing.bidTotal;
    if (charge < step) throw new ListingError("step");
    return { kind: "raise", listingId: existing.id, previous: existing.bidTotal, total: desiredTotal, charge };
  }
  if (desiredTotal < minBid) throw new ListingError("too_low");
  return { kind: "new", total: desiredTotal, charge: desiredTotal };
}

/** 1-based rank a total would reach right now (ties go to incumbents). */
export function rankFor(board: BoardEntry[], total: number, key?: string): number {
  const others = sortBoard(board.filter((e) => e.key !== key));
  const ahead = others.filter((e) => e.bidTotal >= total).length;
  return ahead + 1;
}

export function formatDuration(ms: number, locale: string): string {
  const mins = Math.max(1, Math.floor(ms / 60000));
  if (mins < 60) return unit(mins, "minute", locale);
  const hours = Math.floor(mins / 60);
  if (hours < 48) return unit(hours, "hour", locale);
  return unit(Math.floor(hours / 24), "day", locale);
}

function unit(n: number, u: "minute" | "hour" | "day", locale: string) {
  return new Intl.NumberFormat(locale, { style: "unit", unit: u, unitDisplay: "long" }).format(n);
}
