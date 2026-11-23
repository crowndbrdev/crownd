/**
 * Cross-platform launcher for bash wizards: `node scripts/run-wizard.mjs scripts/stripe-wizard.sh`
 *
 * On Windows, plain `bash` from npm/cmd usually resolves to C:\Windows\System32\bash.exe (WSL),
 * which would run the wizard inside Linux — wrong Node, no winget, wrong paths. This finds
 * Git Bash instead and hands it the real terminal (stdio: inherit) so prompts keep working.
 */
import { spawnSync, execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const script = process.argv[2];
if (!script) {
  console.error("Uso: node scripts/run-wizard.mjs <script.sh>");
  process.exit(1);
}

function gitBash() {
  const candidates = [];
  try {
    // .../Git/mingw64/libexec/git-core → .../Git
    const execPath = execFileSync("git", ["--exec-path"], { encoding: "utf8" }).trim();
    const root = resolve(execPath, "..", "..", "..");
    candidates.push(join(root, "bin", "bash.exe"), join(root, "usr", "bin", "bash.exe"));
  } catch {
    /* git not on PATH — fall back to the usual install locations */
  }
  const local = process.env.LOCALAPPDATA;
  for (const base of [
    process.env.ProgramFiles && join(process.env.ProgramFiles, "Git"),
    process.env["ProgramFiles(x86)"] && join(process.env["ProgramFiles(x86)"], "Git"),
    local && join(local, "Programs", "Git"),
  ]) {
    if (base) candidates.push(join(base, "bin", "bash.exe"), join(base, "usr", "bin", "bash.exe"));
  }
  return candidates.find((p) => existsSync(p));
}

let shell = "bash";
if (process.platform === "win32") {
  shell = gitBash();
  if (!shell) {
    console.error("Git Bash não encontrado. Instale o Git for Windows (https://git-scm.com/download/win) e tente de novo.");
    process.exit(1);
  }
}

const res = spawnSync(shell, [script, ...process.argv.slice(3)], {
  stdio: "inherit",
  cwd: resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), ".."),
  // NODE_USE_SYSTEM_CA: trust the Windows certificate store, so Node tools (wrangler, stripe scripts)
  // work behind corporate TLS inspection (e.g. Netskope) instead of failing with SELF_SIGNED_CERT_IN_CHAIN.
  env: { ...process.env, CHERE_INVOKING: "1", MSYSTEM: process.env.MSYSTEM ?? "MINGW64", NODE_USE_SYSTEM_CA: "1" },
});
process.exit(res.status ?? 1);
