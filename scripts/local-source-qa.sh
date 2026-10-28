#!/usr/bin/env bash
# Run local source checks and every Node regression; never package, upload or push.
# No GitHub Actions, login, password prompt, terminal exit or set -e.
cd "$(dirname "$0")/.." || return 1 2>/dev/null || :
if ! command -v node >/dev/null 2>&1; then
  printf 'Node.js is required for local source QA.\n' >&2
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
    printf 'Source QA RED: %d syntax/runner group failure(s); see full test failures above.\n' "$failures" >&2
  else
    printf 'Source QA GREEN: syntax and full regression suite passed locally. No GitHub Actions or artifacts.\n'
  fi
fi
