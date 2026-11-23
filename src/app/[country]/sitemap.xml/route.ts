import { getCountry } from "@/config/countries";
import { getBoardSnapshot } from "@/lib/board";
import { SHARED_PATHS, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * Per-edition sitemap (/br/sitemap.xml, /jp/sitemap.xml…).
 * Search Console only accepts sitemaps INSIDE a URL-prefix property, so a property for
 * https://crownd.dev/br/ (per-country reporting) can't use the root /sitemap.xml.
 * Same rules as the root sitemap: real lastmod, thin product pages excluded.
 */
export async function GET(_req: Request, ctx: RouteContext<"/[country]/sitemap.xml">) {
  const c = getCountry((await ctx.params).country);
  if (!c) return new Response("Not found", { status: 404 });
  const { board, updatedAt } = await getBoardSnapshot(c.slug);
  const iso = (ms: number) => new Date(ms).toISOString();

  const urls: { loc: string; lastmod?: string }[] = SHARED_PATHS.map((path) => ({
    loc: `${SITE_URL}/${c.slug}${path}`,
    ...(path === "" || path === "/hall-of-fame" || path === "/guide" ? { lastmod: iso(updatedAt) } : {}),
  }));
  for (const l of board) {
    if (l.description.trim().length < 20) continue;
    urls.push({ loc: `${SITE_URL}/${c.slug}/p/${l.slug}`, lastmod: iso(l.reachedAt) });
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`),
    "</urlset>",
  ].join("\n");
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=600" } });
}
