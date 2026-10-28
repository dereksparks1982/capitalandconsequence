# Capital & Consequence

**One city. Countless lives. Every choice has consequences.**

*Capital & Consequence* is an in-development single-player life simulation in an alternate-history **Washington, D.C., beginning January 2, 1878**. Work, earn a living, go shopping, travel, encounter strangers, form friendships and rivalries, visit clubs, gamble, compete, and discover the consequences of choices years later.

**Federal Electric is the company you own. Washington is the world you inhabit.**

## Current development checkpoint: v0.6.90-dev (28 October 2026)

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
