# Capital & Consequence

> **CURRENT DEVELOPMENT HANDOFF:** [October 23 thread-end handoff](HANDOFF-2026-10-23-THREAD-END.md). This is the authoritative next-thread starting point, including v0.6.58 source status, tests, all four protagonists, Hillsdale-only on-duty patrol, approved 1878 factory roadmap and open risks. **Older milestone sections below are preserved as history, not necessarily current gameplay.**

**Current source: v0.6.63-dev · Playable District Asylum orderly rounds for Edmund Wardman · October 23, 2026**

**Latest packaged candidate: v0.6.34 Linux x64 · private draft, built and smoke-tested, NOT accepted.**

**New-thread continuation:** [October 23 handoff](HANDOFF-2026-10-23-THREAD-END.md) supersedes [the October 22 historical handoff](HANDOFF-2026-10-22-THREAD-END.md). Current source is **v0.6.63-dev**; a cross-location journey still carries a provisional one-hour in-game charge. No v0.6.58 executable has been packaged.

> **One city. Countless lives. Every choice has consequences.**

**Live an ordinary or extraordinary life in alternate-history Washington, D.C., in the late nineteenth century.**

**Approved future campaign opening: January 2, 1878.** Federal Electric's earliest products will be **electrical and telegraph components**, not mass-produced light bulbs. A working component business and its customers must come first. Later, technological advances, manufacturing investment, and possible patent or licensing arrangements allow incandescent lamp production. The **1893 alternate-history Washington World's Fair** offers a major contract to supply fairground bulbs and a possible front-page Metropolitan Ledger story if awarded; only **afterward** does a separate opportunity to compete for a modernized D.C. streetlighting contract arise. Washington's earlier 1880s electric **arc** streetlights are historically distinct from ordinary incandescent lamps. The actual 1893 World's Columbian Exposition took place in Chicago.

**Implementation status:** This is an **approved roadmap direction only**. Current game code still opens campaigns in **1890**, and current early factory production is not yet rebuilt around 1878 component manufacturing. The full [1878-to-fair progression and Russian-language NPC requirements are on the roadmap](ROADMAP.md).

**Capital & Consequence is a Washington-first historical life simulation.** Federal Electric is the business owned from day one by **Charles “Charlie” Whitcomb**, one of four starting protagonists. The police patrolman, nightclub doorman and asylum orderly have their own desks and lives; the city keeps moving regardless of who is selected.

You buy materials, negotiate contracts, run the factory, trade stocks, manage company money, follow the newspaper, make contacts, attend races and fights, sit in poker rooms, and decide how much of your limited day you are willing to spend away from the business.

**The important part is that you cannot do everything.**



