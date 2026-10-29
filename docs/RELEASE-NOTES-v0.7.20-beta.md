# Capital & Consequence v0.7.20 Beta | Weather-Aware Washington Travel
**29 October 2026 · Beta source checkpoint; not a compiled release**

Capital Travel now uses the saved Washington weather when showing and charging provisional road journey times.

- Clear weather retains the existing travel durations. Rain, storms, snow, ice, and fog apply distinct gameplay slowdowns to walking, horseback, and carriage travel.
- The three transport options show their updated game-minute estimates before departure, and arrival predictions use those same minutes.
- If the saved weather changes during the animation, the departure is canceled for a fresh estimate rather than silently charging a stale amount.
- A paid completed journey stores the weather class and additional provisional minutes with its immutable route receipt. Same-site room changes remain a separate one-minute action.
- **No** surveyed miles, historical speed claims, new roads, new weather assets, or permanent map overlays. The original Washington artwork and 40 marker defaults remain untouched.

Focused checks in `tests/capital-travel-weather.cjs` passed: the exact weather-adjusted preview minutes were charged once, the original route pixels were preserved, duplicate trip IDs were refused, and weather receipts remained immutable. Full Node/Electron integration QA still needs the user's Ubuntu checkout.

README remains the short game overview plus proprietary rights notice; release details are here. No GitHub Actions, SSH, password agents, compiled executable, or ZIP were used.
