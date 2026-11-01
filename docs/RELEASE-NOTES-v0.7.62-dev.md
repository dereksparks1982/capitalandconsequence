# Capital & Consequence · v0.7.62-dev
**Source development only · 1 November 2026 · not a tested or accepted Linux executable**

### Built
- **Fortune-teller second sight.** The reader herself draws and interprets the cards. Occasionally, a card now hints at an actual secret that ordinary people could not know, including private underworld wagers, irregular Federal Electric cash withdrawals, and concealed truth surrounding the asylum inquiry. Her words are suggestive rather than an instant accusation, and only confirmed, dated game-world records are eligible.
- **Private-event recording.** Completed illegal/underworld wagers and completed irregular company withdrawals produce dated saved private events for the reader's supernatural insight. Calling a fantasy event a 'secret' no longer means the game invents a crime or rewrites a character's past.
- **Story protection.** The tarot interface never reveals the actual murderer, evidence IDs, or a future event that has not occurred. Other NPCs, police, newspapers and the map cannot acquire occult knowledge merely because the reading happened. Previous readings are immutable.
- **Current Washington location label.** The actual location pin has an always-visible `YOU ARE HERE · <name>` label, even when the user closes the temporary detail panel. It remains attached to the same coordinates when panning or zooming and is not hidden by generic pin filters.
- **Tarot event parsing.** Corrected regular-expression boundaries for ordinary witnessed investigations, public scandals, and factory disruptions.

### Files
`tarot-second-sight.js`, `tarot-interpretation.js`, `underworld.js`, `app.js`, `index.html`, `styles.css`.

### QA
Two new focused regression tests `tests/tarot-second-sight.cjs` and `tests/map-current-location-label.cjs` were replayed in an isolated JavaScript environment and passed. App and tarot source syntax checks passed. The **entire Node suite, packaged Linux executable, and graphical runtime have not been verified**. No GitHub Actions, release tag, source ZIP or executable supplied.

Details: `docs/TAROT-SECOND-SIGHT-MAP-LOCATION-v0.7.62.md`.
