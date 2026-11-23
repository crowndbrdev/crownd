import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatMoney, getCountry } from "@/config/countries";
import { getMessages, t } from "@/i18n";
import { formatDuration } from "@/lib/bidding";
import { getReigns } from "@/lib/board";
import { editionAlternates, ogFor } from "@/lib/seo";
import { CrownMark } from "@/components/Logo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[country]/hall-of-fame">): Promise<Metadata> {
  const c = getCountry((await params).country);
  if (!c) return {};
  const m = getMessages(c);
  // Empty Hall of Fame = the same one-liner on every edition: thin, near-duplicate content that Google
  // reports as "crawled – currently not indexed". Keep it out of the index (and the sitemap) until the
  // first crown is recorded; refreshEdition() pings IndexNow when that happens.
  const empty = (await getReigns(c.slug)).length === 0;
  return {
    title: m.hall.title, description: t(m.hall.sub, { country: m.country }), alternates: editionAlternates(c, "/hall-of-fame"),
    openGraph: ogFor(c, "/hall-of-fame"), ...(empty ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function HallPage({ params }: PageProps<"/[country]/hall-of-fame">) {
  const c = getCountry((await params).country);
  if (!c) notFound();
  const m = getMessages(c);
  const reigns = await getReigns(c.slug);
  const date = new Intl.DateTimeFormat(c.intlLocale ?? c.locale, { dateStyle: "medium", timeZone: c.timezone });

  return (
    <div className="pt-12">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">{m.hall.title}</h1>
      <p className="mt-3 font-serif text-2xl italic text-ink-2">{t(m.hall.sub, { country: m.country })}</p>
      {reigns.length === 0 ? <p className="mt-10 text-muted">{m.hall.empty}</p> : null}
      <ol className="relative mt-10 space-y-4 border-s-2 border-line ps-6">
        {reigns.map((r) => {
          const live = r.endedAt == null;
          return (
            <li key={r.id} id={r.id} className={`relative rounded-2xl p-5 ${live ? "throne" : "border border-line bg-surface"}`}>
              <span className={`absolute -start-[2.15rem] top-6 grid h-6 w-6 place-items-center rounded-full ${live ? "bg-gold text-[#0e0d12]" : "bg-surface-2 text-muted"}`}>
                <CrownMark className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <a href={r.url} rel="sponsored nofollow" className="font-display text-2xl font-bold hover:underline">{r.name}</a>
                <span className="text-sm text-muted">{date.format(r.startedAt)}{r.endedAt ? ` → ${date.format(r.endedAt)}` : ""}</span>
              </div>
              <p className="mt-1 text-sm text-ink-2">
                {live ? m.hall.reigning : t(m.hall.held, { duration: formatDuration(r.durationMs, c.locale) })}
                {" · "}
                <span className="tabular font-mono">{formatMoney(r.bidAtStart, c)}</span>
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
