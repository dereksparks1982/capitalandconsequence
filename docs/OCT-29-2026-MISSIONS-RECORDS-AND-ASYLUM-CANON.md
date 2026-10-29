# Capital & Consequence | Missions, Private Books, Morgue and Murder Cases

**Design decisions recorded:** 29 October 2026. **Setting:** alternate-history Washington, beginning in 1878.  
**Scope:** preserve the decisions made in the October 29 project conversation without confusing working source, desired features and unsolved story ideas. This document is development canon, not a claim that every feature is playable.

## Current GitHub source audit (29 October 2026)

| Subject | Source status | Evidence / boundary |
| --- | --- | --- |
| Four playable protagonists | **Present** | Character routes and codices; selected protagonist excluded from ordinary NPC control. |
| Shared page-turning private books | **Present in source, full Electron playthrough unverified** | `personal-book-pages.js`, `personal-book-ui.js`, `personal-book.css`, `casebook-pages.js`; recent commits expose books from career desks. |
| Automatic historical entries and player notes | **Partial** | Pages read actual saved ledgers, patrol logs, doorman shifts and orderly duties. Player writing is private and saved. Full lifetime chronology and comprehensive financial/crime event feeds are not yet complete. |
| Sam's rookie patrol, duty reports | **Present as a limited activity loop** | `patrol-duty.js`, `police-casework.js`; no automatic detective promotion or murder authority. |
| Procedural homicide prototype | **Present as source, not open to the rookie** | `murder-cases.js` and `detective-cases.js`. Do not describe it as the detailed new Ripper/asylum case. |
| General menu-based mission engine | **Not yet integrated** | Patrol/shift activities exist, but a unified persistent story/side-mission engine is still required. |
| Hospital morgue, persistent coroner NPC, body examinations | **Not yet implemented** | The hospital exists in `city.js`. Sam's casebook displays `save.morgueExaminations` *if already populated*, but the current app does not create those records, a morgue room or a coroner interaction. |
| The Gaslight Murders / major cipher case | **Concept only** | Title is provisional; culprit, victims, actual cipher text and chronology are unselected. |
| Murder at District Asylum | **Concept only** | One shared incident to experience from Edmund's and Sam's viewpoints, not two unrelated missions. |
| Fully synchronized cross-profile Washington | **Not yet complete** | Other protagonists can have NPC routines, but independent character saves do not yet constitute a shared cross-profile historical ledger. |

## Four protagonist lives and their books

These are established starting biographies, not unearned career promotions or forced outcomes.

- **Charles “Charlie” Whitcomb**: widowed owner of Federal Electric from the beginning, initially making modest electrical components with Sullivan as his first assistant. His **Business Ledger** records company/personal money separately, dated transactions, contracts, investments, payroll, financial decisions, key company milestones and private notes. Financial data must come from actual transactions, not projected fiction presented as settled.
- **Samuel “Sam” Harlan**: married Black rookie Metropolitan Police patrolman living in **Hillsdale / Barry Farm**, the neighborhood he patrols on foot. He is not automatically a detective. His **Casebook** holds patrol incidents and filed reports, lawfully acquired witness accounts, evidence, chronological case notes, postmortem findings received from authorized staff, theories and private annotations. His spouse's name is not selected here.
- **Elias “Eli” Crowe**: unmarried doorman at Lui's **Le Paon d'Or (The Golden Peacock)**, with the option to pursue criminal work; being a doorman does not make every action criminal. His **Personal Journal** can contain boasts, crimes actually carried out, casing observations, suspected security gaps, routes, debts, enemies, targets, adult consensual romantic/sexual relationships, and optional self-authored plans. Eli may be self-serving and noncommittal with women or men. A plan written down is never proof that a crime occurred. His relationships and actions should have believable consequences rather than automatic scripted conquests.
- **Edmund Wardman**: unmarried, socially isolated low-ranking orderly at **District Asylum**, the black sheep of an influential family. His **Duty Journal** records assignments, direct observations, workplace disputes and family pressures. His older brother runs the asylum; the brother's name is still undecided. Edmund can be manipulated, framed or threatened with involuntary confinement by relatives seeking to remove him from the family's affairs. That conspiracy must be discoverable through actual events and documents, not arbitrary punishment. His limited off-duty social life and any consensual adult relationships may create reputation and employment risks. Do not turn staff–patient coercion into routine romance mechanics; institutional abuse, if depicted, is misconduct with consequences.

