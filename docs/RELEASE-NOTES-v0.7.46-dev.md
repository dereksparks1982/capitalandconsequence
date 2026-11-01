# Capital & Consequence v0.7.46-dev | Character Needs, Break Limits and Factory Presentation

**Source development:** 31 October 2026  
**State:** Repository changes on `main`, **not** an accepted, packaged or Linux-playtested release. No GitHub Actions or user terminal commands.

## Design decision: natural human needs, not a choice prompt

The owner clarified that hunger/thirst notifications should tell the player how the character feels, **not** offer a list of destinations or a button to teleport home, to a restaurant, or to a café. Players decide what to do and travel under the normal Washington map/room rules.

- A new `character-needs.js` service tracks **Hunger, Thirst, Energy (0–100)** with the authoritative saved Washington `worldCalendar.worldMinute`. All characters can develop needs as the calendar progresses. **No parallel time source, real-world timers, or offline progression**.
- Starting meters: hunger 82, thirst 85, energy 80. Working development rates per game minute: hunger -0.12, thirst -0.18, energy -0.085. Threshold messages at hunger/thirst 40, fatigue 32. Values and warnings persist in each character's existing save.
- Text-only, non-modal alerts appear on threshold crossing. A warning will not repeat each minute; it resets only after a significant recovery. No destination buttons, options, navigation links, or forced interruption.
- New `character-needs-ui.js` and `character-needs.css` display the condition warnings without changing the existing Washington status banner or location UI.
- The executive desk and factory break room can display current needs meters. These are informational, not mandatory menus.
- This early system does **not** yet provide a completed food supply chain, home cooking, cafe/restaurant orders, food inventory, NPC food purchasing, sleeping, or meal schedules. Those require location-based gameplay that respects route access, personal spending and time. Do not claim otherwise.

## Four anti-spam break choices

The executive office offers four locally available activities: **coffee, water, small snack, rest break**. Each uses five Washington minutes at the desk. The existing factory break room retains its prior item costs/durations (including tea and biscuit), and adds a small snack. Factory tea uses coffee's cooldown and biscuit uses snack's cooldown.

| Action class | Personal lockout after use | Immediate meter benefit |
|---|---:|---|
| Coffee | 180 game minutes | Energy +17, Thirst +5 |
| Water | 60 game minutes | Thirst +30 |
| Small snack | 180 game minutes | Hunger +21, Energy +4 |
| Rest break | 90 game minutes | Energy +13 |

**Shared lockout: 90 game minutes after any one break.** Switching among items or moving from the executive office to the factory break room cannot circumvent it.

- Before spending time or personal cash, every action checks the physical room, actual playable route, phase/clock availability, and both shared and item-specific cooldowns. Disabled buttons show the next available Washington time.
- The authoritative existing time-advance service charges the activity only on a successful action, then the same saved needs service registers cooldown and meter restoration.
- Cooldowns are stored as absolute Washington minutes **even for 1878**, whose dates are negative relative to the Unix epoch. They persist across scene changes and save/load rather than resetting with the browser or the next game day.
- Factory coin-operated items continue to charge **personal** cash, never company cash.
- Hunger/thirst meters currently produce notifications and recover from break items, but do not yet impose penalties on machinery, employee wages or other gameplay without a designed balancing pass.

## Future factory presentation: room first

Recorded owner's agreed future screen design in **`docs/FACTORY-ROOM-FIRST-MANAGEMENT-BELOW-2026-10-31.md`**.

The actual **top-down factory room appears first**. The existing production/management controls remain **below the room**, reachable by scrolling, grouped into **independently collapsible sections** whose disclosure state should persist. Preserve working functions, approved artwork, existing map pins, and the always-visible clock. **This visual factory-screen redesign is documented for later, not claimed built in v0.7.46.**

## Source QA

- Added `tests/character-needs.cjs`: game-clock decay, 1878 negative minute handling, warnings, shared and individual cooldowns, switching locations, persisted saves, and legacy save initialization.
- Added `tests/character-needs-integration.cjs`: verifies desk and factory both use one service, validates pre-spend guards, all four desk buttons, and no notification destination menu.
- Both focused tests passed in a JavaScript compatibility harness using current GitHub source, and the changed JavaScript modules parse. Full local Node suite, actual Ubuntu Electron UI/playthrough, layout visibility and owner acceptance remain pending.

## Remaining integration work

- In-world eating at home and at legitimate food businesses **after physical travel**; actual inventory, paid meals, timing, vendors and household meal state remain unimplemented and require explicit design/acceptance.
- Further balancing of food/rest frequency, long overnight sleeps, NPC needs, career-specific physical exertion and consequences.
- Continuing priority: reusable original room editor and owner-accepted executive office, then the room-first factory screen. District Asylum development stays parked in its existing spoiler-free design document.

**No extra in-game destination list, additional map pin, offline third-party runtime, release tag or executable was introduced here.**
