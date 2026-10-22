# Federal Electric

**Current development source: v0.6.20-dev · unaccepted, source-only · October 21, 2026**

> **Federal Electric is the company you own.**  
> **Washington is the world you inhabit.**

**Build an electrical empire in an alternate-history Washington, D.C., beginning in 1890.**

Federal Electric is a standalone historical business and life simulation about running a growing electrical company while the rest of Washington keeps moving around you.

You buy materials, negotiate contracts, run the factory, trade stocks, manage company money, follow the newspaper, make contacts, attend races and fights, sit in poker rooms, and decide how much of your limited day you are willing to spend away from the business.

**The important part is that you cannot do everything.**

## Current build status

**Latest source:** `v0.6.20-dev` on the single `main` branch. **This is not a new executable.** The prior Linux alpha candidate is unaccepted and no longer reflects current source.

Federal Electric is now being developed as a **standalone Linux game**, with Windows and macOS possibilities later. The previous GitHub Pages/browser distribution is **not the current supported build**; do not treat the old Pages link as the updated game. The new source has not yet completed its full packaged Electron regression run.

Each distinct source slice increments the patch number: 0.6.6 added Home, 0.6.7 the M-key map, 0.6.8 personal storage, 0.6.9 housing, 0.6.10 source regression checks, and this 0.6.11 documentation refresh and 0.6.12 venue scaffolding. Packaging stays manual-only. Candidate validation, acceptance, commit/tag and release are separate steps.

## The world and the clock

Washington begins in **January 1890**, not 1938. The numbered campaign spans **372 turns**, four playable Business Days per month from January 1890 through September 1897. Each playable turn has a **60-minute Business Day** and **60-minute Washington Night**. The clock does not progress offline, and pausing blocks gameplay information and actions. Production, markets, scheduled racing and opportunity windows continue while the player is active elsewhere.

The **1893 World's Fair in Washington** is a deliberate alternate-history event; in the real world it was hosted in Chicago. Later technologies and 1930s media assets remain in the project as legacy/future-period resources. Period gating and comprehensive historical conversion are still in progress, so not all inherited gameplay content has been verified for the 1890 start.

## Factory, markets and contacts

Federal Electric remains the company. Its electrical-lighting factory has contracts, negotiation, production lots, graded finished stock, warehouse raw materials, delivery deadlines, employee conditions, weather and power interruptions, and delegation groundwork. Producing finished goods does **not** automatically ship them to customers.

The fictional Federal Exchange contains 50 securities with evolving quotations, a personal portfolio and corporate histories. Company Cash and Personal Cash stay separate. Trade and gambling decisions should not silently spend company funds.

The Metropolitan Ledger, Contacts, Journal, and pastimes introduce information that may be incomplete, misleading, delayed or disputed. Separate social groups should eventually know different facts rather than exposing one global omniscient reputation score.

## Getting around Washington

The city registry contains **12 editable numbered map pins**, currently using a temporary later-era Washington illustration. The map positions are **display coordinates, not surveyed road distances**.

Press **M** to open or close the Washington map. Closing it should return you to the room or game interface you were using, **without moving your character**. Selecting **Go There** enters that location's current placeholder room; when you are already there, the Go There action is hidden. Real route durations and transport costs remain unfinished. **Go There currently performs clearly labeled provisional direct movement**, saving origin and destination but charging no invented time and leaving any owned transport behind.

Among the pinned locations are the Ivy City factory, Star Club, Capital Race Grounds, Neighborhood Game, Commerce Club at the Washington-Hoover hangar, Embassy Room, Old Chinatown, Russian Trade Hall, fairgrounds, Capitol Airport, University of Maryland and **Our Home**.

**Pin 12: Our Home** is a proposed modest Capitol Hill rowhouse near Eastern Market, with separate Front Room, Bedroom, Kitchen and Household Storage. It has a basic Household Register. The starting home's rental/ownership terms are **undetermined**, not assumed. More expensive townhouses, city mansions, estates, household staff, door service and better amenities are designed as later progression, **not currently purchasable**.

## The paper doll and belongings

Press **P** for the original approved paper-doll image at `assets/artwork/characters/paperdolls/paperdoll.png`. Press P again, Escape or its X to close it. Its **eight illustrated slots** are shirt, trousers, shoes, left ring, right ring, pocket watch, left pocket and right pocket. The illustration is currently fixed; clothing changes and wearable effects have not yet been implemented.

Each pocket opens its own small, initially empty container window. Personal effects have separate per-profile storage records. Household belongings are readable only in the Home Storage room. The code does **not** create fictional identification documents or assume players carry wallets or passports. Capacity, picking up and placing items, dressing and vehicle ownership need further systems.

## Gambling, sport and social life

Existing gameplay includes horse/dog/midget-car racing, boxing, three social poker circles, private prizefights and other underground leads. These earlier modules are **not yet fully converted** to the final 1890 Washington geography or alternate-city gambling laws.

