# Capital & Consequence v0.7.89-dev | Passage Delays and Paid Port Rest

**November 2, 2026. Committed development source, not an accepted Linux executable.**

## Scope and reasons
The first passenger sailing source implemented overseas routes and genuinely walkable harbour areas, but its map wrongly described the river/Chesapeake feeder as the *first* leg on the return home. The foreign-harbour lodging tiles also had no actual rest action, stranding exhausted travelers who had paid to visit overseas. This build corrects those shortcomings and adds saved, observable scheduling consequences during longer voyages.

## Working behavior
- Passenger schooners and steamships keep their original paid personal tickets, voyage ID, route waypoints, single world clock, source image and physically gated departure. Owned cargo fleet, insurance and company cash remain separate.
- An exposed Atlantic/eastern itinerary generates a repeatable **modeled rough-sea risk** at embarkation, using date, route and vessel category. A 12- to 48-hour delay may be recorded **only after the ship has reached** its middle ocean segment. The event extends the saved arrival minute and recalculates the ETA exactly once, including across save/reload and repeated renders. It does not advance the global clock, create historical storms, or give the player the future result before reaching the event.
- Map position is now aware of the voyage direction. Outbound: Washington river/coastal feeder, then the ocean. Return: ocean first, then feeder back to the existing Washington pier. Any storm delay holds the ship's ocean progress temporarily, instead of making it arrive early.
- The existing passenger view displays the correct current leg, weather-delay notification and a captain's passage register of actual paid boarding and sea-delay receipts.
- After **actually reaching** a foreign port and walking into its **Sailors' Lodging** sector, Charles can use a simple paid bed. The quoted **$1.25** is provisional game balance, not a researched 1878 inn rate. The owner pays from **personal cash**, and the single normal player-driven clock advances 1 to 8 hours according to its next phase boundary. The existing hunger/thirst/energy and medical recovery systems handle sleep. A receipt is saved and duplicate settlement of a single completion minute is refused.
- This does not introduce a free innkeeper, named town, map location, NPC language, room ownership or external cargo proceeds. It does not move the fixed Washington artwork or alter story gates.

## Verification and release boundary
- Added `tests/merchant-passenger-weather.cjs` with storm timing, once-only extension, correct return feeder orientation, physical lodging preconditions, actual cash ownership, duplicate protection, and return-to-Washington assertions.
- Focused simulation in connected development tooling checks engine source against the current real navigation module; there is **no claim** of a complete current Node test suite or Linux/Electron player test.
- Full `node tests/run-all.cjs`, genuine Ubuntu graphical view, prolonged multi-day report/medical play and owner acceptance remain **outstanding**. Hosted GitHub Actions and billable compute have **not** been triggered for this source slice.
- Historical actual port schedules, storms, fares and lodging rates remain unverified game estimates. The EcoClipper image's publication/redistribution permission is still unverified.
- No Linux executable, backup, installer, Actions workflow, tagged release, official acceptance or changed city-map geometry.

