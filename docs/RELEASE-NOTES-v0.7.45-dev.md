# v0.7.45-dev · Original room toolkit and open-source research

**Date:** 31 October 2026  
**Status:** Direct development-source checkpoint on GitHub `main`. **NOT** an accepted Linux executable, tagged release or finished visual playthrough.  
**Goal:** Learn from relevant open-source tile games without importing engines, GPL code, unreviewed artwork or outside dependencies.

## Reviewed source projects and licensing

- **Project Porcupine** and **Open World Builder:** GPL-3.0 code. Understand their build-mode, furniture, tile and NPC-planning concepts, but do not copy their implementation into our private game.
- **Ogmo Editor 3 CE**, **2dtiler**, and **Space Station 14:** GitHub metadata declares MIT code. The latter's art includes CC BY-SA and some CC BY-NC-SA assets, and other projects also have separate asset rights. File-level license review and notices would be needed for literal inclusion.
- **Choice for this build:** Write all code from scratch in existing Electron-friendly JavaScript, with only the original 69 sprites. **Zero third-party code, art or engine integration.**
- Full research and feature-versus-restriction decisions: `docs/OPEN-SOURCE-TILE-GAME-LESSONS-2026-10-31.md`.

## Committed room-editor features

1. `room-builder-kit.js`: original independent floor/construction layers, atomic tile-region painter, connected flood fill, rectangle brush, eyedropper, and reversible construction erasure. Each operation checks sprite category and construction collision before committing; a failed region operation changes **nothing**.
2. Expanded `room-builder-ui.js`: visible tools for bucket fill, rectangle, eyedropper and wall erasing; shows a sprite's intended function and collision in the inspector; keeps original select/drag, room resizing, backup, undo, redo and test walking.
3. **Named developer blueprints**, up to 20 separately preserved layouts with strict identity/schema and safe names. Save, reopen and delete from the UI without overwriting the active room until the user explicitly chooses **Save Layout**. Existing JSON import/export and prior-version backup are retained.
4. An original data-driven metadata register for existing desks, chairs, cabinets, bookshelves, doors, lamps and stoves. Metadata identifies an *intended workstation* or *visual prop* without falsely simulating usage, fuel or NPC labor.
5. `Kit.auditStations` analyzes actual path reachability from Charles's spawn to adjacent tiles of each identified workstation, seating, storage and utility object. The room inspector reports unreachable anchors, providing a foundation for *future real work orders* rather than inventing earned wages or production now.
6. Fixed a prior actor-collision loophole: a person placed before a desk and a desk placed before a person must both be rejected when overlapping, including imported/saved layouts.

## Focused QA and acceptance notes

- New `tests/room-builder-kit.cjs` checks atomic paint rollback, rectangle/fill boundaries, eyedropper, data-driven furniture definitions, named draft save/reopen/delete, corrupt draft rejection, and reachability of sealed/unsealed workstations.
- Existing `tests/room-builder-core.cjs` now also covers furniture-over-actor and actor-over-furniture collision in either order.
- Both tests passed against fetched GitHub sources in a JavaScript compatibility harness, and the editor script parses. This is **not** a full Node suite, Linux Electron launch, mouse test, or verified save-store behavior.
- No Windows workarounds, GitHub Actions, terminal commands for the owner, preview app auto-open, password prompts, executable distribution or new release tag.
- The original Washington city map and pin placements, original 69-art-sprite style, and approved executive desk layouts were not changed.

## What's still pending before owner testing

- Source integration needs an actual graphical Linux Electron walkthrough, particularly paint drag/mouse release, named blueprint save and restoration, editor close behavior, and office scene interaction.
- No factory staff or patients automatically start work simply because someone places an NPC sprite; full workplace assignments require correct NPC calendars, wages, worker rights, machine inventory and observable movement.
- New art and interactive layouts for other buildings remain postponed until **Charles's Executive Office** is accepted.
- The three-column newspaper and live map clock from recent earlier checkpoints also remain pending visual owner acceptance.

**Source development only.** This build continues the `docs/PANDORAS-BOX-ROOM-EDITOR-2026-10-31.md` foundation; the asylum ideas remain documented separately without film spoilers.
