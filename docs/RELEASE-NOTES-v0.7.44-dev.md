# Capital & Consequence v0.7.44-dev | Printed Metropolitan Ledger and Room Editor Hardening

**Source checkpoint:** 1 November 2026  
**Status:** Repository source on `main`, **not packaged, accepted or verified in the live Linux game**. Developer source checks passed, but do not imply visual acceptance.  
**Development priorities remain:** Original reusable 32×32 location editor, Charles Whitcomb's Federal Electric executive office first, city map artwork unchanged. District Asylum artwork and narrative postponed and documented separately.

## Major addition: Metropolitan Ledger is a newspaper

- Replaced the `news` tab's plain headings and horizontal rules with a full printed **1878-style broadsheet front page**.
- Large typographic masthead `THE METROPOLITAN LEDGER`, independent Washington publication legend, price (three cents), dated daily edition, volume/issue line, editorial strap, oversized leading headline, drop cap, double rules and **three narrow newspaper columns** for Financial & Industrial, Washington & Society, Sporting Intelligence, and reported public dispatches.
- Kept every existing live newspaper data ID and its existing source: `paperDate`, `headline`, `story`, `marketStory`, `societyStory`, `sportsStory`, `washingtonPublicDispatches`. No made-up public police evidence or rewritten event outcomes.
- Newspaper styles are scoped in `newspaper-print.css`; they do not restyle the business ledger, desk or other careers. The print stylesheet is readable on small viewports (single column) and includes paper-oriented print media rules.
- **Archived issues are now readable.** The archive list has buttons for older editions, and the paper displays preserved lead story, financial/industrial notes (for newly archived issues), society and sport on a separate archived broadsheet panel. Archived content uses safe DOM text, not injected HTML. Existing older editions with missing financial text explicitly say that field was not preserved.
- `archiveToday` captures published financial narrative at archival time, rather than showing today's later market in yesterday's issue. Existing archives are left intact; the newest edition/date still reads from the game world clock.
- Added local regression file `tests/metropolitan-newspaper-print.cjs` and integrated automatically with repository's `tests/run-all.cjs` source runner.

## Major addition: Room editor reliability and office workflow

- All **69 original crude top-down 32×32 art sprites** remain the only active room art source.
- Optional **Load Example Office** creates a deliberately basic 16×12 tiled mock-up with desk, cabinet, chair, shelf, lamp, plant and coat stand. It is a draft **only** and does not override an approved room design; user confirmation is required.
- `Check Room` uses a tile-BFS pathfinder to inspect the starting tile, number of doors and reachability of open exits. Diagnostics and failures appear in the editor status line.
- **Test Walk is non-destructive:** a clone of the room is used for walking and toggling doors; test actions no longer alter the saved layout or create unsaved changes.
- The Select/Drag tool preserves the pointer grab offset when moving furniture; it no longer snaps the object's top-left corner under the cursor. Furniture can also be nudged one tile with arrows or on-screen direction buttons.
- Saving a new valid room blueprint preserves the previous valid version as a local **backup**. **Restore Backup** loads the earlier design as an unsaved draft with user confirmation, never immediately overwrites the current saved room.
- Validation rejects overlap between solid walls/furniture and placed actor sprites or Charles's spawn, including during imported layout validation, instead of letting characters occupy an impossible position.
- The in-world `factory/executive-office` walkable floorplan now detects proximity to an editor-placed oak desk. Pressing **E** or clicking the nearby desk opens the real existing executive desk through a guard checking the active save, actual character, actual room and non-developer session; it does not teleport or charge another city journey.
- Existing travel route animation, universal map/room digital clock banner, map pin coordinates, desk UI, permission checks, room travel and gameplay accounting remain in place.
- Added `tests/office-scene-interaction.cjs` and expanded `tests/room-builder-core.cjs`.

## Developer verification

- Four focused regression files covering the office editor, physical desk interaction, travel clock, and printed newspaper were run with a JavaScript compatibility harness against current GitHub source and **all four passed**.
- The direct logic inspections covered art catalog size, example office reachability, furniture/actor collisions, date rollover and newline-rendering concerns. **Not equivalent to a full local Node test suite or Electron execution.**
- The existing offline `tests/run-all.cjs` discovers all newly added `.cjs` files automatically; no Actions or cloud runners were used.
- Full Linux runtime tests, printable result, sprite positioning, mouse interactions, geometry and owner gameplay approval remain outstanding.

## Acceptance gate before branching outward

1. Check that the newspaper genuinely looks like a printed 1878 edition on the real screen and that the archival reader works.
2. From the DEV editor, load the **optional** demonstration office, move furniture, inspect a path, save and reopen, test Charles's movement and interact with the desk from a genuine office visit.
3. Verify that editor exit, career save, world clock, map/room travel and room access remain stable. Check the ordinary office return path remains charged only when leaving another factory room, not when opening desk from the furniture.
4. Only after acceptance, turn the owner's approved office scene into a committed default blueprint. Next extend the editor to other Federal Electric factory rooms. **Never invent an accepted office layout.**
5. Do not ship, tag or declare release parity before those checks. The user requested no terminal commands or premature downloads.

References: `docs/PANDORAS-BOX-ROOM-EDITOR-2026-10-31.md`, `docs/RELEASE-NOTES-v0.7.43-dev.md`, `docs/DISTRICT-ASYLUM-FUTURE-DESIGN-2026-10-31.md`.
