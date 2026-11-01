# Washington Discoveries, Traveling Circus & Fortune-Teller
**1 November 2026 · v0.7.59 development · further content subject to gameplay acceptance**

## Player knowledge: not omniscient
A person is NOT displayed on the Washington map merely because an AI schedule exists.
- Earn knowledge through a real same-room encounter, an identifying name printed in an issue the player actually reads, or a name learned from a conversation.
- All four playable characters follow the same rule when playing the other three as autonomous residents. Named special characters also require discovery.
- Only discovered NPCs who are actually *en route* appear as slowly changing, deliberately crude street icons. Their displayed position is based on the real saved journey and one authoritative clock.
- A traveling NPC is not available for speech, trade or quests until physically present in a valid room. Clicking a traveler must **never** disclose their destination or future itinerary, even if introduced. The NPC may choose to disclose, conceal or lie about it only during in-person conversation.
- The map does not expose every anonymous pedestrian or NPC's private motivations. Existing visit permissions apply.
- The circus is a **public exception**. When an actual dated traveling-circus engagement is in town, a tent icon appears to every player automatically; it disappears when the troupe leaves. Public word of mouth, printed advertising and posters make that credible.
- NPCs can ask about plans to see the circus, react if the player's own visit was recorded, and have ordinary opinions. They do not obtain proof of attendance magically. Actual admission, ticket prices, event schedules and acts must be built later and not fabricated.

## Traveling fortune-teller
Proposed special character: a distinct roaming Romani woman (user calls her the Gypsy) traveling with a horse-drawn wagon. She needs an independently authored name, schedule, companions, possessions, rights of access, living habits and real owned wagon; ethnic identity does not decide what a generic NPC marker looks like. A wagon icon belongs to the genuine vehicle, not every itinerant.
- She offers tarot readings from an original art deck produced by Elderred Softworks LLC. Do not ship borrowed visual assets, copy tarot app UI, or require a network API.
- `tarot-deck.js` includes an art-independent traditional **78-card inventory** (22 Major and 56 Minor), keyed so original art is a drop-in asset, plus three-card, single-card and decision/crossroads spread definitions.
- Cards are shuffled once per real sitting, recorded with upright/reversed orientation, charged no more than once, and saved on the player's own profile. No magical access to unsolved murder truths or future event rolls. In-world interpretations may draw subtly on what she actually knows, her voice, trust and the player's circumstances.
- Her stall and tarot interaction remain **future world/room and menu UI**, not claim to be playable merely because deck math exists.
- Useful **reference projects**, evaluated rather than bundled:
  - [Tarot.js2 (MIT)](https://github.com/MarketingPip/Tarot.js2) provides JavaScript deck/spread/reading architecture.
  - [Tarot Card Data (CC0)](https://github.com/smallcat419/tarot-card-data) provides 78 card names and meanings, convenient as offline data after license/source verification.
  - [Touchy Tarot (MIT)](https://github.com/rbrutherford3/Tarot) offers a drag-to-shuffle interaction worth inspecting but not necessarily reusing.
- User's original tarot art will supersede any sample/reference imagery. Rider–Waite–Smith art dates after the game's 1870s start; alternate-history divergence is allowed but the art should be original.

## Traveling salesman / confidence man
A separate discoverable traveler; not the same person as the fortune-teller.
- Small set of genuinely rare, purchasable, origin-tracked goods mixed with everyday items and dubious claims. A rumor of rarity is not proof of rarity.
- Players question the peddler, inspect provenance, negotiate, perhaps uncover lies via observation or investigation, and only acquire goods through actual saved inventory and money receipts.
- His inventory, routes and temperament vary through authored in-world supply events, not endless random loot or fabricated money.
- No dialogue or false sales system may be described as implemented before real in-person buying works.

## Current code status
- `npc-discovery.js`: per-profile earned acquaintance ledger.
- `npc-ai.js`: real meetings and read named conversation text can reveal identities; documented circus conversation starter for a public event.
- `app.js`: identifying names in purchased/read newspaper copy are recorded; ordinary map destination remains privileged to player choice, not NPC spying.
- `npc-street-travel.js`: only known NPCs are displayed; no outgoing destination is revealed. Existing street routes and map art unchanged.
- `circus-tour.js`: holds public dates and place, attendance records, and tent token only for **active scheduled engagement**. It is NOT scheduled by default because the event date and authorized campsite have not been chosen.
- `tarot-deck.js`: fully offline original 78-card data structure with deterministic saved readings. It does NOT yet include the fortune-teller's encounter room or artwork.
- `tests/tarot-circus-discovery.cjs` adds game-state checks. Full native Linux runtime testing and player acceptance remain outstanding.
- `docs/MOVING-NPCS-MAP-INTERACTION-2026-11-01.md` was superseded in part: it previously described a Show Destination button, which was REMOVED as omniscient.
No GitHub Actions, binary release, new fixed map artwork or accepted UI geometry changes.
