import type { ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COUNTRIES } from "../../src/config/countries";
import { C, FONT } from "./theme";
import { Card, Chip, Heart, Mark, Slam, Stage, brl, clamp, ease, usePop } from "./kit";

export type SceneProps = { dur: number; props?: Record<string, string> };

/* ── Reel 1 ─────────────────────────────────────────────────────────────── */

/** HOOK: "6 meses" chip, then a like counter that limps to 3. */
export function Likes({ dur }: SceneProps) {
  const f = useCurrentFrame();
  const hits = [Math.round(dur * 0.55), Math.round(dur * 0.68), Math.round(dur * 0.8)];
  const n = hits.filter((h) => f >= h).length;
  return (
    <Stage>
      <Chip style={{ fontFamily: FONT.mono, opacity: ease(f, 0, 6) }}>⏱ 6 meses de trabalho</Chip>
      <div style={{ display: "flex", gap: 30, marginTop: 30 }}>
        {[0, 1, 2].map((i) => {
          const on = f >= hits[i];
          const p = on ? ease(f, hits[i], hits[i] + 6) : 0;
          return (
            <div key={i} style={{ transform: `scale(${on ? 0.6 + p * 0.4 + (1 - p) * 0.6 : 0.8})`, opacity: on ? 1 : 0.18 }}>
              <Heart size={190} color={on ? C.coup : C.muted} />
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 230, color: C.ink, letterSpacing: "-0.06em", lineHeight: 1 }}>
        {n}
        <span style={{ fontFamily: FONT.display, fontSize: 90, color: C.muted, marginLeft: 24, letterSpacing: "-0.03em" }}>likes</span>
      </div>
    </Stage>
  );
}

/** The punchline: a like notification from mom. */
export function Mom() {
  const f = useCurrentFrame();
  const p = usePop(0);
  return (
    <Stage>
      <Card style={{ width: 820, display: "flex", alignItems: "center", gap: 34, padding: 40, transform: `translateY(${(1 - p) * -260}px)`, opacity: Math.min(1, p * 2) }}>
        <div style={{ width: 130, height: 130, borderRadius: 999, background: C.line, display: "grid", placeItems: "center", fontSize: 76 }}>👵</div>
        <div style={{ textAlign: "left", fontFamily: FONT.display }}>
          <div style={{ fontSize: 46, fontWeight: 800, color: C.ink }}>mãe</div>
          <div style={{ fontSize: 38, color: C.muted }}>curtiu sua publicação</div>
        </div>
        <div style={{ marginLeft: "auto" }}><Heart size={80} /></div>
      </Card>
      <Slam delay={14} size={120} style={{ marginTop: 40 }}>
        obrigado,<br />
        <span style={{ fontFamily: FONT.serif, fontWeight: 400, color: C.gold, letterSpacing: "-0.02em" }}>mãe.</span>
      </Slam>
      <div style={{ opacity: ease(f, 24, 32), fontSize: 64 }}>🥲</div>
    </Stage>
  );
}

/** Brand reveal: podium rises, gold crown drops, wordmark lands. */
export function Reveal() {
  const f = useCurrentFrame();
  const rise = usePop(0, 14);
  const drop = usePop(10, 9, 0.8);
  return (
    <Stage>
      <div style={{ filter: `drop-shadow(0 0 ${60 * drop}px rgba(255,197,49,.35))` }}>
        <Mark size={420} rise={Math.max(0.001, rise)} drop={drop} />
      </div>
      <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 170, letterSpacing: "-0.055em", color: C.ink, opacity: ease(f, 16, 24), transform: `translateY(${(1 - ease(f, 16, 26)) * 60}px)` }}>
        Crownd
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.muted, opacity: ease(f, 24, 32) }}>crownd.dev</div>
    </Stage>
  );
}

type Row = { name: string; you?: boolean; bid: number };

