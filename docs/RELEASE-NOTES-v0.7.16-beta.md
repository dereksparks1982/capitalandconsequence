# Capital & Consequence v0.7.16 Beta | Travel Time Comparison and Arrival Estimates
**29 October 2026 · source checkpoint, not an accepted public release**

## Built
- The existing Capital Travel location card now displays an inline comparison of **Walking**, **Horseback**, and **Carriage** game-time estimates for the current origin and selected destination pin. Methods without the necessary horse or carriage physically at the origin are labeled **unavailable**, not deceptively displayed as selectable.
- The selected transport method now shows an approximate completion time derived from the **saved Washington campaign calendar**, including a **next day** indicator when travel crosses midnight. The card never consults the computer's wall clock and does not charge game time when calculating an estimate.
- ETA calculation preserves the existing project's provisional guide-pixel travel minutes and continues to label real-world mileage unverified. Entering the room and other separately charged actions retain their own time costs; this clock is the projected end of the **journey**, not a promise of no further action time.
- No HTML geometry changes, permanent white dots or changes to the Washington artwork or 40 pin defaults.

## Validation
- `tests/capital-travel-arrival-estimates.cjs` covers morning and evening travel, midnight, 1878 and leap-year dates, invalid/malformed calendar data, bounded travel-time arguments, no save mutations, and the source bindings for saved-calendar ETA and actual asset availability.
- Focused JavaScript execution passed. Full offline Node source suite and real Ubuntu Electron playthrough remain unverified here.

The next road-accuracy milestone is manually tracing and validating actual street centerlines against the original guide, without replacing the guide or asserting exact building avoidance prematurely. **No GitHub Actions, password prompts, installer ZIP, or executable were created.** New-game autosave remains enabled; no legacy-save migration is required.
