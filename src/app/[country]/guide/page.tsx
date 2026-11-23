import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney, fromMinor, getCountry, toMinor } from "@/config/countries";
import { LOCAL_TOOLS } from "@/config/tools";
import { getMessages, t } from "@/i18n";
import { PAYMENT_NAMES, getGuide } from "@/i18n/guide";
import { priceForRank } from "@/lib/bidding";
import { getBoardSnapshot } from "@/lib/board";
import { SITE_URL, editionAlternates, jsonLd, ogFor } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[country]/guide">): Promise<Metadata> {
  const c = getCountry((await params).country);
  if (!c) return {};
  const m = getMessages(c);
  const g = getGuide(c.lang, c.slug);
  const vars = { country: m.country, demonym: m.demonym };
  return {
    title: t(g.title, vars),
    description: t(g.description, vars),
    alternates: editionAlternates(c, "/guide"),
    openGraph: ogFor(c, "/guide", { type: "article", title: t(g.title, vars), description: t(g.description, vars) }),
  };
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 font-display text-2xl font-bold tracking-tight">{children}</h2>;
}

/**
 * Pillar page per edition. Unique per country by construction: communities, payment habits,
 * local stack, legal duties, search engines and LIVE board prices all come from country data.
 */
export default async function GuidePage({ params }: PageProps<"/[country]/guide">) {
  const c = getCountry((await params).country);
  if (!c) notFound();
  const m = getMessages(c);
  const g = getGuide(c.lang, c.slug);
  const vars = { country: m.country, demonym: m.demonym };
  const { board, updatedAt } = await getBoardSnapshot(c.slug);
  const step = toMinor(c.minBid, c);
  const king = board[0];
  const date = new Intl.DateTimeFormat(c.intlLocale ?? c.locale, { dateStyle: "long", timeZone: c.timezone });
  const url = `${SITE_URL}/${c.slug}/guide`;
  const title = t(g.title, vars);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article", "@id": `${url}#article`, headline: title, description: t(g.description, vars), inLanguage: c.locale,
        url, mainEntityOfPage: url, dateModified: new Date(updatedAt).toISOString(), datePublished: "2026-11-13T00:00:00Z",
        author: { "@type": "Organization", name: "Crownd", url: SITE_URL },
        publisher: { "@type": "Organization", name: "Crownd", logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/crownd-mark.svg` } },
        about: { "@type": "Country", name: c.nameEn },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.edition, item: `${SITE_URL}/${c.slug}` },
          { "@type": "ListItem", position: 2, name: g.nav, item: url },
        ],
      },
    ],
  };

  return (
    <article className="max-w-3xl pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href={`/${c.slug}`} className="hover:text-ink">{c.edition}</Link> / <span>{g.nav}</span>
      </nav>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">
        <time dateTime={new Date(updatedAt).toISOString()}>{t(g.updated, { date: date.format(updatedAt) })}</time>
      </p>
      <p className="mt-6 text-lg text-ink-2">{t(g.intro, vars)}</p>

      <H2>{g.hPrice}</H2>
      <p className="mt-3 text-ink-2">
        {king
          ? t(g.price, { amount: formatMoney(king.bidTotal, c), n: board.length, min: formatMoney(step, c) })
          : t(g.priceEmpty, { min: formatMoney(step, c) })}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/${c.slug}?bid=${fromMinor(priceForRank(board, 1, step, step), c)}#bid`} className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink hover:brightness-110">{m.hero.cta}</Link>
        <Link href={`/${c.slug}/launches`} className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold hover:border-ink">{m.launches.submit}</Link>
      </div>

      <H2>{g.hCommunities}</H2>
      <p className="mt-3 text-ink-2">{t(g.communities, vars)}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {c.communities.map((x) => (
          <li key={x} className="rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium">{x}</li>
        ))}
      </ul>

      <H2>{g.hPayments}</H2>
      <p className="mt-3 text-ink-2">{g.payments}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {c.paymentMethods.map((pm) => (
          <li key={pm} className="rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold">{pm === "card" ? g.cards : PAYMENT_NAMES[pm] ?? pm}</li>
        ))}
      </ul>

      <H2>{g.hTools}</H2>
      <ul className="mt-4 space-y-2">
        {(LOCAL_TOOLS[c.slug] ?? []).map((x) => (
          <li key={x.name} className="rounded-xl border border-line bg-surface px-4 py-3">
            <a href={x.url} rel="noopener" target="_blank" className="font-semibold hover:underline">{x.name}</a>
            <span className="text-ink-2"> — {x.desc}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm"><Link href={`/${c.slug}/tools`} className="underline underline-offset-4">{m.nav.tools} →</Link></p>

      <H2>{g.hLegal}</H2>
      <p className="mt-3 text-ink-2">{t(g.legal, { legal: c.legalPage.title })}</p>
      <p className="mt-2 text-ink-2">{c.withdrawalDays > 0 ? t(g.withdrawal, { days: c.withdrawalDays }) : g.withdrawalNone}</p>

      <H2>{g.hSearch}</H2>
      <p className="mt-3 text-ink-2">{g.search}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {c.searchEngines.map((s) => (
          <li key={s} className="rounded-full border border-line px-3 py-1.5 text-sm">{s}</li>
        ))}
      </ul>

      {board.length ? (
        <>
          <H2>{m.board.title}</H2>
          <ol className="mt-4 space-y-1.5">
            {board.slice(0, 5).map((l, i) => (
              <li key={l.id} className="flex items-baseline gap-3">
                <span className="tabular w-8 font-mono text-sm font-bold text-muted">#{i + 1}</span>
                <Link href={`/${c.slug}/p/${l.slug}`} className="font-semibold hover:underline">{l.name}</Link>
                <span className="truncate text-sm text-muted">{l.description}</span>
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </article>
  );
}
