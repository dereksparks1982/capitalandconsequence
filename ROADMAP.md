# Federal Electric Roadmap

Federal Electric is a long-save historical industrial, financial, social, and political life simulation beginning in Washington, D.C. in 1938.

## Locked rules

1. Main branch only unless Derek authorizes otherwise.
2. Federal Electric is always the core company.
3. Corporate spreadsheet/paperwork presentation in deep navy, ivory, and restrained red.
4. Company money and personal money stay separate.
5. Federal Electric starts private; IPO is optional.
6. Each active date has a 60-minute Business Day followed by a 60-minute Washington Night.
7. No offline progression.
8. No universal morality meter.
9. Historical specifics are researched.
10. Information can be incomplete or wrong depending on its source.

## v0.3.6-dev — Day/Night, Fight World & Treasury — CLOSED BUILD

Implemented foundation:
- 60-minute Business Day followed by 60-minute Washington Night — IMPLEMENTED FOUNDATION
- night-gate factory and contract actions so Washington Night is not a second unrestricted business shift — IMPLEMENTED
- Business Day closing bell → Washington Night → mandatory Daily Report → next morning — IMPLEMENTED FOUNDATION
- freeze on hidden/closed app and exact resume from autosave
- 50-security Federal Exchange with hidden intraday market movement; the player sees the published opening quotation until the closing bell — IMPLEMENTED
- hidden closing quotations are revealed at the close and become the next-day opening basis — IMPLEMENTED
- hidden market also advances during instant world-time jumps such as Star Club visits, contract searches, simulated poker, underworld lead-chasing and factory changeovers — IMPLEMENTED
- shared market tone + sector + company movement components
- red/white/blue Washington corporate UI
- daily Federal Electric payroll/ledger
- living Metropolitan Ledger framework
- newspaper edition archive
- personal journal that automatically records important meetings, conversations and poker sessions
- separate executive contact-card file for people actually met
- persistent contact data foundation
- The Star Club and Madam Star
- poker auto-resolution uses tiered time costs: Neighborhood 5 min, Commerce Club 10 min, Embassy Room 25 min; cash, progression, factory-away, Journal and raid consequences are preserved — IMPLEMENTED
- manual poker displays remaining business-day time and charges actual elapsed table time on exit — IMPLEMENTED
- production-time migration/normalization prevents impossible legacy estimates beyond the intended 10/20/30-minute order bands — IMPLEMENTED
- Neighborhood Game is available by default; no Eddie gate and no win grind required.
- Meeting Eddie Doyle unlocks/invites the player into the Commerce Club mid-tier game.
- Commerce Club play can lead to meeting Harrison Vale, who may later invite the player to the Embassy Room elite game.
- poker music UI removed from current scope
- three Washington poker circles: neighborhood/working-class, commercial/professional, and elite private-society games
- poker launches in a separate dedicated game window rather than an in-page modal
- daily game supply: up to 5 neighborhood, 3 commercial, and 1 elite game available to the player
- elite game remains hidden/locked behind introductions and connections
- different stakes, access, patrons, information value, and police risk by poker circle
- poker raids are rare events rather than an every-visit trap
- independently scheduled Star Club raids
- Star Club/brothel raids are deliberately much rarer, targeted around an average of roughly twice per year
- newspaper consequences for attended or missed raids
- v0.1/v0.2 save migration

Implemented Working Factory foundation:
- Contracts department nested inside the Factory navigation
- one starting Capital Hardware & Supply Co. contract
- contract-defined quality, quantity, price and deadline
- continuous live production tied to the business-day clock
- large visible production progress bar and unit counter
- materials and operating cost consumed as units are produced
- 15-minute Brief and 30-minute Afternoon Star Club visits advance the factory while consuming the owner's time — IMPLEMENTED
- semi-uncommon unattended breakdowns; foreman may repair them or require executive authorization
- customer record tracks correct completions and late/short work

