# Capital & Consequence v0.7.109-dev · Owner-Selected 1880 Mitchell World Shipping Atlas

**Owner authorization:** November 4, 2026: "yes use whatever version is needed make it zoomable then ill upload that to github"; followed by "I put that whole folder in GitHub" and "continue". The 9664 × 5944 source scan is now confirmed in the GitHub tree as a 13,706,737-byte JPEG.

## Artwork
- **Full interactive image:** `assets/artwork/maps/Mitchell_1880_Map/mitchell-world-1880.jpg` (9664 × 5944, 13,706,737 bytes, owner-supplied).
- **Desk/fleet preview:** `assets/artwork/maps/Mitchell_1880_Map/mitchell-world-1880-preview.jpg` (owner-supplied 2048-pixel copy). The preview and unmodified original already exist in GitHub; this developer commit **does not duplicate or recompress** either file.
- Image: Samuel Augustus Mitchell, *Map of the World on the Mercator Projection Exhibiting the American Continent as its Centre*, entered 1879, published in the 1880 atlas. Source: David Rumsey Historical Map Collection / Stanford University Libraries and Wikimedia Commons. Preserve source credit and review redistribution terms before final commercial packaging.
- **The previously deleted Admiralty JPEG remains deleted.** No print artwork has been redrawn or modified.

## Integration
- Reused the existing `merchant-world-map.js` interactive shipping map, not a standalone second viewer. Existing controls retain **wheel zoom, zoom buttons, Fit, right-drag pan, keyboard directory navigation, saved pins, and moving vessel and paid voyage overlays**.
- Updated its image path, accessible labels and period/source credits. The desk miniature (`career-shell.js`) and read-only fleet summary (`merchant-chart.js`) use the much lighter Mitchell preview; the interactive shipping map uses the real native-resolution JPEG.
- Updated display viewport from 800 × 434 to **800 × 492**, matching the Mitchell JPEG aspect ratio. Camera's zoom ceiling uses its 9,664 native pixels and viewport DPI, allowing up to 10× nominal scale at standard DPI and ~6× on a 2× display; image-native pixel limits prevent needless extra-blurry zoom. Saved camera format is now **v3**; an outdated camera from another map starts fitted rather than displaying the wrong ocean.
- Recalibrated the **eight currently implemented** port anchors and **seven visual route segments** against the uploaded atlas, including North Atlantic, Caribbean, western African/Cape and Southeast Asian routes. Overlay remains an approximation based on the archival world image; exact positioning can be refined after graphical playtest. Map image coordinates and printed art stay separate from historical shipping mileage/paid economic route geometry.
- Existing user-created study pins remain separate in their original 800 × 600 saved space; visual conversion now uses the new 492-height image. Older save migrations are not a required beta deliverable.
- No additional ports, privileges, voyages, shipping income, cargo or story scenes. No Washington or Salem map or layout changes. World chart remains **port-to-port**; opening a port uses a distinct historical area map/scene.

## Verification / known work
- Source changes compile in V8. Focused mock-filesystem execution verifies the maritime camera, 1880 chart source/overlay requirements, independent map controls and paid schooner voyage systems. The test for the uploaded JPEG's **actual** bytes (JPEG SOF size check) runs when the repository is cloned locally; inside remote tool-based verification the GitHub file is confirmed by its path and 13.7 MB size, but the actual 13.7 MB blob has not been re-downloaded for byte inspection here.
- Replaced the obsolete Admiralty-specific regression with an **equal or stronger Mitchell-specific regression**, including real JPEG image-header verification, eight ports, all routes, untouched economics and image-source separation. An unrelated stale string expectation for the unchanged schooner estimator was corrected to match the real on-screen wording while retaining the actual nav.plan check.
- The complete Node suite, packaged Electron native image rendering, graphical zoom/pan and any on-machine user acceptance are **not** claimed as passed.
