# Capital & Consequence v0.7.107-dev | Crowe Butchery Cold-Room Build

**Status:** Unaccepted developer SOURCE snapshot, not an installed/tested Linux Electron binary or a formal tagged release. Work authorized by the owner following discussion of ice deliveries, hanging sides, 30-day beef aging and the explicit instruction that spoilage NOT become annoying.

## Playable systems in this change
- Added a separate **Ice-Cooled Hanging Room** in the existing Crowe butcher shop interior. The map has NO newly invented street pin or address.
- A 320-lb beef side begins already hanging, having been hung by the shop before the game opening. Individual sides track receipt date, hanging days, remaining pounds, and whether the 30-day **standard** aging milestone is reached. The playable cut action transfers an actual 24-lb portion from a hanging side into existing unprepared beef inventory. Earlier cutting is an explicitly labeled *early customer request*, rather than pretending the normal standard was met.
- Icemen deliver purchased ice blocks into an insulated ice compartment. Daily game-clock ice use is an intentionally abstract simulation, not claimed historic measured cooling. The cousin pays for **automatic routine ice deliveries** out of the shop till and updates the existing business ledger; he also keeps the meat room clean without a daily player chore.
- Properly maintained hanging sides **never expire simply by reaching 30 or 120 days**. An extraordinary prolonged ice outage produces a warning and later inspection hold: meat is temporarily unavailable for cutting, **not automatically deleted**. Once the iceman is paid and the room is inspected/cleaned, the hold can be lifted.
- Player controls include manual ice deliveries, cleaning/inspection, receiving sides when the shop has enough money, examining the hanging-side age/weight and preparing regular or early cuts. All actions consume existing authoritative world-clock minutes before a real transaction is committed.
- The cousin still runs the shop while Elias is out; existing beef/pork/mutton counter trade, till audits, unusual cash, club work, sealed parcel errands and the family mystery remain as before. The player's UI and ledger do not disclose the killer or secret relationship.

## Explicit limits / realism
- The owner's father's real-life practice was a minimum 30-day hang under maintained refrigeration and sanitation, with earlier customer requests. This record is owner-supplied **trade inspiration** only, not a safe-aging recipe or proof that a 1878 ice room could consistently hold a particular temperature. Actual ice requirements, day lengths and prices are first-pass game balancing, not verified 1878 data.
- Early customer requests are currently **a labeled, player-initiated exception**, not yet NPC order letters with separate evidence. No full interactive slaughter/dressing minigame, environmental temperature/humidity physics, independent ice wagon sprite, spoilage health guidance, assigned butcher shop address or reworked 3D art is claimed.
- The shipping map remains undecided. Its deleted old artwork was not restored, and no unrelated merchant-navigation tests were rewritten or bypassed.

## Verification
- JavaScript syntax checks (new cold-room module, existing shop & UI changes). Focused cold-room runtime checks: 30-day aging, early/normal cuts, paid recurring ice, calendar aging past 120 days, no automatic long-hang expiry, alert/hold with insufficient funds, repair and inspection, nonduplicated cash accounting. Existing Crowe business and room-wiring regression suites are also exercised.
- Full native Node suite and Linux Electron graphical acceptance **remain unverified** while legacy maritime tests still refer to an unapproved, deleted chart image. Do not claim the existing local installation has updated itself.
