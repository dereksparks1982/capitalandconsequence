# Capital & Consequence v0.7.85-dev | Merchant Ship Sailing Chart

**November 2, 2026. Source-only development, not an accepted Linux release.**

## Owner request and exact scope
The owner uploaded `assets/artwork/maps/SHIPPING-LINES-ECOCLIPPER-small.jpg` and requested that the separately owned merchant ships appear as moving ship icons, following its sea lanes as the in-game calendar advances over realistic-length voyages.

The uploaded chart is a **separate maritime viewer** inside Charles's existing Industrial Holdings & Merchant Fleet sheet. The Washington map, fixed map pins, approved desk geometry, 1878 streetlighting contract, World's Fair chronology, individual character arcs, ordinary character travel, and fishing boats remain untouched.

## Implemented in this development slice
- `merchant-navigation.js`: Traced the supplied chart's principal maritime corridors in **native 800×600 image coordinates**. Initial connected legs link Baltimore, Philadelphia, New York, Liverpool, Hamburg, Havana, Singapore and Hong Kong; intermediate route nodes do **not** grant unearned verified trading rights or imply a port call.
- Schedules are estimated from **approximate nautical mileage and effective passage speeds**, rather than arbitrary indexed differences between port names. Schooner model: 6 knots × 75% underway efficiency; steamer: 12 knots × 85%. Times are plausible estimates, **not sourced year-specific port-to-port averages**. The image and its shipping lines are a modern reference and cannot by themselves prove an exact historical voyage path.
- New trips store an immutable-by-convention copy of their route points, distance, and departure game minute in the existing saved voyage record. The existing daily crew costs, optional insurance, storm/piracy risks, real cargo transfers, corporate treasury separation, harbor access checks, sea-loss receipts, and once-only freight settlement are preserved.
- `merchant-chart.js`, `merchant-chart.css`: Preserve the original image pixels and add an SVG view layer showing only owned active ships as selectable, recognizable schooner/steamship icons, highlighted current voyage, progress percentage, cargo, dates, hull condition, destination and distance. Native select is an accessible alternative to selecting a map icon. The panel can collapse without losing ship state.
- The tracked positions derive **only from the saved Washington clock** (or date-only fallback for older voyages), not wall-clock time, browser background timers, map-open duration, or fake revenue. Loading a saved game re-derives the location from the existing record.
- Added an offline source regression for all reachable port pairs, route endpoints, plausible vessel-speed ordering, source image presence, ship dispatch, intermediate saved position, game-date arrival, and duplicate settlement.

## Important limitations and next steps
- The traced pixel corridors are a **first-pass visual fit** to the user's supplied EcoClipper chart, **not a fully surveyed or licensed historical 1878 maritime network**. Route lines are not extracted automatically from the JPEG. Calibrate/verify them on the original asset before claiming exact historic lane fidelity.
- The route-duration estimate currently does not individually calculate seasonal winds, currents, storms, canal restrictions, periodic scheduled departures, port layovers, or vessel-specific crews. Existing weather danger applies to arrival/outcomes, not navigation speed. Those are separate future stages.
- The chart is read-only. It does not create cargo, purchase ships, dispatch vessels, or reveal unverified ports. Ship transactions remain in the original merchant controls.
- Rights/source terms for the uploaded EcoClipper chart have **not been confirmed**. Before distributing a public game containing that image, record the original source and license/permissions in the attribution register.
- Focused in-tool V8 source execution checked source syntax, all port-to-port routes, a Baltimore→Liverpool schooner voyage and expense/arrival accounting; one dedicated offline Node regression is committed but **not executed in Ubuntu Node**. Full Node QA, rendered Electron chart inspection, Linux build and owner acceptance remain outstanding. No GitHub Actions, no installer, no annotated release tag.
