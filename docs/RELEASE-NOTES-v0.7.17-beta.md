# Capital & Consequence v0.7.17 Beta | Live Journey Time Remaining
**29 October 2026 · source checkpoint, not an accepted public release**

## Implemented
- During the animated **Capital Travel System** journey, the map's existing temporary travel status now shows estimated **remaining in-game journey minutes** alongside its quarter-journey progress (0%, 25%, 50%, 75%, 100%).
- The countdown is derived from the already approved provisional **guide-pixel trip length** and the selected walking/horseback/carriage minutes. It is a **visual estimate** only. The authoritative game clock is debited once, on a successfully completed and recorded arrival, never while the figurine animates.
- A bounded pure `remainingMinutes(totalMinutes, progress)` function handles zero, end-of-trip, canceled/restarted, malformed and out-of-range values. UI announcements remain limited to progress milestones rather than flooding accessibility status every frame.
- The previously implemented map-card journey ETA and transport comparison remain available.

## Validation
`tests/capital-travel-remaining-time.cjs` checks monotonic progress, 0–100% endpoints, invalid data, no mutation of the saved world calendar, and the real map's binding to single-arrival time accounting. Focused JavaScript regression passed. Full local Node and Ubuntu Electron playthrough remain pending.

No map artwork, numbered pin defaults, approved UI geometry, or street-network settings changed in this checkpoint. The roads remain provisional, not pixel-perfect validated against every 1878 building. No GitHub Actions, installer ZIP, password prompts or executable build were used.

## Additional v0.7.17 gameplay slice: illustrated figurines and poker silhouettes
- The three temporary Capital Travel chess-symbol placeholders are replaced by locally drawn SVG miniatures for **walking**, **horseback**, and **carriage**. The existing direction wedge still turns with the road while the figure stays upright.
- All miniatures are generated at runtime, with no new images, fonts, permanent map decorations, or changes to approved artwork and pin geometry. Finished and canceled journeys clean up their figures.
- The established **top-down poker table** now displays sepia silhouette portraits in its existing four seats. Individual character portraits can replace these later without rebuilding the underlying game.
- Private hole cards stay hidden from the player until a contested showdown. Folded opponents' cards never reveal, including after all opponents fold to the winner.
- Concealed poker cards no longer retain a suit-color CSS class, reducing unintended suit information in rendered markup.
- The private poker window is labeled **Capital & Consequence**, with fresh style and engine cache keys. Underlying Texas Hold'em rules, wagers, time accounting and table etiquette were not changed.
- `tests/capital-travel-figurines.cjs` and `tests/poker-silhouette-secrecy.cjs` passed focused isolated JavaScript checks. Full local Node and Electron QA remain pending.

**README:** No development log was added to the short README. The game's proprietary license and legal notices remain as published.
