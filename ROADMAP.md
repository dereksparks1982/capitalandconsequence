# Federal Electric Development Roadmap

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
