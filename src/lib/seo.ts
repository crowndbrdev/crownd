import type { Metadata } from "next";
import { COUNTRIES, type Country } from "@/config/countries";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://crownd.dev").replace(/\/$/, "");

/** Structural pages exist in every edition → full hreflang mesh + x-default (the global hub). */
export const SHARED_PATHS = ["", "/guide", "/where-to-launch", "/launches", "/tools", "/hall-of-fame", "/rules"] as const;

/**
 * Hreflang rules applied (claude-seo/seo-hreflang):
 *  - self-reference included, full reciprocal mesh, one x-default
 *  - ISO 639-1 + ISO 3166-1 codes (en-GB, never en-UK)
 *  - only on canonical URLs, absolute https, no trailing slash anywhere
 */
export function editionAlternates(c: Country, path: (typeof SHARED_PATHS)[number]): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const x of COUNTRIES) languages[x.locale] = `${SITE_URL}/${x.slug}${path}`;
  languages["x-default"] = `${SITE_URL}${path === "" ? "" : `/us${path}`}` || SITE_URL;
  return { canonical: `${SITE_URL}/${c.slug}${path}`, languages };
}

/** Product pages are unique per edition (different products) → canonical only, no hreflang. */
export function productAlternates(c: Country, slug: string): Metadata["alternates"] {
  return { canonical: `${SITE_URL}/${c.slug}/p/${slug}` };
}

/**
 * Ownership verification for every search engine that matters in our 20 markets.
 * Codes are public by design (they're printed in the HTML), so they use NEXT_PUBLIC_* and live
 * in .env.production — the deploy guard rejects any non-public variable in the bundle.
 */
export function verification(): Metadata["verification"] {
  // Static property access on purpose: Next.js only inlines NEXT_PUBLIC_* written out literally.
  const e = process.env;
  const google = e.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || e.GOOGLE_SITE_VERIFICATION;
  const bing = e.NEXT_PUBLIC_BING_SITE_VERIFICATION || e.BING_SITE_VERIFICATION;
  const naver = e.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || e.NAVER_SITE_VERIFICATION;
  const yandex = e.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || e.YANDEX_SITE_VERIFICATION;
  const other: Record<string, string> = {};
  if (bing) other["msvalidate.01"] = bing;
  if (naver) other["naver-site-verification"] = naver;
  return { google: google || undefined, yandex: yandex || undefined, other };
}

/** Official profiles (comma-separated URLs) → Organization.sameAs: ties the brand entity together for knowledge graphs and LLMs. */
export const SAME_AS = (process.env.NEXT_PUBLIC_SAME_AS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => /^https:\/\//.test(s));

/** The one Organization node every page's JSON-LD graph includes (same @id everywhere = one entity). */
export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#org`,
    name: "Crownd",
    alternateName: "crownd.dev",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/crownd-logo.png`, width: 1080, height: 1080 },
    image: `${SITE_URL}/brand/crownd-logo.png`,
    description:
      `Crownd is a network of public leaderboards of independent software products, one per country in ${COUNTRIES.length} countries. Makers bid in local currency for the #1 spot, and ten free launch slots a day are ranked by unique clicks.`,
    foundingDate: "2026-11-13",
    knowsAbout: ["indie hackers", "product launches", "startup marketing", "leaderboards", "SaaS"],
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };
}

export function ogLocale(c: Country) {
  return c.locale.replace("-", "_");
}

/**
 * Complete Open Graph block for an edition page. Next replaces (not merges) a parent's openGraph when
 * a page sets its own, so every page passes its own url + image: Naver's Search Advisor and Yandex
 * flag missing og:url/og:image, and the image is what shows in their result cards.
 */
export function ogFor(c: Country, path: string, extra: { title?: string; description?: string; type?: "website" | "article" } = {}): Metadata["openGraph"] {
  return {
    siteName: "Crownd",
    locale: ogLocale(c),
    type: extra.type ?? "website",
    url: `${SITE_URL}/${c.slug}${path}`,
    images: [{ url: `${SITE_URL}/${c.slug}/opengraph-image`, width: 1200, height: 630, alt: c.edition }],
    ...(extra.title ? { title: extra.title } : {}),
    ...(extra.description ? { description: extra.description } : {}),
  };
}

export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
