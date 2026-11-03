# Capital & Consequence v0.7.94-dev · Walkable Alexandria and Living Passenger Decks

**November 2, 2026 · Source-only development; not an accepted or playtested Ubuntu executable.**

## Physical Alexandria prologue layer

Charles's already-authorized four-scene opening in January 1878 now contains a deliberately crude 12×9 **walkable subset of Alexandria**: the **family overland trading office, merchant courtyard, overland storehouse, and departure quayside**. The third existing introductory chapter has a small walkable passenger-cabin floor. These are new rooms/scenes **inside the existing opening overlay**, not changes to Washington's city map or a claim that every street in Alexandria is simulated.

WASD, arrows and adjacent mouse tiles work. Solid walls, stored merchandise and water block the actor. Door and storehouse-hatch transitions are permitted **only when the character actually stands on a connecting door or hatch**. A desk/register, caravan goods, passenger papers and cabin bunk can be examined in person. Each scene retains a saved tile, visited-area list and inspection record so loading a profile does not move Charles backward. His established original twelve optional choice responses, father-son finance/confidence effects and the four chapter narrative text remain intact.

**Clock boundary:** The opening takes place before the established Washington simulation. Prelude room-walking **does not charge normal game minutes or create an independent local clock**. The January 2, 1878 Federal Electric start, business cash, family equity and loan, Washington map, original story gates, and overseas commercial ports remain unchanged. No invented fare, free trade goods, Alexandria pin/coordinate or historical ship schedule was added. **Alexandria-to-America travel remains an authored prelude, not a real clock-charged voyage.**

## Ships inhabited on actual clocked voyages

The **already-existing**, legitimately booked passenger trip on the original EcoClipper maritime chart now includes three anonymous shipboard actors: Fellow Traveler, Card-Table Passenger and Passenger Steward. Their visible deck positions are computed from the one authoritative saved world minute, realistic adjacent walking steps and actual stair hatch connections. They occupy the existing 2-/3-deck top-down floorplans and are displayed as simple symbols; presence follows their current shift window rather than appearing out of nowhere when a card opens.

Charles can ask any of them a short question **only while physically standing on the same deck within one tile**. Each completed conversation advances the shared world clock by two minutes, records a single saved and bounded account of what was said, and has a thirty-minute same-person cooldown. The ship continues progressing during the encounter. Replies are deliberately limited to common shipboard knowledge: no invented personal biographies, hidden Washington secrets, unearned employment, passenger payments or free destinations.

A saved shipboard conversation journal displays the last five replies. Person positions refresh in the existing passenger UI using a **display-only** interval; these updates do not move the underlying game clock, ship, or NPCs in any second independent simulation. Existing passenger passage costs, sleep, meals, physical deck gates, casual Twenty-One, captain register, forecasts, weather delays, chartered sea lanes, port interactions and real arrival are preserved.

## Files

Added `whitcomb-alexandria-walk.js`, `merchant-shipboard-life.js`, `tests/whitcomb-alexandria-walk.cjs`, `tests/merchant-shipboard-life.cjs`. Updated the existing intro and passenger UI/CSS, `app.js` integration, `index.html` script order, `package.json`, the lore index, technical roadmap, and handoff.

## Verification and what remains

**141 source assertions passed** in a focused V8 harness against fetched current GitHub files. They cover room dimensions, genuine door/hatch restrictions, saved Alexandria rooms, original intro choice compatibility, shipmate path continuity, co-location, elapsed-time conversations and cooldowns, no extra money and correct loading order. Relevant updated JavaScript source files parsed successfully. This was **not** a run of the complete offline Node regression suite or a native Ubuntu Electron visual/playthrough test.

The **real Alexandria embarkation → researched, charted journey → arrival in America → Washington factory** is still unimplemented. To do it without fabricating history or breaking the fixed January 1878 campaign opening, the actual route, departure date and movement of the simulation start boundary need a separately researched gameplay design. Full autonomous passenger memory/relationships, more deck-specific activities, named and grounded shipmate stories, storms closing open decks and full ship furniture art also remain future work.

No installer, executable, release tag, GitHub Actions run, backup, source-map replacement or accepted owner snapshot was created.