Next v0.3 passes:
- multiple simultaneous customer contracts and player-controlled production queue priority — IMPLEMENTED FOUNDATION
- seek-new-contracts action with variable availability and a 2-minute business-time cost — IMPLEMENTED FOUNDATION
- roughly 10/20/30-minute small, medium and large production runs — IMPLEMENTED FOUNDATION
- overcommitment warning without preventing risky contract acceptance — IMPLEMENTED FOUNDATION
- arbitrary stock order quantities, Buy/Sell/Sell All, visible buying cash, and realized P/L — IMPLEMENTED
- contract offers increasingly shaped by reputation and customer history — IMPLEMENTED FOUNDATION
- customer-specific buyer personalities and specification tolerance — IMPLEMENTED
- wrong-quality shipment rejection, discounted acceptance and replacement obligations — IMPLEMENTED FOUNDATION
- partial delivery where the contract/customer permits it — IMPLEMENTED
- grade-specific finished inventory and production-grade selection — IMPLEMENTED
- player-controlled production quantity is independent of contract quantity; production runs may be shorter than the order or exceed it, with runtime scaling to the chosen quantity and surplus remaining in finished inventory — IMPLEMENTED
- production-grade changeover time — IMPLEMENTED FOUNDATION
- contract reliability affects future terms and customer relationships — IMPLEMENTED FOUNDATION
- richer daily factory demand and sales
- historically researched 1938 market regimes and dated historical news
- richer company fundamentals and market-moving news
- broker tips, rumors, limit orders, and delayed execution where appropriate
- deeper newspaper sections and multi-day story chains
- automatic notebook entries for selected conversations
- NPC truth/mistake/betrayal logic
- Commissioner Hayes and police-information system
- bookmaker wagers and horse-racing integration — IMPLEMENTED FOUNDATION
- advance race betting on any established field, automatic settlement while away, and chronological Race & Wager Ledger — IMPLEMENTED
- playable browser-native Texas Hold'em table with AI opponents — IMPLEMENTED FOUNDATION
- distinct visual rooms: shady Boiler Room, respectable Commerce Club, and elite Embassy Room — IMPLEMENTED
- full hand dealing, blinds, flop/turn/river, fold/check/call/raise, hand evaluation and showdown — IMPLEMENTED
- improve AI from personality-weighted heuristic play toward Monte Carlo/opponent-model behavior
- add correct multi-way side pots/all-in reopening rules before calling poker rules-complete
- persistent named opponents, table history and social networks in each poker circle
- legal exposure/arrest/court consequence chain
- society invitations and recurring Washington locations

## Primary navigation consolidation — IMPLEMENTED

- primary sticky navigation reduced to **Executive Desk**, **Factory**, **Markets & News**, **Journal**, and **Pastimes**
- **Factory** contains Production and Contracts
- **Markets & News** contains Federal Exchange and Metropolitan Ledger
- **Journal** contains **Journal**, **Contacts**, **Info**, and **Help**; Help opens the in-game **How to Play** manual
- **Pastimes** contains Legal Sports and Illicit Activities
- selected top-level and secondary section buttons display blue with white text
- pause still returns to Executive Desk and disables/grays out gameplay navigation and controls
- existing gameplay systems and section IDs were retained; this slice reorganizes access without rewriting mechanics

## v0.4 — Company Operations — CURRENT

