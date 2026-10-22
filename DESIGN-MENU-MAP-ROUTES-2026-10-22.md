# Federal Electric: October 22 Menu, Career and City Map Decisions

**Historical planning snapshot with later owner amendments (see v0.6.33 amendment below).** Supersedes outdated *proposed labels* without rewriting previous development history. **No pictures, game-code changes, executable, or release authorized in this documentation-only pass.**

## Replace main menu, archive original office

- **Full restart of the main menu.** Archive the existing approved illustrated office title screen; keep its original images and working fan, clock, radio and other props available for potential use *within the game*. Do not destroy or alter those approved assets.
- Build a distinct **1800s-style menu using text, typography, borders and simple period ornament ONLY. No newly generated pictures or artwork.**
- Exactly three new menu labels: **Businessman, Patrolman, Layman**. These replace older **Businessman/Tycoon, Police/Private Eye, Criminal/Outlaw** player-facing proposals. Existing internal route IDs and profiles must be preserved.
- **Businessman alone is playable initially.** Patrolman and Layman must be visibly **LOCKED until the tycoon arc is finished**. Clicking a locked option must not start a renamed factory story.
- Main menu displays the **selected profile's IN-GAME date and time**, **not actual Washington local time**. Menu idling must never advance the saved world. If existing saves have only date/day phase and no trustworthy hour, show that saved information rather than inventing a live time until clock migration is finished.
- Separate profiles remain distinct Washington campaigns with one forward-moving autosave each; they do not share live events or act as rewind checkpoints.

## Specific careers, shared opportunities

**Businessman:** Federal Electric's owner, factory, contracts and unique tycoon career, corporate risks, investment and future influence. Loss of fortune, corruption or crime can complicate his life.

**Patrolman:** Begins as a **beat officer**, not a detective. Investigations, evidence, lawful arrests, internal politics, promotion, possible dismissal/corruption/private investigation are profession-specific possibilities.

**Layman:** An **ordinary civilian**, NOT a compulsory criminal. Could pursue work, relationships, wealth, legitimate businesses, theft, a racetrack business, organized crime, mob leadership or other possible futures. A violent/serial-killer storyline was an uncommitted option, not his official identity.

Career opportunities and privileged powers have route-specific gates; simply visiting a police station must not make the Businessman a sworn policeman. **All three may gamble, visit bars and clubs, drink, race, socialize, own eligible property, develop relationships and face criminal/civil consequences** in the same city.

In each save the two unplayed protagonists live **autonomously** with variable decisions and outcomes. One could become a police officer who investigates or arrests another; one could steal from or even kill another; they might instead be friends, rivals, business associates or acquaintances. A Layman might acquire **the racetrack the Businessman bets at**, becoming influential enough to attract a powerful secret kingmaker's attention. Nobody has one guaranteed fate.

## One Washington map throughout all years

- Keep **one base map image**, not a new period map for each in-game year. Locations, names, occupancy, access and activities may change with time without changing map geography. Discovery and restrictive historical gates are separate from pin visibility.
- Map markers should **show their NUMBERS ONLY by default**, without the always-visible name plaques crowding the streets. Name appears on **hover, click/tap or keyboard focus**. Clicking still opens the relevant discovered description and travel/entry controls.
- A **Show All Names ON/OFF toggle**, default **OFF**, can expose all labels. On touch screens tapping must still show the name, since hover is unavailable.
- Add category filters that separate **Neighborhoods** (Chinatown, Barry Farm) from **Government** locations (White House); other prospective types include Industry/Company, Social/Clubs, Sports, Transport, Education, Residences and Events. Categories may need deliberate mapping from the current registry. Filters only control presentation, not true discovery, room permissions, saved coordinates or pin numbering.
- The current image is a later-era temporary Washington map with **13 numbered pins**, not a verified 1890 map. A better period map may be researched, but **no image replacement has been approved**. Do not move existing pins without authorization.