function Board({ rows, crownTo = 0, title = "crownd.dev/br", banner }: { rows: Row[]; crownTo?: number; title?: string; banner?: ReactNode }) {
  const sorted = [...rows].sort((a, b) => b.bid - a.bid);
  return (
    <Card style={{ width: 860, padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "26px 36px", borderBottom: `3px solid ${C.line}`, fontFamily: FONT.mono, fontSize: 30, color: C.muted }}>
        <span style={{ width: 16, height: 16, borderRadius: 99, background: C.coup }} /> {title}
        <span style={{ marginLeft: "auto" }}>AO VIVO</span>
      </div>
      {banner}
      <div style={{ position: "relative", height: rows.length * 128 }}>
        {rows.map((r) => {
          const rank = sorted.indexOf(r);
          const first = rank === 0;
          return (
            <div
              key={r.name}
              style={{
                position: "absolute", left: 0, right: 0, top: rank * 128, height: 128, display: "flex", alignItems: "center", gap: 26, padding: "0 36px",
                background: r.you ? `${C.gold}1F` : "transparent", borderBottom: `2px solid ${C.line}`, transition: "none",
              }}
            >
              <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 46, width: 80, color: first ? C.gold : C.muted }}>#{rank + 1}</span>
              <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 46, color: r.you ? C.gold : C.ink, flex: 1, textAlign: "left" }}>
                {first && crownTo > 0 ? "👑 " : ""}{r.name}
              </span>
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 42, color: first ? C.gold : C.ink }}>{brl(r.bid)}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/** Your product climbs from last to #1 as the bid ticks up. Other rows are anonymised on purpose. */
export function BoardClimb({ dur }: SceneProps) {
  const f = useCurrentFrame();
  const you = interpolate(f, [dur * 0.15, dur * 0.8], [10, 260], clamp);
  const rows: Row[] = [
    { name: "produto ●●●●", bid: 220 },
    { name: "produto ●●●", bid: 150 },
    { name: "produto ●●●●●", bid: 95 },
    { name: "produto ●●", bid: 40 },
    { name: "SEU PRODUTO", you: true, bid: Math.round(you / 5) * 5 },
  ];
  return (
    <Stage>
      <Slam size={92}>
        sem like por pena.<br />
        <span style={{ color: C.gold }}>o lance decide.</span>
      </Slam>
      <Board rows={rows} crownTo={1} />
    </Stage>
  );
}

/** 10 free launch slots a day, filling up. */
export function Slots({ dur }: SceneProps) {
  const f = useCurrentFrame();
  const filled = Math.floor(interpolate(f, [8, dur * 0.85], [0, 10], clamp));
  return (
    <Stage>
      <Slam size={120}>
        <span style={{ fontFamily: FONT.mono, color: C.gold }}>10</span> vagas
        <br />grátis por dia
      </Slam>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 150px)", gap: 22 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              height: 150, borderRadius: 32, border: `3px solid ${i < filled ? C.gold : C.line}`, background: i < filled ? `${C.gold}22` : C.surface,
              display: "grid", placeItems: "center", fontSize: 64, transform: `scale(${i === filled - 1 ? 1.08 : 1})`,
            }}
          >
            {i < filled ? "🚀" : ""}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Chip>ranqueadas por cliques únicos</Chip>
        <Chip>zera à meia-noite</Chip>
      </div>
    </Stage>
  );
}

/** Closing call to action: the question that drives comments / shares. Ends on a bouncing arrow. */
export function Cta({ props }: SceneProps) {
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={{ opacity: ease(f, 0, 6) }}><Mark size={160} /></div>
      <Slam size={104}>{props?.line1}</Slam>
      <Slam delay={6} size={116} color={C.gold}>{props?.line2}</Slam>
      <div style={{ marginTop: 30, opacity: ease(f, 12, 20), transform: `translateY(${Math.sin(f / 4) * 14}px)` }}>
        <Chip bg={C.ink} color={C.bg} border={C.gold} style={{ fontSize: 50, padding: "20px 40px", borderWidth: 5 }}>{props?.hint}</Chip>
      </div>
    </Stage>
  );
}

/* ── Reel 2 ─────────────────────────────────────────────────────────────── */

