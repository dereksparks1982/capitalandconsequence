# Washington, D.C. Map Research · 1878 Setting
**Status: Research and replacement candidates only. No new map asset installed or approved.**  
**Game:** Capital & Consequence · Opening January 2, 1878 · Washington-first  
**Research checkpoint:** October 23, 2026

## The owner's actual map request
The existing playable map uses `assets/artwork/maps/title-map-1938.jpg`, a later-period placeholder. The replacement should look and function **broadly like the current city map**: one large navigable overview with zoom/pan, numbered and category-filterable destinations, and editable pin names/positions. It should depict **Washington as the city existed in 1878**, not a modern street/shoreline map in sepia.

**The underlying illustration does not have to have been physically made in the 1870s.** A high-quality **later-drawn historical reconstruction of 1878 Washington is acceptable**, provided it is convincingly period-accurate and visually aged. Distinguish historical geography from decorative antique styling. No artificially invented nineteenth-century streets, bridges, rail yards, filled-in lakes or airports. The game is an alternate-history Washington, so deliberate deviations must be identified as fictional decisions rather than accidental modern geography.

Do not generate artwork without the owner's explicit approval of a map choice/reconstruction. No update to the map asset is authorized by this documentation-only handoff.

## Verified starting sources (Library of Congress)

### First candidate · J. C. Entwistle, 1876
- Item: https://www.loc.gov/item/88693467/
- Title: *Entwistle's handy map of Washington and vicinity: showing public buildings, churches, hotels, places of amusement, and lines of street rail roads*.
- Published Washington, D.C., 1876. Folded original, color, approximately 41 × 53 cm. Block numbers, radiating distances from the Capitol, period street railways and public features make it close to the **1878** setting.
- **Why prioritize:** 1876 is only two years before opening; stronger chronological match than the current 1938 map. Need to check actual coverage, legibility, high-resolution scan availability, and whether its map extent includes all six fishing sites and suburban locations.

### 1880 D.C. overview (comparison, not necessarily final)
- Item: https://www.loc.gov/item/91683158/
- Title: *Map of the District of Columbia*, 1880. Manuscript ink/wash with county streets, principal city streets and ward numbers. Northwest is upper left, **not necessarily north at top**, so the game would need consistent pin alignment.
- **Why compare:** useful for the city's wider geography but postdates the opening by two years.

### 1883 Engineer Commissioner city map (detail reference)
- Item: https://www.loc.gov/item/88693452/
- Title: *Map of the city of Washington: for use of the Engineer Commissioner, District of Columbia*, 1883. Includes block numbers, alleys, parks, major buildings and water soundings.
- **Why compare:** can help reconcile streets, waterfront and urban detail. Be cautious about post-1878 changes and map extent.

### Optional wider-area terrain/shoreline comparison
- Item: https://www.loc.gov/item/88693453/
- Title: *Topographical map of the District of Columbia*, 1883. Includes harbor and reservoir works, terrain relief and proposed engineering projects. **Never mistake proposed work for an 1878 completed feature.**

Library of Congress item pages list digitization options, source data and rights/advisory information. Before incorporating any image into a distributable desktop game, review the **specific item** and actual scan's rights, credits, dimensions and fidelity, including any variants. LOC broadly permits reuse of digital Geography and Map Division material absent a contrary Rights Advisory, but the precise item and derivative still require checking.

## Current six fishing destinations requiring placement
- **29 · Potomac River Fishing Bank** (`potomacFishingBank`), southwestern Potomac waterfront, initial bank provisional.
- **30 · Babcock Lake** (`babcockLake`), near Washington Monument; absent after filling by end of 1888 in the game's current time gate. Verify shore shape and date with historical sources.
- **31 · Fletcher's Cove** (`fletchersCove`), upstream Potomac; check whether the map spans that far west.
- **32 · Georgetown Canal Towpath** (`georgetownCanal`), C&O Canal in Georgetown.
- **33 · Eastern Branch Fishing Shore** (`easternBranchFishing`), Anacostia River near Navy Yard; historically "Eastern Branch".
- **34 · Chain Bridge Riverbank** (`chainBridgeFishing`), upstream Potomac/Chain Bridge; may lie outside a detailed inner-city map.
All six are in the map's **Leisure & Outdoors** category and currently have provisional positions on the **1938 placeholder**. Their public rooms are addressable; **fishing gameplay has not been built**.

## Replacement acceptance checklist (not yet complete)
- [ ] Inspect full-resolution 1876 and 1880 scans, plus 1883 comparison, rather than choosing by publication date alone.
- [ ] Confirm map covers the existing **34 registered pins**, especially Fletcher's Cove, Chain Bridge, northern and eastern outer sites; if not, choose or reconstruct a broader geographic base with suitable inset treatment.
- [ ] Compare **1878-era Potomac shoreline, canal reaches, lake/pond footprints, roads, bridges, neighborhoods, landmarks and river crossings**. Handle Babcock Lake's later filling in game state, not with a static false depiction.
- [ ] Confirm readable lettering at existing zoom levels and sufficiently large raster/resolution for Electron/Linux.
- [ ] Check original scan rights, color/condition and attribution obligations; note exactly which LOC item/version is used.
- [ ] Owner reviews map choice/visual treatment and **approves replacing** the present placeholder before an image is installed.
- [ ] Map-image dimensions/viewport, all **34 existing numbered pins**, per-profile renames/drag positions and category filters tested against new geometry. Avoid changing location IDs or wiping player customizations without explicit approval.
- [ ] Electron full-scale playtest, source regression and manual Linux test candidate follow any approved asset change.

## Handoff and build boundaries
The **source build already at v0.6.86-dev** includes six fishing pins, Leisure/Recreation/Gambling map filters and profile-local renaming; Source QA green at run **40062272284**. Existing map still shows the 1938 placeholder. Owner requested a **Linux test executable after the six-pin slice**, but this request has **not** yet been fulfilled as of this handoff. The build workflow in `.github/workflows/linux-build.yml` is **manual-only** and sets up a private unaccepted draft candidate with SHA-256 and an Electron smoke test. Verify it really ran and succeeded before claiming or sharing a candidate. The owner has now explicitly asked to **update GitHub and hand the thread off**, so this handoff commits documentation only.

**Standing constraints:** Do not split `app.js`, maintain the single `main` branch, keep 1:1 game time and real NPC catch-up rules, don't resurrect 1890 save migration, don't conflate Federal Electric with the game title, don't implement full fishing gameplay in a map-only build, and do not release/tag an unaccepted executable.