### Personal Records System: one interface, four purposes

- Render an **actual HTML/CSS/JavaScript interactive book in the game**, not a generated picture, heavy new art asset or independent full-screen game. Reuse existing generic period-paper visual style and approved UI geometry.
- Open from the career desk; two-facing-page layout, page-flip transition, previous/next, keyboard access, section index/bookmarks and eventual large-history navigation.
- Use a common rendering and save architecture with four separately titled and populated books. Preserve dates and prior entries; make free-form player writing optional.
- The books are **player-only history interfaces**, not stealable in-world objects. No NPC, including Sam, gains knowledge because a player wrote in Eli's journal. NPCs learn only through witnessed actions, discovered physical evidence, reports, contacts or explicitly simulated leaks.
- Private note text must not become automatic police evidence, NPC memories, witness testimony, completed missions, or hidden case solutions.
- These books must never reveal inaccessible patient histories, culprit identity, future events or a suspect's hidden truth.

## Menu-driven mission framework: use existing Washington systems

No physically controlled walking character is needed. The city map handles street-following travel, location menus provide available actions, time advances through the established world clock, and NPC schedules/access rules determine what is actually possible.

1. **Inciting event:** assignment, resident request, witnessed occurrence, newspaper lead or a consequence of earlier actions. No magic knowledge transfer.
2. **Record:** create an immutable identity for the mission and save its current stage, discovered facts, unfinished tasks, location, dates and affected NPCs.
3. **Travel and interaction:** visit actual registered places, check whether people are physically present/available, choose contextual actions (interview, inspect, search with permission, deliver, negotiate, file, withdraw).
4. **Time and resources:** charge travel and action time once through existing APIs; respect wages, money custody, access, vehicles, shift duties and physical schedules. Preview/validation must never consume time or silently mutate the save.
5. **Branching outcome:** preserve partial progress across days/shifts and save successes, mistakes, refusals, missed opportunities, unresolved cases and consequences. No auto-reset and no single glowing waypoint that solves everything.

**Mission types:** main/personal storylines, optional side cases and recurring roleplay work (patrol, industrial errands, asylum rounds, hackney carriage hire). Initial examples discussed: Sam's **Missing Parcel** complaint, a **hired hackney ride** for Eli, and a **factory parts errand** for Charlie. These are prototypes/design candidates, not completed implementations. A hired vehicle is not automatically owned; fare/payment is credited only after legitimate service completion.

**Sam's authority:** on duty, he is initially restricted to his Hillsdale beat and station. Chinatown or other neighborhoods can be visited off duty as a civilian, but his uniform does not grant blanket search powers or instantly make him a detective. Homicide case assignments and arrests require earned authority, proper off-duty boundaries or another explicitly designed lawful path.

## District General Hospital: inside-hospital morgue

- Attach a **morgue interior room to the existing District General Hospital**, using its existing `governmentHospital` location rather than adding a forty-first map pin, redrawing the 1878 map or mislabeling District Asylum as a general hospital.
- Introduce a persistent **coroner / coroner's physician or postmortem surgeon** NPC who can explain findings and supply authorized reports. A separate attendant may handle intake if useful. Staff names and exact schedule are **not yet approved**.
- Registered bodies have stable incident/victim IDs, arrival times, observed findings, examination status, report availability and provenance. The staff member has finite knowledge, work hours and access limits.
- Sam can enter when lawfully permitted, request the correct body/report and inspect observed details through menus. Charge time for actions. His casebook receives only findings actually given or witnessed, not generated guesses or hidden culprit fields.
- Findings must distinguish observation, medical opinion and investigative inference. If a body has not been registered, no invented cadaver or report appears.
- An asylum death might follow an institutional procedure/inquest before evidence is formally shared with Sam. Edmund's own knowledge comes from his actual ward access and observations, not secret coroner files.

