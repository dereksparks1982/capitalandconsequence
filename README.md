# Capital & Consequence

**One city. Countless lives. Every choice has consequences.**

*Capital & Consequence* is an in-development **Beta** single-player life simulation in an alternate-history **Washington, D.C., beginning January 2, 1878**. Work, earn a living, go shopping, travel, encounter strangers, form friendships and rivalries, visit clubs, gamble, compete, and discover the consequences of choices years later.

**Federal Electric is the company you own. Washington is the world you inhabit.**

## Current development checkpoint: v0.7.16-beta (29 October 2026)

**Capital Travel ETA and transportation comparison:** The existing Washington map destination card now compares provisional walking, horseback and carriage journey times while clearly labeling unavailable horses/carriages. The selected method shows the estimated end of travel on the game's **saved 1878 calendar**, including overnight arrivals, without charging the world clock merely to preview it. The original map and approved pin defaults are fixed, and routes remain approximate rather than precisely traced streets. Focused JavaScript calendar and UI regressions passed; full local Node and Electron testing remain pending. No GitHub Actions, ZIP, or executable. [v0.7.16 Beta notes](docs/RELEASE-NOTES-v0.7.16-beta.md).

### Previous v0.7.15-beta checkpoint (29 October 2026)

### v0.7.15-beta (29 October 2026)

**Safer Capital Travel entrances:** The street graph now examines both right-angle walking approaches from a destination pin to a modeled road. When one approach crosses restricted landmark grounds, it can use the other; if both are blocked, that particular entrance is not offered. This improves how the traveling game piece avoids the existing White House exclusion without modifying any artwork or pin defaults. Tests verified all 1,560 ordered journeys among the 40 registered locations and 163 edited-pin approaches around restricted grounds. **These roads remain approximate, not a traced street-by-street map or guaranteed building collision model.** Focused JavaScript checks passed; full local Node and Electron gameplay tests are pending. No GitHub Actions, release tag, or executable ZIP. [v0.7.15 Beta notes](docs/RELEASE-NOTES-v0.7.15-beta.md).

### Previous v0.7.14-beta checkpoint (29 October 2026)

### v0.7.14-beta (29 October 2026)

**Capital Travel turning pawn and safe departures:** A small temporary copper direction marker now turns with the walking, horse or carriage game piece through modeled street corners and diagonal avenues. The existing character icon stays upright, and no map artwork or approved pins are changed. Cross-city **Go There** now requires a graph-backed road itinerary; if the map or road graph is unavailable, it refuses travel rather than allowing a direct uncharged teleport. Same-location room entry remains permitted. Focused route, heading and failure-regression checks passed; full offline Node and Ubuntu Electron tests remain pending. No GitHub Actions, executable ZIP or release tag. [v0.7.14 Beta notes](docs/RELEASE-NOTES-v0.7.14-beta.md).

### Previous v0.7.13-beta checkpoint (29 October 2026)

### v0.7.13-beta (29 October 2026)

**Distance-paced Capital Travel:** The moving overworld game piece now takes more time to cross long provisional street routes and less time for short journeys; horseback and carriage animations move more quickly than walking. Visual duration remains bounded and respects reduced-motion preferences. The **game clock is not charged by the animation**: the existing paid journey ledger still advances it once only on a successful destination-room arrival. All 40 approved map pins and the original Washington artwork remain untouched. Focused source tests passed; full Node and Ubuntu Electron QA remain pending. No GitHub Actions or executable ZIP. [v0.7.13 Beta notes](docs/RELEASE-NOTES-v0.7.13-beta.md).

### Previous v0.7.12-beta checkpoint (29 October 2026)

### v0.7.12-beta (29 October 2026)

**Faster Capital Travel street searches:** The first-pass Washington street model now finds routes using a deterministic binary-heap shortest-path search, retaining the bounded road cache and live pin-based cost calculation. In source benchmarks, a representative 195-route batch was about 11% faster, with the same aggregate guide-pixel distances; all 1,560 ordered city routes still passed connectivity and symmetric-distance checks. Original Washington map artwork, all 40 pin defaults, and approved UI geometry remain untouched. These remain **approximate** map corridors, not verified pixel-perfect 1878 road centerlines. Focused JS regressions passed; full Ubuntu Node and Electron tests remain pending. No GitHub Actions or executable ZIP. [v0.7.12 Beta notes](docs/RELEASE-NOTES-v0.7.12-beta.md).

### Previous v0.7.11-beta checkpoint (29 October 2026)

### v0.7.11-beta (29 October 2026)

**Capital Travel road optimization:** Routes now evaluate multiple nearby street entrances at the origin and destination, choosing the shortest **complete** door-to-door itinerary instead of snapping to one nearest road and accepting an unnecessary detour. In 195 old-versus-new comparisons, 81 routes shortened, 114 were unchanged, and none lengthened. All 1,560 ordered journeys among the game's 40 registered sites passed route presence and reverse-distance consistency checks. The printed Washington artwork, all approved pin defaults, and existing room layouts remain untouched. The roads are still provisional, not precision-traced from the artwork; full Ubuntu Node/Electron QA is pending. No GitHub Actions or executable ZIP. [v0.7.11 Beta notes](docs/RELEASE-NOTES-v0.7.11-beta.md).

### Previous v0.7.10-beta checkpoint (29 October 2026)

### v0.7.10-beta (29 October 2026)

