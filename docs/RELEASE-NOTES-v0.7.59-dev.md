# v0.7.59-dev · Medical Files, Exhaustion & Emergency Shutdown (1 November 2026)

**Development build only. Native Linux executable NOT accepted or runtime-smoke-tested.**

- Persistent medical files for the player and named NPCs. Open the player's own file by selecting the **Health** heading in a normal condition strip, map or location interior. Other residents' medical files are not displayed without future access-control gameplay.
- A zero Energy meter now leads to a tracked collapse. Affected players must regain consciousness; time passes through the existing Washington simulation. Repeat collapse can cause recurring or severe accumulated exhaustion; recovery requires separate nights.
- Home: no fee, regain consciousness on the floor. Work: employees halt activity; Federal Electric suspends actual production while Charles is unconscious; physician billed $4 to the business. Street and risky neighborhood: $12 hospital care and transport to the existing hospital; risky areas may also cost carried cash.
- No ghost factory output and no arbitrary additional lost-profit debit. Production stays stopped during the recorded emergency. Existing closing and wage settlement processes remain authoritative.
- Sleep is now an actual **Sleep Until 8 AM** action in the home bedroom after 5 PM. Skipping the night from elsewhere no longer refills Energy.
- Existing top status banner now has two readable information rows: period/date/time/weather above exchange/cash/pause. Character condition bars remain separate below.
- Map travelers now display selectable, keyboard-accessible, deliberately rough occupation and confirmed-vehicle silhouettes with their actual name, occupation and saved journey. Clicking shows a public travel card; selecting the destination uses ordinary map travel rules, without remote NPC conversation. Wagon art is reserved for a real documented wagon journey; no specific "Gypsy" identity was assumed. See `docs/MOVING-NPCS-MAP-INTERACTION-2026-11-01.md`.
- Character discovery now requires an actual encounter, named dialogue or an article actually read. A discovered traveling NPC's street icon changes with saved world time, but its destination stays private until volunteered in conversation. The other three playable characters follow these rules when simulated as residents.
- The public traveling-circus event is a separate exception: when a real dated engagement is scheduled, an ordinary player sees its temporary tent icon. NPC cards can discuss the circus using the player's recorded attendance, not a magical guess.
- Bed rest is available in the actual home bedroom from inside the room, including developer room preview, with 1/4/8-hour presets and custom half-hour increments up to twelve hours, screen fade, wind-up bell time, and rare deterministic oversleep. DEV toggle remains visible in room scenes.
- Offline 78-card tarot engine and simple spread/reading ledger committed. The traveling fortune-teller, circus schedule, and conman salesman inventory are **not yet playable**.
- Regression files: `tests/medical-records.cjs`, `tests/character-bed-rest.cjs`, `tests/npc-street-interaction.cjs`, `tests/tarot-circus-discovery.cjs`, plus existing banner contract. See `docs/CIRCUS-TAROT-NPC-DISCOVERY-2026-11-01.md`.

**Balance values** are fictional gameplay defaults, not historical medical quotations. See `docs/MEDICAL-RECORDS-EXHAUSTION-FACTORY-2026-11-01.md` for accepted design and deferred work.

**QA:** Focused medical record JavaScript tests were exercised in a sandbox evaluation. The full local Node test suite and packaged Linux Electron launch have NOT been executed here. Do not publish, tag or call this a tested executable.
