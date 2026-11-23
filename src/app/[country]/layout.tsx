import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { COUNTRIES, getCountry } from "@/config/countries";
import { getMessages, t } from "@/i18n";
import { baseFonts, scriptFont } from "../fonts";
import { EditionFooter, EditionHeader } from "@/components/EditionShell";
import { SITE_URL, editionAlternates, ogFor, verification } from "@/lib/seo";
import { THEME_INIT } from "@/components/Theme";
import { Tracker } from "@/components/Analytics";
import { Himetrica } from "@/components/Himetrica";

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: LayoutProps<"/[country]">): Promise<Metadata> {
  const c = getCountry((await params).country);
  if (!c) return {};
  const m = getMessages(c);
  const vars = { edition: c.edition, demonym: m.demonym, country: m.country };
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t(m.meta.title, vars), template: `%s · ${c.edition}` },
    description: t(m.meta.description, vars),
    alternates: { ...editionAlternates(c, ""), types: { "application/rss+xml": `${SITE_URL}/${c.slug}/feed.xml` } },
    verification: verification(),
    appleWebApp: { capable: true, title: c.edition, statusBarStyle: "default" },
    applicationName: "Crownd",
    openGraph: ogFor(c, ""),
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F3EA" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0D12" },
  ],
};

export default async function EditionLayout({ children, params }: LayoutProps<"/[country]">) {
  const c = getCountry((await params).country);
  if (!c) notFound();
  const m = getMessages(c);
  return (
    <html
      suppressHydrationWarning
      lang={c.locale}
      dir={c.dir}
      className={`${baseFonts} ${scriptFont(c)} antialiased`}
      style={{ "--accent": c.accent.hex, "--accent-ink": c.accent.ink } as React.CSSProperties}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <Himetrica />
      </head>
      <body className="min-h-dvh">
        <Tracker />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
          ↓
        </a>
        <EditionHeader c={c} m={m} />
        <main id="main" className="relative z-10 mx-auto max-w-5xl px-4">
          {children}
        </main>
        <EditionFooter c={c} m={m} />
      </body>
    </html>
  );
}
