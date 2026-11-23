import Link from "next/link";
import { formatMoney, fromMinor, type Country } from "@/config/countries";
import { t, type Messages } from "@/i18n";
import { ReignTimer } from "./ReignTimer";
import { CrownMark } from "./Logo";

type King = { name: string; slug: string; description: string; host: string; bidTotal: number };

/** The current #1, presented as a throne. Japan renders a hanko seal instead of a crown. */
export function Throne({ c, m, king, since, serverNow, challengePrice }: { c: Country; m: Messages; king?: King; since?: number; serverNow: number; challengePrice: number }) {
  if (!king) {
    return (
      <div className="throne rounded-3xl p-6 text-center">
        <CrownMark className="mx-auto mb-3 h-10 w-10 text-muted" />
        <p className="font-serif text-2xl italic">{m.crown.none}</p>
      </div>
    );
  }
  return (
    <section aria-label={m.crown.label} className="throne rise rounded-3xl p-5 sm:p-7">
      <div className="flex items-start gap-4">
        {c.slug === "jp" ? (
          <span className="hanko text-lg" aria-hidden>
            1位
          </span>
        ) : (
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold text-[#0e0d12]">
            <CrownMark className="h-9 w-9" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
            <span className="live-dot inline-block h-2 w-2 rounded-full bg-coup" aria-hidden />
            {m.crown.label}
          </p>
          <Link href={`/${c.slug}/p/${king.slug}`} className="mt-1 block truncate font-display text-3xl font-extrabold tracking-tight hover:underline sm:text-4xl">
            {king.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-ink-2">{king.description || king.host}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
        <dl className="flex gap-6 text-sm">
          <div>
            <dt className="text-muted">{m.product.bid}</dt>
            <dd className="tabular font-mono text-xl font-bold">{formatMoney(king.bidTotal, c)}</dd>
          </div>
          {since ? (
            <div>
              <dt className="text-muted">{m.hall.reigning}</dt>
              <dd className="text-xl font-bold">
                <ReignTimer since={since} locale={c.locale} serverNow={serverNow} />
              </dd>
            </div>
          ) : null}
        </dl>
        <a href={`/${c.slug}?bid=${fromMinor(challengePrice, c)}#bid`} className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-paper transition hover:opacity-90">
          {t(m.crown.challenge, { amount: formatMoney(challengePrice, c) })}
        </a>
      </div>
    </section>
  );
}