/** HOOK: an empty throne under a spotlight, stamped VAZIO. */
export function Throne() {
  const f = useCurrentFrame();
  const flicker = 0.75 + 0.25 * Math.abs(Math.sin(f / 3));
  const stamp = ease(f, 10, 16);
  return (
    <Stage>
      <div style={{ position: "relative", width: 760, height: 900 }}>
        <div style={{ position: "absolute", left: 130, top: -140, width: 500, height: 900, background: "linear-gradient(180deg, rgba(255,197,49,.30), rgba(255,197,49,0))", clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)", opacity: flicker }} />
        <div style={{ position: "absolute", left: 230, top: 260, width: 300, height: 300, borderRadius: 999, border: `10px dashed ${C.gold}`, opacity: 0.5 * flicker, display: "grid", placeItems: "center", fontSize: 150 }}>
          <span style={{ opacity: 0.35 }}>👑</span>
        </div>
        <div style={{ position: "absolute", left: 180, top: 600, width: 400, height: 280, borderRadius: 28, background: C.surface, border: `4px solid ${C.line}`, display: "grid", placeItems: "center", fontFamily: FONT.mono, fontWeight: 800, fontSize: 150, color: C.gold }}>
          #1
        </div>
        <div
          style={{
            position: "absolute", left: 90, top: 380, padding: "10px 40px", border: `12px solid ${C.coup}`, color: C.coup, borderRadius: 24,
            fontFamily: FONT.display, fontWeight: 800, fontSize: 170, letterSpacing: "-0.03em",
            transform: `rotate(-12deg) scale(${interpolate(stamp, [0, 1], [2.2, 1])})`, opacity: stamp,
          }}
        >
          VAZIO
        </div>
      </div>
    </Stage>
  );
}

/** 20 editions, each with its culture colour (from the real config). ISO codes, not flag emoji (they render as letters on Windows). */
export function Countries({ dur }: SceneProps) {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Slam size={120}>
        <span style={{ fontFamily: FONT.mono, color: C.gold }}>{COUNTRIES.length}</span> países.<br />
        <span style={{ fontFamily: FONT.mono, color: C.gold }}>{COUNTRIES.length}</span> coroas.
      </Slam>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 158px)", gap: 14 }}>
        {COUNTRIES.map((c, i) => {
          const p = ease(f, 6 + i * (dur * 0.5) / COUNTRIES.length, 12 + i * (dur * 0.5) / COUNTRIES.length);
          const br = c.slug === "br";
          return (
            <div
              key={c.slug}
              style={{
                height: 78, borderRadius: 20, background: C.surface, border: `3px solid ${br ? c.accent.hex : C.line}`, overflow: "hidden",
                display: "flex", alignItems: "center", gap: 14, opacity: p, transform: `translateY(${(1 - p) * 40}px)`,
              }}
            >
              <div style={{ width: 16, alignSelf: "stretch", background: c.accent.hex }} />
              <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 40, color: br ? C.ink : C.muted }}>{c.slug.toUpperCase()}</span>
              <span style={{ marginLeft: "auto", marginRight: 16, fontSize: 34 }}>👑</span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

/** Brazil's edition card with a blinking empty #1 slot. */
export function BrCard() {
  const f = useCurrentFrame();
  const p = usePop(0);
  const blink = Math.floor(f / 8) % 2 === 0;
  return (
    <Stage>
      <Card style={{ width: 840, padding: 0, overflow: "hidden", transform: `scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 2) }}>
        <div style={{ height: 34, background: C.brazil }} />
        <div style={{ padding: 56, textAlign: "left" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 36, color: C.muted }}>/br · BRL · Verde Copa</div>
          <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 110, letterSpacing: "-0.045em", color: C.ink, marginTop: 10 }}>Crownd Brasil</div>
          <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 50, padding: 34, borderRadius: 30, border: `4px dashed ${C.gold}` }}>
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 90, color: C.gold }}>#1</span>
            <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 64, color: C.muted }}>sem dono{blink ? "_" : " "}</span>
          </div>
        </div>
      </Card>
    </Stage>
  );
}

/** Price slam: the entry ticket. */
export function Price() {
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 64, color: C.muted, opacity: ease(f, 0, 6) }}>o primeiro lance</div>
      <Slam delay={4} size={330} color={C.gold} style={{ fontFamily: FONT.mono, letterSpacing: "-0.07em", textShadow: "0 0 80px rgba(255,197,49,.45)" }}>
        R$5
      </Slam>
      <div style={{ opacity: ease(f, 14, 22) }}><Chip>e o trono é seu</Chip></div>
    </Stage>
  );
}

/** Hall of Fame plaque. Reel 2: "your name here"; Reel 3: a history of crown changes. */
export function Hall({ props }: SceneProps) {
  const f = useCurrentFrame();
  const history = props?.mode === "history";
  const entries = history
    ? ["produto ●●●● · reinou 3d 4h", "produto ●●● · reinou 19h", "produto ●●●●● · reinou 2d 7h", "SEU PRODUTO · reinando agora"]
    : ["??? · o primeiro rei do Brasil", "—", "—", "—"];
  return (
    <Stage>
      <div style={{ fontFamily: FONT.serif, fontSize: 130, color: C.gold, lineHeight: 1, opacity: ease(f, 0, 8) }}>Hall da Fama</div>
      <Card style={{ width: 840, padding: 30, border: `4px solid ${C.goldDeep}` }}>
        {entries.map((e, i) => {
          const p = ease(f, 6 + i * 5, 14 + i * 5);
          const hot = history ? i === entries.length - 1 : i === 0;
          return (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 26, padding: "28px 24px", borderBottom: i < 3 ? `2px solid ${C.line}` : "none",
                opacity: p * (hot ? 1 : 0.55), transform: `translateX(${(1 - p) * -60}px)`,
              }}
            >
              <span style={{ fontSize: 50 }}>{hot ? "👑" : "·"}</span>
              <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 42, color: hot ? C.gold : C.ink, textAlign: "left" }}>{e}</span>
            </div>
          );
        })}
      </Card>
      <div style={{ fontFamily: FONT.serif, fontSize: 90, color: C.ink, opacity: ease(f, 26, 34) }}>para sempre.</div>
    </Stage>
  );
}

/* ── Reel 3 ─────────────────────────────────────────────────────────────── */

/** HOOK: you're #1… then a rival lands on top and the crown falls (red banner + shake). */
export function Notify({ dur }: SceneProps) {
  const f = useCurrentFrame();
  const hit = Math.round(dur * 0.55);
  const after = f >= hit;
  const shake = after ? Math.sin(f * 2.2) * Math.max(0, 18 - (f - hit) * 1.4) : 0;
  const rival = after ? 330 : 0;
  const rows: Row[] = [
    { name: "SEU PRODUTO", you: true, bid: 300 },
    { name: "produto ●●●", bid: 180 },
    { name: "produto ●●●●", bid: 120 },
    { name: "rival ●●●●", bid: rival },
  ];
  const banner = (
    <div style={{ height: after ? 110 : 0, overflow: "hidden", background: C.coup, color: "#FFFFFF", display: "grid", placeItems: "center", fontFamily: FONT.display, fontWeight: 800, fontSize: 52 }}>
      👑 A COROA CAIU
    </div>
  );
  return (
    <Stage>
      <div style={{ transform: `translateX(${shake}px)` }}>
        <Board rows={rows} crownTo={1} banner={banner} />
      </div>
      <Slam delay={hit} size={110} color={C.coup}>roubaram seu #1.</Slam>
    </Stage>
  );
}

/** Back-and-forth battle: bids leapfrog, positions swap. */
export function Swap({ dur }: SceneProps) {
  const f = useCurrentFrame();
  const steps = [330, 355, 380, 410, 450];
  const k = Math.min(steps.length - 1, Math.floor((f / dur) * steps.length * 1.1));
  const you = k % 2 === 1 ? steps[k] : steps[Math.max(0, k - 1)] - 5;
  const rival = k % 2 === 0 ? steps[k] : steps[k - 1];
  return (
    <Stage>
      <Slam size={120}>
        virada<span style={{ color: C.gold }}>,</span> virada<span style={{ color: C.gold }}>,</span><br />virada.
      </Slam>
      <Board rows={[{ name: "SEU PRODUTO", you: true, bid: you }, { name: "rival ●●●●", bid: rival }, { name: "produto ●●●", bid: 180 }]} crownTo={1} />
    </Stage>
  );
}

/** Pay only the difference: real rule (ties go to whoever got there first, steps of R$ 5). */
export function Diff() {
  const f = useCurrentFrame();
  const line = (label: string, value: string, d: number, color = C.ink) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: ease(f, d, d + 6), transform: `translateY(${(1 - ease(f, d, d + 8)) * 30}px)` }}>
      <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 46, color: C.muted }}>{label}</span>
      <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 64, color }}>{value}</span>
    </div>
  );
  return (
    <Stage>
      <Slam size={110}>paga só a<br /><span style={{ color: C.gold }}>diferença.</span></Slam>
      <Card style={{ width: 820, display: "flex", flexDirection: "column", gap: 34 }}>
        {line("você já pagou", brl(120), 8)}
        {line("o rival tem", brl(150), 16, C.coup)}
        {line("pra voltar ao #1", brl(155), 24)}
        <div style={{ height: 3, background: C.line }} />
        {line("você paga só", `+ ${brl(35)}`, 34, C.gold)}
      </Card>
    </Stage>
  );
}

/** Reign timer fast-forwarding: every minute on top counts. */
export function Timer() {
  const f = useCurrentFrame();
  const secs = 3 * 86400 + 4 * 3600 + Math.floor(f * 97);
  const d = Math.floor(secs / 86400), h = Math.floor((secs % 86400) / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <Stage>
      <Mark size={220} />
      <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: C.muted, letterSpacing: "0.12em" }}>REINANDO HÁ</div>
      <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 132, color: C.gold, letterSpacing: "-0.05em", textShadow: "0 0 60px rgba(255,197,49,.35)" }}>
        {d}d {pad(h)}h {pad(m)}m<br />{pad(s)}s
      </div>
      <Chip>cada minuto no topo conta</Chip>
    </Stage>
  );
}

export const SCENES: Record<string, (p: SceneProps) => ReactNode> = {
  likes: Likes, mom: Mom, reveal: Reveal, board: BoardClimb, slots: Slots, cta: Cta,
  throne: Throne, countries: Countries, brcard: BrCard, price: Price, hall: Hall,
  notify: Notify, swap: Swap, diff: Diff, timer: Timer,
};
