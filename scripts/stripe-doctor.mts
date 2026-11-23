/**
 * npm run stripe:doctor
 *
 * Read-only health check of the Stripe connection (except in TEST mode, where it
 * creates and immediately expires one Checkout Session per edition currency to
 * prove each edition can actually charge).
 *
 *  1. Key present and valid (test vs live)
 *  2. Account: country, charges/payouts enabled
 *  3. Per edition: currency accepted + which expected local methods are ON in
 *     the default payment method configuration (what Checkout will show)
 *  4. Webhook endpoint pointing at /api/webhooks/stripe with the right events
 *  5. Stripe Tax status when STRIPE_AUTOMATIC_TAX=1
 */
import Stripe from "stripe";
import { COUNTRIES, toMinor } from "../src/config/countries.ts";

const REQUIRED_EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
];

const c = { ok: "\x1b[32m✓\x1b[0m", warn: "\x1b[33m!\x1b[0m", bad: "\x1b[31m✗\x1b[0m", dim: (s: string) => `\x1b[2m${s}\x1b[0m`, b: (s: string) => `\x1b[1m${s}\x1b[0m` };
let problems = 0;
const fail = (msg: string) => { problems++; console.log(`  ${c.bad} ${msg}`); };

const key = process.env.STRIPE_SECRET_KEY ?? "";
console.log(c.b("\n1 · Chave"));
if (!/^(sk|rk)_(test|live)_/.test(key)) {
  fail("STRIPE_SECRET_KEY ausente ou inválida em .env.development.local (esperado sk_test_… ou rk_test_…). Rode: npm run stripe:setup");
  process.exit(1);
}
const live = key.includes("_live_");
console.log(`  ${c.ok} Chave ${live ? c.b("LIVE (produção)") : "de TESTE"} encontrada ${c.dim(key.slice(0, 8) + "…" + key.slice(-4))}`);

const stripe = new Stripe(key);

console.log(c.b("\n2 · Conta"));
const account = await stripe.accounts.retrieveCurrent().catch((e: Error) => { fail(`Chave rejeitada pelo Stripe: ${e.message}`); process.exit(1); });
console.log(`  ${c.ok} ${account.business_profile?.name ?? account.settings?.dashboard?.display_name ?? account.id} · país ${account.country} · moeda padrão ${account.default_currency?.toUpperCase()}`);
if (!account.charges_enabled) (live ? fail : (m: string) => console.log(`  ${c.warn} ${m}`))("Cobranças ainda não habilitadas: complete a ativação da conta (Settings → Business details).");
if (account.country === "BR") console.log(`  ${c.warn} Conta brasileira: moedas e métodos internacionais são limitados. Veja docs/04-pagamentos.md (recomendação: entidade nos EUA via Stripe Atlas).`);

const spec = await stripe.countrySpecs.retrieve(account.country!);
const currencies = new Set(spec.supported_payment_currencies);

// Default payment method configuration = what Checkout shows with dynamic payment methods.
const pmcs = await stripe.paymentMethodConfigurations.list({ limit: 20 });
const pmc = (pmcs.data.find((p) => p.is_default) ?? pmcs.data[0]) as unknown as Record<string, { available?: boolean; display_preference?: { value?: string } } | undefined>;

console.log(c.b("\n3 · Edições") + c.dim("  (✓ ligado no Checkout · ○ disponível mas desligado · – não oferecido pelo Stripe nesta conta)"));
for (const country of COUNTRIES) {
  const cur = country.currency.toLowerCase();
  const curOk = currencies.has(cur);
  const methods = country.paymentMethods.map((m) => {
    const entry = pmc?.[m];
    if (m === "card") return `${c.ok} card`;
    if (!entry) return c.dim(`– ${m}`);
    if (entry.available && entry.display_preference?.value === "on") return `${c.ok} ${m}`;
    return `\x1b[33m○\x1b[0m ${m}`;
  });

  let checkout = "";
  if (!live && curOk) {
    try {
      const s = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ quantity: 1, price_data: { currency: cur, unit_amount: toMinor(country.minBid, country), product_data: { name: `doctor · ${country.edition}` } } }],
        success_url: "https://example.com/ok",
        cancel_url: "https://example.com/cancel",
      });
      await stripe.checkout.sessions.expire(s.id);
      checkout = ` ${c.ok} checkout`;
    } catch (e) {
      problems++;
      checkout = ` ${c.bad} checkout: ${(e as Error).message}`;
    }
  }
  console.log(`  ${curOk ? c.ok : c.bad} ${country.flag} ${country.slug.padEnd(2)} ${country.currency}${checkout}\n      ${methods.join("  ")}`);
  if (!curOk) problems++;
}

console.log(c.b("\n4 · Webhook"));
const hooks = await stripe.webhookEndpoints.list({ limit: 100 });
const ours = hooks.data.filter((h) => h.url.endsWith("/api/webhooks/stripe"));
if (!ours.length) {
  console.log(`  ${c.warn} Nenhum endpoint de produção ainda. Local: npm run stripe:listen · Produção: npm run stripe:webhook -- --url https://SEU-DOMINIO`);
} else {
  for (const h of ours) {
    const missing = REQUIRED_EVENTS.filter((e) => !h.enabled_events.includes(e) && !h.enabled_events.includes("*"));
    if (missing.length) fail(`${h.url} sem os eventos: ${missing.join(", ")} (rode stripe:webhook de novo para corrigir)`);
    else console.log(`  ${c.ok} ${h.url} ${c.dim(h.status)}`);
  }
}
if (!process.env.STRIPE_WEBHOOK_SECRET) console.log(`  ${c.warn} STRIPE_WEBHOOK_SECRET vazio: sem ele os pagamentos não atualizam o board.`);

console.log(c.b("\n5 · Impostos (Stripe Tax)"));
if (process.env.STRIPE_AUTOMATIC_TAX === "1") {
  const tax = await stripe.tax.settings.retrieve().catch(() => null);
  if (tax?.status === "active") console.log(`  ${c.ok} Stripe Tax ativo`);
  else fail("STRIPE_AUTOMATIC_TAX=1 mas o Stripe Tax não está ativo (Settings → Tax). O checkout vai falhar.");
} else {
  console.log(`  ${c.dim("desligado (STRIPE_AUTOMATIC_TAX≠1). Ligue antes de vender para consumidores na UE/UK/AU/JP.")}`);
}

console.log(problems ? `\n${c.bad} ${problems} problema(s) encontrado(s).\n` : `\n${c.ok} Tudo certo.\n`);
process.exit(problems ? 1 : 0);
