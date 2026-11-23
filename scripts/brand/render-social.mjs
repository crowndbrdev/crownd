/**
 * Generates the Crownd social kit as HTML (brand fonts + tokens), ready to be rasterized to PNG.
 *   node scripts/brand/render-social.mjs   → brand/social/html/*.html + brand/social/manifest.json
 * Then scripts/brand/rasterize.sh screenshots each file at its exact size with headless Edge/Chrome.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { COUNTRIES } from "../../src/config/countries.ts";

const OUT = "brand/social/html";
mkdirSync(OUT, { recursive: true });

const MARK = (fill = "currentColor", jewel = "#FFC531") => `
<svg viewBox="0 0 64 64" fill="${fill}" aria-hidden="true">
  <rect x="10" y="26" width="12" height="26" rx="3"/><rect x="26" y="14" width="12" height="38" rx="3"/>
  <rect x="42" y="32" width="12" height="20" rx="3"/><rect x="8" y="50" width="48" height="7" rx="2"/>
  <circle cx="16" cy="19" r="4.5"/><circle cx="32" cy="6.5" r="5" fill="${jewel}"/><circle cx="48" cy="25" r="4.5"/>
</svg>`;

const css = (w, h, theme) => {
  const s = Math.min(w, h) / 1080;
  const dark = theme !== "light";
  return `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500;700&display=block');
*{box-sizing:border-box;margin:0;padding:0}
html{font-size:${(16 * s).toFixed(3)}px}
body{width:${w}px;height:${h}px;overflow:hidden;font-family:'Bricolage Grotesque',system-ui,sans-serif;
  background:${dark ? "#0E0D12" : "#F7F3EA"};color:${dark ? "#F4F1EA" : "#0E0D12"};-webkit-font-smoothing:antialiased}
body::before{content:"";position:fixed;inset:0;opacity:.07;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.frame{position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:4.5rem}
.top,.bottom{display:flex;align-items:center;justify-content:space-between;gap:2rem}
.brand{display:flex;align-items:center;gap:1rem;font-weight:800;font-size:2.6rem;letter-spacing:-.06em}
.brand svg{width:3.4rem;height:3.4rem}
.chip{font-family:'JetBrains Mono',monospace;font-size:1.25rem;letter-spacing:.12em;text-transform:uppercase;
  border:2px solid ${dark ? "#3A3744" : "#D4CAB4"};border-radius:999px;padding:.6rem 1.3rem;color:${dark ? "#CFCAC0" : "#3B3842"}}
.mono{font-family:'JetBrains Mono',monospace}
.serif{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400}
.gold{color:#FFC531}.muted{color:${dark ? "#9C978C" : "#6E6A60"}}
.h1{font-weight:800;letter-spacing:-.05em;line-height:.9}
.url{font-family:'JetBrains Mono',monospace;font-size:1.6rem}
.dot{display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#FF4A2E;margin-right:.8rem}
.card{border-radius:2.4rem;padding:2.6rem;background:${dark ? "#16151B" : "#FFFDF8"};border:2px solid ${dark ? "#2A2833" : "#E6DFCF"}}
.throne{border:3px solid #FFC531;box-shadow:0 0 0 .6rem rgba(255,197,49,.12)}
.grid20{display:grid;grid-template-columns:repeat(5,1fr);gap:1rem}
.sw{border-radius:1.2rem;padding:1.1rem 1.2rem;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:1.5rem;display:flex;flex-direction:column;gap:.3rem;min-height:6.2rem;justify-content:flex-end}
.sw small{font-family:'Bricolage Grotesque';font-weight:600;font-size:1.05rem;opacity:.85;line-height:1.1}
.row{display:flex;align-items:center;gap:2rem}
.step{display:flex;gap:2rem;align-items:baseline;padding:1.8rem 0;border-top:2px solid ${dark ? "#2A2833" : "#E6DFCF"}}
.step b{font-family:'JetBrains Mono';color:#FFC531;font-size:2rem}
.step h3{font-size:3.2rem;letter-spacing:-.03em}
.step p{font-size:1.7rem;margin-top:.4rem}
.cta{display:inline-block;background:#FFC531;color:#0E0D12;font-weight:800;border-radius:999px;padding:1.2rem 2.4rem;font-size:2rem}
`;
};

const page = (w, h, theme, body) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${css(w, h, theme)}</style></head><body>${body}</body></html>`;

const frame = (inner, { chip, url = "crownd.dev", dark = true } = {}) => `
<div class="frame">
  <div class="top"><div class="brand">${MARK(dark ? "#F4F1EA" : "#0E0D12")}crownd</div>${chip ? `<div class="chip">${chip}</div>` : ""}</div>
  <div class="content">${inner}</div>
  <div class="bottom"><span class="url">${url}</span><span class="mono muted" style="font-size:1.3rem">👑 #1</span></div>
</div>`;

/** Copy per language. pt-BR for Instagram/LinkedIn (wave 1 = Brazil), en for X (global build-in-public). */
const T = {
  pt: {
    p1: ["AO VIVO EM 20 PAÍSES", "20 coroas.", "Um mundo.", "Um leaderboard público de produtos indie por país. Quem paga mais usa a coroa."],
    p2: ["COMO FUNCIONA", "Como pegar a coroa", [["01", "Cola o link", "Site, loja de apps, GitHub ou @perfil."], ["02", "Dá o seu lance", "Maior total senta no trono."], ["03", "Segura a coroa", "Até alguém cobrir. A gente te avisa."]]],
    p3: ["SEM UPVOTE POR PENA", "Vai deixar o", "pro outro viralizar?"],
    p4: ["PAGA SÓ A DIFERENÇA", "Já está no board?", "Seu total", "Novo total", "Você paga", "Cola o mesmo link e sobe. Sem pagar tudo de novo."],
    p5: ["LANÇAMENTOS GRÁTIS", "10 vagas grátis.", "Todo dia.", "Ranking por cliques únicos. Zera à meia-noite."],
    p6: ["HALL DA FAMA", "Todo #1 fica", "para a história.", ["Reinado atual", "Reinado anterior", "Primeiro reinado"], "Seu produto aqui"],
    p7: ["SELO AO VIVO", "Mostre sua", "posição.", "Coloque o selo no seu site. Ele se atualiza sozinho — e vira backlink."],
    p8: ["UMA EDIÇÃO POR PAÍS", "Cada país,", "sua cor.", "A cor de cada edição vem da cultura local — não da bandeira."],
    p9: ["O TRONO ESTÁ VAZIO", "Seja o primeiro", "#1 do Brasil.", "A partir de R$ 5. Cartão ou boleto.", "Pegar o #1", "crownd.dev/br"],
    edition: "Crownd Brasil",
  },
  en: {
    p1: ["LIVE IN 20 COUNTRIES", "20 crowns.", "One world.", "A public leaderboard of indie products in every country. Highest bid wears the crown."],
    p2: ["HOW IT WORKS", "How to take the crown", [["01", "Paste your link", "Site, app store, GitHub or @handle."], ["02", "Name your price", "Highest total sits on the throne."], ["03", "Hold the crown", "Until someone outbids you. We'll email you."]]],
    p3: ["NO PITY UPVOTES", "Someone else is", "about to go viral."],
    p4: ["PAY ONLY THE DIFFERENCE", "Already on the board?", "Your total", "New total", "You pay", "Paste the same link and climb. Never pay twice."],
    p5: ["FREE LAUNCHES", "10 free slots.", "Every day.", "Ranked by unique clicks. Resets at local midnight."],
    p6: ["HALL OF FAME", "Every #1", "goes down in history.", ["Reigning now", "Previous reign", "First reign"], "Your product here"],
    p7: ["LIVE BADGE", "Show off", "your rank.", "Embed the badge on your site. It updates itself — and it's a backlink."],
    p8: ["ONE EDITION PER COUNTRY", "Every country,", "its own colour.", "Each edition's colour comes from local culture — not the flag."],
    p9: ["THE THRONE IS EMPTY", "Be the first", "#1 in your country.", "From $1. Pay in your own currency.", "Take #1", "crownd.dev"],
    edition: "Crownd USA",
  },
};

