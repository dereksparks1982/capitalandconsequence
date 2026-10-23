# Federal Electric | Temporary city travel rule
Decision: October 22, 2026. Source-only development slice.

**Travel between two distinct registered Washington locations costs 60 in-game minutes, for now.** This is a **gameplay placeholder**, not verified walking time, route length or scale inferred from map pins. The provisional duration is configured in `journey-planner.js`, with an empty route override table reserved for individually tailored journeys after the city's layout is settled.

**The Businessman's executive office and factory are in the same building and registered under the same factory location. Moving from one room to the other takes no travel hour.** Other rooms inside a single site also incur no inter-location travel charge. Simply viewing the map, reopening a saved location, DEV navigation and unsuccessful entrances must not create a completed travel record. Going back to the factory from a **different** city location counts as one inter-location journey.

The existing `recordProvisional` hook fires only after a location change succeeds. It now advances the per-profile 24-hour calendar bridge by 60 minutes and records the provisional game-time cost, known departure and arrival timestamps, and whether the saved calendar was successfully charged. Actual route time and mileage stay `null` until researched; animals and carriages are never teleported.

**Important migration limitation:** The 24-hour calendar bridge still coexists with the old 60-minute business/night phase. This slice does not make the calendar authoritative for factory, markets, venues or NPC schedules. Legacy saves with no known time cannot be assigned a fabricated travel timestamp. A later phase must unify old systems before removing the countdown.

## Next steps
- Replace the flat 60-minute travel cost with configurable destination-to-destination times after locations, roads and transport modes are set.
- Preserve zero cost for same-site rooms, especially the office and factory.
- Unify the 24-hour clock across production, market hours, NPC routines and venue schedules.
- Handle pause/travel and unknown-time legacy saves during that clock migration.
- Source QA: the standard contracts plus `tests/travel-duration.cjs` must pass; do not generate an executable.