**Washington street-entrance accuracy:** The Capital Travel System now compares approach paths using the actual right-angle distance traveled in native guide pixels rather than a straight-line distance that can pick the wrong street. Entrance turns also respect the original 2048×1159 map's unequal pixel axes. An exhaustive source QA pass covered **1,560 directed journeys** between all 40 registered locations; every route remained connected and reverse-distance estimates agreed, with original pins unchanged. These are still **modeled, approximate roads**, not a fully traced, collision-free historic Washington street map. Focused regressions passed; full local Node and Electron QA remain pending. No GitHub Actions or executable ZIP. [v0.7.10 Beta notes](docs/RELEASE-NOTES-v0.7.10-beta.md).

### Previous v0.7.9-beta checkpoint (29 October 2026)

### v0.7.9-beta (29 October 2026)

**Capital Travel failure recovery:** Live previews and moving street-route figurines now validate map-screen projection and cancel gracefully if coordinates become invalid or a projection throws. The travel overlay is removed, the journey does not commit or charge a completed arrival, and the player can retry after the viewport recovers. This builds on road-following travel, live pin recalc, physical horse/carriage requirements, camera following, and the copper traveled-road trail. Original Washington artwork, numbered pin defaults, approved room and map geometry remain unchanged. The modeled roads are still approximate, not pixel-perfect building collision geometry. Focused isolated JavaScript recovery tests passed; full local Node and Electron QA remain pending. No GitHub Actions or executable ZIP. [v0.7.9 Beta notes](docs/RELEASE-NOTES-v0.7.9-beta.md).

### Previous v0.7.8-beta checkpoint (29 October 2026)

### v0.7.8-beta (29 October 2026)

**Capital Travel's animated street trail:** The moving walker, horse or carriage figurine now leaves a temporary copper-colored trace along the road path already traveled. The original dotted itinerary remains visible ahead. Both paths follow the same guide-pixel position through camera zoom/pan and are removed after the trip or cancellation. The pawn now finishes on the exact destination pin without floating-point drift. The original Washington map artwork, all numbered pin defaults, existing room navigation and approved UI geometry remain unchanged. **The first-pass road model still needs precise street tracing and cannot guarantee that every illustrated building is avoided.** Focused animation, route-prefix and zoom tests passed in isolated JavaScript; full local Node and Electron QA pending. No GitHub Actions or installer. [v0.7.8 Beta notes](docs/RELEASE-NOTES-v0.7.8-beta.md).

### Previous v0.7.7-beta checkpoint (29 October 2026)

### v0.7.7-beta (29 October 2026)

**Capital Travel wayfinding:** Street-network routes now supply approximate road-turn counts and named avenue corridors, shown in the existing travel-time display without modifying any approved map artwork or pin positions. The game saves each completed trip's turn count and recognized Pennsylvania, Massachusetts and New York Avenue corridor labels alongside its previously recorded pixel distance, transport method and time spent. Repositioning a pin recalculates subsequent routes and road descriptions but never rewrites journey history. Avenue names are retained only when the provisional road graph actually uses those edges. **This remains an approximate street network, not a surveyed street-by-street reproduction.** Focused source regression passed; full local Node/Electron playthrough pending. No GitHub Actions or compiled ZIP. [v0.7.7 Beta notes](docs/RELEASE-NOTES-v0.7.7-beta.md).

### Previous v0.7.6-beta checkpoint (29 October 2026)

### v0.7.6-beta (29 October 2026)

**Capital Travel reliability:** Washington routes now reuse a bounded cache of street-intersection searches during pin dragging; the character's game piece keeps its exact progress on the map through mid-journey zoom/pan; a zoomed camera gently follows the traveler but never overrides manual map dragging. Ordinary road-access connectors avoid the modeled White House restricted footprint. The travel card reports progress at quarter-journey intervals, and a canceled or interrupted trip cannot commit after a change of active character, saved game, origin, destination, mode, or pin placement. Original fixed map artwork, all 40 numbered pin defaults, approved UI geometry and the fictional setting are untouched. **Routes are still a provisional street graph, not an accurately traced set of building-free roads.** Focused JavaScript regression checks passed; full offline Node and Electron testing remain pending. No GitHub Actions or executable ZIP. See [v0.7.6 Beta notes](docs/RELEASE-NOTES-v0.7.6-beta.md).

### Previous v0.7.5-beta checkpoint (29 October 2026)

### v0.7.5-beta (29 October 2026)

**Capital Travel now follows modeled streets.** The walking, horseback, or carriage game piece travels through connected Washington map-road intersections, using approximate neighborhood blocks and named diagonal avenue corridors instead of the old all-purpose rectangular shortcut. The engine chooses a shortest street-network path, makes brief doorway-to-road connections from the **current pins**, routes around an approximate White House exclusion, and calculates travel time from the resulting full route. Pin edits automatically change future journey routes and timings; completed trips remain frozen in the saved travel ledger. The original map image, all 40 registered pin defaults, existing rooms, and other approved UI geometry remain untouched. **The first-pass roads are a provisional graphical approximation, not a precise trace of every printed street or a guarantee against all building crossings.** Focused isolated travel/route checks passed; the complete Ubuntu Node and Electron suites are still pending. No GitHub Actions or installer ZIP. See [v0.7.5 Beta notes](docs/RELEASE-NOTES-v0.7.5-beta.md) and [Capital Travel street-network design contract](docs/CAPITAL-TRAVEL-STREET-NETWORK.md).

