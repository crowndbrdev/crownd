import { describe, expect, it } from "vitest";
import { cleanPath, cleanText, isBot } from "./text";

describe("cleanText (user-supplied names)", () => {
  it("strips control chars and bidi overrides used for spoofing", () => {
    expect(cleanText("Good‮gnp.exe", 60)).toBe("Goodgnp.exe");
    expect(cleanText("a\u0000b​c", 60)).toBe("abc");
  });
  it("collapses whitespace, trims and caps length", () => {
    expect(cleanText("  Meu   App \n\t novo ", 60)).toBe("Meu App novo");
    expect(cleanText("x".repeat(100), 60)).toHaveLength(60);
  });
  it("keeps every script intact (CJK, Arabic, accents)", () => {
    for (const s of ["王冠ノート", "مجلس", "Çay Desk", "Żubr"]) expect(cleanText(s, 60)).toBe(s);
  });
});

describe("cleanPath (analytics)", () => {
  it("keeps our pages, drops query/hash and trailing slash", () => {
    expect(cleanPath("/br/guide/?utm=x#a")).toBe("/br/guide");
    expect(cleanPath("/")).toBe("/");
  });
  it("ignores internal and private routes", () => {
    for (const p of ["/api/stats", "/go/abc", "/_next/static/x.js", "/br/checkout/123"]) expect(cleanPath(p)).toBeNull();
  });
  it("rejects injection attempts and absolute URLs", () => {
    for (const p of ["https://evil.com/x", "/<script>", "/br/' OR 1=1", "//evil.com"]) expect(cleanPath(p)).toBeNull();
  });
});

describe("isBot", () => {
  it("flags crawlers and empty user agents", () => {
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(isBot("")).toBe(true);
    expect(isBot("Mozilla/5.0 (Windows NT 10.0) Chrome/130")).toBe(false);
  });
});
