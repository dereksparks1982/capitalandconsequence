# Capital & Consequence Development Roadmap

> **Current planning constraint:** No file-splitting or `app.js` modularization tasks. The owner explicitly rejected them. Current build priorities remain gameplay and verified 1878 behavior; documentation changes alone do not authorize code changes.

## CURRENT SOURCE · v0.6.86-dev · six fishing locations, editable map labels and category filters (October 23, 2026)

**[x] Six fishing destinations (pins 29–34):** Potomac River Fishing Bank, Babcock Lake (date-gated after 1888), Fletcher's Cove, Georgetown Canal Towpath, Eastern Branch Fishing Shore and Chain Bridge Riverbank. All six are public room locations under **Leisure & Outdoors**, separate from **Recreation & Competition** (racing/boxing) and **Gambling & Games**. These map pins remain on the active provisional 1938 illustration and their coordinates are not historically surveyed.

**[x] Existing map filters and editable pin labels:** The map category selector distinguishes leisure, competitive sport and gambling. Selected pins offer Save Name and Reset Name. Per-profile custom names and pin positions persist in the existing map-layout storage without changing immutable destination IDs, source names, travel permissions or geography; resetting pin *positions* does not discard names. Source QA includes tests for six registered fishing places, 34 pins, category labels, Babcock expiry and label persistence.

