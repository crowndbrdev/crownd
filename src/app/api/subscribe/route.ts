import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getCountry } from "@/config/countries";
import { subscribe } from "@/lib/board";
import { getMessages } from "@/i18n";
import { guard } from "@/lib/security";

const Body = z.object({ country: z.string(), email: z.string().email().max(200) });

export async function POST(req: NextRequest) {
  const blocked = await guard(req, { bucket: "write", maxBytes: 1024 });
  if (blocked) return blocked;
  const raw = await req.json().catch(() => null);
  const c = getCountry(String(raw?.country ?? ""));
  const parsed = Body.safeParse(raw);
  if (!c) return NextResponse.json({ error: "invalid request" }, { status: 400 });
  const m = getMessages(c);
  if (!parsed.success) return NextResponse.json({ error: m.errors.email }, { status: 400 });
  await subscribe(parsed.data.email, c.slug);
  return NextResponse.json({ ok: true, message: m.newsletter.ok });
}
