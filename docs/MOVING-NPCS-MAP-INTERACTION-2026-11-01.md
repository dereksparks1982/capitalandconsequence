# Interactive Travelers on the Washington Map
**Design and source implementation · 1 November 2026**

## Observed defect
The small person-shaped sprite was drawn by `npc-street-travel.js`: every on-foot NPC used the same anonymous silhouette, `aria-hidden` obscured it from screen readers, and `pointer-events:none` prevented any player interaction. It was **not evidence that the sprite represented a Gypsy woman**, a traveling troupe, or any particular identity.

## Approved presentation
- Existing traveled routes, approved Washington guide art, location-pins, coordinate transforms and in-world clock do not change.
- In-transit NPCs are identified by their saved actual `npcSimulation.agents` journey plus public character name/occupation. Never display fake resident locations or random invisible roaming NPCs.
- Draw deliberately crude, readable occupation tokens: police/inspector, courier, merchant, performer, worker and ordinary pedestrian. Do not introduce polished portrait art.
- Draw the **horse-drawn wagon token only when the character's journey explicitly records that vehicle**. A character's nationality, ethnicity, sex, clothing or name is never treated as proof of wagon ownership. The proposed traveling Gypsy character is not presently identified in the known schedule; her wagon and interaction require a confirmed, authored character and journey before substitution.
- The map token is mouse-clickable, keyboard-accessible, and has a usable hit area. It shows a small paper-style card with name, occupation, real departure/destination, and time remaining.
- **Show destination** selects the destination through the existing map card; Go There, walk/horse/carriage choice, time accounting and room access remain unchanged. Clicking an NPC does **not** teleport the player or start an impossible remote conversation.
- For real dialogue, visit the character's actual room when they arrive, using the already-existing NPC character card and player/room proximity rules.
- Panning, zooming, map closing and profile changes clear the temporary street overlay; pointerdown never steals the viewport drag. No permanently painted map NPC marks or extra white dots.

## Implemented
- `npc-street-travel.js`: temporary selectable NPC icon, public identity, route information card, keyboard/click support, explicit wagon evidence gate, preserved selected marker when map is repainted.
- `app.js`: Show destination routed into existing location-card navigation.
- `styles.css`: modest parchment popup and accessible keyboard focus, no approved map geometry changes.
- `tests/npc-street-interaction.cjs`: isolated DOM test for police/courier/wagon distinction, valid destination selection, no remote conversation, no map-clock mutation.
- Existing `tests/npc-street-travel.cjs` test harness brought into line with new DOM interaction.

## Pending
- The user's proposed roaming Gypsy wagon character must be identified or created with a real named NPC record and confirmed horse-drawn vehicle; **do not relabel arbitrary movers**.
- More individualized artwork and interaction based on actual resident-owned transport, destinations and observable pursuits (inspired by Red Dead-style encounters), without inventing NPC sightings, mystery rewards or extra fast-travel powers.
- Native Linux desktop visual acceptance and full Node regression suite remain outstanding. No GitHub Actions, automated remote publishing or acceptance tag.
