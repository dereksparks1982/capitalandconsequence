# Capital & Consequence | Mitchell world map, 1880

**The owner-approved map:** Samuel Augustus Mitchell's *Map of the World on the Mercator projection, exhibiting the American Continent as its centre*, 1880, David Rumsey record **0586.004**.

This package is a standalone **zoomable map viewer** prepared for GitHub. It doesn't alter the Washington or Salem maps or invent port locations. It preserves the complete atlas artwork, including the old book binding and border.

## How to obtain the genuine full-resolution scan

The JPEG received in ChatGPT is **2,048 × 1,259**, although the source file on Wikimedia Commons is **9,664 × 5,944**. **Don't upscale the preview.** To download the true original using your Ubuntu computer, open a terminal *in this directory* and run:

```bash
python3 get-original-map.py
```

This downloads the **actual** 9,664 × 5,944 original JPEG, checks its dimensions without third-party packages, saves it as `mitchell-world-1880.jpg`, and builds a ZIP next to this folder containing the map and the viewer. It does **not** open a browser, install anything, request a password or modify your game.

Then open `zoomable-map.html` in Firefox, or upload the directory (or the resulting ZIP contents) to your GitHub repository. The viewer tries the local original first, then the online original, then the included preview. It works with wheel zoom, buttons, Fit, Actual Pixels, mouse drag, right-drag, touch pinch and keyboard controls.

The original is around 13 MB and fits under GitHub's ordinary 100 MB per-file limit. If you use the 2,048 px preview instead, high zoom will be less sharp. Open the viewer footer to verify which file loaded.

## Integration with the game's shipping view

The current game still contains an old Admiralty-map geometry (800 × 434) and port overlay coordinates. Do **not** simply rename this artwork to match the old file. The Mitchell map has a **different aspect ratio and geographic composition**. Those coordinates must be recalibrated to the approved artwork before drawing moving ships on top, while keeping existing shipping economics and port rules. This package is the verified **image/viewer stage**, not a claim that the game's shipping code has already been migrated.

The world map remains **port-to-port shipping only**. Each city/port uses its own historical chart and a separate small playable top-down scene.

## Provenance / rights

- Source: https://commons.wikimedia.org/wiki/File:Map_of_the_World_on_the_Mercator_projection,_exhibiting_the_American_Continent_as_its_centre._Entered_..._1879_by_S._Augustus_(IA_dr_map-of-the-world-on-the-mercator-projection-exhibiting-the-american-contin-0586004).jpg
- Original full-resolution image: https://upload.wikimedia.org/wikipedia/commons/c/c6/Map_of_the_World_on_the_Mercator_projection%2C_exhibiting_the_American_Continent_as_its_centre._Entered_..._1879_by_S._Augustus_%28IA_dr_map-of-the-world-on-the-mercator-projection-exhibiting-the-american-contin-0586004%29.jpg
- Creator: Samuel Augustus Mitchell; published 1880, S. A. Mitchell, Philadelphia.
- Collection: David Rumsey Map Collection, David Rumsey Map Center, Stanford Libraries.
- Commons marks the historical image as public domain in the US. Its metadata also reproduces a noncommercial re-use note from the David Rumsey Collection. **Confirm current collection terms before commercial distribution**. Provide the above credit in the game's attribution page.

No proprietary source code or third-party image-modifying filters are bundled.