- **4 playable business turns per calendar month**; the numbered main campaign runs January 1938 through September 1945 for **372 turns**, after which the player may continue the same save in unlimited free play — IMPLEMENTED FOUNDATION
- **Warehouse separation:** production creates inventory, contracts create obligations, and shipping connects the two — IMPLEMENTED
- raw materials live under **Factory → Warehouse** — IMPLEMENTED
- [x] Raw-material stock counters refresh live during production, so copper, glass and tungsten visibly fall as finished bulbs are created without resetting Warehouse trade inputs.
- grade-specific finished-goods inventory and production-lot records — IMPLEMENTED FOUNDATION
- player-controlled production quantity is independent of contract quantity; overproduction remains in Warehouse stock — IMPLEMENTED
- manual contract fulfillment from Warehouse; no automatic end-of-turn shipment — IMPLEMENTED
- contract delivery windows are turn-based per contract: ordinary work generally allows 4 turns, urgent work may be same-day or 2-turn rush, and large/major orders can span 6, 8, or 12 turns across multiple months — IMPLEMENTED FOUNDATION
- unfinished production can be paused or switched only with confirmation; manufactured goods remain in Warehouse and progress is retained — IMPLEMENTED
- production policy: Quality Priority / Normal / Rush, trading speed against defect risk — IMPLEMENTED FOUNDATION
- workforce aggregate model: attendance, tardiness, absence, skill, morale, discipline, efficiency and quality — IMPLEMENTED FOUNDATION
- exception-based personnel discipline so individual workers surface only when executive attention is warranted — IMPLEMENTED FOUNDATION
- weather and operating conditions can affect attendance, output and utility reliability — IMPLEMENTED FOUNDATION
- Federal Electric begins dependent on purchased utility power; outages can stop the line while the clock continues — IMPLEMENTED FOUNDATION
- internal rejects and latent defects tied to production conditions; finished lots preserve QC history and customer defect claims can create refunds/replacement obligations — IMPLEMENTED FOUNDATION
- durability, failures, returns and warranty expense beyond the current defect-claim foundation
- historically researched wage system, hiring, retention, morale, skill and labor trouble
- [x] Closing bell stops unfinished production and requires an explicit player restart on the next Business Day; forgotten restart time is lost.
- machinery breakdowns, maintenance and upgrades
- suppliers/material depth, including strategic stockpiling and future wartime restrictions
- warehouse capacity, carrying cost and expansion
- multiple production lines and capital machinery purchases
- debt, loans, interest, assets, liabilities and net worth
- additional electrical product lines and tooling
- plants and additional warehouses
- delegation/management so a larger company can buy back some of the owner's time

## v0.5 — Living America

- researched historical timeline
- original period-style reporting of researched real events
- fictional local/economic stories driven by simulation
- continuing stories across newspaper editions
- source/provenance records for historical facts
- economy affecting markets, materials, demand and credit

## v0.6 — Washington Network

- bankers, lawyers, journalists, politicians, police, lobbyists and industrialists
- persistent NPC memory and hidden motives
- clubs, hotels, dinners, affairs, favors, grudges and rivalries
- bribery/corruption choices represented as game decisions and consequences
- unreliable tips and deliberately false information
- raids, investigations and scandals
- government procurement and influence

## v0.7 — The Gathering Storm / Arsenal

- European war and rearmament
- exports, shipping and commodity pressure
- government contracts and factory conversion
- researched aircraft/electrical/communications components
- inspections, deadlines, shortages and rejected lots
- legitimate profit and optional corner-cutting with long-memory consequences

## v0.8 — Public Federal Electric

- [x] Executive Desk scaffolding: `Explore Public Offering` opens a planning panel with live company indicators and placeholders for offering structure, underwriting, governance, founder control, and eventual Federal Exchange listing. No shares are issued yet.
- optional IPO
- valuation and percentage offered
- founder ownership and public float
- major shareholders
- board composition and voting control
- dividends, dilution, additional offerings and buybacks
- FE stock responding to actual company results and scandals
- shareholder and board confidence
- founder removal when control has genuinely been lost
- permanent ouster as a possible loss/legacy ending

## v0.9 — The Man Behind the Company

- property, family, affairs, friends and rivals
- luxury spending and personal debt
- clubs, travel, poker, horse racing and bookmakers
- personal scandals interacting with Federal Electric
- investigations, lawsuits, reporters, whistleblowers and prison exposure

## v1.0 — Federal Electric

Unify industrial operations, the living business day, markets, history, Washington, personal life, law, public-company control, newspapers and long-term legacy into one continuous simulation.

## Post-1.0

