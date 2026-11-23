import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountry } from "@/config/countries";
import { SITE_URL, ogFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[country]/legal">): Promise<Metadata> {
  const c = getCountry((await params).country);
  if (!c) return {};
  return { title: c.legalPage.title, robots: { index: false, follow: true }, alternates: { canonical: `${SITE_URL}/${c.slug}/legal` }, openGraph: ogFor(c, "/legal") };
}

/**
 * Locally-mandated legal page (Impressum, 特定商取引法に基づく表記, 사업자정보, mentions légales…).
 * Content MUST be written per company entity with a local lawyer before launch — this page
 * renders the required headings and a visible TODO so it can't ship silently empty.
 */
export default async function LegalPage({ params }: PageProps<"/[country]/legal">) {
  const c = getCountry((await params).country);
  if (!c) notFound();
  return (
    <div className="max-w-3xl pt-12">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">{c.legalPage.title}</h1>
      <p className="mt-4 rounded-xl border border-coup/40 bg-coup/10 p-4 text-sm" lang="en">
        <strong>Before launch:</strong> {c.legalPage.why} Fill in the company name, address, registration/VAT number,
        contact and representative as required in {c.nameEn}.
      </p>
      <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface" lang="en">
        {[
          ["Operator", process.env.LEGAL_ENTITY ?? "— (LEGAL_ENTITY)"],
          ["Address", process.env.LEGAL_ADDRESS ?? "— (LEGAL_ADDRESS)"],
          ["Registration / Tax ID", process.env.LEGAL_TAX_ID ?? "— (LEGAL_TAX_ID)"],
          ["Contact", process.env.LEGAL_EMAIL ?? "— (LEGAL_EMAIL)"],
          ["Payments", "Stripe Payments (card data never touches our servers)"],
          ["Cooling-off", c.withdrawalDays ? `${c.withdrawalDays} days` : "Not applicable to digital services once delivered"],
        ].map(([k, v]) => (
          <div key={k} className="grid grid-cols-[10rem_1fr] gap-4 p-4 text-sm">
            <dt className="text-muted">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
