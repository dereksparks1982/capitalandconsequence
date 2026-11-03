# v0.7.99-dev · Repair seven blocked Linux source regressions

November 3, 2026. Source-only correction, not an accepted release.

The owner's Ubuntu source build at v0.7.98 synchronized 152 files but stopped at 238/245 tests with seven failures. This update repairs the corresponding source behavior without editing or weakening the seven failing regression tests:

1. Washington city-directory listLocations() now includes the 42 map-anchored Washington destinations. The two extra physical voyage locations passengerVessel and foreignHarbor remain in the addressable registry through getLocation/getRoom, and all passenger travel remains playable. Restricted privateFightHall and cockfightingDen retain their pins, room permissions and directory entries. Non-Fiction/Fiction cards remain 19/23, not 19/25.
2. Removed the extra SHIPPING ROUTES text under the existing draggable shipping-chart miniature on the career desk. Kept the button, miniature image, title/aria-label and ledger geometry.
3. Moved the exact approved late-1878 Components → Streetlights → Bulbs → Fair decision passage to the top of DECISIONS.md without changing its wording, gate, dates, contracts or restrictions.
4. IPO quotation preview now reads "Founder voting stake", preserving calculations, voting shares, 25% family stake and price checks.
5. Map return's overseas-only state guard handles a missing S global gracefully in its isolated test without allowing an actual underway passenger to return to the Washington map.
6. Split the neutral-menu clock-stop helper from the separate unfinished Alexandria prelude clock-stop. Both market ticks and world ticks still block during either state. Existing advanceWorldSimulation intro guard remains unchanged.

Focused source checks in the connector: JS syntax parse of the affected modules and regression; 42 public/map destinations and both hidden overseas sites still addressable; 19/23 history classification, executive desk art preserved; authoritative 1878 chronology visible; in-memory room-return callback succeeded. Full native Node suite and Ubuntu Electron build were NOT run here. Owner must rerun Linux build verification before any release. No original map art, city coordinates, world canon, share values, authorizations, save data, or release tag changed.