**Planned alternate-Washington policy:** only specifically licensed wagers/games are legal; private poker, unauthorized house games and prohibited animal contests remain underground. **The exact approved card-game list is not settled.** Baccarat / chemin de fer, seen in *GoldenEye*, is a candidate for a permitted game, **not a poker variant**. Five-card poker, roulette and blackjack are candidates for restricted backrooms pending rules decisions.

Venue opportunity records and **location checks for existing wagering and club actions** now require the player to reach their proper rooms. Specific invitations, time windows and outcomes still matter. The future casino game list remains undecided. Chinese-American characters should be individuals with specific relationships and stories; cricket-fighting has historical Chinese traditions, while proposed beetle and snake contests require further period and cultural research. No encounter, invitation or location exclusivity should be falsely described as implemented before its gameplay exists.

## Three lives in one Washington (future direction)

The existing businessman/tycoon remains the only playable starting character. Profile creation now previews two **future** protagonists: a police/private-investigator route and a criminal/outlaw route. An optional darker thriller branch has not been agreed as mandatory gameplay. They would inhabit the **same city registry and setting**, each with separate personal knowledge, contacts and forward-moving autosave. The two unplayed character archetypes now have an early **autonomous background career simulation**: stable, saved branches can generate occasional public newspaper reports. They cannot yet be selected as the player's own story. Read [character routes design](CHARACTER-ROUTES-DESIGN-2026-10-21.md).

## Possible institutional venture: Blackwood Asylum

A new, **planning-only** prospect proposes integrating the earlier Victorian-era asylum management concept as a separate Washington institution. Buying a controlling interest, investing as a minority shareholder, or running it as an appointed superintendent are possible future paths, subject to governance research. A read-only Info entry and empty per-profile institutional ledger exist; **there is no playable asylum acquisition, staff, patient or treatment management yet**. The separate Soviet Moroz Asylum concept is not being transplanted unchanged into 1890. See [Asylum integration design](ASLYUM-INTEGRATION-DESIGN-2026-10-21.md).

## Personal mobility and persistent consequences

**Implemented groundwork:** owned horses/carriages have individual, per-profile records for their last known locations, conditions and statuses. New profiles start with **no owned horse or carriage**. An Info register shows recorded assets. **Design direction:** a horse, hired ride or purchased carriage exists at a physical location. The horse must not appear beside you simply because you traveled elsewhere. If you tie it up, leave it in a stable, lose it or have it stolen, its recorded position and status matter. Any wandering, theft and recovery rules will be implemented as explicit saved events, **not spontaneous resets**.

Travel will eventually offer walking, riding and carriage options, each with measured routes, conditions and different time costs. **Historic distances and duration models have not yet been verified or enabled.**

**Autosave is the only normal progression mechanism.** Card-room bypass clicks have been removed, and played poker now uses saved one-use, stake-reserving sessions. Significant outcomes should save immediately. A player must not be offered a GTA V-style load-any-earlier-save function to reroll a losing bet, arrest, theft or other irreversible result. Up to three independent player profiles currently exist, each with its **own single evolving autosave**, not a menu of rollback checkpoints. Locally stored files remain editable by someone determined to tamper with them; this is a design and normal-play integrity rule, **not an anti-tamper guarantee**.

## Play and test status

The source is developed for local Electron/Linux. No new packaged executable is available for this development source. When the next candidate is authorized, the manual workflow will package a Linux directory archive, perform Electron startup/smoke checks and publish the resulting binary plus SHA-256 to a **private, unaccepted draft**, not a public final release.

For developers with the repository and Node installed:

```bash
npm run test:source
npm run prepare:runtime
npm run audit:artwork
npm run audit:offline
```

The source suite verifies registry, personal storage and housing contracts. Packaged runtime checks are separate and have **not yet passed for this candidate**. Packaging remains manual; GitHub pushes do not trigger new executable builds.

## Next steps and project records

Work ahead: survey Washington road distances, legal-versus-illicit activity venue gates, persistent horses/carriages, approved travel time/cost rules, irrevocable-event autosaves, richer room layers, historically researched housing prices and staff, dress etiquette and character-specific reputation.

Detailed specifications and decisions live in [Roadmap](ROADMAP.md), [World rules and opportunity design](WORLD-RULES-2026-10-21.md), [Blackwood Asylum integration](ASLYUM-INTEGRATION-DESIGN-2026-10-21.md), [character routes](CHARACTER-ROUTES-DESIGN-2026-10-21.md), [1890 conversion brief](DESIGN-1890-CONVERSION-2026-10-21.md), [Historical notes](HISTORICAL-NOTES.md), [Design decisions](DECISIONS.md), [Artwork organization](assets/artwork/README.md) and the [build snapshots](BUILD-SNAPSHOT-2026-10-07.md). Older snapshots preserve historical status; their version numbers and 1938 assumptions are not the current development state.

**Federal Electric is the company you own. Washington is the world you inhabit.**