**Character detail:** [Samuel Harlan's permanent character codex](CODEX-SAMUEL-HARLAN-2026-10-23.md).

**Character detail:** [Eli Crowe’s permanent character codex](CODEX-ELIAS-CROWE-2026-10-23.md).

**Proposed local story (not active gameplay):** A specific drug/contraband smuggling ring with some corrupt police protection may operate through Chinatown. Sam can find leads as a civilian off duty, but his official assignment stays Hillsdale. The captain may or may not be involved in any given campaign. The truth, witnesses, money trail and consequences will be simulated in future Washington-only slices, with no assumption that Chinatown residents as a whole are criminals. See [Sam's codex](CODEX-SAMUEL-HARLAN-2026-10-23.md) and [roadmap](ROADMAP.md).

## v0.6.63-dev · Edmund Wardman's first paid asylum work

Edmund can now **receive ordinary tasks at District Asylum's restricted orderly station, perform service in the authorized patient ward, return to write a report, and earn a modest wage only on filing**. Routine assignments include supplies, linens, meal assistance, access clearance and visitor directions. One assignment requires 5 minutes for scheduling, 10 for ward care, and 5 for filing, using the existing saved game clock and normal autosave. At most three complete assignments pay per date, with **provisional $0.35 per assignment**, no infinite wage repeats, and records preserved across loading. Staff entry rights do **not** grant access to the superintendent's office or management accounts. His brother's name, institutional finances, staffing dynamics, historical medical practice, promotions and career advancement are still unfinished. This does not change the 1890 source-era starting year or launch an executable.

## v0.6.62-dev · Historic component factory transaction foundation

The source now includes an **independent, testable 1878 factory engine** for Federal Electric's initial telegraph and electrical components. It maintains company funds, raw materials, separate finished warehouse stock, explicit customer contracts and transactional ledgers in integer cents/units. Assembly consumes validated materials and records production minutes; accepting a shipment credits customer payment only once. The starting 1878 component catalog prevents ordinary early incandescent manufacture and requires later technology/license/machinery gates. Existing 1890 bulb saves continue using the old factory until a separately tested migration and full UI/time integration are ready. These product recipes, costs and customers are provisional, not historically authenticated. Source only, no executable. See [1878 works foundation](COMPONENT-WORKS-1878-FOUNDATION.md) for boundaries.

## v0.6.61-dev · No imaginary translation for Russian conversations

A resident must genuinely share a spoken language with another resident to exchange private rumors or have a meaningful conversational social encounter. **Alexi Rurik remains Russian-only**; most existing English-language residents therefore cannot pick up his testimony. **Pavel Orlov** has the provisional English/Russian fluency consistent with his established public English trade remarks and Russian merchant background, making him a possible real intermediary. Fluency is an explicit validated characteristic of character definitions. No player interpretation, automatic interpreter hire, player language-learning system, or translated witness deposition exists yet. Existing authored Russian lines remain Russian. The city retains its own access rules; conversations and confidential claims are never imported from omniscient case truth. Source tests demonstrate incompatible speech blocks rumors, compatible speech permits human-level conversation, and silence never creates evidence.

## v0.6.60-dev · Residents can meet, remember, and change their opinions

NPCs who **actually occupy the same authorized Washington room** during a reached period can now have a bounded deterministic conversation, minor disagreement or mutual assistance. One encounter per participant per period at most. The event, mutual relationship change, and each person's private memory persist in the profile's NPC simulation; the planner may recognize accumulated social experience on future decisions. Reopening a room, reloading a saved period, or pausing cannot reroll a meeting or award repeated affinity. No NPC instantly learns a hidden plot or remotely knows others' private schedules. The contact topic Ask About Today can now acknowledge a same-date interaction without revealing the partner or a confidential detail. This is foundational emergent social behavior, not a claim of unlimited AI conversations or active protagonist-to-protagonist missions. Source tests exercise relationship persistence, co-room constraints, per-period caps and memory privacy.

## v0.6.59-dev · NPC decisions reach actual Washington destinations

The first situation-aware NPC movement extension turns a resident's saved utility-selected goal into a **preference for an accessible Washington location** during genuinely personal activity. Alexi Rurik can pursue legal courier contacts at Russian Trade Hall or make independent community visits; merchants, staff and city contacts have distinct work/social priorities. Employment shifts, paid races, rest, private doors and location availability cannot be overwritten by an intention. The existing 26 city locations and all save IDs remain stable. Direction remains deterministic, local to the active campaign, and only advanced upon an observed NPC clock period. It is not freeform language-model AI or an accurate simulation of street-by-street travel time. Automated source QA covers access, idempotence and independence from work payments.

## v0.6.58-dev · Sam Harlan's Hillsdale-only beat and off-duty freedom

**Washington-first correction (October 23, 2026):** The historically known neighborhood previously displayed as **Barry Farm** is now displayed in the game as **Hillsdale**, including its location pin and street room. Its original registry ID, `hillsdale`, remains unchanged to preserve earlier profiles and map records. **Barry Farm** remains an alternate historical place-name in the descriptive text only.

**Sam's police assignment is Hillsdale and nowhere else.** At his Metropolitan Police duty-room desk he **clocks in** for the foot beat. While marked **on duty**, the game lets Sam travel to **Hillsdale** for routine patrol activities and back to **Metropolitan Police** for reports. On-duty travel to **Chinatown**, other neighborhoods, private clubs, and other unrelated destinations is blocked through both map travel and direct room entry. Police incident actions themselves are available only in Hillsdale.

After **clocking out at the station**, Sam is a **civilian free to go to Chinatown and other open Washington locations** under their ordinary access rules. The city, including Chinatown, has **not** been globally restricted. Other playable characters and autonomous NPCs retain their normal city access. The on/off-duty flag is stored with Sam's patrol ledger in his own autosave; previously saved patrol ledgers default safely to **off duty** when loaded.

For older saved patrols with an unresolved Chinatown police incident, the station duty book provides **Refer Former Chinatown Assignment to Sergeant**. This preserves its original details as **transferred**, not resolved, without pretending he can work the old beat today. Already handled encounters waiting for a written station report remain fileable. No police authority is gained by visiting a neighborhood as a civilian.

This narrows the earlier two-beat `v0.6.56` prototype; that older implementation is historical, **not a current player assignment**. All four protagonists keep their established identities and roles. Washington-only scope and the unimplemented 1878 component-factory conversion remain unchanged.

## v0.6.57-dev · Eli Crowe’s first paid nightclub shifts (October 23, 2026)

**Elias “Eli” Crowe is still a nobody, not a mob boss or a nightclub partner.** The player begins the criminal/doorman career physically at the registered nightclub **Doorman’s Station**, a restricted staff area within the currently provisionally named **Second Nightclub**. The proprietor’s office is off-limits and the proprietor’s **name remains undecided**; do not insert any earlier speculative name as established canon.

During **Washington Night**, Eli can spend **10 charged in-game minutes** watching the door and draw a deterministic visitor situation. The player chooses how to respond over **5 more charged minutes**. Encounters include an uninvited visitor, delivery, crowded entrance, mistaken address and impatient patron. Completing a duty segment earns **$0.30 in provisional game-balance wages**, credited **once** to personal cash and recorded in a profile-local pay ledger. Four completed segments are available per night ($1.20 maximum), with no infinite wage farming from repeated clicks or save reloading. Pending visitors and prior work survive autosave and date changes. Each duty action is physically gated to the nightclub staff post, with the public club room and proprietor office remaining separate and properly permission-checked. His personal desk contains his shift ledger and earned income; **Enter Current Location** on every career desk opens the exact currently saved workroom.

This is **actual playable groundwork**, not full historically researched nightclub wages, a comprehensive 1878 shift calendar, a permanent role as criminal, an NPC-run employer economy, or a free-standing club management game. Eli may still leave and pursue ordinary city activities in his free time. The real 1878 component-factory start, the world clock upgrade, Sam’s advancement, and Edmund's asylum duties remain separate Washington-first milestones. The 1890 start persists for newly created profiles until the factory conversion is validated.

## v0.6.56-dev · Samuel Harlan's first walking-beat duties (October 23, 2026)

This **Washington-only gameplay slice** adds a real action loop for **Samuel “Sam” Harlan**, the rookie Black patrolman. A new patrol profile begins at the **Metropolitan Police patrolmen's duty room**, not in a detective office. The restricted duty room has a personal desk for paperwork; the public station entrance retains its old internal ID for save compatibility. The sergeant's office is restricted to higher authority.

Sam can travel on the existing Washington map to the **Barry Farm** or **Chinatown** neighborhood streets, spend **10 charged game minutes** walking one beat segment, and receive one deterministic routine encounter. Encounters include wagon obstructions, street disputes, found property, noise complaints and requests for directions. The player chooses a proportionate response, spends **5 minutes** handling it and must return to the **actual station duty room** to spend **5 more minutes** filing a report. An appropriate ordinance summons is a **police record**, not a personal cash reward. Nighttime station paperwork is permitted, but new street patrol circuits begin during the business/day phase of the current prototype.

**Persistence and simulation rules:** All patrol actions go through the existing game clock, stop when insufficient time remains, and autosave into the active protagonist's profile; an unresolved encounter remains pending across travel, reload and day changes, cannot be rerolled or double-filed, and reports enter the journal only after the report has been written. Encounter choices and outcomes are explicitly scripted groundwork, **not claims of fully autonomous criminal behavior or verified real historical 1878 ordinances**. No automatic arrests, rank increase, detective powers, officer salary, real geographic patrol route or NPC victim events are implemented by this slice. Future work: beat boundaries, realistic pay and shifts, witnesses and citations, racial discrimination grounded in time/location, promotions, earned case assignments and dynamically caused street events. The original detective-case engine remains disconnected from the rookie patrol desk.

All four career IDs, Charles Whitcomb's company ownership, Edmund Wardman's position, Eli Crowe's doorman work, Alexi Rurik's autonomy, the district-republic background and existing save data remain unchanged.

## Active development scope · Washington first (October 23, 2026)

The **only active gameplay-development area is Washington, D.C.**: its 26 registered locations and rooms, four playable careers, residents, local institutions, business, patrols, the asylum, criminal life, autonomous NPC movement and the historical 1878 electrical components economy. The reimagined United States of functional districts exists as **setting and future roadmap**, but its borders, national map, cross-country travel, government mechanics and economies are deferred. Districts elsewhere may be mentioned in newspapers, commercial contracts and NPC histories without becoming visitable regions.

**Alternate history tone:** Familiar nineteenth-century Washington and American history with deliberate, coherent differences. The intended feel is an alternate reality, *similar but not the same*, not an exact historical simulator. The *Rick and Morty* analogy refers to this difference in worldbuilding, not characters or a crossover. See [the active Washington-first roadmap](ROADMAP.md#active-development-scope--washington-first-decision-of-october-23-2026).

## The alternate United States of Districts · v0.6.55

**World canon:** The real American Civil War was fought **1861–1865**. **After** that war, this fictional United States eliminated its former states and their old borders, then reorganized into **purpose-based federal districts** intended to supply the nation's collective needs. The war dates are historical; the political reorganization is our **alternate history**. Its exact enactment date, district borders, final names and constitutional structure are not yet established.

The concept begins with an **Agriculture & Husbandry District**, the nation's breadbasket for grain, livestock and food. Working counterparts include the **Foundry**, **Mineral**, **Timber**, **Maritime**, **Transport** and **Commerce** districts. These are **temporary descriptive names**, not finalized names or an approved new map. **Washington, District of Columbia** remains the federal seat of government and our first playable city. No old state border serves as an automatic new district boundary.

The live **Capital & Consequence** title menu displays the motto **“One city. Countless lives. Every choice has consequences.”** and an accessible **District Register** that describes the current national charter. The register is information only: no fictitious nationwide travel, economics, voting or border geography are presented as playable. These are **national districts**, distinct from the game's **26 Washington map pins**, each of which belongs to a local location with rooms.

The future political career must use an internally coherent postwar district constitution and representation system, not the unchanged real-world state-based electoral system. The original **Federal Electric** remains Charlie Whitcomb's small owned business. The approved **1878 component-manufacturing start** is still planned; current prototype new saves use **1890**.

## Canonical four lives

- **Charles “Charlie” Whitcomb, businessman:** owns the **Federal Electric** company from his first day. Electrical **component** manufacture at the proposed 1878 opening is the approved future conversion; current manufacturing mechanics remain earlier prototype lighting systems.
- **Samuel “Sam” Harlan, patrolman:** a Black rookie walking his beat, issuing routine tickets, answering calls, and finishing reports at his desk. Investigations and rank advancement must be earned. The previously prototyped detective casebook is disconnected from rookie desk presentation.
- **Elias “Eli” Crowe, nightclub doorman:** earns wages at the door while his boss barely knows he exists. His off-duty choices can lead to legitimate work or the criminal underworld.
- **Edmund Wardman, asylum orderly:** the wealthy Wardman family's black sheep, deliberately assigned an undesirable orderly job by his brother, who runs **District Asylum**.

Every protagonist retains a personal desk and a separate autosave. **Alexi Rurik** is a Russian-speaking-only **autonomous NPC**, never a fifth playable protagonist.

**Implemented in this source slice:** all **26** map destinations have visual pins, including **12 explicitly provisional placements** that still need historically appropriate coordinates; per-type location filtering; staff and restricted-room entry checks; saved independent NPC shift wages/household charges, occasional gambling and room-level visits; a Russian-only named resident with simple authored Russian conversation. **Not implemented:** the 1878 component conversion, minute-resolution NPC travel, fully autonomous crime, complete four-career duties, the fair's contract chain, political career, and a synchronized city across saves. No executable produced or personally play-tested.

## Current build status (verified at October 23 thread close)

**Current source:** `v0.6.58-dev` on the single `main` branch. The last code version was tested at commit `99ab704ed8978fd78bc5edbe879b0264d56db6af` by [successful GitHub source QA run 39962299550](https://github.com/dereksparks1982/capitalconsequence/actions/runs/39962299550): **424 source-contract checks** and the other configured behavior suites. The subsequent latest docs-only commit at handoff was `d3b72c2d033f238964e1367b6abb492441544973`. See the [current handoff](HANDOFF-2026-10-23-THREAD-END.md) for successor documentation commits.

**Latest private Linux executable candidate:** `v0.6.34` (not accepted as a release). **No v0.6.58 Linux desktop executable has been built, manually tested, accepted, tagged, or published.** `.github/workflows/linux-build.yml` remains manual-only. The old Federal Electric browser/Pages distribution is not the live product.

**Latest scope:** Washington, D.C., and four independent character profiles. Sam's sole **on-duty Hillsdale** patrol supersedes the prior two-beat prototype, Eli has a provisional paid doorman loop, and Edmund's orderly career remains mostly a foundation. The **1878 component-first factory** is an approved but unimplemented conversion; the current code starts in **1890** with bulb production. Future nationally defined districts are setting background, not current gameplay.

## The world and the clock

The setting is **late nineteenth-century Washington**. The **approved design target** for new campaigns is **January 2, 1878**, but the **working prototype still starts January 2, 1890** with older bulb-first production and a 372-turn, 60-minute Business Day / 60-minute Washington Night framework. A persisted 24-hour calendar **bridge** now exists but has **not** replaced the old clock as the gameplay authority. No offline time passes. See the [latest thread handoff](HANDOFF-2026-10-22-THREAD-END.md) for the migration plan.

The **1893 World's Fair in Washington** is a deliberate alternate-history event; in the real world it was hosted in Chicago. Later technologies and 1930s media assets remain in the project as legacy/future-period resources. Period gating and comprehensive historical conversion are still in progress, so not all inherited gameplay content has been verified for the 1890 start.

## Factory, markets and contacts

Federal Electric remains the company. Its electrical-lighting factory has contracts, negotiation, production lots, graded finished stock, warehouse raw materials, delivery deadlines, employee conditions, weather and power interruptions, and delegation groundwork. Producing finished goods does **not** automatically ship them to customers.

The fictional Federal Exchange contains 50 securities with evolving quotations, a personal portfolio and corporate histories. Company Cash and Personal Cash stay separate. Trade and gambling decisions should not silently spend company funds.

The Metropolitan Ledger, Contacts, Journal, and pastimes introduce information that may be incomplete, misleading, delayed or disputed. Separate social groups should eventually know different facts rather than exposing one global omniscient reputation score.

**Russian-speaking Washington:** The planned NPC population will include **at least one resident who speaks only Russian**, so interviews, negotiation, and daily exchanges may require language learning or a real interpreter. He will be a fully original, historically plausible Russian immigrant with the morally complex, guarded, loyal-or-dangerous character depth associated with Niko Bellic (who is **Serbian**, not Russian). His 1878 story will not copy Niko's twentieth-century background. Russian Trade Hall and period-appropriate Imperial Russian connections remain in the setting. This is planned, **not yet operational multilingual dialogue AI**.

## Getting around Washington

The city registry contains **26 editable numbered map pins**, currently using a temporary later-era Washington illustration. The map positions are **display coordinates, not surveyed road distances**.

Press **M** to open or close the Washington map. Closing it should return you to the room or game interface you were using, **without moving your character**. Selecting **Go There** enters that location's current placeholder room; when you are already there, the Go There action is hidden. Verified route durations and transport costs remain unfinished. **Go There now charges a configurable provisional 60 in-game minutes between distinct locations** through the saved calendar bridge; transfers between rooms at the same site cost zero. This is a gameplay placeholder, not a claimed surveyed journey. The legacy gameplay countdown remains active until the full calendar migration. Travel records retain origin/destination, and owned transport stays where left.

Among the pinned locations are the Ivy City factory, Star Club, Capital Race Grounds, Neighborhood Game, Commerce Club at the Washington-Hoover hangar, Embassy Room, Chinatown, Russian Trade Hall, fairgrounds, Capitol Airport, University of Maryland and **Our Home**.

**Pin 12: Our Home** is a proposed modest Capitol Hill rowhouse near Eastern Market, with separate Front Room, Bedroom, Kitchen and Household Storage. It has a basic Household Register. The starting home's rental/ownership terms are **undetermined**, not assumed. More expensive townhouses, city mansions, estates, household staff, door service and better amenities are designed as later progression, **not currently purchasable**.

## The paper doll and belongings

Press **P** for the original approved paper-doll image at `assets/artwork/characters/paperdolls/paperdoll.png`. Press P again, Escape or its X to close it. Its **eight illustrated slots** are shirt, trousers, shoes, left ring, right ring, pocket watch, left pocket and right pocket. The illustration is currently fixed; clothing changes and wearable effects have not yet been implemented.

Each pocket opens its own small, initially empty container window. Personal effects have separate per-profile storage records. Household belongings are readable only in the Home Storage room. The code does **not** create fictional identification documents or assume players carry wallets or passports. Capacity, picking up and placing items, dressing and vehicle ownership need further systems.

## Gambling, sport and social life

Existing gameplay includes horse/dog/midget-car racing, boxing, three social poker circles, private prizefights and other underground leads. These earlier modules are **not yet fully converted** to the final 1890 Washington geography or alternate-city gambling laws.

**Planned alternate-Washington policy:** only specifically licensed wagers/games are legal; private poker, unauthorized house games and prohibited animal contests remain underground. **The exact approved card-game list is not settled.** Baccarat / chemin de fer, seen in *GoldenEye*, is a candidate for a permitted game, **not a poker variant**. Five-card poker, roulette and blackjack are candidates for restricted backrooms pending rules decisions.

Venue opportunity records and **location checks for existing wagering and club actions** now require the player to reach their proper rooms. Specific invitations, time windows and outcomes still matter. The future casino game list remains undecided. Chinese-American characters should be individuals with specific relationships and stories; cricket-fighting has historical Chinese traditions, while proposed beetle and snake contests require further period and cultural research. No encounter, invitation or location exclusivity should be falsely described as implemented before its gameplay exists.

## Four lives in one Washington (historical implementation notes)

**CURRENT OVERRIDE:** Read [October 23 handoff](HANDOFF-2026-10-23-THREAD-END.md) and [canonical four lives](#canonical-four-lives) for the accurate names/occupations. The following section describes earlier stages when Patrolman, "Layman" and Wardman were desk-only previews. Sam and Eli now have limited playable work loops.

**Businessman, Patrolman, Layman and Wardman** are selectable starting profiles, with independent autosaves and access to the common Washington map, public locations, Journal and basic personal desk. **Only Businessman has a fully implemented profession-specific career**: the Federal Electric factory, contracts, payroll and treasury. Patrolman (police), Layman (ordinary civilian with optional criminal paths), and Wardman (institutional career) remain **early playable desk/city foundations**, not complete simulations of their professions.

The investigator and civilian/underworld counterpart already have modest autonomous background lives with profile-stable progress, locations and selected newspaper dispatches. The Wardman counterpart now has an **early autonomous institutional-life arc** as well, including per-profile seeded branches and place visits, but none of the three unplayed careers is yet a deep autonomous human simulation. Seven additional persistent Washington residents have schedule foundations, firsthand in-room conversations, limited relationship memory and private rumor records. These are **rule-based systems, not generative artificial intelligence**. Future protagonists share one Washington *inside a single save*; separate saved profiles are not synchronized worlds. See [character routes design](CHARACTER-ROUTES-DESIGN-2026-10-21.md).

## Earlier asylum-investment concept: Blackwood (superseded naming)

**CURRENT OVERRIDE:** The approved fictional playable institution is **District Asylum** under Edmund Wardman's unnamed brother. Its internal location key stays `blackwoodAsylum` only for compatibility. The description below preserves an earlier investment/ownership brainstorm, not the current institution's name or implemented ownership.

A new, **planning-only** prospect proposes integrating the earlier Victorian-era asylum management concept as a separate Washington institution. Buying a controlling interest, investing as a minority shareholder, or running it as an appointed superintendent are possible future paths, subject to governance research. A read-only Info entry and empty per-profile institutional ledger exist; **there is no playable asylum acquisition, staff, patient or treatment management yet**. The separate Soviet Moroz Asylum concept is not being transplanted unchanged into 1890. See [Asylum integration design](ASLYUM-INTEGRATION-DESIGN-2026-10-21.md).

## Personal mobility and persistent consequences

**Implemented groundwork:** owned horses/carriages have individual, per-profile records for their last known locations, conditions and statuses. New profiles start with **no owned horse or carriage**. An Info register shows recorded assets. **Design direction:** a horse, hired ride or purchased carriage exists at a physical location. The horse must not appear beside you simply because you traveled elsewhere. If you tie it up, leave it in a stable, lose it or have it stolen, its recorded position and status matter. Any wandering, theft and recovery rules will be implemented as explicit saved events, **not spontaneous resets**.

Travel will eventually offer walking, riding and carriage options, each with measured routes, conditions and different time costs. **Historic distances and duration models have not yet been verified or enabled.**

**Autosave is the only normal progression mechanism.** Missing or unreadable existing profile autosaves are protected from the five-second save timer; opening the affected profile displays an explicit recovery warning without overwriting its bytes. Card-room bypass clicks have been removed, and played poker now uses saved one-use, stake-reserving sessions. The Info tab includes a confirmed resolution for a session interrupted by a crash: undealt reservations can be canceled, while played-but-unsettled sessions forfeit their stake. Significant outcomes should save immediately. A player must not be offered a GTA V-style load-any-earlier-save function to reroll a losing bet, arrest, theft or other irreversible result. Up to four independent player profiles currently exist, each with its **own single evolving autosave**, not a menu of rollback checkpoints. Locally stored files remain editable by someone determined to tamper with them; this is a design and normal-play integrity rule, **not an anti-tamper guarantee**.

## Play and test status

The source is developed for local Electron/Linux. The v0.6.32 test candidate is available as [Federal-Electric-0.6.32-linux-x64.tar.gz](https://github.com/dereksparks1982/federalelectric/releases/download/untagged-01b2835c3de880bb6251/Federal-Electric-0.6.32-linux-x64.tar.gz) with its [SHA-256 file](https://github.com/dereksparks1982/federalelectric/releases/download/untagged-01b2835c3de880bb6251/Federal-Electric-0.6.32-linux-x64.tar.gz.sha256). The package and accompanying checksum were verified in the private GitHub Actions build. The earlier v0.6.25 draft remains available separately. This is a **private, unaccepted draft**; the game has not been approved for final release.

For developers with the repository and Node installed:

```bash
npm run test:source
npm run prepare:runtime
npm run audit:artwork
npm run audit:offline
```

The source suite verifies the city registry, room travel contracts, personal storage, housing, mobility, autonomous story progression, save-model contracts, disk mirror, and deterministic event queue. The authorized v0.6.32 candidate **passed** source, packaged-runtime, and launcher smoke checks in GitHub Actions. The transient one-time v0.6.32 request workflow was removed afterward; source pushes trigger **source-only QA**, not an executable build. Linux packaging remains manual-only. Real-player review and acceptance are still outstanding.

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

- **v0.6.29 · Map navigation safety:** A historically future or otherwise restricted map location gives an explanatory message, rather than a dead Go There action. City-room setup is validated before committing the player's location, and failed entry restores the previous position instead of saving a phantom visit. A new packaged-Electron smoke check exercises Commerce Club, Chinatown, and the 1893 World's Fair gate. **The packaged navigation check passed in the private v0.6.32 Linux candidate.**
- **v0.6.30 · Save failure visibility:** Catches localStorage write failures such as quota exhaustion. A persistent on-screen error banner says explicitly that recent progress was not saved. A failed write never reports success.
- **v0.6.31 · Atomic file mirror foundation:** A sandboxed Electron preload bridge lets the main process keep a profile-scoped file copy of successful localStorage autosaves in the application's private user-data folder. File writes use temporary files and renames; a private previous copy exists for corruption recovery. Legacy localStorage is **still the loading authority**; automatic recovery from these disk copies is future work, not implemented. An explicitly deleted profile also schedules removal of its mirror. This slice does not yet remove the browser storage capacity limit.
- **v0.6.32 · Shared-clock foundation:** Adds an engine-independent `world-clock.js` implementation of absolute calendar minutes and a deterministic priority queue of scheduled events. The queue can advance by an activity's duration and execute intervening events in order, including events caused by other events. Serialized world-clock state can be reopened without advancing time offline. **This clock is not yet the authoritative gameplay clock**; the existing day/night timer and seven-character schedule slice remain active during the transition.

GitHub source QA checks are distinct from an actual Linux packaged-game test. The new **v0.6.32 packaged executable is an unaccepted private draft**, verified by the automated smoke suite and awaiting owner gameplay acceptance. Do not claim these newer features are play-tested until a new candidate passes the full smoke tests and the owner validates it.

### Remaining engineering priorities

1. Validate packaged navigation and file-save IPC end-to-end, then migrate profile loading from localStorage to atomic files with explicit recovery handling and backward compatibility.
2. Convert the new absolute-minute clock into the real game clock in carefully tested stages, keeping economy and manufacturing calculations consistent. Existing real-time hour-long turns must not be described as the new 24-hour model.
3. Use the shared clock and event queue for NPC decisions, investigations, relationships, and newspaper events. Apply saved random seeds across old minigames rather than allowing outcomes to reroll at reload.
4. Introduce GTA-style map pin category filters, only when existing movement and location access pass runtime tests.
5. Character-select menu, Star Club expansion, rare Drek encounter, and later historical events remain **design proposals**, not implemented gameplay.

## October 22, 2026: Drek, character paths and new menu (documented, not built)

**New intended title menu:** archive the existing office main menu and replace it with **text-only nineteenth-century styling, no pictures**. The three exact character choices are **Businessman, Patrolman, Layman**; **only Businessman playable** until the tycoon arc finishes. Menu date/time must be the **selected profile's saved in-game time**, never real-time Washington. Characters have gated careers but share gambling, bars, property, rivals, crimes and autonomous encounters within each separate world save.

**One Washington map across all years:** number-only pins by default; names on hover, keyboard focus, click or tap; Show All Names toggle default OFF; filters separate neighborhoods from government buildings and other types. The historic **Government Hospital for the Insane (St. Elizabeths later)** will be clickable with reception available from the start and deeper interiors gated. Barry Farm marker geography is provisional and no coordinates are being changed.

**Rare Drek arc:** Possible secret millionaire **Cornelius Wainwright III**, mansion **Wainwright House**, British butler **Mr. Pritchard**. Drek might be a benefactor, kingmaker behind Washington's elites, potential mentor/successor-maker or enemy of a rising Layman mob boss. Killing him as an apparent homeless stranger may prevent ever learning of his wealth or house. These are optional, branching possibilities, not fixed missions.

Full records: [Drek character codex](CODEX-DREK-WAINWRIGHT-2026-10-22.md) and [menu/routes/map/hospital design](DESIGN-MENU-MAP-ROUTES-2026-10-22.md). This change adds **documentation only**; no feature or build is complete and v0.6.32 remains unaccepted.


## v0.6.33 source: shared menu and four desks (owner requested)

- The old illustrated title office is no longer the **visible main menu**. A new text-first late-nineteenth-century menu contains a four-career selection, profile name form, up to four independent profile autosaves, existing-profile loading, and archived papers/options access. It reports the selected profile's **saved in-game date, phase, and time remaining**, not the current time in Washington, D.C. An unopened profile never advances off-screen.
- All four careers now have selectable **desktop/city foundations**: **Businessman** (green executive office), **Patrolman** (blue station desk), **Layman** (red private writing desk, not automatically a criminal), **Wardman** (cream institutional desk). The former illustrated office art is reused **inside Businessman gameplay**, not destroyed or regenerated. The other desk pictures are simple CSS placeholders.
- The Businessman retains the actual full factory, contracts, company treasury and tycoon route; all four can open the common map, Journal and walk through existing public city venues. The other three are explicitly **EARLY FOUNDATIONS**, not claims of completed police, civilian criminal, or hospital campaigns; factory tabs are blocked and hidden for those routes. Roles remain distinct after save/load and New Game, and legacy profiles remain Businessman.
- Existing map artwork, pin positions, NPC logic, artwork files, and business gameplay are not rewritten. The old interactive title scene is retained inside the Businessman's playable office for development migration. A more thorough refactor of title scene props, map filters, and the four-character autonomous simulation remains on the roadmap.
- The source and packaged smoke suite include four-role profile creation and restore checks. The v0.6.32 packaged draft is **still unaccepted**; v0.6.33 is a separate source/build candidate pending owner validation.


### v0.6.33 Linux candidate (verified in GitHub Actions)

- **[Download the Linux x64 tar.gz candidate](https://github.com/dereksparks1982/federalelectric/releases/download/untagged-b86b37b640e44455ddfc/Federal-Electric-0.6.33-linux-x64.tar.gz)**
- **[SHA-256 verification file](https://github.com/dereksparks1982/federalelectric/releases/download/untagged-b86b37b640e44455ddfc/Federal-Electric-0.6.33-linux-x64.tar.gz.sha256)**
- Private draft release: [Federal Electric v0.6.33](https://github.com/dereksparks1982/federalelectric/releases/tag/untagged-b86b37b640e44455ddfc).
- Verified GitHub Actions build: [run 39862944756](https://github.com/dereksparks1982/federalelectric/actions/runs/39862944756), completed **SUCCESS**. Source contracts, local artwork and offline audits, GCC double-click launcher, packaged Electron smoke (including Wardman profile create/reload, navigation, autosave mirror, and other existing regression checks), archive SHA-256 check and draft release asset sizes all passed.
- The Linux archive (~330 MB) remains a **candidate for owner testing**, not a published or accepted release. No release tag has been published. The build-request workflow was removed after success.


## v0.6.34 navigation regression fix: archive old office title

- **Old office title archived, never shown:** original interactive title-frame markup preserved unchanged in `archive/retired-office-title-2026-10-22.html`; original office artwork assets remain available in the Businessman's actual in-game desk. The existing old title DOM is retained only as an inert, hard-hidden compatibility scaffold while old audio/title handlers are removed in future refactoring. It is not an active menu or room.
- **Navigation repaired:** Step Away From Desk opens the location's room or the Washington map, not the illustrated title; the map now sits outside the title DOM and never reveals it; closing the map restores the visited room or current character desk; returning from a city room opens that character's personal desk, not a generic factory office; city rooms have a direct **Main Menu** button which opens only the modern neutral four-character menu.
- **All registered city room placeholders** use the same parchment, historical typography, simple border and neutral style as the four-character menu. No new artwork was generated and venue interactions, room identities, map coordinates and saved progress are retained.
- **No offline time progress:** the main menu blocks the simulated clock; the map remains a separate in-game overlay. The menu reads the saved profile's game date/phase rather than a real-world Washington clock.
- **QA:** source-only contracts now assert the retired title can never be painted and the map/dialog are detached; packaged Linux Electron smoke tests traverse desk → map → desk, generic city room → Main Menu, and confirm the hidden title is inert. Version 0.6.34 remains an **unaccepted candidate** pending owner testing.
- **Deferred:** slot machines, player-friendly gambling odds, map marker number-only labels, gold priority markers and difficulty-mode balancing are separate planned work, not silently bundled into this navigation fix.


### v0.6.34 private Linux candidate: confirmed successful

- **[Download v0.6.34 Linux x64 archive](https://github.com/dereksparks1982/federalelectric/releases/download/untagged-59128d984047199e6989/Federal-Electric-0.6.34-linux-x64.tar.gz)**
- **[SHA-256 checksum](https://github.com/dereksparks1982/federalelectric/releases/download/untagged-59128d984047199e6989/Federal-Electric-0.6.34-linux-x64.tar.gz.sha256)**
- [Successful GitHub Actions build and packaged smoke tests](https://github.com/dereksparks1982/federalelectric/actions/runs/39865269226), commit `d60e2fef63839aa2741ddf0d81ed99bb5e37f72d`.
- Private **draft** release (unaccepted): [v0.6.34 candidate](https://github.com/dereksparks1982/federalelectric/releases/tag/untagged-59128d984047199e6989). Source contracts, offline/artwork audits, launcher, room-return/navigation regressions, four-career saves, archive/checksum and upload all passed. The one-shot build requester was deleted. Owner must validate this executable before acceptance.


## v0.6.35-dev source slice · October 22, 2026

The map's Stockbroker pin 14 now has an in-room personal securities order desk. Trading requires the actual broker office or, after three separate dated visits, a telegram from the Federal Electric executive office. Saved relationships are per profile, one meeting per game date. Prior saves have no fictitious relationship. Brokerage trades use personal, never company, cash.

This is an initial brokerage slice: orders currently confirm immediately, pending a real message-delivery model. **The old 60-minute day/night countdown is still active** despite the requested 24-hour game clock; it must be migrated across market, NPC and factory systems before claiming the time redesign is complete. Period-accurate securities and broker tips remain future work. Godot experimentation is shelved. No new executable or release is authorized.


## v0.6.47-dev · Broker advisories (October 22, 2026)

On a real broker office visit, owners of shares receive a cautious assessment from publicly posted quotation history. Declining holdings may prompt an opinion to consider selling, but the broker never reads hidden future prices. The advice is saved once per visited date, appears at the broker's desk and is copied to the personal journal. Reloading or visiting again on the same date does not reroll it. This is a rule-based NPC service, not predictive artificial intelligence. No executable or release produced.


## v0.6.47-dev · 24-hour calendar kernel (October 22, 2026)

The source-only `world-clock.js` engine now exposes actual 24-hour calendar positions, 12-hour player-facing clock formatting, midnight rollover, weekdays, and caller-supplied opening-hours checks. It calculates the next opening date across nonworking weekdays and advances events through action-driven multi-day jumps without offline time passing. Tests cover exact open/close boundaries, weekends, and save round-trips. **Venue hours and activity durations are not invented. The existing gameplay still uses its legacy day/night countdown until every major clock consumer is migrated**. This is not a finished 24-hour gameplay clock. No executable was packaged.


## v0.6.47-dev · Washington map filtering and labels (October 22, 2026)

Washington map pins show their **numbers only by default**. Names appear on mouse hover, keyboard focus, or selecting/tapping a pin. The optional **Show Names** control reveals all names, while the **Locations** category selector filters the visible pins by the established city-registry category. Categories come only from actual mapped places, not fictitious destinations. Filters change the *view*, never physical travel eligibility, invitations, saves or pin coordinates. This source slice is not an accepted new executable.


## v0.6.47-dev · First local resident conversations (October 22, 2026)

Seven persistent NPCs now offer **Greet** and **Ask About Work** buttons while physically present in a Washington room. Conversations are available only when the NPC and protagonist occupy the same location at the current simulated schedule slot. Introductions create modest profile-local relationship memory, and each conversation topic may be used only once per game date to prevent repeated trust farming. A journal note records what was **actually said**, not private motives or confidential goals. Reloading a room does not reset these meetings. These are intentionally simple, deterministic rule-based social interactions, **not a generative conversational AI** and not a substitute for the unfinished 24-hour runtime migration. Durations and later interactive dialogue remain to be defined. No executable packaged.


## v0.6.47-dev · Resident schedule consistency (October 22, 2026)

Existing authored location dialogue for Li Wen, Chen Mei and Pavel Orlov is now tied to those characters' persistent NPC presence. A resident who is elsewhere or off duty cannot remain indefinitely available as a separate static talk button. If a person leaves between rendering and the conversation, the action refuses rather than implying the meeting happened. Conversations add a once-per-date encounter memory and a modest journal entry without manufacturing secret knowledge. NPC routine updates refresh the room's authored people as well as the visitor list. This remains an **early social simulation**, still awaiting the unified 24-hour runtime clock and richer individual decision-making. No executable packaged.


## v0.6.47-dev · Per-NPC facts and hearsay (October 22, 2026)

A new offline `npc-knowledge.js` module gives every simulated character **their own evidence and beliefs**, keyed by information source, date and confidence. An NPC may hold a mistaken belief; sharing it only passes what that NPC *believes*, with reduced confidence. Neither an NPC's private record nor a rumor automatically becomes public news. Direct introductions now record personal first-hand acquaintance as private knowledge in that profile's NPC simulation. Duplicate facts from the same source/date cannot be farmed; separate sources may disagree without being silently overwritten. This is an auditable rule-based memory system, **not generative AI**. It does not migrate the live day/night countdown and does not imply a finished conversation system. No executable packaged.


## v0.6.47-dev · Brokerage career and order integrity (October 22, 2026)

Stockbroker relationships remain personal to each saved profile. In-person brokerage remains available to **all four careers**, but telegram access from the Federal Electric executive office is exclusive to the **Businessman who controls that office**. Visiting the building as a Patrolman, Layman, or Wardman cannot silently grant corporate-office communication privileges. The actual stock-order execution function now validates whole safe share quantities and rejects securities not yet listed in the simulated year, even when invoked outside its visible controls. These are source-only safeguards, not new price-prediction or automated telephone mechanics. No executable packaged.


## v0.6.47-dev · Private, location-bound rumor exchange (October 22, 2026)

Scheduled NPCs can exchange **their own known claims** with another resident only when both are present at the same city location during a processed simulation slot. Each attempted exchange is deterministic per saved profile and time slot, influenced by their sociability, so re-opening a room does not reroll the result. Hearsay has lower confidence than firsthand knowledge; identical secondhand reports from the same speaker are not duplicated on every game date. Successful exchanges record private provenance and the meeting place. **Gossip is never automatically printed in the Metropolitan Ledger**. This is the first autonomous gossip foundation, not a complete AI gossip or conversation model. Source-only, no executable packaged.


## v0.6.47-dev · Weekly appointments on a real 24-hour clock (October 22, 2026)

The new offline `npc-daybook.js` service calculates NPC/venue appointment availability from an **absolute saved calendar minute**, including weekdays, late-night/overnight meetings, exact closing minutes, and the next weekly occurrence after a missed gathering. No fictional location's actual weekday or operating hours have been hard-coded: those rules must be supplied by approved historical/gameplay schedules. Source regression tests demonstrate Friday-night-to-Saturday, missed appointments and one-week recurrence with **test-only** times. The existing playable runtime remains on the legacy countdown until all major systems can adopt the new clock together, so this is a calendar scheduling foundation rather than a claim that existing Washington venues now run on the 24-hour clock. No executable packaged.


## v0.6.47-dev · Earned NPC contact cards and current-status documentation (October 22, 2026)

Face-to-face greetings with scheduled NPCs now add the person to that profile's **Contact File**, using their established identity. Contacts cannot be gained through a remote dialogue request or by opening a location while the resident is absent. A card represents acquaintance only, **not guaranteed cooperation, trust, secret knowledge, or telephone access**. Later contact systems may add richer source-qualified information. Updated the README's current overview to accurately state four selectable career foundations, fourteen mapped pins, four profiles, the old packaged candidate and incomplete shared-calendar migration. Source-only, no executable packaged.


## v0.6.47-dev · Historic Government Hospital reception (October 22, 2026)

Added the actual **Government Hospital for the Insane** as an independently visitable public reception/inquiry location in southeast Washington. The institution opened in **1855**; **St. Elizabeths** became its official name in **1916** ([National Archives history](https://www.archives.gov/research/guide-fed-records/groups/418.html)). Deeper patient wards and superintendent rooms exist as restricted shells, blocked both from regular room navigation and direct entry, with no public patient records or invented treatments. The hospital remains **unpinned** until an approved placement on the existing reference map is established; the approved 14 map pins are unchanged. This location is distinct from fictional Blackwood Asylum, which remains planning-only. No artwork or executable packaged.


## v0.6.47-dev · Wardman's autonomous life (October 22, 2026)

While another protagonist is being played, **Wardman now independently inhabits Washington**, using registered public and institutional places including the historical Government Hospital reception. The profile-specific seeded career may develop through hospital service, medical apprenticeship, administration or private charitable reform, with modest public reports appearing on appropriate story milestones. The selected protagonist is never simultaneously simulated as their own background rival. Old saves whose stories already progressed initialize Wardman's stage consistently **without fabricating prior newspapers or resetting the existing three characters**. This completes *foundation coverage* for the three nonplayer protagonist archetypes, not their full AI personalities or professional campaigns. Source-only, no executable packaged.


## v0.6.47-dev · Persisted calendar bridge (source-only)

The game now stores a serializable **absolute-minute calendar** alongside its transitional legacy business/night countdown. New profiles begin with a known 8:00 AM baseline; existing saves with no historical absolute minute are explicitly marked `legacy-unmapped`, rather than silently inventing an earlier hour. The next explicitly begun playable morning initializes that profile's calendar. Both time-costing game actions and the current tick update this saved calendar in whole-minute increments with a retained subminute remainder. Pauses and closed applications do not advance it. The calendar kernel can process queued events chronologically on large jumps, but **the existing 60-minute phase system is still the active gameplay timing authority**. No inaccurate 24-hour time is shown to the player yet. Migrating markets, factory, venue schedules, the main menu, and the real 12-hour readout to one authoritative 24-hour calendar remains unfinished. No executable generated.


## v0.6.48-dev · Golden map pins for earned invitations

Gold numbered markers signal a **known, unvisited destination**, currently Commerce Club when Eddie Doyle introduces it and Embassy Room after Harrison Vale issues an invitation. The marker remains gold until the player genuinely enters that location, not merely upon clicking its map pin. These leads are saved per profile, and cannot be recreated by repeatedly meeting the same contact. Map labels, filters, pin coordinates and other locations are unchanged; no private NPC secrets appear. Hardcore difficulty options are still to be decided. Source-only; no executable.


## v0.6.48-dev · Temporary hour-per-location travel (source-only)

Travel between distinct registered Washington locations now records a **provisional 60-minute cost** in the saved 24-hour **calendar bridge**, while moving between rooms at the same location costs no travel hour. This is temporary until street geography and pin placement are approved. Real mileage remains unknown; transport assets do not teleport; old-profile unknown hours are not fabricated. **The legacy 60-minute day/night gameplay loop has not been replaced.** The [temporary travel decision](TRAVEL-DECISION-2026-10-22.md) and [October 22 thread handoff](HANDOFF-2026-10-22-THREAD-END.md) distinguish implemented behavior from unfinished calendar migration. Source QA passed; **no new executable packaged**.


## v0.6.49-dev · Mapped-calendar NPC routines (source-only)

Seven named residents now use persisted per-profile **8 AM/noon/5 PM/10 PM** routine boundaries when the calendar is mapped. Foreman Sullivan and Inspector Hayes are absent from their ordinary daytime workplaces on weekends. These are provisional gameplay schedules, **not verified nineteenth-century opening hours**. Actual travel can cause a missed encounter, but long jumps do not invent intervening meetings or private rumors. Face-to-face interaction records use the mapped date. Older `legacy-unmapped` profiles keep the previous day/night-phase routine. Save/reload and pause do not reroll routines. New source regression tests cover these behaviors.

**Unfinished:** one authoritative 24-hour factory, payroll, market, venue and campaign-day clock; detailed independent NPC decisions and finalized weekly appointments. The old countdown is still in charge of core gameplay. No executable packaged.


## v0.6.50-dev · Game-time transactions and safe morning handoff (source-only)

The game now routes **passive simulation ticks, owner action durations and provisional inter-location journeys** through one saved per-profile calendar time-charge service. It records a bounded journal of the latest 128 intentional charges and a compact cumulative tick count rather than flooding the autosave every second. Repeat calls using the **same action/journey token** are idempotent within that journal, and paused play does not post a time charge. A legacy save with no truthful absolute hour retains the `legacy-unmapped` status, with no fabricated time inserted.

When the legacy gameplay cycle explicitly starts another business turn, the calendar bridge now **advances to the scheduled next morning without ever resetting a later recorded minute backward**. Pending calendar event queue/history survive an advancing handoff. This prevents travel-accrued absolute time from being erased. If old turn dates lag behind time already accrued by travel, the calendar retains its later time instead of lying about an earlier arrival. Resolving any remaining turn-date mismatch requires the planned full campaign-day migration.

This work is **infrastructure, not the final 24-hour conversion**: factories, payroll, published exchange quotes, venue hours, night reports, action caps and the visible 60-minute countdown still follow the legacy business/night phase. It does not yet claim an uninterrupted real-time city, or that a one-hour journey advances all legacy economic consumers. Tests cover double charges, same-building travel, midnight handoff, queued events, legacy saves, autosave reload, pause and profile isolation. No standalone executable or release was produced.


## v0.6.51-dev · Residents, acquaintance cards and usual visiting hours (source-only)

Seven recurring Washington residents now have **usual public visiting windows**, derived from the saved calendar instead of the computer clock. Weekday work absences are honored for Foreman Sullivan and Inspector Hayes; overnight appearances cross midnight correctly. After an **actual face-to-face greeting**, the player's Contact File gains a personal itinerary card for that resident, showing their ordinary next known place and 12-hour time window. This is a planning hint, **not an appointment guarantee**, and it reveals no unobserved NPC private goals or rumors. Legacy-unmapped profiles show no invented time.

In-room residents also accept a third conversation topic, **Ask About Washington**, with seven individually authored public remarks. It adds one modest acquaintance point on the first local talk that day, records an ordinary personal journal note, and cannot be repeated for unlimited points. A room visitor refresh now clears old rows before rendering, preventing duplicate visitor cards. The system remains offline and deterministic; no cloud-generated AI, fabricated historical hours, or executable was produced.


## v0.6.52-dev · First situation-aware agent decision layer (source-only)

All seven recurring named NPCs now run their individual **offline utility planners**, replacing the former seeded random goal selection. Their choices weigh occupation-specific priorities, temperament (ambition, sociability and caution), fatigue, immediate local operating conditions and **only the personally held observations or rumors they have actually learned**. For example, the foreman may prioritize a late contract, switch to workforce protection when staff conditions deteriorate, and take rest when exhausted after hours; Madam Star can prioritize staff protection after a reported club raid; Inspector Hayes reacts to public news, not hidden police case data. The three alternate protagonist biographies and existing scripted pathways remain unchanged.

Each reached routine period records the NPC's chosen goal, reason and compact decision evidence inside the active character's private save. No unattended/offline decision processing, speculative retroactive encounters or omniscient rumor-sharing was introduced. Public contact cards still show only usual public whereabouts after an earned greeting, **never private motive scores**. Conversations adapt slightly to established acquaintance while remaining authored and limited to one topic per resident per day. Tests cover changing goals, role-specific triggers, private evidence, fatigue, legacy routines and repeatable autosaves. **This is deterministic simulation AI, not an LLM or open-ended dialogue generator.** No executable was packaged.


## v0.6.53-dev · Detective casebook: evidence-driven murder mysteries (source-only)

The Patrolman route has its first genuinely playable investigation. A per-profile case records the underlying victim, time, place, cause, and culprit privately. Four suspects each have interviews; three **independent** witness, physical, and financial-evidence threads must intersect on one uniquely supported culprit. The player investigates the scene, searches business records, takes witness statements, interviews suspects and decides whom to accuse; unverified rumor is distinguished from evidence. Each action spends **two in-game minutes** through the existing time gateway. Duplicate investigations or interviews cannot farm time or evidence, bad accusations have consequences, and completed cases can be followed by new casework. The game autosaves these records in the investigator's own profile.

This is a **first playable detective-case simulation**, not yet a crime organically committed by an independently acting Washington resident. A future slice will connect the authoritative crime truth to living NPC deaths, movement, eyewitness memories, police records and newspaper coverage, without injecting inconsistent events into existing profiles. Industrialist factory and market operation remains unchanged. No downloadable build or release was created.

## Legal and third-party notices

See [LEGAL.md](LEGAL.md) for maintainer contact information, license status of the murder-mystery repositories reviewed, and existing dependency notices. The new JavaScript engine is independently written using designs studied from MIT-licensed Cold Truth and Mysterious Murder; no third-party executable code was imported in this slice.
