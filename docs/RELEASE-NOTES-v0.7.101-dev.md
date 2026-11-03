# v0.7.101-dev · Admiralty chart replaces EcoClipper image

November 3, 2026. Source-only, pending Electron build and owner acceptance.

Owner selected the historical British Admiralty "Chart of the World Showing Tracks Followed by Sailing and Low Powered Steam Vessels" instead of the EcoClipper chart. The already uploaded `assets/artwork/Chart_of_the_world_showing_tracks_followed_by_sailing_and_low_powered_steam_vessels_RMG_E0798.tiff.jpg` JPEG is 1,643,745 bytes, within the owner's hard limit of 25MB. The supplied image remains unchanged and will zoom from its high-resolution source without demanding a large TIFF download. Its **1888 publication date** is artwork provenance; there is **no unauthorized adjustment** to the game's 1878 timeline.

The desk's movable mini shipping map, the full screen merchant chart, and the fleet chart reference the new image. Their graphical overlays now fit the 800x434 chart proportions. Visible routes and all eight known port markers are recalibrated against the Admiralty layout (illustrative, not verified historical voyages), including a route passing south of Africa.

Game and save compatibility: economic itinerary, shipping distances, existing routePoints arrays, charters, trade privileges, game clock, passenger fares, and actual voyage progress are unchanged. Display-only `nav.DISPLAY_PORTS`, `nav.displayRoute`, `nav.displayPosition` and personal pin Y conversion interpret old records without rewriting save data. Right-click map panning, wheel zoom, zoom buttons and movable desk art are retained. Original Washington background and pin coordinates are untouched.

Adjusted older image-identity test expectations to reflect the owner's specifically approved new chart and added a cross-port, size-ceiling and saved-coordinate source regression. A sparingly triggered full Node source QA workflow is configured for maritime map edits only.

Focused V8 JS syntax and navigation checks were run before commit; full source suite and Electron smoke testing pending hosted/local results. No accepted release/tag.

## v0.7.101-dev QA follow-up

Hosted source suite first pass at GitHub commit `7ea848ff69952666e30520bf8e975fa2f820207f`: **245 passed, 2 failed, 247 total**. Both failures were hard-coded assertions demanding the now-retired EcoClipper *filename* in `tests/merchant-physical-trade.cjs` and `tests/merchant-shipboard.cjs`. The new image, trade mechanics, passenger gameplay, all other chart and source tests passed. The owner's explicit image replacement supersedes these old image-identity assertions; update them to verify the actual `nav.MAP` path and bundled image. Do not change cargo transactions or shipboard gameplay to satisfy obsolete artwork names.

Added proportional migration for saved map camera centers from legacy 800x600 chart to 800x434 display, with chartVersion 2 as future migration marker. Added a sharpness cap tied to the actual source JPEG width and device pixel ratio so zoom does not magnify beyond its physical source pixels. These are presentation-only and do not change game accounting, discovery, passage or map pins.

Retire only the unused EcoClipper *binary* source asset from active GitHub repository when the map has switched, without deleting any historical documentation or original Washington art. A new full source QA run is necessary before claiming success.


## Verified regression suite after chart replacement

GitHub Actions Ubuntu 24.04 / Node 22 at source commit `c7a3e7c54d170ea58bebd2d7c751f6fb6569980e` (run **41630814289**) reports **247 passed, 0 failed, 247 total**. New `merchant-admiralty-chart.cjs`, existing shipboard, trade, navigation, original-city-map and source-contract regressions all passed. The 25MB file limit was tested against the checked-in JPEG. Both earlier stale-asset test failures are fixed. Source QA pass does not prove the Linux Electron executable was packaged/smoke-tested or that manually recalibrated port markers look perfect on-screen. Those are deferred to owner gameplay verification. No approved release/tag.
