# Federal Electric: Persistent Washington & House Rules
Date: 2026-10-21
Scope: 1890 alternate-history source development. This document distinguishes **confirmed direction**, **proposals pending research**, and **working code**.

## Motto (exact agreed wording)
Federal Electric is the company you own.
Washington is the world you inhabit.

Approved for the README and in-game Help. No change to approved title-screen art without a separate art instruction.

## Progression, saves and irreversible consequences (confirmed direction)
- One continuous **autosave per profile**, not a GTA V-style list of revertable save slots. Current code allows three separate profiles for independent games.
- The existing 5-second autosave remains a background safety net; any irreversible activity outcome, purchase, move, theft or lost item should additionally commit on the decisive event itself.
- A losing gambling result, discovered cheating, horse loss or accident, a paid fare and a transaction cannot be undone by picking an earlier in-game save. Avoid save/load UI controls that offer rollback.
- A local file can be externally edited; do not claim tamper-proofness. Developer tooling is strictly separate from ordinary play and acceptance testing.
- If an outcome is random, resolve and record it **once**, then display the recorded result again upon reopening that venue. Prevent duplicate claims and rerolls by reopening a screen.
- No offline time simulation.

## City and venue access (confirmed direction, implementation pending)
- The player has a physical current location and room; activity actions must eventually require that location or legitimately booked remote participation. Races, betting windows and gambling rooms should not be accessible simply by opening a global tab.
- Horse racing is only at its grounds; racing beyond the proposed initial site must get its **own** registry location. Dog racing, boxing, gambling halls and illegal animal contests likewise require their own venues.
- Different rooms have **unique opportunities**, not one interchangeable gambling menu. Information, potential winnings, social access, career leads, risks and clientele depend on the venue.
- Some spaces require an invitation from a specific NPC after developing a relationship. No automatic access granted solely for entering Chinatown.
- Respect person-specific memory and actual social circles, rather than a single universal morality score.

## Alternative Washington gaming regulations (proposals, NOT fully authorized game law)
- **Legal by license/venue**: proposed pari-mutuel or local bookmaking at approved racing grounds, and a **short allowed list of games** in approved gambling rooms.
- **Private/underground**: unauthorized poker including the more interesting five-card varieties, high-stakes rooms, some roulette/blackjack variants, and illegal animal contests.
- *GoldenEye* depicts **baccarat / chemin de fer**, not a poker variant. It is a candidate for the restricted licensed selection; exact legality awaits decision.
- Distinguish licensing, age/admission, forbidden games, limits, inspections, police risk and historical law from the alternate-history rules. Regulations should become editable policy state so civic decisions can change them.
- Neither the mere presence of high-stakes gambling nor being Chinese makes a character illicit by default.
- Prohibited animal contests, including cockfighting, dogfighting and possible historically researched cricket/beetle/snake contests, remain optional, invitation-based activities. For unfamiliar cultural practices, verify documented context before adding them; do not presume snake fighting was a standard historical Chinese pastime.

## Mounts, carriages, and travel (confirmed direction; no fabricated data)
- A mount/carriage has a unique identity, actual position, condition and status. Do not auto-spawn a horse at the destination or at the player's current location.
- Tethered/stabled/left-behind mounts remain where last recorded until a discrete, saved incident changes their status; theft, escape or a return home should be possible **but not constant**.
- Owning a carriage requires maintaining and locating that carriage as well as a compatible available horse/driver; hired carriages are separate services.
- Walking, horse riding and carriage travel have different journey lengths in the shared world clock. The departure location is the player's actual location, not automatically Federal Electric.
- Determine **real local street/site locations and route length** first, then transport speed, weather/traffic, schedule and occasional discrete incidents. A simplified distance placeholder must be labeled an estimate; do not present fictional map-image coordinates as measured street mileage.
- Do not silently change the 60-minute day / 60-minute night timing.

## Home and economic progression (confirmed direction)
- Start with the four-room modest Capitol Hill rowhouse, currently with ownership/rental terms intentionally undetermined.
- Larger townhouses, mansions and country estates should permit more rooms, facilities, social receptions, staff quarters, service entrances and doorman/porter access. Staff have wages, rooms, schedules and their own social relationships. Properties require ongoing upkeep.
- Acquiring and improving homes requires a real personal-money transaction and creates a persistent deed/ownership entry; the business does not automatically pay for the player's mansion.
- Price levels, staff wages, taxes, facilities and actual historical address research must precede purchases. No fake property upgrade button that claims success before these mechanics exist.

## The character and personal property (confirmed direction)
- Approved paper doll: fixed original artwork, eight illustrated slots: shirt, trousers, shoes, left ring, right ring, watch, left and right pocket. P toggles; Escape and X close.
- Pockets open separate small containers. The future physical item system distinguishes **worn, personally carried, left at home, left at office, left at other locations**. No teleported global stash.
- Wallet, calling cards, identification, birth/baptism/marriage records, passport applications, deeds and family papers are possible documents with individually acquired provenance, location and purpose, not items magically added to everyone.
- Wearing the right clothes should matter for society invitations; sleeves/rigged gaming props may confer opportunity and detection risk rather than guaranteed success.

