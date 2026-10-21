# Federal Electric Roadmap

Federal Electric is a long-save historical industrial, financial, social, and political life simulation beginning in Washington, D.C. in 1890, with later decades and locations unlocked as history progresses.

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

## v0.4 — Company Operations — CLOSED MILESTONE

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

## v0.4.0 title-screen / Washington office pass — 2026-10-05 — CLOSED BUILD

Accepted closeout state:
- [x] **Step Away From Desk** returns a loaded playthrough to the office/title hub while the simulation continues; Continue returns directly to the desk.
- [x] Draggable/collapsible **DEV PANEL** is session-only and includes Day/Night, Infinite Money, Freeze Time, Show Hotspots, Outside Noise, and Reset Overrides.
- [x] Infinite Money preserves the real saved company/personal balances instead of writing the cheat balance into the save.
- [x] Approved day/night office art follows the playthrough phase; weather does not select the background.
- [x] Real Washington clock display remains independent of the playthrough phase because no in-game analog-time mapping has been approved.
- [x] Washington wall map supports pan/zoom, six numbered markers, click-for-details cards, draggable pin editing, local position persistence, Reset Pins, and mobile-visible labels.
- [x] Existing pin click descriptions were preserved when labels were restored.
- [x] Filing-cabinet title labels were enlarged without resizing the approved brass plaques or changing unrelated artwork.
- [x] Outside ambience can be isolated with the session-only DEV PANEL toggle.
- [x] Final code baseline before documentation closeout deployed successfully on GitHub Pages at commit `4c645b2489b62b999fbb27c855002ddd710f90cf`.
- [x] README, Roadmap, build snapshot and handoff refreshed for thread/build closeout.

Next engineering slice after this closed build remains the first unchecked stabilization item:
- [x] Audit and rebalance light-bulb unit economics, payroll, contract prices, and 1938-scale costs. 1938 electrical-manufacturing wage anchor is 80¢/hour; raw-material inventory now uses production-stock units rather than treating bulk commodity prices as per-bulb costs.


## v0.5 — Living America / Washington Power — CLOSED BUILD

Closed release: **v0.5.0** · accepted gameplay baseline `46d8b4d565cb1ee5e7f3695e9df40628fd4bf56a`

- [x] Begin factory delegation foundation with Foreman Sullivan routine morning auto-start, explicit non-routine holds, and management alerts.
- [x] Add researched paid General Manager / executive management hiring, compensation and competence traits. The first General Manager uses the 1939 Census median annual income for male year-round full-time managers/officials/proprietors ($2,254) as the pay anchor, converted to a Business-Day wage; competence and reliability are explicit simulation traits and serious breakdown handling can still fail.
- [ ] Let delegated management make fallible decisions: repair delays, purchasing errors, labor disputes, missed deadlines and judgment calls can still reach the owner.
- [ ] Make unresolved management problems compound into lower output, lost customers, cash pressure, layoffs and eventually possible plant closure rather than turning delegation into passive guaranteed income.
  - [x] Management-neglect foundation: serious production holds and unresolved personnel matters age across Business Days, reduce factory output, and begin eroding morale/discipline; resolving problems gradually works the score down. Customer loss, layoffs and closure remain later escalation layers.
- [ ] Build a Washington influence / power-broker progression fed by business reputation, clubs, press, police, bankers, lobbyists, officials and political contacts.
- [ ] Alternate-history civic rule: the early presidentially appointed Washington mayoralty survives into the Federal Electric timeline instead of being abolished; a sufficiently powerful player may eventually seek a presidential appointment as Mayor of Washington, D.C.
- [ ] Mayor gameplay should shift part of the simulation from company operations to city administration, appointments, budgets, public pressure, favors, scandals and competing interests while Federal Electric continues under delegated management.

- researched historical timeline
- original period-style reporting of researched real events
- fictional local/economic stories driven by simulation
- continuing stories across newspaper editions
- source/provenance records for historical facts
- economy affecting markets, materials, demand and credit

## v0.6 — Washington Network — NEXT BUILD

### v0.6.0-dev — Washington city / room foundation

