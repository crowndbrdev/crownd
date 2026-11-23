import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney, formatNumber, fromMinor, getCountry, toMinor } from "@/config/countries";
import { getMessages, t } from "@/i18n";
import { priceForRank } from "@/lib/bidding";
import { getBoard } from "@/lib/board";
import { SITE_URL, jsonLd, ogFor, productAlternates } from "@/lib/seo";
import { Monogram } from "@/components/Board";
import { getGuide } from "@/i18n/guide";

export const dynamic = "force-dynamic";

/** Quality gate (claude-seo/seo-programmatic): thin listings stay out of the index until they have real copy. */
const isThin = (description: string) => description.trim().length < 20;

export async function generateMetadata({ params }: PageProps<"/[country]/p/[slug]">): Promise<Metadata> {
  const { country, slug } = await params;
  const c = getCountry(country);
  if (!c) return {};
  const board = await getBoard(c.slug);
  const idx = board.findIndex((l) => l.slug === slug);
  const l = board[idx];
  if (!l) return {};
  return {
    title: `${l.name} — #${idx + 1}`,
    description: l.description || `${l.name} · ${c.edition}`,
    alternates: productAlternates(c, slug),
    openGraph: ogFor(c, `/p/${slug}`, { title: `${l.name} — #${idx + 1} · ${c.edition}`, description: l.description || undefined }),
    robots: isThin(l.description) ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/[country]/p/[slug]">) {
  const { country, slug } = await params;
  const c = getCountry(country);
  if (!c) notFound();
  const m = getMessages(c);
  const board = await getBoard(c.slug);
  const idx = board.findIndex((l) => l.slug === slug);
  const l = board[idx];
  if (!l) notFound();
  const rank = idx + 1;
  const step = toMinor(c.minBid, c);
  const next = rank > 1 ? priceForRank(board, rank - 1, step, step) - l.bidTotal : step;
  const date = new Intl.DateTimeFormat(c.intlLocale ?? c.locale, { dateStyle: "long", timeZone: c.timezone });
  const pageUrl = `${SITE_URL}/${c.slug}/p/${l.slug}`;
  const embed = `<a href="${pageUrl}"><img src="${SITE_URL}/api/badge/${c.slug}/${l.slug}" alt="${l.name} #${rank} on ${c.edition}" width="220" height="54"></a>`;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": pageUrl, url: pageUrl, name: l.name, inLanguage: c.locale, about: { "@type": "Thing", name: l.name, url: l.url } },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.edition, item: `${SITE_URL}/${c.slug}` },
          { "@type": "ListItem", position: 2, name: l.name, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <article className="max-w-3xl pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <Link href={`/${c.slug}`} className="text-sm text-muted hover:text-ink">
        <span className="flip-rtl inline-block">←</span> {m.product.back}
      </Link>
      <div className={`mt-6 flex items-start gap-4 rounded-3xl p-6 ${rank === 1 ? "throne" : "border border-line bg-surface"}`}>
        <Monogram name={l.name} rank={rank} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">{l.name}</h1>
          <p className="mt-2 text-lg text-ink-2">{l.description}</p>
          <a href={`/go/${l.id}`} rel="sponsored nofollow" className="mt-4 inline-block rounded-full bg-ink px-5 py-2 text-sm font-bold text-paper">
            {m.product.visit} {l.host} <span className="flip-rtl inline-block">↗</span>
          </a>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {[
          [m.product.rank, `#${rank}`],
          [m.product.bid, formatMoney(l.bidTotal, c)],
          [m.board.clicks, formatNumber(l.clicks, c)],
          [m.product.since, date.format(l.createdAt)],
        ].map(([k, v]) => (
          <div key={k} className="bg-surface p-4">
            <dt className="text-xs uppercase tracking-wider text-muted">{k}</dt>
            <dd className="tabular mt-1 font-mono text-lg font-bold">{v}</dd>
          </div>
        ))}
      </dl>

      <a href={`/${c.slug}?bid=${fromMinor(l.bidTotal + next, c)}#bid`} className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink hover:brightness-110">
        {m.product.raise} (+{formatMoney(next, c)})
      </a>

      <section className="mt-12" id="badge">
        <h2 className="font-display text-2xl font-bold">{m.product.badgeTitle}</h2>
        <p className="mt-1 text-ink-2">{m.product.badgeSub}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/api/badge/${c.slug}/${l.slug}`} alt={`${l.name} #${rank}`} width={220} height={54} className="mt-4" />
        <pre className="mt-4 overflow-x-auto rounded-xl bg-ink p-4 text-xs text-paper" dir="ltr"><code>{embed}</code></pre>
      </section>
      {/* Internal links: neighbours on the board + the edition's pillar guide (hub-and-spoke). */}
      <nav aria-label={m.board.title} className="mt-12 border-t border-line pt-6">
        <h2 className="font-display text-xl font-bold">{m.board.title}</h2>
        <ul className="mt-3 space-y-1.5">
          {board.slice(Math.max(0, idx - 2), idx + 3).filter((x) => x.id !== l.id).map((x) => (
            <li key={x.id}>
              <Link href={`/${c.slug}/p/${x.slug}`} className="hover:underline">
                <span className="tabular font-mono text-sm text-muted">#{board.indexOf(x) + 1}</span> <span className="font-semibold">{x.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link href={`/${c.slug}/guide`} className="underline underline-offset-4">{getGuide(c.lang, c.slug).nav} →</Link>
          <span className="text-muted"> · {t(m.board.total, { n: board.length })}</span>
        </p>
      </nav>
    </article>
  );
}
