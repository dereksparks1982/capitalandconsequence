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

## October 30 Linux distribution hardening (source only)
- FUSE-free AppImage toolset 1.0.3, portable Linux tar archive, and offline dependency audits committed to main.
- A bundled, project-generated WAV replaces the old external daytime ambience preview. The original Washington map remains unchanged.
- One Business Ledger entry in the Executive Office; no map geometry changes.
- Added `npm run verify:linux:artifacts` to run the actual AppImage and extracted portable executable with isolated save data and Electron smoke tests.
- Full source tests, actual new binary tests, audio approval and third-party distribution audit are **pending**. No new public release, tagged snapshot or GitHub Actions.

## Surface Pro 8 source QA and offline-audit correction, October 30
- Owner's updated local `main` checkout completed **153/153 source tests** and passed the runtime asset bundle audit.
- The next audit incorrectly rejected historical Wikipedia / Library of Congress reference hyperlinks in `app.js` and `city.js`, even though they do not load automatically or support game startup.
- Replaced the blanket URL scanner with a check for actual network APIs, remote media/style/script loads and remote renderer resources. Historical research links remain optional and are not required to play offline.
- Added executable negative and positive source regressions for this distinction. **The new audit has not yet been re-run on the user's Surface.** No release, tag, GUI validation, or GitHub Actions.
