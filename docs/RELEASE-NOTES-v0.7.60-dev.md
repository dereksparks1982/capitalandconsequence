# Capital & Consequence · v0.7.60-dev
**Development snapshot · 1 November 2026 · NOT an accepted executable release**

This source-only development build extends the touring circus into usable in-room mechanics without replacing the approved Washington guide or its map pins.

### New playable systems
- **Seasonal public circus**: May 3–9, July 3–9, September 3–9 each year, at the already registered Capital Race Grounds. The dates are fictional alternate-history scheduling, not documented nineteenth-century events. Public circus icon appears only while the troupe is present.
- **Six carnival booths**: Ring Toss, Balloon Darts, Tin Duck Shooting Gallery, Knock Down the Cans, High Striker Bell, Penny Peg Drop. Each charges a small entry fee from personal cash, consumes actual game minutes, gives approximate aiming feedback and records finite attempts.
- **Collectibles and rare prizes**: Common junk, souvenirs, a clockwork tin duck, medallions and an engraved compass can be won, with exceptional wins uncommon. The items belong to the normal persistent personal-effects inventory. No double payment or replayable prize claims; undelivered prizes remain claimable.
- **Bedroom Chest**: 64 physical storage positions at Home → Bedroom. Players must actually be in the bedroom to deposit or withdraw pocket items. The chest shares the existing inventory model and is not a duplicate ledger.
- **Fortune-teller**: At the traveling circus, the reader chooses and draws three tarot cards on behalf of the character. Paid readings use ten real game minutes and ten cents, with a saved draw and a stable textual interpretation connected only to Charles, Sam, Elias or Edmund's *game* circumstances. The player does not choose or shuffle the cards. No outside services or externally sourced card art.
- **Existing systems preserved**: authenticated NPC discovery, private travel destinations, two-row top information header, four condition meters and medical history, existing developer controls, location access, original city map artwork.

### Implementation and source
`circus-carnival.js`, `circus-carnival-ui.js`, `tarot-interpretation.js`, `tarot-wagon-ui.js`, `bedroom-chest-ui.js`, `personal-effects.js`, `circus-tour.js`, `app.js`, `city.js`, `styles.css` and `index.html`.

GitHub reference projects on carnival interactions and tarot libraries are credited and license-reviewed in `docs/CARNIVAL-TAROT-BEDROOM-CHEST-2026-11-01.md`. No third-party source or raster imagery was copied into the repository, and no external runtime downloads are required.

### Verification and further work
An isolated JavaScript replay of `tests/circus-carnival-chest-tarot.cjs` passed: single fee, real personal possessions, room-only chest access, 78-card deck, and stable character-based reading. **The full Node suite, live graphical gameplay and packaged Linux executable remain untested here.** More physical carnival animations, independent fortune-teller wagon travel, original tarot art, specialized events, and the conman traveler's actual inventory are pending. No GitHub Actions, tags or distribution.
