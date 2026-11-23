import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatMoney, formatNumber, getCountry, toMinor } from "@/config/countries";
import { getMessages, t } from "@/i18n";
import { LAUNCH_SLOTS, getLaunches } from "@/lib/board";
import { editionAlternates, ogFor } from "@/lib/seo";
import { HighlightForm, LaunchForm } from "@/components/Forms";
import { Monogram } from "@/components/Board";
import { Tabs } from "@/components/Tabs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[country]/launches">): Promise<Metadata> {
  const c = getCountry((await params).country);
  if (!c) return {};
  const m = getMessages(c);
  return { title: m.launches.title, description: t(m.launches.sub, { slots: LAUNCH_SLOTS }), alternates: editionAlternates(c, "/launches"), openGraph: ogFor(c, "/launches") };
}

export default async function LaunchesPage({ params }: PageProps<"/[country]/launches">) {
  const c = getCountry((await params).country);
  if (!c) notFound();
  const m = getMessages(c);
  const [today, week] = await Promise.all([getLaunches(c, "today"), getLaunches(c, "week")]);
  const left = Math.max(0, LAUNCH_SLOTS - today.length);

  const renderList = (list: typeof today) => (
    <ol className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {list.length === 0 ? <li className="p-8 text-center text-muted">{m.launches.empty}</li> : null}
      {list.map((l, i) => (
        <li key={l.id} className={`flex items-center gap-3 px-4 py-3 ${l.pinned ? "bg-gold-soft" : ""}`}>
          <span className="tabular w-6 font-mono text-sm font-bold text-muted">{i + 1}</span>
          <Monogram name={l.name} />
          <div className="min-w-0 flex-1">
            <a href={`/go/${l.id}`} rel="nofollow ugc" className="font-semibold hover:underline">{l.name}</a>
            {l.pinned ? <span className="ms-2 rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-bold uppercase text-[#0e0d12]">{m.launches.featured}</span> : null}
            <p className="truncate text-sm text-muted">{l.tagline || l.host}</p>
          </div>
          <span className="tabular font-mono text-sm">{formatNumber(l.clicks, c)} <span className="text-muted">{m.board.clicks}</span></span>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="pt-12">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">{m.launches.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-2">{t(m.launches.sub, { slots: LAUNCH_SLOTS })}</p>

      <div className="mt-8">
        <p className="mb-2 text-sm font-semibold">{t(m.launches.slotsLeft, { n: left, total: LAUNCH_SLOTS })}</p>
        <LaunchForm
          country={c.slug}
          disabled={left === 0}
          labels={{ placeholder: m.hero.placeholder, namePh: m.launches.namePh, taglinePh: m.launches.taglinePh, submit: m.launches.submit, full: m.launches.full }}
        />
        <div className="mt-3">
          <HighlightForm
            country={c.slug}
            labels={{ cta: t(m.launches.highlight, { amount: formatMoney(toMinor(c.launchHighlight, c), c) }), url: m.hero.placeholder, email: m.checkout.email }}
          />
        </div>
      </div>

      <Tabs labels={[m.launches.today, m.launches.week]} panels={[renderList(today), renderList(week)]} />
    </div>
  );
}
