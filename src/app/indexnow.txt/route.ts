/** IndexNow key file (https://www.indexnow.org). Set INDEXNOW_KEY to any 32+ hex chars. */
export function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response("Not configured", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
