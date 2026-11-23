import "server-only";
import { formatMoney, toMinor, type Country } from "@/config/countries";
import { t, type Messages } from "@/i18n";
import { getGuide } from "@/i18n/guide";
import { LAUNCH_SLOTS } from "./board";

/**
 * Edition FAQ (AEO): short, self-contained answers that answer engines can quote verbatim.
 * Questions are translated per language; every answer is assembled from strings that are
 * already localised (rules, guide, checkout), so FAQ, rules page and guide never disagree.
 * The cost answer uses the LIVE board, so the FAQPage JSON-LD is always current.
 */
export type FaqItem = { q: string; a: string };

export function buildFaq(c: Country, m: Messages, board: { bidTotal: number }[]): FaqItem[] {
  const step = toMinor(c.minBid, c);
  const money = (minor: number) => formatMoney(minor, c);
  const g = getGuide(c.lang, c.slug);
  const vars = { edition: c.edition, country: m.country, demonym: m.demonym };
  const rulesVars = { currency: c.currency, step: money(step), minBid: money(step), slots: LAUNCH_SLOTS,
    launchHighlight: money(toMinor(c.launchHighlight, c)), toolHighlight: money(toMinor(c.toolHighlight, c)), days: c.withdrawalDays };
  const king = board[0];

  return [
    { q: t(m.faq.what, vars), a: `${t(m.hero.sub, vars)} ${t(m.rules.items[8], rulesVars)}` },
    {
      q: m.sell.faqGet,
      a: [m.sell.v1d, m.sell.v2d, m.sell.v3d, m.sell.v6d].map((x) => t(x, { edition: c.edition, hall: m.nav.hall })).join(" "),
    },
    { q: m.sell.faqLong, a: m.sell.v4d },
    {
      q: t(m.faq.cost, vars),
      a: king
        ? t(g.price, { amount: money(king.bidTotal), n: board.length, min: money(step) })
        : t(g.priceEmpty, { min: money(step) }),
    },
    { q: t(m.faq.free, vars), a: t(m.rules.items[6], rulesVars) },
    { q: t(m.faq.raise, vars), a: t(m.rules.items[2], rulesVars) },
    { q: t(m.faq.pay, vars), a: `${t(m.rules.items[0], rulesVars)} ${m.checkout.note}` },
    {
      q: t(m.faq.refund, vars),
      a: `${c.withdrawalDays > 0 ? t(m.rules.refundDays, rulesVars) : m.rules.refundNone} ${m.rules.refundRemoved}`,
    },
  ];
}
