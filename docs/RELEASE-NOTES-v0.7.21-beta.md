# Capital & Consequence v0.7.21 Beta | Poker Opponent Memory
**29 October 2026 · Source checkpoint only**

The established four-seat poker game now remembers **observable** betting actions between authorized sessions.

- Each actual poker hand counts the public checks, calls, raises, and folds of the player and participating opponents.
- On a later visit, the table may show a small `Past play: Often raises/folds` observation beneath a familiar opponent. At least several public actions are required before making a judgment.
- The existing opponent AI can make a small, transparent tactical adjustment to a returning player's already observed aggressive betting pattern. It does not know future cards, hidden hands, or the player's private thoughts.
- Memory belongs to the currently saved profile, is separated by room, and can be written only after the authorized popup session settles. Each session ID can be recorded once; unexpected opponent names are ignored.
- Wounded or deceased opponents remain absent under the previous duel aftermath rules, and any surviving recovered opponent can retain their history.

**Focused verification:** `tests/poker-memory.cjs` and `tests/poker-memory-gameplay.cjs` passed. The second drives a real poker hand with remembered opponents, verifies the normal settlement callback, and checks that no private card or deck data enters saved memories.

Original poker seat geometry and card-privacy rules are unchanged. The fixed Washington artwork and approved marker positions remain unchanged. README/legal unchanged. Full local Node suite and Electron playthrough pending; no GitHub Actions or executable generated.
