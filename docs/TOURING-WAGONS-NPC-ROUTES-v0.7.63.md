# Capital & Consequence · Touring Visitors & Discoverable Wagons
**v0.7.63-dev · 1 November 2026 · source development**

## What changed
The temporary carnival fortune-teller and traveling salesman Silas Pike have been registered as two distinct NPCs in the same Washington world simulation. They are now more than static menus attached to the circus.

- The reader keeps her neutral working designation **The Traveling Fortune-Teller** until a final character name is approved. Silas Pike is the separate unreliable merchant.
- Each visitor has a saved wagon with a real journey. The engine takes an existing provisional street route between a registered city approach pin and the Capital Race Grounds, calculates the distance-based walking estimate, and uses a modestly faster wagon pace. The pre- and post-show journeys follow the one authoritative Washington clock and do not generate extra time, money or income.
- Arrival occurs at the **existing Capital Race Grounds**. Both NPCs are present in the registered `grounds` room while their circus engagement is active. On departure they stop being available for conversations and their wagon can be seen leaving if a valid route exists.
- The approach pins (Star Club vicinity for the reader, Hillsdale vicinity for Silas) are *street-network anchors*, **not** their residences or permanent origins. This build does not invent an ownership deed or a named private campsite.
- The circus's **public tent icon** remains visible to everyone only between the actual arrival and departure dates. The saved event stays available for up to four hours after closing to finish legitimate NPC wagon journeys without keeping the public circus open.
- **Character knowledge governs individual map icons.** Unknown visitors have no wagon marker. A character who has met or identified the traveler may see a crude horse-drawn wagon advancing along real road segments. This icon never discloses the travel destination, future schedule, personal secrets, or hidden provenance.
- NPC travel must have actual registered map pins and a connected route. If no street route is available, the map draws no guessed diagonal line or phantom moving wagon.
- These NPCs do **not** participate in regular Washington shop wages, workplace duty or weekly pay schedules. The normal NPC encounter dialogue cards and same-room observation rules are used instead.

## Files and integration
- **New** `touring-visitors.js`: date-scoped special visitor status, street plans, serialized travel and public room presence.
- **Updated** `npc-ai.js`: special-character definitions, ordinary same-room NPC cards, correct discovery, and explicit exclusion from the resident wage/work planner.
- **Updated** `npc-street-travel.js`: deduplicates existing NPC street movers and special wagons while preserving the private, earned-discovery policy.
- **Updated** `circus-tour.js`: keeps recently closed engagement available for transit simulation without prolonging public opening.
- **Updated** `app.js`: player only learns a visiting character's identity after actually entering the room while that person is present.
- **Updated** `index.html`: loads touring road state before the ordinary NPCs, without introducing any external package or changing approved map coordinates.
- **New focused tests** `tests/touring-visitors-wagons.cjs` and `tests/touring-visitor-dialogue.cjs`: presence, road-based travel duration, same-room greeting, refusal of remote conversation, identity secrecy, and actual departure.

## QA and important limits
The older player-provided Linux build log identifies **0.7.58** as the checked-out version and reports 189 passes / 6 failures. The current repository had progressed to 0.7.62 before this change. Focused replays of the current versions of `map-travel-departure.cjs`, `capital-travel-interruptions.cjs`, `character-needs.cjs`, `horse-custody.cjs` and `map-go-there.cjs` passed in an isolated JavaScript evaluation; the package-vs-masthead version assertion also matched. These **do not** constitute a full native build result.

- The full 195+ source test suite, live visual wagon movement, real route weather timing, full dialogue combinations and native Linux Electron executable still require desktop testing.
- Character portraits, physical wagon interiors, original tarot card illustration, independently authored campsite stops, bargaining and full merchant provenance mechanics remain unfinished.
- Do not tag or call this an accepted executable. No GitHub Actions, no distribution archive, no external dependencies or game artwork replacements.

## Next design work
Add proper moving carnival targets and keyboard timing; refine merchant bargaining and rare equipment functions; give the reader an independently authored home-on-the-road experience without weakening earned NPC discovery. Continue recording only confirmed crimes, private relationships, witnesses and actual murder-case evidence for second-sight tarot.
