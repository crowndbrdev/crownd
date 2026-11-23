import type { CSSProperties, ReactNode } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./theme";

/** Spring 0→1 starting at `delay` frames. Snappy, slight overshoot: reads as "pop" on a phone. */
export function usePop(delay = 0, damping = 12, mass = 0.6) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass, stiffness: 170 } });
}

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function ease(frame: number, from: number, to: number, out: [number, number] = [0, 1]) {
  return interpolate(frame, [from, to], out, { ...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
}

/** Big headline that slams in (scale down + unblur): the pattern interrupt for hooks. */
export function Slam({ children, delay = 0, size = 150, color = C.ink, style }: { children: ReactNode; delay?: number; size?: number; color?: string; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const t = ease(frame, delay, delay + 7);
  return (
    <div
      style={{
        fontFamily: FONT.display, fontWeight: 800, fontSize: size, lineHeight: 0.92, letterSpacing: "-0.045em", color,
        transform: `scale(${interpolate(t, [0, 1], [1.7, 1])})`, opacity: t, filter: `blur(${(1 - t) * 14}px)`, ...style,
      }}
    >
      {children}
    </div>
  );
}

/** The Crownd mark (podium + gold crown dot), drawn so parts can animate. */
export function Mark({ size = 360, rise = 1, drop = 1, color = C.ink }: { size?: number; rise?: number; drop?: number; color?: string }) {
  const bar = (x: number, y: number, h: number) => <rect x={x} y={52 - (52 - y) * rise} width={12} height={h * rise} rx={3} />;
  return (
    <svg viewBox="0 -6 64 66" width={size} height={size} fill={color} style={{ overflow: "visible" }}>
      {bar(10, 26, 26)}
      {bar(26, 14, 38)}
      {bar(42, 32, 20)}
      <rect x={8} y={50} width={48} height={7} rx={2} />
      <circle cx={16} cy={52 - (52 - 19) * rise} r={4.5 * rise} />
      <circle cx={48} cy={52 - (52 - 25) * rise} r={4.5 * rise} />
      <circle cx={32} cy={interpolate(drop, [0, 1], [-40, 6.5])} r={5} fill={C.gold} opacity={drop > 0.01 ? 1 : 0} />
    </svg>
  );
}

export function Chip({ children, color = C.ink, bg = C.surface, border = C.line, style }: { children: ReactNode; color?: string; bg?: string; border?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 28px", borderRadius: 999, border: `3px solid ${border}`,
        background: bg, color, fontFamily: FONT.display, fontWeight: 700, fontSize: 40, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: C.surface, border: `3px solid ${C.line}`, borderRadius: 44, padding: 44, boxShadow: `0 40px 120px ${C.shadow}`, ...style }}>
      {children}
    </div>
  );
}

export const brl = (n: number) => `R$ ${Math.round(n).toLocaleString("pt-BR")}`;

export function Heart({ size = 120, color = C.coup }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
    </svg>
  );
}

/** Centers scene content inside the Reels safe area (above captions, left of the action buttons). */
export function Stage({ children, top = 250, height = 1080 }: { children: ReactNode; top?: number; height?: number }) {
  return (
    <div style={{ position: "absolute", left: 70, width: 870, top, height, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, textAlign: "center" }}>
      {children}
    </div>
  );
}
