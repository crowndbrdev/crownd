import type { NextRequest } from "next/server";
import { getCountry } from "@/config/countries";
import { getBoard } from "@/lib/board";

const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

/**
 * Live, embeddable rank badge: <a href="https://crownd.dev/jp/p/slug"><img src=".../api/badge/jp/slug"></a>
 * Every embed is a contextual backlink to the edition — the SEO flywheel.
 * ?theme=dark|light
 */
export async function GET(req: NextRequest, ctx: RouteContext<"/api/badge/[country]/[slug]">) {
  const { country, slug } = await ctx.params;
  const c = getCountry(country);
  const theme = req.nextUrl.searchParams.get("theme") === "dark" ? "dark" : "light";
  const board = c ? await getBoard(c.slug) : [];
  const idx = board.findIndex((l) => l.slug === slug);
  const rank = idx >= 0 ? idx + 1 : null;
  const isKing = rank === 1;

  const bg = theme === "dark" ? "#0E0D12" : "#FFFDF8";
  const fg = theme === "dark" ? "#F4F1EA" : "#0E0D12";
  const line = isKing ? "#FFC531" : theme === "dark" ? "#2A2833" : "#E6DFCF";
  const label = c ? c.edition : "Crownd";
  const value = rank ? `#${rank}` : "—";
  const w = 220;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="54" viewBox="0 0 ${w} 54" role="img" aria-label="${esc(`${value} · ${label}`)}">
  <rect x="1" y="1" width="${w - 2}" height="52" rx="12" fill="${bg}" stroke="${line}" stroke-width="2"/>
  <g transform="translate(14 11) scale(0.5)" fill="${fg}">
    <rect x="10" y="26" width="12" height="26" rx="3"/><rect x="26" y="14" width="12" height="38" rx="3"/><rect x="42" y="32" width="12" height="20" rx="3"/>
    <rect x="8" y="50" width="48" height="7" rx="2"/>
    <circle cx="16" cy="19" r="4.5"/><circle cx="32" cy="6.5" r="5" fill="#FFC531"/><circle cx="48" cy="25" r="4.5"/>
  </g>
  <text x="54" y="23" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10.5" fill="${fg}" opacity=".65">${esc(label)}</text>
  <text x="54" y="41" font-family="ui-monospace,Menlo,monospace" font-size="17" font-weight="700" fill="${fg}">${esc(value)}${isKing ? " 👑" : ""}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=600",
    },
  });
}