Postwar reconversion, consumer boom, Cold War industry/electronics, acquisitions, unions, R&D, patents, advertising, family succession, deeper politics, and a save-specific biography/newspaper archive.


## Stabilization queue — v0.3.6-dev

- [x] Persistent top header/navigation restored in an isolated HTML/CSS slice and accepted.

Work is performed one slice at a time on `main`, with each slice verified before moving to the next.

- [x] New Game control is visually separated from End Day Early so the destructive reset is not adjacent to the routine day-close action.

- [x] Remove manual Save/Load controls; autosave is authoritative; rename New Company to New Game with destructive-progress confirmation.
- [x] Poker clock initialization uses the current Federal Electric business-day time rather than resetting to 60:00.
- [x] Poker elapsed time is no longer deducted a second time when the main business clock has already been running.
- [x] Pre-flop folding no longer sends an incomplete board into the seven-card evaluator.
- [x] Correct poker betting-round action closure and all-in/side-pot behavior.
- [ ] Make poker window-close/quit settlement unavoidable and consistent.
- [ ] Audit and rebalance light-bulb unit economics, payroll, contract prices, and 1938-scale costs.
- [ ] Correct selected production-grade material/cost consumption.
- [ ] Audit partial shipments, wrong-grade settlement, replacement inventory, deadlines, and repeated late penalties.
- [x] Add two Star Club daytime visit lengths: Brief Visit and Afternoon Visit.
- [x] Phase-specific Star Club controls: Brief/ Afternoon by day and Brief Evening/ Evening at night, with different encounter pools.
- [ ] Reset/schedule Star Club raids correctly across dates and weekdays.
- [x] Reposition Federal Exchange trade quantity directly above Buy/Sell controls for rapid trading.
- [ ] Preserve typed Federal Exchange quantities across five-second market rerenders; previous attempt was rolled back with the broken UI build.
- [ ] Historical/name verification pass for 1938 Washington titles, wages, and fictional entities.
- [x] Bring MARKET-DESIGN and core project documentation into sync with hidden intraday quotations, race betting v2, and the current roadmap.
- [x] Make stock tickers and company names open a Security Record with a quotation graph and historical ledger.
- [x] Seed every Federal Exchange security with 90 pre-game trading sessions before January 3, 1938 and merge that history into older saves so Turn 1 has a meaningful chart.
- [x] Expand Security Records with date range, prior close, day move, total record move, record high/low and the full stored quotation ledger.
- [x] Port Georgia Sun horse-racing foundation into a Federal Electric scheduled meeting: persistent horses, four heats, two semifinals, Main Event, visible progression, Win/Place/Show betting, live attended-race animation, and automatic mid-day schedule.
- [x] Replace the attended horse-race straight progress bars with a reusable oval-track display shaped like the race course.
- [x] Add scheduled Dog Racing with Win/Place/Show wagering and the reusable oval-track display.
- [x] Add scheduled Midget Car Racing with persistent cars/drivers, mechanical reliability/failures, Win/Place/Show wagering and the reusable oval-track display.
- [x] Add closable activity panels to Legal Sports and Illicit Activities so only the selected pastime needs to be expanded; closing a panel never stops world simulation.
- [x] Open Horse Racing by default when entering Legal Sports and keep Dog Racing/Midget Car Racing post-time displays counting down live alongside the existing horse and boxing clocks.
- [x] Add visible game version `v0.4.0` at the far top-right of the blue masthead, separate from save-schema version 12.
- [x] Replace the monthly status marker with a global campaign counter such as `TURN 2/372`; 372 turns equals four turns per month from January 1938 through September 1945.
- [x] Add a Turn 372 campaign-complete summary with **Continue Empire** for unlimited free play or **Start New Game**.
- [x] Style the full game surface as a 1930s executive desktop: dark wood across the outer margins and primary-navigation strip, with the green-felt main workspace inset into the wood and paper records layered on top.
- [x] Fix Journal note-entry sizing so the note and source fields remain readable instead of clipping their text.


