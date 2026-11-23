"use client";

import { useSyncExternalStore } from "react";

/**
 * Runs in <head> before first paint: applies the saved theme so there's no flash.
 * Kept tiny and dependency-free; mirrored by the CSS in globals.css.
 */
export const THEME_INIT = `try{var t=localStorage.getItem("crownd-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

type Theme = "light" | "dark";

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  mq.addEventListener("change", cb);
  return () => {
    obs.disconnect();
    mq.removeEventListener("change", cb);
  };
}

export function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, current, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("crownd-theme", next);
        } catch {
          /* private mode: theme still applies for this page */
        }
      }}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-ink-2 transition hover:border-ink hover:text-ink"
    >
      {/* Sun when dark (click → light), moon when light (click → dark). Neutral icon before hydration. */}
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : theme === "light" ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        ) : (
          <circle cx="12" cy="12" r="5" />
        )}
      </svg>
    </button>
  );
}
