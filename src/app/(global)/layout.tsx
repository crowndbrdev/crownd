import type { Metadata, Viewport } from "next";
import { COUNTRIES } from "@/config/countries";
import Link from "next/link";
import "../globals.css";
import { baseFonts } from "../fonts";
import { Wordmark } from "@/components/Logo";
import { SITE_URL, verification } from "@/lib/seo";
import { THEME_INIT, ThemeToggle } from "@/components/Theme";
import { Tracker } from "@/components/Analytics";
import { Himetrica } from "@/components/Himetrica";
import { SocialLinks } from "@/components/Social";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `Crownd — ${COUNTRIES.length} countries. ${COUNTRIES.length} crowns. Who's #1?`, template: "%s · Crownd" },
  description:
    `Crownd is a network of public leaderboards for indie products in ${COUNTRIES.length} countries. Pay in your currency to take #1, launch for free, and see who holds every crown right now.`,
  applicationName: "Crownd",
  verification: verification(),
  // iOS "Add to Home Screen": opens full-screen like an app, with its own name.
  appleWebApp: { capable: true, title: "Crownd", statusBarStyle: "default" },
  openGraph: { siteName: "Crownd", type: "website", locale: "en_US", url: SITE_URL },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F3EA" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0D12" },
  ],
};

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className={`${baseFonts} antialiased`} style={{ "--accent": "#0E0D12", "--accent-ink": "#F7F3EA" } as React.CSSProperties}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <Himetrica />
      </head>
      <body className="min-h-dvh">
        <Tracker />
        <header className="relative z-10 border-b border-line">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
            <Link href="/" aria-label="Crownd home" className="shrink-0"><Wordmark /></Link>
            {/* Mobile: fewer, tighter links so the theme toggle keeps its 16px gutter from the screen edge. */}
            <nav className="flex min-w-0 items-center gap-0.5 text-sm sm:gap-1">
              <Link href="/#editions" className="rounded-full px-2.5 py-1.5 font-medium text-ink-2 hover:bg-surface-2 sm:px-3">Editions</Link>
              <Link href="/brand" className="hidden rounded-full px-3 py-1.5 font-medium text-ink-2 hover:bg-surface-2 sm:inline-block">Brand</Link>
              <Link href="/analytics" className="rounded-full px-2.5 py-1.5 font-medium text-ink-2 hover:bg-surface-2 sm:px-3">Analytics</Link>
              <span className="ms-1.5"><ThemeToggle label="Toggle light/dark mode" /></span>
            </nav>
          </div>
        </header>
        <main className="relative z-10 mx-auto max-w-6xl px-4">{children}</main>
        <footer className="relative z-10 mt-24 border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10 text-sm text-muted">
            <span>© Crownd · crownd.dev</span>
            <SocialLinks />
          </div>
        </footer>
      </body>
    </html>
  );
}
