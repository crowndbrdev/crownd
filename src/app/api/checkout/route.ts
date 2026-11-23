import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getCountry, toMinor, formatMoney } from "@/config/countries";
import { ListingError, normalizeUrl, quote } from "@/lib/bidding";
import { createPayment, getBoard, getLaunches, setProviderRef } from "@/lib/board";
import { PaymentsClosedError, createCheckout, paymentMode } from "@/lib/payments";
import { getMessages, t } from "@/i18n";
import { cleanText, guard } from "@/lib/security";

const Body = z.object({
  country: z.string(),
  url: z.string().min(1).max(500),
  total: z.coerce.number().positive().optional(),
  email: z.string().email().max(200),
  kind: z.enum(["bid", "launch_highlight"]).default("bid"),
  name: z.string().max(60).optional(),
  description: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  const blocked = await guard(req, { bucket: "write" });
  if (blocked) return blocked;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  const c = parsed.success ? getCountry(parsed.data.country) : undefined;
  if (!parsed.success || !c) {
    const fallback = c ? getMessages(c) : null;
    const emailIssue = !parsed.success && parsed.error.issues.some((i) => i.path[0] === "email");
    return NextResponse.json({ error: emailIssue ? fallback?.errors.email ?? "invalid email" : "invalid request" }, { status: 400 });
  }
  const m = getMessages(c);
  if (paymentMode() === "closed") return NextResponse.json({ error: m.errors.closed }, { status: 503 });
  const { url, email, kind } = parsed.data;
  const name = parsed.data.name ? cleanText(parsed.data.name, 60) : undefined;
  const description = parsed.data.description ? cleanText(parsed.data.description, 160) : undefined;
  // Real request origin: works on workers.dev before the custom domain is live, and on crownd.dev after.
  const origin = req.nextUrl.origin;

  let norm;
  try {
    norm = normalizeUrl(url);
  } catch (e) {
    const code = e instanceof ListingError ? e.code : "invalid_url";
    return NextResponse.json({ error: m.errors[code as keyof typeof m.errors] ?? m.errors.generic }, { status: 400 });
  }

  const step = toMinor(c.minBid, c);
  let amount: number;
  let targetTotal: number;
  let label: string;

  if (kind === "launch_highlight") {
    const today = await getLaunches(c, "today");
    if (!today.some((l) => l.key === norm.key))
      return NextResponse.json({ error: m.errors.generic }, { status: 400 });
    amount = targetTotal = toMinor(c.launchHighlight, c);
    label = `${c.edition} · ${m.launches.featured} 24h`;
  } else {
    const desired = toMinor(parsed.data.total ?? c.minBid, c);
    try {
      const board = await getBoard(c.slug);
      const q = quote(board, norm.key, desired, step, step);
      amount = q.charge;
      targetTotal = q.total;
    } catch (e) {
      const code = e instanceof ListingError ? e.code : "generic";
      const msg = code === "too_low" ? t(m.errors.too_low, { amount: formatMoney(step, c) })
        : code === "step" ? t(m.errors.step, { amount: formatMoney(step, c) })
        : m.errors.generic;
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    label = `${c.edition} · ${m.product.bid}: ${formatMoney(targetTotal, c)}`;
  }

  const payment = await createPayment({
    country: c.slug, kind, key: norm.key, url: norm.url, host: norm.host, email,
    amount, targetTotal, currency: c.currency, provider: paymentMode(), name: name ?? null,
  });

  try {
    const session = await createCheckout(payment, c, label, origin, description);
    if (session.ref) await setProviderRef(payment.id, session.ref);
    const res = NextResponse.json({ url: session.url });
    if (name) res.cookies.set(`crownd_name_${payment.id}`, name.slice(0, 60), { httpOnly: true, sameSite: "lax", maxAge: 3600 });
    // Demo mode has no Stripe metadata: carry the description the same way as the name.
    if (description && paymentMode() === "demo") res.cookies.set(`crownd_desc_${payment.id}`, description, { httpOnly: true, sameSite: "lax", maxAge: 3600 });
    return res;
  } catch (err) {
    if (err instanceof PaymentsClosedError) return NextResponse.json({ error: m.errors.closed }, { status: 503 });
    console.error("[checkout]", err);
    return NextResponse.json({ error: m.errors.generic }, { status: 502 });
  }
}
