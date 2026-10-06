# Federal Electric Build Snapshot — 2026-10-06

## Build identity

**v0.5.0 — CLOSED EXCEPT FOR OPEN iPHONE RADIO REGRESSION**

Accepted gameplay/code baseline before documentation closeout:
`46d8b4d565cb1ee5e7f3695e9df40628fd4bf56a`

GitHub Pages deployment for that baseline: **SUCCESS**

This snapshot closes the October 6 radio/title-control and factory-delegation build. The next development line is expected to be **v0.6.0-dev**, but no v0.6 gameplay changes are part of this closeout.

## Major accepted changes since v0.4.0

### Player-facing radio

- persistent radio stays fixed while gameplay pages scroll
- draggable from the station frequency/name display
- drag works with mouse/pointer and touch
- desktop drag area uses the four-direction move cursor
- previous and next station controls flank the readout
- volume controls are **down → up → numeric value**
- volume changes in 5-point steps
- desktop fresh-load default: **40%**
- desktop fresh-load default remains **40%**
- mobile radio startup/volume is **OPEN**: the current iPhone build does not start the 610 AM title music
- the failure appeared after routing radio audio through an iOS Web Audio GainNode; deferring that graph until first gesture did not fix the real-device failure
- radio volume is session-only
- old floating station label removed
- old speaker-area power hotspot removed
- redundant DEV-panel radio controls removed
- physical title-radio tuning dial remains interactive

### Mobile audio simplification

At mobile/title widths, the title room suppresses:
- city/street ambience
- fan audio
- clock ticking

The radio/music path remains available so one phone speaker is not carrying several competing ambience layers. Desktop retains the richer title-room soundscape.

### DEV/title editing

- DEV panel remains desktop-only
- title hotspot editor can select/move/resize CONTINUE, PROFILE, OPTIONS and ARCHIVES
- fine movement/size controls remain available
- hotspot geometry can be saved locally
- individual reset and confirmed override reset remain available
- approved title artwork itself was not redrawn for these controls

### Washington map

- six numbered location pins
- always-visible labels
- click-for-details cards
- pan/zoom/reset
- Edit Pins / Done Placing
- local saved pin positions
- **Star Club** naming retained for pin 2

### Factory delegation / management

- Foreman Sullivan routine morning auto-start foundation
- explicit serious/non-routine holds
- management alert system
- paid General Manager
- General Manager competence and reliability
- delegated serious-breakdown containment can fail
- management-neglect foundation
- unresolved serious problems reduce output and can pressure morale/discipline
- clean days and resolutions reduce neglect

Customer loss, layoffs, cash-pressure escalation and possible plant closure remain future work.

## Gameplay systems preserved

The closeout keeps the existing:
- 4 turns/month and 372-turn main campaign
- 60-minute Business Day + 60-minute Washington Night
- Executive Desk / Factory / Markets & News / Journal / Pastimes structure
- Warehouse/manual shipping model
- production queue and production lots
- Federal Exchange and stock history
- Metropolitan Ledger and Archives
- local profiles/autosave
- horse, dog and midget-car racing
- licensed boxing
- poker and underworld systems
- Daily Report
- company/personal cash separation

## Historical / alternate-history boundary

Historical facts continue to be sourced where the game uses real people, institutions or events.

Federal Electric's later mayoral path is explicit alternate history: the game's Washington retains the old presidentially appointed mayoralty so the player may eventually pursue appointment after building sufficient influence.

## Open iPhone radio regression at handoff

Real-device result:
- other title-screen sounds work on iPhone
- starting 610 AM title music does not start
- latest attempted fix did not restore it

Change history:
- `3af5c654`: mobile nominal default 20%
- `9a62884e`: desktop 40%, mobile 20%
- `5f30f40e`: added iOS Web Audio GainNode attenuation; startup music then disappeared on iPhone
- `e2f7eda4`: deferred gain graph until first gesture; deployed successfully, but iPhone startup music is still absent

Proposed recovery:
- first revert only the iOS Web Audio routing to the direct playback state from `9a62884e`
- verify starting music on Derek's iPhone
- then solve loudness independently, preferably with mobile-specific pre-attenuated audio files so attenuation is baked into the waveform and does not interfere with iOS autoplay
- keep PC at 40%
- do not combine this recovery with unrelated changes

## Known next-build targets

Carried forward, not implemented in this closeout:
1. **restore iPhone starting radio music and then re-address mobile loudness without breaking playback**
2. broader fallible delegated-management judgment calls and incidents
3. customer/cash/layoff/closure escalation from prolonged neglect
4. Washington influence / power-broker progression
5. later presidential contact and alternate-history mayor appointment path
6. hand-curated GTA-style radio programming with announcers, IDs, commercials, news, static and secret content
7. film-canister / Motion Picture work only after explicit approval of the exact title-art edit

## Closeout

This build is closed. Start the next build from `v0.5.0`, `HANDOFF-2026-10-06.md`, and this snapshot. Discussion from the closed build does not automatically authorize new repo changes.
