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
