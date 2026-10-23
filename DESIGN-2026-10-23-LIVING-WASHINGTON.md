# Capital & Consequence | Authoritative Thread Design, October 23, 2026

**This is the PRIMARY build specification.** It records explicit user requests and corrections in this thread. Read it before the README, ROADMAP, decisions, older handoffs, and code. Where they disagree, **the user's newer explicit correction wins**. The repo is the private `dereksparks1982/capitalconsequence`, single branch `main`. Source target at latest update: **v0.6.72-dev**; not an accepted executable. Do not describe planned features as implemented.

**Title:** CAPITAL & CONSEQUENCE. **Motto:** "One city. Countless lives. Every choice has consequences." **Distinction:** "Federal Electric is the company you own. Washington is the world you inhabit."

## 1. The clock | unequivocal user rule

- **One real second = one in-game second** while actively playing. The clock continues ticking while the player does nothing in the office, city, club or anywhere else. There is no accelerated 9x/15x rate, one-real-hour day, one-real-hour night, fixed two-hour loop, or artificial countdown exhaustion.
- A player-selected action **adds exactly its game duration** to the ticking clock. Visiting Madam Star's Club may use three or six hours; poker may use one or eight hours; walking, horseback travel, work, shopping, investigations, errands and sleep each consume their appropriate time. Those *variable user-selectable venue durations are still future gameplay work*, not already built.
- Only the **active player character's clock and actions** advance world time. NPCs never advance the master clock independently. During any action jump (e.g., three hours), **all other characters are advanced/simulated through the elapsed interval**, doing what they would reasonably do, and committing their actual actions, whereabouts, memories and consequences.
- This is not GTA-style fake "offscreen living." Avoid moving an NPC straight to a new place without simulating meaningful intervening decisions and resources. Use chronological, bounded event/time slices to simulate long jumps efficiently, not one second at a time for each resident.
- When **paused, hidden/backgrounded or closed**, the world does not accumulate offline time. Autosave and reload resume the saved moment, with no duplicated charge or replay of transactions.
- Sun, moon, weather, employment hours, venues, wages, events and AI schedules consume the same saved 24h timestamp (12-hour AM/PM display). 8 AM and 5 PM may be business opening/closing times, but **not compulsory player day phases**; the player may remain awake and active at night. Sleeping/resting is an explicit player action, not a mandatory daily report or a forced time warp.
- **v0.6.70 was WRONG:** the assistant invented fixed 60-real-minute business/night segments with 9x/15x passive time acceleration, never approved by the user. **Do not reintroduce them**. v0.6.71 removes that mistaken timing from the shared clock. Legacy economy/report assumptions still require migration.
- Tests must protect 1:1 passive tick, action hours, travel, real midnight and shift boundaries, multi-period NPC catch-up, replay, pause, save/reload, hidden-time suspension and no NPC-originated master-clock increase.

## 2. One shared Washington with four independently living protagonists

- **Charles "Charlie" Whitcomb**, businessman, owns **Federal Electric** (not the title of the game). Own company and personal property/money, work and outside life.
- **Samuel "Sam" Harlan**, young Black beat patrolman in **Hillsdale**, a rookie, not a fully authorized detective. Has paperwork and a desk, on-duty jurisdiction limitations; possible promotion and earned investigations. Off-duty ordinary travel.
- **Elias "Eli" Crowe**, ordinary Star Club/nightclub doorman, not a predetermined murderer, criminal mastermind, or owner. His independent path could be ordinary work, petty crime, organized crime, or stranger outcomes depending on simulation.
- **Edmund Wardman**, wealthy family's black sheep and low-status orderly at fictional District Asylum. His older unnamed brother runs it; Edmund has no free management authority. Potential future investment, purchase or management of asylum requires real transactions and permissions.
- All four should have distinct personal desks and activities. **The three unselected protagonists genuinely keep living in the SAME saved city**, capable of many of the same actions the player could perform. Their personalities, economic means and circumstances govern decisions. You can meet them going about their real lives, not staged appearances.
- Keep **Washington, D.C., first**, with 26 registered locations and expandable actual rooms, map pins, local politics, clubs, homes, businesses and institutions. National districts are world background; do not develop a second map/country-wide gameplay until instructed. The city can support later playable stories and characters.

## 3. Truly autonomous residents and memory

