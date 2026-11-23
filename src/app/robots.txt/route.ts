import { SITE_URL } from "@/lib/seo";

/**
 * robots.txt as a route (Next's MetadataRoute.Robots can't emit Content-Signal lines).
 *
 * GEO: one `*` group allows every search engine AND every AI crawler (GPTBot, OAI-SearchBot,
 * ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot…): being quoted by
 * answer engines is the goal, so nothing is blocked by name.
 * Content-Signal (contentsignals.org, read by Cloudflare and a growing list of AI vendors)
 * states the same intent explicitly: search, AI answers and AI training are all permitted.
 * Read-only JSON (/api/board) and badges are crawlable; side-effect endpoints are not.
 */
export function GET() {
  const body = [
    "# Crownd: crawlers welcome. Search, AI answers and AI training are all allowed.",
    "# Summary for AI systems: " + `${SITE_URL}/llms.txt` + " (full: " + `${SITE_URL}/llms-full.txt` + ")",
    "",
    "User-Agent: *",
    "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
    "Allow: /",
    "Allow: /api/badge/",
    "Allow: /api/board/",
    "Disallow: /api/",
    "Disallow: /go/",
    "Disallow: /*/checkout/",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
    "# Yandex: tracking and deep-link parameters don't change the page (avoids duplicates).",
    "Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&ref&bid",
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
