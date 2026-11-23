import { formatMoney, getCountry } from "@/config/countries";
import { getMessages } from "@/i18n";
import { getReigns, getLaunches } from "@/lib/board";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/[<>&'"]/g, (ch) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[ch]!);

/**
 * RSS per edition: every crown change + today's launches.
 * Feeds aggregators (discovery/backlinks) and powers the "the crown fell" social bot
 * (IFTTT/Zapier/Make: RSS → X/Threads/Telegram) with zero extra code.
 */
export async function GET(_req: Request, ctx: RouteContext<"/[country]/feed.xml">) {
  const c = getCountry((await ctx.params).country);
  if (!c) return new Response("Not found", { status: 404 });
  const m = getMessages(c);
  const [reigns, launches] = await Promise.all([getReigns(c.slug), getLaunches(c, "week")]);

  const items = [
    ...reigns.map((r) => ({
      title: `👑 ${r.name} — #1 · ${formatMoney(r.bidAtStart, c)}`,
      link: `${SITE_URL}/${c.slug}/hall-of-fame#${r.id}`,
      date: r.startedAt,
      guid: `reign-${r.id}`,
    })),
    ...launches.map((l) => ({
      title: `🚀 ${l.name}${l.tagline ? ` — ${l.tagline}` : ""}`,
      link: `${SITE_URL}/${c.slug}/launches`,
      date: l.createdAt,
      guid: `launch-${l.id}`,
    })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 50);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(c.edition)}</title>
  <link>${SITE_URL}/${c.slug}</link>
  <atom:link href="${SITE_URL}/${c.slug}/feed.xml" rel="self" type="application/rss+xml"/>
  <description>${esc(m.newsletter.sub)}</description>
  <language>${c.locale.toLowerCase()}</language>
${items
  .map(
    (i) => `  <item>
    <title>${esc(i.title)}</title>
    <link>${i.link}</link>
    <guid isPermaLink="false">${i.guid}</guid>
    <pubDate>${new Date(i.date).toUTCString()}</pubDate>
  </item>`,
  )
  .join("\n")}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
