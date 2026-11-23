/**
 * User-supplied display text (product names, taglines): strip control characters and
 * bidirectional overrides (U+202A–U+202E, U+2066–U+2069) that enable visual spoofing,
 * collapse whitespace and cap length.
 */
export function cleanText(input: string, max: number): string {
  return input
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F-\u009F​-‏‪-‮⁠-⁩﻿]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pagespeed|monitor/i;

export function isBot(ua: string) {
  return !ua || BOT.test(ua);
}

/** Only our own pages are counted; query strings and fragments are dropped. */
export function cleanPath(raw: string): string | null {
  // "//host" is a protocol-relative URL, not a path.
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//") || raw.length > 200) return null;
  const path = raw.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (/^\/(api|go|_next)\b/.test(path) || /\/checkout\//.test(path)) return null;
  return /^[\w\-/.%]+$/.test(path) ? path : null;
}
