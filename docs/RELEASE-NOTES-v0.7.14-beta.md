# Capital & Consequence v0.7.14 Beta | Turning Pawn and Safe Street Departures
**29 October 2026 · source checkpoint, not accepted final release**

## Turning game piece
The temporary walking/horse/carriage miniature now includes a **small copper direction wedge** that turns as it follows modeled street intersections and diagonal avenues. It measures direction in the original map's 2048×1159 pixel dimensions and remains accurate through map zoom and pan. The existing pawn symbol stays upright; only the indicator rotates. The wedge vanishes with the temporary travel overlay, leaving the original map and approved marker artwork completely unchanged.

## No missing-route teleport
Fixed a serious fallback in cross-city **Go There**: when the image or street graph is unavailable, the old logic could call a direct destination entry instead of showing the route and charging the authorized journey. The map now requires a populated, graph-backed provisional street itinerary before offering its preview or starting cross-city travel. If the road system cannot supply one, the trip is refused with a clear status message; no location change or travel-time debit occurs. Entering a room at the **same location** remains a separate, permitted behavior.

## Focused QA
- `tests/capital-travel-heading.cjs`: cardinal direction and turn-point headings, zoom-independent directions, temporary wedge removed on arrival.
- `tests/capital-travel-interruptions.cjs`: including an unavailable road among interrupted/mutated travel scenarios, verifies no false arrival.
- `tests/capital-travel-no-teleport.cjs`: requires consistent graph-backed route guard in preview, journey details and departure; forbids direct-entry fallback.
- Existing source tests for live pins, distance-paced animation, traveled route trail, calendar ledger and horse custody remain present.

All three tests passed in isolated JavaScript/source harnesses. Full local Node source suite and actual Ubuntu Electron gameplay still require verification. No GitHub Actions, SSH, agents, password prompts, installer or executable ZIP were used.

The Washington JPEG artwork, 40 original pin coordinates, approved UI geometry, in-game travel-minute charging and autosave rules are unchanged. Roads are still an **approximate** street graph, not a precisely traced set of building-free streets or verified real-world miles. Old-save compatibility is not required.
