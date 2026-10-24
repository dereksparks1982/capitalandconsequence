## October 24, 2026: TEN-YEAR presidency with unlimited reelection

**Owner-approved constitutional rule:** Every elected president serves a **ten-year term**, may stand again **without any maximum number of terms**, and is chosen through the **nationwide popular vote without an Electoral College**. The elections are every ten years. Since **Samuel J. Tilden won the alternate 1876 election**, he begins his first term on **March 4, 1877**. The next scheduled election is **1886**, with the next inauguration **March 4, 1887**. **There is no presidential election in 1880.** Do NOT transplant the historical four-year rule, U.S. two-term limit, or real Hayes/Cleveland election history. **The winner in 1886 is NOT decided**; no successor or death date may be assumed without simulation/owner direction. This law allows an extraordinarily long political career and significant impact on the country. See [political canon](POLITICAL-WASHINGTON.md).

> **October 24 owner clarification, overriding contrary historical notes:** Club invitations are **trial games**. The Commerce and Embassy clubs award **physical membership cards** after suitable sportsmanship and speech; arrogant or overly acquisitive guests may face a short cooling-off period. The **Boiler Room is open to everyone**. **Licensed boxing has tournament championships over weeks or months; underground fights and other underground sports have no tournament, bracket or champion.** They are voluntary spontaneous activity with persistent social bonds, not standings. See [sports canon](SPORTS-CHAMPIONSHIPS.md).

## October 24, 2026 · Names, clubs, sports, politics and map-design decisions

**Owner-approved story decisions (documentation; gameplay implementation tracked separately):**

- British **Eleanor Victoria Ashcroft** is **Madam Star**. Her upscale club has meals, drinks, confidential companionship and period-correct refined background music but **no card games**. Earlier president founder remains unnamed. French **Lucien Étienne “Lui” Delacroix** owns the opposite, risqué cabaret where Eli works. **Do not call him Tony**. His club's public business name is not approved yet.
- **The Embassy Room** at the existing Chevy Chase Club map site is the high-society card room, never at Madam Star's club. Other recurring rooms are the **Boiler Room** (racially mixed working class) and **Commerce Club** (middle class). Their regular poker is **unauthorized**; government permit is required to make gambling legal. Separate **D.C. Poker Challenge** permits **five-card tournament poker only** at its own TBD venue. Do **not** turn all three rooms into tournaments or call their cards legal.
- Washington sports should develop **monthly championship titles, persistent contenders, qualification, records and bets on heats, individual events, qualifying, finals and overall champions**. Keep ordinary events between tournaments. Midget-car racing belongs **later than 1878**, never silently spawn it at opening. **Twelve currently named drivers** in `oval-racing.js` are inventoried in [Character roster](CHARACTER-ROSTER.md).
- Real individuals belong in alternate-history 1878 Washington with plausible schedules and earned encounters. **Samuel J. Tilden** is president in established game canon; associates include **Thomas A. Hendricks, Abram S. Hewitt, John Bigelow, Manton Marble, Daniel Manning, William T. Pelton** and other researched historical public figures. **Specific alternate appointments besides the president remain tentative**. Research and distinguish history from fictional government. Political careers are future playable opportunities, not existing offices.
- **Capital Meats** and **District Meats** are competing **independent physical butcher shops**, not stalls in historical markets; both white proprietors decline Sam Harlan's custom. Add independent Black-owned **Hillsdale Butcher** and **Hillsdale Market**, and meat available in Chinatown. **Medford Meat Packing / Medford Meats explicitly SCRAPPED.** Hillsdale/Barry Farm should provide ordinary local services.
- Future pins use **functional category colors**, NOT blue-fiction/red-real. **Gold exclusively government**. Retain Fiction/Non-Fiction textual metadata and filters. Original map image never changes.

Supporting canonical references: [Character roster](CHARACTER-ROSTER.md), [Living city and map](WASHINGTON-LIVING-CITY.md), [Political Washington](POLITICAL-WASHINGTON.md), [Sports and government gambling](SPORTS-CHAMPIONSHIPS.md). [Current work](ROADMAP.md) distinguishes built from planned. **No unearned identities, fictional historical claims, or automatic release approvals.**

# Capital & Consequence · Recorded Design Decisions

