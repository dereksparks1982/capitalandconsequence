# Capital & Consequence v0.7.42-dev | Room Builder + Private Ledger Writing

**Date:** 31 October 2026  
**Status:** Source-development checkpoint on `main`. **Not an accepted, locally packaged or owner-tested Linux release.**  
**Priority:** Original Pandora's Box-style construction/decorating editor. **Do not begin asylum interior art before the office/editor is accepted.**

## Built: Visual room editor, first working vertical slice

- Registered in-game **DEV** panel: **Build / Decorate Rooms** opens an original, self-contained pixel-art construction editor without changing approved map/desk geometry.
- Uses all **69 existing original sprites** from `assets/artwork/assets.json` and the already tracked `assets/artwork/spritesheet.png`; **32×32 tile scale**, deliberately rough, simple top-down artwork. No new look or third-party runtime.
- Starts with Charles “Charlie” Whitcomb's already registered **Federal Electric Factory / Executive Office**, not another invented room or project.
- Draw floor tiles, walls, doors, windows; place furniture, props, and character sprites from the category palette.
- Select and drag placed objects; rotate 90 degrees, duplicate, delete, erase, and undo/redo editing steps. Multi-tile furniture uses its actual sprite footprint; rotated object duplication validates the rotated footprint.
- Adjustable room **width and height (8–40 tiles)**; resizing rebuilds outside walls and preserves any valid interior objects, flooring and player spawn, or refuses destructive clipping.
- Set the Charles spawn point, show/hide grid, zoom the view. **Test Walk** moves him with WASD or arrows against walls, doors and solid furniture. Preview time, money, NPC state and career progression are not mutated.
- Save/load a versioned layout with stable `factory/executive-office` identity in locally stored developer room data, distinct from the player career save; manually export/import JSON for copies. Reject bad sprite references, duplicate object IDs, invalid dimensions and invalid player spawns.
- A **saved executive-office floorplan** also renders in its *existing registered city-room scene*. Walk Charles inside that saved design using the same simple collision rules; the original room directory and map travel continue to handle actual location changes.
- Source files: `room-builder-catalog.js`, `room-builder-core.js`, `room-builder-ui.js`, `room-builder-scene.js`, `room-builder.css`, and `index.html` integration.
- Regression specifications added in `tests/room-builder-core.cjs`. Focused JavaScript inspection and 18 direct logic/source checks were exercised and passed during development; **the complete local Node suite and actual packaged Linux graphical test remain outstanding**.

## Fixed: Business Ledger private writing

- The Section selector now lists **every single page**, not just left-side pages. Right-side **page 4** is explicitly selectable.
- A **My Writing** toolbar shortcut jumps to the final writing page without scrolling through unrelated company accounts.
- New entries append as separate **dated, durable private pages** under the active protagonist, rather than rewriting one opaque textarea.
- The old single `personalBookNotes` field is preserved and displayed on an **Earlier Private Notes** page when it contains writing. New entries live in `personalBookEntries` inside the character save.
- The button now says **Save Entry to Ledger** and reports the page number/date once the real profile save succeeds. Failed saving leaves the text in the editor and makes failure explicit; close/turn continues to try saving typed drafts.
- Do not silently hide the first entries after more than 250 private pages; the index and folio navigation include all generated entries.
- New regression coverage: `tests/private-book-writing.cjs`.
- Book artwork and approved two-page presentation remain unchanged, and none of this writing becomes police evidence, an NPC memory or a completed mission.

## Limitations, testing and acceptance gates

1. **Office is the only editor-targeted room in this first cut.** After owner acceptance, expand the exact same system to the remaining factory rooms, then the city and asylum. Do not create a parallel room art style.
2. Existing game interactions (ledger, desk, room travel, business systems) remain separate from sprite-click actions. The editor's placed furniture interactions are *future integration*, not promised playable features in this source checkpoint.
3. The ordinary game may route Charlie directly to his existing executive desk for some entries. The new saved floorplan is present in the registered **city room**, without replacing the approved executive desk UI.
4. Saved developer room designs use browser/Electron local storage for this slice and manual JSON export/import. They do not yet become a distributable shared default room file in the repository until an accepted design is committed as an asset.
5. No full Node suite, live Ubuntu/Electron game playthrough, import/export browser smoke test or accepted packaged root ELF verification has been performed for **v0.7.42-dev**. Do not claim runtime or graphics acceptance from source checks.
6. No GitHub Actions, auto-opened browser, password/agent request, downloaded test executable, new release/tag or approved city map alteration.
7. Follow the agreed release order: acceptance after owner testing, then local commit+annotated tag, GitHub push/verification. These source development commits are **not** that accepted release.

## Future parked work

District Asylum and its potential story influences from *Shutter Island* and *American Horror Story: Asylum* are recorded without movie spoilers in `docs/DISTRICT-ASYLUM-FUTURE-DESIGN-2026-10-31.md`. Revisit only after the room editor and executive office foundation are validated.

**Relevant plan:** `docs/PANDORAS-BOX-ROOM-EDITOR-2026-10-31.md`.
