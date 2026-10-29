# Capital & Consequence v0.7.6 Beta | Street Travel Reliability
**Source-only development checkpoint, 29 October 2026. Not a public 1.0 release.**

## Improvements
- Shortest-path **graph tree cache**, bounded to the last 48 starting intersections, makes repeated itinerary calculations faster during pin dragging. The graph is static, so cached routes are not made stale by profile-specific pin movements: the current live pin coordinates determine the first and last road entrances each time.
- Entrance connectors are filtered so an ordinary destination does not cut across the approximate White House grounds to reach a road. The White House itself remains visitable.
- Animated game-piece progress is measured in **original 2048×1159 image coordinates**, so zooming or panning during a trip moves its screen projection without jumping it forwards or backwards along its street route.
- **Camera follow** gently pans a zoomed-in map to keep the figurine visible. Manual map dragging takes priority, and the follow feature stays inactive at the fit-to-screen zoom. The original map art and pin coordinates do not change.
- The destination card reports trip progress in **25% increments**, not every animation frame.
- An interrupted animation cannot execute a stale arrival if the selected character/profile, current save, origin, destination, transportation mode, or pin coordinates have changed. Canceling or closing the map does not commit travel.

## QA
Added regression contracts:
- `tests/capital-travel-street-reliability.cjs`: repeated route stability, bounded path lookup cache, camera-independent image position and immutable pins.
- `tests/capital-travel-follow-camera.cjs`: simulated zoom partway through a moving-pawn animation.
- `tests/capital-travel-follow-ui.cjs`: map camera-follow boundaries and manual pan priority.
- `tests/capital-travel-interruptions.cjs`: no travel commit after changing character, profile, origin, pin, mode or closing/canceling the map.

These focused checks have passed in isolated JavaScript harnesses; the full `npm run test:source` suite and an actual Electron playthrough have not yet been run here. **No GitHub Actions used.** No compiled executable or downloadable ZIP created.

## Accuracy and project rules
Routes remain **approximate modeled roads**, not verified 1878 or 1938 surveyed streets. No artwork, numbered pins, approved UI geometry, or playable-year map rules changed. The Beta status remains in effect. Travel only advances the player's world time after a completed journey; NPC behavior is not implemented through game-piece animation. No legacy-save migration is required.
