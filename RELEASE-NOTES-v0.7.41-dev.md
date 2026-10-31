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