### Previous v0.7.4-beta checkpoint (29 October 2026)

### v0.7.4-beta (29 October 2026)

**Capital Travel System:** The original, permanently fixed Washington map now doubles as an animated travel overworld. Choose walking, horseback, or carriage, watch a temporary dotted route and moving game-piece token, and arrive inside the selected destination room. Trip time now uses the **current origin and destination pin coordinates**: moving a pin in the map editor instantly recalculates the approximate guide-pixel route and all three transportation-time estimates. Confirm/cancel still governs pin placement. The saved travel ledger records actual provisional time, transportation mode, and a per-trip distance snapshot, so later pin changes affect **future** journeys only. Horse and carriage travel requires the actual assets at the departure location. The rectilinear route is a **gameplay approximation**, not a surveyed street network or real-world mileage. Original map art, numbered pin defaults, pin layout, poker and other approved geometry remain unchanged. Focused source and isolated JavaScript regression checks passed; complete local Node suite, Electron QA and owner playtest remain pending. No GitHub Actions, hosted artifacts, or installer ZIP. Read [v0.7.4 Beta notes](docs/RELEASE-NOTES-v0.7.4-beta.md).

### Previous v0.7.3-beta checkpoint (29 October 2026)

### v0.7.3-beta (29 October 2026)

**Beta development checkpoint, aligned with the owner's milestone definitions:** The partially playable game is in Beta while core activities are expanded and stabilized; version 1.0 will be the initial release when the creative director authorizes it. This slice connects real poker settlement IDs to earned club membership trials, prevents financial-bookkeeping routines from silently purchasing off-site groceries, and completes saved NPC journeys before new calendar-period instructions replace their destination. Focused source regression runs passed for poker integration, economy, market accounting, and arrival across period boundaries. **Full offline Node suite, Electron gameplay QA, and user playtest are still pending.** No map, pin, room, or approved UI changes. No installation ZIP. Read [v0.7.3 Beta development notes](docs/RELEASE-NOTES-v0.7.3-beta.md).

### Previous v0.7.02-dev checkpoint (29 October 2026)

**Ongoing five-system hardening:** Private poker clubs retain a bounded ledger of 64 completed trials keyed by saved game-session IDs, preventing an old trial from settling again even after newer sessions. Federal Electric workshop incidents reject duplicate assembly receipts and refuse to create new breakdowns during an existing production hold. Added an old-session replay regression and preserved the existing club trial regression. These changes build on the earlier NPC journey, economy, and relationship slices; those systems remain ongoing and are not represented as finished. Focused club suite passed in a JavaScript harness prior to the additional replay assertion; full Node suite and Ubuntu Electron playthrough still pending. Original Washington map and owner-approved geometry unchanged.

### Previous v0.7.01-dev checkpoint (28 October 2026)

**Five-system source batch continuation:** NPCs completing actual grocery-trip purchases now remember their last verified departure location and can choose it as an off-duty return destination, using the existing city access and saved journey logic. Individual NPC social encounters now preserve up to 24 witnessed personal experience records, without creating a second reputation reward. Previously implemented poker trial session replay guards, workshop repair history, and the off-site NPC finance purchasing fix remain included. The target grocery return and poker membership regressions passed in focused V8 checks. The full Node regression suite, real Ubuntu Electron testing, and deep poker/industrial gameplay are still pending. Original Washington map artwork, 40 pins and approved UI geometry unchanged.

### Previous v0.7.00-dev checkpoint (28 October 2026)

**Multi-system continuation:** Poker club trials now optionally accept a saved session identifier and refuse duplicate settlement or duplicate presentation of an earned membership card. Federal Electric logs a bounded workshop incident history and the latest paid repair cost/time against an actual breakdown. NPC finance routines no longer buy goods in generic calendar slots without being located at an existing market and performing a shopping activity; this closes a hidden source of off-site purchases. Existing NPC journeys, appetite, purchasing, relationship memory and club access remain connected but are not yet complete autonomous careers or full street routing. Targeted poker regression passed in a V8 harness; full Node suite and actual Ubuntu Electron gameplay remain pending. Original Washington artwork, all forty map pins and approved geometry remain untouched.

### Previous v0.6.99-dev checkpoint (28 October 2026)

**Stacked slice 9, correct shopping intent:** The city mobility engine now uses an explicit food-motivated shopping-trip flag, so genuine grocery expeditions receive a shopping activity but ordinary business and social visitors to Chinatown do not. That distinction prevents unrelated visits from triggering meal shopping. The on-duty priority, room access gates, and existing saved-clock travel remain unchanged. Targeted source regression confirms the distinction. A full Node suite and actual Ubuntu gameplay check remain pending. No Washington artwork or layout changes.

### Previous v0.6.98-dev checkpoint (28 October 2026)

**Stacked NPC grocery journey slice:** Eligible off-duty residents with genuine hunger, available personal cash and no unconsumed provisions can prioritize an existing Chinatown market over leisure. The ordinary city-access checks and the already implemented saved NPC 30-minute journey system apply. Arrival is required before making a finite-stock, personally paid market purchase. The existing actual-room market shopping routine and historical map placement are unchanged. Added source regression assertions for market-directed excursions, on-duty priority and payment-at-arrival gate; the targeted V8 mock run passed. No full Node suite or Electron gameplay test has yet been performed. The original map art, 40 pins and UI geometry remain fixed.

