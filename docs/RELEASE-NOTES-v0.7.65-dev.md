# v0.7.65-dev · Manual Washington Road Painter and Ford’s Theatre
**Development source · 1 November 2026 · not an accepted executable release**

## Fixed from the user's two screenshots
- **RIGHT-button drag pans the Washington map.** LEFT no longer captures the map for panning; it is available for map pins and the road/rail editors. Browser right-click menu is suppressed over the map surface while panning. Right pan works while drawing streets and blue building obstacles, including from under a normal numbered map pin. The mouse wheel still zooms.
- **Freehand street painting, Paint-style**: Road Editor now opens with **Paint Roads** selected. Hold LEFT and draw an irregular street, with each sampled point joined as short connected road segments. Also offers Straight Road (two clicks), Finish Line, Undo Last Stroke and Erase Roads.
- **Fixed cursor anchoring**: every road/building point is derived from the displayed map image's actual `getBoundingClientRect()`, not an assumed overlay offset. This prevents the first yellow road circle being several pixels away from the cursor when the map is zoomed, panned or surrounding tool rows wrap.
- **Blue building obstacle brush is prominent**: `Paint Buildings Blue`, `Building Rectangle`, and `Erase Blue` are dedicated visible buttons. LEFT-drag paints a blue obstruction mask that the custom A* road system treats as **impassable**. A list of brush sizes allows finer work. The blue marking represents a building or area to avoid, not a walkable street. Obstacles do not modify the printed guide bitmap.
- **Automatic street suggestions and raster scanning removed** from the Road Editor interface and the editor source. No `Suggest Current Streets`, `Scan Printed Map`, or `Accept Suggestions` controls. The user paints all streets manually and chooses **Use Painted Roads** when the network is sufficiently connected. This does not silently wipe existing saved street drawings.
- **Larger manual map capacity**: actual pathfinding sanitation now retains up to 8,000 manually painted road segments and 4,000 blue building rectangles rather than silently truncating at the previous 2,200 / 1,200 limit. The full city will still need hands-on performance testing with a large number of painted strokes.
- Manual map Export and Import and Restore Original Routing controls remain. Saved road/blue building data stay separate from the unchanged printed map, fixed location art and editable pin placements.

## New visitable landmark
- **Ford’s Theatre** at 511 10th Street NW is now **#41** in the city registry, with a public lobby, auditorium, stage door and restricted backstage/manager office.
- Pin #41 is **provisional**, placed near other downtown theatres so the user can fine-tune it with Edit Pins against the printed Washington guide. **None of the existing 40 pins have been moved.**
- In this independent alternate history, **every registered mapped location is visitable irrespective of its real-world opening/closing date**, including the World's Fair, airports, motor speedway and kennel track. Public entry is not the same as permission to enter private rooms or as completed venue activities. A planning-only site with a map pin may show an unfinished room shell.
- A broader proposed Washington landmark list, grouped by civic life, commerce, industry, theatre, recreation and transport, lives in `docs/WASHINGTON-VISITABLE-LOCATIONS-EXPANSION-2026-11-01.md`. Listings there are **candidates**, not claims that every location or interior is already playable.

## Source updates
`road-editor.js`, `road-layout.js`, `app.js`, `styles.css`, `index.html`, `city.js`, `tests/manual-road-paint-and-map-places.cjs`, the README, and roadmap.

## Testing and status
The focused manual-map test passed an isolated JavaScript replay. It checks image-bound cursor coordinates on a zoomed/transformed map, continuous left freehand strokes, blocked-building painting/erasing, right-button avoidance of painting, editor controls, Ford’s Theatre registry, and elimination of historical year restrictions. A separate right-pan source contract checks browser drag and context menu handling.

**Full native Linux gameplay, browser pointer behavior, 8,000-segment painting performance and complete project test suite remain unverified.** No GitHub Actions, downloads, commands for the user, release tag or accepted executable.
