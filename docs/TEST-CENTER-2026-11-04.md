# Test Center branch · 2026-11-04

Owner request: Build a separate square top-down walkable room with Prison Architect-inspired fixed-frame appearance, no animation, and a placement editor, informed by previously discussed reference projects.

Implementation: Complete the existing `test-center.html` + `test-center.css` scaffold by implementing `test-center.js`; reuse the original 69-sprite asset catalog, 32px editor core and kit, and Pathfinding.js-style shortest-route design already in our game (without importing unrelated third-party code). Create a standalone isolated browser-saved scene, furniture painter, fixed-character movement, collision, click travel, door toggles, painting/selection/rotation/duplication, undo/redo, inspection and JSON transfer. Core game routes and prior art remain untouched.

Not accepted or merged into `main`. Source-level tests are included; local Electron/full browser acceptance still belongs to the owner.