- [x] Add a **character-agnostic Washington city registry** so locations belong to the world rather than to one protagonist's story.
- [x] Add reusable location → room structure with a default room per location.
- [x] Seed the current map venues into that registry without changing the user's existing six pin IDs or saved pin placement.
- [x] Register **White House**, **Washington Arena**, **Washington Airport**, and **Metropolitan Police** as additional city locations even though their final map pins/interiors are not assigned.
- [x] Add a neutral **placeholder room shell** so locations can exist and be tested before artwork is commissioned.
- [x] Add **DEV PANEL location + room teleport controls** that bypass normal discovery/access rules for testing.
- [x] Connect the existing Washington map location cards into the same room framework with a player-facing **Go There** action.
- [x] Persist a character/story current-location record separately from DEV teleport state.
- [x] Add reusable room navigation furniture: Return to Map, Return to Executive Office, and an internal room directory ready for multi-room locations.
- [x] Keep DEV teleport free and non-destructive to the saved character location.
- [x] Add a packaged-runtime offline audit so gameplay assets/scripts cannot silently regain remote dependencies.
- [x] Expand the Linux smoke test to verify packaged DOM/city registration, renderer localStorage persistence across reload, desktop-width overflow, and a real local poker popup.
- [x] Add local desktop diagnostics for startup, failed loads, renderer/process crashes and renderer console errors. No telemetry or network reporting.
- [ ] Add story/player-specific discovery, invitations, influence gates, travel time and access rules outside the city registry.
- [ ] Add final room artwork only after individual locations are approved.
- [ ] Reuse the same Washington city registry for future playable characters and separate stories.

Carry-forward engineering from the v0.5 closeout:
- broaden fallible delegated-management decisions and incidents
- extend management neglect into customer loss, cash pressure, layoffs and possible plant closure after balancing
- begin the Washington influence / political-progression state model

Planned network expansion:
- bankers, lawyers, journalists, politicians, police, lobbyists and industrialists
- persistent NPC memory and hidden motives
- clubs, hotels, dinners, affairs, favors, grudges and rivalries
- bribery/corruption choices represented as game decisions and consequences
- unreliable tips and deliberately false information
- raids, investigations and scandals
- government procurement and influence

## 2026-10-21 — Washington map site restoration (code candidate; not accepted)

The map's six original code defaults had never been reconciled with the October 5 venue decisions. The later 1890 slice registered Chinatown, a Russian meeting hall and World’s Fair grounds as unpinned rooms. Two earlier requested pin locations, Capitol Airport and the University of Maryland, were missing.

The city registry now supplies **eleven numbered map pins**. The original six IDs and numbers remain stable, but their default **positions and area descriptions are intentionally changed**, not preserved:

1. Federal Electric Factory: Ivy City, New York Avenue NE near Fenwick Street.
2. Star Club: surviving Hay-Adams houses, 16th and H Streets NW. Pin label stays “Star Club”; Madam Star is in details.
3. Capital Race Grounds: Benning Race Track, around Kenilworth Avenue and Jay Street NE; alternate-history operation.
4. Neighborhood Game: Colonial Village, northern Washington; **provisional placement**, not an earlier confirmed user choice.
5. Commerce Club: the weekly pilots’ poker game inside a Washington-Hoover Airport hangar in Arlington; no separate Washington-Hoover pin.
6. Embassy Room: Chevy Chase Club, 6100 Connecticut Avenue, Chevy Chase, Maryland.
7. Old Chinatown: original Pennsylvania Avenue NW community by Center Market.
8. Russian Trade Hall: proposed Dupont Circle / Massachusetts Avenue NW setting.
9. D.C. World’s Fair: proposed Smithsonian / National Mall grounds for the alternate-history 1893 fair.
10. Capitol Airport: north of the Benning track, separately from Washington-Hoover.
11. University of Maryland: College Park campus, for the electrical-engineering connection.

All eleven are registered with placeholder rooms and default fractional map-image coordinates. These coordinates were estimated against the current historic-map presentation based on the previously agreed sites; **the exact old locally dragged pixels were not stored in Git**. Further in-game fine adjustment remains possible.

The new V2 pin layout saves separately per profile. It deliberately does not import obsolete V1 coordinates, which would overwrite the restored defaults; V1 data is left intact for recovery. Opening the map reloads the active profile's coordinates; Reset Pins affects that profile only. **Go There** is hidden when the player is already at the selected location. The White House remains unpinned.

