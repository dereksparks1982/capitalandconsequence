# Top-down room and boxing systems, 2026-10-31

Capital & Consequence now reuses its original 32x32 room model as the base for an optional licensed-boxing practice ring. The game remains offline, single-player and JavaScript/Electron.

## Reference study and safe reuse

Project Porcupine: character pathfinding, room occupancy and NPC work concepts. GPL-3.0 code and artwork are not copied.
Space Station 14: component-based actions, telegraphed interaction, actor roles. MIT content source is separate from its engine and art; no imported runtime.
Ogmo Editor 3 CE: tile layers and object definitions; keep our own original editor.
2dtiler: browser-based painting and local blueprints; no remote services.
Open World Builder: editing mode versus play mode; no GPL code or asset imports.
Our existing local Room Builder Core supplies tile collision, bounded walking and pathfinding. The existing bundled PathFinding.js MIT package stays available for larger systems; no new dependency is required.

## New source slice

Top-Down Sparring Ring is visible inside the Licensed Boxing module. It uses original crude worker and laborer sprites, existing tile art and basic ringside lines. WASD moves, LEFT CLICK punches, HOLD RIGHT CLICK blocks (not dodge). Opponent movement is collision aware. Attacks are telegraphed. Three rounds have 35-second active time and brief rests. Stamina spends on punches and guard, never regenerates mid-round, only partly returns between rounds, and the maximum pool declines with fatigue.

Practice is temporary and separate: no bets, money, event results, time advance, reputation, character health, injuries, or save mutations. In particular, this is not yet an entered licensed or private fight. Existing boxing simulation remains authoritative for those games. Source tests are in tests/boxing-ring-core.cjs; actual Linux gameplay and art review remain outstanding.

## Next builds

1. Generalize actor movement, occupancy and interaction intentions so factory workers, police, asylum staff and boxing can use shared logic.
2. Bind real approved factory rooms and workplaces to schedules and business accounting, preserving current management controls below the room.
3. Connect voluntary career prizefights to venue eligibility, existing ring outcomes, Washington game clock, fees/wagers, and persistent injury/health care.
4. Add health/hospital and richer hit timing once the shared condition model is accepted.

Do not import GPL code or separately restricted creative assets into this proprietary game. Maintain original world map artwork and approved interface geometry.
