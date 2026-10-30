# Tabletop, Parlor & Social Games: Living Washington Design Register

**Capital & Consequence | Design specification | 29 October 2026 | Chess prototype source integrated; other games planned**

## Governing rule

Washington's games, tournaments, champions, defeats, rivalries and friendships exist **whether or not the player attends**. All competition takes place in the same saved Washington timeline as work, travel, relationships and the newspaper. Leaving a room, switching protagonists, or ignoring a sport cannot suspend its society. Closing the application **does** freeze the simulation; there is no offline progression.

Games are discovered **at actual venues**, according to period, local culture, available equipment, scheduled players, permission to enter, and opening hours. There is no universal games button, no simultaneous presence in two rooms, and no magic remote opponent. A historic champion mentioned in the paper must have won a genuine simulated match.

**Scope:** 28 distinct games identified and approved in design discussion, including Western dominoes, Chinese dominoes/Pai Gow, and Mahjong. Existing poker, horse/dog racing, boxing and fishing remain separate systems but should eventually share the same competition ledger and newspaper reporting contract. **Current source status:** Chess is the first game integrated with a licensed rules engine and top-down player-versus-present-NPC room UI, plus initial NPC-only fixtures and news. The other 27 games remain design-only. Chess league titles, NPC preferences, advanced skill and polished portrait artwork are still future work.

## Complete game register (28)

| # | Stable proposed ID | Game | Category | Suggested initial discovery locations | Period/availability handling |
|---|---|---|---|---|---|
| 1 | chess | Chess | Board | University, social clubs, homes, reading rooms | Present from 1878 |
| 2 | checkers | Checkers / draughts | Board | Hillsdale, parks, taverns, homes | Present from 1878 |
| 3 | backgammon | Backgammon | Board | Clubs, homes, taverns | Present from 1878 |
| 4 | chinese-checkers | Chinese checkers | Board | Later commercial game parlors, homes | **Not present under this name in 1878**; German Stern-Halma predecessor appears in the 1890s, later US marketing/name requires a separate date gate |
| 5 | dominoes | Western dominoes | Tile | Hillsdale, taverns, clubs, homes | Present from 1878; rules variants by venue |
| 6 | nine-mens-morris | Nine Men's Morris | Board | Homes, older taverns, traditional parlors | Period appropriate; verify local adoption |
| 7 | fox-and-geese | Fox and Geese | Board | Homes and community parlors | Period appropriate; verify local adoption |
| 8 | go | Go / Weiqi | Board | Chinatown; later intercultural clubs or private collections | Historically established abroad; **local DC presence depends on character/equipment evidence** |
| 9 | xiangqi | Xiangqi / Chinese chess | Board | Chinatown, Chinese households | Historically established abroad; local access via scheduled residents |
| 10 | mahjong | Mahjong | Tile | Chinatown, Chinese households, private invitations | Nineteenth-century Chinese game; **no automatic assumption of 1878 US-wide popularity**; research precise DC availability and variant |
| 11 | mancala | Mancala family | Board | Homes, social gatherings through documented communities | Specify actual rules variant (e.g. Oware) before implementation; do not treat all mancala as one universal ruleset |
| 12 | pachisi | Pachisi | Board | Private homes, imported-game collections | Established game; local access dependent on imported boards and contacts |
| 13 | crokinole | Crokinole | Dexterity board | Homes and parlors | Late-nineteenth-century Canadian origin; verify early DC adoption before default 1878 placement |
| 14 | reversi | Reversi | Board | Game parlors, homes, clubs | **Later introduction, 1880s**; gate by date |
| 15 | pai-gow-dominoes | Chinese dominoes / Pai Gow | Tile | Chinatown, private Chinese gaming circles | Distinct from Western dominoes; Pai Gow is one game using Chinese domino tiles; gambling separately governed |
| 16 | whist | Whist | Cards | Gentlemen's clubs, parlors, home gatherings | Present from 1878 |
| 17 | euchre | Euchre | Cards | Taverns, boarding houses, homes | Present from 1878 |
| 18 | pinochle | Pinochle | Cards | Taverns, family groups, clubs | Nineteenth-century family; verify variant by date and community |
| 19 | hearts | Hearts | Cards | Homes, lodgings, clubs | Period variant required |
| 20 | cribbage | Cribbage | Cards/board | Taverns, homes, clubs | Present from 1878; **one game**, not duplicated in board and card catalogs |
| 21 | ecarte | Écarté | Cards | Social clubs, salons, private parlors | Period appropriate |
| 22 | billiards | Billiards (carom and specified variants) | Table sport | Billiard halls, gentlemen's clubs | Specify table and rules; not identical to pool |
| 23 | pool | Pocket billiards / pool | Table sport | Billiard halls, taverns | Specify period rules; do not import modern eight-ball wholesale |
| 24 | bagatelle | Bagatelle | Table sport | Taverns, parlors, billiard rooms | Present from 1878 |
| 25 | darts | Darts / period throwing games | Skill sport | Taverns, club rooms | Avoid modern standard board or scoring unless period documented |
| 26 | shuffleboard | Shuffleboard | Table/deck sport | Social clubs, recreation rooms | Use actual venue equipment and variant |
| 27 | quoits | Quoits | Outdoor skill sport | Parks, tavern yards, recreation grounds | Weather and ground accessibility matter |
| 28 | bowling | Bowling / tenpins | Alley sport | Bowling alleys, clubs | Actual alley and nineteenth-century rules required |

