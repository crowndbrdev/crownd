import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES, formatMoney, formatNumber, getCountry, toMinor } from "@/config/countries";
import { getMessages, t } from "@/i18n";
import { priceForRank } from "@/lib/bidding";
import { getBoard, getCurrentReign, getLaunches, getTotals } from "@/lib/board";
import { SITE_URL, jsonLd, organizationLd } from "@/lib/seo";
import { BidForm } from "@/components/BidForm";
import { Board } from "@/components/Board";
import { Throne } from "@/components/Throne";
import { NewsletterForm } from "@/components/Forms";
import { LiveStats } from "@/components/Analytics";
import { analyticsUrl, liveStats } from "@/lib/analytics";
import { buildFaq } from "@/lib/faq";
import { outbidEmailsLive } from "@/lib/mail";
import { ResetCountdown } from "@/components/Countdown";

export const dynamic = "force-dynamic";

export default async function EditionHome({ params }: PageProps<"/[country]">) {
  const c = getCountry((await params).country);
  if (!c) notFound();
  const m = getMessages(c);
  const step = toMinor(c.minBid, c);

  const [board, reign, launches, totals, live] = await Promise.all([
    getBoard(c.slug), getCurrentReign(c.slug), getLaunches(c, "today"), getTotals(), liveStats(),
  ]);
  const king = board[0];
  const challenge = priceForRank(board, 1, step, step);
  const initialTotal = challenge;
  const vars = { country: m.country, demonym: m.demonym };

  const rows = board.map((l, i) => ({
    id: l.id, slug: l.slug, name: l.name, description: l.description, host: l.host,
    bidTotal: l.bidTotal, clicks: l.clicks, takePrice: priceForRank(board, i + 1, step, step),
  }));

  const faq = buildFaq(c, m, board);
  const pageUrl = `${SITE_URL}/${c.slug}`;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd(),
      {
        "@type": "WebSite", "@id": `${pageUrl}#site`, name: c.edition, url: pageUrl, inLanguage: c.locale,
        description: t(m.meta.description, vars), publisher: { "@id": `${SITE_URL}/#org` },
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#site`, name: "Crownd", url: SITE_URL },
      },
      // FAQPage (AEO): Google no longer shows FAQ rich results for most sites, but answer engines
      // (AI Overviews, ChatGPT search, Perplexity, Copilot) read Q&A markup that mirrors visible text.
      {
        "@type": "FAQPage", "@id": `${pageUrl}#faq`, inLanguage: c.locale,
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "ItemList", name: m.board.title, itemListOrder: "https://schema.org/ItemListOrderDescending", numberOfItems: board.length,
        itemListElement: board.slice(0, 30).map((l, i) => ({ "@type": "ListItem", position: i + 1, name: l.name, url: `${SITE_URL}/${c.slug}/p/${l.slug}` })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <section className="pt-12 pb-8 sm:pt-20">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-2">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
          {t(m.hero.kicker, vars)}
        </p>
        <h1 className="font-display text-[clamp(2.75rem,9vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
          {m.hero.title}
        </h1>
        <p className="mt-4 font-serif text-2xl italic text-ink-2 sm:text-3xl">{m.hero.taunt}</p>
        {/* Benefit-led subheadline (CRO): what the buyer gets, not how the board works. */}
        <p className="mt-5 max-w-2xl text-lg text-ink-2">{t(m.sell.sub, vars)}</p>
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <BidForm
            country={c.slug}
            board={board.map((b) => ({ id: b.id, key: b.key, bidTotal: b.bidTotal, reachedAt: b.reachedAt }))}
            initialTotal={initialTotal}
            m={{ hero: m.hero, checkout: m.checkout, errors: m.errors, launches: m.launches, sell: m.sell, nav: m.nav, edition: c.edition, alert: outbidEmailsLive() ? m.mail.promise : null }}
          />
          {/* Real scarcity: the actual state of the throne, from the live board. */}
          <p className="mt-4 px-2 font-semibold text-ink">
            {king ? "👑 " : "🪑 "}
            {king
              ? t(m.sell.taken, { country: m.country, amount: formatMoney(challenge, c) })
              : t(m.sell.empty, { country: m.country, min: formatMoney(step, c), hall: m.nav.hall })}
          </p>
          <p className="mt-2 px-2 text-sm text-muted">{m.hero.topup}</p>
          <a href="#board-title" className="mt-3 ms-2 inline-block text-sm font-semibold underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            {m.sell.explore} <span className="flip-rtl inline-block">→</span>
          </a>
        </div>
        <aside className="space-y-4">
          <LiveStats
            initial={live}
            locale={c.intlLocale ?? c.locale}
            href={analyticsUrl()}
            labels={{ online: m.stats.online, since: m.stats.since, analytics: m.stats.analytics }}
          />
          <div className="rounded-2xl border border-line bg-surface p-5">
            <ResetCountdown timeZone={c.timezone} label={m.sell.resets} />
            <p className="mt-3 text-ink-2">{t(m.launches.sub, { slots: 10 })}</p>
            <Link href={`/${c.slug}/launches`} className="mt-3 inline-block rounded-full border border-line-strong px-4 py-2 text-sm font-semibold hover:border-ink">
              {m.launches.submit} <span className="flip-rtl inline-block">→</span>
            </Link>
          </div>
        </aside>
        </div>
      </section>

      <Throne c={c} m={m} king={king} since={reign?.startedAt} serverNow={reign?.fetchedAt ?? 0} challengePrice={challenge} />

      <ul className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line text-center">
        {[
          t(m.stats.products, { n: formatNumber(board.length, c) }),
          t(m.stats.clicks, { n: formatNumber(totals.clicks, c) }),
          t(m.stats.editions, { n: COUNTRIES.length }),
        ].map((s) => (
          <li key={s} className="bg-surface px-2 py-4 text-xs text-ink-2 sm:text-sm">{s}</li>
        ))}
      </ul>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {[
          [m.how.s1, m.how.s1d],
          [m.how.s2, m.how.s2d],
          [m.how.s3, outbidEmailsLive() ? `${m.how.s3d} ${m.mail.promise}` : m.how.s3d],
        ].map(([h, d], i) => (
          <div key={h} className="rounded-2xl border border-line bg-surface p-5">
            <span className="font-mono text-sm font-bold text-accent">0{i + 1}</span>
            <h2 className="mt-2 font-display text-xl font-bold">{h}</h2>
            <p className="mt-1 text-sm text-ink-2">{d}</p>
          </div>
        ))}
      </section>

      {/* What a bid buys: concrete, verifiable deliverables + an explicit "no guarantees" line (trust). */}
      <section className="mt-16" aria-labelledby="value-title">
        <h2 id="value-title" className="font-display text-3xl font-extrabold tracking-tight">{m.sell.valueTitle}</h2>
        <p className="mt-2 max-w-2xl text-ink-2">{m.sell.valueSub}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([
            ["👑", m.sell.v1t, m.sell.v1d],
            ["📄", m.sell.v2t, m.sell.v2d],
            ["🏷️", m.sell.v3t, m.sell.v3d],
            ["∞", m.sell.v4t, m.sell.v4d],
            ["📈", m.sell.v5t, m.sell.v5d],
            ["🏛️", m.sell.v6t, m.sell.v6d],
          ] as const).map(([icon, title, desc]) => (
            <li key={title} className="rounded-2xl border border-line bg-surface p-5">
              <span className="text-2xl" aria-hidden>{icon}</span>
              <h3 className="mt-2 font-display text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-ink-2">{t(desc, { edition: c.edition, hall: m.nav.hall })}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-3xl text-sm text-muted">{m.sell.honest}</p>
        <a href="#bid" className="mt-5 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink hover:brightness-110">
          {m.hero.cta} <span className="flip-rtl inline-block">→</span>
        </a>
      </section>

      <section className="mt-16" aria-labelledby="board-title">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="board-title" className="font-display text-3xl font-extrabold tracking-tight">{m.board.title}</h2>
          <span className="text-sm text-muted">{t(m.board.total, { n: formatNumber(board.length, c) })}</span>
        </div>
        <Board country={c.slug} rows={rows} labels={{ search: m.board.search, clicks: m.board.clicks, take: m.board.take, empty: m.board.empty }} />
      </section>

      <section className="mt-16 grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="font-display text-2xl font-extrabold">{m.launches.title}</h2>
          <p className="mt-2 text-sm text-ink-2">{t(m.launches.sub, { slots: 10 })}</p>
          <Link href={`/${c.slug}/launches`} className="mt-4 inline-block rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-ink hover:brightness-110">
            {m.launches.submit} <span className="flip-rtl inline-block">→</span>
          </Link>
        </div>
        <ol className="space-y-2">
          {launches.length === 0 ? <li className="text-sm text-muted">{m.launches.empty}</li> : null}
          {launches.slice(0, 4).map((l, i) => (
            <li key={l.id} className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2">
              <span className="tabular w-6 font-mono text-xs font-bold text-muted">{i + 1}</span>
              <a href={`/go/${l.id}`} rel="nofollow ugc" className="min-w-0 flex-1 truncate text-sm font-semibold hover:underline">
                {l.name} <span className="font-normal text-muted">— {l.tagline}</span>
              </a>
              <span className="tabular font-mono text-xs text-muted">{formatNumber(l.clicks, c)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16" aria-labelledby="faq-title">
        <h2 id="faq-title" className="mb-5 font-display text-3xl font-extrabold tracking-tight">{m.faq.title}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {faq.map((f) => (
            <div key={f.q} className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-ink-2">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-ink p-6 text-paper sm:p-10">
        <h2 className="font-display text-3xl font-extrabold">{m.newsletter.title}</h2>
        <p className="mt-2 max-w-lg text-paper/70">{m.newsletter.sub}</p>
        <div className="mt-5 max-w-xl [&_input]:border-paper/20 [&_input]:bg-paper/10 [&_input]:text-paper [&_button]:bg-gold [&_button]:text-[#0e0d12]">
          <NewsletterForm country={c.slug} labels={{ ph: m.newsletter.ph, cta: m.newsletter.cta }} />
        </div>
      </section>
    </>
  );
}
