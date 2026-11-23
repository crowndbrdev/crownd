/** The podium-crown: three leaderboard bars that form a crown; only #1's jewel is gold. */
export function CrownMark({ className = "h-7 w-7", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <rect x="10" y="26" width="12" height="26" rx="3" />
      <rect x="26" y="14" width="12" height="38" rx="3" />
      <rect x="42" y="32" width="12" height="20" rx="3" />
      <rect x="8" y="50" width="48" height="7" rx="2" />
      <circle cx="16" cy="19" r="4.5" />
      <circle cx="32" cy="6.5" r="5" fill="var(--gold)" />
      <circle cx="48" cy="25" r="4.5" />
    </svg>
  );
}

export function Wordmark({ edition }: { edition?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <CrownMark className="h-7 w-7 -mt-1" />
      <span className="font-display text-[1.45rem] font-extrabold tracking-[-0.06em] leading-none">crownd</span>
      {edition ? (
        <span className="rounded-full border border-line-strong px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
          {edition}
        </span>
      ) : null}
    </span>
  );
}
