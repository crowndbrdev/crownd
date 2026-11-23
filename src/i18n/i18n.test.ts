import { describe, expect, it } from "vitest";
import { COUNTRIES, formatMoney, toMinor } from "@/config/countries";
import { en } from "./en";
import { getMessages } from "./index";

function flatten(obj: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof obj === "string") out[prefix] = obj;
  else if (Array.isArray(obj)) obj.forEach((v, i) => Object.assign(out, flatten(v, `${prefix}[${i}]`)));
  else if (obj && typeof obj === "object")
    for (const [k, v] of Object.entries(obj)) Object.assign(out, flatten(v, prefix ? `${prefix}.${k}` : k));
  return out;
}

const placeholders = (s: string) => [...new Set([...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();
const base = flatten(en);

describe.each(COUNTRIES.map((c) => [c.slug, c] as const))("edition %s", (_slug, c) => {
  const m = flatten(getMessages(c));

  it("has exactly the same keys as English", () => {
    expect(Object.keys(m).sort()).toEqual(Object.keys(base).sort());
  });

  it("keeps every functional placeholder used by the UI", () => {
    // Nouns may be written inflected instead of interpolated (pl, tr): {country}, {demonym} and
    // {hall} (the Hall of Fame's local name). Money, rank, edition and counts stay mandatory.
    const soft = new Set(["country", "demonym", "hall"]);
    for (const [k, v] of Object.entries(base)) {
      const want = placeholders(v).filter((p) => !soft.has(p));
      const got = placeholders(m[k]).filter((p) => !soft.has(p));
      expect(got, `${c.slug} ${k}`).toEqual(want);
    }
  });

  it("has no empty strings", () => {
    for (const [k, v] of Object.entries(m)) expect(v.trim(), `${c.slug} ${k}`).not.toBe("");
  });

  it("formats money in the local currency", () => {
    const s = formatMoney(toMinor(c.minBid * 100, c), c);
    expect(s).toMatch(/\d/);
  });
});

it("Swiss edition never uses ß", () => {
  const ch = COUNTRIES.find((c) => c.slug === "ch")!;
  expect(JSON.stringify(getMessages(ch))).not.toContain("ß");
});

describe("launch guide copy", async () => {
  const { GUIDE, getGuide } = await import("./guide");
  const keys = Object.keys(GUIDE.en).sort();
  it.each(COUNTRIES.map((c) => [c.slug, c] as const))("%s has every guide string, non-empty, same functional placeholders", (_s, c) => {
    const g = getGuide(c.lang, c.slug);
    expect(Object.keys(g).sort()).toEqual(keys);
    for (const k of keys) {
      const v = g[k as keyof typeof g];
      expect(v.trim(), `${c.slug} ${k}`).not.toBe("");
      const want = placeholders(GUIDE.en[k as keyof typeof g]).filter((p) => p !== "country" && p !== "demonym");
      expect(placeholders(v).filter((p) => p !== "country" && p !== "demonym"), `${c.slug} ${k}`).toEqual(want);
    }
  });
  it("Swiss guide never uses ß", () => {
    expect(JSON.stringify(getGuide("de", "ch"))).not.toContain("ß");
  });
});
