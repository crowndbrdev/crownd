import type { ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COUNTRIES } from "../../src/config/countries";
import { C, FONT } from "./theme";
import { Card, Chip, Mark, Slam, Stage, clamp, ease, usePop } from "./kit";
import type { SceneProps } from "./scenes";

/* Scenes for reels 4–9. Same rules as scenes.tsx: no invented numbers, other products anonymised. */

/** "ALGORITMO" gets struck through, then denied. */
export function NoAlgo() {
  const f = useCurrentFrame();
  const strike = ease(f, 14, 24);
  return (
    <Stage>
      <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.muted, opacity: ease(f, 0, 6) }}>seu post de lançamento:</div>
      <div style={{ position: "relative" }}>
        <Slam size={150}>ALGORITMO</Slam>
        <div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 22, borderRadius: 99, background: C.coup, transform: `scaleX(${strike})`, transformOrigin: "left center" }} />
      </div>
      <div style={{ display: "flex", gap: 18, opacity: ease(f, 4, 10) }}>
        <Chip>🙈 ninguém viu</Chip>
        <Chip>📉 enterrado</Chip>
      </div>
    </Stage>
  );
}

/** Public analytics: what's open, with no numbers (the real ones live at crownd.dev/analytics). */
export function Public({ dur }: SceneProps) {
  const f = useCurrentFrame();
  const draw = interpolate(f, [4, dur * 0.7], [0, 1], clamp);
  const pts = Array.from({ length: 12 }, (_, i) => [i * 62, 220 - (Math.sin(i * 0.9) * 50 + i * 12 + 40)]);
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <Stage>
      <Slam size={110}>tudo <span style={{ color: C.gold }}>público.</span></Slam>
      <Card style={{ width: 820, textAlign: "left" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 32, color: C.muted }}>crownd.dev/analytics</div>
        <svg viewBox="0 0 690 240" width={730} height={250} style={{ marginTop: 20 }}>
          <path d={path} fill="none" stroke={C.gold} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        </svg>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
          {["visitantes", "países", "páginas", "ao vivo"].map((t, i) => (
            <Chip key={t} style={{ fontSize: 34, padding: "10px 22px", opacity: ease(f, 10 + i * 5, 16 + i * 5) }}>{t}</Chip>
          ))}
        </div>
      </Card>
    </Stage>
  );
}

/** Big "30s" countdown hook. */
export function Countdown({ dur }: SceneProps) {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.round(interpolate(f, [0, dur], [30, 24], clamp)));
  return (
    <Stage>
      <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 300, color: C.gold, letterSpacing: "-0.07em", lineHeight: 1 }}>{n}s</div>
      <Slam delay={4} size={110}>lançamento<br /><span style={{ color: C.gold }}>grátis.</span></Slam>
      <div style={{ opacity: ease(f, 14, 20) }}><Chip>💾 salva esse vídeo</Chip></div>
    </Stage>
  );
}

function Cursor({ x, y, press }: { x: number; y: number; press: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 70, height: 70, borderRadius: 99, background: `${C.ink}33`, border: `4px solid ${C.ink}`, transform: `scale(${1 - press * 0.25})` }} />
  );
}

