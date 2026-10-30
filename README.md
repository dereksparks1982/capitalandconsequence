# Capital & Consequence

**One city. Countless lives. Every choice has consequences.**

*Capital & Consequence* is a single-player, alternate-history life simulation set in Washington, D.C., beginning in **1878**. Build a life in a changing city where your work, money, relationships, reputation, and decisions can affect what happens next.

Choose from different lives, including a businessman building **Federal Electric**, a police patrolman, a criminal-world doorman, and an asylum worker. Each character experiences Washington from a different perspective.

Explore the city on its illustrated Washington map, travel on foot, horseback, or by carriage, visit businesses and social clubs, meet residents, work, trade, invest, gamble, play poker, and pursue opportunities or trouble. Time passes, people follow schedules, and your actions can have lasting consequences. The game takes place in a fictional United States with its own political and social history.

**Development status:** Beta, **v0.7.29-dev** on `main`, not yet an accepted Linux gameplay build. The board, public stock and corporate control systems remain in development alongside Washington's shared casework. **Chess is the first playable tabletop system integrated into the source**: licensed BSD-2-Clause [chess.js v0.10.3](vendor/chessjs/SOURCE.md) move legality, a new overhead Victorian table with original generic silhouette portraits, local challenges to NPCs physically present in eligible rooms, real move-by-move play against deterministic basic AI, autosaved match records, offscreen scheduled NPC-versus-NPC fixtures when two residents share an actual room, and completed-game newspaper reporting. The other **27 planned games remain documented, not implemented**. The complete Node source suite and Linux Electron UI verification remain outstanding. See [game/competition design](docs/TABLETOP-PARLOR-GAMES-AND-LIVING-CIRCUITS.md), [engine survey](docs/OPEN-SOURCE-GAME-ENGINE-CANDIDATES.md) and [attribution](THIRD-PARTY-NOTICES.md).

**Factory v0.7.28-dev:** Cash and accounts are limited to Federal Electric's Executive Office or the District Bank Banking Hall, not Sullivan's rented room or any other factory space. The cash ledger enforces the actual saved room. A new staff break room can be entered through existing factory room navigation or a Coffee Break button; time and personal cash are spent on refreshments. The Washington map artwork and pin positions are unchanged. Full Ubuntu Electron gameplay validation is still outstanding.

**Washington map directory (v0.7.29-dev):** The existing pin color guide now lives inside Washington Location Directory, immediately below its heading and above the location buttons. Closing the directory also collapses the guide, freeing map viewing space without changing the approved map artwork, pin coordinates, colors or controls. Full Ubuntu Electron graphical validation is still pending.

## Legal: All Rights Reserved

**Copyright © 2026 Derek Sparks. All rights reserved. Published by Elderred Softworks LLC.**

**This is a proprietary project, not open-source software.** No permission is granted to use, copy, modify, redistribute, republish, sell, incorporate into another project, or create derivative works from the project's original source code, artwork, game systems, writing, characters, or other original materials without the copyright holder's **prior express written permission**, except as required by applicable law or GitHub's governing terms.

Public visibility on GitHub does **not** grant a license to reuse this project's original proprietary materials. Official unmodified game builds, if intentionally released for public play, may be played personally and noncommercially under the limited terms in [LICENSE](LICENSE).

**Third-party credit and ownership:** We do **not** claim ownership of external libraries, game engines, artwork, recordings, fonts or other third-party works merely because they are included here. Every adopted component remains subject to **its own license**, which may vary by project, including whatever independent rights that license grants. We preserve required notices and attribution. Merely researching a repository does **not** mean its code has been included.

See [LICENSE](LICENSE), [LEGAL.md](LEGAL.md) and [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) for ownership, currently bundled credits, license locations and release-review requirements.
