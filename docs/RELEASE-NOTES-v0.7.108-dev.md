# Capital & Consequence v0.7.108-dev · Crowe Butcher-Shop Interactive Workroom

**Status:** Unaccepted developer SOURCE snapshot, not a tested or installed Ubuntu Electron release. The owner said “build” following the v0.7.107 ice-room build and the proposed next step of making the butcher shop visually interactive.

## Implemented
- Added `crowe-shop-scene.js` and `crowe-shop-scene.css` to the **existing** Washington interior. An intentionally simple top-down/32px-style diagram has six registered shop workrooms and eight clickable stations: retail counter, till ledger, timber cutting block, hanging beef rail, ice chest/drainage, stock larder, supplier wagon door and the cousin’s loft.
- The floor plan reflects the player's current room with an outline. Clicking a station opens a **non-mutating inspection** panel showing live data from the existing butchery/cold-room model: side IDs, pounds and aging days, normal versus early cutting eligibility, ice and room cleanliness, meat quantities, price, cash till and last audit. The player's cousin’s personal name remains intentionally undecided.
- When a station is in another workroom, its detail offers **Go To Room**. This uses `FE_CITY.openRoom`, which retains the existing player-access checks, room-to-room movement timing, travel clock and autosave. A station in the present room offers applicable actions, which delegate to `crowe-butchery-ui.js` and the existing priced/time-consuming `shop.quote/apply` flow. No instant money, ice, inventory, age days or hidden family discoveries are created by clicking.
- Preserved all existing economic forms, cold-room controls, scheduled iceman, automatic cousin sanitation, 30-day standard hanging age, early customer cuts and non-annoying spoilage rules. The newly drawn picture is a navigation and inspection layer, **not a new parallel simulator**.
- Self-contained scene styling extends only the Crowe shop panel. No approved Washington map pin, UI geometry outside the shop panel, Salem asset, shipping chart, nightclub, other playable character, date, lore or storyline was changed.
- No new external pictures, artwork asset files or machine-generated imagery. The diagram is constructed from local DOM/SVG primitives and CSS; its furniture silhouettes are prototype art in the previously established crude top-down style.

## Scope and test record
- New `tests/crowe-shop-scene.cjs` exercises eight station IDs and footprints, spot inspections, live cold-room age/ice data, non-spoiler text, DOM button dispatch, disabled cross-room work, genuine room navigation callbacks, and no save mutation on inspect.
- Extended `tests/crowe-ui-wiring.cjs` to protect stylesheet/script order, the shop-only mounting point, authorized room-entry mechanism, and spoiler isolation.
- Focused **in-process V8** execution passed four test modules: `crowe-shop-scene`, `crowe-butchery`, `crowe-cold-room`, `crowe-ui-wiring`. Changed JavaScript and test sources passed syntax compilation. **Not a full native Node suite or actual Electron graphical acceptance**.
- A full local desktop build has **not** been run on the owner's Linux machine from this environment. The owner has not tested or accepted the snapshot.
- The world/shipping map remains **undecided**. Do **not** restore the deliberately deleted Admiralty chart or rewrite tests to require it. This build makes no shipping or map changes.

## Later choices (not implicitly approved)
Actual walking/paper-doll scene navigation and shop-floor editor placement are not claimed here. The **final** butcher-shop room geometry, map pin/address, cousin's name, and murder evidence remain undecided. These can be developed later with further owner direction.
