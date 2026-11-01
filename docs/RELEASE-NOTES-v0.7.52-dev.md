# Capital & Consequence v0.7.52-dev: duel injuries enter the health system

Once an actual, resolved formal duel is recorded into the persistent aftermath ledger, a shot by the opponent now applies a physical health consequence to the player exactly once. A wound causes 38 health damage; a fatal shot reduces health to zero (further death gameplay is a later milestone). The existing duel aftermath idempotency guard stops repeated entry and duplicate damage. The player still receives the ordinary serious-health notification where applicable.

Actual medical treatment remains physically restricted to District General reception, with personal cash and Washington game time charged. Neither a practice sparring match nor observing a licensed fight injures the player's career character. No cash, world time, witness statement or investigation record is invented by applying an injury.

Source regressions cover one-time duel injury recording. Full Linux Electron QA and historical combat balancing remain pending. No GitHub Actions, third-party dependencies, or map edits.
