import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Request guard for every state-changing endpoint:
 *  1. CSRF: cross-site POSTs are refused (Origin must match the host; Sec-Fetch-Site must not be cross-site).
 *  2. Size: bodies above `maxBytes` are refused before parsing (cheap DoS protection).
 *  3. Rate limit: Cloudflare's native rate limiter, keyed per client IP and bucket.
 * Returns a Response to send back when blocked, or null when the request may proceed.
 */
type Bucket = "write" | "track" | "click";
type Limiter = { limit(o: { key: string }): Promise<{ success: boolean }> };

const BINDING: Record<Bucket, string> = { write: "RL_WRITE", track: "RL_TRACK", click: "RL_TRACK" };

export function clientIp(req: NextRequest) {
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
}

export async function guard(
  req: NextRequest,
  opts: { bucket: Bucket; maxBytes?: number; sameOrigin?: boolean },
): Promise<NextResponse | null> {
  const { bucket, maxBytes = 8_192, sameOrigin = true } = opts;

  if (sameOrigin && req.method !== "GET") {
    const origin = req.headers.get("origin");
    const site = req.headers.get("sec-fetch-site");
    const host = req.headers.get("host");
    if (site === "cross-site") return deny(403);
    if (origin && host) {
      try {
        if (new URL(origin).host !== host) return deny(403);
      } catch {
        return deny(403);
      }
    }
  }

  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > maxBytes) return deny(413);

  const limiter = await rateLimiter(bucket);
  if (limiter) {
    const { success } = await limiter.limit({ key: `${bucket}:${clientIp(req)}` });
    if (!success) return deny(429, { "Retry-After": "60" });
  }
  return null;
}

async function rateLimiter(bucket: Bucket): Promise<Limiter | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const rl = (env as unknown as Record<string, Limiter | undefined>)[BINDING[bucket]];
    return rl && typeof rl.limit === "function" ? rl : null;
  } catch {
    return null;
  }
}

function deny(status: number, headers: Record<string, string> = {}) {
  const msg = status === 429 ? "Too many requests" : status === 413 ? "Payload too large" : "Forbidden";
  return NextResponse.json({ error: msg }, { status, headers });
}

export { cleanText } from "./text";