**Game names are not ethnic restrictions.** The tables indicate plausible *starting venues*, not where a person's ancestry permits them to play. NPC tastes, contacts, access, moving equipment and venues can spread any appropriate game between communities. Conversely, equipment and venues must exist before a game can be offered.

## Venue-based discoverability and access

- **Chinatown (existing location ID `oldChinatown`):** Xiangqi, Weiqi, Mahjong, Chinese dominoes/Pai Gow; Western dominoes or other games only when the actual host and equipment support them. Mahjong should not be portrayed as already ubiquitous in 1878 Washington.
- **Hillsdale / Barry Farm (`hillsdale`):** Western dominoes, checkers, cards, chess and perhaps quoits at appropriate homes/rooms. Create actual recurring players and locations, not generic background crowds.
- **Taverns, boarding houses and working-class gatherings:** Cribbage, dominoes, euchre, checkers, darts, bagatelle, some billiards/pool where tables exist.
- **Gentlemen's and invitation clubs, including existing `commercePoker` and `embassyPoker` if their room inventories permit:** Chess, backgammon, whist, Écarté, billiards, table games. Existing poker invitations **do not automatically** confer entry to unrelated private rooms.
- **University and intellectual circles:** Chess, other studied/imported games only when host and board are established.
- **Homes and social parlors:** Chess, checkers, dominoes, Fox and Geese, Nine Men's Morris, Pachisi, Crokinole, backgammon and card games, varying by household.
- **Purpose-equipped facilities:** Bowling requires an alley; pool/billiards require a suitable table; shuffleboard requires a court/table/deck; quoits require a suitable outdoor area.
- **Existing `star` Star Club:** no poker, per standing project rule. Other non-poker parlor games are not enabled unless explicitly suitable to that room and approved.

The city registry and original printed Washington map **must not be changed** to insert game locations. First use rooms in existing pins and verified venue access. Any additional pin or UI geometry needs separate approval.

## One-world simulation and recorded outcomes

