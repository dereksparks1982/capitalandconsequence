#!/usr/bin/env bash
# Offline source validation only. Never install, package, push or upload.
set -euo pipefail
cd "$(dirname "$0")/.."
command -v node >/dev/null || { echo "Node.js must already be installed." >&2; exit 1; }
command -v npm >/dev/null || { echo "npm must already be installed." >&2; exit 1; }
for file in ./*.js desktop/*.cjs tests/*.cjs; do
  [[ -f "$file" ]] || continue
  node --check "$file"
done
npm run test:source
printf 'Source checks passed locally; no GitHub Actions or artifacts were used.\n'
