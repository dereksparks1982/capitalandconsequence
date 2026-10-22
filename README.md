# Federal Electric

**Current candidate: v0.6.25 Linux x64 · unaccepted private draft · October 22, 2026**

> **Federal Electric is the company you own.**  
> **Washington is the world you inhabit.**

**Build an electrical empire in an alternate-history Washington, D.C., beginning in 1890.**

Federal Electric is a standalone historical business and life simulation about running a growing electrical company while the rest of Washington keeps moving around you.

You buy materials, negotiate contracts, run the factory, trade stocks, manage company money, follow the newspaper, make contacts, attend races and fights, sit in poker rooms, and decide how much of your limited day you are willing to spend away from the business.

**The important part is that you cannot do everything.**

## Current build status

**Latest source:** `v0.6.32-dev` on the single `main` branch. The latest source is an **unaccepted development candidate**, not the packaged build. A **new Linux x64 standalone test executable** has been packaged from commit `ba9a8086c0e1eee249a096645cdcab75a6731764` and is available in the [private v0.6.25 draft](https://github.com/dereksparks1982/federalelectric/releases/tag/untagged-77235e6eadd10ae242e6). The build is **unaccepted**, not a final/public release.

Federal Electric is now being developed as a **standalone Linux game**, with Windows and macOS possibilities later. The previous GitHub Pages/browser distribution is **not the current supported build**; do not treat the old Pages link as the updated game. The v0.6.25 source-contract suite, desktop runtime preparation, artwork/offline audits, packaged Electron smoke test, checksum verification, and private draft upload completed successfully on October 22. Owner gameplay acceptance remains pending.

Each distinct development slice increments the patch number; this v0.6.25 candidate includes the city, background-character, transport, poker, autosave, and corruption-protection groundwork. Packaging stays **manual-only** after the authorized one-time October 22 build. Candidate testing, owner acceptance, and final publication remain separate steps.

## The world and the clock

Washington begins in **January 1890**, not 1938. The numbered campaign spans **372 turns**, four playable Business Days per month from January 1890 through September 1897. Each playable turn has a **60-minute Business Day** and **60-minute Washington Night**. The clock does not progress offline, and pausing blocks gameplay information and actions. Production, markets, scheduled racing and opportunity windows continue while the player is active elsewhere.

The **1893 World's Fair in Washington** is a deliberate alternate-history event; in the real world it was hosted in Chicago. Later technologies and 1930s media assets remain in the project as legacy/future-period resources. Period gating and comprehensive historical conversion are still in progress, so not all inherited gameplay content has been verified for the 1890 start.

## Factory, markets and contacts

Federal Electric remains the company. Its electrical-lighting factory has contracts, negotiation, production lots, graded finished stock, warehouse raw materials, delivery deadlines, employee conditions, weather and power interruptions, and delegation groundwork. Producing finished goods does **not** automatically ship them to customers.

The fictional Federal Exchange contains 50 securities with evolving quotations, a personal portfolio and corporate histories. Company Cash and Personal Cash stay separate. Trade and gambling decisions should not silently spend company funds.

The Metropolitan Ledger, Contacts, Journal, and pastimes introduce information that may be incomplete, misleading, delayed or disputed. Separate social groups should eventually know different facts rather than exposing one global omniscient reputation score.

## Getting around Washington

The city registry contains **13 editable numbered map pins**, currently using a temporary later-era Washington illustration. The map positions are **display coordinates, not surveyed road distances**.

Press **M** to open or close the Washington map. Closing it should return you to the room or game interface you were using, **without moving your character**. Selecting **Go There** enters that location's current placeholder room; when you are already there, the Go There action is hidden. Real route durations and transport costs remain unfinished. **Go There currently performs clearly labeled provisional direct movement**, saving origin and destination but charging no invented time and leaving any owned transport behind.

Among the pinned locations are the Ivy City factory, Star Club, Capital Race Grounds, Neighborhood Game, Commerce Club at the Washington-Hoover hangar, Embassy Room, Chinatown, Russian Trade Hall, fairgrounds, Capitol Airport, University of Maryland and **Our Home**.

**Pin 12: Our Home** is a proposed modest Capitol Hill rowhouse near Eastern Market, with separate Front Room, Bedroom, Kitchen and Household Storage. It has a basic Household Register. The starting home's rental/ownership terms are **undetermined**, not assumed. More expensive townhouses, city mansions, estates, household staff, door service and better amenities are designed as later progression, **not currently purchasable**.

## The paper doll and belongings

Press **P** for the original approved paper-doll image at `assets/artwork/characters/paperdolls/paperdoll.png`. Press P again, Escape or its X to close it. Its **eight illustrated slots** are shirt, trousers, shoes, left ring, right ring, pocket watch, left pocket and right pocket. The illustration is currently fixed; clothing changes and wearable effects have not yet been implemented.

Each pocket opens its own small, initially empty container window. Personal effects have separate per-profile storage records. Household belongings are readable only in the Home Storage room. The code does **not** create fictional identification documents or assume players carry wallets or passports. Capacity, picking up and placing items, dressing and vehicle ownership need further systems.

## Gambling, sport and social life

Existing gameplay includes horse/dog/midget-car racing, boxing, three social poker circles, private prizefights and other underground leads. These earlier modules are **not yet fully converted** to the final 1890 Washington geography or alternate-city gambling laws.

**Planned alternate-Washington policy:** only specifically licensed wagers/games are legal; private poker, unauthorized house games and prohibited animal contests remain underground. **The exact approved card-game list is not settled.** Baccarat / chemin de fer, seen in *GoldenEye*, is a candidate for a permitted game, **not a poker variant**. Five-card poker, roulette and blackjack are candidates for restricted backrooms pending rules decisions.

Venue opportunity records and **location checks for existing wagering and club actions** now require the player to reach their proper rooms. Specific invitations, time windows and outcomes still matter. The future casino game list remains undecided. Chinese-American characters should be individuals with specific relationships and stories; cricket-fighting has historical Chinese traditions, while proposed beetle and snake contests require further period and cultural research. No encounter, invitation or location exclusivity should be falsely described as implemented before its gameplay exists.

## Three lives in one Washington (future direction)

The existing businessman/tycoon remains the only playable starting character. Profile creation now previews two **future** protagonists: a police/private-investigator route and a criminal/outlaw route. An optional darker thriller branch has not been agreed as mandatory gameplay. They would inhabit the **same city registry and setting**, each with separate personal knowledge, contacts and forward-moving autosave. The two unplayed character archetypes now have an early **autonomous background career simulation**: stable, saved branches can generate occasional public newspaper reports. The Metropolitan Ledger now retains those **public Washington Dispatches** across game turns. Their hidden career paths remain confidential. They now also occupy **persistent registered Washington locations** as turns pass; you may notice an unintroduced visitor in a shared room. They cannot yet be selected as the player's own story. Read [character routes design](CHARACTER-ROUTES-DESIGN-2026-10-21.md).

## Possible institutional venture: Blackwood Asylum

A new, **planning-only** prospect proposes integrating the earlier Victorian-era asylum management concept as a separate Washington institution. Buying a controlling interest, investing as a minority shareholder, or running it as an appointed superintendent are possible future paths, subject to governance research. A read-only Info entry and empty per-profile institutional ledger exist; **there is no playable asylum acquisition, staff, patient or treatment management yet**. The separate Soviet Moroz Asylum concept is not being transplanted unchanged into 1890. See [Asylum integration design](ASLYUM-INTEGRATION-DESIGN-2026-10-21.md).

## Personal mobility and persistent consequences

**Implemented groundwork:** owned horses/carriages have individual, per-profile records for their last known locations, conditions and statuses. New profiles start with **no owned horse or carriage**. An Info register shows recorded assets. **Design direction:** a horse, hired ride or purchased carriage exists at a physical location. The horse must not appear beside you simply because you traveled elsewhere. If you tie it up, leave it in a stable, lose it or have it stolen, its recorded position and status matter. Any wandering, theft and recovery rules will be implemented as explicit saved events, **not spontaneous resets**.

Travel will eventually offer walking, riding and carriage options, each with measured routes, conditions and different time costs. **Historic distances and duration models have not yet been verified or enabled.**

**Autosave is the only normal progression mechanism.** Missing or unreadable existing profile autosaves are protected from the five-second save timer; opening the affected profile displays an explicit recovery warning without overwriting its bytes. Card-room bypass clicks have been removed, and played poker now uses saved one-use, stake-reserving sessions. The Info tab includes a confirmed resolution for a session interrupted by a crash: undealt reservations can be canceled, while played-but-unsettled sessions forfeit their stake. Significant outcomes should save immediately. A player must not be offered a GTA V-style load-any-earlier-save function to reroll a losing bet, arrest, theft or other irreversible result. Up to three independent player profiles currently exist, each with its **own single evolving autosave**, not a menu of rollback checkpoints. Locally stored files remain editable by someone determined to tamper with them; this is a design and normal-play integrity rule, **not an anti-tamper guarantee**.

## Play and test status

The source is developed for local Electron/Linux. The v0.6.25 test candidate is available as [Federal-Electric-0.6.25-linux-x64.tar.gz](https://github.com/dereksparks1982/federalelectric/releases/download/untagged-77235e6eadd10ae242e6/Federal-Electric-0.6.25-linux-x64.tar.gz) with its [SHA-256 file](https://github.com/dereksparks1982/federalelectric/releases/download/untagged-77235e6eadd10ae242e6/Federal-Electric-0.6.25-linux-x64.tar.gz.sha256). Archive SHA-256: `c50d92f86bc9d5717b3bf87ac5b142c057f5193894c44eafc819136a4adc0d8e`. This is a **private, unaccepted draft**; the game has not been approved for final release.

For developers with the repository and Node installed:

```bash
npm run test:source
npm run prepare:runtime
npm run audit:artwork
npm run audit:offline
```

The source suite verifies registry, personal storage, housing, mobility, autonomous story progression, and save-model contracts. The authorized October 22 Linux candidate **passed** source, packaged-runtime, and launcher smoke checks in GitHub Actions. The transient one-time request workflow was removed afterward; source pushes now trigger **source-only QA**, not an executable build. Linux packaging remains manual-only. Real-player review and acceptance are still outstanding.

## Next steps and project records

Work ahead: survey Washington road distances, legal-versus-illicit activity venue gates, persistent horses/carriages, approved travel time/cost rules, irrevocable-event autosaves, richer room layers, historically researched housing prices and staff, dress etiquette and character-specific reputation.

Detailed specifications and decisions live in [Roadmap](ROADMAP.md), [World rules and opportunity design](WORLD-RULES-2026-10-21.md), [Blackwood Asylum integration](ASLYUM-INTEGRATION-DESIGN-2026-10-21.md), [character routes](CHARACTER-ROUTES-DESIGN-2026-10-21.md), [1890 conversion brief](DESIGN-1890-CONVERSION-2026-10-21.md), [Historical notes](HISTORICAL-NOTES.md), [Design decisions](DECISIONS.md), [Artwork organization](assets/artwork/README.md) and the [build snapshots](BUILD-SNAPSHOT-2026-10-07.md). Older snapshots preserve historical status; their version numbers and 1938 assumptions are not the current development state.

**Federal Electric is the company you own. Washington is the world you inhabit.**

## v0.6.26 development slice: pastimes belong to their venues (2026-10-22)

The Executive Desk no longer exposes a global **Pastimes** navigation button. Activities are entered from **Washington locations**, by opening the map with **M**, traveling to the relevant location, and selecting that location's activity. The established horse, dog and midget racing, licensed boxing, Star Club visits, three separate poker circles, private prizefights and cockfighting use their existing modules, saved finances, venue permissions, and world-clock schedules. Activities are rendered inside their corresponding city room, never as a remote desk menu. Only the relevant poker table appears at its actual card room. Closing the activity returns to the current room and does not cancel unrelated scheduled events. Midget racing is still locked until its period; private contests and invitation-only tables retain their access requirements. No new artwork is authorized or required for this slice.

This is an **unaccepted source change**, not an approved new executable release. The existing 0.6.25 draft candidate predates this slice.

## v0.6.27 source slice: Barry Farm neighborhood pin

Added the **Barry Farm** neighborhood to Washington's city registry as numbered map pin **13** (provisional position southeast/east of the Anacostia River), with a visitable neighborhood-street room shell. The historic African American community began in 1867, before the game's 1890 starting date. This change adds no invented shops, residents, activities, historical 1940s public housing, or new artwork. Its historical basis is documented by the [Smithsonian Anacostia Community Museum](https://anacostia.si.edu/barryfarm/explore-neighborhood) and the [D.C. History Center](https://dchistory.libguides.com/c.php?g=1246926&p=9124571). Source-only and unaccepted until separately packaged and tested.

## v0.6.29–v0.6.32 development slices (October 22, 2026)

- **v0.6.29 · Map navigation safety:** A historically future or otherwise restricted map location gives an explanatory message, rather than a dead Go There action. City-room setup is validated before committing the player's location, and failed entry restores the previous position instead of saving a phantom visit. A new packaged-Electron smoke check exercises Commerce Club, Chinatown, and the 1893 World's Fair gate. **The packaged check has not yet been executed for this source version.**
- **v0.6.30 · Save failure visibility:** Catches localStorage write failures such as quota exhaustion. A persistent on-screen error banner says explicitly that recent progress was not saved. A failed write never reports success.
- **v0.6.31 · Atomic file mirror foundation:** A sandboxed Electron preload bridge lets the main process keep a profile-scoped file copy of successful localStorage autosaves in the application's private user-data folder. File writes use temporary files and renames; a private previous copy exists for corruption recovery. Legacy localStorage is **still the loading authority**; automatic recovery from these disk copies is future work, not implemented. An explicitly deleted profile also schedules removal of its mirror. This slice does not yet remove the browser storage capacity limit.
- **v0.6.32 · Shared-clock foundation:** Adds an engine-independent `world-clock.js` implementation of absolute calendar minutes and a deterministic priority queue of scheduled events. The queue can advance by an activity's duration and execute intervening events in order, including events caused by other events. Serialized world-clock state can be reopened without advancing time offline. **This clock is not yet the authoritative gameplay clock**; the existing day/night timer and seven-character schedule slice remain active during the transition.

GitHub source QA checks are distinct from an actual Linux packaged-game test. The last accepted status has not changed: **the v0.6.25 packaged executable remains an unaccepted private candidate**. Do not claim these newer features are play-tested until a new candidate passes the full smoke tests and the owner validates it.

### Remaining engineering priorities

1. Validate packaged navigation and file-save IPC end-to-end, then migrate profile loading from localStorage to atomic files with explicit recovery handling and backward compatibility.
2. Convert the new absolute-minute clock into the real game clock in carefully tested stages, keeping economy and manufacturing calculations consistent. Existing real-time hour-long turns must not be described as the new 24-hour model.
3. Use the shared clock and event queue for NPC decisions, investigations, relationships, and newspaper events. Apply saved random seeds across old minigames rather than allowing outcomes to reroll at reload.
4. Introduce GTA-style map pin category filters, only when existing movement and location access pass runtime tests.
5. Character-select menu, Star Club expansion, rare Drek encounter, and later historical events remain **design proposals**, not implemented gameplay.
