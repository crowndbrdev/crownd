import { paymentMode } from "@/lib/payments";

export const dynamic = "force-dynamic";

/** Uptime / go-live probe. Public on purpose: exposes only whether bids are open, never config. */
export function GET() {
  const webhook = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  return Response.json(
    { ok: true, payments: paymentMode(), webhook },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
