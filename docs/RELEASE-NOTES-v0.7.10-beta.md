# Capital & Consequence v0.7.10 Beta | Washington Street-Entrance Routing
**29 October 2026 · source-development checkpoint · no public release**

## Changes
- Street access from each location pin now selects its candidate road by the actual **orthogonal (Manhattan) guide-pixel distance** the figurine traverses, instead of a misleading straight-line Euclidean shortcut.
- Entrance bends choose their primary axis using the guide's real pixel dimensions (2048×1159), rather than comparing normalized X and Y units with unequal pixel scales.
- Both changes make doorstep-to-street connectors better agree with the visible movement and the established provisional game-time estimate.
- The original graph remains an approximate model of printed streets. Neither this change nor the graph's existing White House no-through-traffic zone guarantees collision-free movement around every illustrated building.

## Extended QA
- Added `tests/capital-travel-all-pairs.cjs` to systematically test **1,560 directed journeys** between all 40 registered destinations, including actual graph routing (no fallback), finite waypoints, reverse-direction distance agreement, bounded provisional time, no modification of any saved pin coordinates, and bounded route-search caching.
- A full 1,560-pair audit was exercised in an isolated JavaScript harness and passed, with zero route or distance-asymmetry failures.
- Previous source regressions cover camera follow, named avenues, live pin movement, immutable journal records, interrupted arrivals, physical horse custody and recovery from viewport errors.

## Rules and verification limits
The permanent original Washington guide image, all 40 numbered pin defaults, approved map/UI geometry, player-driven calendar and autosave remain unchanged. No old-save migration required. No GitHub Actions, hosted artifacts, or installer ZIP. Full offline Node suite and live Ubuntu Electron playthrough still pending.
