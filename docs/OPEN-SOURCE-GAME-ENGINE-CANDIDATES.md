# External Game Engines: GitHub Source & License Survey

**Capital & Consequence | Initial research | 29 October 2026 | Source discovery only**

Companion to [Tabletop, Parlor & Social Games](TABLETOP-PARLOR-GAMES-AND-LIVING-CIRCUITS.md). The 28 approved games are documented there, including Mahjong and both Western and Chinese dominoes.

## Licensing policy

Capital & Consequence is a **proprietary commercial-capable project**. A public GitHub repository is **not** permission to copy its code. The reported licenses below were checked against GitHub repository metadata and/or README/license listings on **2026-10-29**, but a metadata flag is **not a full legal or technical audit**. Before importing any implementation, review the exact LICENSE file, file-level headers, bundled resources, transitive dependencies, attribution requirements, patents where relevant, and historical game rules. Pin source versions; preserve all required notices. Do not ship third-party artwork without separately verifying its rights.

Prefer permissive MIT, ISC, BSD and Apache-2.0 licensed software. **Do not copy GPL/AGPL or unlicensed code** into our proprietary shipped game without a separate rights and architectural review. This survey does not import, install, fork, vendor, build or run any dependency.

## Priority short list (license metadata verified)

| Priority | Game(s) / function | Repository | License reported | Integration assessment |
|---|---|---|---|---|
| High | Chess legal moves, checks, draws, PGN | [jhlywa/chess.js](https://github.com/jhlywa/chess.js) | BSD-2-Clause | Strong headless TS/JS rules library; **no AI or graphics**. Excellent foundation. |
| High | Chessboard interface | [oakmac/chessboard2](https://github.com/oakmac/chessboard2) | ISC | Board UI, not rules. Inspect browser support/packaging; alternative is our own matching paper-table UI. |
| High | Backgammon | [quasoft/backgammonjs](https://github.com/quasoft/backgammonjs) | MIT | Real browser game with modular rule variants; separate offline rules logic from its multiplayer architecture. |
| Alternative | Backgammon, smaller/older JS basis | [binarymax/backgammon.js](https://github.com/binarymax/backgammon.js) | MIT | Lightweight alternative; older code, audit move/turn correctness. |
| High | Western dominoes | [ppyne/dominoes](https://github.com/ppyne/dominoes) | BSD-3-Clause | Small playable double-six dominoes implementation, vs computer; one variant, not a universal domino framework. |
| High | Xiangqi engine | [maksimKorzh/wukong-xiangqi](https://github.com/maksimKorzh/wukong-xiangqi) | MIT | JavaScript Chinese chess AI/engine; adapt to offline NPC matches and shared saves. |
| Supporting | Xiangqi board UI | [lengyanyu258/xiangqiboardjs](https://github.com/lengyanyu258/xiangqiboardjs) | MIT | Display-only Xiangqi board, **does not validate moves**. |
| High | Go/Weiqi board state | [SabakiHQ/go-board](https://github.com/SabakiHQ/go-board) | MIT | Go position/board data; scoring, ko/rule variants and NPC AI need independent verification/work. |
| Supporting | Go/Weiqi rendering | [SabakiHQ/Shudan](https://github.com/SabakiHQ/Shudan) | MIT | Goban UI built on Preact; not a game engine. Consider UI footprint. |
| Investigate | Four-player Mahjong | [Aixineiar/queju_mahjong](https://github.com/Aixineiar/queju_mahjong) | MIT | Functional Chinese four-player game, melds and scoring, but 3D/Node/WebSocket-based and uses **modern/local house rules**. Extract/evaluate headless logic only; verify historically suitable Chinese rules before use. |
| Investigate | Checkers/draughts rules & AI | [davidpomerenke/checkers](https://github.com/davidpomerenke/checkers) | MIT | Browser/React checkers front end backed by aima-checkers; **audit aima-checkers dependency separately**. |
| Investigate | Nine Men's Morris | [yadav-rahul/Nine-Mens-Morris](https://github.com/yadav-rahul/Nine-Mens-Morris) | MIT | Browser rules/game source; older project with limited automated testing. |
| Investigate | Reversi | [OrangeX4/Reversi](https://github.com/OrangeX4/Reversi) | MIT | Browser board and AI; confirm historical Reversi rather than assuming modern Othello rules. |
| Supporting | Standard deck and card movement | [einaregilsson/cards.js](https://github.com/einaregilsson/cards.js) | MIT | Reusable card/deck manipulation and animations; **not a complete whist, cribbage, euchre, hearts, pinochle or Écarté rules engine**. Asset licensing must be verified independently. |
| Supporting | Turn/state/phase framework | [boardgameio/boardgame.io](https://github.com/boardgameio/boardgame.io) | MIT | Mature multiplayer-first framework with AI and logs. **Probably heavy for our existing offline, single-city simulation**; evaluate as a rules harness, do not replace the canonical Washington clock or world store. Current repo declares modern Node/toolchain requirements. |
| Supporting | Table physics | [liabru/matter-js](https://github.com/liabru/matter-js) | MIT | Reusable 2D rigid-body collisions for crokinole, pool/billiards, bagatelle, bowling or quoits. Must still write accurate rules, controls, AI and deterministic replay. |
| Later only | Chinese checkers AI | [erik-sanne/ChineseCheckersAI](https://github.com/erik-sanne/ChineseCheckersAI) | MIT | Small experimental AI candidate, needs source and test review; **game not available in 1878**, and later terminology is date-gated. |
| Conditional | Pachisi | [bsingr/pachisi-bodensai](https://github.com/bsingr/pachisi-bodensai) | MIT | Pachisi-named multiplayer project; Firebase infrastructure and sparse README make this **reference material until code/rules verified**. |
| Conditional | Mancala mechanics | [intel/webapps-mancala](https://github.com/intel/webapps-mancala) | Apache-2.0 | Archived demo; **do not assume its specific variant existed in 1878**. Kalah-style modern rules must not be presented as an ancient Oware/Pachisi rule set. |
| Conditional | Euchre strategy | [c-medelius/euchre-coach](https://github.com/c-medelius/euchre-coach) | MIT | Card counting/strategy visualizer, **not a full four-player game engine**. Limited reusable value. |

**Cautions on license and provenance:**

- [pomax/mahjong](https://github.com/pomax/mahjong) specifically implements **real four-player Chinese Classical/Cantonese Mahjong**, rather than tile-matching solitaire, and has useful seeded-play/test design. However, GitHub metadata did **not** declare a license on inspection. **Do not copy its code or artwork without permission or a confirmed license**; rules and independent historical research may inform our own implementation.
- [jokkebk/jgoboard](https://github.com/jokkebk/jgoboard) appears technically capable, but GitHub reports `NOASSERTION` for its license. Hold until its exact terms and third-party assets have been audited.
- [gregoryjayuk/mahjong](https://github.com/gregoryjayuk/mahjong) is GPL-2.0; do **not** integrate into proprietary game.
- [olkorhon/js-mahjong](https://github.com/olkorhon/js-mahjong) is flagged MIT, but its README openly says its **graphics were taken from the internet without permissions**. Exclude those assets; also verify whether it is four-player Mahjong versus solitaire.
- GPL-licensed alternatives including [bocaletto-luca/Backgammon](https://github.com/bocaletto-luca/Backgammon) are **not drop-in candidates**.
- GitHub metadata being blank, `NOASSERTION`, or a license asserted only in a README is **not sufficient provenance** to include the implementation as distributable source.

## Gap analysis across all 28 games

| Covered by plausible candidate | Unresolved rules-engine work |
|---|---|
| Chess; checkers; backgammon; Western dominoes; Nine Men's Morris; Go; Xiangqi; Mahjong; Reversi | These still need world-integrated NPC AI, UI, scheduling, persistence, venue access, historic variants and tests. Mahjong requires particularly careful 1878 rules adaptation. |
| Chinese checkers (later); Pachisi; Mancala | Experimental/older/reference candidates only; no approved ready-to-ship engine. |
| Whist; Euchre; Pinochle; Hearts; Cribbage; Écarté | Generic `cards.js` helps with deck interactions. Implement or locate **each distinct game's rules and AI** separately; do not assume these are implemented by `cards.js`. |
| Billiards; pool; bagatelle; crokinole; darts; shuffleboard; quoits; bowling | `matter-js` is a possible generic 2D physics base. Rules, historically suitable equipment and NPC competition still need custom work. |
| Fox and Geese; Chinese dominoes/Pai Gow | No sufficiently licensed and verified ready-to-integrate JS rules library identified in this pass. Plan focused original engines or continue targeted research. |

### Engineering selection / build order (proposal only)

1. Build **one** lightweight, testable Washington fixture scheduler and receipts/standings/championship interface around *existing* canonical time, room access, NPC presence, shared-world truth and the Metropolitan Ledger. Consider whether `boardgame.io` would create needless duplicate state; **do not install it automatically**.
2. Prototype a small set of game rules without altering map or desk geometry: **chess**, **Western dominoes**, **checkers**, **backgammon**. Both NPC-vs-NPC autonomous play and player interaction must use the *same rules*.
3. Add **Xiangqi, Weiqi, four-person Mahjong, and Chinese dominoes/Pai Gow** as distinct games with accurate local access, language/club rules and historical research. Avoid implementing Mahjong solitaire under the Mahjong label.
4. Extend to card games, antique parlor games, outdoor/table sports and date-gated later inventions.
5. Press notices must derive from finished, durable match receipts. A club champion cannot be invented merely because a newspaper needs a headline. Test reload/idempotence, midnight crossings and switching playable characters.
6. Before adoption of **each** external repository: record the exact commit/license/dependencies and retain original author copyright/NOTICE. Keep approved Washington artwork and existing pin geometry unchanged.

**Status as of this document:** The search and license metadata review are completed. **No external repositories were cloned, installed or copied. No new minigames were built or accepted. No GitHub Actions or alternate branch created.**
