/**
 * Runs the Stripe CLI even when it isn't on PATH yet (winget puts it under
 * %LOCALAPPDATA%\Microsoft\WinGet\Packages\Stripe.StripeCli_*\ and PATH only
 * refreshes in new terminals). Usage: node scripts/stripe-cli.mjs listen --forward-to ...
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

function findStripe() {
  const probe = spawnSync(process.platform === "win32" ? "where" : "which", ["stripe"], { encoding: "utf8" });
  if (probe.status === 0 && probe.stdout.trim()) return probe.stdout.trim().split(/\r?\n/)[0];
  const local = process.env.LOCALAPPDATA;
  if (!local) return null;
  const links = join(local, "Microsoft", "WinGet", "Links", "stripe.exe");
  if (existsSync(links)) return links;
  const pkgs = join(local, "Microsoft", "WinGet", "Packages");
  if (!existsSync(pkgs)) return null;
  for (const dir of readdirSync(pkgs).filter((d) => d.startsWith("Stripe.StripeCli"))) {
    const exe = join(pkgs, dir, "stripe.exe");
    if (existsSync(exe)) return exe;
  }
  return null;
}

const bin = findStripe();
if (!bin) {
  console.error("Stripe CLI não encontrado. Instale com: winget install --id Stripe.StripeCli -e");
  process.exit(1);
}
const res = spawnSync(bin, process.argv.slice(2), { stdio: "inherit" });
process.exit(res.status ?? 1);
