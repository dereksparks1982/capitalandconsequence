# Capital & Consequence v0.7.82-dev | Clockwork Duck Carnival Challenge
November 1, 2026 · Source-only, NOT a full accepted Linux game release.

## A seventh, mechanically different carnival game
The existing traveling circus at the Capital Race Grounds adds a seventh paid booth, **Clockwork Duck Challenge**, without changing the six previously accepted booth types. The new challenge is a basic wooden, clockwork-powered target consisting of five visible lanes. The duck initially occupies a fixed-for-this-round lane based on the independent saved carnival round ID, not hidden future game state. Each explicit adjustment moves the duck to its next position and charges 30 authentic Washington seconds. At most two adjustments are available before each of four scored shots. The original booth fee and four-minute basic game charge still apply, and additional waits spend additional game time.

The actual hit check uses the saved current target position when the player clicks one of five ordinary aim buttons. A good performance may earn the original inexpensive, special or rare prize objects. Awarded goods still enter physical belongings only through the original acquisition workflow; if the inventory is full, the unclaimed prize remains in the saved booth ledger. No prize or second ticket is created by reloading.

The ordinary six booths' scoring, random but repeatable pegs, button targets and prices are **unchanged**. The World’s Fair, its 1878 story, old map image and all other characters are untouched. A clockwork booth's draw-and-turn mechanics require no additional external physics engine or appropriated artwork.

## Verification
Focused isolated JavaScript regression passed a paid clockwork game, integer world-minute plus seconds remainder, two maximum adjustments per shot, four scored shots, correct one-time award and cash accounting, save/reload of motion ledger, remote-play restrictions and no changes to original ring toss. Full Node suite and live Ubuntu Electron game have NOT been executed here. No Actions, installer, tag or owner terminal command.