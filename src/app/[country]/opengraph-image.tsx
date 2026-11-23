import { ImageResponse } from "next/og";
import { fromMinor, getCountry } from "@/config/countries";
import { getBoard } from "@/lib/board";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";
export const alt = "Crownd — who holds the crown right now";

/** The OG renderer's built-in font lacks fullwidth ￥ and Arabic glyphs: use narrow Latin symbols here. */
const ogMoney = (n: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(n);

/** Social card = live scoreboard: every share shows the current #1, so the image itself is the taunt. */
export default async function OG({ params }: { params: Promise<{ country: string }> }) {
  const c = getCountry((await params).country);
  const king = c ? (await getBoard(c.slug))[0] : undefined;
  const accent = c?.accent.hex ?? "#FFC531";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0E0D12", color: "#F7F3EA", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 800 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="#F7F3EA">
            <rect x="10" y="26" width="12" height="26" rx="3" /><rect x="26" y="14" width="12" height="38" rx="3" /><rect x="42" y="32" width="12" height="20" rx="3" />
            <rect x="8" y="50" width="48" height="7" rx="2" /><circle cx="16" cy="19" r="4.5" /><circle cx="32" cy="6.5" r="5" fill="#FFC531" /><circle cx="48" cy="25" r="4.5" />
          </svg>
          crownd
          <div style={{ display: "flex", marginLeft: 12, fontSize: 26, padding: "6px 18px", borderRadius: 999, background: accent, color: c?.accent.ink ?? "#000" }}>
            {c ? `${c.nameEn} · ${c.currency}` : "Global"}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#9C978C", letterSpacing: 4, textTransform: "uppercase" }}>Current crown</div>
          <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>{king?.name ?? "The throne is empty"}</div>
          {king && c ? <div style={{ fontSize: 44, color: "#FFC531", marginTop: 16 }}>{ogMoney(fromMinor(king.bidTotal, c), c.currency)}</div> : null}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9C978C" }}>{`crownd.dev/${c?.slug ?? ""} — take #1`}</div>
      </div>
    ),
    size,
  );
}
