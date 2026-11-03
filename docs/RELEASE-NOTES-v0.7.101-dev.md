# v0.7.101-dev · Admiralty chart replaces EcoClipper image

November 3, 2026. Source-only, pending Electron build and owner acceptance.

Owner selected the historical British Admiralty "Chart of the World Showing Tracks Followed by Sailing and Low Powered Steam Vessels" instead of the EcoClipper chart. The already uploaded `assets/artwork/Chart_of_the_world_showing_tracks_followed_by_sailing_and_low_powered_steam_vessels_RMG_E0798.tiff.jpg` JPEG is 1,643,745 bytes, within the owner's hard limit of 25MB. The supplied image remains unchanged and will zoom from its high-resolution source without demanding a large TIFF download. Its **1888 publication date** is artwork provenance; there is **no unauthorized adjustment** to the game's 1878 timeline.

The desk's movable mini shipping map, the full screen merchant chart, and the fleet chart reference the new image. Their graphical overlays now fit the 800x434 chart proportions. Visible routes and all eight known port markers are recalibrated against the Admiralty layout (illustrative, not verified historical voyages), including a route passing south of Africa.

Game and save compatibility: economic itinerary, shipping distances, existing routePoints arrays, charters, trade privileges, game clock, passenger fares, and actual voyage progress are unchanged. Display-only `nav.DISPLAY_PORTS`, `nav.displayRoute`, `nav.displayPosition` and personal pin Y conversion interpret old records without rewriting save data. Right-click map panning, wheel zoom, zoom buttons and movable desk art are retained. Original Washington background and pin coordinates are untouched.

Adjusted older image-identity test expectations to reflect the owner's specifically approved new chart and added a cross-port, size-ceiling and saved-coordinate source regression. A sparingly triggered full Node source QA workflow is configured for maritime map edits only.

Focused V8 JS syntax and navigation checks were run before commit; full source suite and Electron smoke testing pending hosted/local results. No accepted release/tag.