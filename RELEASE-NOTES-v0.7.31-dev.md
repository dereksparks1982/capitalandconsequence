# Capital & Consequence · v0.7.31-dev
Development source on `main`, not an accepted Linux binary release.

## Custom road networks
- Konva-powered editor overlays the permanent Washington guide with user-drawn roads and building/ground exclusion rectangles.
- Automatic provisional road suggestions from existing graph, plus experimental browser-side straight-line image scan for possible streets.
- The user reviews yellow suggestions, explicitly accepts them, then explicitly activates custom routes. Otherwise the original approximate network remains active.
- PathFinding.js A* follows only submitted road cells, with blocked areas impassable. Yuka Vector3 computes route geometry.
- Editor supports connected point drawing, Finish Street, building rectangles, Undo, import/export JSON, clear and restore original routes.
- Per-profile drawings are stored in the game save. No original map artwork, pin positions, global map geometry or prior UI placement modified.
- On-screen walking, carriage and horse animations remain slower from v0.7.30, with no extra in-game time deducted.

## Verification
- Source-level regression files for custom road graph and editor hooks added, not executed here.
- Full Node suite and Ubuntu Electron visual walkthrough are still pending; GitHub Actions were not invoked.
