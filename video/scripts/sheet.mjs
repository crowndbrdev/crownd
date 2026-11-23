// Contact sheet of preview stills: node scripts/sheet.mjs <ReelId>  → out/sheet-<ReelId>.png
import { readdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const reel = process.argv[2];
const slash = (p) => p.split("\\").join("/");
const dir = resolve("out/check");
const imgs = readdirSync(dir).filter((f) => f.startsWith(reel + "-") && f.endsWith(".png")).sort();
const html = `<body style="margin:0;background:#222;display:flex;gap:8px;padding:8px">${imgs
  .map((f) => `<img src="file:///${slash(dir)}/${f}" style="width:432px;height:768px">`)
  .join("")}</body>`;
const page = resolve(`out/sheet-${reel}.html`);
writeFileSync(page, html);
execFileSync(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--window-size=${imgs.length * 440 + 8},784`, `--user-data-dir=${resolve("out/.chrome")}`,
    `--screenshot=${resolve(`out/sheet-${reel}.png`)}`, "--allow-file-access-from-files", `file:///${slash(page)}`],
  { stdio: "ignore" },
);
console.log(`out/sheet-${reel}.png (${imgs.length} quadros)`);