### Previous v0.6.97-dev checkpoint (28 October 2026)

**Stacked development build 7, resident shopping integration:** Residents with real hunger and no currently unconsumed paid food may purchase groceries with their own money while genuinely present at an established Chinatown or Hillsdale market activity. Purchases use the existing finite shared stock, credited merchant tills, and unique saved transaction tokens, then flow into the established household provision records. Travel, absence, poor funds, inadequate hunger or a non-market location cannot create a sale. A dedicated offline source regression checks affordability, sold-out substitutions, physical presence and replay. This does not yet simulate arbitrary journeys to a grocery store or invent a new shop or historical address. Full Node suite and Ubuntu playthrough remain pending. The original map artwork, all 40 pins and UI geometry stay unchanged.

### Previous v0.6.96-dev checkpoint (28 October 2026)

**Stacked multi-system NPC build:** Paid market receipts now create individual edible provisions, which residents can consume once during a verified present meal routine. No off-site or travelling meals, duplicate grocery charges, or free food when stock runs out. Paid meals modestly affect hunger and mood, record confirmed meals in personal needs/daybook state, and leave proof in bounded receipt-backed meal history. Individual food pressure now influences NPC social planning without inventing groceries or earnings. Targeted household and NPC agency source regressions passed in a V8 test harness; full Node QA and a Linux Electron playthrough are still pending. No Washington map/UI modifications, no installation ZIP.

[Development notes for v0.6.96](docs/RELEASE-NOTES-v0.6.96-dev.md).

### Previous v0.6.95-dev checkpoint (28 October 2026)

**Stacked development build 5, household purchase provenance:** NPCs now retain a save-backed per-good purchase tally and most recent receipt date alongside the existing bounded household ledger. These are evidence of *paid acquisitions*, not proof of food consumption, stored inventory, wealth, or an independently invented shopping trip. The existing buyer-specific receipt validation, no-duplicate accounting and separation of personal/company money remain in place. Regression assertions now cover the itemized history, repeat processing and save reload. No map, room geometry or story canon was changed. This source checkpoint does not claim a full Node suite or Linux Electron acceptance.

### Previous v0.6.94-dev checkpoint (28 October 2026)

**Stacked development build 4, NPC daily life and persistent condition records:** Every simulated resident's needs now keep a 14-day save-backed daybook of observed active minutes, night rest, other hours and recognised routine meal periods. The ledger follows only elapsed player-controlled world minutes; no fictional rent, food purchase, private home, salary or second NPC clock is introduced. Multiple short time advances and one equivalent long advance yield the same entries, and reloading/repeating a minute cannot double-count activity. Full offline Node QA and a Linux Electron playthrough remain pending; no new downloadable patch is being requested yet. The approved 40-pin Washington map and UI are unchanged.

### Previous v0.6.93-dev checkpoint (28 October 2026)

**Stacked development build 3, saved NPC travel:** During calendar processing, residents switching between established locations now acquire persisted thirty-minute journeys instead of universally teleporting. An NPC travelling between sites is not present in either room for conversation or social meetings; reached arrivals resolve against the player-controlled calendar and store their actual departure and arrival minutes. Large player time jumps can complete journeys during the jump. A same-routine-signature clock update can finish a pending trip without paying wages, making new NPC plans or replaying social settlements. Each resident now retains a bounded record of the last sixteen completed journeys, including origin, destination, departure and arrival minutes. A journey that completes as a later routine begins can chain to the next destination rather than erasing the intermediate arrival. Regression checks now inspect elapsed journey accounting. This is a provisional city-wide travel duration, **not** historically surveyed distances or road-by-road pathfinding; some long skipped routine periods remain unresolved. The original map and UI geometry are unchanged. Source-only development checkpoint, not a completed Electron playthrough or accepted release.

### Previous v0.6.92-dev checkpoint (28 October 2026)

**Stacked development build 2, NPC temperament:** Off-duty outing selection now preserves an explicit zero sociability score instead of mistakenly converting it to the default of 50. The same saved seed, time and resident produce the same choice; work obligations still override discretionary trips. Added source regression assertions for quiet and sociable outings and on-duty priority. No player-facing UI or Washington map changes; the complete QA suite and Linux playthrough have not yet run. The owner requested stacking at least three builds before another installation/test pass.

### Previous v0.6.91-dev checkpoint (28 October 2026)

**Travel-time consistency slice:** The player-facing map travel notice now correctly states that moving between different rooms in one location costs **one game minute** (remaining in the same room is free), while journeys between distinct Washington locations remain provisionally **30 minutes**. Travel regression coverage now checks the displayed rules and saved departure/arrival clock timestamps. This is a source change, not an assertion that a real Electron playthrough has passed. The original map artwork, all forty pin coordinates, and approved layout are unchanged. GitHub Actions was not run.

### Previous v0.6.90-dev checkpoint (28 October 2026)


**Owner correction for pin #12:** Charlie's residence is now simply **Home** and its map marker is **black, matching his owned Federal Electric factory**. Existing plot coordinates and original guide art were not moved or changed.

