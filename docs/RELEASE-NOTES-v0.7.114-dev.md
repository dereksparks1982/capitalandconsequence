# Capital & Consequence v0.7.114-dev · November 4, 2026
**Status:** Owner-authorized development snapshot, not an accepted release.

## Why this build
The owner found unusable harbor pins, a Washington-vs-Salem return problem, and a generic nonplayable harbor grid. The owner authorized a new build and named their universal scene decorator **DK Architect**, under **DK Softworks** (Russian ДК / Дом культуры, “House of Culture”).

## Implemented
- World shipping chart: **Edit Ports** enables left-dragging the harbor markers while right-drag still pans the map; selected ports can also use **Reposition Port** and click the exact desired point. Enter a custom name and choose a spot using **Place New Port**; custom ports can be renamed or removed. Positions are saved separately per active character.
- The full world atlas and smaller merchant fleet chart show owner-corrected port icons and in-port vessels. Data/model preserves original trade ports, actual voyage distances, live game time, licenses, and original atlas art. User-created harbor icons are chart annotations, not new automatically licensed destinations.
- DK Architect reuses the original 32×32 tile renderer and 69-asset catalog. Clicking **DK Architect · Decorate Scene** in a real visited room or using the dev panel opens that room's layout. The editor keeps independent layout keys, named drafts, export/import, backups, collision-safe placement, rotation, undo/redo, and test walk.
- Saving a DK Architect room displays its decorated playable-scene floor plan whenever the player enters that same room. Existing owner-approved game mechanics and the Executive Office's special E-to-desk action are retained; other rooms do not inherit Charles's desk authority. A neutral cursor represents protagonists without approved artwork in the legacy room-builder spritesheet.
- Existing historical Salem map remains the local map for Benjamin Leach, separate from the Mitchell shipping chart. Portrait cards keep the owner-approved Bridget-gold and Benjamin-purple accents.
- Studio brand is DK Softworks; technical `appId`, desktop name, historical credits, legal ownership and licensing stay unchanged.

## Limitations, deliberately not misrepresented
- The generic port-sector survey is still a prototype, **not** a physically visited or owner-decorated harbor city. DK Architect currently works with registered playable city-room scenes; integrating ship decks and custom maritime port sectors into the same renderer is future work.
- User-added chart ports are visual annotations, **not new sea routes or trading rights**.
- GitHub source commits are not an owner-accepted packaged Linux release.
- Source/runtime verification and native packaging status are reported separately in the build completion message.