## Blackmail / leverage system — planned

- Add a two-way leverage system: the player can be blackmailed, and the player can hold compromising information about NPCs.
- Potential targets include fictional industrialists, bankers, police contacts, society figures, lobbyists, and fictional political candidates encountered through Washington locations such as the Star Club.
- Leverage should come from simulated evidence or witnessed events, not omniscient knowledge. Track source and strength such as rumor, credible evidence, or documented proof.
- Player choices stay abstract: keep the information private, confront the target, seek a favor/payment, trade the information to another contact, or disclose it.
- Targets can comply, refuse, retaliate, counter-blackmail, go to police/reporters, damage Federal Electric, or become a permanent enemy.
- NPCs can use the same system against the player when they learn about scandals, illegal gambling, affairs, corruption, or other compromising events.
- Real historical political figures require sourced historical treatment; generated compromising scandals should use fictional characters rather than inventing defamatory claims about real people.

- [x] Poker progression revision: Default Neighborhood access; Eddie Doyle unlocks Commerce Club; Commerce Club play can introduce Harrison Vale; Vale invitation unlocks Embassy Room.


## End Day Early event pool — planned

Ending the business day early will eventually roll a small consequence event rather than being a consequence-free skip. Events can be beneficial or harmful and should come from the living company/world rather than a morality meter.

Possible positive outcomes include a foreman using the quiet period for useful maintenance, a supplier returning a favorable call, an employee catching a problem before the next morning, or a useful social/business message arriving after the owner leaves.

Possible negative outcomes include a missed customer call, a contract lead going elsewhere, an unattended production or staffing problem, unfavorable gossip, a supplier issue, or a missed Washington contact opportunity.

The event must be recorded in the Journal/company record when the player would reasonably know about it. The pool should be weighted and contextual rather than firing the same generic event every time.


## Implemented two-phase day / night system

The active date now uses two distinct one-hour phases rather than one unrestricted business clock.

### Hour 1 — Business Day
- Federal Electric factory, contracts and suppliers active
- Federal Exchange open with hidden intraday movement
- Capital Race Grounds active
- Madam Star daytime encounter pool
- daytime-only contacts and opportunities
- occasional private prizefights may compete with legitimate work for the player's time

### Hour 2 — Washington Night
- Federal Exchange closed with final quotations posted
- ordinary factory/contract/supplier controls closed
- licensed boxing active under Legal Sports
- poker, cockfighting, private prizefights, bookmaker leads and other illicit opportunities may be available
- Madam Star evening encounter pool
- **Brief Evening Visit** and **Evening Visit** implemented
- conflicting events intentionally prevent the player from doing everything

### Day transition
- the private Daily Report follows Washington Night
- the report covers company results, stocks, personal cash, wagers, treasury activity, contacts and notable events
- the Metropolitan Ledger is delivered at the beginning of the next in-game day
- major public racing/boxing results can appear in the next morning's Sports section
- scheduled world events continue to resolve on the authoritative clock while the player is elsewhere

## Strategic share ownership — planned

Stock purchases are not merely score-like investments. Shares represent ownership.

- no arbitrary cap on how much stock the player may buy when cash and actual market availability permit
- later public companies have finite outstanding shares and the player's percentage ownership becomes visible
- significant holdings can create strategic influence, board opportunities, negotiated partnerships, takeover attempts and merger paths
- corporate-control systems should surface as event chains and major decisions rather than dense securities-law micromanagement
- Federal Electric can eventually be vulnerable in the same way after an IPO: dilution, outside accumulation, proxy/control fights and possible loss of the company
- takeover, merger, disclosure and antitrust mechanics require historically researched rules before implementation


## Legal Sports / Illicit Activities expansion

