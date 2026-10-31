# Canonical Tabletop Game Presentation

**Capital & Consequence | Washington 1878 | 29 October 2026**

## Approved shared visual direction

All playable parlor, board, tile and card games should present **the physical table from above** with the participating characters' **framed generic-period portraits arranged around the edges of the tabletop**. This is the visual language originally specified for poker and now adopted as the common tabletop direction. Distinct games use different board, tiles, dice or cards, but **not** entirely different interface styles.

**Current implementation:** The first source implementation is chess in `tabletop-chess.css` and `tabletop-chess-ui.js`. Its portrait artwork is an intentionally simple original CSS-built silhouette placeholder in the established muted Victorian visual style. There is **no imported upstream board artwork**. Do not misrepresent CSS silhouettes as finished individual NPC painted portraits. Actual named-character portraits can replace the placeholder art when developed and approved, without changing the game logic.

### Spatial arrangement

- **Top-down table:** The board lies flat, centered in the view, inside a period-appropriate wooden frame, cloth/felt or other authentic surface. A game that doesn't use a board still uses a visible tabletop.
- **Players as visible people:** Each human or NPC participant has their name and distinct portrait in a framed seat outside the physical playing area. Portraits are not the playing pieces and do not cover legal moves.
- **2 players:** One far side and one near side, as in the first chess prototype; the player's seat sits nearest the screen edge.
- **3–4 players:** Seats placed at cardinal directions around the same table, with the player nearest the screen. Cards, dominoes and Mahjong can use four seats; the portrait components and board state stay independent.
- **Larger games or tournaments:** Use a carefully arranged table ring, spectator seats or a venue overview without covering the board.
- **NPC identity:** The portrait label must show the actual seated/scheduled participant's saved name, not invented wallpaper guests. If nobody is there, the table may be empty and entry is unavailable.
- **Art policy:** Use original/reusable artwork or components confirmed licensed for redistribution, recolored or restyled only when permitted. Preserve author notices even if an allowed component is modified. Do not reuse a candidate repository's copyrighted icons, portraits, board textures, fonts or sound merely because its rules engine is available.

### Shared interaction pattern

1. Arrive at a genuine location and room through the existing map and travel/access systems.
2. See what games the venue has and who is physically available to compete.
3. Challenge, join or watch only when the game's rules, table occupancy, relationship and historical date permit it.
4. Show the actual playing area, seat portraits, turn indicators, game-specific controls and a readable move/turn history.
5. Spend **authoritative world time** only on an accepted real action. NPCs may play offscreen using world fixtures; player spectatorship is not required.
6. Complete the game with a single saved result, lawful stake settlement where applicable, player/NPC reputation and appropriate tournament/news updates.
7. If a participant leaves or fails to attend, record a real forfeit/cancellation rather than drawing a ghost player into the table.
8. Maintain accessible controls and allow keyboard interaction. Small displays keep the board and seats visible without spilling onto the Washington map or changing the approved desk layout.

### Chess implementation notes

- `vendor/chessjs/chess.js` is **Jeff Hlywa's chess.js v0.10.3** (BSD-2-Clause), unmodified.
- `tabletop-chess.js`: original game-specific AI, real chess move/receipt adapter, room-based NPC fixtures and scoreboard data.
- `tabletop-chess-ui.js`: original table controls, legal destination hints, NPC portraits/seats and physical visitor access.
- `tabletop-chess.css`: original wood, felt, chessboard, portrait and responsive styling.
- `tests/tabletop-chess.cjs` and `tests/tabletop-chess-ui-dom.cjs`: source and simulated-DOM coverage.
- The engine's license and credit are in `vendor/chessjs/LICENSE`, `THIRD-PARTY-NOTICES.md`, `LEGAL.md` and the in-game Info tab.
- **Not yet complete:** true character-specific drawn portrait assets, advanced chess AI, formal championship titles/rating ladders, spectator controls, approved native Linux UI screenshot and gameplay testing.

**No game may require changes to the fixed original Washington map artwork.** Generic art components can be replaced only by specifically approved originals or appropriately licensed art.


### Checkers / American draughts development follow-up

Game #2 now reuses the framed CSS silhouette portraits for the actual named residents, with its own red/black discs and eight-by-eight overhead wooden board. A crowned king shows a star, forced capture destinations are highlighted, and continuation keeps the player's selection on the jumping piece. All art is original CSS; no image, approved map position or historical room geometry is touched.
