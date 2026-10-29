# Capital & Consequence v0.7.18 Beta
**29 October 2026 | Development source checkpoint, not an accepted public release**

## Poker: readable top-down card table
- The approved four-seat table retains its seat positions and sepia placeholder character silhouettes.
- A clearly visible **dealer button** follows the hand's real dealer index.
- The person whose decision is pending receives a subtle turn highlight and **TO ACT** label; folded and all-in status remain visible.
- Players see their own two hole cards. Opponents' hole cards stay concealed until a contested showdown. Folded hands do not become public even after the winner is known. Concealed cards carry no red-suit styling.
- Existing Texas Hold'em rules, side pots, stakes, etiquette and money/session settlement remain intact. No arbitrary stage timer or forced tutorial has been introduced.
- Focused tests: `tests/poker-portrait-gameplay.cjs` and `tests/poker-silhouette-secrecy.cjs`.

## Capital Travel: safer routes, smoother turns
- The moving miniature now eases its facing direction through modeled street corners using a short look-ahead measured in original **2048 × 1159 guide pixels**. Its actual point **never leaves the road path**.
- `capital-street-network.js` now exports `validateItinerary` and rejects through-journeys which cut across explicitly modeled White House restricted grounds, while still allowing visits to that landmark.
- All **1,560 directed routes** among the 40 existing Washington pins were checked and remained connected with no prohibited compound traversals.
- This is still a first-pass **approximate** street graph. It is NOT a fully traced, building-perfect road network. No real-world miles are asserted.
- Focused tests: `tests/capital-travel-smooth-turns.cjs` and `tests/capital-street-route-audit.cjs`. Existing map tests remain.

## First playable formal duels
- A completed **poker session with deliberately rude table conduct** can issue a persistent challenge from an existing named patron of that card room. A normal polite session never creates one. This is a player-triggered conflict, not an invented random street attack.
- At the **same card room**, the player may accept and enter a separate **first-person sepia standoff** showing a full-body standing silhouette, a moving red aim marker, and **3 … 2 … 1 … SHOOT!**
- Choices: **Fire**, **Fire Wide**, and **Yield**. Successful fire depends on reticle timing, existing personal **Marksmanship/Observation** skills, and uncertainty. The opponent has an independent rating and can miss, wound or kill. One harmless exchange may satisfy honor or the player may request another, up to three exchanges.
- The result, rounds, opponent, injury marker, and reputation shift are saved to the current profile. The game-clock transaction is attempted exactly **once** on settlement, with marksmanship practice recorded for an actual shot.
- Exiting before the firing signal leaves the challenge outstanding without charging a duel. A failed time or save settlement can be closed and retried, rather than trapping the player.
- **Limits of this first implementation:** The challenge currently originates from insulting poker etiquette, not every possible NPC disagreement. Fatal results are recorded as duel-history/injury outcomes; complete career retirement, law-enforcement prosecution, witnesses, firearm inventory, permanent NPC death and subsequent retaliation are future integration work, not claimed here.
- Focused tests: `tests/duel-engine.cjs`, `tests/duel-ui.cjs`, `tests/duel-poker-bridge.cjs`, `tests/duel-room-integration.cjs`.

## Non-negotiable project requirements
- The original Washington artwork is **unchanged** and fixed across years.
- The 40 approved pin defaults, existing poker seat layout and approved underlying UI geometry remain intact.
- New content is isolated to game-owned overlays and the existing city room shell; user profiles continue to autosave.
- The short README describing the game and proprietary **All Rights Reserved** terms was **not changed**.
- No GitHub Actions, hosted build minutes, additional Actions artifacts, SSH, password prompts or compiled Linux installer were used.

**QA status:** Focused isolated JavaScript tests and source checks passed. The complete offline Node suite and a hands-on Ubuntu Electron playthrough remain outstanding. These are committed Beta **source** changes, not an executable package or accepted version 1.0.
