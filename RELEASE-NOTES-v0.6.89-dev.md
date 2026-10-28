# Capital & Consequence v0.6.89-dev: Development Patch Notes

**Status:** unaccepted source checkpoint, October 28, 2026. This is not a finished or certified Linux release.

**Publisher:** Elderred Softworks LLC. © 2026 Derek Sparks. All rights reserved. See [LICENSE](LICENSE).

## User-visible changes
- The developer panel starts hidden, can be intentionally toggled via DEV button or Ctrl+Shift+D, and remains visible when opened until closed.
- Unverified map pins no longer have dotted outline rings. Pin coordinates, names, filtering and original Washington guide artwork are untouched.
- Long map location information panels independently scroll when the mouse wheel is over them instead of zooming the map.
- Desk buttons appear in order: **Step Away From Desk**, **Go to Lunch**, **End Business Day** (with New Game separate).
- **Step Away From Desk** opens the Washington map to choose the next destination rather than automatically entering a room.
- **Go to Lunch** simulates the authoritative world clock up to **12:00 PM today**, without forcing the character to travel or eat.
- **End Business Day** simulates the unfinished workday through **5:00 PM**, including production, markets, NPCs, and scheduled events, without falsely placing the character in bed. The separate night action still offers an explicit morning skip.
- **Incremental player time:** opening the map costs 1 minute; closing the visible map costs 1 minute; traveling between locations costs 30 provisional minutes; moving between distinct rooms at the same location costs 1 minute; a successful bet placement costs 1 minute at horse/dog/motor racing, licensed boxing, private fights/cockfights and poker. Unchanged room views, invalid wagers, already-open map and blocked popup do not add time. Games/events carry their own additional durations.
- **Boy Mercer** is now a named autonomous Washington card shark and habitual liar, not a steady worker. He has a chaotic date-based routine, frequent gambling, skilled bluffing, modest card profits/losses, risky occasional theft/cheating, and a small midweek gig unloading liquor from a horse-drawn delivery wagon. His own money ledger tracks outcomes and expenses. His incredible, contradictory stories persist in his conversation history as **unverified claims**, without minting actual contracts, properties, invitations or wealth.
- Existing named NPCs can describe their established occupations and current observed activities, while refusing to invent unknown private facts or appointments.

## Regression coverage
Focused source-syntax checks and direct V8 integration checks exercised the 30-minute location / 1-minute room accounting with duplicate movement prevention. Source contracts cover the desk button order, noon/5 PM boundaries, map interaction charges and new wager acceptance paths. Additional Node test cases cover Boy's schedule, irregular wages, card-game ledger and no duplicated settlement.

**Still pending:** complete offline `npm run test:source` execution against a checked-out repo and direct Ubuntu Linux Electron gameplay acceptance, including live 1-minute map charges, all gambling modules and both daily time jumps. Source tests are not equivalent to hands-on acceptance.

## Packaging and compatibility
The delivery is an online, changed-runtime-files, **in-place Electron ASAR patch** that keeps the existing executable. The patch tool downloads verified changed game source from a pinned GitHub commit when executed, and updates `resources/app.asar` only after all required source checks complete. It is not a self-contained offline source ZIP or a fresh Electron installer.

No GitHub Actions, new Washington map artwork, moved pin geometry or old-save migration. Existing executable and currently supported autosave remain in place.

## Outstanding development
Prioritize full playable QA, solid cross-location NPC movement and household routines, physically settled merchant/economic and interpersonal consequences, full Star Club and private poker trial/membership gameplay, independent character careers and promotion systems, comprehensive banking/broker/poker/wager testing, and remaining gambling cash-custody surfaces. Keep original map unchanged.
