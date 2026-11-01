# Factory Screen: Top-down Room First, Collapsible Management Below

**Capital & Consequence · design decision · 31 October 2026**  
**Status:** Owner-approved **future presentation direction**. No redesign of the current factory management panel is claimed implemented by this document.

## Intended factory screen

**First visible:** The actual top-down Federal Electric production-floor room, using the *existing* intentionally generic/crude **32×32 room artwork** and reusable Pandora's Box-inspired room editor. Workers and machines should eventually occupy real tile positions and navigate within the room. It must feel like a location, not an abstract management dashboard.

**Below the room, accessed by scrolling:** The **existing factory management controls**, preserved rather than removed, appear as groups of *independently collapsible sections* with clear headings. Inspired by the current expandable management/controls under the Washington map. Initially prioritize floor visibility, with headings still discoverable; preserve each panel's last expanded/collapsed state for that save/profile or user preference.

Potential categories: production/work orders; workforce/assignments; machinery/maintenance; materials/inventory; shipping/contracts; finances/reporting. **Reorganize only after inspecting the already implemented factory tab and preserve every real control and its existing event handlers.** Do not invent operations, move approved city map pins, or silently break business management.

## Interaction and simulation boundaries

- Factory view is the genuine production-floor room from existing `city.js` (`factory/production-floor`), **not** the executive office or a second unregistered factory location.
- Reuse `room-builder-core.js`, `room-builder-kit.js`, and any eventually accepted shared renderer. No independent scene engine or new art direction.
- Furniture, machinery and placed NPCs are visual anchors at first. Working machines and staff behavior only count once connected to authenticated inventory, labor, wages, access, movement, time and contracts.
- Opening/closing a management section does **not** advance game time. Moving to another room still follows the established room-time rules; traveling from elsewhere uses the Washington map animation and travel-time accounting. Do not create a desk teleport.
- The persistent digital world-time/status banner must remain visible.
- First build the reusable editor, get Charles's office accepted, then build this production-floor presentation using the same tools. Current production dashboard remains functional until replacement is accepted.
- Usability: clear headings, keyboard-accessible expand/collapse, saved disclosure states, scroll-to-sections, sensible defaults for smaller Ubuntu screens. No unauthorized change to already approved screen geometry.

## Acceptance criteria for later build

1. On entering the production-floor room, the visible top section is the room with generic sprites and working collision.
2. Scrolling reveals *all* previously existing management functions, grouped into collapsible panels. No missing or duplicate production controls.
3. Each group expands/collapses independently and remembers its choice.
4. Real NPC/production linkage, once implemented, cannot create resources, wages, work or earnings simply by placing a sprite.
5. Live clock, role access, saving/loading, ordinary city-room transitions and map design remain correct.

**No new factory-screen UI was implemented as part of this design note.** See `docs/PANDORAS-BOX-ROOM-EDITOR-2026-10-31.md`.