### Legal Sports
- rename the current Race Track navigation area to **Legal Sports** — IMPLEMENTED
- Capital Race Grounds operates during the Business Day — IMPLEMENTED
- licensed boxing cards operate during Washington Night — IMPLEMENTED FOUNDATION
- persistent boxers, records, styles, condition, injuries and fight history — IMPLEMENTED FOUNDATION
- Commission Fighter Registry exposes the persistent roster, records, condition and medical status — IMPLEMENTED
- scheduled undercards and main events — IMPLEMENTED FOUNDATION
- fight betting with no arbitrary game-imposed cap; any limit must come from a researched or in-world reason — IMPLEMENTED
- fight results and wagers settle on the authoritative world clock whether the player attends or not — IMPLEMENTED
- major horse-racing and licensed-boxing results feed the next-morning Sports section of the Metropolitan Ledger — IMPLEMENTED FOUNDATION

### Illicit Activities
- **Illicit Activities** is the player-facing underworld category — IMPLEMENTED
- backroom poker remains part of this category
- add private prizefights and cockfighting as independently discoverable activities — IMPLEMENTED FOUNDATION
- chronological Underground Ledger records completed private fights, cockfights and the player's wager results — IMPLEMENTED
- private prizefights may be scheduled during the day or at night, creating direct competition with work and legal activities — IMPLEMENTED FOUNDATION
- underground activity is invitation/contact driven rather than presented as a complete menu from game start
- multiple discovery routes: bookmaker, licensed boxing contacts, Madam Star, poker contacts and other future underworld NPCs — IMPLEMENTED FOUNDATION
- the bookmaker becomes a recurring source of leads, betting information and invitations rather than a single-use unlock — IMPLEMENTED FOUNDATION
- race-track attendance can introduce Eddie Doyle naturally, creating another route into the bookmaker network — IMPLEMENTED


## Owner treasury / corporate misuse

- Persistent company/personal cash balances in the fixed header — IMPLEMENTED
- Recorded owner distribution from company cash to personal cash during the Business Day — IMPLEMENTED FOUNDATION
- Divert company funds into personal cash for personal spending/gambling — IMPLEMENTED FOUNDATION
- no arbitrary transfer ceiling beyond Federal Electric's available company cash — IMPLEMENTED
- track diverted funds as an unexplained corporate shortfall rather than an operating expense — IMPLEMENTED
- track cumulative accounting exposure and diversion count — IMPLEMENTED FOUNDATION
- include recorded distributions, diverted funds, unaccounted funds and exposure in the Daily Report — IMPLEMENTED
- later consequences may include accountant/board/shareholder scrutiny, blackmail, financing problems, investigation and public-company governance consequences


## LATER — Accounts, Global Chat & Global Rankings

This remains planned after the current Company Operations deepening work. It is no longer the immediate active milestone.

### Slice 1 — Accounts and durable saves
- account identity and sign-in
- one account can load the same Federal Electric save across supported devices
- cloud save record stores the complete simulation state
- every save has an explicit schema/save version
- migrations upgrade older saves forward rather than discarding progress
- preserve a local browser copy as an emergency fallback
- detect local/cloud divergence instead of silently overwriting the newer state
- autosave remains the normal player workflow
- server-side account data becomes the durable long-term copy once connected
- protect against a new front-end build resetting a valid existing save
- GitHub Pages may remain the static front end; backend architecture is documented separately

### Slice 2 — Global Chat
- shared account-backed global chat
- persistent display identity separate from private account credentials
- server timestamps
- rate limiting / flood protection
- basic moderation controls
- chat failure must never block saving or playing
- no direct-message system in the first slice unless separately approved

### Slice 3 — Global Rankings
- account-backed leaderboard
- rankings use server-stored/validated state, not arbitrary values supplied directly by the browser
- initial candidate categories: Federal Electric company value, personal net worth/wealth, and later additional clearly defined categories
- no single opaque composite score until its formula is explicitly designed and approved
- rankings must tolerate save-version migrations without wiping historical players

### Online architecture
- preserve the current GitHub Pages front end if practical
- add a backend for authentication, save/load, chat and rankings
- Cloudflare Worker + durable data storage is the current preferred direction because the project already uses Cloudflare elsewhere
- exact authentication method, database layout, session model and realtime-chat transport are implementation decisions for the account slice

