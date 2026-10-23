# Character Codex: Samuel “Sam” Harlan

**Project:** Capital & Consequence
**Canonical character:** Samuel “Sam” Harlan
**Career route ID:** `investigator` (persisted legacy key; **starting job is patrolman**, not investigator)
**Status:** Routine patrol implemented in `v0.6.56-dev`; **Hillsdale-only on-duty assignment and off-duty freedom** clarified in `v0.6.58-dev`. Other career systems remain developmental.
**Recorded:** October 23, 2026

## Identity and opening

Sam is a **Black, low-ranking rookie patrolman** serving the Metropolitan Police in the game's alternate-history Washington. He **walks** an assigned beat; he begins without an assigned horse, automobile, detective rank, or special authority. He encounters the institution and period as a Black officer in a changing city, including historically grounded discriminatory barriers and local residents who respond individually rather than as stereotypes.

He keeps a **personal desk in the station's patrolmen’s duty room**. The station's public entrance and higher-ranked sergeant's office are separate rooms; neither employment nor the police uniform grants universal clearance. Sam is not required to become a detective or police chief. He can live an ordinary police career, find other work, or rise if earned mechanics permit it.

## Implemented rookie gameplay · v0.6.56-dev

- **Clock in at the police station** and walk **only Hillsdale** as his officially assigned beat, in an actual registered neighborhood street room. Return to the station to write reports and clock out. While on duty, police-authorized travel is limited to Hillsdale and the station. **Off duty, Sam may go to Chinatown or anywhere else normally accessible as a civilian**, but he cannot conduct patrol work there.
- Walk a beat circuit for **10 charged game-clock minutes**. A deterministic, profile-dependent daily incident is created and saved, never silently rerolled.
- Address an authored routine matter in **5 charged minutes** by selecting a proportionate response. Encounters currently include wagon obstruction, street dispute, noise complaint, found property, and pedestrian assistance. Some may involve a written ordinance summons, without payments to Sam.
- Return physically to the **Metropolitan Police patrolmen's duty room** and complete a written station report in **5 charged minutes**. Report filing adds to Sam's duty book and journal. Nighttime report writing is allowed.
- The pending encounter, chosen resolution, on-duty status, totals, and prior station reports remain in Sam's own autosave. Other protagonist profiles cannot use the patrol actions or access Sam's duty room by occupation alone.
- A prior procedural homicide mystery prototype is deliberately **not available to Sam at entry rank**. It can be developed later as off-duty investigation or future properly earned casework.

## Previous saves and place names

The neighborhood is called **Hillsdale** in the live interface; some historical maps refer to the same area as **Barry Farm**. Its internal key remains `hillsdale` for compatibility. Saved games from the earlier two-beat prototype may contain an unfinished Chinatown police incident. The station provides an explicit **refer to sergeant** option to preserve and transfer that obsolete assignment rather than deleting or falsely resolving it. Saved duty flags absent in older profiles default to **off duty**.

## Not yet implemented, do not imply otherwise

A real eight-hour police roster, patrol time/distance mapping, police wages/paydays, promotions, official ordinances for 1878, summons court flow, prisoner processing, witness credibility, a living city dispatch feed, NPC-made crimes, investigators' rank privileges, overnight street shifts, and fully dynamic encounters. These remain Washington-first roadmap tasks.

## Technical constraints

The active prototype still starts in **1890** while the approved **January 2, 1878** component-first factory transition is developed. This slice preserves legacy profile keys and saves. Canon is recorded in [DECISIONS.md](DECISIONS.md); planned extensions in [ROADMAP.md](ROADMAP.md).
