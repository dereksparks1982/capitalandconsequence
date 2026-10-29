# Capital & Consequence v0.7.12 Beta | Faster Street Path Search
**29 October 2026 · unaccepted source checkpoint, not a 1.0 release**

The Capital Travel System now uses a deterministic **binary-min-heap Dijkstra search** instead of scanning every unvisited intersection to find the next candidate. A bounded 48-tree cache is retained for repeated journeys and live pin repositioning. Equal-cost ties resolve consistently by road-graph node ID.

Focused route comparisons found **no changes in total guide-pixel distance** on 240 synthetic source/destination pairs, with a roughly **11% improvement** in a representative 195-route execution comparison. The complete **1,560 directed pair** check among all 40 registered locations passed again, with zero missing routes or reverse-distance mismatches. `tests/capital-street-heap.cjs` checks repeated-route determinism, stable named avenues and turn counts, symmetry and bounded caching.

**Scope and limitations:** This is a performance-only source change. The original fixed Washington JPEG, all 40 map pins, user-approved UI geometry, gameplay time charges, and horse/carriage custody are unchanged. The first-pass roadway model remains approximate, not surveyed. The complete local Node regression suite and Ubuntu Electron playthrough still need verification; the tests above were executed through isolated JavaScript source harnesses. **No GitHub Actions, no installer, no executable ZIP, and no annotated release tag**. New-game autosave remains required; old-save migration is not.