/** Tutorial step with a tiny mock UI: url | button | form | share. */
export function Step({ dur, props }: SceneProps) {
  const f = useCurrentFrame();
  const ui = props?.ui ?? "url";
  const typed = (text: string, from: number, speed = 1.3) => text.slice(0, Math.max(0, Math.floor((f - from) * speed)));
  let mock: ReactNode = null;
  if (ui === "url") {
    mock = (
      <Card style={{ width: 820, padding: 30, textAlign: "left" }}>
        <div style={{ padding: "22px 28px", borderRadius: 99, background: C.bg, border: `3px solid ${C.line}`, fontFamily: FONT.mono, fontSize: 46, color: C.ink }}>
          🔒 {typed("crownd.dev/br", 6, 0.8)}<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0 }}>|</span>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 26, opacity: ease(f, dur * 0.6, dur * 0.7) }}>
          <div style={{ height: 22, width: 34, borderRadius: 6, background: C.brazil }} />
          <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 44, color: C.ink, marginTop: -12 }}>Crownd Brasil</div>
        </div>
      </Card>
    );
  } else if (ui === "button") {
    const press = ease(f, dur * 0.55, dur * 0.62) - ease(f, dur * 0.62, dur * 0.7);
    mock = (
      <div style={{ position: "relative", width: 820, height: 420 }}>
        <Card style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <div style={{ display: "flex", gap: 16 }}>
            {["Board", "Lançamentos", "Hall da Fama"].map((t) => (
              <Chip key={t} bg={t === "Lançamentos" ? `${C.gold}33` : C.surface} border={t === "Lançamentos" ? C.gold : C.line} style={{ fontSize: 34, padding: "10px 20px" }}>{t}</Chip>
            ))}
          </div>
          <div style={{ padding: "28px 56px", borderRadius: 99, background: C.gold, color: C.bg, fontFamily: FONT.display, fontWeight: 800, fontSize: 54, transform: `scale(${1 - press * 0.06})` }}>
            Lançar de graça 🚀
          </div>
        </Card>
        <Cursor x={interpolate(f, [0, dur * 0.55], [700, 470], clamp)} y={interpolate(f, [0, dur * 0.55], [380, 270], clamp)} press={press} />
      </div>
    );
  } else if (ui === "form") {
    const span = dur / 3.4;
    const fields: [string, string][] = [["Nome do produto", "Meu App"], ["Link", "meuapp.com.br"], ["Pitch em uma linha", "Faz X em 1 clique"]];
    mock = (
      <Card style={{ width: 820, display: "flex", flexDirection: "column", gap: 22, textAlign: "left" }}>
        {fields.map(([label, value], i) => (
          <div key={label}>
            <div style={{ fontFamily: FONT.display, fontSize: 32, color: C.muted, marginBottom: 8 }}>{label}</div>
            <div style={{ padding: "18px 24px", borderRadius: 20, border: `3px solid ${f > i * span ? C.gold : C.line}`, background: C.bg, fontFamily: FONT.display, fontWeight: 700, fontSize: 42, color: C.ink, minHeight: 56 }}>
              {typed(value, 4 + i * span, 0.9)}
            </div>
          </div>
        ))}
      </Card>
    );
  } else if (ui === "share") {
    const clicks = Math.floor(interpolate(f, [8, dur * 0.9], [0, 1], clamp) ** 1.6 * 100);
    mock = (
      <Card style={{ width: 820, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", gap: 22, fontSize: 80 }}>
          {["💬", "📸", "🐦", "💼"].map((e, i) => (
            <div key={e} style={{ width: 140, height: 140, borderRadius: 36, background: C.bg, border: `3px solid ${C.line}`, display: "grid", placeItems: "center", transform: `scale(${0.6 + 0.4 * ease(f, i * 4, i * 4 + 8)})` }}>{e}</div>
          ))}
        </div>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 96, color: C.gold }}>+{clicks} <span style={{ fontSize: 44, color: C.muted }}>cliques únicos</span></div>
      </Card>
    );
  }
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 130, height: 130, borderRadius: 99, background: C.gold, color: C.bg, display: "grid", placeItems: "center", fontFamily: FONT.mono, fontWeight: 800, fontSize: 80, transform: `scale(${usePop(0)})` }}>{props?.n}</div>
        <Slam size={88} style={{ textAlign: "left" }}>{props?.title}</Slam>
      </div>
      {mock}
    </Stage>
  );
}

