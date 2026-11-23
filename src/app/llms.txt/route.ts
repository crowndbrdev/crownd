import { COUNTRIES, formatMoney } from "@/config/countries";
import { getAllCrowns } from "@/lib/board";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * llms.txt (llmstxt.org): the short, link-rich map of the site for AI answer engines (GEO).
 * Facts first, in plain sentences an LLM can quote; live #1 per edition; deeper detail in /llms-full.txt.
 */
export async function GET() {
  const crowns = await getAllCrowns();
  const lines = [
    "# Crownd",
    "",
    `> Crownd (crownd.dev) is a network of public leaderboards of independent (indie) software products, with one edition per country in ${COUNTRIES.length} countries.`,
    "> Makers pay in their local currency to rank; the highest total bid holds #1 (the crown). Ten free launch slots per country per day are ranked by unique clicks.",
    "",
    "Crownd launched on 13 November 2026. There are no upvotes and no algorithm: rank is decided only by the total amount paid for a link, and every change of #1 is recorded publicly in a Hall of Fame. Payments are processed by Stripe in each edition's own currency.",
    "",
    "## How ranking works",
    "- Position = total amount paid for a link. Ties: whoever reached the amount first stays ahead.",
    "- Raising your own listing costs only the difference.",
    "- Free launches: 10 slots per edition per day, ranked by unique clicks, reset at local midnight.",
    "- Every change of #1 is recorded in each edition's Hall of Fame.",
    "- Allowed links: product sites, app store pages, GitHub repos and X profiles. Not allowed: chat/invite links, URL shorteners, adult content.",
    "",
    "## Editions (live #1)",
    ...COUNTRIES.map((c) => {
      const k = crowns.get(c.slug);
      return `- [${c.edition}](${SITE_URL}/${c.slug}): ${c.nameEn}, ${c.locale}, ${c.currency}. ${k ? `#1 now: ${k.name} (${formatMoney(k.bidTotal, c)})` : "The throne is empty"}.`;
    }),
    "",
    "## Docs",
    `- [Launch guide, Brazil](${SITE_URL}/br/guide): where makers gather, how people pay, legal requirements and live #1 price. Every edition has one at /{edition}/guide.`,
    `- [Launch guide, USA](${SITE_URL}/us/guide)`,
    `- [Rules](${SITE_URL}/us/rules): bids, ties, refunds and allowed links (localised at /{edition}/rules).`,
    `- [Hall of Fame](${SITE_URL}/us/hall-of-fame): every product that held #1 and for how long.`,
    `- [Free launches](${SITE_URL}/us/launches): today's free launch slots.`,
    `- [Public analytics](${SITE_URL}/analytics): visitors and pageviews, open to everyone.`,
    "",
    "## Data",
    `- Board JSON per edition: ${SITE_URL}/api/board/{edition} (e.g. ${SITE_URL}/api/board/br)`,
    `- RSS of crown changes per edition: ${SITE_URL}/{edition}/feed.xml`,
    "",
    "## Optional",
    `- [Full details for every edition](${SITE_URL}/llms-full.txt): prices, minimum bids, refund windows and FAQ for all ${COUNTRIES.length} countries.`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, s-maxage=600" } });
}