> **CURRENT OWNER DECISION · OCTOBER 24, 2026 · PERMANENT MAP CANON:** The bundled Washington map is the single authoritative alternate-history map for **1878, 1938 and every playable year**. It never changes with the calendar. No historical replacement, reconstruction, map survey or map-image swap is authorized or planned. The asset filename `title-map-1938.jpg` is a legacy name, **not** the map's in-world date. Preserve all 34 numbered markers, working editable per-profile pin names, Save/Reset Name, map pin dragging/zoom and Locations category filters. Map pin labels are user-editable display names; location identity and access logic are separate. **This overrides all earlier 1878-map replacement requests, research, checklists, and draft roadmap items.** See [MAP-CANON.md](MAP-CANON.md).


> **Owner-confirmed file policy:** Do not split `app.js` or divide any existing source file into smaller files because of size, style or suggestions from external reviewers. Keep the game implementation in its existing layout. This is a documentation-only clarification, not authorization for a refactor or build.

## Current owner decisions · Fishing map and handoff (October 23, 2026)

- **Approved and implemented v0.6.86:** Six fishing locations total (pins 29–34), under a separate **Leisure & Outdoors** category. **Recreation & Competition** retains racing and boxing; **Gambling & Games** is separate. The map can filter actual destinations by these types.
- **Editable names:** Players may rename individual pins through the map while keeping canonical historical location names and stable IDs. Names/positions persist separately per player profile; resetting placement does not erase custom labels.
- **Permanent map decision (October 24, overrides the former replacement requirement):** Keep the current Washington map exactly as the game's canonical alternate-history geography for 1878, 1938, and all other years. No substitute historical map or year-driven map changes. All 34 numbered pins retain profile-local editable names, Save Name/Reset Name and Locations category filtering. The former research is withdrawn. See [MAP-CANON.md](MAP-CANON.md).
- **Owner expressly requested a test executable** after the six fishing pins. This has **not yet been delivered**. Build must go through manual-only packaging and smoke/size/SHA-256 validation, remain a private **unaccepted candidate** until the owner tests it. Current source QA passed: run 40062272284. The owner has asked to hand this thread off; do not misstate packaging as complete.
- **Still design-only:** Fish fight reacting to player choices through a live tension/direction display and menu/dialogue decisions. No aquarium, no mandatory selling or fish-slot-machine loop. Do not claim playable fishing is already implemented.
- **Binding existing instruction retained:** No file splitting, especially `app.js`, and no reverting the original Washington clock and 1878 setting.

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


> **NEW THREADS START HERE:** [CONTINUE-HERE.md](CONTINUE-HERE.md) is the authoritative, GitHub-persisted continuation handoff: exact verified source commit and QA, approved clock rules, current 1878 workshop, open milestones, and next build order. Read it **before** older handoffs, this README or roadmap.

## 2026-10-23 · v0.6.75 · Exact closing-bell component transactions

- The player may perform an electrical-component workshop action whose **actual duration ends at exactly 5:00 PM**. The owner's component materials/cash/receipt must commit **before** Sullivan's once-per-worked-day salary and Federal Electric's closing report settle. Spending *past* the bell is still refused. This does not change the 1 real second = 1 game second clock rule or let NPC actions advance time.
- The actual `app.js` master-clock advance supports a narrowly scoped `deferWorkshopClose` mechanism, used **only** by the component action adapter. Ordinary world ticks, travel and other activities keep normal time boundaries. `component-works-live.js` requires an explicit post-commit closing callback for a 5 PM action; the playable factory panel supplies it.
- Since `closeBusinessDay` autosaves, the panel sets `componentTransactionSequence` **before** the bell's first save, avoiding an autosaved receipt with a stale next-token counter. The assistant receives the same single company-funded wage, after the actual customer payment is recorded.
- The new `tests/workshop-closing.cjs` integrates the real application time gateway, the component order/shipment engine and assistant payroll to verify payment/report/clock/token ordering. Six focused source suites passed in V8; the full GitHub Actions run and actual Electron UI remain unverified. No package or release created. Old-save compatibility remains **not required**.

## 2026-10-23 · v0.6.74 · Only Charlie and one assistant at opening