/** Full-bleed culture colour of one or more editions (real config data). */
export function Swatch({ dur, props }: SceneProps) {
  const f = useCurrentFrame();
  const slugs = (props?.slugs ?? "jp").split(",");
  const per = dur / slugs.length;
  const i = Math.min(slugs.length - 1, Math.floor(f / per));
  const c = COUNTRIES.find((x) => x.slug === slugs[i])!;
  const local = f - i * per;
  const p = ease(local, 0, 8);
  return (
    <Stage>
      <div style={{ width: 820, height: 900, borderRadius: 56, background: c.accent.hex, boxShadow: `0 40px 120px ${C.shadow}`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 56, textAlign: "left", transform: `scale(${0.9 + 0.1 * p})`, opacity: p }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 40, color: c.accent.ink ?? "#fff", opacity: 0.85 }}>/{c.slug} · {c.nameEn}</div>
        <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 112, lineHeight: 0.95, letterSpacing: "-0.04em", color: c.accent.ink ?? "#fff", marginTop: 10 }}>{c.accent.name}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 44, color: c.accent.ink ?? "#fff", opacity: 0.85, marginTop: 14 }}>{c.accent.hex}</div>
      </div>
    </Stage>
  );
}

/** A maker's site with the live Crownd badge; the rank climbs (or drops, mode=drop). */
export function Badge({ dur, props }: SceneProps) {
  const f = useCurrentFrame();
  const drop = props?.mode === "drop";
  const seq = drop ? [1, 1, 2, 2, 1] : [7, 5, 3, 2, 1];
  const rank = seq[Math.min(seq.length - 1, Math.floor((f / dur) * seq.length * 1.15))];
  const king = rank === 1;
  return (
    <Stage>
      <Card style={{ width: 840, padding: 0, overflow: "hidden", textAlign: "left" }}>
        <div style={{ display: "flex", gap: 12, padding: "22px 30px", borderBottom: `3px solid ${C.line}` }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c }} />)}
          <div style={{ marginLeft: 20, fontFamily: FONT.mono, fontSize: 30, color: C.muted }}>seuproduto.com</div>
        </div>
        <div style={{ padding: 44 }}>
          <div style={{ height: 36, width: 420, borderRadius: 12, background: C.line }} />
          <div style={{ height: 24, width: 640, borderRadius: 12, background: C.line, marginTop: 22, opacity: 0.7 }} />
          <div style={{ height: 24, width: 560, borderRadius: 12, background: C.line, marginTop: 14, opacity: 0.7 }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 22, marginTop: 50, padding: "22px 34px", borderRadius: 26, background: king ? "#FFC531" : "#0E0D12", border: `4px solid ${king ? "#C98A00" : "#2A2833"}`, transform: `scale(${1.25 + (king ? Math.sin(f / 4) * 0.02 : 0)})`, transformOrigin: "left center" }}>
            <Mark size={70} color={king ? "#0E0D12" : "#F4F1EA"} />
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 26, color: king ? "#0E0D12" : "#F4F1EA", opacity: 0.7 }}>Crownd Brasil</div>
              <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 48, color: king ? "#0E0D12" : "#F4F1EA" }}>#{rank}{king ? " 👑" : ""}</div>
            </div>
          </div>
        </div>
      </Card>
      <Chip>selo ao vivo · atualiza sozinho</Chip>
    </Stage>
  );
}

/** The embed snippet. */
export function Embed() {
  const f = useCurrentFrame();
  const code = '<a href="https://crownd.dev/br">\n  <img src="crownd.dev/api/badge/br/seu-produto">\n</a>';
  const shown = code.slice(0, Math.floor(f * 2.2));
  return (
    <Stage>
      <Slam size={110}>cola. <span style={{ color: C.gold }}>pronto.</span></Slam>
      <Card style={{ width: 840, textAlign: "left", background: "#0E0D12" }}>
        <pre style={{ margin: 0, fontFamily: FONT.mono, fontSize: 34, lineHeight: 1.5, color: "#FFC531", whiteSpace: "pre-wrap" }}>{shown}<span style={{ color: "#F4F1EA" }}>▍</span></pre>
      </Card>
      <div style={{ opacity: ease(f, 30, 38) }}><Chip>prova social ao vivo</Chip></div>
    </Stage>
  );
}