## Long-form Ripper-inspired case (provisional: “The Gaslight Murders”)

A dark, difficult but **fair and solvable** fictional Washington serial-murder investigation, inspired by the investigative atmosphere rather than a copy of historical crimes. Begin with an ordinary seeming killing; later deaths gradually expose possible links. Victims need not share a neighborhood or station in life.

- Five or six credible suspects, each with motives, schedules, histories, possible lies and genuine unrelated secrets. Witnesses may err, conceal, move, die or contradict one another.
- Evidence is sparse, date-sensitive and persistent. Newspaper coverage may contain incorrect or misleading reporting. Players compare timelines, witness statements, scene details and physical exhibits rather than simply clicking an objective marker.
- Include a **real decipherable period-plausible cipher**, potentially a newspaper-edition-specific book cipher. The correct key/edition must be discoverable by fair clues. A decoded text opens a new investigative lead; it does not hand over the killer.
- **Dark Souls-hard in reasoning, not arbitrarily broken**: no unsolvable randomized strings, no key clue destroyed without an alternate route, no last-minute change to the culprit merely to surprise the player.
- Wrong arrests and mistaken closure have persistent social, legal and investigative consequences. The murderer may evade detection even when the story's truth is internally fixed and discoverable.
- Charles, Elias and Edmund can touch the same evidence network as Sam through their own jobs and contacts, but their private saved journals do not automatically inform Sam.
- Do **not** put a final answer, cipher key, killer or hidden solution in public development docs or player-facing pages. Fix causal truth when a campaign/world is established and maintain consistent evidence.

## District Asylum murder: one incident, several perspectives

The player proposed a serious murder **inside District Asylum**. It must be one time-stamped world incident, not one fabricated death for Sam's run and another for Edmund's.

- **As Edmund:** discover an incident from rounds, institutional records or a direct encounter; decide whether to report, preserve evidence, mistrust his brother, defend himself, cooperate or challenge a cover-up. His brother's power and the possibility of family-orchestrated confinement complicate credibility and physical access.
- **As Sam:** be informed through an actual police call/report or personal discovery; travel to the institution lawfully; question people, review authorized documents, consult hospital morgue, compare statements and pursue a chain of evidence. An allegation does not imply permission for arrest.
- **Suspect/plot possibilities only, no selected solution:** an asylum patient, a staff member, Edmund's controlling brother, an outsider who entered through a sewer or service passage to avenge a loved one killed by the victim, or potentially even Sam if that outcome is genuinely grounded in player conduct and world facts. **Sam must not be secretly declared guilty merely because he is a selectable protagonist.**
- The sewer revenge idea is an **unconfirmed lead**, not a magically established open route. If used, access, maintenance records, physical traces, timing and witnesses must fit a consistent map and timeline.
- Keep guilt and motive deliberately undecided at design time, but **decide the actual truth before planting clues into a generated/started campaign**. The system must not make every hypothesis true after the fact.
- The same event ID and world timeline should support replay from different careers, while each character's notebook reveals only knowledge independently earned.

## Development and acceptance boundaries

- Maintain the **original fixed Washington map**, all 40 approved pin defaults and approved geometry; use existing location interiors and street-aware travel.
- Do not silently broaden Sam's rank, expose privileged case data, invent a morgue record, convert private books into police evidence, or claim a complete synchronized cross-profile world.
- Keep the existing short player-facing README unchanged in this design slice. Do not use GitHub Actions, SSH agents, password prompts, new installers or downloadable builds as substitutes for source review.
- Future code slices require focused tests for state persistence, correct timestamps and time charges, witness/NPC availability, room access, book privacy, genuine report provenance, nonspoiling pages, cross-route event identity and realistic consequences.
- Existing source work must be described as **source committed, acceptance pending**, until locally tested and approved. This document does not change runtime logic by itself.
