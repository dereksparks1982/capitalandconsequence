# Capital & Consequence 0.7.105-dev · Sailing ships only

**Owner decision:** No steamships in this world. Sail-powered vessels are the only maritime passenger and merchant vessels. Other sail rigs may be discussed later; the playable ship type remains the schooner.

**Changes:** Removed steamship vessel buying, fares, passenger-booking dropdown, voyage quotes, steamer hold capacity, upkeep/fee formula branches, powered icons, and three-deck steamer layout. Hard-rejected a steamer type in the merchant purchase and passenger quote APIs. All quoted sea journeys use wind-powered schedules and the prior 1878 weeks/months westbound-and-stopover route calculation. The tiny onboard route overlay and existing Admiralty chart stay unchanged.

**Regression updates:** Updated relevant maritime voyage, shipboard, passenger weather/health, cargo manifest, navigation and card-game source tests to run against the approved sail-only requirement; added `tests/merchant-sail-only.cjs` to assert a powered ship cannot be purchased/boarded and cannot appear as a ticket option. Preserved full source/asset protections, including the approved 1888 Admiralty route chart whose historical archival title contains the word 'steam'. A reference artwork's provenance is not a gameplay vessel.

**Developer workflow:** Per owner's instruction, every development build is a fresh game; old save compatibility/migrations are **not required**. Company Bible updated. Save/load for gameplay within the current build still applies. The main README remains back-of-box and legal description rather than a development log. `DECISIONS.md` records the new maritime canon, superseding older steamship proposals.

**Not authorized/implemented:** E-to-interact controls, pirate raids, captivity/ransom, permadeath, new shipboard activities, and stay-onboard secrets remain ideas, not part of this build.

**Verification:** Syntax compiled for changed modules and tests in V8. Focused maritime runtime smoke checks and the complete Node source suite / Linux Electron playthrough need to be reported separately if they are executed. **Unaccepted developer source only. No release tag or binary.**
