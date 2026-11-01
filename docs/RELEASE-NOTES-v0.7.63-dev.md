# v0.7.63-dev · Real Traveling Wagons & NPC Encounters
**Development-only source change · November 1, 2026**

## New simulation
- The traveling fortune-teller and Silas Pike have independent, saved **horse-drawn wagon** movements. Their whereabouts come from the existing circus calendar, street-network route planner, and Washington world minute. No extra realtime clock or teleport animation was added.
- Their arrival and departure are now part of the regular Washington NPC meeting system. A visitor actually at the Capital Race Grounds can appear in the normal same-room conversation card. While moving, they cannot be addressed or traded with from across the map.
- Their NPC icons are intentionally crude wagon silhouettes. An undiscovered individual has no marker; a known individual can be seen moving on the street, but not followed through a leaked future itinerary.
- The public circus tent stops displaying when the circus departs. The event record persists briefly only to let wagons travel out without changing the public opening hours.
- Special touring NPCs do not draw fake wages or attend unrelated weekly jobs. Their origin street points are **not** claimed homes.
- In-room acquaintance is recorded only if the person was actually at the location when the player visited, rather than based solely on a public circus date.

## Regression and release status
New `tests/touring-visitors-wagons.cjs` passed a focused JavaScript replay: date-bound visits, wagon routes from existing registered pins, calculated transit duration, no unknown traveler map icon, presence only after arrival, and leaving after the tent disappears.

Separately, the six failures in the user's last log came from a local **0.7.58** checkout. On more recent GitHub source, focused checks for map travel departures, interrupted travel, Go There, horse custody and character needs passed in isolated JavaScript. The package/version source contract is currently aligned. This is **not** proof of a fully passing offline 195+ test suite or a working Linux executable.

**Not delivered:** an approved Linux binary; a release tag; full graphical tests; original character/card art; actual wagon interiors; new crime mechanics. These remain open. No GitHub Actions or downloads are used.

See `docs/TOURING-WAGONS-NPC-ROUTES-v0.7.63.md` for model assumptions and remaining work.
