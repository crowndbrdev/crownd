#!/usr/bin/env bash
# Rasterizes brand/social/html/*.html to PNG at exact sizes with headless Edge (or Chrome).
# Usage: bash scripts/brand/rasterize.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

BROWSER=""
for b in "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" "/c/Program Files/Microsoft/Edge/Application/msedge.exe" \
         "/c/Program Files/Google/Chrome/Application/chrome.exe" "$(command -v google-chrome || true)" "$(command -v chromium || true)"; do
  [[ -n "$b" && -x "$b" ]] && { BROWSER="$b"; break; }
done
[[ -n "$BROWSER" ]] || { echo "Edge/Chrome não encontrado"; exit 1; }

OUT="brand/social/png"; mkdir -p "$OUT"
TMP="$(mktemp -d)"
node -e "for (const m of require('./brand/social/manifest.json')) console.log(m.name, m.w, m.h)" | tr -d '\r' | while read -r name w h; do
  src="$(cygpath -w "$PWD/brand/social/html/$name.html" 2>/dev/null || echo "$PWD/brand/social/html/$name.html")"
  dst="$(cygpath -w "$PWD/$OUT/$name.png" 2>/dev/null || echo "$PWD/$OUT/$name.png")"
  prof="$(cygpath -w "$TMP/$name" 2>/dev/null || echo "$TMP/$name")"
  "$BROWSER" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --user-data-dir="$prof" \
    --virtual-time-budget=6000 --window-size="$w,$h" --screenshot="$dst" "file:///${src//\\//}" >/dev/null 2>&1 || true
  [[ -f "$OUT/$name.png" ]] && echo "✓ $name.png ($w×$h)" || echo "✗ $name"
done
rm -rf "$TMP"
