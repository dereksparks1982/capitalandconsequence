# Capital & Consequence v0.7.13 Beta | Distance-Paced Overworld Animation
**29 October 2026 · source checkpoint, not a release or executable package**

The Capital Travel System's on-map walking/horseback/carriage tokens now take **more or less real-world screen time based on the length of the route in original guide pixels**. This changes only what the player sees while watching the little game piece move; all charged in-game travel minutes still come solely from the existing saved journey ledger.

For example, a 200-guide-pixel journey animates for approximately **1.72 seconds walking, 1.17 seconds horseback or 1.41 seconds by carriage**. A route near 800 guide pixels takes approximately 3.88/2.64/3.18 seconds. Durations remain bounded at eight seconds for walking, and riding and carriage retain proportionally shorter maximum durations. The player's accessibility preference for reduced motion continues to shorten the animation to roughly 180 ms. Explicit animation duration overrides remain available for tests and future deliberate story scenes.

**Verification:** Added `tests/capital-travel-animation-speed.cjs` exercising monotonic screen-time versus distance, transport speed ordering, bounds, actual animation completion, and preservation of unverified miles. Focused JavaScript regression passed in an isolated runtime; full local Node tests and a real Ubuntu Electron playthrough are still pending. No GitHub Actions, hosted artifacts, SSH, password prompts, installer or executable ZIP were used.

The original Washington map, every numbered pin default, approved UI geometry and source-only Beta status remain untouched. The road graph remains a first-pass illustration-based approximation; this screen pacing does not assert real-world journey time or historical street length. Autosave for new games remains a requirement; legacy save migrations are not.
