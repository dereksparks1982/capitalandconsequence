# Capital & Consequence v0.7.93-dev · Moving Passenger Ship Interiors

**November 2, 2026 · Development source only, not a tested or accepted Ubuntu executable.**

## Built
The existing personally paid passenger-voyage system now has a separate top-down ship interior while the vessel actually proceeds along its existing charted world route. Steamships have a Cabins & Stores deck, a Dining Saloon, and an upper Promenade Deck; schooners have a combined Passenger Berths & Mess and an upper Weather Deck. Every floorplan is 12 by 9 crude squares using original geometric/symbolic tiles. The layouts deliberately do not import outside sprites or claim to reconstruct a specific historical steamship.

The player uses arrow keys, WASD or clickable adjacent walkable cells. A valid step charges **one minute** on the same world clock as everyone in Washington and the ship itself. Changing a deck requires standing at an actual stair hatch and climbing only to the next deck, again charging one minute. Walls, sea and marked crew-only areas are not passable.

Shipboard sleep, galley meals and water can no longer be triggered from anywhere aboard; Charles must reach his berth, food counter or water stand. The existing needs, medical treatment and personally paid galley services are reused. The upper lookout offers a five-minute observation action. The saloon has casual **Twenty-One**, a simple saved card game. Deal, draw and stand take actual Washington game minutes; the deck order is deterministic from the particular saved trip and hand. Dealer draws to 17. The game creates no imaginary NPC employment, cash winnings, gambling license, or company transactions.

The existing maritime chart, ocean-lane points, ETA and storm delay stay the sole source of ship movement and arrival. The passenger marker is updated for display only, not driven by a new clock. Passage, cargo, company accounts, Washington map geometry, character histories and 1878 World’s Fair narrative gates remain unchanged.

## Not built
The physical Alexandria neighborhood, family trading-office interior and Alexandria-to-America embarkation route have **not** been created. Charlie's v0.7.92 four-scene authored prelude is preserved exactly, not misrepresented as a playable Egyptian port or a clock-charged voyage. True independently roaming ship passengers, social card opponents with persistent NPC identities, other games, storms affecting deck accessibility and historically researched hull plans are future gameplay.

## Files and verification
New: `merchant-shipboard.js`, `tests/merchant-shipboard.cjs`. Modified: `merchant-passenger-ui.js`, `merchant-passenger-ui.css`, `app.js`, `index.html`, `package.json`, `ROADMAP.md`, `GAME_LORE.md`, `CONTINUE-HERE.md`. V8 direct model checks passed: deck dimensions, legal walking, stair restrictions, save state, casual card-game settlement, no transfer of player/company cash, clock isolation, and arrival lock. **New Node test file and full offline regression suite have not been executed in a native Node environment; Ubuntu Electron render/playthrough unverified.** No acceptance, release tag, packaging or new installer.
