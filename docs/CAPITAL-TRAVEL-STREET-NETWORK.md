# Capital Travel System | Street-network contract
**Design / implementation note · 29 October 2026**

## Authority and invariants

1. **Original map artwork is immutable** at `assets/artwork/maps/title-map-1938.jpg`. This is the same original Washington guide in all playable eras. Never draw a route onto the JPEG or move any approved pin except through the player's deliberate, confirmed pin-placement editor.
2. **A map marker is a destination address**, not necessarily a street intersection. The player's piece must travel along actual graph edges for the main journey. Short doorstep access from the address pin to a modeled road is provisional.
3. **Street geometry is not road history.** Our first-pass graph uses normalized guide positions for approximate neighborhood blocks and modeled diagonal avenues. It must not claim actual 1878 streets, mileage, map scale, bridge legal status or perfect avoidance of buildings.
4. **No white anchor dots or leader lines**. The dotted route and moving travel token exist only during preview/journey and are removed afterward.
5. **The player's journey advances time once**, through `FE_TRAVEL.recordProvisional` only after the room is ready and the travel animation has completed. Map preview itself must not charge a trip. Existing player-controlled clock/pause rules apply.
6. **Pin changes recalculate future journeys** from the current profile's in-memory normalized coordinates. Autosaved trip receipts keep the completed game minutes, route type, guide pixels and access-pixel diagnostics. They are never retroactively rewritten when a pin moves.
7. **Physical travel custody applies**. Walking cannot move a left-behind horse; horseback and carriage require a physical asset at the origin and successful paid journey before it relocates. Riding and carriage are not teleport shortcuts.
8. **No new legacy-save compatibility requirement**. New-game autosave persists.

## Network data and routing

`capital-street-network.js` owns a static normalized-intersection mesh for the portion of Washington depicted in the guide. Main road-type edges connect adjacent modeled intersections. Modeled diagonal arterial segments link named avenue corridors at defined nodes. The whole network is generated and searched without network requests or map image modification.

`streetRoute(from,to)` performs: nearest-road-segment projection for each address, shortest-path search between road junctions using original guide **pixel distances** as edge weights, and small orthogonal access connectors between address and street. If two destination pins share an edge, the route can use that edge directly. Landmark exclusions prevent transit edges through a first-pass White House area. Output contains `points`, `type`, `accessPixels`, `intersections` and `networkEdges`.

The high-level `FE_CAPITAL_TRAVEL.route` chooses that result first, falling back to the old orthogonal placeholder only if the graph cannot return a route. Each generated point is projected from normalized image coordinates through the **current** map zoom/pan, so zoom never changes the measured distance. `FE_CAPITAL_TRAVEL.estimate` measures route segments in **2048 × 1159 guide pixels** and converts that count into provisional game minutes per transport method; **no miles are asserted**.

The mode chooser is set on the selected destination card. The temporary SVG preview is pointer-transparent. On **Go There** the preview is cleared, the token animates across the street route, and the game executes its existing destination-room renderer and paid-travel transaction. The route snapshot prevents a pin changed midway from applying an obsolete duration.

## Future precision upgrades

- Trace road centerlines visually against the **actual approved JPEG**, for each neighborhood. Replace approximate sample intersections with authored waypoints while preserving the graph API.
- Review which diagonal avenues and road links match the fixed 1938 guide. Avoid streets that postdate the game era when game fiction requires a different status.
- Encode waterways, crossings, parks, restricted compounds, building-block obstacles and walk/horse/carriage access restrictions. Add separate walking paths versus drivable roads when verified.
- Mark unverified and off-print destination entrances as approximate instead of inventing accurate building addresses.
- Calibrate physical miles only after at least two dependable landmark-based scale checks. Current pixels-to-game-minutes is a game-balance approximation.
- Eventually show autonomous NPC travel figurines **only** if their actual saved movements support such visualization; don't invent travel events or advance time for NPC animation independently of the player's actions.

## Offline QA

Run `npm run test:source` locally on Ubuntu when the complete repository is available. Focused contracts: `tests/capital-street-network.cjs`, `tests/capital-street-integration.cjs`, `tests/capital-travel-live-map.cjs`, `tests/capital-travel-animation.cjs`, `tests/capital-travel-ledger.cjs`, `tests/map-go-there.cjs` and `tests/map-all-pins.cjs`.

No GitHub Actions.
