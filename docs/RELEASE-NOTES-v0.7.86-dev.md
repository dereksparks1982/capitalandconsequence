# Capital & Consequence v0.7.86-dev | Desk Shipping Chart and World Port Map

**November 2, 2026 · source development only · not an accepted Ubuntu release**

## Authorized owner change
The merchant shipping image must be a **second full interactive map**, reachable from Charles's personal executive desk through a **small, movable copy of that exact image**, just as the existing Washington paper-map item works. The shipping map becomes a place to manage merchant ships, put pins on interesting areas, and begin building small explorable maritime locations. Preserve the Washington map and its approved desk object locations, all story chronology, and the original uploaded shipping bitmap.

## Added
- `career-shell.js` places a new `careerDeskShippingMap` paper map on Charles's existing felt blotter and adds an accessible Shipping Map desk button. It does not replace or move the Washington map or Business Ledger.
- `desk-collection.js` stores a separate `deskLayout.shipping` position and lets the owner drag the miniature using the exact same existing pointer/drag/suppression mechanism. Existing stored map and ledger positions remain unchanged.
- `merchant-world-map.js` opens an independent full-size chart overlay directly from the miniature, the Shipping Map button, or the original merchant fleet sheet. It uses **the original `SHIPPING-LINES-ECOCLIPPER-small.jpg` without edits**. Wheel and +/- zoom, fit view, RIGHT-button dragging to pan, accessible keyboard selection, and a close X are supplied.
- The overlay displays all existing established/unverified ports and owned schooner/steamship positions. It reads saved-clock progress from `merchant-navigation.js`. A lightweight redraw updates the displayed ship overlays every 2.5 seconds while open; the redraw **does not** advance time, deduct money, move ships in saved state, or create profits.
- Full map's Shipping Office is connected to the **existing** merchant engine for purchase, verified destinations, dispatch, cargo selection, optional insurance, hull repair, captain's lead verification, and local sales of real received Federal Electric components. No duplicate parallel shipping treasury or inventory was created. All original access restrictions and costs remain in the authority engine.
- `merchant-regions.js` saves independent profile-scoped ocean chart pins, labels, positions, and deletes. The chart allows 60 personal marks and drag-free repositioning via Reposition Mark → click destination. **Personal annotations are not new ports** and do not unlock freight or travel.
- Eight known maritime ports can display generic low-detail 6×6 top-down **harbour planning scenes** with clickable quay, customs, storehouse, merchant square, lodging, and street sectors. These are explicitly scenes for inspecting/planning the next region build, **not real player travel yet**. No fabricated named historical proprietor, NPC, stock, customs clearance, purchased property or location entitlement.
- New `tests/merchant-world-map.cjs` checks desk placement, original image use, independent saved ocean pins, port region models, business engine links and protection of the Washington map. Original shipping source test remains.

## Important: incomplete work, no false claims
- **Charles cannot physically travel to these new port regions yet.** The harbour planning scenes are inspectable prototypes. Actual character boarding, inland trip to departure harbour, transit across multiple days through the existing calendar/day reports, arrival and return, consistent presence/access rules and on-site economic interactions are not implemented. The game must not teleport him or claim a port preview is a completed journey.
- Port coordinates and ship routes remain hand-drafted approximate overlays. The exact uploaded EcoClipper JPEG is kept but 1878-voyage authenticity and copyright/redistribution rights are not verified.
- Focused connector-side JavaScript parsing and unit simulations only; full Node test suite, actual Electron chart rendering, practical camera/desktop/pointer visual QA and accepted Linux release are pending.
- No GitHub Actions, new playable installer, tag, or accepted release.


## Follow-on implementation within v0.7.86
- Personal chart marks may now be classified as an unclassified study point, coastline, open sea, or **proposed harbour**; these descriptions are saved per profile. A proposed harbour can display the same six-sector generic harbour layout without granting verified trade or access.
- A **Ports & Your Chart Marks** directory now lists eight existing ports plus personal annotations and centers the map on a selected location. The directory's expanded state is preserved as the map re-renders.
- World shipping camera settings save the chart center and zoom as view-relative game coordinates and restore on reopening. Right-button pan and wheel zoom continue to operate independently of the Washington map controls.
- Schooner/steamship inspection shows saved cargo manifest, precise in-game departure and ETA dates, estimated sea distance, percentage completed, days remaining and insurance coverage. The shipping office exposes its original cash receipts and superintendent's event journal, with no duplicate revenue or separate fake treasury.
- Harbour planning zones provide **read-only real records**: quay lists actually docked owned ships; storehouse lists received Federal Electric components; customs desk displays saved voyage notices without claiming formal customs clearance; merchant market shows existing verified/unverified trade access. Lodging and street sectors describe their unimplemented activities, without generating NPCs.
- Port information offers approximate **Baltimore-to-port passage forecasts** for a schooner versus a steamship. These are informational quotes, not actual passenger embarkation or paid travel.
- Port and ship SVG markers accept keyboard activation, dockside zone selection shows a visible pressed state, and the offline source regression now covers directories, annotation separation, read-only records, camera persistence and keyboard wiring.

**Checks after these changes:** In-tool JavaScript evaluation and focused calculations passed the shipping and port-preview checks available here, including 17 additional targeted assertions. Native Ubuntu Electron, the complete Node regression suite and owner acceptance are still pending.
