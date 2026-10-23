# Federal Electric | End-of-thread handoff | October 22, 2026

**Read this first when resuming development in a new conversation.** Source-only snapshot, not an executable release or owner acceptance.

> **Federal Electric is the company you own. Washington is the world you inhabit.**

## Exact source checkpoint

- Repository: `dereksparks1982/federalelectric` (private); **one branch: `main`**. Continue the existing **Electron/HTML/CSS/JavaScript** game; **Godot migration was shelved** after the user found engine setup added unnecessary friction. Do not create a new engine port without explicit approval.
- Source version in `package.json`: **0.6.48**; development label **v0.6.48-dev**.
- Last gameplay/source commit before this documentation handoff: `3408f54974703f767e712c4a8e6d17616fddfb53`, "feat: charge provisional city travel without charging same-building rooms".
- That commit passed **Federal Electric Source QA**, GitHub Actions run `39889057504`: https://github.com/dereksparks1982/federalelectric/actions/runs/39889057504
- The **latest packaged Linux candidate** is **v0.6.34, private draft, NOT owner-accepted**. Recent development has been **source-only**, without new executable packaging. Do not create an executable, release, tag or build artifact unless specifically requested.
- Normal play uses **autosave only**. Four independent save profiles exist, one evolving autosave each; protect migration and avoid rollback mechanics. Company and personal funds remain separate. No offline time progress. Dev edits must not silently damage older saves.
- Confirm the latest `main` SHA after this handoff commit before starting new code changes. Keep the README, ROADMAP and DECISIONS consistent; do not overwrite archived design history without explanation.

## Latest implemented slices, with boundaries

1. **Stockbroker, v0.6.35 to .36:** Map pin 14 is an in-person brokerage desk. Three visits on separate game dates unlock executive-office telegram orders **for Businessman only**. Broker opinions use **published** quotations, not hidden/future prices, and are recorded in a profile's journal. Trading uses personal funds and validates listed securities. Current orders are **immediate**; delayed telegram delivery and richer broker personality are **not implemented**.
2. **World time foundations, v0.6.37 and .47:** `world-clock.js` provides persisted absolute calendar minutes, 12-hour formatting, weekday/opening-hour helpers, chronological event queue, midnight and multi-day jumps. `calendar-bridge.js` stores a per-profile calendar alongside the old runtime, seeds new profiles at **8:00 AM**, tracks fractional elapsed seconds, and refuses to invent pre-calendar timestamps for old profiles (`legacy-unmapped`). The old **60-minute Business Day / Washington Night cycle remains the authoritative gameplay loop**. A fully live 24-hour clock across factory/markets/NPC/venues/UI has **not** yet been delivered.
3. **City/NPC, v0.6.38 to .47:** Four selectable foundations (Businessman, Patrolman, Layman, Wardman). Only Businessman has the deep company profession. Other principal characters have small saved autonomous arcs inside each profile's Washington. Seven additional schedule-driven NPCs can be present in rooms, greeted and asked about work, with private source-specific memory, limited rumor exchange, Contacts entries, and a 24-hour `npc-daybook.js` scheduling **service**, not universal adopted runtime hours. The historic Government Hospital for the Insane has a publicly accessible reception and restricted shells, but **no map pin** yet. The separate fictional Blackwood Asylum is still a prospect, not an operating acquisition game. AI behavior is deterministic/rule-based, **not generative**.
4. **Map, v0.6.38 and .48:** Fourteen numbered mapped pins; **numbers only unless hover, focus, click/tap, or optional Show Names**. Category filtering. **Gold** means an earned but **physically unvisited** lead, currently Commerce Club or Embassy Room, and clears only on successful location entry; nothing secret is exposed. Harder modes may eventually suppress gold hints.
5. **Temporary travel, latest commit `3408f54`:** `journey-planner.js` sets `DEFAULT_TRAVEL_MINUTES=60` and reserves `ROUTE_MINUTES={}` for later route overrides. Travel **between different registered city locations** costs **one provisional in-game hour** through the saved `calendar-bridge`; same-location room transfers (especially executive office ↔ factory) cost **zero**. Viewing map, failed entries and DEV navigation should not incur a trip charge. Successful journeys record origin/destination, temporary game minutes and optional departure/arrival stamps. **Actual surveyed walking durations and mileage remain unknown/null**, owned horses/carriages stay where left. The hour currently advances the **calendar bridge**, not necessarily all old gameplay consumers. The file `TRAVEL-DECISION-2026-10-22.md` and `tests/travel-duration.cjs` capture this; source tests passed.

