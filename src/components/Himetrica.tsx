/**
 * Himetrica tracker (https://himetrica.com) — loads only when NEXT_PUBLIC_HIMETRICA_KEY is set.
 * The key is the PUBLIC tracker key (safe in HTML). CSP already allows cdn.himetrica.com.
 */
export function Himetrica() {
  const key = process.env.NEXT_PUBLIC_HIMETRICA_KEY;
  if (!key) return null;
  return <script defer src="https://cdn.himetrica.com/tracker.js" data-api-key={key} />;
}
