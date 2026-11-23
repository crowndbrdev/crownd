"use client";

import { useEffect, useState } from "react";

/** Live "reigning for 3d 04:12:09" counter. */
export function ReignTimer({ since, locale, serverNow }: { since: number; locale: string; serverNow: number }) {
  // Start from the server clock so crawlers and no-JS users see a real duration, then tick.
  const [now, setNow] = useState<number>(serverNow);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, now - since);
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const mi = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dayLabel = new Intl.NumberFormat(locale, { style: "unit", unit: "day", unitDisplay: "narrow" }).format(d);
  return (
    <time suppressHydrationWarning dateTime={new Date(since).toISOString()} className="tabular font-mono">
      {d > 0 ? `${dayLabel} ` : ""}
      {pad(h)}:{pad(mi)}:{pad(s)}
    </time>
  );
}
