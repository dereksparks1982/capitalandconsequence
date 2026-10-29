# Capital & Consequence v0.7.4 Beta source checkpoint

**Date:** 29 October 2026  
**Status:** Beta development checkpoint. Not version 1.0, not an accepted public release.  
**Theme:** Capital Travel System, a street-style overworld journey on the original fixed Washington map.

## Implemented in this source build

### Animated Washington travel
- **Go There** previews an approximate rectilinear itinerary, displays a temporary dotted route and moves a small game-piece token across the existing city map before opening the destination's actual room.
- Choose **Walking**, **Horseback**, or **Carriage** from the location card. Horseback requires an actual horse present at the departure location; carriage requires both a horse and carriage present there. Existing livery purchases/hires, horse custody and real asset positions remain authoritative.
- World time is charged by the existing travel ledger **only after** the animated itinerary completes and the destination's room has successfully rendered. If a trip cannot be recorded, the character remains at the origin. Closing the map cancels an animation without granting an arrival.
- Map zoom or panning reprojects the temporary route overlay and moving token. The overlay is never written onto the map artwork.
- Walking will not accidentally relocate a previously prepared horse. Horseback relocates a horse and carriage travel relocates the prepared horse-and-vehicle pair only after a paid journey succeeds.

### Live pixel distance and pin edits
- A trip uses the current **X/Y coordinates of its origin and destination map pins**. When a pin is dragged in Edit Pins mode, the route line and a status displaying **guide pixels plus all three mode times** refresh immediately.
- A moved pin is still subject to the existing **confirm/cancel** requirement. Cancel restores the original coordinates; confirmation persists the new coordinates under the current profile. After a change, selecting **Go There** calculates route distance and time anew, without rebuilding the game.
- Changing transport mode, switching destinations, zooming/panning, reopening the map, and changing profiles do **not** use stale per-pair route caches. Pin edits cannot begin while a journey is underway; if a pin changes between preview and arrival for any reason, the journey is rejected and must be reselected.
- **Already completed trips are never recomputed**. Each successful travel record stores the actual provisional game minutes, selected transport mode, a guide-pixel route-distance snapshot (where available), and its route type.

### Provisional travel math (not historic mileage)
- The printed original guide is **2048 × 1159 pixels**. The game constructs **horizontal and vertical segments** between the two selected pins and measures their combined lengths in original image pixels, not screen pixels. Zooming does not change distance.
- First-pass gameplay calibration: **walking minutes = clamp(ceil(guide pixels / 10), 5, 120)**. Horseback = ceil(65% of walking minutes) with a four-minute minimum; carriage = ceil(80% of walking) with a five-minute minimum. This is a gameplay estimate only, **not** verified miles, historical walking speed, or a traced Washington road network. Each route's real-world miles remain `null`.
- When two distinct venues share a provisional marker, a minimum travel-time estimate still applies. Same-site room changes retain their existing one-minute charge; entering the same room is free.
- If map route information is not ready, the original **30 / 20 / 24-minute** walk/horse/carriage fallback remains in the journey ledger.

## Fixed design boundaries
- The original Washington guide artwork **`assets/artwork/maps/title-map-1938.jpg`** is unmodified and remains fixed across every playable year.
- No approved marker positions, marker geometry, 40 numbered map pin registry locations, or map placement rules were altered.
- No white anchor dots, map leader lines, or permanent overlay decorations. Preview and travel overlays are strictly temporary.
- The previous **Texas Hold'em** poker gameplay remains as-is. The top-down portrait/silhouette poker view and first-person duels are design directions for later builds, **not** implemented or claimed here.
- No old-save compatibility is required. New games continue to autosave as before.

## Focused QA
- `tests/capital-travel-recalculation.cjs`: move a pin closer/farther and verify instantaneous time changes for all modes and immutable historic receipts.
- `tests/capital-travel-live-map.cjs`: map editing, confirm/revert, dynamic route UI bindings, zoom and route-source invariants.
- `tests/capital-travel-animation.cjs`: animation reaches the target, temporary line clears, canceled animation does not arrive.
- `tests/capital-travel-ledger.cjs`: charge once, no horse teleport during walking, physical custody on paid horse trips.
- `tests/capital-travel-ui.cjs` and existing `tests/map-go-there.cjs`: source integration, destination-room access/entry, existing guardrails.

**QA limitations:** Focused isolated JavaScript execution and source-contract tests were run. The full offline Node test suite, an actual Ubuntu Electron playthrough, and user acceptance testing still need their own verification. No GitHub Actions were run, no hosted build minutes/storage consumed, no ZIP or installer produced.

## Possible next work (not part of v0.7.4)
- Trace or encode actual road intersections so the route respects streets and never appears to cross buildings.
- Calibrate guide-pixel dimensions against verified distances for optional actual miles.
- Add travel complications, weather, route choice and long-form journeys once the 1878 city calendar and street geography are reliable.