## Post-online polish / known backlog

- stock quantity entry persistence through market/table rerenders remains a separate stabilization item until verified
- deeper poker correctness, including side pots/all-in reopening and direct-close settlement
- deeper historical research for horse betting, boxing wagering and underground activity


## Title-screen office, profiles and Archives — 2026-10-04

Implemented:
- [x] Approved 1930s executive-office title artwork remains the visual baseline; interactive features use overlays rather than repainting unrelated objects.
- [x] Framed Washington, D.C. wall map opens the 1938 **Washington In and Out Guide** in a pan-and-zoom viewer.
- [x] Title-screen Metropolitan Ledger can be opened from its existing hotspot.
- [x] Opening the current newspaper edition charges **3¢ once** to the most recently played profile's **Personal Cash** and records that edition as purchased for that profile.

Implemented menu foundation:
- [x] Consolidate the title menu to **Continue → Profile → Options → Archives**.
- [x] **Profile** replaces separate Load Profile / New Profile title buttons while retaining profile creation, loading and deletion in one manager.
- [x] **Options** replaces the modern-sounding Settings label; its drawer is reserved for future approved options.
- [x] **Archives** now occupies the fourth title drawer as a reserved entry point. Archive content remains planned and will be profile-specific, containing only material that profile actually acquired, purchased, discovered or unlocked.

Approved next work:
- [ ] Build a newspaper archive that shows owned issues as miniature dated front pages and lets purchased issues be reopened without another charge.
- [ ] Generate or hand-author dozens of Metropolitan Ledger editions that advance with the save's historical date. Major historical issues can be handcrafted; ordinary issues can use a reusable newspaper layout populated by the simulation.
- [ ] The title-screen newspaper should eventually reflect the date/state of the most recently played profile rather than remaining a single fixed issue.
- [ ] Use the same tall-card gallery concept proven in the Hanafi card project for the Federal Electric collectible-card archive, with period-appropriate Federal Electric styling.
- [ ] Add a discreet period film canister on the shelf behind the horse and plant near the lamp. It should be partially obscured and use a normal hand pointer as the hotspot.
- [ ] Correct the plant/decanter visual overlap by adding a small planter/base behind the decanter and redirecting only the plant's lower stems. Do not alter the approved horse, lamp, shelf, clock, fan or other unrelated title artwork.

### Motion-picture system — planned

- [ ] The film canister opens a period **Motion Picture** / theater selection rather than a modern streaming library.
- [ ] Standard admission target: **25¢** per showing; major first-run/premiere target: **40¢**. These are gameplay rates grounded in period admission ranges and remain subject to venue-specific historical research.
- [ ] Admission is charged from the last-played profile's **Personal Cash** every time a film is attended. Paying does not grant home ownership of the movie.
- [ ] Theater playback intentionally has **no pause, rewind, fast-forward, scrubbing or resume bookmark**.
- [ ] The picture keeps running while the player is away from the keyboard or another browser tab is active. Leaving early means the missed portion is missed.
- [ ] Returning for another showing requires another ticket and begins a new showing from the start.
- [ ] Archives may preserve a ticket stub, poster/program entry, viewing date or attendance record after a movie has been seen, but the archive does not provide free replay.
- [ ] Only films/assets whose U.S. rights status has been individually verified may be bundled or served by the project.

## Title-screen radio network — 2026-10-04

