import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

type Palette = {
  bg: string; surface: string; line: string; ink: string; muted: string;
  /** Highlight role: #1, crown dot, active caption word. Brand gold where it has contrast. */
  gold: string; goldDeep: string;
  /** Alarm role: outbid, "VAZIO", hearts. Brand Coup red unless the background IS red. */
  coup: string; brazil: string;
  /** Caption outline + background glows. */
  stroke: string; glowA: string; glowB: string; shadow: string;
};

/**
 * Background palettes, all from the brand (src/app/globals.css + the Brazil edition accent):
 * Obsidian, Parchment, Crown Gold, Coup Red, Verde Copa, and Night (Obsidian + Coup glow).
 * Roles stay constant (gold = #1/highlight, coup = alarm) and are remapped where a role would
 * vanish against its background (e.g. gold highlight on a gold background becomes deep red).
 */
export const PALETTES: Record<string, Palette> = {
  obsidian: {
    bg: "#0E0D12", surface: "#16151B", line: "#2A2833", ink: "#F4F1EA", muted: "#9C978C",
    gold: "#FFC531", goldDeep: "#C98A00", coup: "#FF4A2E", brazil: "#00A651",
    stroke: "rgba(0,0,0,.55)", glowA: "rgba(255,197,49,.10)", glowB: "rgba(0,166,81,.08)", shadow: "rgba(0,0,0,.55)",
  },
  night: {
    bg: "#0B0A0F", surface: "#17141B", line: "#2E2630", ink: "#F4F1EA", muted: "#A0968E",
    gold: "#FFC531", goldDeep: "#C98A00", coup: "#FF4A2E", brazil: "#00A651",
    stroke: "rgba(0,0,0,.6)", glowA: "rgba(255,74,46,.16)", glowB: "rgba(255,197,49,.06)", shadow: "rgba(0,0,0,.6)",
  },
  parchment: {
    bg: "#F7F3EA", surface: "#FFFDF8", line: "#E2D9C5", ink: "#0E0D12", muted: "#6E6A60",
    gold: "#B87900", goldDeep: "#8A5A00", coup: "#E0341A", brazil: "#00A651",
    stroke: "rgba(255,253,248,.85)", glowA: "rgba(255,197,49,.28)", glowB: "rgba(255,74,46,.07)", shadow: "rgba(14,13,18,.14)",
  },
  gold: {
    bg: "#FFC531", surface: "#FFF3CF", line: "#E2A912", ink: "#0E0D12", muted: "#5C4700",
    gold: "#C2240F", goldDeep: "#8E1A0B", coup: "#C2240F", brazil: "#00753A",
    stroke: "rgba(255,243,207,.75)", glowA: "rgba(255,255,255,.35)", glowB: "rgba(201,138,0,.25)", shadow: "rgba(94,60,0,.25)",
  },
  coup: {
    bg: "#FF4A2E", surface: "#E8381D", line: "#FF7A63", ink: "#FFFFFF", muted: "#FFE0D9",
    gold: "#FFC531", goldDeep: "#FFE08A", coup: "#0E0D12", brazil: "#00A651",
    stroke: "rgba(80,10,0,.55)", glowA: "rgba(255,197,49,.25)", glowB: "rgba(14,13,18,.18)", shadow: "rgba(80,10,0,.35)",
  },
  verde: {
    bg: "#00A651", surface: "#008F45", line: "#2DBE70", ink: "#FFFFFF", muted: "#D2F5E0",
    gold: "#FFC531", goldDeep: "#FFE08A", coup: "#FF4A2E", brazil: "#FFC531",
    stroke: "rgba(0,50,20,.55)", glowA: "rgba(255,197,49,.30)", glowB: "rgba(0,40,20,.25)", shadow: "rgba(0,40,20,.35)",
  },
};

/**
 * Current palette. Mutated by applyPalette() at the top of <Reel>, before any child renders
 * (React renders parents first), so every component reads the active reel's colours.
 */
export const C: Palette = { ...PALETTES.obsidian };
export function applyPalette(name = "obsidian") {
  Object.assign(C, PALETTES[name] ?? PALETTES.obsidian);
}

export const FONT = {
  display: loadBricolage("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily,
  serif: loadSerif("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily,
  mono: loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily,
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;
/** Frames of silence between beats: a breath, keeps cuts snappy without stepping on words. */
export const GAP = 5;

/**
 * Reels safe area: the top ~220px (progress/header) and bottom ~420px (caption, username,
 * audio label) are covered by Instagram UI; the right ~140px holds like/comment/share buttons.
 */
export const SAFE = { top: 230, bottom: 1500, left: 70, right: 940 };
