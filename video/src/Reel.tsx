import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import reelsData from "./reels.json";
import timingsData from "./timings.json";
import { SCENES as S1 } from "./scenes";
import { SCENES2 } from "./scenes2";

const SCENES = { ...S1, ...SCENES2 };
import { C, FONT, FPS, GAP, applyPalette } from "./theme";
import { clamp } from "./kit";

type Word = { text: string; startMs: number; endMs: number };
type Timing = { file: string; durationMs: number; words: Word[] };
type Beat = { scene: string; text: string; props?: Record<string, string> };
type ReelDef = { id: string; title: string; palette?: string; beats: Beat[] };

const REELS = (reelsData as { reels: ReelDef[] }).reels;
const TIMINGS = timingsData as Record<string, Timing[]>;

/** Frame layout of a reel: each beat lasts its narration + a short breath. */
export function layout(id: string) {
  const reel = REELS.find((r) => r.id === id)!;
  const timings = TIMINGS[id];
  let from = 0;
  const beats = reel.beats.map((b, i) => {
    const frames = Math.ceil((timings[i].durationMs / 1000) * FPS) + GAP;
    const out = { ...b, timing: timings[i], from, frames };
    from += frames;
    return out;
  });
  // Hold the final CTA a little longer: lets the loop breathe and gives time to comment/tag.
  return { reel, beats, total: from + 18 };
}

export const reelIds = REELS.map((r) => r.id);

/** Groups words into short caption "pages" (max 3 words, break after punctuation). */
function pages(words: Word[]) {
  const out: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length === 3 || /[.,!?:…]$/.test(w.text)) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out;
}

/** Karaoke captions: big, centred, active word in gold. Sits above Instagram's bottom UI. */
function Captions({ words }: { words: Word[] }) {
  const frame = useCurrentFrame();
  const ms = (frame / FPS) * 1000;
  const groups = pages(words);
  const page = groups.find((g, i) => ms < (groups[i + 1]?.[0].startMs ?? Infinity)) ?? groups[groups.length - 1];
  if (!page || ms < page[0].startMs - 120) return null;
  const pop = interpolate(ms - page[0].startMs, [-120, 60], [0.85, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 70, width: 870, top: 1350, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 34px", transform: `scale(${pop})` }}>
      {page.map((w, i) => {
        const active = ms >= w.startMs - 40 && ms < (page[i + 1]?.startMs ?? w.endMs + 400);
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT.display, fontWeight: 800, fontSize: 84, letterSpacing: "-0.02em", textTransform: "uppercase",
              color: active ? C.gold : C.ink, WebkitTextStroke: `3px ${C.stroke}`, paintOrder: "stroke",
              textShadow: `0 8px 30px ${C.shadow}`, transform: `scale(${active ? 1.06 : 1})`, transformOrigin: "center bottom", display: "inline-block", whiteSpace: "nowrap",
            }}
          >
            {w.text.replace(/[.,:]+$/, "")}
          </span>
        );
      })}
    </div>
  );
}

/** Slow-drifting glows + grain: depth without stealing attention from the text. */
function Background() {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 90) * 12;
  const y = 30 + Math.cos(frame / 110) * 8;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 900px at ${x}% ${y}%, ${C.glowA}, transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(800px 700px at ${100 - x}% 85%, ${C.glowB}, transparent 70%)` }} />
      <AbsoluteFill
        style={{
          opacity: 0.07, mixBlendMode: "overlay",
          backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </AbsoluteFill>
  );
}

/** Thin gold progress bar (retention cue) + small brand tag, both inside the top safe band. */
function Chrome({ total }: { total: number }) {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", top: 240, left: 70, width: 870, height: 10, borderRadius: 99, background: C.line }}>
        <div style={{ width: `${(frame / total) * 100}%`, height: "100%", borderRadius: 99, background: C.gold }} />
      </div>
    </>
  );
}

export function Reel({ id }: { id: string }) {
  const { reel, beats, total } = layout(id);
  applyPalette(reel.palette);
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background />
      {beats.map((b, i) => {
        const Scene = SCENES[b.scene];
        return (
          <Sequence key={i} from={b.from} durationInFrames={i === beats.length - 1 ? durationInFrames - b.from : b.frames}>
            <Audio src={staticFile(b.timing.file)} />
            <Scene dur={b.frames} props={b.props} />
            <Captions words={b.timing.words} />
          </Sequence>
        );
      })}
      <Chrome total={total} />
    </AbsoluteFill>
  );
}
