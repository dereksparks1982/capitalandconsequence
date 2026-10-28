> **Latest map UI correction, October 28, 2026:** This document contains earlier design ideas and should be read after the current [Map Canon](MAP-CANON.md), [v0.6.90 release notes](docs/RELEASE-NOTES-v0.6.90-dev.md) and [owner decisions](DECISIONS.md). The numbered pins do **not** get shifted to avoid collisions: white dots, leader lines and offset/tether display were expressly rejected. The original Washington map art is fixed. Forty pins remain mapped, with hover/focus labels and the complete directory, and black pins indicate property under genuine owner control. The steelworks, railroad, merchant shipping and fishing-vessel businesses now have initial gameplay in source, but full Node/Electron verification remains outstanding.

# Washington Living City, Venues, Commerce and Map

**Scope:** Single Washington city in 1878 and later eras. **Design** where not explicitly marked current source.

## Preserve the map, always

The owner's 2048×1159 Washington In and Out Guide map at `assets/artwork/maps/title-map-1938.jpg` is **permanent for 1878, 1938 and all other years**. No new map, redraw, map-image swap or replacement historic map. Preserve printed **A–R / 1–30 grid**, original printed legend, all numbered pins, profile-local editable names, zoom/drag with explicit confirmation, search, directory, Fiction/Non-Fiction textual badges, source links, and filters. The current **40** numbered pins stay. New independently important storefronts get new pin numbers; verify against the existing grid and describe fictional locations as fictional.

### Planned category colors, **not yet source behavior**

| Color | Meaning |
| --- | --- |
| **Gold** | **Government only**: White House, police, courts, actual government institutions |
| **Red** | Shops, butchers, bakeries, markets, other commerce |
| **Blue** | Entertainment/social: Star Club, Lui's cabaret, poker rooms |
| **Brown** | **Hillsdale / Barry Farm** community sites |
| **Green** | Parks, gardens, schools and universities |
| **Purple** | Religion |
| **Charcoal** | Industrial works, Federal Electric and warehouses |
| **Teal** | Fishing banks, water and outdoor recreation |
| **White** | Private healthcare, private District Asylum |
| **Gray** | Residential, hotels, lodging |

The real/fake origin must be **text and filterable metadata, not red/blue color meaning**. Hillsdale brown can take priority for neighborhood commerce; genuinely governmental sites may use gold with a brown neighborhood cue. Color priority needs UI tests, not wholesale loss of other filters. Star Club **blue**, regardless of its presidential founding; private District Asylum **white**, not gold.

## Businesses and neighborhood life

**Capital Meats**, separately owned east-side butcher, proposed **20-J** near historical Eastern Market #37, but **not a stall inside Eastern Market**. **District Meats**, separately owned west-side butcher, proposed **6-H** near historical Georgetown Market House #38, **not a market stall**. Their individual white proprietors refuse to serve **Sam Harlan** in or out of uniform; other white merchants should not automatically share this behavior. Owner names not yet chosen. **Medford Meats was rejected.**

**Chinatown #7** maintains meat and general provisions on Market Street; vendors serve Sam. Existing shared finite player/NPC stock, payments, tills and supplier delivery code must not be discarded.

**Hillsdale / Barry Farm #13**, historically Black neighborhood called *Blacktown*, needs a **distinct Black-owned butcher and a distinct Black-owned general market**, each a business with its own inventory, workers and new pin. Also bakery, grocery, general store, barber, cobbler, blacksmith, livery, doctor, apothecary, school, church, social/community hall, boardinghouse, residences. Residents should satisfy most ordinary needs locally **without being forced to remain inside the neighborhood**. Research historic premises when possible; otherwise invent transparently fictional, period-plausible stores. Neighborhood display/legend should read **Hillsdale / Barry Farm** but keep stable internal ID.

## Nightlife and high society

**Star Club:** **Eleanor Victoria “Madam Star” Ashcroft**, British, exact presidential founder unselected. Wealthy diners, proper meals, sophisticated drinks, stringent rules, unobtrusive musicians, confidential adult social arrangements. **No cards. No poker. No formal floor show.** Six-hour stays possible through several interactions. In 1878, music is salon/parlor/classical, not prematurely jazz.

**Lui's nightclub:** **Lucien Étienne “Lui” Delacroix**, French, gay, exuberant, Eli Crowe's employer. A French can-can and burlesque/cabaret revue, singing, dancing, dining, liquor, and more dangerous private vice. The hidden activities require earned discovery; respectable politicians would not normally be openly seen there. Existing code room remains `secondNightclub` until updated; public club name unselected.

**Embassy Room:** High-wealth, high-stakes invitation-only poker, fictional site at Chevy Chase Club vicinity on existing pin #6. **Harrison Vale** helps with introduction. Separate from Star Club. The actual club was founded later than 1878, so this in-game earlier location is alternate-history canon. **Commerce Club** and **Boiler Room** are separate social poker circles. Their clientele reflects period class and racial exclusion in individual institutions. Private rooms remain access-controlled.

## Political, civic and market extensions

**Wormley's Hotel** (historic owner **James Wormley**), **Willard Hotel**, Capitol and White House are candidates for believable political encounters. Add access-aware rooms and researched locations on the unchanged map when authorized. Preserve existing six fishing pins (29–34), Monastery (35), Cobbler (36), Eastern Market (37), Georgetown Market House (38). The actual public market/repair rooms are largely shells: **do not claim they already sell or repair goods**.

Every shop's expansion should use shared persistent personal cash, stock, supplier and NPC movement; working hours and remembered interactions, **never free generated purchases**. NPC activities only respond to player-led clock changes.
