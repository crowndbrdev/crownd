/**
 * npm run seo:check [-- --base http://localhost:3010]
 *
 * Crawls every URL in the sitemap and enforces the claude-seo checklists
 * (seo-hreflang, seo-programmatic, seo-schema). Exit code 1 on any error,
 * so it can gate deploys in CI.
 */
import { COUNTRIES } from "../src/config/countries.ts";

const args = process.argv.slice(2);
const base = (args[args.indexOf("--base") + 1] && args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://localhost:3010").replace(/\/$/, "");
const LOCALES = new Map(COUNTRIES.map((c) => [c.slug, c.locale]));
const VALID_HREFLANG = new Set([...COUNTRIES.map((c) => c.locale), "x-default"]);

type Issue = { url: string; level: "error" | "warn"; msg: string };
const issues: Issue[] = [];
const err = (url: string, msg: string) => issues.push({ url, level: "error", msg });
const warn = (url: string, msg: string) => issues.push({ url, level: "warn", msg });

const pick = (html: string, re: RegExp) => html.match(re)?.[1];
const all = (html: string, re: RegExp) => [...html.matchAll(re)];
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const sitemap = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
const urls = all(sitemap, /<loc>([^<]+)<\/loc>/g).map((m) => m[1]);
if (!urls.length) { console.error(`Sitemap vazio ou inacessível em ${base}/sitemap.xml`); process.exit(1); }
const origin = new URL(urls[0]).origin;
const local = (u: string) => u.replace(origin, base);

const titles = new Map<string, string[]>();
const meshes = new Map<string, Map<string, string>>(); // path-without-edition → (url → serialized hreflang set)

console.log(`Auditando ${urls.length} URLs de ${base} …`);
let done = 0;
async function audit(url: string) {
  const res = await fetch(local(url), { redirect: "manual" });
  const html = await res.text();
  const path = new URL(url).pathname;
  const edition = path.split("/")[1];

  if (res.status !== 200) return err(url, `HTTP ${res.status}`);
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) err(url, "URL no sitemap mas com noindex");

  const lang = pick(html, /<html[^>]*\slang="([^"]+)"/);
  const expected = LOCALES.get(edition) ?? "en";
  if (lang !== expected) err(url, `<html lang="${lang}"> (esperado ${expected})`);

  const h1 = all(html, /<h1[\s>]/g).length;
  if (h1 !== 1) err(url, `${h1} <h1> na página (esperado 1)`);

  const title = decode(pick(html, /<title>([^<]*)<\/title>/) ?? "");
  if (!title) err(url, "sem <title>");
  else {
    titles.set(title, [...(titles.get(title) ?? []), url]);
    const cjk = /[぀-ヿ一-鿿가-힯]/.test(title);
    if (!cjk && title.length > 70) warn(url, `título longo (${title.length} chars): ${title}`);
  }

  const desc = decode(pick(html, /<meta name="description" content="([^"]*)"/) ?? "");
  if (!desc) err(url, "sem meta description");
  else if (desc.length > 170) warn(url, `description longa (${desc.length} chars)`);

  const canonical = pick(html, /<link rel="canonical" href="([^"]+)"/);
  if (canonical !== url) err(url, `canonical = ${canonical ?? "(ausente)"}`);

  const hreflang = all(html, /<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g).map((m) => [m[1], m[2]] as const);
  if (hreflang.length) {
    for (const [code] of hreflang) if (!VALID_HREFLANG.has(code)) err(url, `hreflang inválido: ${code}`);
    if (!hreflang.some(([, href]) => href === url)) err(url, "hreflang sem autorreferência");
    if (hreflang.filter(([c]) => c === "x-default").length !== 1) err(url, "hreflang precisa de exatamente 1 x-default");
    const key = edition && LOCALES.has(edition) ? path.replace(`/${edition}`, "") || "/" : "(hub)";
    if (!meshes.has(key)) meshes.set(key, new Map());
    meshes.get(key)!.set(url, JSON.stringify([...hreflang].sort()));
  }

  for (const [, raw] of all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const d = JSON.parse(raw); if (!d["@context"]) err(url, "JSON-LD sem @context"); }
    catch { err(url, "JSON-LD inválido"); }
  }
  done++;
}

// Small concurrency pool: fast but gentle on the dev server.
const queue = [...urls];
await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) await audit(queue.shift()!); }));

// Reciprocity: every page in a hreflang set must declare the same set.
for (const [key, pages] of meshes) {
  if (key === "(hub)") continue;
  const sets = new Set(pages.values());
  if (sets.size > 1) err(`/*${key}`, `malha hreflang não recíproca (${sets.size} variações entre ${pages.size} páginas)`);
}
for (const [t, list] of titles) if (list.length > 1) err(list.join(", "), `título duplicado: "${t}"`);

const errors = issues.filter((i) => i.level === "error");
const warns = issues.filter((i) => i.level === "warn");
for (const i of [...errors, ...warns]) console.log(`${i.level === "error" ? "\x1b[31m✗" : "\x1b[33m!"}\x1b[0m ${i.msg}  \x1b[2m${i.url}\x1b[0m`);
console.log(`\n${done}/${urls.length} páginas · ${meshes.size} conjuntos hreflang · ${errors.length} erro(s) · ${warns.length} aviso(s)`);
process.exit(errors.length ? 1 : 0);