1. **Discovery:** A game offering is visible only if the venue is open, the player may enter, correct equipment is present, and the local game/session is scheduled. Known but unavailable options show the cause.
2. **Schedules:** Named NPCs and believable local regulars have calendars, home venues, attendance reliability, social networks, skill per game, available money, health/fatigue and willingness to play. Match acceptance is social, not automatic.
3. **Booking:** A match binds participants, room, date/time, rules variant, format, stakes if lawful, and unique match ID. No participant can be booked into simultaneous incompatible appointments.
4. **Resolution:** At actual saved match time, evaluate attendance and world conditions, then run deterministic rule-driven competition. Record forfeit, postponement or cancellation rather than invent a match when conditions fail. The player can participate or observe locally, but does not have to be present for NPC-vs-NPC games.
5. **Skill and conduct:** Player and NPC skill changes arise from played sessions; styles, past opponents, rumors, dishonesty and rivalries affect future invitations. A cheater being caught needs an observed/evidenced event; not an arbitrary scripted accusation.
6. **Leagues:** Each game/variant/venue may organize weekly matches, seasonal events, citywide tournaments, doubles or team contests as appropriate. Championships have eligibility rules, fixtures, actual results and historical title succession.
7. **Persistence:** Immutable match receipts are keyed by world/circuit/match ID and saved once. Standings, records, skill changes, wagers, rewards, grudges, and newspaper notices derive from those receipts without duplicate payouts or reroll on reload.
8. **Personal knowledge:** The world knows the true result; a character only knows what they personally saw, was told, or read. Player notebook, contacts and character-private history must not reveal unobserved outcomes.
9. **Press:** The Metropolitan Ledger publishes selected significant, **already resolved** matches, new champions, rivalries and tournament announcements; local neighborhood commentary and word of mouth can spread faster or differently. Unpublished contests stay out of public headlines.
10. **Time:** All actions consume authoritative Washington clock time. Resolving pending fixtures while the player works elsewhere must not require opening a game panel. There is **no progress while the app is closed**.

### Proposed durable record contracts (partially coded for chess)

- `GameDefinition`: id, name, origin, rulesVariant, availableFromDate, equipment, capacity, turnPolicy, venueEligibility, legalWagerPolicy.
- `VenueGameOffering`: locationId, roomId, gameId, variantId, equipmentId, accessRule, timeWindow, hostNPCId.
- `NPCGameProfile`: npcId, preferences, skillByVariant, style, socialHistory, competingAppointments.
- `Match`: worldId, matchId, gameId, variantId, circuitId, venue, playerIds, scheduledAt, startedAt, endedAt, outcome, seed, validatedEvidence, status.
- `CompetitionCircuit`: id, gameVariant, venueScope, rules, membership, fixtures, ratingTable, titleHistory, recordBook.
- `PressDispatch`: sourceMatchIds, significance, publicationDate, visibility, verified text; no information the public could not plausibly have learned.
- `CharacterObservation`: profileId, observedMatchIds, source, certainty, recordedAt; separate from world truth.

### Core integrity tests to write before gameplay integration

- NPC-vs-NPC fixture settles while the current character is working in another room.
- A match cannot start with absent players, unavailable equipment or a closed venue; forfeits and cancellations are logged honestly.
- One world match creates one receipt, one rating update and at most one championship change despite reload and calendar replay.
- Switching playable characters does not recreate the same fixture or reveal another character's private notes.
- Newspaper dispatches cite a genuine finished match, never a seeded fictitious result.
- Future-dated games are unavailable in 1878; venue, imported rules and historical names are date-gated separately.
- No poker at Star Club; restricted rooms and gambling-law rules stay enforced.
- Existing map artwork, pin placements and approved layout remain identical.
- Snapshot save/restore preserves fixtures, standings, champion succession and historical records.

## Engineering direction

Reuse the existing saved Washington clock, location/room access, NPC schedules, social/memory, shared-world event and press systems. Prefer a **single scheduling/results/competition framework** with modular **per-game rules engines**; hard games such as chess, Go, Mahjong, Xiangqi and backgammon require genuine legal moves and competent opposition, not outcome-only random buttons. Inspect library compatibility, licenses, dates and dependencies *before* bringing third-party code into this proprietary game.

**Research and adoption:** The [candidate engine survey](OPEN-SOURCE-GAME-ENGINE-CANDIDATES.md) records candidate engines, sources, license evidence, complexity and gaps. **Only chess.js v0.10.3 is currently adopted; research listings do not imply other dependencies are installed.**
