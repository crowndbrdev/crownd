// Mobile screenshots through the Chrome DevTools Protocol (true 390px viewport, touch, DPR 2).
// node scripts/mobile-shot.mjs <url> <out.png> [width=390] [height=844] [fullPage=1]
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, out, w = "390", h = "844", full = "1"] = process.argv.slice(2);
// Hard stop: never hang a pipeline on a stuck page.
const guard = setTimeout(() => { console.error("✗ timeout"); try { chrome.kill(); } catch {} process.exit(1); }, 90_000);
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "cdp-"))}`, "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  target = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json()).then((l) => l.find((t) => t.type === "page")).catch(() => undefined);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 2, mobile: true });
await send("Emulation.setTouchEmulationEnabled", { enabled: true });
await send("Page.enable");
await send("Page.navigate", { url });
await sleep(6000);
let clip;
if (full === "1") {
  const m = await send("Page.getLayoutMetrics");
  const ch = Math.min(m.cssContentSize?.height ?? +h, 6000);
  const cw = m.cssContentSize?.width ?? +w;
  clip = { x: 0, y: 0, width: +w, height: ch, scale: 1 };
  console.log(`conteúdo: ${cw}px de largura (viewport ${w}px)${cw > +w ? " ⚠ ROLAGEM HORIZONTAL" : ""}`);
}
const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: full === "1", ...(clip ? { clip } : {}) });
writeFileSync(out, Buffer.from(shot.data, "base64"));
ws.close();
chrome.kill();
clearTimeout(guard);
console.log(`✓ ${out}`);
process.exit(0);