**Owner-requested Washington map correction (October 28, later revision):** White anchor dots, dashed leader lines and collision-based pin drifting have been **removed**. Every numbered pin remains at its own assigned plotted position throughout zoom, pan and information-card opening. Nearby markers may overlap rather than shifting their apparent geography. Hovering or focusing brings the chosen marker and label to the front; the existing 40-location directory remains the reliable way to select covered pins. The three previously identified off-print **provisional** sites still dock to the guide edge, with a clear warning, because their real position is outside this immutable guide. The original artwork and saved x/y coordinates have not been changed.



This is a **source development build, not an accepted Linux release**. The playable city registry contains **40 numbered Washington locations**, all shown unfiltered on the original unchanged printed **1–30 / A–R Washington guide**. No approved UI coordinates or original map artwork were replaced.

The new work includes **all 60 saved character skills (0–100)**; an unfolded miniature paper map on Charlie's desk; legible hover labels and black owned-property pins; **broker-only securities orders and the complete period-listed stock catalog**; finite share offerings; steelworks/railroad acquisitions; passenger and freight operating books; merchant shipping with upkeep, repairs, storm/piracy risks and discoverable routes; and fishing skill, legendary sturgeon, trophies, competitions and purchasable fishing craft. Some skills are registry-ready but their related gameplay actions are not implemented yet.

**QA status:** An independent audit of an earlier source checkpoint reported **11 failures in 77 individually run Node tests**, no Electron playthrough. The identified stale tests and fail-fast source runner have been repaired; targeted source simulations of the new industry, shipping and fishing code passed. **The full current offline Node suite and an actual Ubuntu Electron playthrough have NOT been completed here.** Run `bash scripts/local-source-qa.sh` from a project checkout to get the complete current regression results; do not treat this checkpoint as accepted before local verification. No GitHub Actions were used.

[Detailed v0.6.90 development notes and audit response](docs/RELEASE-NOTES-v0.6.90-dev.md).

**For the next ChatGPT thread:** [October 28 complete source handoff](HANDOFF-2026-10-28-v0.6.90-dev.md) · [Character Codex Index](CODEX-INDEX.md) · [Binding Decisions](DECISIONS.md) · [Permanent Map Canon](MAP-CANON.md).


## October 28, 2026 · original Washington guide coordinate audit

**Forty-number audit completed:** all numbers **1–40** have unique map identities. The printed coordinate reference uses numbered **1–30** columns and lettered **A–R** rows, drawn exclusively from the original unchanged Washington In and Out Guide. The same coordinate converter now powers the city registry, marker tooltips, renaming cards and searches. Five directly map-anchored historical references have checked grids: White House **#23 at 12-I**, Government Hospital **#16 at 25-R**, Washington Airport **#25 at 9-P**, Georgetown Canal **#32 at 7-I** and Eastern Branch shoreline **#33 at 24-M**. The invented District Asylum **#22** has an **approximate 26-Q** location, not a fabricated historical building.

**Visibility acceptance (updated per owner request):** The initial unfiltered map lists **40/40 registered numbered pins** beside its heading. Every marker now stays at its assigned map location during zoom/pan and when an information card is open. **No automatic spreading, white dots or connecting lines.** Some markers can overlap or be covered by the detail card, so select them through hover/focus or the complete scrolling directory; the map will not move them to hide geographic overlap. Original artwork, historical coordinates, normalized pin positions and edited names are unchanged. Three off-guide provisional destinations remain displayed at the guide edge with explicit off-guide warnings. Complete results: [map coordinate audit](MAP-PIN-COORDINATE-AUDIT-2026-10-28.md).

## October 28, 2026 · complete Washington pin visibility correction

**All 40 numbered locations now appear at once when Locations = All categories, Pins = All pins, and search is empty.** Previous code suppressed fifteen unverified locations even when filters were clear, including neighborhood poker #4, stockbroker #14, Le Paon d’Or #15, National Theatre #39, and District Bank #40. Three unverified pin coordinates (#18, #28, #34) also fell beyond the printable map area. Their original registry and user-edited coordinates are **unchanged**; their clickable symbols are now displayed at the nearest edge with an explicit approximate-location tooltip. Dense clusters may overlap **because each pin now remains at its plotted position** at every zoom level. The Washington Location Directory can select any of the 40 entries without moving their map coordinates; category and Fiction/Non-Fiction filters still work.

**Category colors:** Government gold, commerce/finance red, entertainment/social blue, Hillsdale/Barry Farm brown, parks/universities green, religion purple, industry charcoal, water teal, healthcare light cream, housing/other gray. National Theatre #39 is explicitly entertainment blue, and broker #14 / bank #40 are commerce red. Each pin retains its established category metadata; source historical/fictional identities remain separate.

**Close map button:** A high-contrast red X is absolutely positioned inside the top-right corner of the map window, regardless of toolbar width, wrapping or Ubuntu display size. The already approved one-minute map closing charge remains unchanged.

**Federal Electric stock exchange:** The existing **Explore Public Offering** panel is a planning scaffold only. It does **not** list shares or sell company equity. Proposed next-stage gameplay: let the owner elect an IPO once the company has sustained real accounts and an underwriting arrangement, not after an arbitrary year or mandatory World's Fair. Model valuation, offering price, founder retained stake, dilution, fees, board/control and ongoing market quotation. No IPO has been activated in this patch.

## October 28, 2026 · v0.6.89 incremental time-actions build

