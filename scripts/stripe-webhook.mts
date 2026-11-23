/**
 * npm run stripe:webhook -- --url https://crownd.dev [--env-file .secrets.production] [--recreate]
 *
 * Creates (or fixes) the production webhook endpoint via the API — no dashboard clicking.
 * Stripe only reveals a signing secret at creation time, so it's written straight to
 * --env-file (default .secrets.production — never a .env* file) and never printed in full.
 */
import Stripe from "stripe";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const EVENTS: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
];

const args = process.argv.slice(2);
const arg = (name: string) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const base = arg("url")?.replace(/\/$/, "");
// Never a .env* file: Next.js would bake it into the production bundle.
const envFile = arg("env-file") ?? ".secrets.production";
const recreate = args.includes("--recreate");

const key = process.env.STRIPE_SECRET_KEY;
if (!key) { console.error("STRIPE_SECRET_KEY ausente. Rode: npm run stripe:setup"); process.exit(1); }
if (!base || !/^https:\/\//.test(base)) { console.error("Uso: npm run stripe:webhook -- --url https://seu-dominio"); process.exit(1); }

const stripe = new Stripe(key);
const url = `${base}/api/webhooks/stripe`;
const existing = (await stripe.webhookEndpoints.list({ limit: 100 })).data.find((h) => h.url === url);

function upsertEnv(file: string, k: string, v: string) {
  const lines = existsSync(file) ? readFileSync(file, "utf8").split(/\r?\n/).filter((l) => l && !l.startsWith(`${k}=`)) : [];
  lines.push(`${k}='${v}'`);
  writeFileSync(file, lines.join("\n") + "\n", { mode: 0o600 });
}

if (existing && !recreate) {
  await stripe.webhookEndpoints.update(existing.id, { enabled_events: EVENTS, disabled: false });
  console.log(`✓ Endpoint já existia (${existing.id}); eventos atualizados.`);
  console.log("  O Stripe não mostra o segredo de novo. Se você não tem STRIPE_WEBHOOK_SECRET de produção, rode com --recreate.");
  process.exit(0);
}
if (existing && recreate) {
  await stripe.webhookEndpoints.del(existing.id);
  console.log(`✓ Endpoint antigo ${existing.id} removido.`);
}

const created = await stripe.webhookEndpoints.create({
  url,
  enabled_events: EVENTS,
  description: "Crownd — board updates (auto-created by scripts/stripe-webhook.mts)",
});
upsertEnv(envFile, "STRIPE_WEBHOOK_SECRET", created.secret!);
console.log(`✓ Webhook criado: ${url} (${created.id}, modo ${created.livemode ? "LIVE" : "teste"})`);
console.log(`✓ Segredo gravado em ${envFile} → STRIPE_WEBHOOK_SECRET=${created.secret!.slice(0, 10)}…`);
console.log("  Copie esse valor para as variáveis de ambiente da hospedagem (Vercel → Settings → Environment Variables).");
