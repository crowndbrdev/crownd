import type { MetadataRoute } from "next";
import { COUNTRIES } from "@/config/countries";
import { getBoardSnapshot, getReignCounts } from "@/lib/board";
import { SHARED_PATHS, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * Hreflang lives in the HTML <head> only (claude-seo: pick ONE method; HTML suits < 50 variants).
 * lastModified reflects the real last data change per edition, never "now".
 * Thin product pages (noindex) are excluded.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const [snapshots, reigns] = await Promise.all([
    Promise.all(COUNTRIES.map(async (c) => ({ c, ...(await getBoardSnapshot(c.slug)) }))),
    getReignCounts(),
  ]);
  const newest = Math.max(...snapshots.map((s) => s.updatedAt));

  entries.push({ url: SITE_URL, lastModified: new Date(newest), changeFrequency: "hourly", priority: 1 });

  for (const { c, board, updatedAt } of snapshots) {
    for (const path of SHARED_PATHS) {
      // Empty Hall of Fame pages are noindex until the first crown (see hall-of-fame/page.tsx).
      if (path === "/hall-of-fame" && !reigns.get(c.slug)) continue;
      const live = path === "" || path === "/hall-of-fame" || path === "/guide";
      entries.push({
        url: `${SITE_URL}/${c.slug}${path}`,
        ...(live ? { lastModified: new Date(updatedAt) } : {}),
        changeFrequency: path === "" || path === "/launches" ? "hourly" : path === "/rules" || path === "/tools" || path === "/where-to-launch" ? "monthly" : "daily",
        priority: path === "" ? 0.9 : path === "/guide" || path === "/where-to-launch" ? 0.8 : 0.6,
      });
    }
    for (const l of board) {
      if (l.description.trim().length < 20) continue;
      entries.push({ url: `${SITE_URL}/${c.slug}/p/${l.slug}`, lastModified: new Date(l.reachedAt), changeFrequency: "daily", priority: 0.5 });
    }
  }
  return entries;
}
