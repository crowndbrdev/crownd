import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountry } from "@/config/countries";
import { getMessages, t } from "@/i18n";
import { getGuide } from "@/i18n/guide";
import { GLOBAL_LAUNCH_SITES, getLaunchSites } from "@/i18n/launchSites";
import { LAUNCH_SLOTS } from "@/lib/board";
import { SITE_URL, editionAlternates, jsonLd, ogFor, organizationLd } from "@/lib/seo";

/**
 * Pillar page for "where to launch my product in {country}" searches: high intent, evergreen,
 * and the natural next step is launching here. Static content + country data, so it's cacheable.
 */
function vars(slug: string) {
  const c = getCountry(slug)!;
  const m = getMessages(c);
  return { c, m, g: getLaunchSites(c.lang, c.slug), n: 1 + GLOBAL_LAUNCH_SITES.length + c.communities.length };
}

export async function generateMetadata({ params }: PageProps<"/[country]/where-to-launch">): Promise<Metadata> {
  const c = getCountry((await params).country);
  if (!c) return {};
  const { m, g, n } = vars(c.slug);
  const v = { n, country: m.country, demonym: m.demonym, slots: LAUNCH_SLOTS };
  return {
    // Absolute title: the long edition suffix would push it past ~60 chars in search results.
    title: { absolute: `${t(g.title, v)} · Crownd` },
    description: t(g.description, v),
    alternates: editionAlternates(c, "/where-to-launch"),
    openGraph: ogFor(c, "/where-to-launch", { type: "article", title: t(g.title, v), description: t(g.description, v) }),
  };
}

export default async function WhereToLaunch({ params }: PageProps<"/[country]/where-to-launch">) {
  const c = getCountry((await params).country);
  if (!c) notFound();
  const { m, g, n } = vars(c.slug);
  const v = { n, country: m.country, demonym: m.demonym, slots: LAUNCH_SLOTS };
  const url = `${SITE_URL}/${c.slug}/where-to-launch`;
  const title = t(g.title, v);
  const price = { free: g.free, freemium: g.freemium, paid: g.paid };
  const kind = { launch: g.launch, community: g.community, directory: g.directory, newsletter: g.newsletter, social: g.social };

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd(),
      {
        "@type": "Article", "@id": `${url}#article`, headline: title, description: t(g.description, v), inLanguage: c.locale, url,
        mainEntityOfPage: url, datePublished: "2026-11-17T00:00:00Z", dateModified: "2026-11-17T00:00:00Z",
        author: { "@id": `${SITE_URL}/#org` }, publisher: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "ItemList", name: title, numberOfItems: n,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.edition, url: `${SITE_URL}/${c.slug}/launches` },
          ...GLOBAL_LAUNCH_SITES.map((s, i) => ({ "@type": "ListItem", position: i + 2, name: s.name, url: s.url })),
        ],
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
      <p className="mt-5 text-lg text-ink-2">{g.intro}</p>

      <section className="mt-10 rounded-3xl border-2 border-gold bg-gold-soft p-6">
        <p className="font-mono text-sm font-bold text-ink">01</p>
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">{g.hCrownd}</h2>
        <p className="mt-2 text-ink-2">{t(g.crownd, v)}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/${c.slug}/launches`} className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-paper hover:opacity-90">
            {g.cta} <span className="flip-rtl inline-block">→</span>
          </Link>
          <Link href={`/${c.slug}`} className="rounded-full border border-line-strong bg-surface px-5 py-2.5 text-sm font-bold hover:border-ink">
            {m.hero.cta}
          </Link>
        </div>
      </section>

      <h2 className="mt-12 font-display text-2xl font-bold tracking-tight">{g.hGlobal}</h2>
      <p className="mt-2 text-ink-2">{g.global}</p>
      <ol className="mt-5 space-y-2" start={2}>
        {GLOBAL_LAUNCH_SITES.map((s, i) => (
          <li key={s.url} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-line bg-surface px-4 py-3">
            <span className="tabular w-7 font-mono text-sm font-bold text-muted">{String(i + 2).padStart(2, "0")}</span>
            <a href={s.url} rel="nofollow noopener" target="_blank" className="font-semibold hover:underline">{s.name}</a>
            <span className="text-xs text-muted">{kind[s.kind]}{s.tags ? ` · ${s.tags}` : ""}</span>
            <span className={`ms-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.price === "free" ? "bg-surface-2 text-ink" : "bg-surface-2 text-muted"}`}>{price[s.price]}</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 font-display text-2xl font-bold tracking-tight">{t(g.hLocal, v)}</h2>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {c.communities.map((x) => (
          <li key={x} className="rounded-2xl border border-line bg-surface px-4 py-3 font-semibold">{x}</li>
        ))}
      </ul>
      <p className="mt-6 rounded-2xl bg-surface-2 p-4 text-ink-2">💡 {g.tip}</p>

      <p className="mt-10 text-sm">
        <Link href={`/${c.slug}/guide`} className="font-semibold underline decoration-line-strong underline-offset-4 hover:decoration-ink">
          {t(getGuide(c.lang, c.slug).title, { country: m.country, demonym: m.demonym })} <span className="flip-rtl inline-block">→</span>
        </Link>
      </p>
    </article>
  );
}
