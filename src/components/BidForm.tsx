"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { getCountry, formatMoney, toMinor, fromMinor } from "@/config/countries";
import { normalizeUrl, rankFor, type BoardEntry } from "@/lib/bidding";
import type { Messages } from "@/i18n";

type Props = {
  country: string;
  board: BoardEntry[];
  initialTotal: number; // minor units
  m: Pick<Messages, "hero" | "checkout" | "errors" | "launches" | "sell" | "nav"> & { edition: string; alert: string | null };
};

const noopSubscribe = () => () => {};

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? `{${k}}`));

export function BidForm({ country, board, initialTotal, m }: Props) {
  const c = getCountry(country)!;
  const step = toMinor(c.minBid, c);
  const [url, setUrl] = useState("");
  // "?bid=" deep links (from "take #N" buttons) are read on the client so the page itself stays static/ISR.
  const bidParam = useSyncExternalStore(noopSubscribe, () => new URLSearchParams(window.location.search).get("bid"), () => null);
  const [edited, setAmount] = useState<string | null>(null);
  const requested = Number(bidParam);
  const amount = edited ?? String(Number.isFinite(requested) && requested > 0 ? requested : fromMinor(initialTotal, c));
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = toMinor(Number(amount) || 0, c);
  const key = useMemo(() => {
    try {
      return url ? normalizeUrl(url).key : null;
    } catch {
      return null;
    }
  }, [url]);
  const existing = key ? board.find((b) => b.key === key) : undefined;
  const rank = total > 0 ? rankFor(board, total, key ?? undefined) : null;
  const charge = existing ? Math.max(0, total - existing.bidTotal) : total;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!open) {
      setOpen(true);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, url, total: Number(amount), email, name: name || undefined, description: description.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? m.errors.generic);
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : m.errors.generic);
      setBusy(false);
    }
  }

  return (
    <form id="bid" onSubmit={submit} className="rise rounded-3xl border border-line-strong bg-surface p-2 shadow-[0_1px_0_var(--line),0_20px_60px_-30px_rgb(0_0_0/0.35)]">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">{m.hero.placeholder}</span>
          <input
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={m.hero.placeholder}
            autoComplete="url"
            inputMode="url"
            className="h-14 w-full rounded-2xl bg-transparent px-4 text-base outline-none placeholder:text-muted"
          />
        </label>
        <label className="flex h-14 items-center gap-2 rounded-2xl bg-surface-2 px-4 sm:w-48">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">{c.currency}</span>
          <input
            required
            type="number"
            min={c.minBid}
            step={c.minBid}
            inputMode="numeric"
            aria-label={m.hero.amount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="tabular w-full bg-transparent font-mono text-lg font-bold outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="h-14 rounded-2xl bg-accent px-6 font-display text-base font-bold text-accent-ink transition hover:brightness-110 active:scale-[.98] disabled:opacity-60"
        >
          {open ? fill(m.checkout.pay, { amount: formatMoney(charge, c) }) : m.hero.cta}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-1 pt-2 text-xs text-muted">
        <span>{fill(m.hero.minimum, { amount: formatMoney(step, c), step: formatMoney(step, c) })}</span>
        {rank ? (
          <span className="font-semibold text-ink">
            {rank === 1 ? "👑 " : ""}
            {fill(m.hero.wouldBe, { rank })}
          </span>
        ) : null}
      </div>

      {existing ? (
        <p className="mx-3 mb-2 rounded-xl bg-gold-soft px-3 py-2 text-sm text-ink">
          {fill(m.checkout.raise, { amount: formatMoney(existing.bidTotal, c) })}
        </p>
      ) : null}

      {open ? (
        <div className="grid gap-2 border-t border-line px-2 pt-3 pb-1 sm:grid-cols-2">
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={m.checkout.email}
            className="h-12 rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
          />
          {!existing ? (
            <input
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              placeholder={m.launches.namePh}
              aria-label={m.launches.namePh}
              className="h-12 rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
            />
          ) : null}
          <input
            value={description}
            maxLength={160}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={m.sell.descPh}
            aria-label={m.sell.descPh}
            className="h-12 rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-ink sm:col-span-2"
          />
          {/* What exactly is being bought, right before paying (objection handling). */}
          <div className="rounded-xl bg-surface-2 px-3 py-2.5 text-sm sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{m.sell.buyTitle}</p>
            <ul className="mt-1.5 space-y-1 text-ink">
              {rank ? <li>✓ {fill(m.sell.buy1, { rank, edition: m.edition })}</li> : null}
              <li>✓ {m.sell.buy2}</li>
              <li>✓ {m.sell.buy3}</li>
              {m.alert ? <li>✓ {m.alert}</li> : null}
            </ul>
          </div>
          <p className="text-xs text-muted sm:col-span-2">{m.checkout.note}</p>
        </div>
      ) : null}

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 pb-2 pt-1 text-xs text-muted">
        <span>🔒 {m.sell.trustStripe}</span>
        <a href={`/${country}/rules`} className="underline decoration-line-strong underline-offset-2 hover:text-ink">{m.sell.trustRefund}</a>
        <a href={`/${country}/legal`} className="underline decoration-line-strong underline-offset-2 hover:text-ink">{m.sell.trustSeller}</a>
      </p>

      {error ? (
        <p role="alert" className="mx-3 mb-2 mt-1 text-sm font-medium text-coup">
          {error}
        </p>
      ) : null}
    </form>
  );
}
