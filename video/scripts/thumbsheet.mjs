// node scripts/thumbsheet.mjs <prefix...>  → out/thumbsheet.png with matching thumbnails
import { readdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
const prefixes = process.argv.slice(2);
const slash = (p) => p.split("\\").join("/");
const dir = resolve("out/thumbs");
const imgs = readdirSync(dir).filter((f) => prefixes.some((p) => f.startsWith(p))).sort();
const html = `<body style="margin:0;background:#333;display:flex;flex-wrap:wrap;gap:8px;padding:8px;width:1880px;align-items:flex-start">${imgs.map((f) => `<img src="file:///${slash(dir)}/${f}" style="width:300px">`).join("")}</body>`;
const page = resolve("out/thumbsheet.html");
writeFileSync(page, html);
execFileSync("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1896,1500", `--user-data-dir=${resolve("out/.chrome")}`, `--screenshot=${resolve("out/thumbsheet.png")}`, "--allow-file-access-from-files", `file:///${slash(page)}`], { stdio: "ignore" });
console.log(imgs.length, "miniaturas");