**Verified source build:** `v0.6.86-dev` on `main`; all Source QA tests succeeded on source commit `6f858f0a582c6592fd0646e665d997795bb19cea`, [run 40062272284](https://github.com/dereksparks1982/capitalconsequence/actions/runs/40062272284). No Electron/Linux executable has been completed or accepted for this version. Owner **explicitly requested an executable for testing after these six pins**; next permitted packaging step is to run the existing **manual-only** `Linux Desktop Build` workflow, verify smoke testing, SHA-256 and private draft candidate; do not create a public release/tag/acceptance snapshot without user validation.

**[ ] Unfinished period-appropriate map replacement:** The owner wants a readable map visually comparable to the present game overview but showing **Washington's actual 1878 layout and waterways**; it can be a **later-created accurate historical reconstruction**, not necessarily an original map printed in 1878. The current map asset is `assets/artwork/maps/title-map-1938.jpg` and must **not** be presented as approved 1878 cartography. [Map candidates and replacement checklist](MAP-1878-RESEARCH.md) document the Library of Congress 1876 Entwistle, 1880 district and 1883 Engineer Commissioner sources. Study high-resolution coverage/rights and get owner approval **before installing replacement artwork**.

**[ ] Fishing gameplay still conceptual:** Fish direction/line tension should be shown live, with menu/dialogue actions such as give line, hold steady, steer, or reel. Fish react to choices; no aquarium and no automatic sale. No fishing engine, fish inventory, fish-fighting, tackle or catch economy has been built. The source candidate is **map-only**.

**Owner workflow:** Single branch `main`, do **not** split `app.js` or other source files, preserve 1:1 ticking game clock and player-only action-time jumps, and never assert old-save compatibility as a requirement. A successful source suite is not an Electron playtest.

## HISTORICAL MILESTONE · v0.6.85-dev · original Potomac fishing pin (superseded by v0.6.86)

**[x] Requested single-location slice:** Added **Potomac River Fishing Bank** (`potomacFishingBank`), public `riverbank` room, map marker **29**, in the existing **Sports & Recreation** category. Coordinates are an explicitly **provisional** Potomac-shore map placement, not an asserted historic street address. Ordinary existing Washington travel/room access applies. **No fishing minigame, fish catches, aquarium, fish economy, artwork, gear system, or fishing time mechanic has been built.** Fishing gameplay has been discussed (reactive fish direction, tension and menu choices) but remains **design-only until separately approved**.

**Verification:** Full GitHub Source QA succeeded on source commit `b136d4016a14d5af50c7e2eb401c1e4218fd144b`, run **40061471151**. The source candidate is `v0.6.85-dev`, main branch, **not a packaged or user-accepted executable**. Existing `app.js` stays intact, no file splitting or structural refactor. This paragraph supersedes the older "CURRENT SOURCE" v0.6.84 checkpoint immediately below.

## HISTORICAL MILESTONE · v0.6.84-dev · Private home stable, riding and livery hire (completed October 23, 2026)

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



## v0.6.76 · Weekly 1878 telegraph works and household economy (source-only)

**Factory:** Charlie and Sullivan work **Monday-Friday 9 AM-5 PM**, with **Saturday 9 AM-5 PM for customer delivery and payroll**, Sunday closed. Production requires Sullivan physically at the works. Orders larger than the available shift time make only complete units that fit; the rest carries over. No automatic 9 AM restart, autonomous assistant fabrication or breakdown-repair intervention is claimed by this slice. The player retains the existing 1:1 ticking game clock and action-time jumps.

**First real standing contract:** Capital Railway Telegraph buys **2 telegraph keys at $4.20**, **2 relays at $7.60**, and **3 switch contacts at $2.40**. Total **$30.80** gross, **$5.40** replacement materials from the current component catalog, and **29 hours** proposed hands-on production across the 40-hour Mon-Fri workweek. The first full-week Saturday is **January 12, 1878** (the January 2 opening is Wednesday). Future weekly batches appear on a Monday only if the previous batch was fully delivered. All amounts and production times are provisional gameplay estimates, not proven period prices.

**Staff and bills:** Sullivan earns **$1.20 per day actually worked**, maximum **$6 per five-day week**, accrued weekdays and paid by company-cash transfer to his NPC account on Saturday. Unpaid employee wages persist as arrears. Saturday shop costs are **$0.55 lamp oil/tools** plus **$0.70 winter coal heat in November-March**, assessed only when the workshop worked; **$1.15 wagon transport only if stock was actually shipped that Saturday**. Unpaid costs remain visible as liability, not fabricated negative cash. Owned raw stock is consumed without paying for it twice; raw material purchases actually debit company cash.

**Representative successful winter week:** $30.80 customer payment minus $5.40 replacement materials, $6 Sullivan salary and $2.40 shop/transport = **$17 before Charlie's draw, personal living costs, unusual repairs, taxes or reinvestment**. Initial inventory is already owned, so material replacement is an economic cost but not an automatic duplicate cash debit in week one. No fixed invisible owner withdrawal has been added. Sullivan's 25-cent weekly factory-room rent, household grocery basket (milk, bread, bacon, eggs, stew meat, potatoes, onion, soap), and Charlie's separate groceries/housing remain planned NPC purchasing features, not implemented market transactions.

**Future city economy, proposal only:** Two competing brother-owned horse/carriage stables on **opposite sides of Washington**, cause of feud undecided. Some residents own private horse sheds; many do not own a horse. Charlie could eventually keep a horse and delivery wagon in a rear factory stable/carriage house, owing feed, shoeing and upkeep, but no commercial boarding. A modest 1878 shop uses hand/foot machinery, coal heat, and oil or municipal manufactured-gas lighting where service exists; no assumed electric utility or diesel power.

**Status:** Source-only candidate v0.6.76. No executable or release built; GitHub source QA must be checked independently. Old-save compatibility is not a requirement.


> **NEW THREADS START HERE:** [CONTINUE-HERE.md](CONTINUE-HERE.md) is the authoritative, GitHub-persisted continuation handoff: exact verified source commit and QA, approved clock rules, current 1878 workshop, open milestones, and next build order. Read it **before** older handoffs, this README or roadmap.

> **Archived context:** [October 23 v0.6.65 historical handoff](HANDOFF-2026-10-23-SOURCE-CONTINUATION.md) describes an earlier source snapshot. The current source candidate is **v0.6.84-dev**, and the current continuation instructions are in [CONTINUE-HERE.md](CONTINUE-HERE.md). Do not copy old clock assumptions from historical sections.

## Current policy: remove invented old-save preservation constraint

**NO old-save compatibility requirement.** The previous assistant invented it; the owner did not approve it. Old 1890 saves and legacy save formats do not need preservation, migration, or regression work. Remove obsolete compatibility paths when useful for the current 1878 campaign. Keep proper autosave and replay protection for **new/current profiles**. Earlier historical checklist statements to the contrary are superseded.

## ACTIVE DEVELOPMENT SCOPE · WASHINGTON FIRST (decision of October 23, 2026)

**Capital & Consequence is a Washington, D.C. life simulation.** Until the owner explicitly expands the scope, prioritize **only the playable city, its residents, institutions, rooms, four career paths, local history, and the interactions between them**. The rest of the restructured United States is **background canon and a deferred roadmap**, not a second playable map to build now.

**Alternate-world design rule:** The city must remain *recognizably* nineteenth-century Washington, but it is **not a documentary reconstruction of the real United States**. Familiar buildings, social institutions, technology, contemporary personalities and historical reference points can coexist with deliberately changed politics, geography, districts, events, and outcomes. The inspiration is an alternate-reality variation: **similar, but not the same**. Keep changes internally consistent with the game's post-Civil-War United States of purpose-defined districts; avoid importing real state-based laws/elections automatically. The comparison to *Rick and Morty* describes the alternate-universe feeling, **not a crossover**.

### Now · highest-priority D.C. playable slices

**v0.6.75 SOURCE UPDATE:** Workbench orders, material purchases, assembly and shipments finishing exactly at 5 PM now commit their receipts, materials, cash and UI transaction sequence **before** the payroll/market/day-report closing process. The player clock's ordinary 1:1 ticks and other actions still trigger 5 PM; actions that exceed the workday are refused. The new `tests/workshop-closing.cjs` exercises the actual `app.js` time gateway and is mandatory source QA. Six targeted V8 tests passed; full GitHub Actions source QA and desktop UI are not independently verified. This is a narrow settlement boundary fix, **not** the entire 24-hour economic/report migration.\n\n**v0.6.74 SOURCE UPDATE:** Charlie Whitcomb is owner/operator, supported by exactly **one paid workshop assistant, Sullivan**, using the existing named NPC schedule and personal economy. New profiles begin with one worker. Provisional $1.00 wage is funded once from company money for a worked day at 5 PM, with arrears tracked instead of overdraft. Manual assembly no longer charges an additional fictional labor wage. Focused V8 behavior checks passed; full new GitHub Actions CI and desktop playthrough have NOT been independently confirmed. Full continuous economics and hourly autonomous employee work are still unfinished.



**v0.6.73 SOURCE UPDATE:** The 1878 Exchange gains eight fictional, founding-era railway/telegraph/financial/industrial listings with year-gated published quotations, index, sectors and portfolios. Existing 1890-origin markets are kept separate; unlisted securities do not gain pre-listing prices. Targeted JavaScript checks passed; GitHub Actions CI and desktop gameplay have **not** yet been independently confirmed. Company payroll, 1878 staff, newspapers and 24-hour economic settlement remain separate open work. The broader 1878 economy is **not complete**.

**v0.6.72 SOURCE UPDATE:** The new January 1878 campaign now contains the first actually playable component works, not a renamed 1890 bulb factory. Materials, electrical/telegraph orders, assembly time, receipts and shipments are integrated with the owner's cash and the single world clock. The **1878 workshop submilestone below is checked**, while the broader period/economy integration remains open and must be independently verified.

**v0.6.71 SOURCE UPDATE:** Correct 1:1 clock while playing; action and journey time jumps reuse the authoritative world calendar; NPC scheduling is processed at crossed boundary slots; the timer never expires after 60 real minutes. Business/nights are reached at real 5 PM/8 AM clock hours. **Next:** full 1878 components-first campaign, genuinely independent NPC poker/racing and full-day economic settlements, dynamic weather, strong LLM conversations and actual eclipse-driven investigations. The complete owner's instructions are in [the design record](DESIGN-2026-10-23-LIVING-WASHINGTON.md).

**Source advancement v0.6.70 (historical, REJECTED clock assumption):** The two 60-real-minute gameplay segments now drive the single 24h Washington calendar at 9x business / 15x night passive rate, with exact game-second charges for player actions and production. Phase budget expenditure preserves fractional sub-second costs through save/reload; contracts and activities check true available simulated time. Midnight, day/night and Eclipse displays follow the same clock, though legacy four-turn-per-month accounting and report transitions remain in place.

**Source advancement v0.6.69:** The visible Washington 12-hour clock/date, NPC period scheduler, weather and astronomy now all consult the same saved `worldCalendar`. Timed actions and ticks route through a shared gateway and the legacy day/night/report handoffs move that saved clock to real evening/next-morning moments without backwards jumps. NPC risk judgments and conversational sky descriptions use only present conditions. **Not finished:** replacing old 60-minute phase budgets, payroll and stock exchange settlement with continuous hour-based authority and real 1878 component-factory gameplay. These are immediate follow-ups, not claims of completion.

**Source advancement v0.6.68:** Existing daily Washington weather is visible in the gameplay top bar. A licensed, bundled astronomy engine supplies historical sun/moon phases, daylight, sunrise/sunset, and local eclipse detection using the saved in-game minute. The July 29, 1878 Washington solar eclipse is a tested fixture. Eclipse-motivated NPC crime and detective pattern recognition remain **future emergent gameplay**, not fabricated existing murders. Next: actual self-directed actions, events, and observer-accessible evidence.

**Source advancement v0.6.67:** In-person named residents can now accept free-text speech through a sandboxed, loopback-only local OpenAI-compatible LLM server. Each actor receives its own bounded profile conversation transcript, date-gated alternate-history briefing, public personality, current observed weather and room, and genuine shared-language checks. NPC responses alone perform NO irreversible world actions. The actual local model/server is not bundled or performance-validated. Next: properly licensed model recommendations/weights, curated year-by-year Washington historical knowledge retrieval, translation earnability, truthful NPC conversational claims, and validated conversation-to-action tools that affect the same shared world.

**Source advancement v0.6.66:** Existing developer controls float above every live game screen and room (collapsible and draggable). Unlock All Rooms lets the selected player inspect all registered Washington locations and rooms regardless of normal duties, invitations, opening date or door permissions without giving NPCs unrestricted access. Developer sessions never create non-existent scenes or permanent access entitlements.

**Source advancement v0.6.65:** Gossip now depends on precise co-room presence, shared language, relationship strength and source confidence. Classified private records are barred from casual hearsay; private events retain room and language provenance. Future full NPC evidence and investigation systems should build on these guarded facts without treating rumor as confirmed truth.

**Source advancement v0.6.64:** Actual co-room social meetings can now leave first-hand observations in the active character's private journal, without hidden motives or off-site hearsay. Seen meetings are idempotent and bounded, and no newspaper claim is created. Next: deeper evidence provenance, witness disagreement and earned follow-up contact actions.

**Source advancement v0.6.63:** Edmund Wardman now has an actual playable District Asylum work loop: assignment at the orderly desk, service inside the patient ward, filed report and one bounded earned wage. Shift logs, pending tasks and funds persist per profile; medical confidentiality and restricted superintendent access remain intact. Next: institutional roster and brother's managerial decisions grounded in local cause and effect.

**Source advancement v0.6.62:** Independent component-works module now supports owner-specific 1878 component recipes, inventory purchase, transaction-proof assembly, contracted customer orders, physical warehouse shipments and technology prerequisites, with dedicated save/reload tests. **Not yet connected to playable new 1878 saves or authoritative calendar.** The existing 1890 profiles remain unchanged. See `COMPONENT-WORKS-1878-FOUNDATION.md`.

**Source advancement v0.6.61:** Russian-only NPCs no longer exchange rumors or conversational relationship gains with English-only residents without a shared spoken language. Pavel Orlov has explicit English/Russian fluency as a provisional trade intermediary. Interpreters, player language study, earned translated testimony and period-correct dialogue still require future gameplay.

**Source advancement v0.6.60:** NPCs now make one bounded social encounter per reached period with co-located residents in the same room, create reciprocal private relationship changes, and persist ordinary contact memories. No meetings occur merely from opening a panel. Continue with consequences linked to careers, witnesses and transactions. The earlier intentional travel improvement remains documented below.

**Source advancement v0.6.59:** Intent-driven personal travel is now implemented and source-testable. An NPC's chosen goal may direct optional personal time toward an accessible registered workplace/contact, but never bypass a restricted room, wager result or mandatory shift. Still pending: independent social transactions, actual journey traversal, household links, proper 24-hour clock authority and genuine witnessed city events.

- [x] **1878 founding-era exchange listings (v0.6.73; targeted source checks).** Eight invented, era-consistent securities are visible and tradable via the existing broker, with no future-company pre-listing quotation history and no change to 1890-origin portfolios. Broader historical economics, payroll, reporting and full CI/desktop verification remain open.
- [x] **1878 closing-bell transaction ordering (v0.6.75, targeted executable source checks).** Component work finishing at 5 PM commits cash/inventory/receipt and transaction token before the same clock settles Sullivan wages and closes the daily report; overtime and duplicates are rejected. Full accounting/report migration and desktop testing remain open.
- [x] **1878 two-person workshop and funded wages (v0.6.74, targeted source checks).** Charlie works as owner; Sullivan is the only starting employee, an independent named NPC with 8 AM–5 PM weekday routine, recorded work actions, personal off-duty life and wages actually deducted from Federal Electric. No double-charged per-assembly salary; unpaid wages are tracked. Full real-time payroll and staffing/hiring development remains open.
- [x] **1878 Component Works: playable owner manufacturing (v0.6.72).** Start a new January 2, 1878 profile; buy actual materials, accept real customer component orders, assemble at workbench/winder with the shared world-clock time cost and ship warehouse stock for recorded company cash. Bulb-era starter contract/controls no longer appear in that profile.
- [ ] **1878 market and historical-economy follow-through.** Correct legacy stock-listing, newspaper, employee/payroll, production and market assumptions before declaring a fully historical 1878 economy. Later licensing, 1893 fair and streetlights also remain separate work.
- [ ] **1878 real starting experience:** Convert *new* profiles from the old 1890 bulb-first factory to **January 2, 1878** with correct component-making machinery, recipes, suppliers, inventory, and contracts. Charles “Charlie” Whitcomb **owns Federal Electric** immediately. Historical electrical lighting R&D and eventual bulb lines must follow technology progression. Do not change the calendar alone; implement the actual 1878 products and systems. Old-save migration and preservation are not requirements.
- [ ] **Washington rooms and local map:** Strengthen the 26 recorded places into an accessible, legible city with real room navigation, player/NPC access parity, fixed or clearly provisional pins, category filters, discovery, and appropriate period openings. A pin is merely the location's map representation; its rooms are the simulation.
- [ ] **Resident lives:** Improve locally consistent daily schedules, clock granularity, travel, jobs, pay, needs, savings, relationships, choices, private knowledge and observable consequences. NPCs should use the same doors, rules and workplaces as protagonists. Alexi Rurik remains a Russian-only, independently acting NPC, not a playable fifth career.
- [ ] **Four separate desks and grounded entry jobs:** Charlie owns his modest component factory; Samuel “Sam” Harlan walks a beat and writes citations/incident reports, earning later advancement or pursuing personal inquiries off duty; Elias “Eli” Crowe is an obscure nightclub doorman paid by the shift; Edmund Wardman is the black-sheep orderly at District Asylum under his unnamed brother. All four may remain ordinary or advance; none is forced into an empire. Do not present a detective casebook as rookie beat duty.
- [ ] **City as cause-and-effect engine:** Newspapers reflect verifiable local events, not arbitrary player-centered stories; crime, policing, institutional affairs, gambling, marriages, commerce, illness, employment and relationships affect residents over time. Start with small believable interactions in existing rooms rather than multiplying unfinished destinations.
- [ ] **Longer local arcs:** Period-appropriate Washington electricity milestones, an alternate-history 1893 Washington World's Fair, a conditional Federal Electric bulb-supply contract, and a **later separate streetlighting bid**. Politics begins with city-based contacts/influence and may eventually lead to national office; build a nationally consistent election framework only when necessary.

### Later · national worldbuilding backlog (deferred, not cancelled)

- [ ] Decide the actual names, number, centers and **new geographic borders** of the postwar purpose-based districts. Never treat old state lines as their borders by default.
- [ ] Create the national district map, transport links, trade networks, supply chains, migration, and cross-district simulation **only after Washington's systems support them**.
- [ ] Determine district governance, constitution, taxation, courts, representation and federal election procedures compatible with a nation without states; then connect the businessman-to-president political arc.
- [ ] Expand beyond D.C. only on a later explicit scope decision. Until then, external districts can appear as **background newspaper mentions, trade origins, visiting NPC backstories, or political references** without being visitable simulated worlds.

**Implementation discipline:** Design decisions go immediately into this roadmap and `DECISIONS.md`. Previous work remains preserved below as chronological history, including older national-feature proposals; **this section supersedes their priority**. No national code expansion is authorized by this scoped planning instruction. Current-game reliability, single-branch Git workflow and tested incremental builds remain in force. Old-save compatibility is not required.

## Future Washington case arc: Chinatown smuggling and police corruption · proposed 2026-10-23

**Setting:** A specific Washington trafficking/smuggling network moves contraband, including drugs suitable to the period, through contacts and businesses in Chinatown. **Some Metropolitan Police officers secretly take payments to protect the network**. The criminal ring and its protectors are individually identifiable actors with records, money, schedules and relationships; they are **not representative of Chinatown as a community**. Chinatown continues as an ordinary, living neighborhood, with families, merchants, social life and residents who may have no involvement, oppose the ring, or be harmed by it.

**Player discovery:** Samuel “Sam” Harlan begins as a rookie **assigned on duty to Hillsdale only**. He cannot investigate Chinatown as an official Hillsdale patrol assignment. **Off duty**, as a civilian, he can visit Chinatown like other accessible city locations, talk to residents and observe suspicious circumstances. Any later *official* police work in Chinatown needs an **actually earned assignment, transfer or promotion**, not an automatic exception to the existing shift travel lock. Sam may misunderstand signs, encounter misinformation or fail to discover a lead.

**Uncertain captain:** The police captain's truth is deliberately **not predetermined as always corrupt**. At campaign generation, choose a reproducible hidden variant and persist it to that profile: captain involved; captain knows and ignores it; captain genuinely unaware; or captain investigating corrupt officers. These are *working possible variants*, not a claim every campaign needs identical probabilities. A particular campaign has one coherent underlying reality, not a fact that changes based on player guesses. The captain's reputation, behavior, associates and evidence must agree with that truth.

**NPC cause-and-effect:** Corrupt officers receive plausible hidden payments from concrete sources; protected drug deliveries have routes and risks; missing/altered police records should be traceable to actual authorized actors and times. Witnesses only know what they encountered, rumors can be wrong, personal testimony may be self-serving, and the player should never see the secret conspiracy truth through unearned omniscient UI. The player can follow money, discrepancies, unusual meeting patterns and contradictory witness statements. Avoid guaranteed revelations or turning every officer into a criminal.

**Possible consequences (not implemented):** Sam may protect himself, quietly investigate, report evidence, challenge a corrupt superior, choose not to intervene, or become compromised himself. Suspicion is not proof; accusations should have realistic institutional risks. Captains, corrupt officers and criminals remain active regardless of whether Sam ever encounters the story. This could later intersect with Eli Crowe's **optional** underworld route without forcing Eli to participate.

**Current status:** **Roadmap/canon groundwork only.** No smuggling simulation, police corruption system, named captain, randomized captain truth, evidence-chain code, Chinatown patrol authorization or new role privileges have been built. Future slices must be source-tested, save-stable and respect the Hillsdale-on-duty versus citywide-off-duty travel rules. 

## v0.6.58-dev · Hillsdale patrol jurisdiction, civilian freedom · October 23, 2026

- [x] Display **Hillsdale** as the neighborhood and its street; keep the existing `hillsdale` place identifier for autosave/map compatibility. Mention Barry Farm only as a historical alternative name.
- [x] Limit **Samuel “Sam” Harlan's official police foot patrol to Hillsdale**. The only places accessible for *on-duty travel* are his Hillsdale neighborhood beat and the Metropolitan Police station where he writes reports.
- [x] Provide **clock-in and clock-out controls at the police duty-room desk**. While on duty, both map navigation and direct city-room travel prevent visits outside the police station and Hillsdale. Police encounters cannot be started in Chinatown.
- [x] Once **off duty**, Sam is free to visit Chinatown and other normally accessible Washington locations **as a civilian**, without special policing privileges. No global location ban on Chinatown or other profiles/NPCs.
- [x] Preserve patrol autosaves. Missing duty flags default to off duty. A formerly assigned, unresolved Chinatown patrol incident can be transferred to a sergeant from the station, retaining its history without inventing a solved case or deleting it.
- [x] Update Sam's character codex, canonical route description, README and regression tests for on-duty/off-duty restrictions and saved incidents.
- [ ] Design future promotions, new assignments and any possible change of jurisdiction **only after explicit later approval**. Hillsdale is Sam's sole current police beat.
- [ ] Complete richer Hillsdale neighborhood events, residents, policing, and an earned career path while respecting unrestricted *civilian* movement.

## v0.6.57-dev · The Unknown Doorman · October 23, 2026

- [x] Give Eli Crowe his actual **restricted Doorman’s Station** at the existing second nightclub. The club’s permanent public name and proprietor identity remain **undecided**. A generic club room and closed proprietor office remain separate.
- [x] Create a playable night-only employee loop: spend **10 in-game minutes** minding the door, handle one of five everyday visitor situations in **5 more minutes**, and earn **$0.30 provisional wage per completed segment**, capped at four segments per game night.
- [x] Save actual cash, activity, pending visitors and ledger records to the criminal protagonist’s own autosave. Reject multiple wages for the same segment, incorrect location, another career and day-only activity.
- [x] Provide Eli’s personal desk **work ledger** and a live room UI at the nightclub door. Add **Enter Current Location** to each of the four desks, so a new character can enter an assigned workplace directly.
- [x] Regression-test wage payments, night windows, caps, duplicate pay denial, staff-only room access, and source/runtime wiring. Preserve existing police, industrialist, Wardman and NPC systems.
- [ ] Replace provisional shift wages with researched, period-appropriate pay rules integrated into the same labor/economy simulator used by all four careers and NPCs.
- [ ] Build owner/floor-manager relationships, genuinely autonomous club customers, the nightclub's permanent design/name, job discipline and advancement, and optional underworld contacts that arise from actual interactions rather than predetermined crime.
- [ ] Complete the **1878 component-first Federal Electric factory** and authoritative continuous Washington world clock next, before broadening the rest of the city.

**Historical supersession notice:** The v0.6.56 two-beat patrol is no longer Sam's assignment. **v0.6.58 Hillsdale-only on-duty patrol and citywide off-duty civilian access control current gameplay.**

## v0.6.56-dev · The Patrolman’s Beat · October 23, 2026

- [x] Introduce a Metropolitan Police **restricted patrolmen's duty room** and **sergeant's office**, separate from the existing public station entrance. Sam begins at his authorized desk; ordinary visitors and rookies cannot access the sergeant's private office.
- [x] Walk actual registered **Barry Farm** and **Chinatown** neighborhood-street rooms as Sam; charge 10 game minutes per patrol circuit.
- [x] Offer small ordinary encounters with choices: wagon crossing obstruction, shop dispute, found property, street noise and directions. Charge 5 game minutes for a response. Issue a summons only where applicable, never random fines as personal income.
- [x] Return to Sam’s station duty room to complete 5-minute written reports; allow paperwork after the business day. Carry pending incidents and saved reports through time passage, room travel, autosave and reload. Bound archival history while retaining totals.
- [x] Leave rookie detective casebook disabled and company operations owned by Charlie. Preserve alternate Washington and all four lives.
- [x] Add source and repeat-action regression tests; document exact limits.
- [ ] Expand to timed shift assignments, beats covering more neighborhoods, proper roster/payroll, lost-property chain of custody and citation ordinances suitable to the alternate 1878 city.
- [ ] Attach witnesses and street incidents to actual NPC locations/behaviors; implement referrals, supervisory review, measurable fairness and historical discriminatory treatment where applicable.
- [ ] Support off-duty investigations, earned detective training, rank progression and real case assignment after Sam proves himself.
- [ ] Continue **1878 electrical component manufacturing** as the priority next major Washington-only factory slice.

## v0.6.51-dev · Washington public contact intelligence (source-only) · October 23, 2026

- [x] Model provisional public next-appearance windows for seven named residents from the *persisted* absolute calendar, including weekend factory/police absence and true overnight periods.
- [x] Add visible, responsive itinerary cards under Journal → Contacts, **only after the active character's first physical greeting**. Private NPC goals, rumors and unpublished knowledge never populate this UI.
- [x] Add a distinctive third face-to-face topic per NPC: *Ask About Washington*. Once-per-date records, capped contact influence and autosaved journal entries; no omniscient testimony.
- [x] Refresh visitor panel without duplicating resident rows, refresh learned contacts on NPC schedule changes.
- [x] Test overnight/midnight, weekend, save/reload, legacy-unmapped, un-met secrecy and once-a-day dialogue. Preserve all previous market, factory and profile logic.
- [ ] Convert provisional routine windows into player-negotiated meetings only after one reliable authoritative calendar. Show that an NPC **may** be there; no guaranteed future appointment today.
- [ ] Expand NPC agency into typed motivations, cases, rivalry and consequences under explicit, testable mechanics; continue to distinguish locally observed information from rumors.


## v0.6.52-dev · Autonomous situational NPC decision layer (source-only) · October 23, 2026

- [x] Replace random/hashed named-NPC goal choice in mapped and legacy routine paths with a deterministic occupation-specific utility planner.
- [x] Introduce seven individually tailored goal weights grounded in ambition, caution, sociability, exhaustion, known current work pressure, public headlines and each agent's own private observations, never another NPC's hidden thoughts.
- [x] Persist each actor's most recent motive score, situation snapshot and plain-language reason as **private save data**; public contact cards and newspapers do not reveal confidential future intentions.
- [x] Preserve existing room destinations, movement rules, face-to-face talks, calendar periods, autosaves and phase fallback. Add a warmer acquaintance greeting after repeated earned conversations.
- [x] Test role-dependent priority switches, witnessed staff risk, club raid concerns, public police news, own knowledge isolation, fatigue/rest, deterministic replay and previous NPC behavior.
- [ ] Add richer autonomous plan execution and consequences: directed travel, open-ended choices constrained by world rules, local interactions with witnesses, and newspaper publication only after observed/documented events. Current goals shape private intention, not independent property purchases or running crime cases.
- [ ] Deliver full clock authority for factory/market/venue and negotiated appointments; allow resident decisions to evolve within a trustworthy continuous city calendar.


## v0.6.53-dev · Procedural Poirot-style detective cases (source only) · October 23, 2026

- [x] Add an offline truth-first mystery engine, four distinct suspects, hidden case truth, independently sourced means/motive/opportunity records, alibis and uncorroborated rumor.
- [x] Validate each generated case has exactly one supported culprit with a complete three-thread evidence intersection.
- [x] Integrate playable investigation, individual suspect interviews and accusation buttons into the Patrolman career desk. All interactions consume real game-clock time, never ambient wall-clock time.
- [x] Persist generated cases, discoveries, interviews, accusations, failure state and case archives inside individual character profiles, including reload and replay safety.
- [x] Add Legal section and third-party research notices in GitHub repository and README.
- [ ] Transition from police casebook generation into genuine autonomous murders: NPC choices cause irreversible witnessed city events; victims are removed from the active simulation consistently.
- [ ] Spawn case records from actual world events for all character routes, rather than independent casebook templates. Add real geography, witnesses, evidence access permissions and police procedures.
- [ ] Build historical investigation tools, witness memory accuracy, motive inference, relationship histories, evidence challenges and time-sensitive consequences.

## Approved campaign direction · January 2, 1878 opening and the electric-lighting revolution (planning only, October 23, 2026)

**Design target:** A new Federal Electric campaign opens on **January 2, 1878**, before commercially practical incandescent bulbs. This is a decision about future gameplay, not a change to the currently implemented **January 1890** start. Audit every historical location, machine, vehicle, electrical process, newspaper, political event, and contract for date accuracy. Obsolete autosaves are not a compatibility target; no old-save migration or its tests are required.

### 1878–1879 · A component factory, not a light-bulb factory

- [ ] Start as a modest **manufacturer of electrical components and apparatus**, with early production recipes grounded in the period: telegraph keys, relays, contacts, switches, insulators, wiring and fittings, and battery hardware. Verify every historically specific item before enabling it.
- [ ] Build component-focused factory stations and tooling, raw material needs, stock bins, quality grades, labor, maintenance, orders, suppliers and delivery deadlines. The player's first actual sales contracts should be for components, not finished light bulbs.
- [ ] Add early customers: telegraph offices, railway and communications companies, laboratories, inventors, electrical installers and government purchasing departments.
- [ ] Keep early bulbs an **experimental research opportunity**, not a routine sellable product, until manufacturing capability, technical knowledge, appropriate tooling, materials, and patent/licensing constraints allow it.
- [ ] Give the industrialist choices: keep a steady component business, expand to electrical systems, invest in risky research, license inventions, or prepare for lamp production. Research costs money and time; component orders should still sustain the business.

### 1879–1880s · Practical incandescent lighting arrives

- [ ] Advance historical technology and markets on the authoritative saved world date. Incandescent lamps become manufacturable only after the relevant technical milestones and player's investment, not on day one.
- [ ] Add evolving bulb methods, machine tools, glass and filament supply, defects, burn-life tests, output capacity, royalties or patents as appropriate, component-to-lamp production line upgrades, and commercial bulb buyers.
- [ ] Retain multiple realistic product families: telegraph/electrical components, lighting apparatus, wiring/switchgear and eventually incandescent lamps. The user chooses where capacity is committed.
- [ ] Represent early **electric arc streetlights** separately from ordinary incandescent bulbs. Washington began electric streetlighting before the 1893 fair; the fair must not be presented as the first electric light in the District.
- [ ] Make 1878–1892 gameplay substantial and replayable: customers can be gained or lost, rival inventors and manufacturers compete, electrical demand grows, capital is raised, and reputation, manufacturing record and political contacts persist.

### 1893 · Alternate-history Washington World's Fair

- [ ] Preserve the **1893 World's Fair in Washington, D.C.** as **intentional alternate history**; the real World's Columbian Exposition took place in Chicago.
- [ ] Add an achievable landmark contract to **manufacture and deliver incandescent bulbs for the fairgrounds**. The player must qualify and win based on capacity, price, quality, financing, reliability and relationships. Avoid a guaranteed award that negates business decisions.
- [ ] When the bulb supply contract is awarded, publish a prominent historically styled **Metropolitan Ledger front page** celebrating the fair's electrification and mentioning Federal Electric as its bulb supplier. Do **not** issue this contract story on January 2, 1878, before the company can manufacture bulbs.
- [ ] Model phased deliveries, worker schedules, supplier failures, production bottlenecks, lamp defects, fair opening deadlines, rivals, demonstrations and reputational gains or losses. Finishing a manufacturing lot does not automatically complete a delivery.
- [ ] During the fair, visitors, workers, dignitaries, business rivals, reporters and independently scheduled residents can attend the actual fair **rooms**, and interact within normal access limits. Lighting changes the physical scene and newspaper coverage when the player's deliveries genuinely succeed.

### 1894 onward · Compete for Washington streetlighting modernization

- [ ] **After** the fair arc, announce a separate District modernization tender. Federal Electric can compete to supply lighting hardware, lamps and/or fixtures, subject to the specific procurement requirements and available technology. This must be distinct from the already existing 1880s arc-light installations.
- [ ] No guaranteed streetlighting contract: bidding, engineering suitability, funding, competitor bids, public opinion, mayoral/District patronage, political contacts, and fair performance affect the outcome.
- [ ] Awarded contracts create production and delivery obligations, operating consequences, newspaper reporting and a believable link to later business-to-politics opportunities. Failing the fair does not necessarily end the whole campaign.

### Russian-speaking NPC and language realism

- [ ] Include **at least one persistent NPC who speaks Russian only**, with no magically available English conversation. Do not quietly make all Russian NPCs bilingual.
- [ ] Store language fluency per NPC. The player may use an interpreter, learn enough Russian, or pursue communication through appropriate intermediaries; only understood messages enter the detective notebook or business contacts as understood facts.
- [ ] Allow Russian-only speech to matter for negotiations, witnesses, clues, social relationships and independent NPC routines. Keep text legible and appropriately translated only through an earned or supplied translation.
- [ ] Retain the Russian Trade Hall and Russian visitors/merchants, with **Imperial Russian** context in the 1870s and later historical transitions only when the game calendar reaches them.

### Russian-only character · Niko Bellic-inspired dramatic design

- [ ] Create an original, **Russian-speaking-only** resident with a guarded personality, dry humor, personal loyalties, practical skills and a complicated past, loosely inspired by the **narrative depth** of Niko Bellic rather than copying him. Niko is Serbian, not Russian; our NPC is Russian and should have an authentically 1870s Imperial Russian backstory, not Niko's modern Balkan-war history.
- [ ] Let circumstances decide whether he works as a laborer, guard or tradesman, assists others, gives a difficult witness account, becomes an ally, or gravitates toward criminal associates. Avoid forcing a criminal ending.
- [ ] Model trust, interpreters, untranslated testimony and language barriers honestly; the player cannot automatically understand a Russian-language witness statement.

### Sequencing, QA and safeguards

- [ ] Plan first, then implement in approved source slices: campaign-start migration; component inventory/recipes; historical research and technology gates; component customers/orders; lamp R&D and factory conversion; fair contract; newspaper/fair experience; later streetlighting bid; language fluency.
- [ ] Test 1878 new-profile starting inventory and products, pre-invention bulb lockouts, license/technology decisions, fair eligibility and branch outcomes, delivery timing, historical arc/incandescent distinction, save/reload, and post-fair bid requirements.
- [ ] Keep NPC jobs and travel grounded in actual registered rooms; map markers are only visual navigation. Apply venue and room-specific authorization equally to player and NPCs except for justified job/household permissions, with time-dependent availability.
- [ ] No code, playable starting-year changes, builds, binaries, or asset replacements are authorized by this **documentation-only planning update**.

## v0.6.54-dev · Capital & Consequence foundation · October 23, 2026

- [x] Rename visible title/menu, desktop package metadata, Linux launch/archive labels and development docs to **Capital & Consequence**. Federal Electric remains the businessman's company, not the whole game. Legacy save namespaces can be cleaned up; no compatibility obligation applies.
- [x] Preserve **four** canonical protagonists in code: **Charles “Charlie” Whitcomb** (businessman/factory owner), **Samuel “Sam” Harlan** (rookie Black patrolman), **Elias “Eli” Crowe** (anonymous nightclub doorman), **Edmund Wardman** (District Asylum orderly). Show established names on career selection without changing persistent route IDs.
- [x] Keep the rookie cop on beat duty and desk reports rather than presenting detective work at starting rank. Existing standalone mystery engine remains as unassigned groundwork for future promotion/career progression.
- [x] Name the **District Asylum** (historically fictional, separate from the Government Hospital for the Insane) in the city registry, with public reception, orderly station, patient ward, administration and superintendent office. Edmund begins as an orderly; his unnamed brother directs the institution.
- [x] Register **26 numbered pins**, with 14 previously positioned and 12 **provisional**. Add map category labels for institutions, gaming and underground locations. Do not treat a pin as a separate entity from its room registry.
- [x] Add staff/permission-checked room entry shared by player and NPCs; restricted factory offices and hospital areas are not available to ordinary visitors. Build a deterministic NPC visit planner across visitable city rooms.
- [x] Add per-profile NPC income, shift attendance, small expenses, gambling and loan ledger, settled once per observed clock period. No away-from-game progression; no unpublished omniscient NPC data. Add **Alexi Rurik** to autonomous cast, Russian-only.
- [x] Create source tests for room access, NPC economics and named protagonist/locale contracts, and trigger source QA on main.
- [ ] Finish verified beginning in **1878**, with component manufacturing, authentic 1878 customers, tooling and orders before incandescent lamps; do not swap the date while bulb-first production is still hardcoded.
- [ ] Replace provisional map positions with historically surveyed locations or map redesign; do not claim placeholder locations are historical.
- [ ] Implement real patrol citations, repeatable shift assignments, paperwork, wages, promotion, independent inquiries; doorman duty, shifts and personal desk; Edmund's institutional duties and family drama; industrialist production overhaul.
- [ ] Integrate NPC money and movement with journey duration, local work, encounters and the shared minute-accurate world clock. Currently period-based deterministic groundwork; not a simulated round-the-clock society.
- [ ] Add the alternate-history **1893 Washington World's Fair** competitive bulb-supply contract and later separate D.C. streetlighting opportunity, with branching business outcomes.
- [ ] Verify manual packaged executable under real desktop interactions after source test acceptance. Packaging remains manual, not triggered by every source push.

## v0.6.55-dev · United States of Districts · October 23, 2026

- [x] Verify the **live** title screen, not the retired title scaffold, says **CAPITAL & CONSEQUENCE** and **One city. Countless lives. Every choice has consequences.**
- [x] Add the national post-Civil-War alternate history. The real U.S. Civil War ended **1865**; a *fictional postwar reorganization* then dissolved states and erased their old boundaries in favor of purpose-based federal districts.
- [x] Provide a title-screen **District Register** and testable national charter. The capital is Washington, District of Columbia; **Agriculture & Husbandry District** represents the national breadbasket; foundry, mining, timber, maritime, transport and commercial divisions are working concepts.
- [x] Clearly mark the reorganization date, noncapital names, district capitals, new borders and national government architecture as **undecided**, not fabricated historical geography.
- [x] Preserve existing 26 local Washington pins, career saves and factory systems without pretending that a whole U.S. national map or electoral system has been built.
- [ ] Design geographically coherent **new** district boundaries that **do not trace the abolished states**, with appropriate agricultural regions, industrial areas, harbors, mines, rail routes and capital access.
- [ ] Define the alternate government's legislature, district representation, courts, revenues, constitutional powers and the businessman's presidential candidacy and election requirements.
- [ ] Connect district economic specializations to future Federal Electric supply chains, national trade, NPC migration, politics, transportation and newspaper stories.
- [ ] Complete the remaining 1878 factory/economy integration; obsolete save migrations are not a prerequisite.