**Requested desk controls, exact order:** **Step Away From Desk** opens the original Washington map rather than a room; **Go to Lunch** advances the player's authoritative world clock to **12:00 PM the same day** and simulates all intervening production, residents, market and events without moving/eating automatically; **End Business Day** advances the current workday to the **5:00 PM closing bell**, simulating the missing hours without moving or sleeping. At noon or later Go to Lunch does not jump to the next day.

**Incremental time costs:** opening the map **1 minute**, closing the visible map **1 minute** including after successful travel, a cross-location trip **30 minutes**, movement between two different rooms of the same location **1 minute**, successful placement of a wager **1 minute** at horse/dog/motor racing, boxing, underground fights, cockfighting and poker. The poker session duration is additional; an undealt poker popup blocked by the browser is not charged for a wager. No charge for the same room or viewing a map that is already open. All these use the single authoritative saved world clock; residents do not advance the world clock independently.

**Boy Mercer:** Irregular date-dependent routine with frequent card-room games, competent bluffing, wins and losses, rare risky theft/cheating attempts, occasional modest wages unloading liquor from a horse-drawn delivery wagon, and ordinary living expenses. No permanent job, fixed public itinerary, invented house, or supernatural success. His absurd, contradictory stories remain only claims in his personal saved conversations. His outcome ledger belongs only to him; no named player/merchant is charged by invented bets or thefts.

**Validation:** Source syntax and focused scripted timing checks performed; full offline Node suite and direct Ubuntu Electron playthrough are still required for acceptance. This is not a finished release and no GitHub Actions were used.

## October 28, 2026 development checkpoint · v0.6.89

**Developer panel and map-pin correction.** The developer panel now starts **closed on every launch**, rather than opening automatically. A small **DEV** toggle at bottom left, or **Ctrl+Shift+D**, opens/closes it manually; a player who opens it can leave it visible while travelling. The unwanted dashed/dotted outlines around certain unverified Washington location pins are removed. Their verification metadata, editable labels, pin locations, category filtering and the fixed original map image are unchanged.

**Boy Mercer:** New independent resident, with "Boy" as his given name and Mercer as his surname. Boy tells compulsive, contradictory lies about homes, occupations, money, connections and accomplishments. Subsequent questions deliberately draw on his saved individual conversation history. His tales never grant money, authority, private-room access, employment, meetings or actual world events. He appears in existing public venues, and his unconfirmed wages and address are not invented.

**Map information scroll:** The location information panel has its own bounded scrolling. The mouse wheel over that panel scrolls its information rather than zooming the Washington map underneath; map zoom remains active outside the panel.

**Living Washington dialogue slice.** Every defined resident has a role-appropriate answer about their established work. When asked what they are doing, the local scripted dialogue reports only that resident's **actual saved current activity**, if known. It otherwise admits uncertainty. Sullivan can state his confirmed rented workshop lodging; other unknown home addresses remain unknown. Conversations cannot fabricate a job offer, appointment, meeting, wages, promotions or private information. Free-text and existing quick questions remain available in each person's own character card. These are source improvements, not a claim that long-distance NPC journey simulation or all-resident household lives are complete.

**Testing and delivery:** Offline targeted source contracts were added. A full local Node suite and a hands-on Ubuntu Electron playthrough must still be completed by the owner. This checkpoint is an **unaccepted development patch**. No GitHub Actions, Washington map artwork replacement, UI geometry relocation or save-game migration.



## Copyright and license

**© 2026 Derek Sparks. All rights reserved. Published by Elderred Softworks LLC.**

**Capital & Consequence is proprietary, not open source.** Public visibility of this GitHub repository does not grant permission to copy, modify, redistribute, resell, or use its original code, designs, writing, or assets in another project. Official unmodified builds may be run for personal, noncommercial gameplay under the narrow permission in [LICENSE](LICENSE). Third-party material retains its own applicable licenses, as documented in [LEGAL.md](LEGAL.md).

## October 26 source development: physical money and a lived-in Washington

- **No mandatory bank.** Federal Electric cash sits at the works until the owner physically collects it. Business cash carried remains business property, distinct from personal cash. A fictional District Bank allows optional **business**, **personal checking**, and **general-purpose personal savings** accounts. Deposits and withdrawals require entering the bank. Company distributions/diversions require returning to Federal Electric; the ledger records improper personal withdrawals.
- **Horse-racing cash:** Select personal carried cash or physically carried Federal Electric cash. Corporate wagers and any winnings remain company money. Accounting shortfalls from company gambling are recorded. Actual trips carrying large amounts involve a small saved risk of cash loss. Personal cash and carried company cash appear in the city-room header.
- **Washington destinations:** the original, unchanging map gains **National Theatre (pin 39)** and **District Bank (pin 40)**. Pin **15** now names Lucien Étienne Delacroix's existing establishment **Le Paon d’Or, “The Golden Peacock”**. Hillsdale butcher and market occupy **rooms within Hillsdale (pin 13)** rather than extra pins; both sell finite stock. Broker office shows the full posted Federal Exchange security sheet and order controls.
- **Residents and speech:** Edwin Booth, Joseph Jefferson, John McCullough, Clara Morris, John T. Raymond, Charles B. Hanford, and William W. Rapley live and work in **alternate-history 1878 Washington** with independent NPC schedules. Li Wen speaks Chinese only. NPC discretionary trips prioritize duties and personal sociability; simple greetings have an offline fallback. The date/time header no longer advertises the retired turn-based “FREE PLAY” mode.

