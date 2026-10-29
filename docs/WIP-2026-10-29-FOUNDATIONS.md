# Capital & Consequence | 29 October 2026 foundations WIP

**Branch:** `work/2026-10-29-foundations`  
**Base main:** `b5b244211036` (`0.7.23`)  
**Status:** Development source, not owner-accepted. No Linux Electron playthrough or complete local Node suite.

## Implemented in this branch
- Disk mirrored profile saves can recover missing/corrupt localStorage records. Corrupt primary disk saves fall back to the prior healthy `.recovery`. Electron profile listing supports index reconstruction.
- Legacy duty time counter now follows the authoritative 8AM to 5PM working hours and night-to-morning clock, including elapsed seconds. Existing phase guards read the updated value.
- Newly created profiles may join the same versioned Washington world record, sharing clock, NPC simulation and objective events. Previously created unlinked profiles are intentionally NOT merged.
- Shared world and personal knowledge are separate. Edmund's confirmed filed ward work enters objective world history without revealing private notes. His completed work also enters a private append-only life history and mission record.
- A unified mission state machine exists for one vertical slice: real assigned, attended and filed ward duties, plus explicit abandonment. It mirrors existing paid/time-charged orderly work instead of creating free time or duplicate wages.
- Campaign-scoped District Asylum incident foundation chooses hidden causal truth once per incident before evidence. The source has no active investigative UI, witness timeline, or predetermined guilt for a player protagonist.
- District General Hospital has a restricted morgue room inside its existing location, not a new map pin. Bodies and coroner reports require a real incident, verified medical findings, and explicit police permission.
- Stale tests updated where demonstrably outdated; newly added narrow Node regression files and V8 behavioral checks.

## NOT finished or verified
- The six formerly failing Node tests and the full suite have not been re-run here; available testing is syntax checks and selected V8 core behavior. Real Linux Electron playthrough is pending.
- Existing profiles remain separate until explicitly linked by a future approved flow. New linked profiles share foundational clock/NPC state but not yet every economy, housing, relationship and institution field.
- Full lifetime recording for every career is not complete. Current new append-only confirmed action records cover Edmund; existing capped ledgers still limit historical completeness, and localStorage requires future chunking.
- Asylum homicide is not active gameplay. Evidence timelines, witnesses, lawful investigation missions, autopsy appointments and coroner UI remain future integration.
- No releases, tags, GitHub Actions, new executable, or approved UI/map geometry changes.

## Local acceptance gate
Run `node tests/run-all.cjs` and the existing Linux Electron smoke test locally. Repair every failure; verify new-game, recovery, cross-character clock, ward actions, 4:50PM duty guard, map/pin behavior, report access and save/reload without assuming source-only QA equals gameplay QA.
