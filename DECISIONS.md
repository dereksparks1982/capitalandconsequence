# Capital & Consequence · Recorded Design Decisions

> **NEW THREADS START HERE:** [CONTINUE-HERE.md](CONTINUE-HERE.md) is the authoritative, GitHub-persisted continuation handoff: exact verified source commit and QA, approved clock rules, current 1878 workshop, open milestones, and next build order. Read it **before** older handoffs, this README or roadmap.

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

## 2026-10-23 · Official thread close and continuation snapshot

- The authoritative handoff for the next ChatGPT development thread is [`HANDOFF-2026-10-23-THREAD-END.md`](HANDOFF-2026-10-23-THREAD-END.md). It supersedes October 22's handoff for resume priorities; historic docs remain in GitHub.
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