### Barry Farm and nearby landmarks

Existing Barry Farm / Hillsdale location uses the saved internal ID **hillsdale** and numbered pin **13**. It lies east/southeast of the **Anacostia River**, across from and south of the Navy Yard. The user located its approximate area using a nursery/park region, **Howard Road**, and labels resembling **Nursery Street, Lincoln Street, Berry Road, Fifth and Sterling Avenue**, with **Bolling Field** and military waterfront areas as nearby orientation points. These are **observed map labels and prompts for later verification**, not surveyed 1890 coordinates. Pin placement remains provisional. **Do not relocate it now**.

### The historical federal hospital

**Government Hospital for the Insane** opened in **1855** and later became officially known as **St. Elizabeths Hospital** in 1916. The name used in the story should be appropriate to the year while retaining the **same Washington map**. **Bolling Field** is a later airfield and must not be treated as operating in 1890, even if represented on the later-era placeholder image.

The hospital should have a **visible, clickable location from the beginning**, with **public reception open** to any of the three protagonists. Wards, private offices, administration, records, patient rooms and other interiors require an in-world reason or authorization. Merely selecting the site should not create a dead Go There button.

The federal hospital is **NOT automatically purchasable**. The separately proposed fictional **Blackwood Asylum** may eventually allow qualified investing, ownership or management after its institutional structure is decided. Do not conflate them.

## Drek intersects all three lives

The rare man known as **Drek**, possibly Cornelius Wainwright III, has a suggested mansion and snobbish British butler. A powerful Layman might challenge his alleged control over D.C.'s elite; the Businessman could receive financing or retaliation; the Patrolman could investigate. Drek may be an eccentric benefactor, dangerous mentor, rival or bluffing impostor. The player may kill him without knowing his fortune, permanently foreclosing the story. See **[Drek and Wainwright House Codex](CODEX-DREK-WAINWRIGHT-2026-10-22.md)**.

## Implementation status and workflow

**Current v0.6.32 remains the playable Businessman/industrialist with the old illustrated office title screen and always-visible map name labels.** The alternate real-world wall-clock title behavior, planned new UI, map filters, hospital reception, two further playable routes and Drek secret are **NOT yet delivered**. Build permission was withdrawn for gameplay work; the owner's latest authorization is **documentation cleanup and GitHub commit only**. Single branch main, existing profiles, forward-only saves, no offline progression, user testing and release acceptance remain required.


## 2026-10-22 superseding owner approval: fourth Wardman + immediate four-desk foundations

After the documentation-only instruction above, the owner **explicitly authorized gameplay development of v0.6.33**. The earlier initial policy 'only Businessman selectable' and 'exactly three careers' is superseded. The new menu now offers **four** routes: **Businessman, Patrolman, Layman and Wardman**. All may begin a profile and access a colored generic desk and Washington's common map. **Businessman alone has complete profession-specific systems**; the other three deliberately begin as playable **desk/city foundations** without pretending their specialized arcs are implemented.

Color choices for temporary CSS-based desks: **green Businessman; blue Patrolman; red Layman; white/cream Wardman**. The existing executive-office illustration remains an approved Businessman *in-game* asset. Do not generate/replace art until requested. The character-focused desk interface is the long-term shared UI framework, but each desk will eventually have its own artwork, location, props and job-specific actions. A map should be accessible to all, physically positioned differently at each desk if desired.

Each saved world may contain the unplayed three protagonists as independent NPCs later, with a developer inspector showing goals, choices and whereabouts. The guiding analogy is **four moving orbits crossing unpredictably, not four people waiting for the player to click a menu**. Menu/desk foundation does not claim full autonomy yet. Wardman's planned family story is a slow rise from a deliberately humiliating low-status nursing/institutional role to possible authority, inspired by the *Wardman* surname but **not a portrayal of the historical Harry Wardman**. The institution may expand into doctors, nurses, patients, prisons, wardens, hospitals, etc. only after deliberate design.
