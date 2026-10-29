# Capital & Consequence v0.7.7 Beta | Capital Travel Wayfinding
**29 October 2026. Source checkpoint, not a player-accepted release.**

## Implemented
- Graph-calculated route descriptions now count significant turns along the full provisional guide-pixel itinerary. These are **approximate** and can include the path from a location entrance to its modeled street.
- Named modeled diagonal corridors are recognized when an itinerary actually uses an edge marked as Pennsylvania, Massachusetts or New York Avenue, instead of inventing a named avenue from the destination's location.
- The existing location-card ETA field shows approximate turns and an avenue used by the route, alongside guide pixels and the three travel-mode choices. No map artwork, existing pin positions, or approved geometry moved.
- The selected street route's immutable journey receipt now includes the turn count and an allowlisted list of named avenues, in addition to guide pixel length, entrance-link length, transport mode, provisional time charged and successful arrival.
- Changing a pin recalculates **future** avenue names, turns, travel time and movement; earlier receipts remain untouched.
- Only recognized avenue names can enter the ledger; invented or malformed street names are discarded.

## Regression
- `tests/capital-travel-wayfinding.cjs` exercises actual graph wayfinding, the visible route metadata, the saved travel ledger, filtering unrecognized avenue labels and historical receipt immutability when a pin moves.
- The existing street-network, animation, map pin, travel duration and interruption regressions remain in the source suite.

Focused JavaScript regression execution passed. Full offline Node suite and actual Electron gameplay have not been executed in this environment. **No GitHub Actions. No compiled executable or ZIP.**

## Still provisional
The 304-node first-pass graph is *not* an exact tracing of the printed Washington streets, and none of its named corridors has been calibrated to 1878 geographic miles. The fixed 1938 guide artwork, numbered pin registry, and character travel-clock and horse custody rules remain authoritative.
