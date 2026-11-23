"use client";

import { useState } from "react";

/** Accessible tabs. Panels are server-rendered (all present in the HTML for crawlers); the client only toggles visibility. */
export function Tabs({ labels, panels }: { labels: string[]; panels: React.ReactNode[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="mt-10 flex gap-2" role="tablist">
        {labels.map((label, i) => (
          <button
            key={label}
            role="tab"
            id={`tab-${i}`}
            aria-selected={active === i}
            aria-controls={`panel-${i}`}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${active === i ? "bg-ink text-paper" : "border border-line-strong text-ink-2"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div key={i} role="tabpanel" id={`panel-${i}`} aria-labelledby={`tab-${i}`} hidden={active !== i}>
          {panel}
        </div>
      ))}
    </div>
  );
}