Source files: `city.js`, `app.js`, `index.html`. These are source changes only. No new Linux binary was built or accepted by this documentation change.

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
- [x] Make poker window-close/quit settlement unavoidable and consistent.
- [x] Audit and rebalance light-bulb unit economics, payroll, contract prices, and 1938-scale costs. 1938 electrical-manufacturing wage anchor is 80¢/hour; raw-material inventory now uses production-stock units rather than treating bulk commodity prices as per-bulb costs.
- [x] Correct selected production-grade material/cost consumption. Selected grade now drives raw-material draw, operating cost, finished-lot grade, and the visible variable-cost estimate from one authoritative helper.
- [x] Audit partial shipments, wrong-grade settlement, replacement inventory, deadlines, and repeated late penalties. Wrong-grade discounted deliveries no longer count as correct completions; defect claims reopen/requeue replacement work when warehouse stock is insufficient; overdue contracts receive one bounded late-service penalty per overdue turn without double-charging the same turn.
- [x] Add two Star Club daytime visit lengths: Brief Visit and Afternoon Visit.
- [x] Phase-specific Star Club controls: Brief/ Afternoon by day and Brief Evening/ Evening at night, with different encounter pools.
- [x] Reset/schedule Star Club raids correctly across dates and weekdays. Star Club raids now have an independent hidden future turn/date selected 4–8 game-months ahead from actual playable weekday dates; poker raid days no longer trigger Star Club raid outcomes, and being at the Star Club on its raid night is tracked separately.
- [x] Reposition Federal Exchange trade quantity directly above Buy/Sell controls for rapid trading.
- [x] Preserve typed Federal Exchange quantities across rerenders. The market table snapshots each ticker's current quantity before rebuilding and restores it immediately afterward, so typed orders no longer reset to 10.
- [x] Historical/name verification pass for 1938 Washington titles, wages, and fictional entities. The 1938 MPD chief title is reserved for the real Major and Superintendent Ernest W. Brown; fictional Arthur Hayes is now Inspector Arthur Hayes, fictional venues/contacts are explicitly labeled as such, Washington-Hoover Airport is verified as a valid 1938 setting, and the 80¢ electrical-manufacturing wage anchor remains sourced.
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
- [x] Build a newspaper archive that shows owned issues as miniature dated front pages and lets purchased issues be reopened without another charge. The title-screen Archives drawer now reads the last-played profile's owned newspaper IDs, renders dated front-page cards, and reopens owned issues as archive copies without charging Personal Cash.
- [x] Generate or hand-author dozens of Metropolitan Ledger editions that advance with the save's historical date. Ordinary issues now use a reusable period newspaper layout populated from each profile's dated headline, story, market wire, society and sports state, providing a distinct purchasable issue for every playable save date; handcrafted catalog issues such as September 30, 1938 remain supported.
- [x] The title-screen newspaper now reflects the date/state of the most recently played profile when opened. Purchases snapshot that exact edition into the profile archive; the approved desk artwork itself remains untouched.
- [x] Use the same tall-card gallery concept proven in the Hanafi card project for the Federal Electric collectible-card archive, with period-appropriate Federal Electric styling. Archives now have a dedicated tall-card grid (four across desktop, fewer on smaller screens), full-card opening behavior, and a save-backed collectibleCards collection; no unearned cards are fabricated.
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

## v0.5 radio / title control closeout — 2026-10-06

Accepted final control state:
- [x] Persistent radio bar remains fixed on screen while the page scrolls.
- [x] The station-name/frequency display is the drag handle on desktop and touch devices; desktop uses the four-direction move cursor.
- [x] Control order is previous station → station readout → next station → volume down → volume up → numeric volume → power.
- [x] Volume changes in 5-point steps.
- [ ] **MOBILE RADIO REGRESSION:** desktop starts at 40%, but the iPhone/mobile radio startup is not currently accepted. The 20% HTML-media setting did not audibly reduce iPhone output, and the later Web Audio attenuation work caused the 610 AM starting title music to stop starting on mobile.
- [x] Old floating station label and old speaker-area power hotspot are removed.
- [x] Redundant radio controls are removed from the DEV panel.
- [x] Mobile title audio suppresses city/street ambience, fan audio and clock ticking, leaving the radio/music path uncluttered.
- [x] Desktop title ambience remains available.
- [x] Final accepted radio-control baseline deployed successfully at `46d8b4d565cb1ee5e7f3695e9df40628fd4bf56a`.

