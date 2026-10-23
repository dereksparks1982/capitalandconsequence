# Federal Electric · Recorded Design Decisions

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
- Protect existing autosaves, old profiles, component-era pacing, NPC room access permissions and recorded history. Do not alter source gameplay or package a build until subsequently requested.

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
