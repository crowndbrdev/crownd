"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = { kind: "idle" | "ok" | "error"; msg?: string };

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "error");
  return data;
}

export function NewsletterForm({ country, labels }: { country: string; labels: { ph: string; cta: string } }) {
  const [email, setEmail] = useState("");
  const [s, setS] = useState<Status>({ kind: "idle" });
  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const d = await post("/api/subscribe", { country, email });
          setS({ kind: "ok", msg: d.message });
          setEmail("");
        } catch (err) {
          setS({ kind: "error", msg: (err as Error).message });
        }
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={labels.ph}
        aria-label={labels.ph}
        className="h-12 flex-1 rounded-xl border border-line bg-surface px-4 text-sm outline-none focus:border-ink"
      />
      <button className="h-12 rounded-xl bg-ink px-5 text-sm font-bold text-paper hover:opacity-90">{labels.cta}</button>
      {s.msg ? (
        <p role="status" className={`text-sm sm:self-center ${s.kind === "error" ? "text-coup" : "text-mint"}`}>
          {s.msg}
        </p>
      ) : null}
    </form>
  );
}

export function LaunchForm({
  country, labels, disabled,
}: {
  country: string;
  disabled: boolean;
  labels: { placeholder: string; namePh: string; taglinePh: string; submit: string; full: string };
}) {
  const router = useRouter();
  const [f, setF] = useState({ url: "", name: "", tagline: "" });
  const [s, setS] = useState<Status>({ kind: "idle" });
  if (disabled) return <p className="rounded-2xl border border-dashed border-line-strong p-5 text-center text-muted">{labels.full}</p>;
  return (
    <form
      className="grid gap-2 rounded-2xl border border-line bg-surface p-3 sm:grid-cols-[1.4fr_1fr]"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const d = await post("/api/launches", { country, ...f });
          setS({ kind: "ok", msg: d.message });
          setF({ url: "", name: "", tagline: "" });
          router.refresh();
        } catch (err) {
          setS({ kind: "error", msg: (err as Error).message });
        }
      }}
    >
      <input required value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} placeholder={labels.placeholder} aria-label={labels.placeholder} className="h-11 rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-ink" />
      <input required maxLength={60} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder={labels.namePh} aria-label={labels.namePh} className="h-11 rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-ink" />
      <input maxLength={120} value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} placeholder={labels.taglinePh} aria-label={labels.taglinePh} className="h-11 rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-ink" />
      <button className="h-11 rounded-xl bg-accent px-4 text-sm font-bold text-accent-ink hover:brightness-110">{labels.submit}</button>
      {s.msg ? (
        <p role="status" className={`text-sm sm:col-span-2 ${s.kind === "error" ? "text-coup" : "text-mint"}`}>
          {s.msg}
        </p>
      ) : null}
    </form>
  );
}

export function DemoPayButton({ id, country, label }: { id: string; country: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <div>
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await post(`/api/demo-pay/${id}`, {});
            router.replace(`/${country}/checkout/${id}?status=success`);
            router.refresh();
          } catch (e) {
            setErr((e as Error).message);
            setBusy(false);
          }
        }}
        className="h-12 w-full rounded-xl bg-accent px-5 font-bold text-accent-ink hover:brightness-110 disabled:opacity-60"
      >
        {label}
      </button>
      {err ? <p className="mt-2 text-sm text-coup">{err}</p> : null}
    </div>
  );
}

/** Paid 24h pin for a launch that's already live today. */
export function HighlightForm({ country, labels }: { country: string; labels: { cta: string; url: string; email: string } }) {
  const [f, setF] = useState({ url: "", email: "" });
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-semibold text-ink-2 underline decoration-gold decoration-2 underline-offset-4 hover:text-ink">
        {labels.cta}
      </button>
    );
  return (
    <form
      className="mt-2 grid gap-2 sm:grid-cols-[1.3fr_1fr_auto]"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const d = await post("/api/checkout", { country, kind: "launch_highlight", url: f.url, email: f.email });
          window.location.href = d.url;
        } catch (e2) {
          setErr((e2 as Error).message);
        }
      }}
    >
      <input required value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} placeholder={labels.url} aria-label={labels.url} className="h-10 rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-ink" />
      <input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder={labels.email} aria-label={labels.email} className="h-10 rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-ink" />
      <button className="h-10 rounded-xl bg-gold px-4 text-sm font-bold text-[#0e0d12]">★</button>
      {err ? <p className="text-sm text-coup sm:col-span-3">{err}</p> : null}
    </form>
  );
}
