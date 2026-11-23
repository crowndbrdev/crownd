import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import postsData from "./posts.json";
import { COUNTRIES } from "../../src/config/countries";
import { C, FONT, applyPalette } from "./theme";
import { Card, Chip, Mark } from "./kit";

/* Static social posts (images and carousel slides). One composition renders any slide via props. */

type Slide = Record<string, unknown> & { t: string };
export type PostDef = { id: string; net: string; format: string; palette: string; title: string; slides: Slide[] };
export const POSTS = postsData as unknown as PostDef[];

export const SIZES: Record<string, [number, number]> = {
  ig: [1080, 1350], th: [1080, 1350], li: [1080, 1350], x: [1600, 900], tt: [1080, 1920],
};
const HANDLE: Record<string, string> = { ig: "@crowndbr", th: "@crowndbr", x: "@crowndbr", tt: "@crownd.dev", li: "Crownd" };

/** Title with one highlighted fragment (brand gold role). */
function Hi({ text, hi }: { text: string; hi?: string }) {
  if (!hi || !text.includes(hi)) return <>{text}</>;
  const [a, b] = text.split(hi);
  return <>{a}<span style={{ color: C.gold }}>{hi}</span>{b}</>;
}

const S = (s: number, extra?: CSSProperties): CSSProperties => ({ fontFamily: FONT.display, letterSpacing: "-0.035em", lineHeight: 0.98, color: C.ink, ...extra, fontSize: (extra?.fontSize as number) * s });

