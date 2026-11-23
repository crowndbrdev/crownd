import { NextResponse, type NextRequest } from "next/server";
import { getCountry } from "@/config/countries";
import { getBoard, getCurrentReign } from "@/lib/board";

/** Public JSON of a country board (used for live polling and as an open API for makers). */
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/board/[country]">) {
  const c = getCountry((await ctx.params).country);
  if (!c) return NextResponse.json({ error: "unknown edition" }, { status: 404 });
  const [board, reign] = await Promise.all([getBoard(c.slug), getCurrentReign(c.slug)]);
  return NextResponse.json(
    {
      edition: c.slug, currency: c.currency, minorExp: c.minorExp,
      reign: reign ? { name: reign.name, since: reign.startedAt } : null,
      board: board.map((l, i) => ({ rank: i + 1, name: l.name, url: l.url, slug: l.slug, bidTotal: l.bidTotal, clicks: l.clicks })),
    },
    { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" } },
  );
}
