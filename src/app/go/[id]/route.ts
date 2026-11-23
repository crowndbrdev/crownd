import { NextResponse, type NextRequest } from "next/server";
import { getClickTarget, recordClick } from "@/lib/board";
import { clientIp, guard } from "@/lib/security";

/** Outbound click: dedupe per visitor/day, then 302 to the product with a ref tag. */
export async function GET(req: NextRequest, ctx: RouteContext<"/go/[id]">) {
  const { id } = await ctx.params;
  // Rate-limited clicks are still redirected, just not counted (keeps ranking fraud-resistant).
  const limited = await guard(req, { bucket: "click", sameOrigin: false });
  const target = await getClickTarget(id);
  if (!target) return NextResponse.redirect(new URL("/", req.url));
  const ip = clientIp(req);
  const ua = req.headers.get("user-agent") ?? "";
  const isBot = /bot|crawl|spider|slurp|preview|facebookexternalhit/i.test(ua);
  if (!isBot && !limited) await recordClick(id, target.kind, ip, ua);
  const dest = new URL(target.url);
  dest.searchParams.set("ref", "crownd");
  return NextResponse.redirect(dest, { status: 302, headers: { "X-Robots-Tag": "noindex, nofollow" } });
}
