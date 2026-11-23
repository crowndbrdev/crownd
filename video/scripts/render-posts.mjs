/**
 * npm run posts                 → every image of every post in src/posts.json
 * npm run posts -- ig-01 x-03   → only those posts
 *
 * Output: ../brand/social/posts/<net>/<post-id>.png (single) or <post-id>-<n>.png (carousel),
 * plus small JPEG thumbnails in out/thumbs/ used by the PDF content plan.
 */
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const only = process.argv.slice(2);
const posts = JSON.parse(readFileSync("src/posts.json", "utf8")).filter((p) => !only.length || only.includes(p.id));
const browserExecutable = process.env.REMOTION_BROWSER ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const chromeMode = "chrome-for-testing";
const ffmpeg = resolve("node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
const OUT = resolve("../brand/social/posts");
mkdirSync("out/thumbs", { recursive: true });

const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
// One browser for all stills (otherwise Remotion launches Chrome for every image).
const puppeteerInstance = await openBrowser("chrome", { browserExecutable, chromeMode });
let n = 0;
for (const post of posts) {
  mkdirSync(`${OUT}/${post.net}`, { recursive: true });
  for (let i = 0; i < post.slides.length; i++) {
    const inputProps = { postId: post.id, index: i };
    const composition = await selectComposition({ serveUrl, id: "Post", inputProps, browserExecutable, chromeMode, puppeteerInstance });
    const name = post.slides.length > 1 ? `${post.id}-${i + 1}` : post.id;
    const file = `${OUT}/${post.net}/${name}.png`;
    await renderStill({ composition, serveUrl, inputProps, output: file, browserExecutable, chromeMode, puppeteerInstance });
    execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", file, "-vf", "scale=360:-2", "-q:v", "4", `out/thumbs/${name}.jpg`]);
    n++;
  }
  console.log(`✓ ${post.id} (${post.slides.length})`);
}
await puppeteerInstance.close({ silent: true });
console.log(`✓ ${n} imagens em brand/social/posts/`);
