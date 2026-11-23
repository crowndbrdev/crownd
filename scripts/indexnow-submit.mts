/**
 * npm run indexnow   → submits every URL in the live sitemap (+ llms files) to IndexNow.
 *
 * One POST reaches Bing (and through it Copilot / ChatGPT search, which use Bing's index),
 * Yandex, Naver, Seznam and Yep. Google ignores IndexNow: it uses the sitemap in Search Console.
 * Run after a launch or a big content change; the app already pings changed URLs on its own.
 * Key: INDEXNOW_KEY from .secrets.production (same value as the Cloudflare secret, served at /indexnow.txt).
 */
const SITE = (process.env.SITE ?? "https://crownd.dev").replace(/\/$/, "");
const key = process.env.INDEXNOW_KEY;
if (!key) { console.error("INDEXNOW_KEY ausente (.secrets.production)."); process.exit(1); }

const served = await fetch(`${SITE}/indexnow.txt`).then((r) => (r.ok ? r.text() : ""));
if (served.trim() !== key) {
  console.error(`✗ ${SITE}/indexnow.txt não devolve a mesma chave do .secrets.production. Confira o secret INDEXNOW_KEY na Cloudflare.`);
  process.exit(1);
}

const xml = await fetch(`${SITE}/sitemap.xml`).then((r) => r.text());
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
urls.push(`${SITE}/llms.txt`, `${SITE}/llms-full.txt`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/indexnow.txt`, urlList: urls }),
});
// 200 = accepted, 202 = accepted (key validation pending). Anything else is a real error.
console.log(`${res.ok ? "✓" : "✗"} IndexNow ${res.status}: ${urls.length} URLs enviadas (Bing, Yandex, Naver, Seznam, Yep).`);
if (!res.ok) { console.log(await res.text()); process.exit(1); }