## Mobile radio regression handoff — 2026-10-06

**Current status: OPEN / BROKEN ON IPHONE**

Observed by Derek on a real iPhone:
- all other title-screen sounds still work
- the starting **610 AM · Federal Electric Network** title music does **not** start
- changing the mobile radio number alone did not produce a noticeable loudness change before the regression
- therefore do not keep treating this as only a 20% vs 50% setting problem

Sequence that led here:
1. `3af5c654` changed the mobile radio default to **20%** using the existing HTMLMediaElement `.volume` path.
2. `9a62884e` changed desktop default to **40%** while keeping mobile at **20%**.
3. Derek reported that iPhone loudness still sounded effectively unchanged.
4. `5f30f40e` added an iOS Web Audio `AudioContext` + master `GainNode` and routed radio media elements through it so software attenuation would be real on iOS.
5. Immediately after that change, Derek reported that the starting mobile title music no longer played at all, although other title sounds still worked.
6. `e2f7eda4` tried to restore startup by deferring creation/routing of the Web Audio graph until the first user gesture. That deployment completed successfully, but Derek tested it and reported **the starting music is still absent**.

Most likely failure boundary:
- the regression is isolated to the radio path, not the whole title audio system
- the new iOS Web Audio routing remains the prime suspect because it is the major radio-only change immediately preceding the failure
- do not assume the displayed volume number proves the audible signal is being changed

**Proposed next fix, in order:**
1. Revert the iOS Web Audio radio-routing experiment from `5f30f40e` / `e2f7eda4` back to the known direct-media playback behavior from `9a62884e`.
2. Deploy that single rollback and verify on Derek's iPhone that the 610 AM starting music plays again before doing any further volume work.
3. Once startup is proven, solve iPhone loudness separately. Preferred robust direction: serve **mobile-specific pre-attenuated radio audio assets** (starting with the title theme) rather than putting autoplay-critical media behind an AudioContext. Offline attenuation changes the actual waveform level and is not dependent on iOS honoring `HTMLMediaElement.volume` or successfully resuming a Web Audio graph.
4. Only after playback is stable should the mobile UI default be finalized. Do not chase 20% vs 50% while the track itself is failing to start.
5. Preserve desktop at **40%** unless Derek changes it.

Do not bundle this with unrelated gameplay work. First slice of the next thread should be **restore mobile radio startup only**.

## Title-screen radio network — 2026-10-05

Current accepted implementation:
- [x] Lower radio dial advances through frequencies; power is a separate hotspot.
- [x] Tuning popup shows **frequency + station name only**.
- [x] The abandoned Howler / separate radio-engine refactor is **not** the current playback path. The proven title-radio implementation remains in `app.js`; do not revive the abandoned refactor without explicit approval.
- [x] **610 AM · Federal Electric Network** carries the title theme and intentionally restarts from 0:00 when tuned back in.
- [x] **540 AM · Capital Signal** carries the daytime static/experimental feed and a separate nighttime sequence.
- [x] **720 AM · Capital Radio Theatre** carries *War of the Worlds* by day and the approved local *Dracula* program at night.
- [x] **880 AM · Capital Melody** carries the long 1930s music program by day and a nighttime sequence with approved period commercial/music assets.
- [x] **1010 AM · Capital News Service** carries the current long-form newscast feed.
- [x] Live-style stations use a shared on-air epoch while the title screen is active; radio OFF controls audibility rather than creating a listener resume bookmark.
- [x] Master PAUSE stops radio, outside ambience, fan, clock, filing-cabinet and newspaper title audio together; PLAY resumes the soundscape.
- [x] Title-office day/night state follows the **playthrough phase**, not weather. Day is Business Day; Night/Report use the night office.
- [x] Fan defaults OFF when the office changes to night; manual fan control remains available.
- [x] Outside city/street ambience remains independent of radio tuning.
- [x] Session-only **Outside Noise: ON/OFF** is available in the DEV PANEL for testing the ambience without touching radio/fan/clock audio.

Current mix constants:
- Day outside ambience: **7% desktop / 2% mobile**.
- Night outside ambience: **14% desktop / 5% mobile**.
- Fan: **15%**.
- Clock: **8%**.
- Filing-cabinet open: **22%**.
- Newspaper rustle: **18%**.
- Radio: **38%**.