- The starting January 1878 Federal Electric workshop has exactly **two people**: owner/operator Charles “Charlie” Whitcomb and **one paid assistant, Sullivan**. There is no inherited twelve-person crew or starting general manager.
- Sullivan is the existing `foremanSullivan` NPC identity repurposed to a workshop **assistant**, not a second newly spawned employee. He uses the established saved NPC goals, 8 AM–5 PM weekday workplace, accessible production room, personality, conversations, social memory and off-duty decisions. The remaining machine-era “foreman” nomenclature is legacy technical debt, not an additional staff member.
- Charlie does manual assembly as an explicit player-time action and earns no employee wage. There is **no per-unit labor cash deduction** during assembly. Sullivan's provisional **$1.00 per worked day** is paid at one day-close from company cash into his actual NPC economy balance; insufficient cash creates tracked salary arrears. Work action generation itself awards Sullivan **zero phantom wages**. This is **gameplay balancing**, not authenticated 1878 payroll research.
- Current assistant settlement is once daily at the old 5 PM close trigger; full continuous 24-hour economic event handling, hiring, proper hands-on NPC work production and accounting overhaul remain outstanding. The workshop transaction adapter refuses jobs **finishing exactly at 5 PM** as well as afterward to avoid processing payroll before a still-uncommitted workshop payment. This is a temporary atomicity guard pending improved shared-clock transaction scheduling.
- Targeted executable V8 checks on current source passed; complete new GitHub Actions Source QA/Electron gameplay still unconfirmed. No executable is authorized. **Old-save compatibility remains explicitly NOT required.**

## 2026-10-23 · CORRECTION: old-save preservation was an invented rule

**Owner never approved any requirement to preserve old saves.** The assistant introduced that constraint without authorization and wrongly treated it as policy. It is rescinded and supersedes every older or newer conflicting statement below: **do not perform compatibility engineering or retain obsolete 1890 gameplay solely to protect historical saves.** Old saves may break as the game evolves; focus on the real 1878 starting experience. The new/current campaign must still autosave correctly. No existing save files were deleted as part of this documentation correction.

## 2026-10-23 · v0.6.73 · Founding-era Exchange slice

- For 1878-only new profiles, the share quotation sheet uses eight invented period-suitable railway, telegraph, banking, coal/iron, shipping and machine-works issuers. Fictional issuers and opening prices are **gameplay balancing and alternate-world canon**, not claims about real corporations or historical prices.
- Only securities actually available in the current game year appear in the active quotation sheet, index and sector filters. Future-company symbols are gated at the back end and never accrue invented market movements or published history before their listing year.
- Older 1890-origin profiles keep their historical stock symbol/portfolio seed. This preservation is an incidental property of v0.6.73 code, **not an owner requirement** and may be discarded.
- This is one small checked market submilestone, **not** a declaration that 1878 company payroll, cash settlement, newspaper or stock-market research are finished. Targeted V8 source execution has passed; full new GitHub Source QA status and a real Electron playtest remain unconfirmed. No executable authorized.

## 2026-10-23 · v0.6.72 · Playable founding company

- New campaigns now start January 2, **1878**. Charlie owns Federal Electric's component works and begins with actual telegraph/electrical orders, material suppliers, timed assembly and paid warehouse shipments rather than a 1890 bulb-first contract.
- Use the existing `component-works.js` integer-cents inventory/receipts. Only the `component-works-live.js` and `component-works-panel.js` adapters bind that module to the common normal-speed game clock and visible Factory. Do not recreate electrical manufacturing as an independent economy.
- New 1878 workshop screens do not advertise incandescent bulbs or automatically grant technology, license or production stations.
- The full 1878 economy is **not** checked off. Period market, wages, newspaper, career NPC economy and later technical milestones still require work, tests and user acceptance.



## 2026-10-23 · v0.6.70 shared clock pacing · SUPERSEDED, NOT APPROVED

- Preserve one real-hour Business Day and one real-hour Washington Night while making that rhythm advance an authentic 24-hour in-game day: 8 AM–5 PM (9x passive speed), 5 PM–8 AM (15x passive speed).
- An intentional player action or journey still costs its exact stated **in-game** seconds; it debits the remaining real-time phase allowance proportionally and saves the fractional remainder to avoid charging extra for repeated small actions.
- Daytime factory passive production advances at the same rate as the authoritative saved 24-hour calendar. Old accounting turn frequency, schedules and report logic are still acknowledged as transitional.


## 2026-10-23 · v0.6.69 real saved Washington clock integration

