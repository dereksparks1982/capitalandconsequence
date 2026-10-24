# Capital & Consequence

**Current map-only source candidate:** `v0.6.85-dev` adds **Potomac River Fishing Bank**, public map pin **29**, with no fishing mechanics yet. Full Source QA passed: [run 40061471151](https://github.com/dereksparks1982/capitalconsequence/actions/runs/40061471151). No executable released. Continue from [CONTINUE-HERE.md](CONTINUE-HERE.md).

## CURRENT SOURCE · v0.6.84-dev · Private home stable, riding and livery hire (October 23, 2026)

**Verified GitHub Source QA:** run **40058726255** passed the entire `npm run test:source` suite at source commit **`5d3c76f9865fa1f7c0f1c7c842d7be8cc5c0e414`**, including `tests/home-stable.cjs`, `tests/livery-hire.cjs`, the existing horse custody, care and all Washington career tests. Later commits to these documents do not change tested source. **Source build only**, not a packaged Linux executable, rendered playthrough, accepted release or tag. Active branch remains **main**.

**[x] v0.6.84 private-home horse custody and rented liveries**. Owner **Charlie Whitcomb's own Capitol Hill home** has an addressable **Private Stable and Carriage House** (room `home/private-stable`, initially empty, industrialist access only). Federal Electric's `factory/rear-stable` is a **temporary shelter during the workday**, not a permanently assigned home for the horse. The previous v0.6.83 shortcut that always transported a newly bought horse from its livery to the **factory** was **incorrect and has been replaced**. At either brother-owned livery, or at the home/factory stable, the owner may select an actual physically present purchased or hired horse to **ride/lead on the next player trip**. Optional wagon/carriage requires horse and vehicle **together at the departure location**. Only after an actually charged and recorded player journey do saved horse and vehicle locations change together; on-site stable destinations mark them stabled, other destinations tethered. No automatic follow if Charlie walks, no magical return at 5 PM, no free horse, no invented world-clock advances. Example: **home horse → ride to factory → shelter at factory → ride home**; walking away leaves horse at the factory until retrieved. Journey times still use existing explicitly provisional one-hour travel until geographic timing is approved.

**[x] Livery services:** The two rival brothers on opposite sides of Washington now offer **purchase, outside boarding and paid hire**. Purchase still uses existing personal-cash prices and saves assets at the actual seller. Boarding of owned animals is physically determined and assessed through existing daily animal care; private home/factory shelter avoids commercial board. Hire of a horse, a horse-and-buggy or a horse-and-wagon pays a provisional **first calendar day** price ($1, $2.50, $2.20 respectively); subsequent days accrue personal debt to the *issuing* livery, paid on Saturdays when cash allows. Rented animals and vehicles have real locations, must be returned **together, in person, to the issuing service desk**, and are removed from player inventory only upon a successful ten-minute return action. No imaginary refund, instant return, unlimited one-day hire or company-fund deduction. These are **game-economy estimates**, not substantiated 1878 invoices.

**Still open:** travel-mileage surveying and genuinely shorter long/short animal journeys; interior art, harness animations, equine fatigue/illness and hoof care; parking/guard fees at non-livery public venues; NPC-owned horse movement and stable employees; player choice of horse names; paying household expenses separately from factory overhead. The player uses explicit horse custody choices; real-world city movement remains grounded in one protagonist-controlled world clock. **Do not conflate Capital & Consequence with the Federal Electric company name or reinstate old-save compatibility mandates.**


## HISTORICAL MILESTONE · v0.6.83-dev · verified October 23, 2026 (superseded by v0.6.84)

**GitHub Source QA verified successful:** full `npm run test:source`, run **40057661933**, source commit **`df99f238d7fce15d86a761e96e92bde56da2f3b6`**. Four incremental, tested Washington-first source slices advance v0.6.79 to **v0.6.83**. Source only: **NO Electron playthrough, executable package, accepted snapshot, tag or release**. The active repository stays **`dereksparks1982/capitalconsequence` on single branch `main`**. Older verification and "current" version statements below are historical, not instructions to roll back.

### Newly completed roadmap slices

- [x] **v0.6.80, Sullivan's real whereabouts**: A *read-only* minute-aware projection of the existing NPC calendar hides the workshop assistant before his actual arrival, while absent, at closing time and on closed days. City-room visitors, ordinary conversation and free-form conversations all consult the same physical presence. It does not spawn staff, expose private NPC schedules or advance time; the source QA includes `tests/workshop-presence.cjs`. Independent NPC minute-by-minute movements and full autonomous production remain future work.
- [x] **v0.6.81, paid horse care**: Personal ownership now accrues **$0.20/day horse feed**, **$0.25/day commercial livery boarding** for horses actually held there, and **$0.10/day commercial wagon/carriage storage**. No external boarding at Charlie's own factory stable. Actual Saturday settlements debit *personal*, **never company**, money, credit feed suppliers or specific brother-owned livery accounts, and persist arrears if cash runs short. No bills for nonexistent or missing/stolen horses. Provisional game-balance numbers, not verified 1878 invoices. Uses the authoritative daily closing bell without NPC clock jumps; `tests/horse-care.cjs` passes.
- [x] **v0.6.82, late railway invoice**: Capital Railway Telegraph pays only for physically shipped stock. Late shipped quantities receive a **10% customer payment discount**, debited once from the real receipt; on-time quantities retain the full agreed price. The component register shows deductions and undelivered railway orders block renewal. `tests/workshop-deadlines.cjs` passes. No fabricated customer prepaid money or automatic make-up shipment.
- [x] **v0.6.83, bring a horse home**: At the livery, an owner may mark **one personally purchased horse** to accompany the next trip to Federal Electric. The horse remains at its seller until the player **actually completes the existing paid/clock-charged provisional one-hour livery-to-factory journey**. Both factory map-entry and return-to-desk paths resolve custody after recorded travel, placing the horse in the private rear stable and changing future boarding costs. Invalid/unrecorded trips cannot move it; replay and reload cannot duplicate the transfer. `tests/horse-custody.cjs` passes. This does not grant a free horse, invent route mileage or implement a full horse-riding speed model.

**Next honest roadmap tasks:** make Sullivan's production assistance truly continuous but imperfect (9 AM late arrivals, breakdown triage, owner decisions and no perfect automation), complete physical wagon/carriage movement and practical freight replacement, build finite merchant stock and restocking rather than unbounded shopping goods, tie railway customer finances to actual accounts, implement owner household expenses independently of business profits, and complete a full multi-day Electron acceptance playthrough. Keep all other career paths and the alternate Washington world intact. **Do not prioritize backward compatibility with old 1890 saves; that constraint was never approved.** No national-map expansion or guessed historical prices.


## HISTORICAL MILESTONE · v0.6.79-dev · October 23, 2026 (superseded by v0.6.84)

**Verified source QA:** Complete GitHub Actions "Capital & Consequence Source QA" run **40043515075** succeeded on commit `a10c3df7d4e52ebae15c238e9ef5398ab81b4fa4`. All existing suites and new workshop incidents, local commerce and livery transaction tests passed. **Source-only. No new Linux executable, Electron playthrough, accepted release or tag.** The previous packaged v0.6.34 draft remains unaccepted.

**Three checked incremental Washington slices (v0.6.77–v0.6.79):**
- [x] **Shop attendance and breakdown intervention:** Saved per-campaign/date attendance variation for Sullivan, including occasional delays and absence; assembly requires staff presence and arrival time. Completed assembly may trigger a workshop machinery fault. Sullivan tries first; some faults stop future production until Charlie deliberately spends **45 game minutes and $0.30** to repair. Repairs and incidents are replay-safe and use the player-controlled world clock. The NPC calendar's broad 8 AM/noon location slot has not yet been fully reconciled with fine-grained lateness in every resident/contact presentation.
- [x] **Real weekly purchases and 25-cent factory room rent:** On Saturdays Sullivan pays **$0.25** to Federal Electric for his room on its property and purchases a bounded basket of bread (one loaf), milk (two quart bottles), groceries, fuel and soap using his actual personal money. **$2.79** is the regular estimated merchant-goods basket; together with rent **$3.04**, leaving **$2.96 from a full $6 wage** on an ordinary week. Purchases credit vendor tills and persist in the save. Clothes and boots are *occasional* expenses. Goods prices are provisional game estimates, not sourced 1878 price records. Full shopkeeper schedules, household inventories, stockouts and an economy-wide flow of market goods remain open.
- [x] **Two rival horse/carriage liveries and paid ownership:** Washington now has **28** mapped locations. New **Western Livery and Carriage Yard** (pin 27) and **Eastern Livery and Wagon Works** (pin 28) are provisional map positions on opposite sides of the city, operated by **two rival brothers whose names and feud cause are undecided**. The physical service desks sell horses, wagons and carriages for actual personal cash using different fixed quotes. Payments enter the chosen seller's till, purchases create saved physical assets **at that stable**, no teleportation or free horse. Charlie's factory now contains an empty **Rear Stable and Carriage Shed** and a restricted **Sullivan's Rented Room**, with owner/resident entry rights. Actual boarding, feed, horse-care expenses, equipping personal transport for business deliveries, movement of newly bought horses from the livery, and NPC stable operations remain open.

**Important fixed policies:** January 2, **1878** start; Federal Electric is a company within **Capital & Consequence**, not the project title. Monday–Friday 9 AM–5 PM manual manufacturing; Saturday delivery and company/assistant payroll; no overtime. One paid assistant, Sullivan, not a foreman/general manager on top of him. Time ticks 1:1 with explicit protagonist-initiated skips; **NPC actions never advance the clock**. Old 1890-save compatibility was an invented requirement and is **NOT required**. Use existing single `main` branch; owner validation is required before accepting any executable.

**Next scoped code priorities:** synchronize minute-granular Sullivan arrival with NPC visible room/contact records; support assistant troubleshooting and work-rest continuation without turning him into a self-running perfect factory; week-to-week vendor supply, property/horse care and use of purchased carts for physical shipment, fairer cash/reinvestment accounting and city newspaper consequences. Washington-first only; no national-map expansion and no made-up compatibility mandates. This block supersedes older handoff wording and version-specific claims below.


**Historical v0.6.76 source QA:** Complete GitHub Actions Source QA **SUCCESS** on source/test commit ac9c1b890e1d12e8d7adadc9e946fd8b00aa23bb, run 40041780868, including the mandatory new standing-order, week-day assembly, full-week Saturday payroll, shop bills, and real 5 PM clock-gateway tests. Subsequent commits are documentation-only. No Electron UI playthrough or executable has been independently verified, built, or accepted.


## v0.6.76 · Weekly 1878 telegraph works and household economy (source-only)

**Factory:** Charlie and Sullivan work **Monday-Friday 9 AM-5 PM**, with **Saturday 9 AM-5 PM for customer delivery and payroll**, Sunday closed. Production requires Sullivan physically at the works. Orders larger than the available shift time make only complete units that fit; the rest carries over. No automatic 9 AM restart, autonomous assistant fabrication or breakdown-repair intervention is claimed by this slice. The player retains the existing 1:1 ticking game clock and action-time jumps.

**First real standing contract:** Capital Railway Telegraph buys **2 telegraph keys at $4.20**, **2 relays at $7.60**, and **3 switch contacts at $2.40**. Total **$30.80** gross, **$5.40** replacement materials from the current component catalog, and **29 hours** proposed hands-on production across the 40-hour Mon-Fri workweek. The first full-week Saturday is **January 12, 1878** (the January 2 opening is Wednesday). Future weekly batches appear on a Monday only if the previous batch was fully delivered. All amounts and production times are provisional gameplay estimates, not proven period prices.

**Staff and bills:** Sullivan earns **$1.20 per day actually worked**, maximum **$6 per five-day week**, accrued weekdays and paid by company-cash transfer to his NPC account on Saturday. Unpaid employee wages persist as arrears. Saturday shop costs are **$0.55 lamp oil/tools** plus **$0.70 winter coal heat in November-March**, assessed only when the workshop worked; **$1.15 wagon transport only if stock was actually shipped that Saturday**. Unpaid costs remain visible as liability, not fabricated negative cash. Owned raw stock is consumed without paying for it twice; raw material purchases actually debit company cash.

**Representative successful winter week:** $30.80 customer payment minus $5.40 replacement materials, $6 Sullivan salary and $2.40 shop/transport = **$17 before Charlie's draw, personal living costs, unusual repairs, taxes or reinvestment**. Initial inventory is already owned, so material replacement is an economic cost but not an automatic duplicate cash debit in week one. No fixed invisible owner withdrawal has been added. Sullivan's 25-cent weekly factory-room rent, household grocery basket (milk, bread, bacon, eggs, stew meat, potatoes, onion, soap), and Charlie's separate groceries/housing remain planned NPC purchasing features, not implemented market transactions.

**Future city economy, proposal only:** Two competing brother-owned horse/carriage stables on **opposite sides of Washington**, cause of feud undecided. Some residents own private horse sheds; many do not own a horse. Charlie could eventually keep a horse and delivery wagon in a rear factory stable/carriage house, owing feed, shoeing and upkeep, but no commercial boarding. A modest 1878 shop uses hand/foot machinery, coal heat, and oil or municipal manufactured-gas lighting where service exists; no assumed electric utility or diesel power.

**Status:** Source-only candidate v0.6.76. No executable or release built; GitHub source QA must be checked independently. Old-save compatibility is not a requirement.


> **NEW THREADS START HERE:** [CONTINUE-HERE.md](CONTINUE-HERE.md) is the authoritative, GitHub-persisted continuation handoff: exact verified source commit and QA, approved clock rules, current 1878 workshop, open milestones, and next build order. Read it **before** older handoffs, this README or roadmap.

> **OWNER DESIGN (read after the handoff):** [Authoritative October 23 living-city record](DESIGN-2026-10-23-LIVING-WASHINGTON.md). The earlier v0.6.70 9x/15x one-hour phase clock was explicitly rejected and corrected, not an approved rule. Older handoffs are archived background.

> **Current owner correction:** An earlier assistant invented a requirement to preserve old/1890 saves. **That rule is revoked; the owner never authorized it.** Current 1878 game design and properly working current-profile autosaves take priority. Maintaining or migrating old saves is NOT a development requirement. Earlier version notes below are historical, not instructions to preserve backward compatibility.

**Historical source candidate: v0.6.79-dev · workshop incidents, local purchases and competing liveries · October 23, 2026**

**Latest packaged candidate: v0.6.34 Linux x64 · private draft, built and smoke-tested, NOT accepted.**

**For all new work:** begin with [CONTINUE-HERE.md](CONTINUE-HERE.md), then consult [the current October 23 living-city design](DESIGN-2026-10-23-LIVING-WASHINGTON.md), ROADMAP and DECISIONS. Older handoffs are historical and contain superseded versions. Travel still charges a provisional one in-game hour between locations, now through the NPC-aware action-time path. No v0.6.75 executable has been made; source-only development remains the rule.

> **One city. Countless lives. Every choice has consequences.**

**Live an ordinary or extraordinary life in alternate-history Washington, D.C., in the late nineteenth century.**

**Current new-game opening: January 2, 1878.** Federal Electric's earliest products will be **electrical and telegraph components**, not mass-produced light bulbs. A working component business and its customers must come first. Later, technological advances, manufacturing investment, and possible patent or licensing arrangements allow incandescent lamp production. The **1893 alternate-history Washington World's Fair** offers a major contract to supply fairground bulbs and a possible front-page Metropolitan Ledger story if awarded; only **afterward** does a separate opportunity to compete for a modernized D.C. streetlighting contract arise. Washington's earlier 1880s electric **arc** streetlights are historically distinct from ordinary incandescent lamps. The actual 1893 World's Columbian Exposition took place in Chicago.

**Implementation status:** New profiles now begin in **1878** with a playable electrical-components workshop. Period-correct company economics, stock listings, wages, later factory tooling, technology licensing, the 1893 fair and the streetlight bid remain [unfinished roadmap work](ROADMAP.md). Old-save compatibility is neither required nor a blocker.

**Capital & Consequence is a Washington-first historical life simulation.** Federal Electric is the business owned from day one by **Charles “Charlie” Whitcomb**, one of four starting protagonists. The police patrolman, nightclub doorman and asylum orderly have their own desks and lives; the city keeps moving regardless of who is selected.

You buy materials, negotiate contracts, run the factory, trade stocks, manage company money, follow the newspaper, make contacts, attend races and fights, sit in poker rooms, and decide how much of your limited day you are willing to spend away from the business.

**The important part is that you cannot do everything.**



**Character detail:** [Samuel Harlan's permanent character codex](CODEX-SAMUEL-HARLAN-2026-10-23.md).

**Character detail:** [Eli Crowe’s permanent character codex](CODEX-ELIAS-CROWE-2026-10-23.md).

**Proposed local story (not active gameplay):** A specific drug/contraband smuggling ring with some corrupt police protection may operate through Chinatown. Sam can find leads as a civilian off duty, but his official assignment stays Hillsdale. The captain may or may not be involved in any given campaign. The truth, witnesses, money trail and consequences will be simulated in future Washington-only slices, with no assumption that Chinatown residents as a whole are criminals. See [Sam's codex](CODEX-SAMUEL-HARLAN-2026-10-23.md) and [roadmap](ROADMAP.md).

## v0.6.75-dev · Correct 5 PM workshop completion (source-only)

**Implemented:** A 1878 component order, supply purchase, assembly action, or customer shipment that finishes **exactly at 5:00 PM** may now complete. The workshop runs on the same player-driven **1:1 saved game clock**, but the shared clock defers that specific closing bell until the workshop has committed its material, inventory, receipt and company-cash changes. Then the existing day-end settles Sullivan's actual company-funded salary and records the daily business figures. Ordinary clock ticks and player activities still close at 5 PM normally, and workshop actions extending **past** closing remain disallowed.

**Autosave consistency:** The factory UI commits its transaction sequence before the closing-bell save, so a reload cannot reuse or trap the last transaction token. Repeated transaction receipts remain idempotent. No extra NPC-created clock time, second payroll system or old-save compatibility features were introduced.

**Verification:** The new mandatory `tests/workshop-closing.cjs` runs the **actual `app.js` time-advance gateway** with only nonfinancial UI/world dependencies stubbed. It covers a 5 PM order, a 5 PM paid shipment, cash-before-payroll and reporting order, the saved token sequence, an ordinary 1:1 clock close, overtime refusal and duplicate receipt behavior. Six focused source suites were executed in V8 with passing results; edited JavaScript parsed successfully. **Full GitHub Actions source QA and an Electron desktop playthrough remain independently unverified.** The broader legacy daily report/turn system, genuine continuous NPC work, hires and complete era conversion are still open. No executable packaged.

## v0.6.74-dev · Charlie and one paid assistant (source-only candidate)

**Starting staff:** Charles “Charlie” Whitcomb works as Federal Electric's owner, assisted by exactly **one salaried workshop assistant, Sullivan**. The former named factory foreman has been repurposed as the assistant, not retained as an extra employee. The new 1878 profile begins with `workers:1`, not twelve workers or a general manager. The assistant uses the existing named-resident planner, period-based 8 AM–5 PM weekday workshop schedule, room access, personal errands, conversations, memory and off-duty routines. **This is still the current slot-based NPC model**, not minute-by-minute independent factory operation.

**Cash rule:** Charlie draws no employee wage. Assembly uses the player's actual in-game work time but no fabricated per-minute wage deduction. At 5 PM the company's one assistant earns a **provisional $1.00 per worked game day**, recorded once based on an actual NPC work action. Cash is transferred from company funds to the assistant's persistent NPC account; if the company cannot afford the wage, the unpaid balance becomes explicit arrears paid when funds later permit. Workshop cash, reporting expenses, and the assistant's earned personal funds reconcile; no extra wage is minted by NPC time-slot simulation. The existing legacy 1890 payroll is bypassed for component-era saves, not maintained as a compatibility requirement.

**Verification boundary:** Standalone V8 execution of the current `workshop-staff.js`, component and NPC economy modules passed the focused assistant payroll, arrears, save/repeat, economic action and agency tests; syntax guards passed for edited JavaScript. **The full new GitHub Actions source suite and Electron gameplay have not yet been independently confirmed**. The parent milestones for full 24-hour economic accounting, staffing expansion, newspapers, hiring and real autonomous workshop production remain open. No Linux executable or accepted release created.

## v0.6.73-dev · Founding-era exchange quotations (source-only candidate)

The January 1878 founding campaign now has **eight fictional, period-suitable quoted securities** spanning railroads, telegraph, banks, mining, steam shipping and machine works. They are invented corporations in the alternate national-district setting, **not real-world historical listings or authenticated 1878 market prices**. They can be purchased using the existing earned broker relationship and personal funds; the Federal Exchange index and sector filter now include **only securities actually listed in the current year**. Future automobile, aviation, radio and other later-era listings are kept out of 1878 trading and do not accumulate fictional published history before becoming eligible.

**Current implementation note:** v0.6.73 happens to retain separate 1890-era market paths, but this is leftover complexity, **not an approved compatibility requirement**. It can be removed as the 1878 game evolves. The actual source code passed targeted JavaScript execution checks for the two eras; **new GitHub Actions CI and Electron desktop gameplay are not yet independently verified**. Do not mark the entire 1878 economic transition complete. Payroll, employee count, factory accounting, newspapers and legacy business-turn assumptions remain open.

## v0.6.72-dev · Owner-operated 1878 founding workshop

**Built:** New games begin on January 2, 1878 and no longer receive the 1890 incandescent starter contract or active bulb manufacturing queue. Charlie Whitcomb can use **Factory → Component Works** to accept actual telegraph and electrical customer orders, purchase copper/brass/wood/iron/insulating stock, assemble period components at bench/winder stations, and ship physical warehouse stock to receive payment. This reuses the v0.6.62 component engine and its integer-cents receipts. Every operation consumes its actual in-game minutes on the **same active 1:1 Washington player clock**; work cannot run past 5 PM. Repeated receipts cannot duplicate stock, money or time. The old bulb factory screens are hidden for current 1878 profiles. Obsolete 1890 factory code can be removed when appropriate.

**Remaining:** broader period-correct company payroll, stock listings, newspaper stories, hiring, equipment, licensing, fair and lamp progression, and NPC-owned company operation. This is a checked-off **workshop submilestone**, not the entire 1878 historical economy. Source-only checks, no new playable Linux executable.

## v0.6.71-dev · Correct 24-hour Washington clock and NPC time jumps

**UI correction:** Factory queue time remaining now refers to the real 5 PM closing bell rather than showing a nonsensical infinite phase budget. The poker popup now displays **elapsed time at the table**, not the discarded Business Day Remaining timer. Neither counter forces a phase end. Real selectable 1–8 hour card visits remain a future activity feature.

At the owner's direction, active time now ticks **1 game second per real second**. There is no fixed daytime/nighttime play session, no old 60-real-minute expiration and no 9x/15x acceleration. Explicit player actions and travel advance additional exact game time. The runner slices long jumps at **midnight, 8 AM, noon, 5 PM and 10 PM**, allowing NPC routines to resolve through the intervening periods instead of skipping straight to the destination state. Factory accounting closes when the clock reaches 5 PM; the following business morning starts at 8 AM because time naturally reaches it. Rest Until Morning is an intentional player action. NPC actions never drive the clock; the title/background/paused game never accrues offline time.

**Limits:** the playable factory is still 1890 bulb-first, daily accounting uses transitional legacy turn counters, NPC activity is still coarse, and full real poker/club session durations and 1878 components-first integration are pending. Only source tests are performed. See [the authoritative design](DESIGN-2026-10-23-LIVING-WASHINGTON.md) for exact decisions and next steps.

### Historical experiment, not current design

The following v0.6.70 section documents a **rejected accelerated timing design**. Never implement its 60-real-minute day/night structure again.

## v0.6.70-dev · One actual Washington day in the existing play rhythm

Passive Washington simulation now maps the existing **60 minutes of real-time business play to the 9 hours from 8 AM to 5 PM**, then **60 minutes of real-time night play to the 15 hours from 5 PM to 8 AM**. The saved absolute clock actually reaches those boundaries at the end of a normally elapsed phase, so the sun, moon, NPC schedules and date do not sit nearly still before abruptly jumping hours at close. Factory production during ordinary passive ticks advances by the same nine in-game seconds as Washington time. Players' time-consuming activities, travel and duties still charge their actual **stated in-game minutes**, and a remainder-preserving budget counter keeps small actions from losing extra time through rounding. UI checks for sufficient remaining time, playable card-session ceilings and queued-production estimates use true available **simulated** time rather than the obsolete real-time countdown.

The user still receives one real-hour day phase and one real-hour night phase; this is an explicit **9x daytime / 15x nighttime passive rate**. The older 4-transaction-turn-per-month progression, factory accounting, exchange settlement, report screens and 1890 opening continue as transitional mechanics, and a manually ended phase advances to its valid boundary. This is not yet a seamlessly self-directed continuous society or the final 1878 components-first economic system. Source-only, no executable. No new time/math dependency: composes the already-integrated calendar, transaction service and astronomy engine.

## v0.6.69-dev · Moving the city onto one saved clock

The active Washington header now reads the **12-hour time and actual date from the saved world clock**, rather than displaying a separate 60-minute countdown as though it were the time of day. Timed player actions and passive ticks now pass through the same `washington-time.js` authority, which composes the already-tested world-clock, calendar bridge and transaction ledger. Legacy business-to-night and night-to-report transitions explicitly advance the saved clock to **5:00 PM** and the following **8:00 AM**, without rewinding later reached dates or duplicating queued events. NPC routines and the astronomy almanac use the same saved minute; an NPC's private utility planner now sees actual daylight/darkness, observed adverse weather and current local eclipses. The freely typed conversation prompt receives that same clock and moon context, without revealing astronomical events from the future.

**Important honest boundary:** Federal Electric production shifts, exchange settlement, wages and many old activities still obey the inherited one-hour day/night accounting budget and turn-based deadlines. Closing a legacy phase can jump the clock past unobserved hours, and neither NPCs nor the press fabricate events during those skipped hours. This build does **not** finish the comprehensive always-running 24-hour labor/economy migration, eliminate all separate phase budgets, or convert the still-bulb-first **1890** opening into the planned **1878** component factory. Next build slices will migrate those remaining consumers while protecting one-time financial settlements. Source-only, no executable or desktop playtest.

## v0.6.68-dev · Weather, sunrise, moon and eclipses in the top bar

Washington's main gameplay daybar now has two compact readouts: **the current game's observed weather** and the **actual astronomical sun/moon cycle**. They update without artwork or overwriting existing finance/time controls. The weather report comes from the existing weather conditions produced by the gameplay economy each turn: rainy, snowy, partly cloudy, foggy, clear, stormy and similar text map to clear icons. This is not an independent hour-by-hour meteorology simulator yet.

We imported a **pinned copy of Don Cross's MIT-licensed Astronomy Engine** from [cosinekitty/astronomy](https://github.com/cosinekitty/astronomy) into `vendor/astronomy-engine/` with its license. It calculates **Washington sunrise and sunset**, the Moon's phase, and actual **locally observable solar eclipse intervals** and lunar eclipse timing for the saved in-game date. The summer **July 29, 1878 solar eclipse** is caught by the source tests at Washington. No random fabricated eclipses, reliance on today's device clock, or external weather/astronomy API is involved. Local astronomical times use provisional fixed Eastern Standard Time, with no modern daylight-saving adjustments. Weather may obscure viewing the event without changing its underlying astronomical existence.

A criminal choosing eclipses as a pattern, a witness remembering a sky event, and a detective using that pattern to investigate still require the planned **NPC-originated event, evidence, and investigation integration**. This slice gives those systems a real astronomy source, not fabricated crime records. Source only; no packaged executable.

## v0.6.67-dev · Natural-language NPC conversation bridge

**New gameplay source:** Whenever a simulated resident is genuinely present in your current Washington room, they now have a **Speak** text field alongside their existing authored conversation buttons. Type a question or statement in a language your character and that resident share, and the game can ask a **locally running OpenAI-compatible model** for a reply. Tested protocol supports llama.cpp's built-in HTTP server and the compatible Ollama API, without exposing arbitrary network destinations to game HTML. A sandboxed Electron preload calls a localhost-only Node IPC bridge. Conversations are **not scripted**, and the model backend can be replaced with stronger models later without rewriting NPC logic.

**To activate later during desktop testing:** run a compatible local model server on `127.0.0.1:8080` (e.g., llama.cpp `llama-server -m /path/to/model.gguf --host 127.0.0.1 --port 8080`) before opening the game. Set `FE_LLM_PORT` and `FE_LLM_MODEL` in the launch environment if using another model/port, e.g., Ollama's local OpenAI-compatible API on port 11434. A **model/server and model weights are not bundled**; without an active server the user receives an explicit error rather than fake generated speech. No internet inference is requested.

The system supplies current **saved game date, observed weather, current room, NPC identity and occupation, shared language and the resident's own per-profile conversation history**. It also supplies an explicitly curated *alternate* federal history: national popular-vote elections after the Civil War; a **working 1878 timeline** in which Tilden won 1876; presidents after that point remain undecided until curated. It does not consult today's real-world history and never intentionally teaches NPCs future events. The model may still invent inaccuracies, so factual enforcement and larger curated historical retrieval remain roadmap work.

The generated text is dialogue **only**. Saying an NPC will lend money or meet at a poker table does not transfer money, set a meeting, or give a character information they haven't earned. It records the player and NPC's actual exchange in that profile's bounded, per-resident transcript, survives autosave, and never grants free social influence from repetitive chat. Russian-only Alexi remains inaccessible to English-only player characters until a genuine Russian fluency/interpreter system is earned. Dialogues cease if player switches profiles, NPC leaves the room, or the game date changes during generation. The legacy 1890 live starting year, factory and previous button-based conversations are unchanged.

**Validation scope:** New core and local-loopback automated tests, GitHub Source QA, no packaged executable or real large-model gameplay benchmark in this slice. GitHub research used: [llama.cpp](https://github.com/ggml-org/llama.cpp), [Ollama](https://github.com/ollama/ollama), [AI Town](https://github.com/a16z-infra/ai-town), [Generative Agents](https://github.com/joonspk-research/generative_agents). These are reference/interface choices, not claimed bundled libraries.

## v0.6.66-dev · Developer panel follows the entire game

The complete existing **DEV PANEL** is moved out of the retired hidden title to a fixed, draggable, collapsible overlay. It stays visible on the active four-career menu, personal desks, Washington map, registered city rooms, and dialogs, including narrow screens. **Unlock All Rooms: ON/OFF** sits next to Infinite Money. ON allows the human protagonist to enter any of the 26 registered Washington location rooms, even restricted, hidden, planned, or future-dated shells. This does not create unfinished rooms or unlock unrelated gameplay actions. NPC permissions remain unchanged. The switch is session-only, and toggling OFF or resetting restores normal doors and returns the player to public Hillsdale if otherwise stranded in a restricted room. Autosaves do not record the override or an unauthorized room position. No new packaged executable or release was generated.

## v0.6.65-dev · Rumors stay behind the doors where conversations happen

Resident-to-resident information exchange now requires an **actual identical registered room**, not merely the same location pin or neighborhood. Residents must understand a shared language as before. The chance that one resident tells another about an individually known fact varies with their **mutual saved affinity**, sociability, and the original confidence; hostility can deter disclosure while trust may modestly encourage it. Explicitly classified confidential records are not spread through this informal rumor path. Each private gossip record now includes the actual room and shared conversation language, preserving traceability inside simulation state without broadcasting secrets in the newspaper or player contact file. No unobserved period progress, fabricated full interviews, or executable build is involved.

## v0.6.64-dev · Witnessing Washington's other lives

When two autonomous residents actually meet in the **same physical room as the active protagonist**, the player can now acquire a saved, first-hand journal observation naming those visible residents and the outward kind of encounter. Meetings in a different building or even a different room in the same building remain private. Duplicate periods/reloaded meetings do not multiply records; observed encounter receipts survive the same profile autosave. The text explicitly does **not** disclose private dialogue, suspicion, intent, languages understood, police secrets or criminal guilt. Developer-room navigation does not grant observations. The underlying NPC relationship event itself is still confidential to the simulation, and no automatic Metropolitan Ledger publication occurs. Source-only.

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

## Historical build status (v0.6.58 checkpoint, superseded)

**Source at this historical checkpoint:** `v0.6.58-dev` on the single `main` branch. The last code version was tested at commit `99ab704ed8978fd78bc5edbe879b0264d56db6af` by [successful GitHub source QA run 39962299550](https://github.com/dereksparks1982/capitalconsequence/actions/runs/39962299550): **424 source-contract checks** and the other configured behavior suites. The subsequent latest docs-only commit at handoff was `d3b72c2d033f238964e1367b6abb492441544973`. See the [archived v0.6.58 handoff](HANDOFF-2026-10-23-THREAD-END.md) for history only; the current instructions live in [CONTINUE-HERE.md](CONTINUE-HERE.md).

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

**CURRENT OVERRIDE:** Read [CONTINUE-HERE.md](CONTINUE-HERE.md) and [canonical four lives](#canonical-four-lives) for the accurate names/occupations. The following section describes earlier stages when Patrolman, "Layman" and Wardman were desk-only previews. Sam and Eli now have limited playable work loops.

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
