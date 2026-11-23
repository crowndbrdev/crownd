/**
 * npm run deploy  —  safe Cloudflare deploy.
 *
 * OpenNext bundles every .env* file it finds into the Worker (one block per environment).
 * Local dev secrets (Stripe TEST key, CLI webhook secret) must never leave this machine, so:
 *  1. .env.development.local is moved aside during the build (restored in `finally`);
 *  2. the built bundle is inspected and the deploy ABORTS if any non-public variable is embedded;
 *  3. only then `opennextjs-cloudflare deploy` runs. Production secrets live in Cloudflare
 *     (`wrangler secret`), never in files the build can read.
 * Flags: --skip-build (reuse .open-next), --dry-run (build + check, no upload).
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, renameSync } from "node:fs";

// Behind corporate TLS inspection (Netskope etc.) Node must trust the OS certificate store.
process.env.NODE_USE_SYSTEM_CA = "1";

const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");
const dryRun = args.includes("--dry-run");
const DEV_SECRETS = ".env.development.local";
const STASH = ".secrets.dev-stash";

const run = (cmd) => {
  const r = spawnSync(cmd, { stdio: "inherit", shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

if (!skipBuild) {
  const stashed = existsSync(DEV_SECRETS);
  if (stashed) renameSync(DEV_SECRETS, STASH);
  try {
    run("npx opennextjs-cloudflare build");
  } finally {
    if (stashed) renameSync(STASH, DEV_SECRETS);
  }
}

const envFile = ".open-next/cloudflare/next-env.mjs";
if (!existsSync(envFile)) {
  console.error(`✗ ${envFile} não encontrado — rode sem --skip-build.`);
  process.exit(1);
}
const mod = await import(`data:text/javascript;base64,${Buffer.from(readFileSync(envFile, "utf8")).toString("base64")}`);
const leaked = Object.entries(mod).flatMap(([envName, vars]) =>
  vars && typeof vars === "object" ? Object.keys(vars).filter((k) => !k.startsWith("NEXT_PUBLIC_")).map((k) => `${envName}.${k}`) : [],
);
if (leaked.length) {
  console.error(`✗ Deploy abortado: variáveis não públicas embutidas no Worker: ${leaked.join(", ")}`);
  console.error("  Segredos de produção devem ir por `wrangler secret put`, nunca em arquivos .env*.");
  process.exit(1);
}
console.log("✓ Pacote limpo: só variáveis NEXT_PUBLIC_* embutidas.");

if (dryRun) run("npx wrangler deploy --dry-run");
else run("npx opennextjs-cloudflare deploy");
