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

## Single-folder build output, October 30
- Removed the Electron Builder `dist/` output directory setting. Both Linux formats now build into the existing main project root only.
- Added safe one-time consolidation of pre-existing `dist/` contents; files are moved, never overwritten, and the empty folder is removed.
- Packaged-executable verification and artifact tests now read the project root, and generated files remain Git-ignored.
- No QA project copy, secondary branch, GitHub Actions, or release tag.

## Executable smoke-test defects and portable archive repair, October 30
- The first owner-built AppImage revealed four missing external script closing tags in `index.html`, which caused `FE_ROAD_LAYOUT.sanitize` to be undefined. Repaired closing tags without changing the map or its geometry.
- Updated the Electron smoke travel sequence to wait for actual async animated journeys, using the engine's supported reduced-motion animation for efficient verification.
- The initial portable `.tar.gz` was truncated (`gzip: unexpected end of file`). The portable build now assembles a complete archive from a fresh `linux-unpacked` game folder, checks gzip and tar integrity and the game executable, then atomically replaces the previous tarball.
- Added source regressions for HTML script integrity and portable archive integrity. **Both new executable formats still need owner-side rebuild and smoke rerun.** No Actions or second branch.

## Electron source smoke diagnostics, October 30
- Surface Pro 8 owner test: 157/157 source regressions and all asset audits passed. Both Linux executables start successfully; the verified portable tar archive extracts correctly.
- Only the first automated map visit (Commerce Club) fails its arrival assertion, while Star Club and Chinatown pass. Added explicit initial Washington image decode readiness, animation-start confirmation, and precise first-visit refusal diagnostics.
- `npm run smoke:linux:source` runs the identical Electron smoke test directly from the checked-out source, avoiding repeated AppImage/portable rebuilds during diagnosis. The new test instrumentation is **not yet verified on the Surface**; do not claim the executable test has passed.