Current implementation:
- [x] Lower radio dial advances through stations.
- [x] Radio power is a separate invisible hotspot over the square panel on the left side of the approved radio artwork; the tuning dial remains tuning-only.
- [x] A temporary station label appears above the radio after tuning and shows station number, dial position and station name.
- [x] The radio now runs through a dedicated Federal Electric broadcast engine in `radio/radio-engine.js`.
- [x] Howler.js Core 2.2.4 is vendored under `vendor/howler/` with its MIT license.
- [x] Station definitions are separated into `radio/stations.js` so programming and media sources can change without rewriting the title-screen controls.
- [x] **Station 1 · 610 AM · Federal Electric Network** is the title/theme station and intentionally restarts from 0:00 when tuned back in.
- [x] **Station 2 · 540 AM · Capital Signal** is the static / experimental-signal frequency.
- [x] **Station 3 · 720 AM · Capital Radio Theatre** carries the October 30, 1938 Mercury Theatre / Orson Welles *War of the Worlds* broadcast.
- [x] **Station 4 · 880 AM · Capital Melody** carries the complete user-supplied 1930s music program, using a radio-optimized 64 kbps game copy of the untouched original recording.
- [x] Live-style stations derive position from an absolute broadcast clock. Radio power controls audibility only and does not create a listener resume point.
- [x] The game PAUSE button is a master audio pause for the title soundscape. On PLAY, live stations resynchronize to the point their broadcast clock has reached.
- [x] Daytime Washington city ambience remains independent of radio tuning and is mixed at **7% desktop / 2% mobile**.
- [x] Large radio media is stored outside the source repo when appropriate. Current Orson and music copies are staged in the **Federal Electric Radio** Google Drive folder.

Hosting / release work:
- [ ] Make Drive-hosted radio media available through a stable public/link-access streaming URL before treating those assets as production-public. The current connected Drive tool can upload files but cannot grant unrestricted public-link access.
- [ ] Replace any temporary remote-media URL in `radio/stations.js` without changing station logic once the final public host is confirmed.
- [ ] Prefer GitHub for small audio assets and Drive or another approved media host for oversized recordings.

Authoritative station behavior:
- [x] **Station 1 is the exception to live broadcasting.** Every tune-in begins the Federal Electric theme from 0:00 rather than joining an independent broadcast clock.
- [x] True broadcast stations do **not** remember the listener's progress. Their programming advances according to the station clock whether the radio speaker is on or off.
- [x] Tuning into a real broadcast joins whatever point is currently on the air.
- [x] Radio OFF never pauses a live station. Turning it back on resynchronizes to the current on-air position.
- [ ] Persist the station epoch across full page reloads if we decide broadcasts should remain phase-locked across reloads rather than beginning a fresh broadcast day when the title page is opened.
- [ ] Grow Capital Radio Theatre into a clockwheel of multiple Mercury Theatre / radio-drama programs rather than a user-selectable episode list.
- [ ] Reserve some drama programs for historically/thematically suitable evening slots. *Dracula* remains a specific nighttime candidate.
- [ ] **Capital Signal remains static during the day.** After evening begins, period-appropriate Morse material may emerge from the static. The exact recording/message is not yet approved.
- [ ] Add station IDs, announcer links, period advertisements, sponsor breaks, news bulletins and weak-reception segments so stations become full programmed broadcasts rather than single-file loops.
- [ ] Build reusable clockwheel categories such as MUSIC → STATION ID → MUSIC → ADVERTISEMENT → NEWS → MUSIC.
- [ ] Add other weak or distant stations only when they sound like fixed frequencies with reception variation, not like an artificial retuning effect.
- [ ] Historical news interruptions should reflect period network bulletins, not the later Emergency Broadcast System.

### Mobile / device audio mix roadmap

- [x] Mobile Washington street ambience reduced to **2%** while desktop remains **7%**.
- [ ] Add a device-specific title-audio mix layer so ambience, radio and future sound effects can each have separate desktop/mobile gain without changing station programming.
- [ ] Test iPhone playback through the handset speaker pair, headphones and external Bluetooth audio before locking radio gain.
- [ ] If needed, add a conservative mobile-only EQ / compression profile to tame harsh phone-speaker playback without degrading desktop audio.
- [ ] Keep audio routing under the browser/OS. Federal Electric should adjust mix and dynamics, not pretend it can select a particular physical iPhone speaker.
- [ ] Add an Options control later for master volume, radio volume and ambience volume after the current title-screen presentation is stable.
