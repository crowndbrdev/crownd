import { NextResponse, type NextRequest } from "next/server";
import { confirmPayment, getPayment } from "@/lib/board";
import { paymentMode } from "@/lib/payments";
import { guard } from "@/lib/security";

/** Demo-only: simulates the webhook. Disabled as soon as Stripe is configured. */
export async function POST(req: NextRequest, ctx: RouteContext<"/api/demo-pay/[id]">) {
  const blocked = await guard(req, { bucket: "write" });
  if (blocked) return blocked;
  if (paymentMode() !== "demo" || process.env.NODE_ENV === "production")
    return NextResponse.json({ error: "disabled" }, { status: 404 });
  const { id } = await ctx.params;
  const p = await getPayment(id);
  if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (p.status === "pending" && Date.now() > p.expiresAt) return NextResponse.json({ error: "expired" }, { status: 410 });
  const name = req.cookies.get(`crownd_name_${id}`)?.value;
  await confirmPayment(id, name, req.cookies.get(`crownd_desc_${id}`)?.value);
  return NextResponse.json({ ok: true });
}
