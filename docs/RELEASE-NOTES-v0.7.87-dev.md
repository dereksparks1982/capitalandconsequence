# Capital & Consequence v0.7.87-dev · Walkable Port Surveys & Voyage Preflight

**November 2, 2026 · development source only; not an owner-accepted Ubuntu/Electron release.**

## Scope approved by current shipping-map request
Extend Charles's original-image EcoClipper maritime map with usable small harbour layouts and stronger business routing while respecting the fixed Washington city map, existing office desk objects and independent saved world clock.

### New walkable small harbour previews
- `merchant-harbor-walk.js`: six generic 12×9 tile-sector floorplans for quay, warehouse, customs, market, sailors' lodging and harbour street. Obstacles include shallow/blocked water, walls, crates, counters, beds and stalls, depicted in intentionally simple generic tile art. A **survey cursor** can move one tile with WASD, arrow keys or adjacent click; impassable squares and out-of-bounds travel are rejected.
- `merchant-harbor-ui.js` and `merchant-harbor-ui.css`: open from the existing full shipping map's known port or an owner-defined harbour-candidate pin, show a separate responsive planning overlay with accessible section buttons, keyboard controls, focus, cursor position and a close button. Original map artwork is unchanged and remains under the overlay.
- Survey position persists separately **for each port or harbour candidate and each of its six sections**, in `merchantMap.harborSurveys`. Switching to a different section no longer unexpectedly resets movement to the quay. No new Washington pin, story event or fabricated historical proprietor was introduced.
- The **survey cursor is NOT Charles** and is not a booked journey, a real harbour visit or character travel. Overseas physical presence will require boarding, a recorded clock-advanced voyage, arrival, a safe return route and integration with existing location/NPC systems. Current port-sector inspection remains read-only except for the harmless survey position.

### Maritime route quote before actual dispatch
- `merchant-route-quote.js`: calculates a read-only quotation for a real owned, berthed vessel, verified commercial destination and selected existing cargo. Quotes show route legs, approximate nautical miles, schooner/steamer-specific expected days, proposed arrival date, departure/insurance fees, cash needed in **the real separate fleet treasury** and available Federal Electric component inventory where applicable.
- Quotes explicitly **do not** withdraw funds, load goods, move ships or create receipts. If requested, actual departure still uses the canonical `FE_EMPIRE.dispatch`, with its established authorization, funding, component inventory, insurance and risk rules.
- `merchant-world-map.js` overlays the proposed route as a visually distinct dashed line, and adds a Voyage Preview before Dispatch plus manifest/cost/ETA details on the ship card. Failed quotes show the existing restriction rather than silently opening unknown ports.

### Verification and release boundaries
- Added `tests/merchant-harbor-walk.cjs` and `tests/merchant-route-quote.cjs` for lane authorization, sector collision, saved survey-state separation, original desk asset, cargo requirements, insured charges, dry-run immutability and real dispatch consistency.
- In-tool targeted JavaScript execution ultimately checked **118 focused conditions with zero failures**, including all 48 known port/sector combinations, their rendered markup, per-zone persistence, route proposal immutability, actual freight/cargo authorization and original artwork/script ordering. A final source fix also clears stale quote visuals when the player edits voyage selections. Full Ubuntu Node suite and native Electron chart gameplay remain unverified.
- No GitHub Actions, no tagging, no executable or local patch delivery. Full Node regression suite, graphical Ubuntu Electron verification, real physical overseas character travel and the image's redistribution license remain **pending**.

The current game-clock's daily report gate must not be bypassed by a fictitious 30-day instant travel action. Complete in-world passenger journeys must pass through the existing clock, survival, finances, world events and room/location permissions in a later approved integration.
