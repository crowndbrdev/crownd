"use client";

import Link from "next/link";
import { useState } from "react";
import { formatMoney, formatNumber, fromMinor, getCountry } from "@/config/countries";

export type BoardRow = { id: string; slug: string; name: string; description: string; host: string; bidTotal: number; clicks: number; takePrice: number };

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? `{${k}}`));

export function Monogram({ name, rank }: { name: string; rank?: number }) {
  const ch = Array.from(name.trim())[0]?.toUpperCase() ?? "?";
  const king = rank === 1;
  return (
    <span
      aria-hidden
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-lg font-extrabold ${king ? "bg-gold text-[#0e0d12]" : "bg-surface-2 text-ink-2"}`}
    >
      {ch}
    </span>
  );
}

export function Board({
  country, rows, labels,
}: {
  country: string;
  rows: BoardRow[];
  labels: { search: string; clicks: string; take: string; empty: string };
}) {
  const c = getCountry(country)!;
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const shown = rows
    .map((r, i) => ({ ...r, rank: i + 1 }))
    .filter((r) => !query || `${r.name} ${r.description} ${r.host}`.toLowerCase().includes(query));

  return (
    <div>
      <label className="mb-4 block">
        <span className="sr-only">{labels.search}</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={labels.search}
          className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm outline-none focus:border-ink"
        />
      </label>
      {shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line-strong p-8 text-center text-muted">{labels.empty}</p>
      ) : (
        <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {shown.map((r) => (
            <li key={r.id} className="group flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
              <span className={`tabular w-10 shrink-0 text-end font-mono text-sm font-bold ${r.rank === 1 ? "text-gold-deep" : "text-muted"}`}>
                #{r.rank}
              </span>
              <Monogram name={r.name} rank={r.rank} />
              <div className="min-w-0 flex-1">
                <Link href={`/${c.slug}/p/${r.slug}`} className="block truncate font-semibold hover:underline">
                  {r.name}
                </Link>
                <p className="truncate text-sm text-muted">{r.description || r.host}</p>
              </div>
              <div className="hidden text-end sm:block">
                <div className="tabular font-mono text-sm font-bold">{formatMoney(r.bidTotal, c)}</div>
                <div className="tabular text-xs text-muted">
                  {formatNumber(r.clicks, c)} {labels.clicks}
                </div>
              </div>
              {r.rank > 1 ? (
                <a
                  href={`/${c.slug}?bid=${fromMinor(r.takePrice, c)}#bid`}
                  className="hidden shrink-0 rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-2 transition hover:border-accent hover:bg-accent hover:text-accent-ink md:inline-block"
                >
                  {fill(labels.take, { rank: r.rank, amount: formatMoney(r.takePrice, c) })}
                </a>
              ) : (
                <span className="hidden w-[7.5rem] shrink-0 text-center text-xl md:inline-block" aria-hidden>
                  👑
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
