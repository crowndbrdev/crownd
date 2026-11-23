import "server-only";
import Stripe from "stripe";
import type { Country } from "@/config/countries";
import type { Payment } from "@/db/schema";

/**
 * Payment modes:
 *  - "stripe": real Stripe Checkout in the edition's currency (dynamic payment methods).
 *  - "demo":   local development without keys → simulated checkout.
 *  - "closed": production without a LIVE key → bids are refused (never let a test key or the
 *              demo checkout hand out #1 for free on the public site).
 * Runs on Cloudflare Workers: fetch-based HTTP client + WebCrypto webhook verification.
 */
let stripe: Stripe | null = null;

const isProd = () => process.env.NODE_ENV === "production";
const key = () => process.env.STRIPE_SECRET_KEY ?? "";
const isLiveKey = (k: string) => /^(sk|rk)_live_/.test(k);

export function paymentMode(): "stripe" | "demo" | "closed" {
  const k = key();
  if (!k) return isProd() ? "closed" : "demo";
  if (isProd() && !isLiveKey(k) && process.env.ALLOW_TEST_PAYMENTS !== "1") return "closed";
  return "stripe";
}

export function stripeClient(): Stripe | null {
  if (paymentMode() !== "stripe") return null;
  stripe ??= new Stripe(key(), { httpClient: Stripe.createFetchHttpClient() });
  return stripe;
}

export async function createCheckout(p: Payment, c: Country, productLabel: string, origin: string, description?: string): Promise<{ url: string; ref?: string }> {
  const mode = paymentMode();
  if (mode === "closed") throw new PaymentsClosedError();
  const s = stripeClient();
  if (!s) return { url: `${origin}/${c.slug}/checkout/${p.id}` };
  // Stripe Tax: prices are tax-INCLUSIVE so a bid of 100 always charges exactly 100.
  const tax = process.env.STRIPE_AUTOMATIC_TAX === "1";

  const session = await s.checkout.sessions.create({
    mode: "payment",
    customer_email: p.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: c.currency.toLowerCase(),
          unit_amount: p.amount,
          ...(tax ? { tax_behavior: "inclusive" as const } : {}),
          product_data: { name: productLabel, description: p.url },
        },
      },
    ],
    // Stripe's minimum session lifetime is 30 minutes — matches CHECKOUT_TTL_MS.
    expires_at: Math.floor(p.expiresAt / 1000) + 60,
    locale: "auto",
    ...(tax ? { automatic_tax: { enabled: true }, billing_address_collection: "required" as const } : {}),
    // description (≤160 chars, already cleaned) rides in metadata and is applied by the webhook.
    metadata: { paymentId: p.id, country: c.slug, kind: p.kind, ...(description ? { description } : {}) },
    // "C1 ASSESSORIA* CROWND" on the card statement: buyers recognise the charge → fewer disputes.
    payment_intent_data: { metadata: { paymentId: p.id, country: c.slug }, statement_descriptor_suffix: "CROWND" },
    success_url: `${origin}/${c.slug}/checkout/${p.id}?status=success`,
    cancel_url: `${origin}/${c.slug}/checkout/${p.id}?status=cancel`,
  });
  return { url: session.url!, ref: session.id };
}

export class PaymentsClosedError extends Error {
  constructor() {
    super("payments closed");
  }
}

export async function verifyWebhook(body: string, signature: string | null): Promise<Stripe.Event> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key() || !secret || !signature) throw new Error("webhook not configured");
  const s = stripe ?? new Stripe(key(), { httpClient: Stripe.createFetchHttpClient() });
  return s.webhooks.constructEventAsync(body, signature, secret, undefined, Stripe.createSubtleCryptoProvider());
}
