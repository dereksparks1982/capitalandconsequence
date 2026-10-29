# Capital & Consequence v0.7.22 Beta | Residents Travel Washington's Streets
**29 October 2026 · Source checkpoint, not a compiled public release**

Washington's already-established NPC routines now have route-based movement:

- When an existing NPC's saved work or social schedule causes a genuine journey, the city computes a **provisional street route** between the resident's recorded departure and destination. The same current map pin anchors used by the player determine this route.
- Instead of every NPC journey requiring a fixed 30 game minutes, the resident travels for its calculated walking time, including the saved Washington weather adjustment. A genuine departure produces one in-transit record, and arrival is registered only once, after enough world-calendar minutes have elapsed. If street data are unavailable, the older 30-minute fallback remains.
- The saved NPC journey contains a bounded temporary street path, departure and arrival minute, guide-pixel distance and weather. Completed journeys preserve the duration and destination without duplicating jobs or market receipts.
- While the illustrated Washington map is open, small dark/copper **in-transit resident figurines** can appear at the progress their saved world-clock journeys actually reached. Zoom/pan reprojects them. They disappear after arrival or when the map closes, leaving no extra white dots or permanent decorations.
- Public NPC schedules are not attendance guarantees. The new system creates no fictional trips, private meetings, arrests, hidden motives or free purchases. The established NPC economy, social, language and access restrictions remain authoritative.
- Offscreen time does not advance merely because the game is closed. Player-controlled time continues to drive the city.

**Focused regression results:** `tests/npc-street-travel.cjs`, `tests/npc-street-journey-bridge.cjs`, `tests/npc-street-integration.cjs`, and the existing `tests/npc-travel-state.cjs` and `tests/npc-cross-period-arrival.cjs` passed in isolated JavaScript tests.

**Accuracy limits:** Modeled Washington street routes remain provisional and not pixel-perfect tracings of every historic road. Neither the original JPEG nor any of the 40 approved map pin defaults was modified. The README and legal license were unchanged. Full Ubuntu Electron playtesting and the complete offline Node suite remain outstanding. No GitHub Actions or executable ZIP.
