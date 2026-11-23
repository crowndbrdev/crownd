"use client";

import { usePathname, useRouter } from "next/navigation";

/** Switch edition while staying on the equivalent page (board ↔ board, rules ↔ rules). */
export function EditionSwitcher({ current, options, label }: { current: string; options: { slug: string; label: string }[]; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={current}
        onChange={(e) => {
          const rest = pathname.split("/").slice(2);
          // Product and checkout pages are edition-specific; fall back to the board.
          const keep = rest[0] && !["p", "checkout"].includes(rest[0]) ? `/${rest.join("/")}` : "";
          router.push(`/${e.target.value}${keep}`);
        }}
        className="appearance-none rounded-full border border-line-strong bg-surface py-1.5 ps-3 pe-8 text-sm font-medium hover:border-ink"
      >
        {options.map((o) => (
          <option key={o.slug} value={o.slug}>
            {o.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute end-2.5 h-3.5 w-3.5 text-muted" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </label>
  );
}
