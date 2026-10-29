# Capital & Consequence v0.7.15 Beta | Safer Street Entrances
**29 October 2026 · source development checkpoint, not an accepted release**

The **Capital Travel System** now checks both right-angle approaches when connecting a location pin to the modeled Washington street network. Previously the system chose a preferred L-shaped doorway-to-road path first and rejected a street if that bend crossed restricted ground. The alternate L-shaped approach was not considered, even if it avoided the obstruction. The street graph now selects a usable approach without changing any location pin or the original map image. If both possible approaches cross restricted ground, that candidate street entrance is excluded rather than allowing the moving game piece to walk through the landmark.

The route planner carries the approved approach through the door-to-door shortest-path result, so what is measured in guide pixels is what the figurine actually follows. The White House itself remains visitable; ordinary through-traffic may not cross the modeled exclusion. This only improves the **existing approximate road network** and does not assert complete building collision avoidance or historically surveyed street centerlines.

### Focused verification
- Tested all **1,560 ordered journeys** between the 40 approved registered pins: zero missing routes and zero forward/reverse guide-distance mismatches.
- Added `tests/capital-travel-entrance-obstacles.cjs`: 163 edited-pin approach cases avoid the approximate restricted grounds, while a destination pin *inside* the compound remains reachable.
- The existing animation, ledger, horse/carriage and map editing tests remain in the offline suite.

No GitHub Actions or workflow artifacts were used. No public release tag or compiled Ubuntu executable was created. The complete offline Node suite and actual Electron GUI playtest are still pending. All approved map artwork, numbered pins, profile pin placement semantics, in-game time accounting and new-game autosave are unchanged. Old saves need not migrate.