This work is a **source build, not a Linux acceptance release**. Targeted JavaScript regression passed (56 finance, 25 Hillsdale and 104 multi-route/multi-era NPC assertions), but complete offline Node tests and actual Electron gameplay remain unverified. No GitHub Actions are used, no executable was requested, and the original Washington map artwork must never be changed.

### Further October 26 source work: betting and bank handling

Company and personal money stay different even inside a betting room. Licensed boxing and the Boiler Room, Commerce Club and Embassy Room poker games now accept a deliberate choice of *carried personal cash* or *carried Federal Electric cash* (for its owner). Poker popup reservations, refunds, forfeitures and quick simulated sessions preserve that origin, with persistent wager receipts preventing double payment. An invalid bank or factory money transaction consumes no time; an accepted one takes two minutes of player-triggered world time. Theatre residents now retain their individual rehearsals and stage-management routines in authorized theatre rooms rather than turning into generic retail clerks.

The offline regressions now include finance/teller timing, long-lived wagering, and seven theater workers. In source-only V8 checks, 405 focused finance assertions, 145 theater assertions and 104 two-era/four-route integration assertions passed. A complete Node regression run and Electron hands-on test have **not** been performed. No GitHub Actions or new Linux executable were used.

## Choose your life

| Character | Starting life | What you can pursue |
| --- | --- | --- |
| **Charles “Charlie” Whitcomb** | Owns a small telegraph and electrical component workshop, Federal Electric | Manufacture and deliver actual orders; hire, acquire, invest, socialize, gain influence and possibly enter politics. |
| **Samuel “Sam” Harlan** | Black rookie Metropolitan Police patrolman | Walk the **Hillsdale / Barry Farm** beat, handle neighborhood incidents and station reports, build relationships, advance or leave the force. |
| **Elias “Eli” Crowe** | Unknown doorman at a French nightclub | Work entrance shifts, meet patrons, earn trust or suspicion, and choose whether ordinary employment leads somewhere respectable or dangerous. |
| **Edmund Wardman** | Unfavored son of the wealthy Wardman family, a low-ranking orderly at District Asylum | Work hospital duties, discover institutional politics, pursue advancement or strike out on his own. |

The three characters you do not select lead **autonomous lives within that profile's Washington**. No character is destined to be a murderer, criminal boss, honest officer or tycoon. Four career desk foundations exist now; **Charlie's business gameplay is the most developed**.

## Live in Washington

**Work and the economy.** Produce 1878 telegraph/electrical components at Federal Electric; buy real materials, assemble at a bench, ship orders from actual inventory and collect payments. Business and personal cash remain separate. Sullivan, the workshop's sole paid assistant, earns **$6 for his five-day workweek** and rents a room on the premises for **25¢ a week**, leaving money for food and occasional clothes or repairs. Chinatown's active Market Street has a **finite shared merchant stock**: NPCs and the player purchase from the same inventory and tills. Competing shops, more realistic stock, additional professions and property ownership are planned.

**Explore the city.** The existing **40 numbered destinations** include Federal Electric, Chinatown, Hillsdale / Barry Farm, the Star Club, the Embassy Room, a police station, hospitals, shops, markets, horse liveries, the racetrack and fishing sites. Many rooms have distinct entrance restrictions. Buy or hire horses, keep them physically where you leave them, pay for feed and boarding, and travel between destinations. Fishing has an active tackle, casting and landing system. Some interiors and travel-time calculations remain provisional.

**Meet Washington's residents.** The early cast has expanded to **23 registered named NPC schedules**. The **three playable protagonists you did not select** can join the autonomous city while the player-controlled protagonist is not duplicated. Named residents have provisional routines, occupations and individual conversation cards (historical figures also obey their year restrictions); the player-controlled protagonist is never also spawned as an NPC. They may be absent when you visit. When someone is actually in the same room, select their name to open an individual **character card** with a temporary silhouette, saved conversation history, and unrestricted text entry. No topic menus tell you what to ask. Residents may decline to talk, express individual opinions, or admit ignorance. Each active character now also retains an early private energy, hunger and mood model, shaped by elapsed in-game time and their usual work/rest routine; these conditions influence their willingness to speak. Sullivan's established factory-rented bedroom is now an actual scheduled overnight room, with normal private-door restrictions. Other residents' unconfirmed homes, real travel durations, physical meals and extended life consequences remain unfinished. The current AI is an early combination of individual decision logic and character-specific conversation with an optional local model backend. Residents now also carry private, save-backed **ongoing goals** with bounded evidence of actual work, visits and witnessed social contact, and can revise their priorities when circumstances materially change. Recorded same-room conversations, assistance and disagreements also leave individual first-hand memories, change participants' mood, and influence later social caution or willingness to talk. These consequences belong to the specific residents, not to a globally shared reputation or an automatic friendship. These are records of effort, not proof that a business deal, career promotion or friendship succeeded. Independent housing, fully realistic travel, deeper goals, historically verified knowledge, and mature lifelong memory remain in development. You talk to **characters through their own cards**, never to a separate AI assistant.

**Pass the time your way.** Poker, racing, boxing, private fights and social encounters have existing foundations. A D.C. Sporting Champions register records established titleholders and tournament progress. Betting, persistent championships and venue-specific government authorization are the next major planned expansions. Players can also pursue personal effects, news, markets, music and relationships. **An NPC never advances the world clock on its own**: the clock runs normally, and player activities can advance it explicitly. There is no offline simulation.

