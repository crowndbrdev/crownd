import type { Metadata } from "next";
import { COUNTRY_BY_SLUG } from "@/config/countries";
import { report } from "@/lib/analytics";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Open analytics",
  description: "Crownd's public, cookie-less analytics: live visitors, pageviews and traffic per edition.",
  robots: { index: false, follow: true },
};

const nf = new Intl.NumberFormat("en-US");
const regionName = new Intl.DisplayNames(["en"], { type: "region" });

/** Server-rendered SVG area chart — no client JS, no chart library. */
function Chart({ days }: { days: { day: string; visitors: number; pageviews: number }[] }) {
  const W = 720, H = 220, P = 28;
  const max = Math.max(4, ...days.map((d) => d.pageviews));
  const x = (i: number) => P + (i * (W - P * 2)) / Math.max(1, days.length - 1);
  const y = (v: number) => H - P - (v / max) * (H - P * 2);
  const line = (k: "visitors" | "pageviews") => days.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[k]).toFixed(1)}`).join(" ");
  const area = (k: "visitors" | "pageviews") => `${line(k)} L${x(days.length - 1)},${H - P} L${x(0)},${H - P} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Visitors and pageviews, last 30 days">
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={P} x2={W - P} y1={y(max * f)} y2={y(max * f)} stroke="var(--line)" strokeDasharray="3 4" />
          <text x={4} y={y(max * f) + 4} fontSize="10" fill="var(--muted)">{Math.round(max * f)}</text>
        </g>
      ))}
      <path d={area("pageviews")} fill="var(--gold)" opacity="0.15" />
      <path d={line("pageviews")} fill="none" stroke="var(--gold-deep)" strokeWidth="2" />
      <path d={area("visitors")} fill="var(--accent)" opacity="0.12" />
      <path d={line("visitors")} fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x={P} y={H - 6} fontSize="10" fill="var(--muted)">{days[0]?.day}</text>
      <text x={W - P} y={H - 6} fontSize="10" fill="var(--muted)" textAnchor="end">{days.at(-1)?.day}</text>
    </svg>
  );
}

function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <p className="text-sm text-muted">No data yet.</p>;
  return (
    <ul className="space-y-1.5">
      {rows.map((r) => (
        <li key={r.label} className="relative overflow-hidden rounded-lg bg-surface-2 px-3 py-1.5 text-sm">
          <span className="absolute inset-y-0 start-0 bg-gold/25" style={{ width: `${(r.value / max) * 100}%` }} aria-hidden />
          <span className="relative flex justify-between gap-3">
            <span className="truncate">{r.label}</span>
            <span className="tabular font-mono">{nf.format(r.value)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function AnalyticsPage() {
  const r = await report(30);
  const himetrica = process.env.NEXT_PUBLIC_ANALYTICS_URL;
  const last30 = r.days.reduce((a, d) => ({ v: a.v + d.visitors, p: a.p + d.pageviews }), { v: 0, p: 0 });
  const tiles = [
    { k: "Online now", v: r.online, live: true },
    { k: "Visitors · 30 days", v: last30.v },
    { k: "Pageviews · 30 days", v: last30.p },
    { k: "Pageviews since launch", v: r.pageviews },
  ];
  return (
    <div className="pt-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Open analytics</p>
      <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">Traffic, in public.</h1>
      <p className="mt-3 max-w-2xl text-ink-2">
        Cookie-less and privacy-first: no IPs stored, visitors are anonymous hashes that reset every day. Makers deserve to know
        what a crown is worth, so we show everything.
        {himetrica ? (
          <>
            {" "}
            <a href={himetrica} target="_blank" rel="noopener" className="underline underline-offset-4">Full dashboard on Himetrica →</a>
          </>
        ) : null}
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.k} className="rounded-2xl border border-line bg-surface p-5">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
              {t.live ? <span className="live-dot h-2 w-2 rounded-full bg-coup" aria-hidden /> : null}
              {t.k}
            </p>
            <p className="tabular mt-2 font-display text-4xl font-extrabold">{nf.format(t.v)}</p>
          </li>
        ))}
      </ul>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold">Last 30 days</h2>
          <p className="flex gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-ink" />Visitors</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-gold-deep" />Pageviews</span>
          </p>
        </div>
        <Chart days={r.days} />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-3 font-display text-xl font-bold">Editions</h2>
          <Bars rows={r.editions.map((e) => ({ label: `${COUNTRY_BY_SLUG[e.edition]?.flag ?? ""} ${COUNTRY_BY_SLUG[e.edition]?.nameEn ?? e.edition}`, value: Number(e.visitors) }))} />
        </section>
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-3 font-display text-xl font-bold">Visitor countries</h2>
          <Bars rows={r.countries.map((x) => ({ label: regionName.of(x.country) ?? x.country, value: Number(x.visitors) }))} />
        </section>
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-3 font-display text-xl font-bold">Top pages</h2>
          <Bars rows={r.pages.map((x) => ({ label: x.path, value: Number(x.views) }))} />
        </section>
      </div>
    </div>
  );
}
