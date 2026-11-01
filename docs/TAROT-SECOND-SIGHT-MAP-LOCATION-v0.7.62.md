# v0.7.62-dev · The Reader's Second Sight & Persistent Map Position
**Capital & Consequence, source development, 1 November 2026**

## What this build changes
- The fortune-teller chooses and interprets the cards herself, as before, but now has a **rare, intentionally uncanny glimpse** of true private in-game events. She may remark on a concealed taking, secret payment, unreported company withdrawal, an underground wager or a mystery at the District Asylum.
- The reader must not invent crimes for drama. Private events are saved with an identifying event ID and time, and readings cannot consult events that occur later than the sitting.
- The reader may draw upon **confirmed hidden shared-world case truth**, but her phrasing remains symbolic. No killer's name, exact evidence, victim ID or verified solution appears in her tarot dialogue. An unresolved police case must remain an investigation.
- Second sight belongs **only to her in-person reading**. It does not give the map, ordinary NPCs, newspapers or police magical access to private knowledge. Existing player knowledge/discovery rules remain intact.
- Truth-backed supernatural insights sometimes do not appear, so repeated readings should not feel like an automatic crime detector. The selection and phrasing are frozen into the saved sitting and never revised by subsequent character events.
- Private events are recorded at two existing completed gameplay actions: placing underground fighting wagers and completing an irregular Federal Electric cash withdrawal. The system also supports future saved story crimes through `FE_TAROT_SECOND_SIGHT.record(save, event)`; simply defining a crime is not enough to produce an event.
- The reader also uses ordinary observable and private life factors that matter to the character's story: work, current health, fatigue, financial strain, casework, and known interpersonal pressures. Never reference the human player's real-world biography.
- The printed Washington map remains unchanged. The current location's existing marker retains a visible green **YOU ARE HERE · Name** tag even after dismissing the location card, hiding generic labels or filtering unrelated locations. No map artwork, pin positions, pathfinding data, or approved room UI geometry changed.

## Implementation
- `tarot-second-sight.js`: validated event ledger, real fact selectors, deliberate limited-frequency vision, no fabricated future incident.
- `tarot-interpretation.js`: optional saved shared-world context, links one card to the vision and preserves the narrative on the original tarot session; fixes previously misescaped regular-expression word boundaries in ordinary event analysis.
- `app.js`: read-only shared-world context for the reader, genuine irregular withdrawal recording and location marker synchronization.
- `underworld.js`: accepted concealed wager recording, with one event for each completed venue transaction.
- `index.html`: loads second sight before tarot interpretation.
- `styles.css`: always-visible current place label, while preserving original map geometry.
- `tests/tarot-second-sight.cjs`: tests real private events, idempotence, no future event leaks, frozen past interpretations, secret case hint without culprit reveal.
- `tests/map-current-location-label.cjs`: contracts for persistent location name under closed card, hidden generic names and filters.

## Not yet complete
- The criminal career needs a broader authored crime/action journal with actual witnesses, victims, consequences, arrests and secret details that naturally become inputs to second sight. An unseen act should never be claimed to have happened until recorded by the game's action systems.
- Detailed secret relationships involving other characters require genuine saved events rather than inventing infidelities or betrayals.
- The reader's independent wagon, housing, travels and original tarot card art are still upcoming.
- The full Node test suite, native Linux executable and live map UI have not been verified during this update. Do not tag or publish a release and do not run GitHub Actions. Accept the native game UI only after explicit user approval.

**No new runtime dependencies, GitHub Actions, automated publications, downloadable ZIP or replacement executable.**
