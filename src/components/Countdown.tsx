"use client";

import { useEffect, useState } from "react";

/** Seconds left until the next local midnight in `timeZone` (when free launch slots reset). */
function secondsToMidnight(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return 86_400 - (get("hour") * 3600 + get("minute") * 60 + get("second"));
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Real, system-backed urgency only: counts down to the moment the daily free slots reset.
 * Renders nothing on the server (time-dependent), then ticks every second on the client.
 */
export function ResetCountdown({ timeZone, label }: { timeZone: string; label: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(secondsToMidnight(timeZone));
    const id = setInterval(tick, 1000);
    const first = setTimeout(tick, 0);
    return () => { clearInterval(id); clearTimeout(first); };
  }, [timeZone]);
  if (left === null) return null;
  const time = `${pad(Math.floor(left / 3600))}:${pad(Math.floor((left % 3600) / 60))}:${pad(left % 60)}`;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-semibold text-ink-2">
      <span className="live-dot h-1.5 w-1.5 rounded-full bg-coup" aria-hidden />
      {label.replace("{time}", "")}
      <span className="tabular font-mono text-ink" dir="ltr">{time}</span>
    </span>
  );
}
