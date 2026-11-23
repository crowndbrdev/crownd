import type { Metadata } from "next";
import Link from "next/link";
import { COUNTRIES, formatMoney, fromMinor } from "@/config/countries";
import { getMessages } from "@/i18n";
import { getAllCrowns } from "@/lib/board";
import { SITE_URL, jsonLd, organizationLd } from "@/lib/seo";
import { CrownMark } from "@/components/Logo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    languages: { ...Object.fromEntries(COUNTRIES.map((c) => [c.locale, `${SITE_URL}/${c.slug}`])), "x-default": SITE_URL },
  },
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function Hub() {
  const crowns = await getAllCrowns();
  const editions = COUNTRIES.map((c) => {
    const king = crowns.get(c.slug);
    return { c, m: getMessages(c), king, usd: king ? fromMinor(king.bidTotal, c) * c.usdRate : 0 };
  });
  const richest = [...editions].sort((a, b) => b.usd - a.usd)[0];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd(),
      {
        "@type": "WebSite", "@id": `${SITE_URL}/#site`, name: "Crownd", url: SITE_URL, inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#org` },
        hasPart: COUNTRIES.map((c) => ({ "@type": "WebSite", "@id": `${SITE_URL}/${c.slug}#site`, name: c.edition, url: `${SITE_URL}/${c.slug}`, inLanguage: c.locale })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <section className="pt-16 pb-12 sm:pt-24">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-2">
          <span className="live-dot h-2 w-2 rounded-full bg-coup" aria-hidden /> Live in {COUNTRIES.length} countries
        </p>
        <h1 className="max-w-4xl font-display text-[clamp(3rem,10vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">
          {COUNTRIES.length} crowns.<br />
          <span className="font-serif font-normal italic tracking-[-0.02em]">One world.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-2">
          Put your product in front of people discovering what&apos;s new, in {COUNTRIES.length} countries. Bid in your own currency
          for #1, get a public page built to be found, and keep the crown until someone outbids you. Or launch for free.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#editions" className="rounded-full bg-ink px-6 py-3 font-display font-bold text-paper hover:opacity-90">
            Claim your country&apos;s #1 <span className="inline-block">→</span>
          </a>
          <Link href="/us/where-to-launch" className="rounded-full border border-line-strong bg-surface px-6 py-3 font-display font-bold hover:border-ink">
            Where to launch your product
          </Link>
        </div>
        {richest?.king ? (
          <p className="mt-6 text-sm text-muted">
            Most valuable crown right now: <strong className="text-ink">{richest.king.name}</strong> in {richest.c.flag} {richest.c.nameEn} —{" "}
            <bdi className="tabular font-mono">{formatMoney(richest.king.bidTotal, richest.c)}</bdi> (≈ {usd.format(richest.usd)})
          </p>
        ) : null}
      </section>

      <section id="editions" aria-labelledby="map-title">
        <h2 id="map-title" className="mb-5 font-display text-3xl font-extrabold tracking-tight">The Crown Map</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {editions.map(({ c, m, king, usd: v }) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}`}
                hrefLang={c.locale}
                className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:border-ink"
              >
                <div className="h-1.5" style={{ background: c.accent.hex }} aria-hidden />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl" aria-hidden>{c.flag}</span>
                    <span className="font-mono text-xs text-muted">/{c.slug} · {c.currency}</span>
                  </div>
                  <p className="mt-2 font-semibold" lang={c.locale} dir={c.dir}>{c.nameLocal.split(" · ")[0]}</p>
                  <p className="text-xs text-muted" lang={c.locale} dir={c.dir}>{m.hero.title}</p>
                  <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
                    <CrownMark className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm font-semibold">{king?.name ?? "—"}</span>
                  </div>
                  {king ? (
                    <p className="tabular mt-1 font-mono text-sm">
                      <bdi>{formatMoney(king.bidTotal, c)}</bdi> <span className="text-muted">≈ {usd.format(v)}</span>
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
