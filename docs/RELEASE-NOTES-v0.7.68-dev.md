# Capital & Consequence v0.7.68-dev | Ubuntu QA repair
November 1, 2026 · Source-only development, pending owner testing.

The initial v0.7.67 local build downloaded and synchronized correctly, but the mandatory offline Node test suite stopped packaging: 190 passed and 19 failed. All 19 cited failures have now received corresponding regression-contract or game implementation repairs.

### Repairs
- Normalize map tests to 42 numbered registered destinations, explicitly preserving Ford’s Theatre #41 and Center Market #42. Historical cards now correctly count 19 real institutions and 23 invented venues.
- Supply non-fiction reading metadata for Ford’s Theatre and Center Market without altering Washington map art or pin coordinates.
- Validate 42×41=1,722 directional provisional street journeys, with no unaccounted routes, restricted-area crossings, or reverse-distance disagreements in an independent in-memory simulation.
- Restore the actual manual road painting tests: freehand left-drag, right-drag preserved for map camera, precise two-click *line* mode, blue building masks and undo. Removed retired automatic road scan/seed expectations.
- Fix the map-arrival fixture to include the real-room household-food hook.
- Compare Hillsdale butcher stock to its independently recorded initial stock rather than an obsolete fixed number.
- Align NPC tests with the expanded 24 simulated characters (21 residents and three unselected playable protagonists).
- Update alternate-history access logic: every mapped place can exist regardless of the year, including the mapped kennel and car tracks. Unimplemented casino games are still unplayable, while genuinely restricted rooms and undiscovered invitations remain restricted. Oval racing now supports the 1878 opening year.
- Keep the newer domestic-commerce build v0.7.67 intact; no alteration to map image, location coordinates, approved UI geometry or owner-drawn roads.

### Validation and limitations
V8 source syntax checks passed for changed JavaScript and test files. Independent in-memory execution verified 42 numbered places, 19 history records, all 1,722 paths, no reversed travel-distance discrepancies, bounded graph cache and available 16-person dog/car rosters in 1878, 1920 and 1938. The **full 209-test Node suite and Ubuntu packaged Electron smoke test have not been executed in the assistant's runtime**; local testing is required before accepting this build.

Release status: **unaccepted development**, no GitHub Actions, release tag, zip or launcher download created. Every development build may start from a new save; no migration or legacy-save compatibility is required.
