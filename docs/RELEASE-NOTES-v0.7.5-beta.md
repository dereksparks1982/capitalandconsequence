# Capital & Consequence | v0.7.5 Beta
**29 October 2026 | Source checkpoint | Not an accepted 1.0 release**

## Capital Travel System: follow roads and intersections

This development slice builds on v0.7.4's moving miniature game-piece and live pixel-based journey time.

- Added `capital-street-network.js`, a separate, immutable guide-coordinate **road graph** with 304 modeled intersection nodes (after exclusions), local east-west and north-south connections, and explicitly modeled portions of the Pennsylvania, Massachusetts and New York Avenue corridors plus a southeast diagonal.
- Each trip now attempts a **shortest road-graph path**. The game piece follows connected road segments, turning through actual graph junctions rather than always following a three-segment rectangular shortcut.
- Both endpoints snap to a nearby road segment. Short provisional entrance links connect each exact current pin to the modeled street. Long entrance links are separately flagged as `provisional-street-access` rather than silently presented as verified roads.
- Excluded through-traffic from an approximate White House grounds footprint. A visitor can still approach the White House pin from the nearest roadway; other journeys must route around the landmark area.
- If the modeled street graph cannot connect a journey, the prior provisional right-angle route remains a disclosed fallback, not a fake authoritative road.
- Route previews and the moving walk/horse/carriage figurine use the same road graph. A journey's game-time debit now follows the distance along the full provisional street itinerary, including its short entrance links.
- Map zoom/pan still reprojects the temporary path on the image without moving pins.
- Editing any numbered pin recalculates the **road route** and all three provisional travel times immediately. Confirmed changes apply to future trips; past journeys' charged time stays fixed. The ledger now saves the route type and approximate access-pixel measure with each successful journey.

## Accuracy boundary

The original Washington artwork (`assets/artwork/maps/title-map-1938.jpg`) is sacred: no changes whatsoever to its image, the 40 registry pin defaults, or approved map-pin geometry.

**These road corridors are an initial map-aligned approximation, not a pixel-perfect trace of each printed street.** The 1938 guide is pictorial; most fictional locations and some actual locations have provisional pins. A game piece can still visually cross an inaccurate block or make a long driveway connection. The graph has no implied geographic coordinates, surveyed mileage, or guarantee that every listed street existed in 1878. The default travel-time conversion remains the project's provisional guide-pixels-to-game-minutes calibration, not a historical speed model.

The next improvement should trace the exact printed street centerlines and crossing/bridge restrictions against the approved map artwork, with manually reviewed intersections and no-go regions, rather than asserting that these sampled road corridors are already perfectly accurate.

## Tests and integration

- `tests/capital-street-network.cjs`: graph connectivity, multi-junction route, changing pin coordinates, recorded guide boundary, off-road disclosure.
- `tests/capital-street-integration.cjs`: integration with Capital Travel's active renderer, all 40 city pins, diagonal avenues, landmark avoidance, dynamic time.
- Existing `tests/capital-travel-live-map.cjs` updated to require actual saved street-route metadata.
- Previous focused tests cover travel animation/cancel, one-time time charging, horse and carriage physical custody, map go-there permissions and room entrance, saved per-trip history, and static map artwork geometry.

**Verification:** Relevant focused JavaScript regression checks passed in isolated execution. The entire offline `npm run test:source` suite and a real Ubuntu Electron playthrough remain unverified in this environment. **No GitHub Actions, Actions storage, automatic workflow run, installer, or executable ZIP** was used or created.

## Changes carried forward

All v0.7.4 features remain, including separate transportation modes, live adjustment of pin-based journey costs, autosaved travel records, prior trip immutability, and no backward migration requirement for old saves. Texas Hold'em gameplay was not changed. First-person duels and poker portrait silhouettes remain future design work, not implemented by this checkpoint.