## Owner decisions and constraints that must survive thread change

- **The campaign opens in late nineteenth-century Washington**; a fixed starting year/date has **not** been creatively finalized. Some prototype systems currently seed January 1890. Do not insist that January 1890 is permanent, and do not advertise rejected start years as a comparison.
- The **legacy illustrated office title/menu must remain retired/archived**. Navigating between rooms must not return the player to that old menu. Shared locations use neutral generic period paper/document placeholder interiors aligned with the new four-career menu. The user rejected reintroducing the old office title. No new room artwork unless requested.
- User needs to **press Play and test**, not manually configure engine settings. Stop diverting to Godot or C++ without request.
- **Movement placeholder: one hour** between separate map locations, **not one hour per room**. Map positions, real route lengths and method of travel are not decided. Later per-pin/per-route times may be several minutes or several hours. No invented surveyed accuracy.
- **Game time must eventually read Day + actual 12-hour Time (e.g., 8:00 AM), not time remaining**, and should run continuously across midnight as actions consume time. The 60-minute countdown is transitional and must be removed **only with coordinated data/system migration**, not a cosmetic edit. Opening/closing markets and NPC plans must respect actual saved time.
- **Player routines create missed opportunities:** repeatedly visiting broker only on Saturdays or Madam's only on Thursdays means missing encounters available at other dates/hours. Independent NPC schedules, not a generic random event every visit, should determine who is encountered.
- Brokerage is normally **in person**, with earned working relationships allowing **wires/telegrams**, period-aware delayed information, broker warnings and possible ways to influence securities through in-world action. No magical remote exchange dashboard for everyone.
- **Gambling:** consider historically appropriate mechanical early gaming/slot machines, verify actual machine chronology, publicly inspectable mechanics/math or legally reusable code rather than blindly copying proprietary code. Existing games should be **slightly more player-friendly for testing**; later optional harder modes can reduce favorable odds and remove conveniences. Neither full slot game nor universal revised payout probabilities is implemented.
- **NPC agency:** each player's save is its own Washington. Other unselected protagonists pursue different lives and occasionally intersect; long-term paths, investigative/criminal/institution careers, character goals, encounters and genuinely independent schedules need expansion. Do not confuse early rule-based arcs with mature AI.
- Gold priority pins and hover/click naming decisions are already in source; do not undo them.
- **Keep each development slice small and verifiable; warnings/errors matter.** Update docs as source progresses. No executable unless user explicitly asks. Do not announce a test pass without verified QA.

## Next build order: from v0.6.48-dev forward

**First priority: make the continuous 24-hour calendar authoritative, without corrupting autosaves.** Inventory the remaining old phase/countdown dependencies, and migrate the factory, raw-material production timing, payroll/contracts, stock market published/open/close quotations, venue opening windows, gambling time costs, arrival/travel, NPC schedules, UI labels and save/resume together in safe, source-tested slices. Never double-charge an activity or travel; ensure single clock across map and scene changes. Introduce proper overnight continuity without a fake 60-minute daily limit. Implement an explicit transition for `legacy-unmapped` saves and verify all old-profile paths.

**Then:** data-driven variable travel durations by approved pin pair and transportation options; broker telegram delivery/warnings/market influence; richer presence-based NPC decisions and mutually exclusive appointments; career-specific desk and room interactions; gambling slot mechanics and difficulty configurations; period-specific venue and technology research.

## Testing and release control

- Run `npm run test:source` (`tests/source-contracts.cjs` **plus** `tests/travel-duration.cjs`), plus appropriate other source/runtime tests for modified systems; use GitHub Source QA results when available.
- No build or executable packaging unless user explicitly asks. The source can be pushed to `main` and documented without generating deliverables.
- The owner has **not** accepted a new release. Do not label v0.6.48 a tested standalone executable.
- Reference documents: `ROADMAP.md`, `DECISIONS.md`, `TRAVEL-DECISION-2026-10-22.md`, `README.md`, plus archived handoffs and career/venue/city design docs.

## Handoff instruction

At the start of the next thread, inspect current GitHub `main`, read this handoff and the latest relevant source files, and proceed **from the verified checkpoint**. Do not restart the project, revert completed work, or treat unimplemented design ideas as shipped.
