import type { MetadataRoute } from "next";
import { COUNTRIES } from "@/config/countries";

/**
 * Web App Manifest: makes Crownd installable ("Add to Home Screen" / "Install app") on Android,
 * iOS, Windows and macOS with no store, no review and no 15–30% store fee on bids.
 * PNG 192/512 icons satisfy Chrome's install criteria; "maskable" lets Android crop it into any
 * shape (the mark sits inside the 80% safe zone). The same manifest is what PWABuilder/Bubblewrap
 * would wrap into a Google Play (TWA) or Microsoft Store package later.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Crownd: who's #1?",
    short_name: "Crownd",
    description: `Public leaderboards of indie products in ${COUNTRIES.length} countries. Who holds the crown?`,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0E0D12",
    theme_color: "#0E0D12",
    categories: ["business", "productivity", "social"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    shortcuts: [
      { name: "Crownd Brasil", url: "/br", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Crownd USA", url: "/us", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Free launches", url: "/br/launches", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
