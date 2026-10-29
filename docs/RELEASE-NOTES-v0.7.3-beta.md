# Capital & Consequence v0.7.3 Beta source checkpoint

**Development status:** Beta, as defined by the project owner: playable foundation while features are still being completed. Version 1.0 is the eventual initial release.

## Working changes in this stacked build

### Real poker sessions and earned club membership
- The authorized poker pop-up's settled ticket is passed through the existing custody settlement into the club trial record.
- The trial's `sessionId` matches the real saved poker session token, so replay protection applies to the actual game, not just isolated unit tests.
- Replayed club trials no longer duplicate hospitality payments or membership notes.
- Betting custody remains the money authority. No duplicate stake settlement is permitted.

### Observed NPC shopping
- `npc-economy.actionFor()` settles the financial calendar period without generating a market purchase from a presumed location.
- The existing NPC arrival and observed-shopping functions alone make real grocery purchases, using buyer cash, shared finite stock, and merchant accounts.
- This removes off-site grocery transactions and supports legitimate receipts and provisions.

### Journeys across clock-period boundaries
- The saved NPC journey is settled before the new calendar slot's planned movement, including real destination arrival and arrival-time shopping.
- Recorded return errands still use the actual previous venue, and only the player's saved clock advances the simulation.

## Test evidence
Focused source tests passed in a standalone V8 harness:
- `tests/club-membership-integration.cjs`
- `tests/npc-economy.cjs`
- `tests/npc-market-bridge.cjs`
- `tests/npc-cross-period-arrival.cjs`

These are not substitutes for the **full** local Node source suite, Electron boot, or owner playtest. The automated tests should be run locally without GitHub Actions when the complete working tree is available.

## Known unfinished work
- The current private poker table uses Texas Hold'em, a historical mismatch for the 1878 setting. A historically appropriate draw-poker replacement requires its own designed and tested change. The government-sanctioned five-card D.C. tournament remains distinct.
- Longer continuous NPC travel routes, robust work attendance and finances, deeper relationships and poker conduct, and complete Federal Electric production/career progression are not done.
- No old-save migration required; new-game autosave still required.

## Release and playtest rules
- The owner sets creative direction and approves any 1.0 release.
- Internal source checkpoints are stacked; the owner typically playtests at their discretion after approximately ten checkpoints, not every commit.
- Never use GitHub Actions, passwords, SSH agents, or chargeable artifact uploads.
- Preserve the original fixed Washington art, all 40 approved map markers, and UI layout. Do not modify map geometry as part of unrelated features.
- No Linux installation ZIP until requested. Then provide changed-files-only patch with the established local Python `apply_delta.py` method.
