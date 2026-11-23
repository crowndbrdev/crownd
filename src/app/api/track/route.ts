import { NextResponse, type NextRequest } from "next/server";
import { cleanPath, isBot, track } from "@/lib/analytics";
import { guard } from "@/lib/security";

/** Pageview / heartbeat beacon. Always answers 204 so it never affects the page. */
export async function POST(req: NextRequest) {
  const blocked = await guard(req, { bucket: "track", maxBytes: 512 });
  if (blocked) return new NextResponse(null, { status: 204 });
  const ua = req.headers.get("user-agent") ?? "";
  if (isBot(ua)) return new NextResponse(null, { status: 204 });
  try {
    const body = (await req.json()) as { k?: string; p?: string };
    const path = cleanPath(String(body?.p ?? ""));
    const kind = body?.k === "ping" ? "ping" : "pageview";
    if (path) {
      const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
      await track({ kind, path, ip, ua, country: req.headers.get("cf-ipcountry") });
    }
  } catch {
    /* malformed beacon: ignore */
  }
  return new NextResponse(null, { status: 204 });
}
