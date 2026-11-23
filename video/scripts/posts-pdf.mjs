/**
 * npm run posts:pdf → ../brand/social/Crownd-Plano-de-Conteudo-60-posts.pdf (+ .html)
 * Reads src/posts.json and the thumbnails from `npm run posts` (out/thumbs/).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const posts = JSON.parse(readFileSync("src/posts.json", "utf8"));
const slash = (p) => p.split("\\").join("/");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const thumbs = resolve("out/thumbs");

const NETS = {
  ig: { name: "Instagram", handle: "@crowndbr", size: "1080×1350 (4:5)", tone: "Visual, provocativo e útil. Carrosséis educativos geram salvamentos; posts únicos geram comentários.", tags: "3 a 5 hashtags no fim da legenda.", freq: "3 posts por semana (seg, qua, sex), entre 12h e 13h ou entre 19h e 21h." },
  x: { name: "X", handle: "@crowndbr", size: "1600×900 (16:9) · até 4 imagens", tone: "Curto, opinativo e build in public. Threads para explicar, enquetes para conversar.", tags: "No máximo 1 hashtag (hashtags derrubam o alcance no X).", freq: "3 posts por semana + respostas diárias a makers." },
  li: { name: "LinkedIn", handle: "Página Crownd", size: "1080×1350 (4:5) · carrossel como documento PDF", tone: "Profissional, transparente e de referência. Texto mais longo, primeira linha forte.", tags: "Até 3 hashtags.", freq: "3 posts por semana (ter, qua, qui), às 8h ou às 12h." },
  tt: { name: "TikTok", handle: "@crownd.dev", size: "1080×1920 (9:16) · modo foto (carrossel)", tone: "Humor, POV e listas rápidas. A legenda é curta; o texto está na imagem.", tags: "3 a 5 hashtags; adicione um som em alta no app.", freq: "3 posts por semana (ter, qui, sáb), entre 18h e 22h, intercalados com os Reels." },
  th: { name: "Threads", handle: "@crowndbr", size: "1080×1350 (4:5)", tone: "Conversa. Perguntas, opiniões e bastidores, sempre terminando com um convite para responder.", tags: "1 tópico (o Threads aceita uma tag por post).", freq: "3 posts por semana, respondendo a todos os comentários." },
};

const files = (p) => p.slides.map((_, i) => (p.slides.length > 1 ? `${p.id}-${i + 1}.png` : `${p.id}.png`));
const thumb = (f) => {
  const jpg = `${thumbs}/${f.replace(".png", ".jpg")}`;
  return existsSync(jpg) ? `<img src="file:///${slash(jpg)}" alt="">` : "";
};

function card(p) {
  const fs = files(p);
  return `
  <section class="post">
    <header>
      <span class="id">${p.id.toUpperCase()}</span>
      <h3>${esc(p.title)}</h3>
      <span class="fmt">${p.format === "carousel" ? `Carrossel · ${p.slides.length} imagens` : "Imagem única"}</span>
      ${p.afterPayments ? '<span class="flag">Publicar após abrir os pagamentos</span>' : ""}
    </header>
    <div class="thumbs ${p.net === "x" ? "wide" : p.net === "tt" ? "tall" : ""}">${fs.map(thumb).join("")}</div>
    <dl>
      <dt>Imagens</dt><dd class="mono">${fs.map((f) => `brand/social/posts/${p.net}/${f}`).join("<br>")}</dd>
      <dt>Objetivo</dt><dd>${esc(p.objective)}</dd>
      <dt>Descrição</dt><dd>${esc(p.alt)} <em>(use também como texto alternativo da imagem)</em></dd>
      <dt>Legenda</dt><dd><pre>${esc(p.caption)}</pre></dd>
      <dt>${p.net === "th" ? "Tópico" : "Hashtags"}</dt><dd class="tags">${p.hashtags.length ? p.hashtags.map(esc).join(" ") : "Nenhuma (recomendado nesta rede)"}</dd>
    </dl>
  </section>`;
}

const DAYS = { ig: ["Seg", "Qua", "Sex"], x: ["Seg", "Qua", "Sex"], li: ["Ter", "Qua", "Qui"], tt: ["Ter", "Qui", "Sáb"], th: ["Seg", "Qua", "Sex"] };
const calendar = [0, 1, 2, 3].map((w) => `
  <tr><th>Semana ${w + 1}</th>${Object.keys(NETS).map((n) => `<td>${[0, 1, 2].map((d) => `${DAYS[n][d]} · ${n.toUpperCase()}-${String(w * 3 + d + 1).padStart(2, "0")}`).join("<br>")}</td>`).join("")}</tr>`).join("");

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Crownd · Plano de conteúdo · 60 posts</title>
<style>
  @page { size: A4; margin: 14mm 14mm 16mm; }
  :root { --ink:#0E0D12; --muted:#6E6A60; --line:#E2D9C5; --gold:#B87900; --paper:#F7F3EA; --coup:#E0341A; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", system-ui, sans-serif; color: var(--ink); font-size: 10.5pt; line-height: 1.45; margin: 0; }
  h1 { font-size: 34pt; letter-spacing: -0.03em; line-height: 1; margin: 0 0 8mm; }
  h2 { font-size: 20pt; letter-spacing: -0.02em; margin: 0 0 4mm; border-bottom: 2px solid var(--ink); padding-bottom: 2mm; }
  h3 { font-size: 13pt; margin: 0; flex: 1; }
  .cover { height: 260mm; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
  .cover .k { font-family: Consolas, monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); margin-bottom: 6mm; }
  .cover p { font-size: 13pt; color: var(--muted); max-width: 150mm; }
  .crown { display:inline-block; width:14mm; height:14mm; margin-bottom: 8mm; }
  .page { page-break-after: always; }
  table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  th, td { border: 1px solid var(--line); padding: 2.2mm 2.5mm; vertical-align: top; text-align: left; }
  th { background: var(--paper); }
  .net { page-break-before: always; }
  .netinfo { background: var(--paper); border-radius: 3mm; padding: 4mm 5mm; margin-bottom: 6mm; font-size: 9.8pt; }
  .netinfo b { display: inline-block; min-width: 26mm; }
  .post { border: 1px solid var(--line); border-radius: 3mm; padding: 4mm 5mm; margin-bottom: 5mm; page-break-inside: avoid; }
  .post header { display: flex; align-items: center; gap: 3mm; flex-wrap: wrap; margin-bottom: 3mm; }
  .id { font-family: Consolas, monospace; font-weight: 700; background: var(--ink); color: #fff; border-radius: 2mm; padding: .6mm 2.2mm; font-size: 9pt; }
  .fmt { font-size: 9pt; color: var(--muted); }
  .flag { font-size: 8.5pt; color: #fff; background: var(--coup); border-radius: 2mm; padding: .6mm 2.2mm; }
  .thumbs { display: flex; gap: 2mm; flex-wrap: wrap; margin-bottom: 3mm; }
  .thumbs img { height: 34mm; border-radius: 1.5mm; border: 1px solid var(--line); }
  .thumbs.wide img { height: 24mm; }
  .thumbs.tall img { height: 40mm; }
  dl { display: grid; grid-template-columns: 24mm 1fr; gap: 1.6mm 4mm; margin: 0; }
  dt { font-weight: 700; color: var(--muted); font-size: 9pt; text-transform: uppercase; letter-spacing: .04em; padding-top: .4mm; }
  dd { margin: 0; }
  pre { white-space: pre-wrap; font-family: inherit; margin: 0; background: var(--paper); border-radius: 2mm; padding: 2.5mm 3mm; }
  .mono { font-family: Consolas, monospace; font-size: 8.5pt; color: var(--muted); }
  .tags { color: var(--gold); font-weight: 600; }
  ul { margin: 0; padding-left: 5mm; }
</style></head><body>

<section class="cover">
  <svg class="crown" viewBox="0 -6 64 66"><rect x="10" y="26" width="12" height="26" rx="3"/><rect x="26" y="14" width="12" height="38" rx="3"/><rect x="42" y="32" width="12" height="20" rx="3"/><rect x="8" y="50" width="48" height="7" rx="2"/><circle cx="16" cy="19" r="4.5"/><circle cx="32" cy="6.5" r="5" fill="#FFC531"/><circle cx="48" cy="25" r="4.5"/></svg>
  <div class="k">Crownd · crownd.dev</div>
  <h1>Plano de conteúdo:<br>60 posts para 5 redes</h1>
  <p>12 posts para cada rede (Instagram, X, LinkedIn, TikTok e Threads), com as imagens prontas, a legenda para colar, a descrição de cada peça e as hashtags. Todas as imagens estão em <b>brand/social/posts/</b>.</p>
  <p style="font-size:10pt">Gerado em ${new Date().toLocaleDateString("pt-BR")} · ${posts.length} posts · ${posts.reduce((n, p) => n + p.slides.length, 0)} imagens</p>
</section>

<section class="page">
  <h2>Como usar este plano</h2>
  <ul>
    <li><b>Imagem única ou carrossel:</b> está indicado em cada post. Nos carrosséis, publique as imagens na ordem dos números (-1, -2, -3…).</li>
    <li><b>Legenda:</b> copie o bloco "Legenda" inteiro e acrescente as hashtags indicadas no fim.</li>
    <li><b>Descrição:</b> explica a peça e serve como texto alternativo (acessibilidade e SEO das redes).</li>
    <li><b>Selo vermelho "Publicar após abrir os pagamentos":</b> esses posts citam o lance de R$ 5. Publique só depois que <span class="mono">crownd.dev/api/health</span> mostrar <span class="mono">"payments":"stripe"</span>.</li>
    <li><b>Honestidade da marca:</b> nenhum post inventa números, depoimentos ou produtos. Os boards aparecem como ilustração, com produtos anônimos.</li>
    <li><b>Cores:</b> cada post usa uma paleta da marca (Obsidiana, Pergaminho, Ouro, Coup Red, Verde Copa e Noite), alternadas para o feed não ficar repetitivo.</li>
  </ul>
  <h2 style="margin-top:8mm">Estratégia por rede</h2>
  <table>
    <tr><th>Rede</th><th>Perfil</th><th>Formato</th><th>Tom</th><th>Hashtags</th><th>Frequência</th></tr>
    ${Object.values(NETS).map((n) => `<tr><td><b>${n.name}</b></td><td>${n.handle}</td><td>${n.size}</td><td>${n.tone}</td><td>${n.tags}</td><td>${n.freq}</td></tr>`).join("")}
  </table>
  <h2 style="margin-top:8mm">Calendário sugerido (4 semanas)</h2>
  <table><tr><th></th>${Object.values(NETS).map((n) => `<th>${n.name}</th>`).join("")}</tr>${calendar}</table>
  <p class="mono" style="margin-top:3mm">Intercale com os 9 Reels (brand/social/reels/): um Reel por semana no Instagram, no TikTok e no YouTube Shorts.</p>
</section>

${Object.entries(NETS).map(([k, n]) => `
<section class="net">
  <h2>${n.name} · ${n.handle}</h2>
  <div class="netinfo"><b>Formato</b> ${n.size}<br><b>Tom</b> ${n.tone}<br><b>Hashtags</b> ${n.tags}<br><b>Frequência</b> ${n.freq}</div>
  ${posts.filter((p) => p.net === k).map(card).join("")}
</section>`).join("")}
</body></html>`;

const out = resolve("../brand/social/Crownd-Plano-de-Conteudo-60-posts");
writeFileSync(`${out}.html`, html);
execFileSync("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files",
  `--user-data-dir=${resolve("out/.chrome-pdf")}`, `--print-to-pdf=${out}.pdf`, `file:///${slash(out)}.html`,
], { stdio: "ignore" });
console.log(`✓ ${out}.pdf`);
