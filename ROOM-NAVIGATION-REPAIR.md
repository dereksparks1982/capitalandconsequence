# Go There navigation: repair and future room playbook

**Project:** Capital & Consequence · **Recorded:** October 25, 2026  
**Owner status:** The owner reports that ordinary map navigation now works after the final direct local patch. This is confirmed user-observed behavior. The **single exact root cause was not isolated**, and there is no claim of a full accepted release.

## Symptom and decisive comparison

The Washington map opened Star Club (#2)'s information card, but **Go There** left the player on the map with the Executive Desk beneath it. Other map locations also failed. The developer panel could, however, open **Star Club → Star Club Salon → Go to Room** successfully. The location and room registrations, existing UI and renderer were therefore usable. The defect lay somewhere along ordinary map interaction, permission checks, scene transitions or installed package synchronization.

### Source entry points

| File / function | Role |
| --- | --- |
| `city.js` / `LOCATIONS`, `defaultRoom`, `rooms[]` | Stable location and room IDs; player-facing room names; restrictions. |
| `app.js` / `initTitleMapViewer`, `#titleMapLocationTravel` | Bind the map card's Go There button. |
| `app.js` / `travelFromTitleMap` and `enterMapDestination` | Resolve destination; conduct player access checks; open/commit travel. |
| `app.js` / `openSelectedTitleDevRoom` | Known-good developer navigation to individual rooms. |
| `app.js` / `openCityRoom` and `renderCityRoomDirectory` | Render the full building interior and select an actual room. |
| `app.js` / `mapTravelRestriction`, `FE_PATROL`, `FE_VENUES`, `FE_CITY_ACCESS` | Normal profile/era/invitation/duty/staff-room access; do not bypass. |
| `index.html` / `#cityRoomOverlay` and `styles.css` / `body.city-room-open` | Full-screen scene, independent from the map and the office. |
| `resources/app.asar` | Actual game resources loaded by the existing Linux launcher; loose source edits alone are not sufficient. |

## Reproduction, repair and evidence

1. The original map pin/card system and room renderer were separate. The developer panel's `openCityRoom(locationId,roomId,{dev:true,source:'dev'})` worked, while ordinary `Go There` did not.
2. **Early failed attempts:** guessed map/pin patches, forced overlay visibility, and a patrol guard change. Syntax validation and successful repackaging were reported prematurely as fixes. The owner retested and still could not enter any map location.
3. **Successful combined approach:** before rendering, validate ordinary player access to the location and selected room. The current transitional bridge uses the developer panel's known-working `openCityRoom(...,{dev:true,source:'map'})` rendering path, **then immediately** sets `cityRoomSession.dev=false`, commits `S.currentLocation={locationId,roomId}`, and refreshes the ordinary permission-controlled room directory. The normal player never receives a persistent developer session.
4. Check the room really rendered: `#cityRoomOverlay` is visible and `dataset.locationId` matches the clicked building. The scene becomes a direct body child with `body.city-room-open`. Close the map; do **not** leave the desk as the visible room background. Entry should work even if the autosave already lists that location.
5. Restore gameplay bookkeeping after successful entry: actual travel cost/horse custody where applicable, visited-site leads, `save(true)`, and NPC clock sync **without NPCs independently advancing game time**.
6. Protect interactive card controls from map viewport pointer capture. The final source isolates the Go There button's pointer and click handlers, including click capture, without disabling legitimate map panning.
7. Install changed `app.js` into **the existing** `resources/app.asar` and launch the actual executable. Download-based attempts failed because the files were not present in Downloads; `test -f file && python3 file` exits silently if the file is absent. The direct terminal patch avoided the missing download and updated the archive in place.
8. **Owner then confirmed the navigation works.** Do not confuse that observation with proof that any single guard, event listener, or archive path was independently the sole cause.

**Architectural caution:** The `dev:true` rendering call is a *transitional workaround*, not permission to enable developer access in gameplay. The long-term desirable design is a pure renderer separated from the permission/arrival layer, but **no such refactor is authorized by this documentation request**. Tests must keep unauthorized room entry blocked, and ensure `dev:false` before continuing normal play.

## New-building / new-room checklist

1. Keep the **same immutable Washington map** for every year. An additional room in an existing building belongs in `city.js` under its existing location ID, not at a newly invented map pin.
2. Give every new room a stable unique ID, human-readable name, description, explicit `restricted` state when relevant, and a real owner-approved permission condition. Define or preserve a reachable `defaultRoom`.
3. **Developer-panel diagnostic first:** verify each room renders with the correct title and directory. This only checks rendering, not gameplay security.
4. **Ordinary map acceptance second:** profile → Washington map → numbered location → card → **Go There** → full-screen interior with no Executive Desk or map showing. Check this again when the save says the player is already there.
5. **Room-to-room acceptance:** ordinary directory buttons reach publicly allowed rooms; a restricted office/private suite remains inaccessible without an authorization; authorized entry works; the normal session is `dev:false`.
6. **Navigation back:** Return to Map shows the map; Return to Personal/Executive Desk requires explicit choice; no room should be a passive popup over the desk.
7. **Autosave, time and economy:** location and selected room persist after reload; charges are assessed once; room activities use protagonist-initiated time, not independent NPC ticks.
8. **Pointer / keyboard:** map card controls can be clicked and activated by keyboard; the map pan/zoom and confirm-to-move pins still work elsewhere.
9. **Verify the actual running package:** compare the packed `resources/app.asar` content to modified source, launch the original `capital-consequence`, run local source tests and real Electron smoke/owner click-through. A syntax pass is **not** an end-to-end gameplay pass.
10. **Do not claim success early.** Report four stages separately: source committed, archive installed, actual packaged Electron interaction tested, and owner acceptance. No GitHub Actions.

### Specific regression scenarios

- Star Club pin #2 → Go There → **Star Club Salon**; map and Executive Desk disappear.
- Star Club displays six registered rooms (Salon, Main Parlor, Dining, Brandy, Madam Star's Private Office, Private Rooms). Four normal rooms reachable; two private rooms permission-gated.
- A single-room building can be entered from its pin and from the location directory.
- Restricted or closed destination refuses access **with a visible reason**, without changing saved location.
- Entering an already-visited location actually reopens it.
- Player `locationId` and `roomId` autosave; reload, Return to Map, and interior room changes work.
- Developer-panel Go to Room still works, but never bestows extra access in a normal visit.
- Tests: `node tests/map-go-there.cjs`, `npm run test:source`, relevant Electron `--smoke-test`, **and** manual input in the same Linux launcher used by the owner.

## Proposed NEXT build (not yet approved)

**N1: Star Club playable social-room slice**, leveraging the repaired room navigation.

- Implement meaningful but bounded interactions in the four publicly accessible rooms: Salon introductions, Main Parlor conversation, Dining Room meals, and Brandy Room refreshments/social encounters. Keep personal spending, encounter memory, action time and saves tied to actual existing engines; no imaginary automatic time jumps.
- Retain access checks on Madam Star's Private Office and Private Rooms. Do not turn player map travel into permanent dev access.
- Respect 1878 canon: sophisticated background parlor/classical music, NOT modern jazz or a floor show; **no cards or poker at the Star Club**.
- New food/drink prices, access prerequisites and undeveloped NPC biographies need owner decisions before implementation; do not invent authoritative economics.
- Validate entry from the map, switching rooms, restricted entry refusal, repeat purchases, NPC encounters, autosave/reload, clock behavior and actual Electron input **before** any local packaging or acceptance.
- Exclusions: no map swap, no new standalone Linux executable, no new location pin, no club gambling, no GitHub Actions. Keep all other careers intact.
- The separate government-sanctioned **D.C. Poker Challenge** remains a future G4 slice at its own venue.

**This is documentation and proposal only. No gameplay code build has been authorized.**
