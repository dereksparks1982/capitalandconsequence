#!/usr/bin/env bash
# Local source QA, reporting every test. Never install, package, push or upload.
# No set -e, GitHub Actions, password prompts, terminal exits or background work.
if cd "$(dirname "$0")/.."; then
  if ! command -v node >/dev/null 2>&1; then
    printf 'Node.js is required for local source QA.\n' >&2
    false
  else
    failures=0
    for file in ./*.js desktop/*.cjs tests/*.cjs; do
      [[ -f "$file" ]] || continue
      if ! node --check "$file"; then
        printf 'SYNTAX FAIL: %s\n' "$file" >&2
        failures=$((failures+1))
      fi
    done
    if ! node tests/run-all.cjs; then
      failures=$((failures+1))
    fi
    if (( failures > 0 )); then
      printf 'Source QA RED: %d syntax/runner group failure(s). Inspect the full failure report above.\n' "$failures" >&2
      false
    else
      printf 'Source QA GREEN: complete local suite passed. No GitHub Actions or artifacts.\n'
    fi
  fi
else
  printf 'Could not find project directory for local source QA.\n' >&2
  false
fi