function Body({ slide, s, wide }: { slide: Slide; s: number; wide: boolean }) {
  const g = (k: string) => slide[k] as string;
  switch (slide.t) {
    case "cover":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 36 * s }}>
          {g("kicker") ? <Chip style={{ alignSelf: "flex-start", fontSize: 34 * s, padding: `${12 * s}px ${26 * s}px`, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT.mono }}>{g("kicker")}</Chip> : null}
          <div style={S(s, { fontSize: wide ? 120 : 132, fontWeight: 800 })}><Hi text={g("title")} hi={g("hi")} /></div>
          {g("sub") ? <div style={S(s, { fontSize: 46, fontWeight: 500, color: C.muted, lineHeight: 1.2, letterSpacing: "-0.01em" })}>{g("sub")}</div> : null}
        </div>
      );
    case "text":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 34 * s }}>
          <div style={S(s, { fontSize: 104, fontWeight: 800, color: C.gold })}>{g("head")}</div>
          <div style={S(s, { fontSize: 58, fontWeight: 600, lineHeight: 1.18, letterSpacing: "-0.015em" })}>{g("body")}</div>
        </div>
      );
    case "list":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 30 * s }}>
          <div style={S(s, { fontSize: 96, fontWeight: 800 })}>{g("head")}</div>
          <div style={{ display: "grid", gridTemplateColumns: wide ? "1fr 1fr" : "1fr", gap: 24 * s }}>
          {(slide.items as string[]).map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 28 * s, padding: `${26 * s}px ${32 * s}px`, borderRadius: 30 * s, background: C.surface, border: `${3 * s}px solid ${C.line}` }}>
              <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 46 * s, color: C.gold }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={S(s, { fontSize: wide ? 44 : 50, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" })}>{it}</span>
            </div>
          ))}
          </div>
        </div>
      );
    case "stat":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 * s, alignItems: "flex-start" }}>
          <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: (g("value").length > 4 ? 230 : 330) * s, letterSpacing: "-0.07em", lineHeight: 1, color: C.gold }}>{g("value")}</div>
          <div style={S(s, { fontSize: 84, fontWeight: 800 })}>{g("label")}</div>
          {g("sub") ? <div style={S(s, { fontSize: 44, fontWeight: 500, color: C.muted, lineHeight: 1.2, letterSpacing: "-0.01em" })}>{g("sub")}</div> : null}
        </div>
      );
    case "step":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 34 * s }}>
          <div style={{ width: 170 * s, height: 170 * s, borderRadius: 999, background: C.gold, color: C.bg, display: "grid", placeItems: "center", fontFamily: FONT.mono, fontWeight: 800, fontSize: 104 * s }}>{g("n")}</div>
          <div style={S(s, { fontSize: 120, fontWeight: 800 })}>{g("title")}</div>
          <div style={S(s, { fontSize: 54, fontWeight: 600, color: C.muted, lineHeight: 1.2, letterSpacing: "-0.015em" })}>{g("body")}</div>
        </div>
      );
    case "quote":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 30 * s }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 200 * s, lineHeight: 0.6, color: C.gold }}>“</div>
          <div style={S(s, { fontSize: wide ? 104 : 116, fontWeight: 800 })}>{g("q")}</div>
          {g("by") ? <div style={{ fontFamily: FONT.serif, fontSize: 60 * s, color: C.muted }}>{g("by")}</div> : null}
        </div>
      );
    case "compare": {
      const col = (title: string, items: string[], hi: boolean) => (
        <Card style={{ flex: 1, padding: 40 * s, borderRadius: 40 * s, border: `${4 * s}px solid ${hi ? C.gold : C.line}` }}>
          <div style={S(s, { fontSize: 72, fontWeight: 800, color: hi ? C.gold : C.ink })}>{title}</div>
          {items.map((it) => <div key={it} style={S(s, { fontSize: 42, fontWeight: 600, lineHeight: 1.2, marginTop: 26, letterSpacing: "-0.01em" })}>{hi ? "✓" : "✕"} {it}</div>)}
        </Card>
      );
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 34 * s }}>
          {g("head") ? <div style={S(s, { fontSize: 90, fontWeight: 800 })}>{g("head")}</div> : null}
          <div style={{ display: "flex", gap: 26 * s }}>{col(g("lt"), slide.l as string[], false)}{col(g("rt"), slide.r as string[], true)}</div>
        </div>
      );
    }
    case "swatch": {
      const c = COUNTRIES.find((x) => x.slug === g("slug"))!;
      return (
        <div style={{ flex: 1, alignSelf: "stretch", borderRadius: 56 * s, background: c.accent.hex, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 60 * s, boxShadow: `0 ${30 * s}px ${90 * s}px ${C.shadow}` }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 40 * s, color: c.accent.ink, opacity: 0.85 }}>/{c.slug} · {c.nameLocal.split(" · ")[0]}</div>
          <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 128 * s, lineHeight: 0.95, letterSpacing: "-0.045em", color: c.accent.ink, marginTop: 12 * s }}>{c.accent.name}</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 44 * s, color: c.accent.ink, opacity: 0.85, marginTop: 14 * s }}>{c.accent.hex}</div>
        </div>
      );
    }
    case "cta":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 30 * s, alignItems: "flex-start" }}>
          <Mark size={170 * s} />
          <div style={S(s, { fontSize: 112, fontWeight: 800 })}>{g("line1")}</div>
          <div style={S(s, { fontSize: 112, fontWeight: 800, color: C.gold })}>{g("line2")}</div>
          <Chip bg={C.ink} color={C.bg} border={C.gold} style={{ fontSize: 46 * s, padding: `${18 * s}px ${36 * s}px`, borderWidth: 5 * s, marginTop: 20 * s }}>{g("hint")}</Chip>
        </div>
      );
    case "board": {
      const rows = [["SEU PRODUTO", "R$ 230", true], ["produto ●●●●", "R$ 220", false], ["produto ●●●", "R$ 150", false], ["produto ●●●●●", "R$ 95", false]] as const;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 34 * s }}>
          <div style={S(s, { fontSize: 104, fontWeight: 800 })}>{g("head")}</div>
          <Card style={{ padding: 0, overflow: "hidden", borderRadius: 40 * s }}>
            {rows.map(([n, v, you], i) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 24 * s, padding: `${30 * s}px ${36 * s}px`, borderBottom: `${2 * s}px solid ${C.line}`, background: you ? `${C.gold}1F` : "transparent" }}>
                <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 44 * s, color: i === 0 ? C.gold : C.muted, width: 80 * s }}>#{i + 1}</span>
                <span style={S(s, { fontSize: 46, fontWeight: 700, color: you ? C.gold : C.ink, flex: 1, letterSpacing: "-0.01em" })}>{i === 0 ? "👑 " : ""}{n}</span>
                <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 42 * s, color: i === 0 ? C.gold : C.ink }}>{v}</span>
              </div>
            ))}
          </Card>
          <div style={S(s, { fontSize: 36, fontWeight: 500, color: C.muted, letterSpacing: 0 })}>Ilustração · produtos anônimos</div>
        </div>
      );
    }
    case "hall":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 30 * s }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 150 * s, color: C.gold, lineHeight: 1 }}>Hall da Fama</div>
          <Card style={{ padding: 30 * s, borderRadius: 40 * s, border: `${4 * s}px solid ${C.goldDeep}` }}>
            {["??? · o primeiro rei do Brasil", "—", "—", "—"].map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 24 * s, padding: `${28 * s}px ${20 * s}px`, borderBottom: i < 3 ? `${2 * s}px solid ${C.line}` : "none", opacity: i ? 0.5 : 1 }}>
                <span style={{ fontSize: 48 * s }}>{i ? "·" : "👑"}</span>
                <span style={S(s, { fontSize: 48, fontWeight: 700, color: i ? C.ink : C.gold, letterSpacing: "-0.01em" })}>{e}</span>
              </div>
            ))}
          </Card>
          <div style={{ fontFamily: FONT.serif, fontSize: 84 * s, color: C.ink }}>para sempre.</div>
        </div>
      );
    case "badge":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 34 * s }}>
          <div style={S(s, { fontSize: wide ? 92 : 112, fontWeight: 800 })}>Chegou no #1? <span style={{ color: C.gold }}>Mostra.</span></div>
          <Card style={{ padding: 0, overflow: "hidden", borderRadius: 40 * s }}>
            <div style={{ display: "flex", gap: 12 * s, padding: `${22 * s}px ${30 * s}px`, borderBottom: `${3 * s}px solid ${C.line}` }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 22 * s, height: 22 * s, borderRadius: 99, background: c }} />)}
              <span style={{ marginLeft: 16 * s, fontFamily: FONT.mono, fontSize: 30 * s, color: C.muted }}>seuproduto.com</span>
            </div>
            <div style={{ padding: (wide ? 30 : 44) * s }}>
              {wide ? null : <div style={{ height: 34 * s, width: "55%", borderRadius: 12, background: C.line }} />}
              {wide ? null : <div style={{ height: 22 * s, width: "80%", borderRadius: 12, background: C.line, opacity: 0.7, marginTop: 20 * s }} />}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 22 * s, marginTop: wide ? 0 : 44 * s, padding: `${22 * s}px ${34 * s}px`, borderRadius: 26 * s, background: "#FFC531", border: `${4 * s}px solid #C98A00` }}>
                <Mark size={84 * s} color="#0E0D12" />
                <div>
                  <div style={{ fontFamily: FONT.display, fontSize: 30 * s, color: "#0E0D12", opacity: 0.7 }}>Crownd Brasil</div>
                  <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 60 * s, color: "#0E0D12" }}>#1 👑</div>
                </div>
              </div>
            </div>
          </Card>
          <div style={S(s, { fontSize: 42, fontWeight: 600, color: C.muted, letterSpacing: 0 })}>Selo ao vivo: atualiza sozinho com a sua posição.</div>
        </div>
      );
    case "analytics": {
      const pts = Array.from({ length: 12 }, (_, i) => [i * 62, 220 - (Math.sin(i * 0.9) * 50 + i * 12 + 40)]);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 34 * s }}>
          <div style={S(s, { fontSize: wide ? 96 : 120, fontWeight: 800 })}>Analytics <span style={{ color: C.gold }}>público.</span></div>
          <Card style={{ borderRadius: 40 * s, padding: 40 * s }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 34 * s, color: C.muted }}>crownd.dev/analytics</div>
            <svg viewBox="0 0 690 240" width="100%" height={(wide ? 120 : 260) * s} style={{ marginTop: 16 * s }}>
              <path d={pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ")} fill="none" stroke={C.gold} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ display: "flex", gap: 14 * s, flexWrap: "wrap", marginTop: 12 * s }}>
              {["visitantes", "países", "páginas", "sem cookies"].map((t) => <Chip key={t} style={{ fontSize: 34 * s, padding: `${10 * s}px ${22 * s}px` }}>{t}</Chip>)}
            </div>
          </Card>
          <div style={S(s, { fontSize: 36, fontWeight: 500, color: C.muted, letterSpacing: 0 })}>Gráfico ilustrativo · os números reais estão no site.</div>
        </div>
      );
    }
    default:
      return null;
  }
}