const money = { pt: ["R$ 2.400", "R$ 2.500", "R$ 100"], en: ["$480", "$500", "$20"] };

function posts(lang, w, h) {
  const c = T[lang];
  const big = (rem) => `font-size:${rem}rem`;
  const landscape = w > h;
  const H = landscape ? 0.82 : 1;
  return [
    // 1 · Launch
    () => frame(`
      <div class="h1" style="${big(10 * H)}">${c.p1[1]}</div>
      <div class="serif" style="${big(9 * H)};line-height:1">${c.p1[2]}</div>
      <p style="${big(2)};max-width:52rem;margin-top:2rem" class="muted">${c.p1[3]}</p>
      <div class="grid20" style="margin-top:2.4rem;${landscape ? "grid-template-columns:repeat(10,1fr)" : ""}">
        ${COUNTRIES.map((x) => `<div class="sw" style="background:${x.accent.hex};color:${x.accent.ink};min-height:${landscape ? 4.4 : 6.2}rem">${x.iso}</div>`).join("")}
      </div>`, { chip: c.p1[0] }),
    // 2 · How it works
    () => frame(`
      <div class="h1" style="${big(7 * H)};margin-bottom:2rem">${c.p2[1]}</div>
      ${c.p2[2].map(([n, t, d]) => `<div class="step"><b>${n}</b><div><h3>${t}</h3><p class="muted">${d}</p></div></div>`).join("")}`, { chip: c.p2[0] }),
    // 3 · Taunt
    () => frame(`
      <div class="h1" style="${big(9.5 * H)}">${c.p3[1]} ${lang === "pt" ? '<span class="gold">#1</span>' : ""}</div>
      <div class="serif" style="${big(8.5 * H)};line-height:1;margin-top:1rem">${c.p3[2]}</div>
      ${lang === "en" ? `<div class="h1 gold" style="${big(9.5 * H)};margin-top:1.5rem">Take #1.</div>` : ""}`, { chip: c.p3[0] }),
    // 4 · Pay the difference
    () => frame(`
      <div class="h1" style="${big(6.4 * H)};margin-bottom:2.6rem">${c.p4[1]}</div>
      <div class="card" style="font-family:'JetBrains Mono';${big(2.4)}">
        <div class="row" style="justify-content:space-between"><span class="muted">${c.p4[2]}</span><b>${money[lang][0]}</b></div>
        <div class="row" style="justify-content:space-between;margin-top:1.2rem"><span class="muted">${c.p4[3]}</span><b>${money[lang][1]}</b></div>
        <div style="border-top:2px dashed #3A3744;margin:1.8rem 0"></div>
        <div class="row" style="justify-content:space-between"><span>${c.p4[4]}</span><b class="gold" style="${big(5)}">${money[lang][2]}</b></div>
      </div>
      <p class="muted" style="${big(2)};margin-top:2rem">${c.p4[5]}</p>`, { chip: c.p4[0] }),
    // 5 · Free launches
    () => frame(`
      <div class="h1" style="${big(8.4 * H)}">${c.p5[1]}</div>
      <div class="serif gold" style="${big(8 * H)};line-height:1">${c.p5[2]}</div>
      <div class="row" style="gap:1rem;margin:3rem 0 2rem">${Array.from({ length: 10 }, (_, i) => `<span style="width:4.6rem;height:4.6rem;border-radius:1.2rem;display:grid;place-items:center;font-family:'JetBrains Mono';font-weight:700;${big(1.6)};background:${i < 3 ? "#FFC531" : "transparent"};color:${i < 3 ? "#0E0D12" : "#9C978C"};border:2px solid ${i < 3 ? "#FFC531" : "#3A3744"}">${i + 1}</span>`).join("")}</div>
      <p class="muted" style="${big(2.1)}">${c.p5[3]}</p>`, { chip: c.p5[0] }),
    // 6 · Hall of fame
    () => frame(`
      <div class="h1" style="${big(7.4 * H)}">${c.p6[1]}</div>
      <div class="serif" style="${big(6.8 * H)};line-height:1;margin-bottom:2.6rem">${c.p6[2]}</div>
      ${c.p6[3].map((label, i) => `<div class="card ${i === 0 ? "throne" : ""}" style="margin-top:1.2rem;display:flex;justify-content:space-between;align-items:center;padding:1.8rem 2.4rem">
        <span style="${big(2.4)};font-weight:800">${i === 0 ? "👑 " : ""}${c.p6[4]}</span><span class="mono muted" style="${big(1.4)}">${label}</span></div>`).join("")}`, { chip: c.p6[0] }),
    // 7 · Live badge
    () => frame(`
      <div class="h1" style="${big(8.4 * H)}">${c.p7[1]}</div>
      <div class="serif gold" style="${big(8 * H)};line-height:1">${c.p7[2]}</div>
      <div class="card throne" style="display:inline-flex;align-items:center;gap:2rem;margin:3rem 0 2rem;padding:2rem 3rem">
        <span style="width:6rem;height:6rem;display:block;color:#F4F1EA">${MARK("#F4F1EA")}</span>
        <span><span class="muted" style="display:block;${big(1.6)}">${c.edition}</span><span class="mono" style="${big(4.6)};font-weight:700">#1 👑</span></span>
      </div>
      <p class="muted" style="${big(2.1)};max-width:54rem">${c.p7[3]}</p>`, { chip: c.p7[0] }),
    // 8 · Every country its colour
    () => frame(`
      <div class="h1" style="${big(7.4 * H)}">${c.p8[1]}</div>
      <div class="serif" style="${big(7 * H)};line-height:1;margin-bottom:2.4rem">${c.p8[2]}</div>
      <div class="grid20" style="${landscape ? "grid-template-columns:repeat(10,1fr)" : ""}">
        ${COUNTRIES.map((x) => `<div class="sw" style="background:${x.accent.hex};color:${x.accent.ink};min-height:${landscape ? 5.6 : 7.4}rem">${x.iso}<small>${x.accent.name.split(" & ")[0]}</small></div>`).join("")}
      </div>
      <p class="muted" style="${big(1.9)};margin-top:2rem">${c.p8[3]}</p>`, { chip: c.p8[0] }),
    // 9 · Empty throne
    () => frame(`
      <div class="card throne" style="padding:${landscape ? 3 : 4.4}rem">
        <p class="mono muted" style="${big(1.5)};letter-spacing:.14em"><span class="dot"></span>${c.p9[0]}</p>
        <div class="h1" style="${big(7.6 * H)};margin-top:1.6rem">${c.p9[1]}</div>
        <div class="h1 gold" style="${big(7.6 * H)}">${c.p9[2]}</div>
        <p class="muted" style="${big(2.2)};margin:2rem 0 2.6rem">${c.p9[3]}</p>
        <span class="cta">${c.p9[4]} →</span>
      </div>`, { chip: "crownd.dev", url: c.p9[5] }),
  ];
}

const manifest = [];
const write = (name, w, h, theme, body) => {
  writeFileSync(`${OUT}/${name}.html`, page(w, h, theme, body));
  manifest.push({ name, w, h });
};

// ── Posts: 9 per network ──
const NETWORKS = [
  { net: "instagram", lang: "pt", w: 1080, h: 1350 },
  { net: "x", lang: "en", w: 1600, h: 900 },
  { net: "linkedin", lang: "pt", w: 1200, h: 1200 },
];
for (const n of NETWORKS) {
  posts(n.lang, n.w, n.h).forEach((fn, i) => write(`${n.net}-post-${String(i + 1).padStart(2, "0")}`, n.w, n.h, "dark", fn()));
}

// ── Profile pictures (square; IG/X crop to a circle, so the mark sits inside a safe 70% circle) ──
const avatar = (bg, fg, jewel) => `<div style="height:100%;display:grid;place-items:center;background:${bg}">
  <div style="width:56%;height:56%;color:${fg};margin-top:-2%">${MARK(fg, jewel)}</div></div>`;
write("avatar-dark", 1080, 1080, "dark", avatar("#0E0D12", "#F4F1EA", "#FFC531"));
write("avatar-light", 1080, 1080, "light", avatar("#F7F3EA", "#0E0D12", "#FFC531"));
write("avatar-gold", 1080, 1080, "dark", avatar("#FFC531", "#0E0D12", "#0E0D12"));

// ── Headers / covers ──
const cover = (w, h, line1, line2) => `<div style="height:100%;display:flex;align-items:center;justify-content:space-between;padding:0 ${w * 0.06}px">
  <div><div class="h1" style="font-size:${h * 0.2}px">${line1}</div><div class="serif" style="font-size:${h * 0.18}px;line-height:1">${line2}</div>
  <div class="mono muted" style="font-size:${h * 0.055}px;margin-top:${h * 0.05}px">crownd.dev</div></div>
  <div style="display:flex;gap:${h * 0.03}px;flex-wrap:wrap;width:${w * 0.34}px;justify-content:flex-end">${COUNTRIES.map((x) => `<span style="width:${h * 0.1}px;height:${h * 0.1}px;border-radius:${h * 0.025}px;background:${x.accent.hex}"></span>`).join("")}</div></div>`;
write("x-header", 1500, 500, "dark", cover(1500, 500, "Who's #1?", "20 countries. 20 crowns."));
write("linkedin-cover", 1584, 396, "dark", cover(1584, 396, "Quem é o #1?", "20 países. 20 coroas."));

writeFileSync("brand/social/manifest.json", JSON.stringify(manifest, null, 2));
console.log(`✓ ${manifest.length} peças geradas em ${OUT}`);