## Development policy
- Main branch only. Every separate source slice has a new version. No package on pushes.
- Source-only commits are not tested Linux binaries. Acceptance only follows fully green packaging/smoke checks, user validation and explicit approval.


## Potential Blackwood asylum venture (proposed)
- Future purchase, managing-superintendent appointment or investment in a fictional Washington asylum is under consideration. Legal ownership form, site, governing board, licensing, budget and costs remain undecided.
- Inspired by prior Blackwood (Victorian) and Moroz/Cherny Bor (Soviet) concepts. **Moroz's Soviet historical context does not move into 1890 D.C.**
- Healthcare institution must have independent accounts, staff/patients as individuals, case records, inspections and meaningful consequences. Source: [ASLYUM-INTEGRATION-DESIGN-2026-10-21.md](ASLYUM-INTEGRATION-DESIGN-2026-10-21.md).


## Multiple protagonists (proposed)
- Three route directions: industrialist, law enforcement / private investigator, criminal / outlaw; serial-killer story optional and undecided.
- Share the persistent Washington location and venue registry, but not personal accounts, known secrets or save slots. Distinct character profiles have independent persistent worlds.


## Living unplayed characters
- Background actor careers progress with the shared world clock and are stored per active profile; there is no offline simulation while the game is closed.
- The criminal may become a petty thief, underworld organizer, suspected serial offender, or another path; the detective may rise professionally, enter private work or public life, or become compromised. These are **separate seeded outcomes**.
- Newspaper content communicates public reporting rather than omniscient facts. Never reveal confidential actor arcs or treat allegations as proof.


## Mount record implementation, v0.6.16
- Owned horses/carriages have persistent individual records and last-known locations; there is no free starting horse or teleporting retrieval.
- Incident and movement operations have unique recorded IDs and autosave; randomized escape/theft incidents are not yet live. New horse purchases, rentals, costs and route-based movement still require follow-up slices.


## Poker one-use settlement (v0.6.17)
- Existing seven-click table unlock bypass is removed. Entering poker requires an earned invitation (where necessary) and the correct venue.
- Real played poker now reserves Personal Cash in an immediate autosave. Popup access is one-use, and each settlement has a unique ID to stop repeated payouts. Incomplete sessions can forfeit the stake; full recovery is not implemented yet.
- This prevents ordinary save UI rollback/reroll; users can still intentionally edit local files or use development tools.


## Venue location enforcement (v0.6.18)
- Betting actions now check the character's current location, not just visible UI controls. Remote horse/dog/car racing, boxing, underground contests, Star Club socializing and poker activity shortcuts are blocked in ordinary play.
- Hidden underworld venues enter the private unpinned directory only after discovery, never via public map labels. The selected activity UI closes appropriately upon travel.


## Travel planner foundation (v0.6.19)
- Future modes are walk, owned horse, owned carriage with horse, or hired carriage. Walking is possible without equipment; riding requires an actual local horse and carriages require local assets.
- Verified road mileage / historical travel time are **unknown** and remain null, not guessed from artwork coordinates. Existing Go There remains provisional instant movement until route research and timing approval.
- Every provisional relocation is recorded in the same autosave. No horse, carriage, or driver follows the player unless a later validated journey transfers them.


## Transport availability integrity (v0.6.20)
- Transport in transit, missing/stolen, or in someone else's care is **not available** to embark on a second trip. Registered assets remain tied to concrete city locations; even event-driven recovery must target a known registered location.


## Public vs confidential history (v0.6.21)
Player-visible Washington Dispatches are computed from events already designated public; loading/reopening the news does not cause new events. Internal actor identities and paths remain unexposed until discovered through properly built story mechanics.


## Interrupted poker session resolution (v0.6.22)
- A claimed poker popup whose settlement was interrupted may be explicitly **forfeited**. No stake refund, no replay, no additional hands. A never-claimed reservation may be canceled and refunded because no card session was authorized.
- Both outcomes are recorded and saved once. Poker session locks are not silently cleared on reload and a resolved token cannot later settle again.


## Residents occupying rooms (v0.6.24)
- The nonselected protagonist candidates have real saved Washington whereabouts per business turn, and may appear as unintroduced visitors without private actor identity leakage. Locations update on world-turn progression only, not every time a UI panel opens.


## Missing or damaged saved profiles (v0.6.25)
- An indexed profile whose save data is corrupt or absent cannot be silently reset/restarted. Do not autosave over the unreadable bytes; require player-initiated recovery or creation of a genuinely new profile.
- Do not expose a prior-save rollback selector for normal game play. This is data-preservation logic, not an undo mechanism for choices.
