/** YYYY-MM-DD in the country's own timezone — the free Launches board resets at local midnight. */
export function dayKey(timezone: string, at: number = Date.now()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
}

export function lastNDays(timezone: string, n: number, at: number = Date.now()): string[] {
  return Array.from({ length: n }, (_, i) => dayKey(timezone, at - i * 86_400_000));
}
