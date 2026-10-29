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
