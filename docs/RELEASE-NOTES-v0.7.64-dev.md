# v0.7.64-dev · Rail Painter, Stations and Physical Location Icons
**Development-only source snapshot · 1 November 2026**

The approved Washington map artwork and existing numbered-pin coordinates are unchanged.

### New
- **Rail Editor** beside Road Editor and Edit Pins. Paint saved rail track segments and bend points directly over the map; establish named stations at actual track endpoints; undo or erase chosen track/station sections without deleting the original city streets.
- **Connected rail routing**: a demonstration locomotive can be dispatched between two connected stations. Its little top-down marker moves slowly along saved tracks based only on Washington's actual world-minute clock. Unconnected station pairs cannot be dispatched.
- **Physical place badges**: Map appearance choice on each existing location card lets the player replace that one location's numbered badge with a station, locomotive depot, factory, market, hospital, police station, government building, home, clubhouse, park or circus symbol. The marker retains the same click target, location name, coordinates, current-location label, map search and travel rules. 'Numbered pin' can be restored at any time.
- **Independent save state**: rail plans under `S.railwayPlanner` and visual choices under `S.mapLocationIcons`. Existing road and building masks stay under their own separate state.

### Important boundaries
This is **a rail construction/planning prototype**, not yet a paid railroad business. Actual costs, rights-of-way, ownership/franchises, station travel, locomotive purchases, fares, freight, staffing, property and corporate acquisition remain in the business roadmap. Creating an editable line cannot create fictional cash, collect ticket revenue or move established geography.

### Tests and acceptance
`tests/rail-planner-and-icons.cjs` passed in an isolated JavaScript evaluation: normalized save data, station connections, service refusal on disconnected track, world-clock train interpolation, targeted deletion and per-location physical icon overrides. The full native Linux UI and complete source test suite have **not** been verified, and no executable or release tag was issued.

Detailed engineering scope and future railroad economy: `docs/RAIL-PLANNER-STATIONS-MAP-ICONS-v0.7.64.md`. No GitHub Actions.
