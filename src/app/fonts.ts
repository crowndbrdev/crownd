import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono, Noto_Sans_JP, Noto_Sans_KR, IBM_Plex_Sans_Arabic } from "next/font/google";
import type { Country } from "@/config/countries";

/** Brand display & UI face: characterful grotesque with optical sizes. */
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
});

/** Regal accent: italic serif for "crown" moments. */
export const instrument = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

/** Numbers: ranks, bids, timers. */
export const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

const notoJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-script", display: "swap", preload: false });
const notoKR = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-script", display: "swap", preload: false });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "600", "700"], variable: "--font-script", display: "swap" });

/** Script fallback per edition so CJK/Arabic glyphs get a designed face, not the OS default. */
export function scriptFont(c: Pick<Country, "script">) {
  switch (c.script) {
    case "jp": return notoJP.variable;
    case "kr": return notoKR.variable;
    case "ar": return plexArabic.variable;
    default: return "";
  }
}

export const baseFonts = `${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`;
