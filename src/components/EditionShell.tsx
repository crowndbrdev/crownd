import Link from "next/link";
import { COUNTRIES, type Country } from "@/config/countries";
import type { Messages } from "@/i18n";
import { Wordmark } from "./Logo";
import { getGuide } from "@/i18n/guide";
import { getLaunchSites } from "@/i18n/launchSites";
import { EditionSwitcher } from "./EditionSwitcher";
import { ThemeToggle } from "./Theme";
import { SocialLinks } from "./Social";

export function EditionHeader({ c, m }: { c: Country; m: Messages }) {
  const base = `/${c.slug}`;
  const nav = [
    { href: base, label: m.nav.board },
    { href: `${base}/guide`, label: getGuide(c.lang, c.slug).nav },
    { href: `${base}/where-to-launch`, label: getLaunchSites(c.lang, c.slug).nav },
    { href: `${base}/launches`, label: m.nav.launches },
    { href: `${base}/tools`, label: m.nav.tools },
    { href: `${base}/hall-of-fame`, label: m.nav.hall },
    { href: `${base}/rules`, label: m.nav.rules },
  ];
  return (
    <header className="relative z-10 border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4">
        <Link href={base} aria-label={c.edition} className="shrink-0">
          <Wordmark edition={c.iso} />
        </Link>
        <nav aria-label="Main" className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto text-sm sm:order-none sm:w-auto">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-ink-2 hover:bg-surface-2 hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <ThemeToggle label={m.theme} />
          <EditionSwitcher current={c.slug} label={m.footer.editions} options={COUNTRIES.map((x) => ({ slug: x.slug, label: `${x.flag} ${x.nameLocal}` }))} />
        </div>
      </div>
    </header>
  );
}

export function EditionFooter({ c, m }: { c: Country; m: Messages }) {
  return (
    <footer className="relative z-10 mt-24 border-t border-line">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:grid-cols-[1.2fr_2fr]">
        <div className="space-y-3">
          <Wordmark />
          <p className="max-w-xs text-sm text-muted">{m.footer.about}</p>
          <p className="text-sm">
            <Link className="underline decoration-line-strong underline-offset-4 hover:decoration-ink" href={`/${c.slug}/legal`}>
              {m.footer.legal}
            </Link>
            {" · "}
            <Link className="underline decoration-line-strong underline-offset-4 hover:decoration-ink" href={`/${c.slug}/rules`}>
              {m.nav.rules}
            </Link>
            {" · "}
            <Link className="underline decoration-line-strong underline-offset-4 hover:decoration-ink" href={`/${c.slug}/guide`}>
              {getGuide(c.lang, c.slug).nav}
            </Link>
            {" · "}
            <a className="underline decoration-line-strong underline-offset-4 hover:decoration-ink" href={`/${c.slug}/feed.xml`}>RSS</a>
          </p>
          <SocialLinks className="pt-1" />
        </div>
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">{m.footer.editions}</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-4">
            {COUNTRIES.map((x) => (
              <li key={x.slug}>
                <Link
                  href={`/${x.slug}`}
                  hrefLang={x.locale}
                  lang={x.locale}
                  className={`hover:text-ink ${x.slug === c.slug ? "font-semibold text-ink" : "text-ink-2"}`}
                >
                  {x.flag} {x.nameLocal.split(" · ")[0]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