export function PostSlide({ postId, index }: { postId: string; index: number }) {
  const post = POSTS.find((p) => p.id === postId)!;
  applyPalette(post.palette);
  const [w, h] = SIZES[post.net];
  const wide = w > h;
  const s = wide ? 1.08 : post.net === "tt" ? 1.05 : 1;
  const slide = post.slides[index];
  const pad = (wide ? 80 : 90) * (post.net === "tt" ? 1.1 : 1);
  const total = post.slides.length;
  const fill = slide.t === "swatch";
  const top = post.net === "tt" ? 200 : pad; // TikTok: keep clear of the top UI
  const bottomSafe = post.net === "tt" ? 380 : 0; // …and of the caption/buttons at the bottom
  const more = total > 1 && index < total - 1;
  const footer: ReactNode = (
    <div style={{ display: "flex", alignItems: "center", gap: 18 * s }}>
      <Mark size={64 * s} />
      <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 40 * s, color: C.ink, letterSpacing: "-0.03em" }}>crownd.dev</span>
      <span style={{ marginLeft: "auto", fontFamily: FONT.mono, fontSize: 32 * s, color: C.muted }}>{HANDLE[post.net]}{total > 1 ? ` · ${index + 1}/${total}` : ""}</span>
      {more ? <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 52 * s, color: C.gold }}>→</span> : null}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(${w * 0.9}px ${w * 0.9}px at 85% 8%, ${C.glowA}, transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(${w * 0.8}px ${w * 0.7}px at 0% 100%, ${C.glowB}, transparent 70%)` }} />
      <div style={{ position: "absolute", left: pad, right: pad, top, bottom: pad + bottomSafe, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: fill ? "stretch" : "center" }}>
          <Body slide={slide} s={s} wide={wide} />
        </div>
        <div style={{ marginTop: 40 * s }}>{footer}</div>
      </div>
    </AbsoluteFill>
  );
}
