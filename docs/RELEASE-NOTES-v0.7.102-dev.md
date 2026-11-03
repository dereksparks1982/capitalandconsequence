# v0.7.102-dev · Maritime chart usability and geographic correction
November 3, 2026. Source-only development, no accepted Linux release.

Requested: Continue the previously approved owner's Admiralty shipping chart. No new ports, plot decisions or owned assets.

- Added `merchant-chart-camera.js`: pure deterministic camera math for correct fit, Retina/sharp-source-aware maximum zoom, cursor-anchored mousewheel zoom, bounded right-mouse drag, strict edges, focus and window-resize retention. The UI still uses its original geometry and controls. Old 800×600 camera positions migrate to the 800×434 image only at display time; save code retains chartVersion 2. User map marks and voyage data remain untouched.
- Fixed the previous resize handler that reset a panned/zoomed chart to full fit whenever the window changed dimensions. Clicking Fit remains an explicit reset.
- Map pins and ship symbols now keep a usable size when zooming (inverse-scaled SVG groups); the printed chart and route overlays still magnify normally.
- Corrected only the **visual overlay** of eight existing ports and seven routes by comparing the newly added map to its geographical coastline (US East Coast, British Isles, North Sea, Caribbean and Indian Ocean). Previous overlays placed Liverpool near France and multiple American ports out at sea. These remain *approximate visual points*, not verified historical Admiralty route surveys.
- No changes whatsoever to economic trip coordinates (800×600 source), saved itineraries, passenger fares, established trade access, shipping distances, ship timing, cash, charter, World’s Fair timing, four protagonists or the protected Washington map.
- Added `tests/merchant-chart-camera.cjs` for limits, focus, pan, resize, serialized view migration, save-safe routes and fixed port baselines; the existing image asset stays 1,643,745 bytes (<25 MB). Changed selected HTML script cache keys to ensure updated image controls are loaded.
- Full native Node regression suite and Electron UI smoke remain to be tested. GitHub workflows limited to relevant maritime changes; no automatic executable release or UI acceptance.
