# Federal Electric — Build Snapshot — 2026-10-05

This snapshot closes the October 5, 2026 title-screen / Washington-office build and records the accepted baseline before work moves to a new thread.

## Repository / release baseline

- Repository: `dereksparks1982/federalelectric`
- Branch: **main**
- Game version: **v0.4.0**
- Code baseline before documentation closeout: `4c645b2489b62b999fbb27c855002ddd710f90cf`
- GitHub Pages deployment for that code baseline: **SUCCESS**
- Work remains repo-first, one isolated slice at a time, with no unrelated changes.
- Discussion/research is not authorization to change the game. Only an explicit build/fix/change/implement/revert/restore instruction authorizes mutation.

## Accepted title-screen visual baseline

- Approved day and night executive-office artwork remains authoritative.
- Do not alter unrelated approved objects when adjusting a hotspot or behavior.
- Playthrough phase controls the office environment:
  - Business Day → day office
  - Washington Night / Daily Report → night office
- Weather does not select the title background.
- Night automatically sets the fan OFF; manual fan control remains available.
- The live wall clock still shows real Washington, D.C. time. No in-game analog-clock mapping has been approved.

## Title menu

Current filing-cabinet menu:
1. CONTINUE
2. PROFILE
3. OPTIONS
4. ARCHIVES

- Filing-cabinet labels were enlarged for desktop and more aggressively for mobile.
- Brass plaque geometry and approved title artwork were not resized or redrawn.
- Filing-cabinet opening sound remains attached to the four cabinet controls and obeys master pause.

## Step Away From Desk

- **Step Away From Desk** is implemented on Executive Summary.
- It opens the office/title hub from a loaded playthrough without freezing the world.
- Eligible factory production and market/world time continue while the player is away from the desk.
- Continue returns directly to the desk.
- Ordinary startup title screen still blocks playthrough simulation.

## Developer panel

The title DEV PANEL is draggable, collapsible and session-only.

Controls:
- Day / Night
- Infinite Money
- Freeze Time
- Show Hotspots
- Outside Noise
- Reset Overrides

Important behavior:
- Infinite Money uses 999,999,999 for testing but preserves the player's real saved company/personal balances.
- Outside Noise toggles only the city/street ambience. It does not shut off radio, fan, clock, newspaper or cabinet sounds.
- Reset Overrides restores the normal environment/testing state.

## Washington wall map

Accepted current map behavior:
- 1938 Washington In and Out Guide viewer
- pan and zoom
- Reset View
- six numbered Federal Electric location markers
- always-visible location labels, including mobile
- clicking a marker opens the location detail card
- Edit Pins / Done Placing
- draggable marker placement
- automatic localStorage persistence of marker positions
- Reset Pins restores code defaults

Do not remove the click-for-details card when working on marker labels or editing.

Current code defaults remain approximate and saved local positions override them. The player has manually positioned some pins. Reset/move pins only when explicitly requested.

Discovery-gated location information was discussed but is **not implemented**.

## Current title radio and audio baseline

Current stations:
1. **610 AM · Federal Electric Network** — title theme; restart-on-tune exception
2. **540 AM · Capital Signal** — daytime static/experimental signal; separate night sequence
3. **720 AM · Capital Radio Theatre** — *War of the Worlds* daytime program; *Dracula* night program
4. **880 AM · Capital Melody** — daytime 1930s music; separate night sequence
5. **1010 AM · Capital News Service** — current long-form news program

Rules:
- Do not revive the abandoned Howler / separate radio-engine refactor without explicit approval.
- Proven playback remains in `app.js`.
- Live-style stations advance from a shared title-session on-air epoch.
- Radio OFF controls audibility, not a personal resume point.
- Master PAUSE stops the entire title soundscape; PLAY resumes it.
- Station popup shows frequency + station name only.

Current implementation mix:
- day outside ambience: 7% desktop / 2% mobile
- night outside ambience: 14% desktop / 5% mobile
- radio: 38%
- fan: 15%
- clock: 8%
- filing cabinet: 22%
- newspaper rustle: 18%

These are current constants, not a final locked mix.

## Audio/assets currently wired locally

Notable title assets include:
- `assets/audio/sunflower-slow-drag.ogg`
- `assets/audio/radio-static-station.mp3`
- `assets/audio/mercury-theatre-war-of-the-worlds.mp3`
- `assets/audio/orson-welles-dracula-1938-github.mp3`
- `assets/audio/capital-melody-1930s.mp3`
- `assets/audio/capital-melody-night-github.mp3`
- `assets/audio/pepsi-jingle-commercial.mp3`
- `assets/audio/cocoacola-audio-2.mp3`
- `assets/audio/station-5-newscast.mp3`
- `assets/audio/freesound_community-street-at-night-with-cars-49378.mp3`
- `assets/audio/hasin2004-fan-sound-247413.mp3`
- `assets/audio/clock-ticking-trimmed-1m58s.mp3`
- `assets/audio/filing-cabinet-open.mp3`
- seven derived newspaper-rustle clips

Large media may be staged in Google Drive when useful, but the current browser playback paths above are the accepted repo implementation.

## Gameplay systems preserved

This title-screen work did not authorize rewrites of the existing gameplay systems. Preserve:
- 4 turns/month, 372-turn main campaign
- 60-minute Business Day + 60-minute Washington Night
- Executive Desk / Factory / Markets & News / Journal / Pastimes navigation
- Warehouse/manual shipment separation
- production queue and production-lot system
- Federal Exchange and stock history
- horse, dog and midget-car racing
- licensed boxing
- backroom poker and underworld systems
- Daily Report and local profile saves

## Current stabilization queue

Completed:
- poker betting-round closure / all-in / side-pot pass
- poker window-close / quit settlement pass

Next:
1. **Audit and rebalance bulb economics, payroll, contract prices and 1938-scale costs.**
2. Correct selected production-grade material/cost consumption.
3. Audit partial shipments, wrong-grade settlement, replacement inventory, deadlines and repeated late penalties.
4. Reset/schedule Star Club raids correctly.
5. Preserve typed Federal Exchange quantities across five-second rerenders.
6. Historical/name verification pass for 1938 Washington.

No economics rebalance was applied in this closed title-screen build.

## Design notes discussed but not implemented

- Commerce Club may become a once-weekly airport-hangar poker game at Washington-Hoover Airport.
- Benning Race Track may remain open in the game's alternate 1938 history.
- Federal Electric factory placement is conceptually suited to Ivy City / New York Avenue NE near the rail/warehouse district.
- Discovery-gated map details remain future design.
- Longer day/night clocks and travel-time redesign remain discussion only.

## Closeout

This build is closed. Start the next thread from this snapshot and `HANDOFF-2026-10-05.md`. Do not reinterpret discussion from the previous thread as authorization for new repo changes.
