# Capital & Consequence v0.7.19 Beta | Duel Aftermath
**29 October 2026 · Source checkpoint, not a public executable release**

An established formal duel now has persistent, visible consequences across city visits:
- The named opponent's actual injury or death is recorded separately from the player's injuries, based on the recorded shots (not the overall winner label). Injured opponents miss subsequent poker sessions until their in-game recovery date. Deceased opponents never return to play.
- Recoveries are evaluated only from saved game dates. Reopening the game does **not** simulate missed real-world time.
- A wounded player can request treatment only at the already-existing **District General Hospital**. A voluntary statement can be made only at the already-existing **Metropolitan Police** station.
- Hospital treatment takes 20 game minutes; a police statement takes 10, through the existing world-clock transaction system. Both are idempotent, location-gated, and documented in the current player's journal.
- A police statement is labeled as a **player account**, not independently corroborated evidence. It creates an intake entry, not an arrest, conviction, or omniscient police investigation.
- All state is tied to the current player save. No changes to the original Washington artwork or default map markers.

**Tests:** `tests/duel-aftermath.cjs`, `tests/duel-aftercare-ui.cjs`, and `tests/duel-poker-absence.cjs` passed focused isolated JavaScript checks. Full offline Node suite and Ubuntu Electron playtesting remain pending.

**Limitations:** No automatic witness creation, prosecution, permanent player-career retirement, courtroom trial, or simulated real medical treatment system is claimed. The README and proprietary legal terms remain unchanged. No GitHub Actions or compiled executable generated.
