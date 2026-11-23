import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SITE_URL } from "./seo";

/**
 * Freshness pipeline, called whenever the board changes:
 *  Pages are rendered at the edge per request (always live), so no cache purge is needed.
 *  IndexNow → Bing, Yandex, Naver and Seznam recrawl the changed URLs within minutes.
 *     (Google does not support IndexNow; it relies on the sitemap + Search Console.)
 */
export function refreshEdition(country: string, extraPaths: string[] = []) {
  const job = pingIndexNow([`/${country}`, `/${country}/hall-of-fame`, ...extraPaths].map((p) => `${SITE_URL}${p}`));
  // Workers cancel un-awaited work when the response ends; waitUntil keeps the ping alive.
  try {
    getCloudflareContext().ctx.waitUntil(job);
  } catch {
    void job;
  }
}

export async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || process.env.NODE_ENV !== "production" || !urls.length) return;
  const host = new URL(SITE_URL).host;
  await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `${SITE_URL}/indexnow.txt`, urlList: urls.slice(0, 10_000) }),
  }).catch(() => undefined);
}
