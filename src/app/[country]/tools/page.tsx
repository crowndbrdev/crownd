import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountry } from "@/config/countries";
import { GLOBAL_TOOLS, LOCAL_TOOLS, type Tool } from "@/config/tools";
import { getMessages, t } from "@/i18n";
import { editionAlternates, ogFor } from "@/lib/seo";
import { Monogram } from "@/components/Board";

export async function generateMetadata({ params }: PageProps<"/[country]/tools">): Promise<Metadata> {
  const c = getCountry((await params).country);
  if (!c) return {};
  const m = getMessages(c);
  return { title: m.tools.title, description: t(m.tools.sub, { country: m.country }), alternates: editionAlternates(c, "/tools"), openGraph: ogFor(c, "/tools") };
}

function ToolGrid({ tools, lang }: { tools: Tool[]; lang?: string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {tools.map((x) => (
        <li key={x.name} className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
          <Monogram name={x.name} />
          <div className="min-w-0">
            <a href={x.url} rel="noopener" target="_blank" className="font-semibold hover:underline">{x.name}</a>
            <span className="ms-2 rounded-full bg-surface-2 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted" lang="en">{x.category}</span>
            <p className="mt-1 text-sm text-ink-2" lang={lang}>{x.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function ToolsPage({ params }: PageProps<"/[country]/tools">) {
  const c = getCountry((await params).country);
  if (!c) notFound();
  const m = getMessages(c);
  const local = LOCAL_TOOLS[c.slug] ?? [];
  return (
    <div className="pt-12">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">{m.tools.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-2">{t(m.tools.sub, { country: m.country })}</p>

      <h2 className="mt-10 mb-3 flex items-center gap-2 font-display text-2xl font-bold">
        <span aria-hidden>{c.flag}</span> {m.tools.local}
      </h2>
      <ToolGrid tools={local} />

      <h2 className="mt-10 mb-3 font-display text-2xl font-bold">🌐 {m.tools.global}</h2>
      <ToolGrid tools={GLOBAL_TOOLS} lang={c.lang === "en" ? undefined : "en"} />

      <p className="mt-8 text-sm text-muted">
        <a className="underline underline-offset-4" href="https://github.com/crownd/awesome-crownd" rel="noopener">{m.tools.contribute}</a>
        {" · "}
        Taxonomy inspired by{" "}
        <a className="underline underline-offset-4" href="https://github.com/lincolixavier/awesome-indie-hackers" rel="noopener">awesome-indie-hackers</a>.
      </p>
    </div>
  );
}
