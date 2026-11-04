# Build v0.7.104-dev: weeks at sea, months abroad, permanent voyage rolls

November 3, 2026. **Developer source candidate, unaccepted.** No release tag. Linux packaged Electron visual run and full source suite have not yet been completed.

## Maritime changes

- Calibrated **new** voyage estimates to 1878 transatlantic sailing/steam benchmarks. Westbound Liverpool → New York is 38 days by schooner and 15 days by steamer using modeled port-to-port durations; near-coastal hops remain days; Europe → Asia and multi-ocean sailings occupy months. Intermediate port calls add time. Old underway voyage ETAs remain unchanged, preserving save compatibility.
- Added a permanent profile-specific **ship and passenger registry** with stable voyage IDs, names of fictional simulated travelers, ship type, origin/destination, departure, ETA, arrival/loss, detailed cargo quantities if known, damage/loss and event record.
- The fleet's existing merchant voyages now create manifests when departing, then resolve passengers and cargo outcomes on the ship's **existing game-calendar arrival logic**. No independent timer, direct land teleport or imaginary sale/payment.
- Ticketed passenger voyages issue a corresponding registry entry at boarding, which closes when returning to Washington or arriving at the foreign quay. Existing weather delays update the registry.
- Shipboard NPC passenger identifiers and pathfinding remain stable; their labels now draw the named travelers from this voyage's fictional passenger roll. Crew/stranger personalities and new personal biographies are **not** fabricated.
- Searchable archives appear in the current world shipping office. The selected ship also has a voyage-history panel; Charles can inspect his active passenger roll and past passenger trips onboard/ashore.
- Reprojected the small passenger voyage map to the **already approved** 800×434 Admiralty chart. No alterations to artwork, world map geometry, Washington map, or the owner-approved desk.
- Retained cargo ownership, port authorization, existing naval world minute and save-key conventions. Older in-flight voyages are recovered as **unnamed** passenger rolls instead of falsely claiming names that were never recorded.
- Added one standalone Node regression for voyage length, real fleet dispatch/arrival, passenger board/arrival, visible companions, search, JSON persistence, no duplicates and legacy recovery.

## Boundaries and historical sources

The register simulates **fictional records**. It is **not** a genealogical source, Mayflower record, actual immigrant list, or historical proof of a named Leach ancestor. A Salem trade route and dockside map will be developed as separate work after historic geography and authorization are confirmed; no real person's name is invented to populate it.

Period benchmark: T. J. Hatton, *Emigrant voyages from the UK to North America and Australasia*, Economic History Review (2025), mean Liverpool–New York crossings 1860–69 were approximately 38.4 days by sail, 14.8 by steam. https://onlinelibrary.wiley.com/doi/10.1111/ehr.13351. Differences in a fictional vessel's wind, stops, weather, season, and speed are models, not guarantees.

## Verification

Targeted cross-module JavaScript smoke checks: **17 passing** in a V8 runtime (types, durations, save/arrival, passenger register, idempotence, search and JSON roundtrip). JavaScript syntax for changed modules compiled. A repo-local Node regression is added but **not yet run under Node**; full source test suite, live Electron game and owner review remain pending. Do not tag or call this an accepted release.
