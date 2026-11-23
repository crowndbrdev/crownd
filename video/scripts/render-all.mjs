/**
 * npm run render            → out/<ReelId>.mp4 for every reel (H.264, 1080×1920, 30 fps, AAC)
 * npm run render -- --stills → out/check/<ReelId>-<n>.png, one preview per beat (40% scale)
 * npm run render -- Reel2-TronoVazio  → only that reel
 *
 * Bundles once, then renders. Uses the locally installed Google Chrome: the corporate proxy
 * blocks Remotion's headless-shell download, and Edge refuses remote debugging by policy.
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { readFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const stills = args.includes("--stills");
const only = args.filter((a) => !a.startsWith("--"));
const browserExecutable = process.env.REMOTION_BROWSER ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const chromeMode = "chrome-for-testing";

const timings = JSON.parse(readFileSync("src/timings.json", "utf8"));
const ids = Object.keys(timings).filter((id) => !only.length || only.includes(id));
mkdirSync("out/check", { recursive: true });

console.log("Empacotando…");
const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });

for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, inputProps: { id }, browserExecutable, chromeMode });
  if (stills) {
    let from = 0;
    for (const [i, b] of timings[id].entries()) {
      const frames = Math.ceil((b.durationMs / 1000) * 30) + 5;
      const frame = from + Math.round(frames * 0.72);
      await renderStill({ composition, serveUrl, inputProps: { id }, frame, output: `out/check/${id}-${i + 1}.png`, scale: 0.4, browserExecutable, chromeMode });
      from += frames;
    }
    console.log(`✓ prévias de ${id}`);
    continue;
  }
  let last = -1;
  await renderMedia({
    composition, serveUrl, inputProps: { id }, codec: "h264", crf: 18, audioBitrate: "192k",
    outputLocation: `out/${id}.mp4`, browserExecutable, chromeMode,
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 10);
      if (p !== last) { last = p; process.stdout.write(`${id}: ${p * 10}%\n`); }
    },
  });
  console.log(`✓ out/${id}.mp4 (${(composition.durationInFrames / 30).toFixed(1)}s)`);
}