**Read and change Washington.** The **one original Washington In and Out Guide map** is permanent for *every playable year*, including 1878 and 1938. Its printed **A–R / 1–30 grid** remains, along with numbered pins, editable profile-local pin names, search, location filters, a directory, and confirmation before a moved pin is saved. History cards distinguish real sites from fictional sites in writing. A **purpose-based pin-color system** is planned; do not interpret the current red/blue artwork as the final palette.

## An evening in Washington

**The Star Club** belongs to **Eleanor Victoria Ashcroft**, known as **Madam Star**, a British proprietor of exceptional discretion. A past president founded the establishment in the fictional history; his identity is not yet chosen. The atmosphere is expensive and rule-bound: high-quality meals, drinks, discreet adult companionship, and accomplished **background musicians, not a stage show**. **There is no poker or card gambling at Madam Star's club.** It is possible to spend hours there rather than perform one isolated interaction. Jazz belongs to later eras; in 1878 the music must be period-appropriate.

At the other extreme, **Lucien Étienne “Lui” Delacroix**, a French gay nightclub owner and Eli's employer, runs a cabaret with can-can/burlesque entertainment and a much more disreputable private world. Public dancing and drinking conceal darker pleasures and crime the player must discover, not simply know at the door. Food and drinks will also be offered. The code still labels the premises **Second Nightclub** until the designed identity is integrated.

**The Embassy Room** is a separate elite card room at the existing Chevy Chase Club location in the game's fictional history, accessible through contacts such as **Harrison Vale**. It is **not** located in Madam Star's club. Ordinary poker also exists at the open-to-all **Boiler Room** and the more selective **Commerce Club**. Commerce and Embassy invitations allow a **trial game**, not immediate membership: polite conduct and sportsmanship can earn a gifted **membership card**; arrogant behavior can bring a temporary refusal and a later retry. Racial and class barriers depend on the institution and its patrons.

**D.C. Poker Challenge** is the planned separate **government-sanctioned five-card tournament**. Under this alternate-history city's rules, gambling is legal **only where government permission applies**; the three standing poker rooms are otherwise unauthorized. Major horse, dog, boxing and later-era automobile competitions can lead toward **monthly D.C. titles**, with bets on heats, individual events and tournament champions. The detailed rules and permitted wagers are still in development.

## A recognizable but different United States

In the game's history, the actual **1861–1865 Civil War** was followed by the replacement of states and old borders with **national districts organized around economic purposes**. The Electoral College was abolished, presidential terms last **ten years**, and there is **no term limit**. **Samuel J. Tilden** won the nationwide popular vote in 1876 and **is president in 1878 in our alternate history**, unlike actual history. His first term runs from **March 4, 1877 through March 4, 1887** unless events cause early succession, with the next regular election in **1886**. Future winners and the exact district constitution remain undecided.

Real historical people will live alongside original characters. Tilden's associates, members of Congress, influential businesspeople and Black Washington entrepreneurs may appear at offices, hotels, social clubs and other appropriate venues. Meet them naturally, build trust, and potentially work toward appointed government service, elected office and political power. **Tilden now has a dated NPC schedule at the White House; other historical encounters and political careers remain in development.** The 1893 World's Fair will take place in Washington in this fictional timeline, opening later industrial possibilities.

Read more: [Character roster](CHARACTER-ROSTER.md) · [Living city and map](WASHINGTON-LIVING-CITY.md) · [Politics and historical people](POLITICAL-WASHINGTON.md) · [Championships and betting](SPORTS-CHAMPIONSHIPS.md).

## Project status and future work

This is a **publicly visible, proprietary development alpha for Linux**, not a finished or accepted release. The current source milestone is **v0.6.90-dev, unaccepted**. The earlier official QA chain was **red**, as documented in the independent October 28 audit. The new local `node tests/run-all.cjs` runner reports every test failure without GitHub Actions. **Full Node QA and Linux Electron gameplay verification are still required.** The prior Linux packaging workflow verified its archive, but delivery through GitHub Actions failed owing to artifact storage quota. **No new accepted desktop executable or validated end-to-end human playthrough can be claimed from that run.**

The game has an existing Washington map, shop/finance systems, timed factory work, basic protagonist jobs, personal records, fishing, transport, and sporting prototypes. The expanded political cast, retail neighborhoods, social venues, tournament system and government gambling law are **development goals**, not false promises that everything is already playable.

[Development roadmap](ROADMAP.md) · [Decisions and guardrails](DECISIONS.md) · [Current NPC AI + Star Club thread handoff](HANDOFF-2026-10-25-NPC-AI-AND-STAR-CLUB.md) · [Technical continuation](CONTINUE-HERE.md) · [Room navigation repair](ROOM-NAVIGATION-REPAIR.md) · [Permanent map rules](MAP-CANON.md) · [LEGAL.md](LEGAL.md).

**Elderred Softworks LLC · DKLab**. Single `main` branch. Changes, acceptance, and release follow explicit owner approval.

### Local quality checks

The repository has **no GitHub Actions**. A developer with Node.js already installed can run `bash scripts/local-source-qa.sh` to check JavaScript syntax and source regressions **without downloading packages, building installers, running cloud workflows or uploading artifacts**. This is not a substitute for real desktop playtesting.
