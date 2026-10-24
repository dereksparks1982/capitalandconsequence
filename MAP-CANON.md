# Permanent Washington Map Canon · Capital & Consequence

**Owner decision: October 24, 2026. Binding for all future builds.**

- The game's CURRENT Washington city map represents the alternate-history city in **1878, 1938 and every other playable year**. It does not change with passage of time. This world does not have to mirror actual historic Washington map development.
- Keep the existing artwork `assets/artwork/maps/title-map-1938.jpg`. The `1938` filename is a technical legacy detail, **not** a historical date constraint or replacement requirement. Do not replace, redraw, research a substitute, produce year-dependent map art or re-survey pins for historical authenticity.
- **All 38 pins have user-editable displayed names, including Franciscan Monastery (35), Cobbler (36), Eastern Market (37) and Georgetown Market House (38).** Selecting a pin exposes the editable name and **Save Name / Reset Name** actions; a custom label is scoped to the active player profile and persists after autosave/reload. Renaming display text must never change registered location identifiers, access checks, or underlying geographical positions.
- **Pins must be filterable** through the existing Locations category and historical/fictional filters, including **Religious Sites** and **Markets & Repairs**, **Leisure & Outdoors**, **Recreation & Competition**, **Gambling & Games** and the other existing categories. An All option must show all destinations.
- Keep the existing numbered pins, zoom/pan, dragging and profile-local saved placements. Resetting positions must not erase the user's renamed labels.
- Prior `MAP-1878-RESEARCH.md` and any '1938 placeholder', 'map replacement' or 'historical reconstruction' tasks in older handoffs and historical milestones are **superseded/cancelled**, not pending.
- Before accepting the pending v0.6.86 Linux candidate, test pin edits, filter changes, save/reload, profile separation and representative pin navigation in the actual Electron desktop game. Source checks passed earlier, but are not a substitute for a desktop playthrough.

**The existing map artwork remains unchanged.** Pins 35–38 add the explicitly requested real monastery, fictional cobbler, and two historic markets in documented neighborhoods. Dragged placements require affirmative confirmation before save; off-map drops are refused. The app does not invent an automatic proof that an arbitrary new address is historically correct. Cobbler's fictional storefront was designated in the Eastern Market shopping area; exact ownership/lot is not claimed historical. Two real markets were added as red historical pins. Other fictional addresses remain unverified unless the owner establishes their location. See [MAP-LOCATION-GRID-AUDIT.md](MAP-LOCATION-GRID-AUDIT.md).

## Historical education and pin visibility · October 24, 2026

- Every historical **red** destination displays an explicit **Non-Fiction** badge on both the map card and the interior destination page, plus collapsible **Real History · Further Reading** with a factual introductory note and links to Wikipedia and the Library of Congress. External links open in the system browser from Electron; the reference pages are not required for offline gameplay.
- Every invented **blue** destination displays an explicit **Fiction** badge without falsely attributing made-up characters or businesses to historical archives. Even a fictional room inside a real building remains Fiction.
- Both red and blue pin **backgrounds are partially transparent**, while the marker numbers remain fully legible. This does not modify the map image, pan/zoom, user-renamed labels or saved pin placement.
- Pin drags no longer auto-save. Drops outside the printed A–R / 1–30 area are rejected; in-map moves require explicit confirmation or return to the previous position.

## Fiction / Non-Fiction & Historical Reading (October 24, 2026)

- Every numbered location card and visited destination page labels the place **Fiction** (invented) or **Non-Fiction** (real historical place or institution); colors alone cannot be the only distinction.
- Red and blue pin *backgrounds* have 68% opacity, leaving the original printed map partly visible while preserving opaque numbers/text and their clickable areas.
- Non-Fiction cards contain a collapsible **Real History · Further Reading** section with a factual introduction, a location-specific Wikipedia link, and a Library of Congress search. They open in the external browser. Internet access is needed for linked articles, not to play the game.
- A real site's history is distinguished from the game's invented timeline. Especially **the Brookland monastery was built in the 1890s**, and the Washington airport and earliest Chinatown also have real-world dates that do not match all alternate-history starting years.
- Fiction cards must never claim invented venues, staff, or private stories are documented history. New sources must be reviewed and kept separate from game lore. See `tests/map-history-card.cjs`.