- NPCs need goals, individual personality, personal money/inventory, schedules, physical locations/rooms, relationship history, private beliefs and long-term memory. They should autonomously use **the real game features**: work, visit friends, play poker, bet at racetracks, walk/ride, buy goods, gamble, socialize, sleep, investigate or commit actions allowed by their role.
- Events need actual provenance. The world's ground truth, each resident's knowledge, first-hand sightings, believable rumors, confidential files and the public **Metropolitan Ledger** are DISTINCT layers. The player never automatically knows offscreen events, secrets or guilt. Co-room witnesses can see outward behavior, not hidden speech, motive or evidence.
- Detectives learn cases through clues, statements, admissible records, surveillance and patterns; not omniscient UI. Unplayed protagonists may collaborate, oppose, arrest, deceive or investigate each other only when their normal simulated resources permit.
- Existing modules already provide partial NPC utility planning, mobility, per-profile economic events, language, private social encounters, sourced facts, rumors, witness journal entries and calendar slots. **They do NOT yet run every player pastime or life path independently.** Build in connected slices until words, plans and performed actions are the same world.

## 4. Advanced unscripted AI conversations

- Residents converse freely. The user wants to walk up to an NPC and ask **"What's the weather like in DC?"** or about presidents, jobs, gossip, history or the person's life, with personality-specific coherent natural answers, not just dialogue menus.
- Conversations need memory across weeks/months, changes in belief and relationships, actual language ability, and possible negotiations, lies or promises. Speaking can eventually initiate **validated real game actions**, such as an NPC agreeing to meet for poker and then physically traveling to the table.
- **Alexi Rurik speaks only Russian**. Pavel Orlov is provisionally English/Russian bilingual. Do not magically translate without an earned/shared-language or actual interpreter mechanism.
- Source inspiration/integrations on GitHub must be **reused**, not reinvented: [AI Town](https://github.com/a16z-infra/ai-town), [Generative Agents](https://github.com/joonspk-research/generative_agents), [llama.cpp](https://github.com/ggml-org/llama.cpp), optionally [Ollama](https://github.com/ollama/ollama) and suitable strong language models. Examine new GitHub repos when they solve actual needed gaps, preserve licenses and attribution. Local model backend may be swapped as quality improves.
- **A 100 GB game install is acceptable to the owner** if stronger AI is worthwhile. Do not turn down a good open model merely because it is large. Still measure memory/VRAM/latency and licensing; eventually changed-files-only ZIP delivery may avoid oversize full archives.
- Each NPC believes it is **the current game year** and accesses **curated and date-gated historical/alternate events** appropriate to its actual lived knowledge. No future election, technology or gossip spoilers. Even the model's answers should be grounded in authorized game facts; model prose alone must never authorize money movement, travel, guilt or outcomes.
- Current v0.6.67+ source has a **Speak** field, local OpenAI-compatible model-server bridge, basic individualized personality/year context and saved per-resident conversation transcripts. **No model weights/server are bundled and live multi-hour freeform conversations have not been benchmarked.**

## 5. 1878 alternate history and factory

- The real Civil War (1861–65) is the fork: after it, alternate America abolished the **Electoral College** and replaced states/old borders with **functional national districts** (breadbasket agriculture, industry, etc.). Presidents are elected by nationwide **popular vote only**.
- The user suggested that **Samuel J. Tilden**, historical popular-vote winner in 1876, **could become president** in this alternate 1878. Treat Tilden as a *working candidate*, not a final entire political timeline; later elections, candidates and presidents are undecided until curated. Residents should refer to what the game actually establishes, not our real world's Hayes as if nothing changed.
- The requested playable opening is **January 2, 1878**. Charlie first manufactures minor contemporary electrical components: telegraph parts/keys, switches, contacts, relays, insulated wire, insulators and battery fittings. Incandescent bulbs follow with later actual technological/patent progress. Afterward an **alternate-history 1893 Washington World's Fair** is a possible major bulb contract, followed by distinct Washington streetlighting modernization. Real-world Chicago fair history is not the same timeline.
- **Updated v0.6.72:** New campaigns now **start January 2, 1878**, with Charlie's playable component workshop, actual material buying, order acceptance, timed manufacture, stocked shipments and company payments using the tested `component-works.js` engine. No 1890 bulb starter contract is created in new profiles. The surrounding older markets, wages, newspaper rules and period-company integration still need historical conversion. User says old saves do **not** matter, so preserving legacy save compatibility must not block the future proper 1878 rewrite. Do not just switch the date string and leave historical anachronisms.

## 6. Weather, day-night and celestial events

- Show compact **weather condition icons and day/night sun/moon icons** in the top bar, wherever space permits. Sunny, partly sunny, cloudy, rainy, snow, fog, storms, etc. may appear even when there is no environment illustration.
- Build changing GTA-style weather that people feel, discuss and act on. The sun follows real seasonal local sunrise/sunset, the Moon cycles through phases and **actual solar/lunar eclipses** occur when Astronomy Engine calculates them. Use the bundled MIT-licensed [Astronomy Engine](https://github.com/cosinekitty/astronomy) instead of reinventing astronomy.
- NPCs might decide to act during unusual weather or eclipses. A criminal could develop a **personal choice/pattern of killing around solar or lunar eclipses**; the detective can discover and investigate that pattern through actual dates, witnesses and case evidence. This is NOT a required serial killer, random scripted eclipse crime, or automatically revealed confession.
- Astronomy/icon source exists (v0.6.68+). A richer dynamic weather state, actual emergent eclipse crimes and evidence-based cross-career investigations still need implementation.

## 7. Horses, buggies and the eccentric millionaire's steam car

- In **1878**, the city mainly uses pedestrians, horses and horse-drawn carriages. Ordinary cars are not an everyday city transport network.
- The apparently homeless eccentric **Drek** may secretly be a millionaire, with hidden **Wainwright House**, potential heir/influence/rivalry arcs, a posh British butler and many possible endings. "Cornelius Wainwright III" and "Mr. Pritchard" are still proposed identities, not force-fixed canon. A player may never discover him or lose his potential story permanently. See `CODEX-DREK-WAINWRIGHT-2026-10-22.md`.
- **New specific plan:** the millionaire actually has an exceptionally rare **period steam-powered motor carriage/car**. The player can access it after **genuinely discovering and gaining permission to enter his mansion/estate** and earning vehicle access. It must not spawn into general traffic or auto-unlock simply by using the developer room override.
- **Keep transport simple:** a **horse wins on short journeys; the steam car is faster over longer journeys**. No complex steam startup, water/fuel, repair, machine failure, charging, maintenance or other minutiae. Just get in and travel. Exact distances/crossover are not selected and must not be invented.
- Presently travel still uses **provisional 60 game minutes between registered locations**; intra-building room changes are free. Genuine distance modes and car/mansion access are future builds, not live.

## 8. Developer controls, code reuse and release discipline

- **Floating DEV PANEL should follow on every screen and room** while developing, with existing **Infinite Money** and temporary **Unlock All Rooms** toggles. Dev override is player-only, not permanent NPC permission or a discovered-secret spoiler in the actual campaign.
- Single `main` branch; incremental tested source slices; **warnings are errors**; update README, roadmap, decisions and this design record with each meaningful scope change. Do not silently forget or override prior decisions. Stop means stop. No images/art unless requested.
- **No executable, packaged candidate, tag or accepted release unless requested.** The old v0.6.34 Linux candidate is a private unaccepted draft. When packages become huge, changed-files-only ZIP delivery with SHA-256 and full release acceptance flow is appropriate.
- Old saves are not binding. Keep new profile-local saves, reproducible ledger receipts, no automatic unseen time progression, no sham AI parity claims and honest tests.

## 9. Status and next work

**v0.6.72 update:** The 1878 playable component workshop is connected. The remaining era-correct market, business accounting and NPC simulation systems are still open. **v0.6.71 code direction:** correct 1:1 active timer, explicit activity jump durations, chronological NPC slot catch-up during actions and travel, actual 5 PM/8 AM work handoffs without time teleportation, player-chosen Rest Until Morning. GitHub Source QA must pass before claiming a verified source build.

**Still unfinished:** real 1878 component factory start; remove legacy four-turn/month company economics and account-date aliasing; richer hour-by-hour NPC behavior through all playable activities; real persistent offscreen character agency across poker/races/jobs/crimes; configurable venue stay/card duration; year-by-year historical facts and complete strong local LLM installation/inference; diverse weather changing within days; first-hand eclipse-driven investigations; steam-car permissions/routes/estate; complete visual day/night transitions; desktop gameplay acceptance.

**Next priority:** finish testing and hardening 1:1 time and NPC catch-up, then wire 1878 components first, migrate old economics to continuous calendar, then connect unplayed protagonist/NPC actions to real venue systems, followed by deeper memory, conversational action tools, investigation/weather/vehicle arcs. **Never label scaffolds as finished gameplay.**

## 10. Explicit no-regression shorthand

> **"the game speed is normal speed. you just advance the time with things you do."**
>
> Tick at 1:1 while active. Actions jump additional time. NPCs follow and genuinely simulate that time; they never independently advance it. No artificial two-hour day/night gameplay cycle, no 9x/15x rates, no closed-game time advance.