/** POV 3 a.m.: phone glow and the clock. */
export function Clock3() {
  const f = useCurrentFrame();
  const m = Math.min(59, Math.floor(f / 3));
  return (
    <Stage>
      <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 90, color: C.muted, opacity: ease(f, 0, 6) }}>POV:</div>
      <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 280, color: C.ink, letterSpacing: "-0.06em", lineHeight: 1, textShadow: `0 0 80px ${C.coup}66` }}>
        03:{String(m).padStart(2, "0")}
      </div>
      <div style={{ display: "flex", gap: 16, opacity: ease(f, 10, 16) }}>
        <Chip>🚀 lançamento no ar</Chip>
        <Chip>😵‍💫 0 horas de sono</Chip>
      </div>
    </Stage>
  );
}

/** Begged for votes, ended on page 2. */
export function Page2({ dur }: SceneProps) {
  const f = useCurrentFrame();
  const flip = f > dur * 0.55;
  return (
    <Stage>
      <Card style={{ width: 820, textAlign: "left" }}>
        <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 38, color: C.muted }}>👨‍👩‍👧 Grupo da Família</div>
        <div style={{ marginTop: 18, padding: "20px 26px", borderRadius: 26, background: `${C.gold}2A`, fontFamily: FONT.display, fontSize: 40, color: C.ink, opacity: ease(f, 2, 8) }}>
          gente, vota no meu produto?? 🙏🙏
        </div>
        <div style={{ marginTop: 14, padding: "20px 26px", borderRadius: 26, background: C.bg, fontFamily: FONT.display, fontSize: 40, color: C.ink, opacity: ease(f, 10, 16) }}>
          tia Cida: 👍
        </div>
      </Card>
      <div style={{ opacity: flip ? 1 : 0 }}>
        <Slam delay={Math.round(dur * 0.55)} size={140} color={C.coup}>página 2.</Slam>
      </div>
    </Stage>
  );
}

/** The two roads: pay for the top or launch free. */
export function Rules2({ dur }: SceneProps) {
  const f = useCurrentFrame();
  const half = dur * 0.48;
  const row = (q: string, a: string, d: number, hi: boolean) => (
    <Card style={{ width: 820, textAlign: "left", opacity: ease(f, d, d + 8), transform: `translateX(${(1 - ease(f, d, d + 10)) * -80}px)`, border: `4px solid ${hi ? C.gold : C.line}` }}>
      <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 46, color: C.muted }}>{q}</div>
      <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 78, color: hi ? C.gold : C.ink, letterSpacing: "-0.03em", marginTop: 6 }}>{a}</div>
    </Card>
  );
  return (
    <Stage>
      {row("Quer o topo?", "dá o lance 👑", 0, true)}
      {row("Quer de graça?", "lança e compartilha 🚀", half, false)}
    </Stage>
  );
}

/** "In ten years…" — the year ticks to 2036. */
export function Future({ dur }: SceneProps) {
  const f = useCurrentFrame();
  const year = Math.round(interpolate(f, [0, dur * 0.35], [2026, 2036], clamp));
  return (
    <Stage>
      <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 260, color: C.gold, letterSpacing: "-0.06em", lineHeight: 1 }}>{year}</div>
      <Slam delay={Math.round(dur * 0.4)} size={96}>
        quem foi o<br />primeiro <span style={{ color: C.gold }}>#1</span><br />do Brasil?
      </Slam>
    </Stage>
  );
}

export const SCENES2: Record<string, (p: SceneProps) => ReactNode> = {
  noalgo: NoAlgo, public: Public, countdown: Countdown, step: Step, swatch: Swatch,
  badge: Badge, embed: Embed, clock3: Clock3, page2: Page2, rules2: Rules2, future: Future,
};

