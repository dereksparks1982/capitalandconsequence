# Pandora's Box-style Room & Location Editor

**Project:** Capital & Consequence  
**Recorded:** 31 October 2026  
**Status:** Approved foundation plan, now partially implemented as development source through v0.7.45-dev. Not packaged, accepted or Linux-playtested. See `docs/OPEN-SOURCE-TILE-GAME-LESSONS-2026-10-31.md`.  
**Priority:** **ACTIVE NEXT TOOLING MILESTONE.** Build this editor before designing the District Asylum interior or expanding location-by-location scenery.

## Goal

Create an **original, in-game visual room editor** inspired by the convenience of Pandora's Box-style world-building tools. The developer can build, decorate and test interiors with mouse/keyboard rather than altering code or hand-editing tile coordinates. It is a developer tool, not a claim of compatibility with or use of any third-party editor code.

**First proof:** Construct the executive office of **Charles “Charlie” Whitcomb** at **Federal Electric Factory** using the editor, then switch to play mode and walk Charles inside the saved layout. After acceptance, expand to other factory rooms; only then to other locations, streets/neighborhoods and the District Asylum.

## Existing repository foundation (verified 31 October)

- `assets/artwork/assets.json` is the established **69-sprite, 32×32-pixel** starter catalog (32 character/facing sprites, 5 floor tiles, 6 construction tiles, 19 furniture tiles, 7 small props). `assets/artwork/spritesheet.png` and related office preview artwork are already tracked.
- Source art direction: intentionally **crude, chunky, flat, generic, early-computer/RuneScape-worse top-down sprites**. Do not make rooms photorealistic, detailed or visually inconsistent with the approved existing art.
- `city.js` already registers `factory` and distinct `executive-office`, `receiving-office`, `production-floor` and other factory room IDs. Use these existing identifiers, not parallel invented locations.
- `app.js` and `#cityRoomOverlay` already implement location/room entry as an existing gameplay layer. `ROOM-NAVIGATION-REPAIR.md` documents delicate map-to-room behavior. Add editable visual layouts **without replacing this routing, permission, world clock or UI**.
- The approved Washington map artwork, 40 pins, pin coordinates, established overlays, and accepted screen geometry must not be moved or redrawn as a side effect of editor development.

## First cut: editor UI and tools

1. **Room selection:** Choose a known location and room from the existing city/room registry. Initially default to `factory/executive-office`. Provide a new empty layout for that room and a way to open an existing draft. Do not grant in-game access through editor-only controls.
2. **Canvas and grid:** Render a tile-aligned overhead room with a switchable 32×32 placement grid and basic zoom/pan. A simple rectangular floorplan is sufficient for v1; no isometric rendering, lighting engine or artistic overhaul.
3. **Palette:** Read asset IDs, sprite rectangles, categories and footprints from `assets/artwork/assets.json`, using the local spritesheet. Tabs: floors, walls/construction, furniture, props, people. Reuse existing sprites; placeholder art must not become a stealth style replacement.
4. **Painting:** Click/drag to lay floor and wall tiles. Click to place door/window on valid wall edges or wall positions as appropriate to the sprite, with visible orientation and a clear, traversable door aperture.
5. **Objects:** Select, drag, move, quarter-turn rotate (directional assets may select their matching facing sprite instead of rotating bitmap), duplicate, delete, and inspect properties. Snap to grid by default; allow multi-tile furniture using metadata footprints. Provide undo/redo for editing actions.
6. **Characters:** Set the player spawn and place editor test NPCs using existing character sprites. Character placement in the room must not silently create a real-world NPC, time schedule, official identity or employment record.
7. **Collision:** Walls, furniture and closed doors block movement according to their collision metadata; floors, open doorway and passable props do not. Reject or clearly flag intersections, blocked exits, off-map positions and spawn points trapped inside solids.
8. **Test/play toggle:** Exit editing temporarily to move Charles with keyboard controls around the actual saved layout. Test collisions and door exit. No clock time, money, travel, NPC schedule or map access is charged/changed by a developer test.
9. **Save/load:** Persist a versioned room layout under a stable `locationId/roomId` pair, including dimensions, floor tiles, walls, doors, objects, rotations, spawn points and object IDs. Reopen it accurately. Provide manual save, named drafts/backup (or undo-safe recovery) and explicit reset/restore. Keep room-design data separate from active player progression.
10. **Inspect & export later:** Basic object inspector in v1; import/export JSON and more sophisticated room templates may follow after persistence works. Do not make external downloads or image generation a prerequisite for first use.

### Suggested saved data model

```json
{
  "schemaVersion": 1,
  "locationId": "factory",
  "roomId": "executive-office",
  "widthTiles": 16,
  "heightTiles": 12,
  "floor": [],
  "walls": [],
  "objects": [],
  "spawns": {"player": {"x": 3, "y": 4}},
  "exits": [],
  "updatedAt": null
}
```

Structure is **proposed**, not current source implementation. Objects should refer to catalog `spriteId` and unique instance IDs rather than embedding artwork; source sprite size, footprint and collision must be validated before gameplay. Room exits must point to **existing** room/location registry IDs and respect normal permissions when playing for real.

## Deliberate architecture boundary

Editor mode is for authorized development, with explicit entry and exit, not an unlock-all gameplay cheat. Normal room entry must still enforce roles, invitations and access. The preview player is distinct from actual autosaved career state.

Keep layout rendering, edit operations, save/load and game navigation separated: ideally independent modules with a bridge to the existing `openCityRoom` path. Do not rebuild the city map, remove the existing executive desk, restyle the HUD, or alter money and time accounting. There is no GitHub Actions dependency.

## First-build acceptance checklist

- [ ] On Ubuntu, open editor for `factory/executive-office` inside the current game.
- [ ] Visually create a room from 32×32 floors and walls, a working door/window, desk, chairs, cabinet, rug and lamp from the existing sprite sheet.
- [ ] Select/move/rotate/copy/delete objects; undo/redo edits.
- [ ] Place Charles's starting tile, save, close, reopen and see **the identical layout**.
- [ ] Enter test mode, navigate Charles, confirm walls and solid furniture block movement and the exit works.
- [ ] Leave editor and enter the executive office through the normal map/room route; no dev privilege leaks, incorrect travel charges or duplicated NPC/economy effects.
- [ ] Preserve map art/pin geometry, UI layout and currently functioning locations.
- [ ] Run focused save/load, collision, asset-reference, room-registration, and normal-entry regression tests locally. Owner approves the visual room and navigation before factory expansion.

## Staged expansion after approval

1. Build and accept Charles's executive office.
2. Extend layout tooling and templates to Federal Electric's receiving office, production floor, break room, stable and worker quarters.
3. Add location-specific props/NPC paths and consistent scene transitions for other registered rooms and buildings.
4. Create outdoor street/neighborhood scene support in the **same crude style** without editing the original city map art.
5. Eventually build District Asylum and its interiors with this **same editor and asset system**, following `docs/DISTRICT-ASYLUM-FUTURE-DESIGN-2026-10-31.md`.

**Do not start the asylum art first. No code build or release was authorized by this documentation task.**
