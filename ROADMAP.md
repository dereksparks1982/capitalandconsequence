# Capital & Consequence Development Roadmap

> **Start new development threads here:** [October 23 source continuation handoff](HANDOFF-2026-10-23-SOURCE-CONTINUATION.md), then this document's **Washington-first** section, then `DECISIONS.md` and relevant codices. Last verified AI baseline is **v0.6.65-dev**; source **v0.6.66-dev** adds the persistent developer panel and player-only room access switch. The earlier [October 23 v0.6.58 handoff](HANDOFF-2026-10-23-THREAD-END.md) remains archived. Later decisions supersede old priorities.

## ACTIVE DEVELOPMENT SCOPE · WASHINGTON FIRST (decision of October 23, 2026)

**Capital & Consequence is a Washington, D.C. life simulation.** Until the owner explicitly expands the scope, prioritize **only the playable city, its residents, institutions, rooms, four career paths, local history, and the interactions between them**. The rest of the restructured United States is **background canon and a deferred roadmap**, not a second playable map to build now.

**Alternate-world design rule:** The city must remain *recognizably* nineteenth-century Washington, but it is **not a documentary reconstruction of the real United States**. Familiar buildings, social institutions, technology, contemporary personalities and historical reference points can coexist with deliberately changed politics, geography, districts, events, and outcomes. The inspiration is an alternate-reality variation: **similar, but not the same**. Keep changes internally consistent with the game's post-Civil-War United States of purpose-defined districts; avoid importing real state-based laws/elections automatically. The comparison to *Rick and Morty* describes the alternate-universe feeling, **not a crossover**.

### Now · highest-priority D.C. playable slices

**Source advancement v0.6.67:** In-person named residents can now accept free-text speech through a sandboxed, loopback-only local OpenAI-compatible LLM server. Each actor receives its own bounded profile conversation transcript, date-gated alternate-history briefing, public personality, current observed weather and room, and genuine shared-language checks. NPC responses alone perform NO irreversible world actions. The actual local model/server is not bundled or performance-validated. Next: properly licensed model recommendations/weights, curated year-by-year Washington historical knowledge retrieval, translation earnability, truthful NPC conversational claims, and validated conversation-to-action tools that affect the same shared world.

**Source advancement v0.6.66:** Existing developer controls float above every live game screen and room (collapsible and draggable). Unlock All Rooms lets the selected player inspect all registered Washington locations and rooms regardless of normal duties, invitations, opening date or door permissions without giving NPCs unrestricted access. Developer sessions never create non-existent scenes or permanent access entitlements.

**Source advancement v0.6.65:** Gossip now depends on precise co-room presence, shared language, relationship strength and source confidence. Classified private records are barred from casual hearsay; private events retain room and language provenance. Future full NPC evidence and investigation systems should build on these guarded facts without treating rumor as confirmed truth.

**Source advancement v0.6.64:** Actual co-room social meetings can now leave first-hand observations in the active character's private journal, without hidden motives or off-site hearsay. Seen meetings are idempotent and bounded, and no newspaper claim is created. Next: deeper evidence provenance, witness disagreement and earned follow-up contact actions.

**Source advancement v0.6.63:** Edmund Wardman now has an actual playable District Asylum work loop: assignment at the orderly desk, service inside the patient ward, filed report and one bounded earned wage. Shift logs, pending tasks and funds persist per profile; medical confidentiality and restricted superintendent access remain intact. Next: institutional roster and brother's managerial decisions grounded in local cause and effect.

**Source advancement v0.6.62:** Independent component-works module now supports owner-specific 1878 component recipes, inventory purchase, transaction-proof assembly, contracted customer orders, physical warehouse shipments and technology prerequisites, with dedicated save/reload tests. **Not yet connected to playable new 1878 saves or authoritative calendar.** The existing 1890 profiles remain unchanged. See `COMPONENT-WORKS-1878-FOUNDATION.md`.

**Source advancement v0.6.61:** Russian-only NPCs no longer exchange rumors or conversational relationship gains with English-only residents without a shared spoken language. Pavel Orlov has explicit English/Russian fluency as a provisional trade intermediary. Interpreters, player language study, earned translated testimony and period-correct dialogue still require future gameplay.

**Source advancement v0.6.60:** NPCs now make one bounded social encounter per reached period with co-located residents in the same room, create reciprocal private relationship changes, and persist ordinary contact memories. No meetings occur merely from opening a panel. Continue with consequences linked to careers, witnesses and transactions. The earlier intentional travel improvement remains documented below.

**Source advancement v0.6.59:** Intent-driven personal travel is now implemented and source-testable. An NPC's chosen goal may direct optional personal time toward an accessible registered workplace/contact, but never bypass a restricted room, wager result or mandatory shift. Still pending: independent social transactions, actual journey traversal, household links, proper 24-hour clock authority and genuine witnessed city events.

- [ ] **1878 real starting experience:** Convert *new* profiles from the old 1890 bulb-first factory to **January 2, 1878** with correct component-making machinery, recipes, suppliers, inventory, and contracts. Charles “Charlie” Whitcomb **owns Federal Electric** immediately. Historical electrical lighting R&D and eventual bulb lines must follow technology progression. Do not change the calendar alone; existing autosaves preserve their historical dates and inventory until explicitly migrated and tested.
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

**Implementation discipline:** Design decisions go immediately into this roadmap and `DECISIONS.md`. Previous work remains preserved below as chronological history, including older national-feature proposals; **this section supersedes their priority**. No national code expansion is authorized by this scoped planning instruction. Existing source and save compatibility, single-branch Git workflow and tested incremental builds remain in force.

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

**Design target:** A new Federal Electric campaign opens on **January 2, 1878**, before commercially practical incandescent bulbs. This is a decision about future gameplay, not a change to the currently implemented **January 1890** start. Audit every historical location, machine, vehicle, electrical process, newspaper, political event, and contract for date accuracy. Existing autosaves are never silently rewound or remapped; any migration needs dedicated tests, explicit compatibility rules and owner acceptance.

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

- [x] Rename visible title/menu, desktop package metadata, Linux launch/archive labels and development docs to **Capital & Consequence**. Federal Electric remains the businessman's company, not the whole game. Keep legacy save namespaces for compatibility.
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
- [ ] Complete the separate 1878 component-factory conversion and source-tested save migration before switching the live campaign start.
