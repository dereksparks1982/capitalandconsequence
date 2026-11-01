# Capital & Consequence v0.7.41-dev | Washington editor and blue-building navigation

**Development-source milestone only. Not a tested, packaged Linux release.**

## Washington overview
- Rename the map heading to **Washington, D.C.** without changing the original Washington JPEG or any registered map pin geometry.
- Wrap map controls in the application window so buttons no longer extend off its right edge.
- Relocate road-editor controls directly under the map header, visible immediately when the editor opens.

## Editable map overlay
- Replace the brittle Konva-only editor with a built-in Canvas2D editor.
- Add a drag-to-paint **blue building** brush, two-click building rectangles and a drag-to-erase tool.
- Add visible blue paint on top of the map, saved for the active profile. The original illustration remains untouched.
- Draw and save streets, undo drawing operations, import/export the road overlay and activate or deactivate custom A* road routing.
- Disallow simultaneous pin and road edits; close the editing tool cleanly when leaving the map.

## Pathfinding and feedback
- User-marked buildings now exclude crossings from the regular Washington street graph as well as activated custom routes.
- Invalidate cached road paths after a building is placed or removed.
- Refuse fallback teleport paths through marked buildings when no safe route exists.
- State why Go There cannot proceed and provide safe recovery for disconnected custom streets.

## Verification performed
- Parsed changed JavaScript modules successfully.
- Exercised native browser-handler simulation for brush painting, saving, undo, rectangle painting, erasing and street placement.
- Exercised all 1,560 directed location pairs on the original graph with no user-created obstacles: no failures.
- Verified an obstacle-induced street detour and that erasing restores the previous path.
- Added offline Node regressions and a packaged Electron smoke check that actually opens the editor, paints blue and inspects pixels.

## Remaining release gates
The full source test runner and packaged Electron smoke check must run on a Linux desktop with installed dependencies before anyone claims the build is playable or ready for public distribution. No GitHub Actions, AppImage or published executable was produced by this source commit.

## Linux startup hotfix (October 31, 2026)
- Corrected an Ubuntu/AppArmor failure that survived a passing source suite: Chromium SUID sandbox initialization occurs **before** the app's JavaScript `app.commandLine.appendSwitch('no-sandbox')` is applied.
- The single root `capitalandconsequence` launcher is now a real, small, auditable Linux x86_64 ELF which directly `execv`s the complete bundled Electron game binary `capitalandconsequence-runtime` with `--no-sandbox` **already present in the process arguments**.
- Compiled native boot code is included in compressed form, verified against a pinned SHA256 during packaging. Readable C source accompanies it; no compiler, `sudo`, AppImage, network fetch or GitHub Actions are required for the bootstrap.
- Updated the Linux builder to keep **both** executables, validate their ELF headers and runtime resources, and smoke-test the same root launcher that the user double-clicks.
- Added an offline test that executes the native binary with a mock game runtime, exercises startup arguments, validates opt-in sandbox behavior, tests a missing game runtime, and covers the build-time installation process.
- The native launcher has been compiled and exercised on an x86_64 Linux development host, but the full packaged Electron smoke test has not yet passed on the user's desktop. No playable release or rebuilt local game is claimed.

## Project-folder housekeeping
- Added `scripts/clean-project.py` to audit the entire existing Linux project root before removing clutter from view.
- Keeps the working `capitalandconsequence` launcher, matching `capitalandconsequence-runtime`, Electron's Chromium support files, `resources/app.asar`, `locales/`, code, bundled media, map and historical design documents.
- Moves the obsolete `capital-consequence` and `capital-consequence-bin` programs plus recognized temporary build folders, failed-build leftovers, old packaged distributions and build logs into a dated `~/DKLab/Archives/Capital-Consequence-cleanup-*/` recovery folder. Does not destroy the originals or delete unknown user work.
- Preserves any owner-customized duplicate map image unless its bytes match the approved immutable map.
- Repairs `run-linux.sh` and the old in-place source updater so they no longer direct users to deleted legacy binary names.
- Runs cleanup automatically after future successful local game installation. Cleanups themselves never trigger compilation, sudo, GitHub Actions or a download.
- Current desktop still requires one explicit local cleanup to remove existing stale files. Repository changes alone do not erase local files.
