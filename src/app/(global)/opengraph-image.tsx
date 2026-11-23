import { ImageResponse } from "next/og";
import { COUNTRIES } from "@/config/countries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Crownd — public leaderboards of indie products, one per country";

/** Social / search-card image for the global hub (Naver and Yandex show it in result cards). */
export default function OG() {
  const n = COUNTRIES.length;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0E0D12", color: "#F7F3EA", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 800 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="#F7F3EA">
            <rect x="10" y="26" width="12" height="26" rx="3" /><rect x="26" y="14" width="12" height="38" rx="3" /><rect x="42" y="32" width="12" height="20" rx="3" />
            <rect x="8" y="50" width="48" height="7" rx="2" /><circle cx="16" cy="19" r="4.5" /><circle cx="32" cy="6.5" r="5" fill="#FFC531" /><circle cx="48" cy="25" r="4.5" />
          </svg>
          crownd
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 112, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>{`${n} crowns.`}</div>
          <div style={{ display: "flex", fontSize: 112, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, color: "#FFC531" }}>One world.</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 34, color: "#9C978C" }}>
            {`Public leaderboards of indie products in ${n} countries. Bid for #1 or launch free.`}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9C978C" }}>crownd.dev</div>
      </div>
    ),
    size,
  );
}
