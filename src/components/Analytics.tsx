"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Cookie-less pageview + heartbeat beacon (first-party). */
export function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    const send = (k: "pageview" | "ping") => {
      const body = JSON.stringify({ k, p: location.pathname });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      else void fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    };
    send("pageview");
    const id = setInterval(() => document.visibilityState === "visible" && send("ping"), 60_000);
    return () => clearInterval(id);
  }, [pathname]);
  return null;
}

type Stats = { online: number; visitors: number; pageviews: number };
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? `{${k}}`));

/** "● 3 people online now · 15,070 visitors & 38,159 pageviews since launch · see the analytics →" */
export function LiveStats({
  initial, locale, labels, href,
}: {
  initial: Stats;
  locale: string;
  href: string;
  labels: { online: string; since: string; analytics: string };
}) {
  const [s, setS] = useState(initial);
  useEffect(() => {
    const tick = () =>
      fetch("/api/stats")
        .then((r) => (r.ok ? r.json() : null))
        .then((d: Stats | null) => d && setS(d))
        .catch(() => undefined);
    const id = setInterval(() => document.visibilityState === "visible" && tick(), 30_000);
    return () => clearInterval(id);
  }, []);
  const nf = new Intl.NumberFormat(locale);
  const external = /^https?:/.test(href);
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 font-mono text-sm" aria-live="polite">
      <p className="flex items-center gap-2">
        <span className="live-dot inline-block h-2 w-2 rounded-full bg-accent" aria-hidden />
        {fill(labels.online, { n: nf.format(s.online) })}
      </p>
      <p className="mt-2 text-ink-2">{fill(labels.since, { visitors: nf.format(s.visitors), pageviews: nf.format(s.pageviews) })}</p>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
        className="mt-3 inline-block text-accent underline-offset-4 hover:underline"
      >
        {labels.analytics} <span className="flip-rtl inline-block">→</span>
      </a>
    </div>
  );
}
