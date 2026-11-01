# Big Top Performances, the Traveling Peddler and Contextual Readings
**Capital & Consequence · 1 November 2026 · v0.7.61-dev design/build notes**

## The Big Top and the midway are separate
- Buying a midway attempt (ring toss, darts, tin duck targets, cans, strongman bell or penny drop) **does not** mean the player watched the circus performance.
- The traveling circus is still a **public** event on the unchanged Washington map, visiting Capital Race Grounds on its existing May, July and September dates. This is fictional alternate-history scheduling, not a factual claim about the 1878 circus circuit.
- An actual Big Top ticket costs **20¢** from personal cash. Performances begin at **noon, 3:00 PM and 7:00 PM**, last **45 in-game minutes**, and use the game's own Washington clock for any waiting and watching. One performance cannot be recorded twice.
- At least two authored acts from the period-style show (high-wire performers, trick riding, strongman, clowns, ringmaster) appear in a saved narrative. These are simple text/events, not claimed 3D animations.
- Only completing the actual show updates `S.circusTour.attendance` and the distinct `S.circusPerformances` ledger. NPCs discussing whether a character attended the show use this actual receipt.
- The player must physically be inside the event's registered location; neither developer previews nor exhaustion collapses can produce a free attendance receipt.
- The existing circus marker and all fixed map geometry remain unchanged.

## Silas Pike: the traveling salesman
- A **different character** from the Romani fortune-teller. He currently has an inspectable stall during circus engagements, not a completed independent wagon itinerary.
- He stocks an ordinary tin soldier, cheap brass spyglass, reproduced patent sketch, a genuinely high-quality pocket loupe and a collectible railroad guide. Some stories are exaggerated or false. Players can examine the merchandise before purchase.
- **Examine** costs one Washington minute on the first examination of an item; re-examining the same item's saved evidence does not consume another minute. Buy costs one Washington minute. Prices use personal cash only, not the company ledger.
- A purchase must be placed in the existing physical personal-effects inventory and can be transferred to the existing home bedroom chest. Unique saved receipts prevent duplicate purchases of the same object during one engagement.
- Failed item acquisition refunds the attempted purchase and never records a fake sale. Items are physical collectibles; the loupe is well made, but **does not yet grant detective skill bonuses**. Future functionality must be implemented explicitly.
- Merely encountering the stall in person records acquaintance with him; the map does **not** disclose his next location, or even show his travel token until a genuine NPC journey exists.
- Inspecting is an honest investigation mechanic: the player may discover that the provenance claim is false without the salesman necessarily admitting his lie.

## The fortune-teller, and only game-world facts
- She continues to shuffle and **select all three cards herself**, using the existing original 78-card, offline deck.
- The interpretation reflects the playable person's occupation, finances, current Health and Energy, recorded collapses, witnessed investigations, recorded factory interruptions, public newspaper headlines and actual recent events. This is a **fictional reading of the game character's life**, never data from the real-world human playing.
- Reads only character-visible events, such as the saved player's notes or public headlines. It does **not** access NPC secret memories, a murder solution, unseen case outcomes or future RNG.
- Cards and interpretation are saved as a historical sitting; reading an old entry never changes after later events.
- Her permanent name, independent traveling wagon, roaming life, original Elderred Softworks card art and more nuanced in-person conversation remain in the roadmap. The currently playable reading is at her temporary show pitch.

## Engineering and acceptance
- New files: `circus-big-top.js`, `circus-big-top-ui.js`, `traveling-salesman.js`, `traveling-salesman-ui.js`.
- Integration: `app.js`, `index.html`, `styles.css`, `tarot-interpretation.js`.
- Focused test: `tests/circus-show-peddler.cjs`; separately the existing `tests/circus-carnival-chest-tarot.cjs` continues to cover physical prize provenance, the chest and character-only tarot sessions.
- Source implementation is a **development build**. Full Node tests, live NPC interactions, keyboard/UI visual review and a native Linux Electron executable **remain unverified**. No GitHub Actions, tag, distribution, or claiming release acceptance.
- No copied third-party sources or unlicensed visual assets. The consulted public GitHub mechanics and licensing cautions remain documented in `docs/CARNIVAL-TAROT-BEDROOM-CHEST-2026-11-01.md`.

## Work remaining
1. Add actual minigame moving targets and richer physical skill rather than only picking the five aiming positions.
2. Give Silas a persistent autonomous street route/wagon, discoverable in-person dialogue, bargaining and verified functional effects for rare goods.
3. Add a proper portable Big Top venue and show actors, ticket stubs/programmes as physical collectibles, and more acts.
4. Complete the fortune-teller's authored traveling route, actual card art and private reading room.
5. Run the full native Linux build and graphical QA before acceptance. Preserve the approved top banner, map, pins and crude room-art aesthetic.
