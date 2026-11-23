import { COUNTRIES, formatMoney, getCountry, toMinor } from "@/config/countries";
import { getMessages } from "@/i18n";
import { getBoardSnapshot } from "@/lib/board";
import { buildFaq } from "@/lib/faq";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * llms-full.txt: every fact an answer engine needs to answer "how much / how / where" about any
 * edition without crawling 120 pages. English only (LLMs translate), numbers live from D1.
 */
export async function GET() {
  const snaps = await Promise.all(COUNTRIES.map(async (c) => ({ c, ...(await getBoardSnapshot(c.slug)) })));
  const us = getCountry("us")!;
  const faq = buildFaq(us, getMessages(us), snaps.find((s) => s.c.slug === "us")?.board ?? []);

  const out = [
    "# Crownd: full reference",
    "",
    `> Public leaderboards of indie software products, one per country (${COUNTRIES.length} countries). The highest total bid holds #1. Ten free launch slots per day per country, ranked by unique clicks.`,
    "",
    "## FAQ (USA edition; every edition answers the same questions in its own language and currency)",
    "",
    ...faq.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Editions",
    "",
  ];
  for (const { c, board, updatedAt } of snaps) {
    const king = board[0];
    const min = formatMoney(toMinor(c.minBid, c), c);
    out.push(
      `### ${c.edition} (${c.nameEn})`,
      `- URL: ${SITE_URL}/${c.slug} · language ${c.locale} · currency ${c.currency}`,
      `- #1 now: ${king ? `${king.name} (${king.host}) with ${formatMoney(king.bidTotal, c)} in total` : `nobody; the first bid of ${min} takes the crown`}`,
      `- Products on the board: ${board.length} · minimum bid and step: ${min}`,
      `- Pin a free launch for 24h: ${formatMoney(toMinor(c.launchHighlight, c), c)} · featured tool band (3 days): ${formatMoney(toMinor(c.toolHighlight, c), c)}`,
      `- Refunds: ${c.withdrawalDays > 0 ? `${c.withdrawalDays}-day withdrawal right under local consumer law` : "bids are final once live (listings removed for breaking rules are refunded)"}`,
      `- Launch guide: ${SITE_URL}/${c.slug}/guide · Rules: ${SITE_URL}/${c.slug}/rules · Hall of Fame: ${SITE_URL}/${c.slug}/hall-of-fame`,
      `- Last board change: ${new Date(updatedAt).toISOString().slice(0, 10)}`,
      "",
    );
  }
  return new Response(out.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, s-maxage=600" } });
}
