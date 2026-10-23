> **ARCHIVED HISTORICAL HANDOFF (v0.6.65).** Current owner decisions, correction of v0.6.70 timer guesses and latest source live in [the October 23 Living Washington design](DESIGN-2026-10-23-LIVING-WASHINGTON.md). Read that first. Current source is v0.6.71-dev.

# Capital & Consequence · October 23 source continuation handoff

> **CURRENT SOURCE RESUME POINT.** Read this document first, followed by `ROADMAP.md`'s **ACTIVE DEVELOPMENT SCOPE · WASHINGTON FIRST**, `DECISIONS.md`, and the relevant character codices. `HANDOFF-2026-10-23-THREAD-END.md` is the preserved baseline that preceded this continuation. Older handoffs and snapshots retain historical value but are not the current source version.

## Canonical repository and validated source

- **Game:** Capital & Consequence. **Federal Electric is Charlie Whitcomb's company**, not the game title.
- **Private repository:** `dereksparks1982/capitalconsequence`, existing and sole **`main` branch**. Do not branch off, use the renamed old URL, or reset the historical save namespace `federalElectric*`.
- **Current source version:** **v0.6.65-dev** (package `0.6.65`, `app.js` `APP_VERSION='v0.6.65-dev'`).
- **Last source commit before this documentation handoff:** `de212efbda8ccf773f74e9258ace733c3704b7dc`, "feat(ai): make gossip room-bound, confidential-aware and relationship-sensitive (v0.6.65)".
- **Verified GitHub Actions source QA:** run [39969296302](https://github.com/dereksparks1982/capitalconsequence/actions/runs/39969296302), **SUCCESS**, at `de212efbda8ccf773f74e9258ace733c3704b7dc`, Oct 23, 2026; **441 source-contract checks**, plus all named independent suites (including NPC, component manufacturing, patrol, doorman, orderly, clock and 360 truth-first detective cases).
- **No new executable:** the last packaged Linux candidate remains **v0.6.34**, a private unaccepted draft. This batch made source-only commits and did not run packaging, tag or publish releases. Green source QA is not a substitute for packaged Electron, real-device or user gameplay acceptance.
- Documentation edits in this handoff do not change tested source.

## Newly completed source slices (all on main; complete history remains in README)

| Version | Code / tests | Implemented boundary |
| --- | --- | --- |
| **v0.6.59** | `npc-intentions.js`, `tests/npc-intentions.cjs`, NPC runtime/mobility | Saved individual utility goals can steer legal personal travel to registered Washington locations without overriding work, settled bets or restricted doors. |
| **v0.6.60** | `npc-social.js`, `tests/npc-social.cjs` | Simultaneously co-room residents can gain reciprocal private social relationship memories. One encounter/person/period, no reroll and no instant public report. |
| **v0.6.61** | `npc-language.js`, `tests/npc-language.cjs` | Russian/English comprehension gates conversational social encounters and rumor transfers. Alexi Rurik stays Russian-only; bilingual Pavel Orlov may understand him. First QA run lacked the language test-harness dependency; fixed in commit `b159a601639c75b6582d41d81ec521520eebb406`, with a green rerun. |
| **v0.6.62** | `component-works.js`, `tests/component-works.cjs`, `COMPONENT-WORKS-1878-FOUNDATION.md` | Separate, deterministic 1878 electrical-component factory ledger: materials, products, accepted orders, assembly, warehouse, delivery, cash, time-due and replay-safe receipts. Not yet integrated into 1890 UI/new profiles. |
| **v0.6.63** | `orderly-duty.js`, `orderly-ui.js`, `tests/orderly-duty.cjs`, Edmund codex | Edmund Wardman's playable ordinary asylum work: assignment, patient-ward task, station report, provisional earned wage, bounded by date and actual charged game actions. No management privilege. |
| **v0.6.64** | `npc-witness.js`, `tests/npc-witness.cjs` | A protagonist actually present in the same room can gain an idempotent first-hand private journal note about observable NPC interaction, not secret dialogue or motives. |
| **v0.6.65** | `npc-rumors.js`, `tests/npc-rumors.cjs` | Gossip must occur in same actual room, shared language and relevant interpersonal trust. Confidential facts excluded; event provenance includes location/room/language. |

## Settled Washington-only setting

The game's world is an alternate late-nineteenth-century America. After the real Civil War of **1861–1865**, fictional reform erased states and replaced their borders with economically/functionally defined national districts. **No national map, district boundaries, noncapital names or national government design are finalized.** Develop only Washington D.C. and its 26 existing registered locations and rooms; outside districts remain lore/roadmap until explicitly re-scoped. The live menu title and motto are **CAPITAL & CONSEQUENCE** and **One city. Countless lives. Every choice has consequences.** Do not restore the retired Federal Electric illustration as a title screen or modify approved art without request.

Four playable routes, all with separate autosaves and career desks (not a shared synchronized save):

1. `industrialist`: **Charles “Charlie” Whitcomb**, owns Federal Electric at the outset. Existing active 1890 bulb-first business prototype persists unchanged in this batch.
2. `investigator`: **Samuel “Sam” Harlan**, rookie Black on-foot patrolman. **On duty ONLY Hillsdale and the Metropolitan Police station**; off duty a civilian free to visit normally accessible Washington, including Chinatown. He is **not** an entry-rank homicide detective.
3. `criminal`: **Elias “Eli” Crowe**, lowly nightclub doorman, not automatically a criminal or club proprietor. Night paid-work loop continues as earlier verified.
4. `wardman`: **Edmund Wardman**, black-sheep orderly in fictional **District Asylum** (saved registry ID `blackwoodAsylum`), directed by his still-unnamed brother. Limited ordinary work loop is now playable.

The Russian-only **Alexi Rurik** is an autonomous NPC, not fifth playable character. Do not revive discarded alternate character surnames.

## What is NOT yet implemented, despite the new AI modules

- These remain **offline deterministic rule-based agents**, not cloud/generative dialogue models, conversationally autonomous human simulations, real-world 24-hour independent lives or a reliable complete city social economy.
- NPC motion still advances on observed periods; it does **not** use verified Washington street-by-street journey lengths. NPC intentions do not override job, economic or shared room permissions.
- The simulation uses a **provisional per-profile 24-hour calendar bridge**, while the old 60-minute business day/night governs many actual operations. Exact single-clock authority is unfinished. No away-from-game progression.
- The **live opening is still January 2, 1890**, with a bulb-first factory. Approved target **January 2, 1878** is NOT ready: component-module costs, names, tooling and recipes are provisional, and new-profile selection, factory panels, suppliers, technical timeline, payroll, orders, market/date migrations, and legacy save compatibility are not finished. Do not change live `CAMPAIGN_START_DATE` alone. For design and constraints read `COMPONENT-WORKS-1878-FOUNDATION.md` and `ROADMAP.md`.
- The 1893 World's Fair in Washington is intentional alternate history (real fair in Chicago); competitive Federal Electric bulb-supply bid and conditional paper front page remain future. A separate **post-fair** streetlight modernization bid may follow. Historical 1880s electric arc lighting is distinct.
- Chinatown smuggling/police corruption, varied campaign captain truth, truly NPC-generated crime, full police ranks, and earned evidence chains are **future design**, not game actions. Sam cannot magically gain official Chinatown patrol rights.
- No named asylum-superintendent brother, nightclub owner, automatically granted property, or finalized unreleased districts.

## Next practical work order

1. **Save and clock audit:** audit the current `app.js` factory 1890 assumptions (lines around initial state, product catalog, raw-material methods, contracts, production and shipping, standing sales, newspapers, market data and date transitions), plus the legacy save schema. Build a deliberate two-lane historical profile mode without corrupting older 1890 saves. The isolated 1878 component engine is not yet tied to the authoritative clock; `minutesCommitted` is owed production effort rather than a proven world-time charge.
2. **Build the complete 1878 Charlie start safely in successive source-tested slices:** component manufacturing UI, machine constraints, sustainable orders, supplier transactions, payroll, saved profile routing, consistent time, and correct 1878 public news. Test opening play and old 1890 compatibility before switching new profiles.
3. Deepen D.C. resident agency **through actual people and rooms**, not infinite data-only randomness: travel duration/transport, work attendance, specific commercial interactions, independently caused incidents, witness provenance, privacy and earned meetings. Research 1878 period authenticity before hardcoding claims.
4. Complete sustained Edmund orderly work (institutional staff/supervisor logic, not omnipotent access), Hillsdale policing (real witnesses, lawful report chain, wages/roster), Eli's real nightclub staffing and autonomous visitors, and Charlie's factory modernization.
5. Only much later: a campaign-seeded Chinatown network of individually culpable actors, possibly corrupt individual police and a captain whose role is variable across saves. Keep ordinary Chinatown citizens as independent residents.
6. **QA/release:** each source slice increments version, updates README/ROADMAP/DECISIONS/codices, runs `npm run test:source` in GitHub Source QA and inspects logs. **Do not** run manual Linux workflow, package, create a release or tag without owner request. GitHub push is not final player acceptance.

## Development policy

- One main branch, incremental source-only commits, no fabricated test status.
- Keep save route keys, title and existing place IDs unchanged; protect unreadable or old autosaves.
- No offline simulation while program closed; no reroll/rollback in normal play.
- Keep art, audio, packaged releases and unrelated repos alone.
- Owner can stop changes at any time; stop means stop.
