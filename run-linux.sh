#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Federal Electric needs Node.js installed."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Federal Electric needs npm installed."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing Federal Electric desktop dependencies..."
  npm install --no-audit --no-fund
fi

echo "Starting Federal Electric..."
exec npm start
