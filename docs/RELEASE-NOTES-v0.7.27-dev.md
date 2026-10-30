# Capital & Consequence v0.7.27-dev

**Source integration: Chess, the first living Washington tabletop game**  
**Date:** 29 October 2026  
**Branch:** `main` only  
**Status:** Development source; **not an accepted or Linux-native verified gameplay release**.

## Implemented

- Imported [chess.js v0.10.3](https://github.com/jhlywa/chess.js/tree/v0.10.3) as an **unmodified** BSD-2-Clause, browser-ready JavaScript rules engine. No upstream chess art imported.
- Created original tabletop chess adapter (`tabletop-chess.js`) using genuine engine-validated moves, check, checkmate, draw, move history, deterministic first-generation NPC move selection, resignation/forfeit, and durable win/loss records.
- Created playable overhead chess board (`tabletop-chess-ui.js` + `tabletop-chess.css`) with wood/felt frame, selectable 64-square board, legal-move destination hints, player and opponent framed **generic period CSS silhouette portraits**, nameplates, saved game records and room-specific challenges.
- Chess tables initially exist only in suitable *existing rooms* in Hillsdale, University of Maryland, Russian Trade Hall, Commerce Club, Neighborhood Card Room and Star Club **main parlor**. No global games screen. The club's poker prohibition remains unchanged.
- The opponent must be **a real NPC currently located in the same room**. No remote challenges or fabricated opponent arrivals. Player moves charge one Washington minute, challenges charge one minute, legal moves persist.
- Added autonomous NPC-versus-NPC chess fixtures: **when two residents share an eligible room**, an offscreen 15-minute club match can be scheduled and only completes if both are still there. Actual engine moves determine checkmates or natural draws; when a prolonged match is unresolved, the game records an agreed draw. No spectator is required.
- Played matches, results, records and pending offscreen fixtures persist in the shared Washington world. An active player game remains **private to that character's own save**, not leaked through another playable character.
- Actual completed chess results may enter the Metropolitan Ledger's sports report. No invented championship winner is added without an actual completed match.
- Added a reusable top-down table and portrait direction in `docs/TABLETOP-PRESENTATION-CANON.md` for the other 27 proposed games.
- Updated `README.md`, `LEGAL.md`, `THIRD-PARTY-NOTICES.md`, the research/design docs and the in-game Info tab with the newly adopted upstream copyright/license. Packaging includes all legal notices; vendor source includes the complete BSD-2-Clause text.

## Source verification

- `tests/tabletop-chess.cjs`: **48 assertions passed** in an in-memory JavaScript-compatible harness covering true chess moves, checkmate, illegal moves, date/room access, actual attendee requirement, NPC fixtures, cancellation, persistence, shared-world privacy and publication hooks.
- `tests/tabletop-chess-ui-dom.cjs`: simulated DOM click-through passed for opponent selection, 64-square board, player/NPC portrait seats, action time, save, resignation, NPC departure and hidden-room behavior.
- `app.js`, `shared-world.js` and `tabletop-chess-ui.js` syntax checks passed.
- **Not run:** complete local Node test suite, physical Ubuntu Electron app, user acceptance, full visual screenshot/manual testing. Do not claim an executable or QA acceptance.

## Known remaining work

- Named NPC painted portrait assets are not yet authored; the first table uses original CSS-generated period silhouettes, meant as replaceable generic placeholders.
- First-generation chess opponent AI is deliberately simple and not a high-level chess engine.
- Formal chess club tournaments, ongoing title holders/champions, advanced skill growth, invitations/reputation, spectator interactions, and shared tournament planning remain for later work. **No title is invented from background prose.**
- Offscreen fixtures currently require two actually co-present NPCs in a known room; this does not guarantee a competition on every day or in every venue. Future calendars and intentional game-player habits can improve participation.
- Existing city location geometry, map artwork and approved desk layouts were not changed.
- Remaining **27** tabletop/parlor games in the design catalog are not implemented; the next library and game will be selected and imported as a separate, sequential development pass.

**No new branches, GitHub Actions, releases or executable artifacts were created.**
