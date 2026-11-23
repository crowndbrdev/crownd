/**
 * npm run mail:verify
 *
 * 1. Asks Resend to (re)check the crownd.dev DNS records.
 * 2. When the domain is verified, sets the Worker secret MAIL_ENABLED=1: outbid e-mails start
 *    going out and the site starts promising them (read at request time — no redeploy needed).
 * Reads RESEND_API_KEY from .secrets.production (gitignored); never prints it.
 */
import { execFileSync } from "node:child_process";

const key = process.env.RESEND_API_KEY;
if (!key) { console.error("RESEND_API_KEY ausente em .secrets.production"); process.exit(1); }
const h = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

const list = await fetch("https://api.resend.com/domains", { headers: h }).then((r) => r.json());
const d = list.data?.find((x) => x.name === "crownd.dev");
if (!d) { console.error("Domínio crownd.dev não encontrado no Resend."); process.exit(1); }

await fetch(`https://api.resend.com/domains/${d.id}/verify`, { method: "POST", headers: h });
const info = await fetch(`https://api.resend.com/domains/${d.id}`, { headers: h }).then((r) => r.json());
console.log(`Domínio crownd.dev: ${info.status}`);
for (const r of info.records ?? []) console.log(`  ${r.status === "verified" ? "✓" : "…"} ${r.record} ${r.type} ${r.name}`);

if (info.status !== "verified") {
  console.log("\nAinda não verificado. Confira os registros DNS na Cloudflare (docs/12-email.md) e rode de novo em alguns minutos.");
  process.exit(2);
}
execFileSync(process.platform === "win32" ? "npx.cmd" : "npx", ["wrangler", "secret", "put", "MAIL_ENABLED"], {
  input: "1", stdio: ["pipe", "inherit", "inherit"], shell: process.platform === "win32",
  env: { ...process.env, NODE_USE_SYSTEM_CA: "1" },
});
console.log("\n✓ E-mails de aviso LIGADOS (MAIL_ENABLED=1). O site já passa a prometer o aviso por e-mail.");
