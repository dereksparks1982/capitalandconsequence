# v0.7.96-dev · Passenger journal and saloon game integrity

Source-only development, November 3, 2026; no accepted release/tag.

A self-authored diary at Charles's physical shipboard berth costs ten game minutes to write and uses the same world simulation as the ship's passage. Entries include saved clock minute, game date, voyage ID, original origin/destination, and up to 800 characters of player-written text. The journal persists across passages, including read-only access in foreign harbors; empty, overlong, and off-berth inputs are rejected. Rendering escapes player prose and a draft is not erased by ongoing background redraw while the text field is focused. The game's existing card and checkers engines are also mutually exclusive with each other, as with dominoes.

New source `merchant-shipboard-journal.js`, updated passenger UI/CSS, app action, game-table guards, HTML dependency order, version and `tests/merchant-shipboard-journal.cjs`. Verified syntax of six updated source/test modules and one focused V8 journal write/read/persistence smoke. NOT verified native full `npm run test:source`, Linux Electron playthrough or user acceptance.
