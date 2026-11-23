import type { Metadata } from "next";
import { COUNTRIES } from "@/config/countries";
import { CrownMark, Wordmark } from "@/components/Logo";

export const metadata: Metadata = { title: "Brand", description: "The Crownd brand book: logo, colour, type and voice." };

const BRAND = [
  { name: "Crown Gold", hex: "#FFC531", use: "Only for #1. If everything is gold, nothing is royal." },
  { name: "Obsidian", hex: "#0E0D12", use: "Ink, primary text, dark surfaces." },
  { name: "Parchment", hex: "#F7F3EA", use: "Paper. Warm, physical, like a printed league table." },
  { name: "Coup Red", hex: "#FF4A2E", use: "Live dot and outbid alerts. The moment a crown falls." },
  { name: "Mint", hex: "#12A26B", use: "Confirmation: payment, subscription, success." },
  { name: "Gold Deep", hex: "#C98A00", use: "Gold on light backgrounds where contrast matters." },
];

const VOICE = [
  ["Competitive, never cruel", "We dare people to take #1. We never mock the people who lost it."],
  ["Local first", "Each edition speaks like a local maker: Brazil teases, Japan invites a challenge, Sweden stays lagom."],
  ["Numbers are the hero", "Ranks, bids and timers are set in mono and always visible. Transparency is the product."],
  ["Short sentences", "A board is read in seconds. Headlines under 5 words, CTAs under 3."],
];

export default function BrandPage() {
  return (
    <div className="pt-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Brand book · v1</p>
      <h1 className="mt-2 font-display text-6xl font-extrabold tracking-[-0.05em]">Crownd</h1>
      <p className="mt-3 max-w-2xl font-serif text-2xl italic text-ink-2">
        crowd + crowned. The crowd watches, the bid decides, one product wears the crown.
      </p>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Logo</h2>
        <p className="mt-1 max-w-2xl text-ink-2">
          The podium-crown: three leaderboard bars in podium order (2-1-3) whose tops form a crown. Only the centre jewel is
          gold — the mark itself tells you that only #1 gets the gold.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="grid h-44 place-items-center rounded-2xl border border-line bg-[#F7F3EA] text-[#0E0D12]"><Wordmark /></div>
          <div className="grid h-44 place-items-center rounded-2xl bg-[#0E0D12] text-[#F7F3EA]"><Wordmark /></div>
          <div className="grid h-44 place-items-center rounded-2xl bg-[#FFC531] text-[#0E0D12]"><CrownMark className="h-20 w-20 [&_circle:nth-of-type(2)]:fill-[#0E0D12]" /></div>
        </div>
        <ul className="mt-4 grid gap-2 text-sm text-ink-2 sm:grid-cols-3">
          <li>Clear space = height of the centre jewel on every side.</li>
          <li>Minimum size: 16 px (mark), 96 px (wordmark).</li>
          <li>Never recolour the jewel to anything but gold (or ink on gold).</li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Brand colour</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {BRAND.map((c) => (
            <li key={c.hex} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="h-24" style={{ background: c.hex }} />
              <div className="p-4">
                <p className="font-semibold">{c.name} <span className="font-mono text-xs text-muted">{c.hex}</span></p>
                <p className="mt-1 text-sm text-ink-2">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Edition accents</h2>
        <p className="mt-1 max-w-2xl text-ink-2">
          Each country adds one accent rooted in its own culture — not its flag. Accents drive buttons and highlights; gold stays reserved for #1 everywhere.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTRIES.map((c) => (
            <li key={c.slug} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl" style={{ background: c.accent.hex }} />
                <div>
                  <p className="text-sm font-semibold">{c.flag} {c.accent.name}</p>
                  <p className="font-mono text-xs text-muted">{c.accent.hex}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-ink-2">{c.accent.story}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-xs uppercase tracking-widest text-muted">Display · Bricolage Grotesque 800</p>
          <p className="mt-3 font-display text-5xl font-extrabold tracking-[-0.05em]">Take the crown.</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-xs uppercase tracking-widest text-muted">Accent · Instrument Serif Italic</p>
          <p className="mt-3 font-serif text-5xl italic">Long may you reign.</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-xs uppercase tracking-widest text-muted">Numbers · JetBrains Mono</p>
          <p className="tabular mt-3 font-mono text-4xl font-bold">#1 · ¥45,000<br />02:14:09</p>
        </div>
      </section>
      <p className="mt-3 text-sm text-muted">Script editions fall back to Noto Sans JP, Noto Sans KR and IBM Plex Sans Arabic.</p>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Voice</h2>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {VOICE.map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-line bg-surface p-5">
              <dt className="font-semibold">{k}</dt>
              <dd className="mt-1 text-sm text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">The throne</h2>
        <p className="mt-1 text-ink-2">Signature component: a slowly rotating gold edge, used only around the current #1.</p>
        <div className="throne mt-6 max-w-md rounded-3xl p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
            <span className="live-dot h-2 w-2 rounded-full bg-coup" /> Current crown
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold">Your product here</p>
        </div>
      </section>
    </div>
  );
}
