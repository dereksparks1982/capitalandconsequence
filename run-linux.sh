#!/usr/bin/env bash
# Canonical Linux game launcher. No npm install, sudo, GitHub Actions or
# old capital-consequence executables. Keep the terminal open on failure.
project="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
if [ -z "$project" ]; then
  printf 'Cannot find Capital & Consequence project folder.\n' >&2
elif [ ! -x "$project/capitalandconsequence" ]; then
  printf 'Current game executable is missing: %s/capitalandconsequence\n' "$project" >&2
else
  "$project/capitalandconsequence" "$@"
fi
