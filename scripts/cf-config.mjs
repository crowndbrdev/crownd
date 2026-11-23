/**
 * Small, comment-preserving edits to wrangler.jsonc used by the launch wizard.
 *   node scripts/cf-config.mjs set-d1 <database_id>
 *   node scripts/cf-config.mjs enable-domain | disable-domain
 *   wrangler d1 list --json | node scripts/cf-config.mjs find-d1     → prints crownd-db's uuid
 *   VAR=… node scripts/cf-config.mjs secrets-json                     → JSON for `wrangler secret bulk`
 */
import { readFileSync, writeFileSync } from "node:fs";

const [cmd, arg] = process.argv.slice(2);

if (cmd === "find-d1") {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  try {
    const db = JSON.parse(raw).find((d) => d.name === "crownd-db");
    if (db?.uuid) process.stdout.write(db.uuid);
  } catch {
    /* not logged in or no JSON: print nothing */
  }
  process.exit(0);
}

if (cmd === "secrets-json") {
  // Values arrive via environment variables (never argv, which other processes can read).
  const names = ["STRIPE_SECRET_KEY", "CLICK_SALT", "INDEXNOW_KEY", "LEGAL_ENTITY", "LEGAL_TAX_ID", "LEGAL_ADDRESS", "LEGAL_EMAIL"];
  const out = Object.fromEntries(names.filter((n) => process.env[n]).map((n) => [n, process.env[n]]));
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

const file = "wrangler.jsonc";
let s = readFileSync(file, "utf8");

if (cmd === "set-d1") {
  if (!/^[0-9a-f-]{36}$/.test(arg ?? "")) throw new Error("database_id inválido");
  s = s.replace(/("database_name": "crownd-db", "database_id": ")[^"]*(")/, `$1${arg}$2`);
} else if (cmd === "enable-domain" || cmd === "disable-domain") {
  const lines = s.split("\n");
  const start = lines.findIndex((l) => /^\s*(\/\/\s*)?"routes": \[/.test(l));
  if (start < 0) throw new Error("bloco routes não encontrado");
  let end = start;
  while (!/^\s*(\/\/\s*)?\]\s*$/.test(lines[end])) end++;
  for (let i = start; i <= end; i++) {
    const bare = lines[i].replace(/^(\s*)\/\/ ?/, "$1");
    lines[i] = cmd === "enable-domain" ? bare : bare.replace(/^(\s*)/, "$1// ");
  }
  s = lines.join("\n");
} else {
  console.error("uso: set-d1 <id> | enable-domain | disable-domain");
  process.exit(1);
}
writeFileSync(file, s);
console.log(`✓ wrangler.jsonc: ${cmd}`);
