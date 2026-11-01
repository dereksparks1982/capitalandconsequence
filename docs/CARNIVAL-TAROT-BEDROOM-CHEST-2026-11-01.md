# v0.7.60-dev · Washington Traveling Circus, Midway Prizes, Bedroom Chest and Fortune-Teller
**Capital & Consequence · development notes · November 1, 2026**

## Built in the repository
- **Recurring public circus**: the Washington Traveling Circus visits the existing Capital Race Grounds May 3–9, July 3–9 and September 3–9 each year from the 1878 era onward. These are alternate-history *gameplay calendar choices*, not historical event claims. The tent icon appears to all four characters only during the engagement and disappears on departure. No printed map art, position or government pin has been altered.
- **Six interactive midway booths** at the actual in-town location: Ring Toss, Balloon Darts, Tin Duck Shooting Gallery, Knock Down the Cans, High Striker Bell and Penny Peg Drop. Players use a five-position aim control with a visible side-of-stall clue and three or four turns per paid entry. No hidden screen instantly issues a prize. Initial booth fees are 3–8 cents, charged to personal cash; beginning a booth advances the one authoritative Washington clock by 2–4 game minutes. Existing player access and location rules still apply.
- **Prizes with provenance**: a result may earn nothing, cheap paper souvenirs, collectible trinkets, a working clockwork tin duck, or an uncommon fine compass/medallion. Uncommon prizes require an excellent score and a further bounded probability. All awards use the existing physical `FE_PERSONAL_EFFECTS.acquire()` inventory, with unique receipts. If a player's inventory cannot accept a prize, its claim remains recorded rather than vanishing.
- **Bedroom Chest**: 64 stored objects in the existing `S.personalEffects.items` ledger under `bedroom-chest`, accessible only while physically at `home/bedroom`. Two lists let the player deposit carried objects and withdraw to a pocket. No developer-room preview can transfer objects from afar. Household storage and executive desk collections remain separate.
- **Fortune-teller draws the cards**: the player pays 10 cents for a ten-minute sitting at her temporary circus pitch. `FE_TAROT` shuffles and draws a three-card spread automatically; the player never chooses cards. The interpretation is about **the in-game character**: Charles's industrial obligations, Sam's service/family, Elias's deals and risks, Edmund's asylum/family pressure, plus current health, repeated collapses, carried cash and factory liquidity when appropriate. It stays symbolic and cannot expose secret murderer outcomes or future game RNG. Her speech and selected cards are saved in a permanent session. The player can reread a session without paying again.
- **Card art**: no third-party card imagery included. In-room cards currently display a deliberately simple textual paper design with a decorative symbol. Their `artKey` values are reserved for original Elderred Softworks artwork.
- Existing public circus conversation and per-profile private NPC-discovery restrictions continue. The wandering reader's independent wagon, roaming itinerary, permanent name and residence are *not* claimed complete; this build provides an initial in-person sitting while her show pitches at the circus.

## External repositories evaluated as references, NOT copied
The user's request was to use useful GitHub projects without outside dependencies. These examples informed *categories and interactions*; the code in this build is original rather than vendored.
- [Balloon Popping Game](https://github.com/JS-Beginners/balloon-popping-game) · balloon target interaction; no clearly published license found, therefore **do not copy its source**.
- [Duck Shooter Game JS](https://github.com/polon59/Duck_shooter_game_JS) · limited shots, target gallery and score feedback; no clearly published license found.
- [whack-a-mole](https://github.com/Alefiya-J/whack-a-mole) · alternating hit targets; not copied, no clearly published license found.
- [ball-toss](https://github.com/stephaniedinelle/ball-toss) · actual fairground-style thrown-object booth; no clearly published license found.
- [Plinko](https://github.com/zprobinson/Plinko) · peg-drop concept; implementation depends on p5.js and Matter.js, so **not bundled**.
- [Tarot.js2](https://github.com/MarketingPip/Tarot.js2) · MIT-licensed deck and spreads reference; original in-house deck retained for complete offline independence.
- [Tarot Card Data](https://github.com/smallcat419/tarot-card-data) · definitions and reading inspiration; verify its true licensing before using data verbatim. No data vendored.
- [Tarot by Robert Rutherford](https://github.com/rbrutherford3/Tarot) · MIT-licensed touch shuffling reference; reader rather than player handles the cards, so its interactive shuffle interface was **not** adopted.

## Checks and known limits
- Focused regression `tests/circus-carnival-chest-tarot.cjs` verifies paid rounds, real saved belongings, restricted bedroom storage, all six booths, persistent reader-selected cards, contextual reading and idempotent payment.
- **Real target animation and more tactile physics** remain future improvements. Current booth controls use five choices and a side-of-stall hint, not a fully simulated projectile/collision engine. No claim of a complete physics carnival.
- The circus reuses the real Race Grounds room and printed coordinate. An exclusive circus campsite and ring arena/performer schedule are future venue content.
- NPC actors do not instantly know a player's attendance merely because they have an NPC schedule; in-town event discussions use the actual attendance ledger.
- **Full Node suite and native Linux Electron run have not been executed**. No GitHub Actions, tagged release, executable publication or UI acceptance.