These are implementation values, not a promise that the final mix is locked.

Authoritative station behavior:
- [x] Station 1 is the restart-on-tune exception.
- [x] True broadcast-style stations do not preserve a listener-specific resume point.
- [x] Tuning into a live-style station joins its current on-air point.
- [x] Turning the radio OFF does not convert a live station into a paused personal recording.
- [ ] Decide whether the station epoch should persist across full page reloads.
- [ ] Expand stations into longer clockwheels with station IDs, announcer links, period advertisements, sponsor breaks, news bulletins, weak-reception segments and multiple programs.
- [ ] Continue rights/source verification before adding new bundled historical recordings.
- [ ] Add normal player-facing Options controls for master/radio/ambience volume only after the current title presentation is stable.

### Mobile / device audio mix roadmap

- [x] Mobile daytime Washington street ambience is currently **2%**.
- [x] Filing-cabinet title labels were enlarged for both desktop and mobile, with a stronger mobile size increase.
- [x] Washington map location labels remain visible on small screens instead of disappearing at the mobile breakpoint.
- [ ] Test iPhone playback through handset speakers, headphones and Bluetooth before locking final radio/ambience gain.
- [ ] Add device-specific mix/EQ only if real-device testing proves it necessary.


### Radio content curation — future build

- [ ] Curate every in-game radio station as a hand-built period program rather than a generic playlist: selected songs, announcer/DJ segments, station IDs, commercials, news, reception/static transitions, time-of-day programming and hidden/secret material.
- [ ] Preserve the GTA-style rule that stations feel continuously on-air while the player may manually tune at any location.
- [ ] Keep location context as a suggested/default station only; player tuning always remains available.
- [ ] The title-screen context always opens on 610 AM Federal Electric Network with the approved title theme beginning from 0:00; the player may tune away afterward.
 

## v0.6.2 source-slice plan — 2026-10-21 (NO EXECUTABLE YET)

- [x] Version identity must read **0.6.2** throughout the app, package metadata, workflow filenames, candidate draft labels and local packaging script. This is a new development candidate, not an accepted release.
- [x] Map **Go There** navigates to a distinct city room placeholder, not back to the Federal Electric title-office image. The room overlay must render above the title screen and map.
- [x] If the player's current location matches the selected map pin, **hide Go There**. Use an explicit **Return to Map** action for viewing other locations.
- [x] Closing a location via X, Escape, or backdrop returns to the map instead of revealing the office while the player's saved position still says another city location.
- [x] Saved out-of-office location is restored visibly on profile load and on resume. Going back to Federal Electric deliberately restores the executive office. Non-pinned registered rooms are accessible from the city directory.
- [x] Add smoke-test assertions that navigate to Old Chinatown and Russian Trade Hall, check the room is above the title artwork, verify the same-location button is hidden, and confirm the return route.
- [x] **Do not package on each push.** GitHub Actions Linux workflow is manual-only while 0.6.2 accumulates source slices. Existing backups and draft releases are preserved.
- [ ] Test and package executable only after several slices and **explicit approval**. Smoke test and acceptance criteria must pass end to end; warnings are errors.

### World scale, time and travel (later source slice)

- Research and record real historic street/site locations and distances for Washington and surrounding regions. Map pin pixel placement is separate from underlying geographic coordinates.
- Distances are measured **from the player's actual current location**, not automatically from the Federal Electric office.
- Travel duration depends on route, distance, era, transport choice (walking, carriage, hired horse cab, streetcar, later automobiles), time of day, and weather.
- Route travel consumes the same ongoing world clock as factory work and city socializing. Possible events include road obstructions, a horse losing a shoe, weather, an accident, a local acquaintance, or an unexpected business opportunity; no guaranteed highwayman or forced combat.
- Do not implement arbitrary travel minutes or random encounter probabilities before the real geography and time scale are reviewed.

### Persistent personal world, residence and equipment (design proposal, not implemented)

