# Capital & Consequence v0.7.49-dev

**Development source, not an accepted Linux release.**

Top-down boxing practice now uses stamina for actual WASD footwork (not just punching and blocking), slows movement when the fighter is exhausted instead of trapping them, and lets the player evade a telegraphed incoming strike by manually moving outside its reach. **Right click remains block; movement remains the only dodge control.** Stamina still does not regenerate during a round and only partly recovers at each bell. A compact per-round scorecard appears beneath the practice arena, including decision and stoppage results. This remains an isolated practice interaction: no betting, money, career health injuries, Washington time or championship changes.

Original crude 32x32 tiles and existing room collision/path API remain in place. No third-party code, artwork, external dependency, GitHub Actions, map alteration, or approved geometry changes.

Offline regression additions cover moving out of attack range, finite footwork stamina and exhaustion speed. Source-level checks are distinct from a full Node suite and actual Ubuntu UI testing.
