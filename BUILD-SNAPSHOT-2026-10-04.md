# Federal Electric — Build Snapshot — 2026-10-04

This snapshot records the accepted Federal Electric state and the design decisions approved on October 4, 2026.

## Accepted implemented baseline

- Current game version remains **v0.4.0**.
- Development remains directly on **main** unless explicitly changed.
- The approved 1930s executive-office title artwork remains the visual baseline.
- The framed Washington, D.C. wall map is clickable and opens the 1938 **Washington In and Out Guide** in a pan-and-zoom viewer.
- The accepted map implementation includes mouse-wheel zoom, drag-to-pan, reset, keyboard support, backdrop/close controls and mobile sizing.
- The map implementation was accepted by the user as **"Perfect."** Do not alter it without explicit approval.
- The current Metropolitan Ledger title-screen issue opens from its existing hotspot.
- The current newspaper purchase logic charges **3¢ once** to the most recently played profile's **Personal Cash** and records that edition as purchased so it can be reopened free.
- Current radio implementation still contains:
  1. Federal Electric title theme
  2. static frequency
  3. October 30, 1938 Mercury Theatre / Orson Welles *War of the Worlds*

## Title-menu consolidation — implemented

Current title button order:

1. **CONTINUE**
2. **PROFILE**
3. **OPTIONS**
4. **ARCHIVES**

Current behavior:
- Profile combines the former Load Profile and New Profile controls while retaining profile creation, loading and deletion.
- Options replaces Settings and currently opens a reserved placeholder.
- Archives occupies the fourth drawer and currently opens a reserved placeholder; archive content is still planned.
- Only the changed drawer-caption areas are covered by UI overlays so the approved office artwork itself remains untouched.
- No other title-screen layout or artwork change was made in this slice.

## Archives design — planned

- Newspapers appear as dated miniature newspaper/front-page objects and purchased issues may be reopened freely.
- Federal Electric collectible cards use a tall-card gallery concept similar to the Hanafi card-library interaction pattern, with Federal Electric period styling.
- Movie attendance may leave ticket/poster/program/viewing records, but does not grant free replay.
- Other future unlockables may be added only as their collection behavior is designed.

## Newspaper system — current + planned

Current:
- 3¢ first-open charge per edition
- charged to most recently played profile
- Personal Cash only
- same edition is free to reopen for that profile

Planned:
- dozens of dated Metropolitan Ledger editions
- editions advance with the save's historical date
- major handcrafted historical editions plus reusable/generated ordinary issues
- public simulation consequences can appear when appropriate
- skipped/unpurchased issues are not automatically owned
- title-room newspaper eventually reflects the last-played profile's current date/state

## Motion-picture system — planned

- Add a discreet period film canister on the shelf behind the horse and plant near the lamp.
- Placement should be partly obscured and feel discovered rather than advertised.
- Standard admission target: **25¢**.
- Major first-run/premiere target: **40¢**.
- Admission is paid from Personal Cash for each showing.
- Watching a movie simulates theater attendance, not home ownership.
- No pause, rewind, fast-forward, scrubber or resume bookmark.
- The film continues in real time even if the player looks away or changes browser tabs.
- Leaving early means missing part of the film; another viewing requires another paid showing.
- Archives may record attendance but do not provide free replay.
- Exact films/scans require rights verification before use.

## Title artwork refinement — planned, not applied

- Fix only the plant/decanter overlap by adding a small planter/base behind the decanter and redirecting the lower stems.
- Add the film canister separately behind the horse/plant on the shelf.
- Do not change the approved horse, lamp, shelf, clock, fan, or other unrelated title objects.

## Radio architecture — approved future behavior

- **Station 1 / title theme:** always starts at the beginning when tuned in; leaving and returning restarts it.
- **Real broadcast stations:** advance continuously on a station schedule independent of the player. Tuning in joins the program already in progress.
- No listener-specific resume point for live-style stations.
- Station 2 remains static during daylight and is planned to expose period-appropriate Morse material after dark. Exact Morse recording/message is still undecided.
- The Orson Welles/Mercury Theatre frequency will eventually contain multiple story programs, some scheduled only at night such as *Dracula*.
- A separate static frequency is planned immediately after the Orson Welles station using the user-supplied static recording. It is not yet in the repository.
- Period broadcasts and news interruptions should remain historically appropriate.

## Documentation synchronized

On this snapshot date the following were updated to match the current approved direction:
- README.md
- ROADMAP.md
- DECISIONS.md
- HISTORICAL-NOTES.md
- BUILD-SNAPSHOT-2026-10-04.md


## Daytime city ambience — implemented

- Added the 3:43 **R25-11-1930s Urban Traffic** ambience as a quiet looping title-screen background layer.
- It plays only while the title room is in its real Washington, D.C. daytime state and stops at night.
- Mix level is **7%**, intentionally well below the title radio.
- The ambience is independent of radio tuning/power and also stops when leaving the title screen.
- Source recording: craigsmith / Freesound 479574, CC0.


## Radio engine upgrade — implemented

- Vendored **Howler.js Core 2.2.4** under `vendor/howler/` with its MIT license.
- Added `radio/radio-engine.js` as the Federal Electric broadcast-clock playback layer.
- Added `radio/stations.js` as the single station/programming definition file.
- Title-screen tuning, power and game PAUSE now call the radio engine instead of maintaining separate hidden `Audio` elements in `app.js`.
- Radio OFF controls speaker audibility only for live-style stations. Their broadcast position is calculated from the station clock.
- Game PAUSE is a master title-audio pause. PLAY resynchronizes live stations to the point their clock has reached.
- Added a transient station identifier above the radio after tuning.
- Current fictional lineup:
  1. **610 AM · Federal Electric Network** — Federal Electric title theme; restarts at 0:00 on every tune-in.
  2. **540 AM · Capital Signal** — daytime static / experimental signal; nighttime Morse programming remains planned.
  3. **720 AM · Capital Radio Theatre** — Mercury Theatre / Orson Welles drama and talk frequency.
  4. **880 AM · Capital Melody** — user-supplied 1930s music program.
- The complete 2:12:58 music recording was preserved untouched and a **64 kbps / ~61 MB** game-streaming copy was produced for Capital Melody.
- The user's Orson Welles MP3 and the radio-optimized Capital Melody MP3 are staged in the Google Drive folder **Federal Electric Radio**.
- Current connected Drive tooling cannot grant unrestricted public-link permission. Treat the Drive URLs in station configuration as staging until a stable public/link-access host is confirmed.

## Mobile title-audio mix — current

- Washington daytime street ambience remains **7% on desktop**.
- Mobile street ambience is **2%**.
- Radio and ambience remain independently mixed.
- Future work may add mobile-specific radio gain and conservative EQ/compression after iPhone speaker/headphone testing.
- Physical speaker routing stays under iOS/browser control; Federal Electric will tune its mix rather than attempt to select a hardware speaker.
