# Capital & Consequence v0.7.43-dev | Washington Clock at Every Location

**Date:** 31 October 2026  
**State:** Direct source development on `main`, pending full local tests and owner acceptance. **No released or packaged executable.**  
**Focus:** Fix the remote Executive Desk shortcut and keep the existing digital time banner visible across the map and rooms.

## User-reported defects

1. From University of Maryland and other locations, the `Return to Executive Desk` button instantly showed Charlie's office even when he was physically elsewhere, giving the impression of teleportation.
2. The red executive-desk status banner was covered by the full-screen Washington map and city-room overlay. The map had no visible digital clock.
3. The travel pawn's animation ran before the game-clock jump, so the player couldn't watch the in-world arrival time advance as the pawn followed the route.

## Changes committed

- **Physical return rule:** `returnCityRoomToOffice` now refuses any return when the player's location is not `factory`; it no longer calls provisional long-distance time debits itself or writes the factory as a new current location from elsewhere.
- **Button visibility:** `syncCityRoomDeskReturn` shows `Return to Executive Desk` only inside Federal Electric for Charles's actual session. Remote buildings show `Return to Map` and `Main Menu`, but no misleading office teleport. The guard runs twice where needed: during room rendering and again after the map renderer's developer-preview session is converted into a genuine arrival. Once physically at the factory, returning to the executive office from another factory room costs a recorded **one-minute room move**.
- **Trip home:** From another building, use `Return to Map`, choose Federal Electric, select the valid transportation, and click `Go There`. This uses the same map route, moving pawn, route validation, duration estimate, travel accounting, NPC sync, custody rules and normal arrival as any other journey. Factory's public Receiving Office is its ordinary arrival room; the desk return becomes available there.
- **World HUD:** New `world-banner.js`/`world-banner.css` show phase, game date, **digital 12-hour time**, weather, exchange status, company cash, personal cash and Pause/Play *inside the existing map header and city-room shell*. They mirror the executive-desk status, not a newly simulated independent clock. Their styling is scoped to the map/room banner; the original desktop bar and all artwork/pins remain unchanged.
- **Time during animation:** For mapped journeys, a read-only projected time display advances as the map pawn proceeds. The original `FE_TRAVEL.recordProvisional` continues to charge the entire journey **exactly once after successful arrival**. Failed or canceled animations discard the preview, restore the authoritative time display and make no travel charge. The normal ambient one-second simulation and market ticks pause during active travel animation, preventing unshown background seconds from stacking on top of the final journey debit.
- **Synchronization:** The existing render, per-second tick, and pause controls now refresh the map/room HUD. Ending an animation restores the real `clockText()` and game-date display.
- **Tests:** New `tests/world-banner-travel.cjs` covers persistent UI integration, guarded return path, read-only projected clock, noon and midnight/date rollover and cancellation state. Focused JavaScript source checks run during development; the full Node/Electron Linux suite and screenshot acceptance **have not been run** for this build.

## Invariants and deferred work

- Do not rewrite the approved Washington map JPEG or move any of its 40 pins, map buttons or previous approved UI geometry.
- No additional map-teleport path, phantom fee, extra clock, unearned room access or divergent cash ledger.
- No independent timer for travel: time projection is **visual**, and saved world time is charged at successful completion only.
- The normal one-minute map opening and closing charges remain as previously approved; these are distinct from actual journey duration.
- Never allow developer preview sessions to grant access to normal gameplay.
- Do not confuse source check success with a tested Ubuntu game or accepted release. No GitHub Actions, downloadable build, terminal commands for owner, or release/tag created.
- Continue improving the reusable Prison Architect-like room builder. Asylum work remains documented for later.

Related: `docs/RELEASE-NOTES-v0.7.42-dev.md`, `docs/PANDORAS-BOX-ROOM-EDITOR-2026-10-31.md`, `docs/DISTRICT-ASYLUM-FUTURE-DESIGN-2026-10-31.md`.
