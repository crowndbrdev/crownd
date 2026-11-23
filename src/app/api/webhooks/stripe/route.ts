import { NextResponse, type NextRequest } from "next/server";
import { confirmPayment, expirePayment } from "@/lib/board";
import { verifyWebhook } from "@/lib/payments";

/**
 * Stripe webhook. Listen for:
 *  - checkout.session.completed            (cards, wallets: paid immediately)
 *  - checkout.session.async_payment_succeeded (Pix, Konbini, OXXO, SEPA, Boleto…)
 *  - checkout.session.async_payment_failed / checkout.session.expired → payment marked expired
 * Only `payment_status === "paid"` changes the board. Handlers are idempotent (Stripe retries).
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  let event;
  try {
    event = await verifyWebhook(body, req.headers.get("stripe-signature"));
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;
    if (paymentId && session.payment_status === "paid") await confirmPayment(paymentId, undefined, session.metadata?.description);
  }
  if (event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired") {
    const paymentId = event.data.object.metadata?.paymentId;
    if (paymentId) await expirePayment(paymentId);
  }
  return NextResponse.json({ received: true });
}
