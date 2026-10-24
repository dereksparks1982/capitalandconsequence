# Washington Guide Map Pin Audit · October 24, 2026
**Project:** Capital & Consequence · source build, not an accepted Linux release.

## Immutable map and coordinate system

The sole visual source is the owner's supplied **Washington In and Out Guide** image
`assets/artwork/maps/title-map-1938.jpg`, resolution **2048 × 1159**.
The game's alternate-history map is fixed across 1878, 1938 and every playable year.
Its printed map occupies approximately image pixels **x 286–1778, y 30–864**,
with **columns 1–30** and **rows A–R**. The margins contain the guide's index and
other reference panels; they are not geographic ground.

Map-grid references are generated from the saved pin/image coordinates, not
assigned through a modern latitude/longitude lookup. They describe where the pin
currently sits. **A grid reference is not proof that the place has been verified.**
The printed map's right-hand index and individual illustrated landmarks take
precedence over approximate street/block deductions.

The registry retains all **34 original numbered destinations and IDs**.
Pins are **red when the destination is historically real** and **blue when the
destination is invented**, even if the fictional venue occupies a real building.
Unverified markers have dashed borders. Unplaced markers outside the printed
image are listed in the location directory and appear for manual repositioning
when Edit Pins mode is on, rather than pointing at the printed legend.

## Current full registry

| Pin | Destination | Identity | Current map grid | Evidence level | Geographic evidence / open issue |
| ---: | --- | --- | --- | --- | --- |
| 1 | Federal Electric Factory | Blue · fictional | 20-I | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 2 | Star Club | Blue · fictional | 12-I | address / area only | Hay-Adams site at 16th and H NW; fictional Star Club |
| 3 | Capital Race Grounds | Blue · fictional | 29-L | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 4 | Neighborhood Game | Blue · fictional | 11-B | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 5 | Commerce Club | Blue · fictional | 9-O | address / area only | Washington-Hoover Airport grounds; fictional Commerce Club hangar |
| 6 | Embassy Room | Blue · fictional | 5-D | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 7 | Chinatown | Red · historical | 16-J | address / area only | Pennsylvania Avenue NW, 4th-7th Streets; historical neighborhood |
| 8 | Russian Trade Hall | Blue · fictional | 10-H | address / area only | Dupont Circle / Massachusetts Avenue NW; fictional hall |
| 9 | D.C. World’s Fair | Blue · fictional | 14-N | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 10 | Capitol Airport | Blue · fictional | 29-J | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 11 | University of Maryland | Red · historical | 27-B | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 12 | Our Home | Blue · fictional | 19-L | address / area only | Capitol Hill near Eastern Market; proposed fictional residence |
| 13 | Hillsdale | Red · historical | Outside map | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 14 | Stockbroker | Blue · fictional | 17-K | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 15 | Second Nightclub | Blue · fictional | 12-L | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 16 | Government Hospital for the Insane | Red · historical | 25-R | printed landmark | St. Elizabeths hospital complex, printed near south edge |
| 17 | Potomac Kennel Track | Blue · fictional | 30-N | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 18 | Capital Speedway | Blue · fictional | Outside map | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 19 | Licensed Gaming Hall | Blue · fictional | 16-K | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 20 | Private Prizefight Venue | Blue · fictional | 17-M | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 21 | Private Cockfighting Circle | Blue · fictional | 21-L | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 22 | District Asylum | Blue · fictional | 27-R | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 23 | White House | Red · historical | 12-J | printed landmark | The White House, printed on map, 12-I/J |
| 24 | Washington Arena | Blue · fictional | 19-K | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 25 | Washington Airport | Red · historical | 9-P | printed landmark | Washington Airport, named on map, Arlington |
| 26 | Metropolitan Police | Blue · fictional | 18-M | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 27 | Western Livery and Carriage Yard | Blue · fictional | 2-M | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 28 | Eastern Livery and Wagon Works | Blue · fictional | Outside map | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 29 | Potomac River Fishing Bank | Red · historical | 13-M | address / area only | Southwest D.C. Potomac Park shore; precise fishing bank unsettled |
| 30 | Babcock Lake | Red · historical | 15-N | unverified | No verified address or printed landmark; retain old default only as an editable draft. |
| 31 | Fletcher’s Cove | Red · historical | 5-I | address / area only | North bank of upper Potomac; precise Fletcher cove entry not labelled |
| 32 | Georgetown Canal Towpath | Red · historical | 7-I | printed landmark | C&O Canal along Georgetown north bank (route, not surveyed entrance) |
| 33 | Eastern Branch Fishing Shore | Red · historical | 24-M | printed landmark | Anacostia shore beside the Navy Yard (bank, not surveyed entrance) |
| 34 | Chain Bridge Riverbank | Red · historical | 5-I | address / area only | D.C. bank at mapped Chain Bridge; fishing access not labelled |

## Implementation / retention

- **Printed landmark**: placed on an illustrated building, labeled property,
  or named shore/canal feature visible in the supplied map. A riverbank point
  is not a verified fishing entrance merely because the water is drawn.
- **Address / area only**: relocated to a specified district, street intersection
  or river reach, but the individual fictional room/building or public entrance
  is not printed. Not declared historically verified.
- **Unverified**: still has its previous default value to avoid erasing pin identity.
  A newly invented address was **not** assigned. The coordinate must be confirmed
  from the right-hand index / grid or an owner-approved fictional address.
- Profile-specific positions and renamed labels use the existing V2 key,
  `federalElectricTitleMapLocationsV2:<profile>`. Saved positions override new
  defaults without an automatic reset. Export Pins produces an exact per-profile
  JSON listing that can be used in future alignment reviews.
- The location card remains editable; its own pointerdown is stopped before the
  viewport captures a map drag. No viewport pan/zoom behavior was redesigned.
- Category filters, historical/fictional filters, and text/grid search operate
  together; the city directory shows the matching registered destinations.
- No map asset, world era logic, NPC clock, city/room IDs or alternative map
  was changed. This is **not** a claim that all 34 exact addresses are solved.

## Open verification work

The owner specifically requires exact placement using the **right-hand map
legend plus numbered-lettered grid**, rather than guessed pixel percentages.
Unverified fictional establishments need an owner-approved lot or street
intersection. Historical destinations not individually labeled by this
particular pictorial map need matching index references; some sites are beyond
the drawn area. Never substitute modern street data or change the map image
just to force an answer.

The guide also depicts other genuine landmarks (including McMillan Reservoir
and Kingman Lake) that are **not** separately registered as new destinations
in this 34-pin build. The historical Babcock Lake game location remains with
its date-based closure; the 1938 artwork does not prove a visible lake survives.

## Acceptance checklist before desktop test release

- [x] Keep original map and all 34 stable location IDs.
- [x] Tag every location with real/invented origin and map evidence level.
- [x] Re-anchor identified printed sites and grounded street/shore areas.
- [x] Add search, origin/category filters, grid references and a searchable directory.
- [x] Protect rename-field clicks without rewriting map movement.
- [x] Keep prior user placements and custom names; add JSON export.
- [ ] Match remaining unverified sites to the actual legend/grid or an approved fictional address.
- [ ] Run full source test suite on an Ubuntu checkout.
- [ ] Complete an Electron hands-on test for search, clicking name input,
      moving pins, export, saved profiles, room navigation and red/blue colors.
- [ ] Offer an executable only after the above testing and owner review.
