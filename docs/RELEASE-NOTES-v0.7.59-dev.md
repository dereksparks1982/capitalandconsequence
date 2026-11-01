# v0.7.59-dev · Medical Files, Exhaustion & Emergency Shutdown (1 November 2026)

**Development build only. Native Linux executable NOT accepted or runtime-smoke-tested.**

- Persistent medical files for the player and named NPCs. Open the player's own file by selecting the **Health** heading in a normal condition strip, map or location interior. Other residents' medical files are not displayed without future access-control gameplay.
- A zero Energy meter now leads to a tracked collapse. Affected players must regain consciousness; time passes through the existing Washington simulation. Repeat collapse can cause recurring or severe accumulated exhaustion; recovery requires separate nights.
- Home: no fee, regain consciousness on the floor. Work: employees halt activity; Federal Electric suspends actual production while Charles is unconscious; physician billed $4 to the business. Street and risky neighborhood: $12 hospital care and transport to the existing hospital; risky areas may also cost carried cash.
- No ghost factory output and no arbitrary additional lost-profit debit. Production stays stopped during the recorded emergency. Existing closing and wage settlement processes remain authoritative.
- Sleep is now an actual **Sleep Until 8 AM** action in the home bedroom after 5 PM. Skipping the night from elsewhere no longer refills Energy.
- Existing top status banner now has two readable information rows: period/date/time/weather above exchange/cash/pause. Character condition bars remain separate below.
- Regression files: `tests/medical-records.cjs`, `tests/character-bed-rest.cjs`, plus the existing two-row condition/banner contract.

**Balance values** are fictional gameplay defaults, not historical medical quotations. See `docs/MEDICAL-RECORDS-EXHAUSTION-FACTORY-2026-11-01.md` for accepted design and deferred work.

**QA:** Focused medical record JavaScript tests were exercised in a sandbox evaluation. The full local Node test suite and packaged Linux Electron launch have NOT been executed here. Do not publish, tag or call this a tested executable.
