import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney, getCountry } from "@/config/countries";
import { getMessages, t } from "@/i18n";
import { getBoard, getPayment } from "@/lib/board";
import { SITE_URL } from "@/lib/seo";
import { paymentMode } from "@/lib/payments";
import { DemoPayButton } from "@/components/Forms";
import { CrownMark } from "@/components/Logo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false }, alternates: { canonical: null, languages: {} } };

export default async function CheckoutPage({ params, searchParams }: PageProps<"/[country]/checkout/[id]">) {
  const { country, id } = await params;
  const c = getCountry(country);
  if (!c) notFound();
  const m = getMessages(c);
  const p = await getPayment(id);
  if (!p || p.country !== c.slug) notFound();
  const status = (await searchParams).status;

  if (p.status === "paid" || status === "success") {
    const pending = p.status !== "paid";
    // Post-purchase activation: the buyer's page, next steps and one-tap sharing (free distribution).
    const listing = p.kind === "bid" ? (await getBoard(c.slug)).find((l) => l.key === p.key) : undefined;
    const pageUrl = listing ? `${SITE_URL}/${c.slug}/p/${listing.slug}` : `${SITE_URL}/${c.slug}`;
    const text = listing ? `${listing.name} · ${c.edition}` : c.edition;
    const shares = [
      ["X", `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`],
      ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`],
      ["WhatsApp", `https://wa.me/?text=${encodeURIComponent(`${text} ${pageUrl}`)}`],
    ] as const;
    return (
      <div className="mx-auto max-w-lg pt-20 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gold text-[#0e0d12]">
          <CrownMark className="h-12 w-12" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold">{m.checkout.success}</h1>
        <div className="mt-8 rounded-3xl border border-line bg-surface p-6 text-start">
          <h2 className="font-display text-xl font-bold">{m.sell.nextTitle}</h2>
          <ol className="mt-3 space-y-2 text-sm text-ink-2">
            {pending ? <li>⏳ {m.sell.next1}</li> : null}
            <li>📣 {m.sell.next2}</li>
            <li>🏷️ {m.sell.next3}</li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            {listing ? (
              <Link href={`/${c.slug}/p/${listing.slug}`} className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-paper hover:opacity-90">
                {m.sell.viewPage} <span className="flip-rtl inline-block">→</span>
              </Link>
            ) : null}
            {shares.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener" className="rounded-full border border-line-strong px-4 py-2.5 text-sm font-semibold hover:border-ink">
                {m.sell.share} · {label}
              </a>
            ))}
          </div>
        </div>
        <Link href={`/${c.slug}`} className="mt-6 inline-block text-sm font-semibold underline decoration-line-strong underline-offset-4">{m.product.back}</Link>
      </div>
    );
  }

  if (status === "cancel" || p.status === "expired") {
    return (
      <div className="mx-auto max-w-lg pt-20 text-center">
        <h1 className="font-display text-4xl font-extrabold">{m.checkout.cancel}</h1>
        <Link href={`/${c.slug}#bid`} className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-bold text-accent-ink">{m.hero.cta}</Link>
      </div>
    );
  }

  // Demo checkout (no Stripe keys): lets anyone test the full flow locally.
  return (
    <div className="mx-auto max-w-lg pt-16">
      <div className="rounded-3xl border border-line bg-surface p-6">
        <h1 className="font-display text-3xl font-extrabold">{m.checkout.title}</h1>
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-muted">URL</dt><dd className="truncate font-mono" dir="ltr">{p.url}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">{m.product.bid}</dt><dd className="font-mono">{formatMoney(p.targetTotal, c)}</dd></div>
          <div className="flex justify-between gap-4 border-t border-line pt-2 text-base font-bold"><dt>{t(m.checkout.pay, { amount: "" }).trim()}</dt><dd className="font-mono">{formatMoney(p.amount, c)}</dd></div>
        </dl>
        {paymentMode() === "demo" ? (
          <div className="mt-6 space-y-3">
            <p className="rounded-xl bg-gold-soft px-3 py-2 text-sm">{m.checkout.demo}</p>
            <DemoPayButton id={p.id} country={c.slug} label={m.checkout.confirmDemo} />
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">{m.checkout.note}</p>
        )}
      </div>
    </div>
  );
}
