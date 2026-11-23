import { NextResponse } from "next/server";
import { liveStats } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/** Live counters for the homepage widget (polled every 30s). */
export async function GET() {
  const stats = await liveStats();
  return NextResponse.json(stats, { headers: { "Cache-Control": "public, max-age=15, s-maxage=15" } });
}
