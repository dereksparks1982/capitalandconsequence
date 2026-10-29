# Capital & Consequence v0.7.9 Beta | Failed-Map Recovery
**29 October 2026 · source-only development checkpoint**

## Stability fix
The Capital Travel System now validates every normalized road waypoint's projected **screen** location before drawing a route or moving the miniature. If a map transform becomes invalid, cannot produce finite coordinates, or unexpectedly throws during projection:
- An existing route preview is removed, rather than retaining a misleading dotted path.
- A running map animation is canceled, its Promise resolves `false`, and its temporary route and pawn graphics are removed.
- The Go There bridge can therefore unlock the button and leave the player at the departure location **without charging a completed journey**.
- The player may retry after the map projection recovers, without rebooting the game or resetting location pins.
- Camera-follow callbacks still execute before route and pawn projection, keeping the new copper completed-route trail aligned at any zoom.

## Regression
`tests/capital-travel-projection-failure.cjs` simulates deliberate viewport projection exceptions, failure during travel, removed overlays and a successful retry. The focused isolated JavaScript regression passed. Other street graph, live-pin recalculation, time ledger, horse custody, camera-follow and interrupted-arrival contracts remain in the source suite.

**Not yet tested:** full `npm run test:source` on a complete local checkout, a real Ubuntu Electron playthrough, or a player-accepted snapshot. **No GitHub Actions**, no Actions artifacts, no local installer or executable ZIP created.

## Fixed requirements
The original Washington guide JPEG, all 40 approved pin defaults, saved pin-placement workflow, gameplay geometry and existing Capital Travel controls are unchanged. Roads remain an explicitly provisional graph, not pixel-perfect historic street tracing. Completed trip receipts remain immutable when pins are moved. New-game autosave remains enabled; old-save migration is not required.
