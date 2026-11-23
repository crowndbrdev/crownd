import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getCountry } from "@/config/countries";
import { ListingError, normalizeUrl } from "@/lib/bidding";
import { createLaunch } from "@/lib/board";
import { getMessages } from "@/i18n";
import { cleanText, guard } from "@/lib/security";

const Body = z.object({
  country: z.string(),
  url: z.string().min(1).max(500),
  name: z.string().trim().min(1).max(60),
  tagline: z.string().trim().max(120).default(""),
});

export async function POST(req: NextRequest) {
  const blocked = await guard(req, { bucket: "write" });
  if (blocked) return blocked;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  const c = parsed.success ? getCountry(parsed.data.country) : undefined;
  if (!parsed.success || !c) return NextResponse.json({ error: "invalid request" }, { status: 400 });
  const m = getMessages(c);
  try {
    const n = normalizeUrl(parsed.data.url);
    const name = cleanText(parsed.data.name, 60);
    if (!name) return NextResponse.json({ error: m.errors.generic }, { status: 400 });
    const res = await createLaunch(c, { ...n, name, tagline: cleanText(parsed.data.tagline, 120) });
    if ("error" in res) return NextResponse.json({ error: m.errors[res.error!] }, { status: 409 });
    return NextResponse.json({ ok: true, message: m.launches.ok });
  } catch (e) {
    const code = e instanceof ListingError ? e.code : "generic";
    return NextResponse.json({ error: m.errors[code as keyof typeof m.errors] ?? m.errors.generic }, { status: 400 });
  }
}
