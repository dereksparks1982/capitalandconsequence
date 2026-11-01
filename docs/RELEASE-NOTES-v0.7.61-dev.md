# Capital & Consequence v0.7.61-dev
**Development source snapshot | 1 November 2026 | NOT an accepted release**

This build continues the existing 1878 Washington circus and medical/life simulation. No fixed map art, established room geometry, or playable-character rules were deliberately changed.

### Added
- **Big Top performance** separate from the midway games. The show has three daily performance times (noon, 3 PM, 7 PM), a 20¢ ticket, a 45-minute running time plus any wait, and a saved programme of period-style acts. The player's attendance record is updated only after actually completing the show. NPC comments distinguish having watched the performance from merely playing carnival games.
- **Traveling salesman Silas Pike**, a distinct figure from the fortune-teller, has a temporary circus stall. He offers five kinds of merchandise, from overpriced junk to genuinely well-made rare goods. Players may inspect before buying; examination records survive saves and can contradict his sales pitch. Purchases charge personal cash, enter the original physical belongings ledger, can be deposited in the existing bedroom chest, and cannot be duplicated by repeating the purchase.
- **Encounter-based discovery** for the salesman and fortune-teller upon entering their actual circus room, without revealing their future travel routes.
- **More context-sensitive tarot** using the playable character's own witnessed investigation notes, actual factory setbacks, public headlines and recent events in addition to their career, funds, and medical history. The reader alone chooses the cards and interpretations remain frozen when saved.
- **Exhaustion safeguards** prevent a collapse during a performance, sale, inspection, or tarot sitting from still completing its payment/receipt.

### Fixed
- Buying a 3–8¢ midway game no longer falsely records Big Top attendance.
- A failed physical-item award on a merchandise purchase returns the attempted money and leaves the item unsold.
- Confirmed purchase receipts and actual in-game performance attendance have dedicated focused regression coverage.

### Important limits
- The independently roaming trader and fortune-teller, their eventual horse-drawn wagons, playable special-item effects, full target-animation physics, circus actor sprites, actual original tarot card paintings and distinct circus campsite are still future work.
- Prices and dates are fictional 1878 alternate-history game-balance decisions, not claimed verified historical ticket prices.
- The new tests can run as ordinary local Node tests. Focused core tests have been replayed in an isolated JavaScript environment, but **the complete offline source suite, native Linux executable, and live browser UI have not been validated in this session**. This is not a tagged or released build.
- No GitHub Actions, outside runtime dependency download, changes to the user-approved map artwork, or output ZIP.

### Source
`circus-big-top.js`, `circus-big-top-ui.js`, `traveling-salesman.js`, `traveling-salesman-ui.js`, `app.js`, `index.html`, `styles.css`, `tarot-interpretation.js` and `tests/circus-show-peddler.cjs`.

Detailed gameplay and verification limitations: `docs/CIRCUS-BIG-TOP-TRAVELING-PEDDLER-v0.7.61.md`.