- Use existing `world-clock.js`, `calendar-bridge.js` and `time-transactions.js`, not a second moon/calendar library or invented time formulas. Expose one `washington-time.js` adapter to gameplay, NPCs, dialogue and the sky.
- The player sees a 12-hour time of day and date from that saved calendar, not the legacy minutes-remaining countdown. Explicit closing and new-day decisions may advance time to the next boundary; no background time passes while the game is closed.
- NPC decisions and local model prompt grounding may use **current observed** night/day, bad weather, moon phase and eclipses. They cannot learn future eclipse dates merely because the astronomy engine can compute them.
- Legacy phase budgets, periodic stock/contract settlement and 1890 bulb factory are still transitional; do not claim the full 24-hour economic clock or real 1878 start is completed until each actual consumer has been migrated and QA tested.


## 2026-10-23 · v0.6.68 Washington almanac

- Place unobtrusive weather and sun/moon indicators in the game's existing upper information strip. The icons summarize the current simulated Washington conditions, not a real-world weather feed. Historical astronomical calculations must use the saved world clock.
- Reuse licensed [Astronomy Engine](https://github.com/cosinekitty/astronomy) (MIT) rather than invent fragile lunar/solar/eclipse physics. Retain the upstream license verbatim and keep all calculations local. There is no need to cap game size merely for the sake of a smaller archive.
- Eclipse observation is potential evidence only after a real NPC acts and a legitimate witness or investigator discovers it. The lunar calendar does not automatically create murderers or magically reveal crimes.


## 2026-10-23 · v0.6.67 local freeform conversation

- The goal is **genuinely unscripted multi-turn conversations** with the NPCs, not only menus and fixed lines. The first implementation uses a local OpenAI-compatible model endpoint, no automatic cloud costs, and no required particular model architecture; bigger weights are allowed when their quality warrants it.
- The Electron main process owns the loopback-only model transport. The renderer has no direct network, filesystem or process execution privilege; NPCs only receive context relevant to their own date, location, personality, public known facts and actual saved conversation.
- Conversation is separate from game-state authority: generated promises or boasts must not move actors, expose secret files, spend money or create evidence without subsequent validated game actions.
- The Electoral College was abolished after the Civil War in the alternate United States; presidential elections use national popular vote only. **Working 1878 chronology: Samuel J. Tilden is president after winning 1876.** Later presidential selections remain unsettled pending political chronology approval. The live playable factory still opens 1890 and is not relabeled.
- Player-to-Russian-only speech requires an acquired common language or future real interpreter. Autosaved dialogue belongs exclusively to its current profile. A local model/server must be installed separately; no executable is being built now.


## 2026-10-23 · v0.6.51 learned public itineraries

- The Contact File must never provide remote surveillance of strangers. Only residents **personally greeted by the active playable character** appear in earned itinerary cards. Cards show provisional *public* whereabouts, not NPC secrets, private beliefs or future guarantees.
- Public NPC conversation has a new Washington subject with authored lines, one journal observation and one small relationship point at most once per NPC and simulated date. This is not a generative dialogue claim.
- No real-world historical operating hours are asserted; source only, no executable.


## 2026-10-23 · v0.6.52 first utility NPC planning

- Game AI must respond to the *actor's actual known* context and individual temperament, not randomly rotate every character through goals. A named NPC evaluates occupation-linked utility goals once each observed routine period, with reproducible offline rules.
- Persist decision evidence privately per profile. Never broadcast NPC secrets or raw utility scores to another actor, the Contact File, or the Metropolitan Ledger without an explicit observed path.
- Keep authored dialogue for now; no promise of connected cloud models or freeform LLM intelligence. Economic agency and movement remain separate future slices. No executable.


## 2026-10-23 · Truth-first cases, observable evidence, and attribution

- A generated homicide must have a definite truth before testimony and evidence appear. The player cannot see the answer or invisible candidate sets from the casebook; three evidence threads must support exactly one culprit.
- Investigator career gets playable casebook work with real time charges now, but does not falsely claim its cases were committed by independently scheduled city NPCs until world-state consequences are integrated.
- Retain legal and third-party notices in LEGAL.md and the README; use verified permissive code with its notices, and treat other publicly visible sources as architectural reference material.

## 2026-10-23 · 1878 campaign opening and earliest products

- Accepted as the next campaign's **design target**: **January 2, 1878**, with initial manufacture of electrical/telegraph **components**, *not* ordinary incandescent bulbs. The current executable/source still starts in 1890 until the historical migration is implemented and tested.
- Component products and orders make up a real, profitable early game. Incandescent technology must be unlocked through correct historical advances, development or licensing and new production machinery.
- The alternate-history **1893 Washington World's Fair** is the achievable major bulb-supply contract milestone and major newspaper feature **when won**, not an opening-day 1878 newspaper claim. Historically, the actual World's Columbian Exposition was in Chicago.
- A **separate** District streetlighting modernization contract becomes competitively available **after the fair**; existing 1880s Washington electric arc streetlights are a distinct lighting technology and must not be rewritten out of history.
- At least one NPC exclusively speaks **Russian**, affecting the actual accessibility of witness reports, negotiations and social exchanges; period language fluency, interpreters and earned translation apply.
- Protect current-game autosave, component-era pacing, NPC room permissions and recorded events. Old save formats are not a compatibility target. Do not alter source gameplay or package a build until subsequently requested.

- The Russian-only NPC should carry the emotional and mechanical depth of a **Niko Bellic-type** dramatic character, but be wholly original, distinctly **Russian** rather than Serbian, and plausible in **Imperial Russia / Washington in 1878**. He speaks Russian only until in-world language development changes that, and his eventual morality/occupation is emergent, not fixed.
- The fictional criminal protagonist may begin as a **nightclub doorman/bouncer for the Gay Tony-inspired proprietor**, with paid working shifts and free-time choices, without copying Luis Lopez or Tony Prince as characters. His sexual orientation may be gay or straight, separate from career and moral destiny.

## 2026-10-23 · v0.6.54 fixed protagonist identity and release scope

- Official product name is **Capital & Consequence**, repository `dereksparks1982/capitalconsequence`. **Federal Electric** remains a company **owned by Charles “Charlie” Whitcomb from the beginning**; he is not a hired factory worker.
- The **four protagonists** are Charles “Charlie” Whitcomb (businessman), Samuel “Sam” Harlan (Black rookie beat patrolman), Elias “Eli” Crowe (unknown nightclub doorman), and Edmund Wardman (black-sheep orderly at fictional District Asylum, directed by his unnamed brother). Earlier notes labelled some names proposed; user requested locating them and **using all four**, therefore these are our current working canonical identities.
- Samuel does ordinary walking-beat work, tickets, calls and desk paperwork **first**. He may pursue his own inquiries in free time and enter detective positions only through career advancement. Do not surface a homicide desk as routine rookie duty.
- Every career retains its personal desk. New Wardman starts at the District Asylum. Existing legacy route keys `industrialist`, `investigator`, `criminal`, `wardman` and autosave identifiers remain stable.
- **Alexi Rurik** is an independently acting **Russian-only NPC**, not an unlockable/playable fifth protagonist. Future full name changes require user discussion; no unapproved Russian surnames are added.
- Current playable new campaigns still use the existing **1890** machinery/time framework in this slice. The **1878** campaign and component-first products remain next-priority work and must ship as one validated implementation, rather than silently relabeling an 1890 bulb factory.
- New map pins 15–26 are **provisional visual placements**. Every map location contains rooms with shared permissions; employee access is specific to an authorized workplace, not a free pass to every private office.
- Incremental tested source changes, immutable save histories and immediate documentation after every approved decision are standard development practice. No auto-release or binary until validated.

## 2026-10-23 · National reconstruction and the active title screen

- The product's selected title is **Capital & Consequence**, and its selected motto is **One city. Countless lives. Every choice has consequences.** Both appear on the actual start screen, not merely in a README or old office art.
- **National world canon:** Historical American Civil War **1861–1865**; **after** its conclusion, an alternate U.S. reform abolished all *states* and old state borders and established **purpose-based national districts** for essential functions: grain farming, animal husbandry, heavy manufacturing, raw materials, timber, maritime ports, transportation, trade and national governance.
- The capital remains **Washington, District of Columbia**. Working labels for the other districts, their number, size, governance, exact new borders and the date of reorganization are **not yet user-approved**; do not make old states the foundation of their geography.
- A **District Register** on the live title screen records the working framework. This is a planning/lore system, **not** a functional nationwide simulation, and it is distinct from city map pins.
- National electoral and political rules must fit this alternate district republic rather than mechanically importing the historical state-based Electoral College. Private businesses, including Charlie Whitcomb's **Federal Electric**, remain part of the setting.
- Current newly created game profiles still start in **1890**. The intended **January 2, 1878** components-first campaign remains the next factory conversion; don't silently replace its date before production is historically compatible.

## 2026-10-23 · Scope correction: build Washington, roadmap the rest

- **Immediate development focus is exclusively Washington, D.C.** That means the playable four lives, city rooms and pins, businesses, historical 1878 component-first manufacturing, local NPC intelligence, patrols, nightclub, District Asylum, newspapers and locally earned politics.
- Other national districts remain **world background and a future roadmap**, not an invitation to build other cities, a national map, national travel, cross-district economy or full federal political systems now. Do not remove the previously accepted postwar no-state canon or the read-only District Register; simply **defer deeper development**.
- **The world deliberately resembles historical America without matching it.** Treat it as coherent alternate reality (the user used *Rick and Morty* as an analogy), not a literal adaptation or strict documentary history. Historical material is a reference point, not a requirement that outcomes and borders reproduce real history.
- The roadmap's new **ACTIVE DEVELOPMENT SCOPE · WASHINGTON FIRST** section supersedes national-development priority implied by earlier checklists. Include external district names/roles only as background to enrich D.C. until the owner changes scope.
- This instruction is recorded in documentation only, without changes to active gameplay, national district dataset, saves or release candidates.

## 2026-10-23 · v0.6.56 Samuel Harlan patrol gameplay

- Washington-only source slice under the approved DC-first priority. The playable patrolman is **Samuel “Sam” Harlan**, a Black rookie assigned **on-foot patrol**, not a detective with a horse, automobile, or unlimited station access.
- His station contains public entrance, restricted patrolmen's duty room (his desk), and restricted sergeant office. Stable legacy police location/entry room identifiers remain unchanged for saves.
- Street duty is **earned time spent at real Barry Farm/Chinatown neighborhood rooms**: 10-minute beat circuit, 5-minute measured non-homicide encounter response, then travel back to the station duty room for a 5-minute written report; nighttime desk paperwork allowed. Every action autosaves and preserves one pending incident until resolution and filing.
- The first five encounters are **authored and deterministic**, not autonomous violent cases, official 1878 legal procedure, or randomized published news. No personal revenue from summons. Detective access, actual wages, rank advancement, real geographic beat paths, and future procedural legality remain roadmap tasks.
- Federal Electric remains Charlie's property; Edmund works at District Asylum; Eli works the nightclub door. This slice does not expand beyond D.C., change the still-prototype 1890 start, affect national districts, or claim a completed 1878 component-first factory.

## 2026-10-23 · v0.6.57 Eli Crowe paid doorman groundwork

- **Elias “Eli” Crowe** starts an ordinary paid job as an unknown doorman, **not** the nightclub’s owner or a manager. The boss does not know his name at the beginning. No club proprietor name proposed elsewhere is approved. The existing provisional `secondNightclub` registry location retains its ID and gains a restricted staff post, public room, and forbidden proprietor office.
- At **Washington Night**, Eli may spend 10 charged minutes on duty, meet a routine visitor, and use another 5 minutes to handle that visitor. A successfully completed segment pays **$0.30 provisional balance**, once, with a **four-segment/night cap**. His personal desk contains the ledger. Honest doorman employment does not require criminal conduct.
- All four career desks gain an **Enter Current Location** action allowing their saved workplace’s actual room to open directly. The non-owner doorman cannot access private business files; the businessman's factory ownership and Sam’s patrol authorization remain role-specific.
- **Future research required:** real period wages and opening hours, staff identities, owner/manager relationships, visitor AI, club operations, nightlife customs and local laws. Do not mistake this first scripted visitor loop for a fully autonomous NPC clientele.
- Preserve existing autosave IDs, game clock charges, the 1890 prototype date pending 1878 factory work, the postwar national district background and the Washington-only development scope.

## 2026-10-23 · v0.6.58 Hillsdale-only police assignment, off-duty citywide access

- The map and location registry must **call the neighborhood Hillsdale**, not Barry Farm in normal UI. Barry Farm is an alternate historical label that may appear only in supporting descriptions. Keep the established `hillsdale` internal ID so no old save or pin is broken.
- **Samuel “Sam” Harlan can conduct police work ONLY in Hillsdale for now.** After he clocks in at Metropolitan Police, both the map and direct room navigation restrict travel to **Hillsdale** and the **police station** for reports and official shift management.
- **Clocking out at the station restores ordinary personal freedom**. Sam may then visit Chinatown or any other open Washington location under civilian rules. Chinatown is **not permanently closed to Sam**, and other careers and NPCs face no new restrictions.
- Duty status persists per Sam's profile; old saves lacking it are **off duty**. Previously saved pending Chinatown police incidents can be preserved by formally transferring them to a supervisor at the station, not erased or falsely solved.
- The previously implemented two-beat patrol circuit was an early prototype superseded by this correction. No expanded jurisdiction, police horse, detective duties or promotion is approved by this change.

## 2026-10-23 · Proposed Chinatown smuggling and police-corruption arc

- Washington's Chinatown may contain a **specific, independently acting drug/contraband smuggling network** protected by **some corrupt police officers who receive payments**. Other neighborhood residents and merchants are not treated as accomplices simply because they live or work in Chinatown.
- The **captain's involvement is unknown and variable by campaign**: possible involvement, deliberate tolerance, actual ignorance, or a secret investigation. Do **not** hardcode guilt, choose/advertise the answer at game start or let NPCs possess knowledge they could not acquire. Preserve one underlying campaign truth and tie all evidence to it.
- **Sam's on-duty police assignment remains exclusively Hillsdale**, with the police station as the only other duty location. **He can visit Chinatown and other ordinary Washington places off duty as a civilian**, looking into suspicious leads informally. Official Chinatown police jurisdiction is possible **only after a later earned assignment or promotion**.
- Any investigation should arise through real NPC conduct, suspicious money or police records, personal conversations and earned information. Rumors are fallible. The case can remain unresolved, and the people involved continue their lives independently.
- **Future design only.** No current police captain identity, smuggling system, secret campaign seed, corruption pay ledger or investigative privileges are created by this documentation update. See ROADMAP.md for the scenario and implementation requirements.

## 2026-10-23 · Historical thread close (v0.6.58 archival snapshot; no longer current)

- **Historical note only:** `HANDOFF-2026-10-23-THREAD-END.md` was the handoff at v0.6.58; it is now [archived](HANDOFF-2026-10-23-THREAD-END.md). **The sole current continuation handoff is [CONTINUE-HERE.md](CONTINUE-HERE.md).** Earlier claims that the game is still in 1890 or that legacy saves must be preserved are revoked.
- **Final checked code** is `v0.6.58-dev`; the last green source run is [39962299550](https://github.com/dereksparks1982/capitalconsequence/actions/runs/39962299550) at `99ab704ed8978fd78bc5edbe879b0264d56db6af`, including **424 source-contract checks**. Latest pre-handoff docs-only main head was `d3b72c2d033f238964e1367b6abb492441544973`. A documentation pointer commit after that does not create a new tested executable.
- Reconfirm Washington-only priority and alternate-America background. Character names and jobs are canonical. **Sam's currently assigned on-duty beat is Hillsdale only**; off-duty Chinatown exploration as a civilian and the *proposed* smuggling/corruption arc remain distinct. Retain explicit unknown captain truth and a non-stereotyped neighborhood.
- **Immediate next major source priority:** implement *modest owned electrical-component production* for Charlie at the approved January 2, 1878 future opening, by tested incremental 1878-focused slices. Do not flip the current 1890 game date until products, production, customers, markets and save migration agree.
- This closeout changes **documentation only**. No code, executable, assets, game calendar or save records are modified. Keep future snapshots, decisions and build evidence documented as development advances.

## 2026-10-23 · v0.6.59 purposeful autonomous movement

- NPC utility goals may shape **only personal-time destination selection**. Employment, settled wagering, privacy, locked rooms and venue availability remain stronger constraints.
- Directed destinations are existing Washington room-registry locations, not new locations or teleportable cross-district travel. A guard at the same shared access service vets each attempt.
- The movement remains offline deterministic per saved period; it does not infer secret information, retroactively create meetings, or rewrite unplayed time. No release executable.

## 2026-10-23 · v0.6.60 witnessed resident interactions

- Only residents simultaneously present in the **same registered room** can receive an autonomous social encounter. Each resident participates at most once in a reached period; repeating the same period cannot reroll or multiply relationships.
- Conversations, minor disagreements and assistance update both residents' private relationship memory and the active save's bounded encounter ledger. Mutual affinity matters to later planning; private actions do not automatically become public dispatches or knowable clues.
- Today's conversation can reflect that a resident talked with another person, without revealing confidential identities. No generative dialogue claim, online service, crime truth, or packaged release.

## 2026-10-23 · v0.6.61 speech and hearsay integrity

- Co-location is necessary but no longer sufficient for sharing testimony: both NPCs need a mutually comprehended spoken language.
- Alexi Rurik retains **Russian-only** speech. Pavel Orlov is explicitly bilingual English/Russian, consistent with his existing English public dialogue and Russian merchant setting. Other listed English speakers remain English only for now unless later documented in-world language learning or biography warrants another fluency.
- Neither the player's notebook nor the press gains automatic translations. Interpreter mechanics, player-earned Russian learning, and nonverbal interactions are future work; no new criminal truth or packaged release.

## 2026-10-23 · v0.6.62 independent component factory

- Build and source-test a separate integer-cents 1878 electrical component manufacturing/warehouse/contract engine before touching the 1890 bulb-first live factory. Old-profile preservation is not required.
- Production inventory is **not** automatic contract delivery; only a separate shipment earns customer payment. Replayed tokens never duplicate material spend, manufacturing output or settlement.
- Opening cash, wages, material recipes, customers, prices and workshop tools are explicitly provisional gameplay balancing pending historical research. A conservative future lamp eligibility gate requires calendar advancement plus license and equipment. No new 1878 profile UI, historical authenticity claim or downloadable release.

## 2026-10-23 · v0.6.63 Edmund Wardman's low-ranking employment

- Edmund begins and remains a **lowly orderly**, not a manager or owner. His brother still runs fictional District Asylum; no brother name or automatic inheritance is invented.
- Three provisional daily ward tasks maximum. Each is received in the orderly station (5 minutes), carried out on the patient ward (10 minutes), and reported back at the orderly station (5 minutes). Only a recorded report pays the provisional $0.35 wage.
- Pending work, completed entries and earnings belong to Edmund's own autosave. Ordinary care service contains no speculative private patient diagnoses or access to restricted superintendent accounts. The live game remains 1890 until the larger 1878 conversion.

## 2026-10-23 · v0.6.64 visible encounters and player knowledge

- A private NPC social encounter becomes a player journal observation **only when the active character is in the same real room at the same reached simulation period**, with developer navigation excluded.
- A witnessed act may reveal the identities of people publicly visible and whether they converse, disagree or assist. It does not supply secret speech, motives, trusted rumor or authoritative criminal guilt.
- Observations are capped, idempotent and retained in the observing profile's autosave; remote social acts remain completely unobserved. Do not publish a newspaper article merely because an NPC event exists.

## 2026-10-23 · v0.6.65 earned hearsay and trust

- No information exchange merely from occupying a single map pin: both NPCs must occupy the **same room**, be actively present and speak a language both understand.
- Saved reciprocal relationships, personality and an observation's confidence influence whether an NPC voluntarily repeats a rumor. Neither positive affinity nor distrust proves the assertion true or false.
- Explicitly designated confidential facts stay out of casual rumor spread. Rumor event provenance includes location, room, language, people and original fact reference. Rumors do not enter newspaper reporting or the player's notebook without actual future observation/investigation.

## 2026-10-23 · v0.6.65 source continuation handoff and verified QA

- The **current resume reference** is [October 23 source continuation handoff](HANDOFF-2026-10-23-SOURCE-CONTINUATION.md), superseding the older pre-v0.6.59 handoff while retaining its canonical character and world decisions.
- Latest tested source commit `de212efbda8ccf773f74e9258ace733c3704b7dc` passed GitHub Actions [39969296302](https://github.com/dereksparks1982/capitalconsequence/actions/runs/39969296302) with **441 source-contract checks** and all supplemental suites, including 360 case truth tests. This is **not a Linux executable acceptance test**.
- Remain Washington-first. AI improvements, isolated 1878 component groundwork and Edmund work loop are delivered, while the complete new 1878 campaign, unified clock and genuine autonomous city case consequences are future slices.

## 2026-10-23 · v0.6.66 always-available developer panel

- The entire existing developer panel should be visible throughout the live four-career title, career desk, maps, rooms, and other screens, for now. Reparent it out of the retired title instead of reviving the deprecated artwork. Preserve drag and collapse and allow access at narrow widths.
- Add Unlock All Rooms: ON/OFF next to Infinite Money. This lets the human-controlled protagonist inspect any registered Washington room, including staff-only, hidden, future and planned shells, but does not create interiors, unlock actions, confer ownership or alter independent NPC permissions.
- Override state is session-only. On deactivation, reset or autosave, never preserve an otherwise unauthorized room position; use public Hillsdale if necessary. Remain single-main-branch and source-only.
