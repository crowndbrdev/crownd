import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatMoney, getCountry, toMinor } from "@/config/countries";
import { getMessages, t } from "@/i18n";
import { LAUNCH_SLOTS } from "@/lib/board";
import { editionAlternates, ogFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[country]/rules">): Promise<Metadata> {
  const c = getCountry((await params).country);
  if (!c) return {};
  const m = getMessages(c);
  const min = formatMoney(toMinor(c.minBid, c), c);
  const full = `${t(m.rules.items[0], { currency: c.currency, step: min, minBid: min })} ${t(m.rules.items[1], {})}`;
  // Search snippets cut around 160 chars: trim on a word boundary instead of mid-word.
  const description = full.length <= 160 ? full : `${full.slice(0, 157).replace(/\s+\S*$/, "")}…`;
  return { title: m.rules.title, description, alternates: editionAlternates(c, "/rules"), openGraph: ogFor(c, "/rules", { description }) };
}

export default async function RulesPage({ params }: PageProps<"/[country]/rules">) {
  const c = getCountry((await params).country);
  if (!c) notFound();
  const m = getMessages(c);
  const money = (major: number) => formatMoney(toMinor(major, c), c);
  const vars = {
    currency: c.currency, step: money(c.minBid), minBid: money(c.minBid), slots: LAUNCH_SLOTS,
    launchHighlight: money(c.launchHighlight), toolHighlight: money(c.toolHighlight), days: c.withdrawalDays,
  };
  return (
    <div className="max-w-3xl pt-12">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">{m.rules.title}</h1>
      <ol className="mt-8 space-y-3">
        {m.rules.items.map((item, i) => (
          <li key={i} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
            <span className="tabular font-mono text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
            <p className="text-ink-2">{t(item, vars)}</p>
          </li>
        ))}
        <li className="flex gap-4 rounded-2xl border border-gold bg-gold-soft p-4">
          <span className="tabular font-mono text-sm font-bold">{String(m.rules.items.length + 1).padStart(2, "0")}</span>
          <div className="space-y-2 text-ink">
            <p>{c.withdrawalDays > 0 ? t(m.rules.refundDays, vars) : m.rules.refundNone}</p>
            <p>{m.rules.refundRemoved}</p>
          </div>
        </li>
      </ol>
    </div>
  );
}