- **“Half-Life on paper”**: a first-person-feeling, persistent, location-aware interactive world communicated through paper surfaces, layered room art, dialogue, objects and consequences rather than rendering continuous 3D scenery. The world and clock continue outside the executive desk.
- **Home / apartment**: the player must have somewhere to live in Washington. Plan an addressable residence and rooms, housing expense, privacy, changing clothes, keeping possessions, resting, social encounters, and the possibility of staying with acquaintances on occasion. Do not assume residence at the office or an automatically available bed at a club.
- **Ultima Online-style paper doll**: visually equip period garments and hand-held or worn items. Outfit slots and worn layers must have consistent physical rules. Wardrobe affects access and how people react, not a superficial stat bonus.
- **On-person inventory**: pockets, hands, bags, weight/bulk and concealment determine what fits. Items have locations and ownership; objects not carried remain in the apartment, office, rented storage, or wherever dropped. No magical shared inventory between locations.
- **Venue etiquette**: upscale rooms such as the Embassy Room may require suitable evening clothing and invitation. Changing attire is a real action and requires access to stored garments.
- **Cards and dice**: a player may choose to conceal an ace, palmed card or loaded die where physically possible. The item creates an *opportunity* for cheating but never guarantees success; discovery can cause ejection, reputational harm, debts or other plausible consequences. No universal morality bar.
- **Second nightlife venue**: develop a socially distinct, seedier adult Washington nightlife club with its own owner, clientele, social usefulness and risks, not just a recolor of Madam Star's. The user's joking working name “Gay Toney's Club” is **not finalized**; decide a setting-appropriate original name when developing the location. Sexuality isn't a good/bad game statistic.
- Keep the current placeholder for the second nightclub until design is approved; no new artwork, characters, inventory UI, or mechanics silently added by this documentation.


## v0.6.3 source slice — 2026-10-21 (NO EXECUTABLE)

- [x] Give **P** a dedicated paper-doll overlay. Press **P** again, **Escape**, or its **X** to close it, without dismissing the underlying map or room.
- [x] Keep the current paper-doll appearance fixed; do not enable wardrobe swaps or equipped-item changes yet. The approved design specifies **eight slots**: shirt, trousers, shoes, left ring, right ring, watch, left pocket, right pocket.
- [x] Clicking either **pocket** opens a small, separate container-style **pocket inventory**, not an actual chest. The initial pocket containers are empty, pending the item and capacity systems.
- [ ] **Artwork import blocker:** the exact previously approved, bordered paper-doll PNG is not currently in the source repository or attached as an accessible paper-doll image in this handoff. Import it UNALTERED at `assets/federal-electric-paper-doll-approved.png`. The new overlay deliberately shows a missing-art notice instead of substituting an unauthorized drawing.
- [ ] Connect the pictured eight slots to an equippable inventory, persistent storage and item rules in later explicitly approved slices. Do not assign pocket capacities without a design decision.
- [x] Increase all CURRENT development version labels and future manual package filenames to **0.6.3**. GitHub Actions packaging remains manual-only; no executable should be produced for this slice.
- [ ] Actual desktop runtime test of **P**, **Escape**, X and both pocket popups after artwork is installed and the next approved Linux candidate is packaged.


## v0.6.4 — Source-only artwork maintenance (2026-10-21)
- [x] A distinct new slice following v0.6.3 paper doll. Increment version with each slice.
- [x] Organize all 16 loose images into categorized `assets/artwork/` subdirectories with their original binary hashes and alternate variants preserved.
- [x] Set up future folders for paper dolls, garments, accessories, UI, maps, objects, pockets, and locations.
- [x] Update all active image references and downloaded Washington map destination.
- [x] Add a maintenance artwork-path audit after the preparation step and before packaging.
- [x] Keep Linux packaging manually triggered; no executable or accepted release created.


## v0.6.5 — Approved paper doll artwork integration (2026-10-21)

- [x] Wire the original uploaded `assets/artwork/characters/paperdolls/paperdoll.png` into the already implemented P-key equipment screen. **No image regeneration or edit**; the separate original `Steampunk Paper Doll Equipment Screen.png` stays untouched.
- [x] Keep the approved character and displayed slots fixed. P toggles, Escape and X close, and each of the two pocket buttons opens its own initially empty pocket window. No draggable clothing or persistent item storage in this slice.
- [x] Add actual packaged renderer checks for PNG decoding, P, Escape, X and both pocket windows.
- [x] Increment all current candidate identities from 0.6.4 to **0.6.5**. Packaging still requires manual invocation.
- [ ] Linux candidate package, upload/checksum and smoke test remain **unverified** until manually executed; do not mark this release accepted until end-to-end tests pass without errors or warnings.
