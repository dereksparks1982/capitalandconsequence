# DK Architect · Test Center (EXPERIMENTAL BRANCH ONLY)

**Branch:** `test-center`, not `main`  
**Status:** experimental playable prototype, not an approved game release.  
**Studio:** DK Softworks.

## Open the lab

Open `test-center.html` from the **test-center branch** checkout using Firefox/Chromium. This is a standalone HTML page with relative links to the existing 69 original sprites, `room-builder-core.js`, and `room-builder-kit.js`. No npm or Electron build is required; a local HTTP server is an alternative if the browser restricts `file://` assets.

**Walk Room:** WASD/arrows move one tile per key press. Clicking a reachable floor tile moves immediately after checking an unobstructed path. Click a door next to your character to toggle it. The four original fixed sprites change with facing; no walk cycles, tweening, game clock or background simulation.

**Edit Room:** Click a palette item and click the room to place furniture, people, floor or construction. Choose painting tools for flood fill or two-corner rectangles. Select/Move uses two clicks, and offers Rotate, Duplicate and Delete. Other tools: Erase, Eyedropper, move Player Start, toggle Door, Undo/Redo and Check Access (reachable doors/workstations). There is an export/import JSON workflow.

**Persistence:** The isolated browser key is `dkSoftworks.testCenter.room.v1`; game-save and approved blueprint keys are never opened or written. Switching to New Empty Room does not erase a saved layout until Save is explicitly pressed. Imports must match the `test-center/room-01` identity and core schema.

The square is 16 × 16 tiles at 32 pixels per tile, with authentic game art. All references to Project Porcupine, Space Station 14, Ogmo Editor, 2dtiler, Open World Builder and the existing pathfinder are **design studies only**. This page uses no code or artwork from them.

## Verification

Run `node tests/test-center.cjs` on this branch to check the standalone contract and original collision/placement APIs, then `node tests/run-all.cjs` for the existing source regressions. Browser movement, pixel display and file dialogs still need an interactive local check before acceptance.

**No changes to `main`, saved careers, Salem, Washington, map UI, shipping charts, or accepted 1878 narrative.**

## Real upstream repositories and sprite packs

Six pinned upstream Git submodules are under `third_party/`: Project Porcupine, Space Station 14, Ogmo Editor 3 CE, 2dtiler, PathFinding.js and OpenWorldBuilder/base. **Ten actual PNG assets** copied from the first two are committed to `test-center-assets/` and available in the **Sprite library** dropdown for painting and object placement. All 69 existing original game sprites remain available. Open the standalone `test-center.html` directly; the extra sprites do not require the large source submodules. See `test-center-assets/LICENSE-AND-CREDITS.md` for exact asset source and licenses; some art is noncommercial-only.
