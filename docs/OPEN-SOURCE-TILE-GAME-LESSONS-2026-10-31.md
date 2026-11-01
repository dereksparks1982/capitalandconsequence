# Open-source tile-game review: what we can learn, what we must not copy

**Capital & Consequence · Elderred Softworks LLC · 31 October 2026**  
**Scope:** User-requested examination of block-art, top-down room-building games and editors. These references inform *our own* original 32×32 editor and gameplay systems.  
**Current build:** `v0.7.45-dev`, source pending local Electron gameplay and owner approval.  
**Critical:** No third-party source code, textures, sprites, maps, characters, sounds or libraries have been imported into Capital & Consequence by this review. No new dependencies and no GitHub Actions.

## Repository and licensing findings

Repository license labels below were checked from GitHub repository metadata and READMEs on 31 October 2026. A top-level license **never guarantees every file is available on the same terms**. Examine the specific file, contributors, history, asset metadata and license before any future literal reuse. Technical concepts are not copyrighted program code; our implementation must still be original.

| Project | Main stack | Published code terms | What is useful | What **not** to integrate directly |
|---|---|---|---|---|
| [Project Porcupine](https://github.com/OrderOfThePorcupine/ProjectPorcupine) | Unity / C#, XML, Lua | Main game code **GPL-3.0**; most non-code assets **CC BY-NC-SA 3.0**, README notes exceptions and MIT original tutorial files | Tiled room planning, self-governing agents, furniture definitions, job assignments, pathfinding | **Do not paste GPL implementation** into our separately licensed private game; do not import sprites or sounds. Evaluate MIT-only tutorial files separately if ever needed, with license notices. |
| [Space Station 14](https://github.com/space-wizards/space-station-14) | C# / Robust Toolbox, entity data | Content code **MIT** per README; art is separately licensed, often CC BY-SA 3.0, with some CC BY-NC-SA restrictions | Interactable equipment, explicit entity components, roles, jobs, door behavior, staff workflows | Do not bring in Robust Toolbox/server/client infrastructure, entire C# content game or art packs. Any individual asset requires metadata-level license check. |
| [Ogmo Editor 3 Community Edition](https://github.com/Ogmo-Editor-3/OgmoEditor3-CE) | Haxe / Electron | GitHub declares **MIT** | Layers, brush tools, property editors, entities, data export, shortcuts and design workflow | Don't bundle the full Haxe editor or require a separate editor install. Native Haxe modules don't directly drop into our browser JavaScript. Literal source integration would require MIT attribution/notice. |
| [2dtiler](https://github.com/2dtiler/app) | TypeScript / web UI | GitHub declares **MIT**; README says local browser app | Layered painting, flood fill, selection, rectangle tools, project saves and tile references | Don't introduce its whole UI, asset-generation providers, dependencies, or any required network service. Keep ours offline, simpler and consistent with approved look. No artwork import. |
| [Open World Builder](https://github.com/OpenWorldBuilder/base) | Unity / C# | GitHub declares **GPL-3.0**; README mentions assets obtained from external sources | Separation of build mode from ordinary play, modular construction commands, simple movement | **Do not copy GPL code** or assume linked Unity Asset Store objects are freely redistributable. Study only design concepts. |
| [TeamPorcupine archived/legacy repository](https://github.com/TeamPorcupine/ProjectPorcupine) | Unity / C# | **GPL-3.0**, old mirror of Project Porcupine | Older explanatory code discussions may clarify architecture | Not a differently licensed shortcut into Porcupine code. |

### Legal and implementation boundaries

- **GPL-3.0 code:** Do not incorporate directly into Capital & Consequence under the current project licensing model. Reimplement the ordinary *ideas* in our own JavaScript using independent code, and avoid reproducing file layout or algorithms verbatim.
- **MIT code:** Permissive source incorporation is theoretically possible but requires retaining copyright and license notices. We have **not** copied any MIT source for this build. Avoid importing whole projects merely because licensing permits it; dependencies, data formats, architecture and UI may be incompatible.
- **Creative assets:** Art and audio do not inherit a repository's code license. CC BY-SA, CC BY-NC-SA, proprietary marketplace files, logos and individual contributor restrictions require separate treatment. This build uses **only our repository's existing 69 intentionally crude art sprites**.
- **Engineering fit:** We ship an offline Electron/JavaScript game. Unity engines, multiplayer servers and Haxe editors are not appropriate as embedded dependencies without a substantial migration. **No engine migration is authorized.**
- **IP/branding:** The phrases “Pandora's Box style,” “Prison Architect-inspired,” “RimWorld-like,” etc. describe *ideas* and user-requested aesthetic direction, not affiliation or permission to copy art, interface layouts, trademarks or other protected expression.
- **Release model:** No GitHub Actions, online tile generators, login service, external game installation, network-delivered art pack or user terminal command.

## What we are actively building from those lessons

### 1. Tiled editing tools (Ogmo and 2dtiler workflow inspiration)

**Implemented in our own `room-builder-kit.js`:** independent floor and construction layers; connected-region bucket fill; rectangular area painting; a sprite eyedropper; wall removal; tile/category validation; **all-or-nothing paint commands** to avoid leaving partial invalid construction. The tool accepts only the sprite IDs in `room-builder-catalog.js`.

**Implemented in `room-builder-ui.js`:** visual buttons for Bucket Fill, Rectangle, Eyedropper and Remove Walls, with the original palette. Named developer blueprints can be saved, reopened or deleted independently from the active office and the user's career save. Existing single-backup restore and JSON import/export remain available.

**Not yet implemented:** automatic 47-pattern walls, angled roofs, autotiles, nonrectangular buildings, enormous multistory levels, artist-grade palettes, custom spritesheet generation or an external compatible Ogmo/Tiled project interchange. These are not prerequisites for the current office.

### 2. Behavior definitions and reachable facilities (SS14 and Porcupine concepts)

**Implemented as original game logic:** a small data-driven metadata map classifies existing desks, chairs, filing cabinets, bookshelves, doors, lamps and heating stoves by their intended use. Most remain *intent anchors*, not promised actions. In `auditStations`, work/storage/seating objects are checked against collision-aware paths from Charles's spawn, allowing the developer to spot unreachable workstations before signing off a room.

**Existing actual interaction retained:** an oak desk in Charles's *real, authorized executive office* is usable only when the real player is adjacent. It opens the existing desk UI, without remote travel or an extra time debit.

**Not implemented:** simulated fuel, electrical wiring, power, furniture inventories, bed ownership, wage-paying NPC jobs, patient records, staff shifts or machinery production based solely on placing an object. Those need links to existing inventory, time, NPC job, finance and permission systems before they can be called playable mechanics.

### 3. Worker routing and authority boundaries (Porcupine and SS14 ideas)

**Already present:** tile-by-tile collision, pathfinding and a room reachability inspector; normal city-room access/permissions and the real Washington clock remain separate. Developer mode never grants gameplay access. NPC AI and worker schedules are present in their own source systems, not automatically instantiated by adding a sprite.

**Next after office acceptance:** authored room station slots linked by stable object IDs to actually registered NPCs and the existing workplace/daybook framework; reservations, walking to the object, work-time accounting, job cancellation and priority scheduling. Only add actual behavior when corresponding business/character systems can confirm the action.

**Not yet:** copying Porcupine's Unity job queues, SS14 multiplayer entity components or Open World Builder's mod loader. These are much larger than the game needs for a credible first office.

## Remaining system gaps (do not confuse modules with complete features)

1. **Single source of truth for the world:** Existing linked-character saves share foundational world data but not yet all finance, housing and social state. Cross-career evidence cannot leak from private notebooks.
2. **Four complete playable campaigns:** Mission and work-duty engines exist, but main story campaigns and branching endings are not all playable. The asylum homicide remains later work. See `docs/MAIN-STORY-CAMPAIGNS.md`.
3. **NPCs operating visible rooms:** The simulation has schedules and intentions, but NPC paths and workstation occupancy need binding to real 32×32 layouts, time and business consequences.
4. **Production/business depth:** Factory work orders, charter, public offering and expansions require larger integrated supply chains and concrete job/path effects, not just more asset sprites.
5. **Visual/gameplay bridge:** The office builder's draft designs remain developer-local until an owner-approved layout is committed. Never silently make the sample office canon.
6. **Local verification:** Real Linux Electron runs, save/reload and full source regression suite remain needed before owner acceptance; do not mistake successful JavaScript model tests for gameplay acceptance.

## Safe implementation order

**First:** Finish our custom editor, save/restore named office blueprints, walkability checks and one functional desk; accept Charles's office layout.  
**Second:** Bind stable furniture interactions and actual NPC positions to the office and factory work systems, without giving free money/time.  
**Third:** Extend the editor to already registered Federal Electric factory rooms.  
**Fourth:** Use the same generic toolkit for police, criminal and other venues.  
**Finally:** District Asylum rooms, schedules and suspense narratives; see `docs/DISTRICT-ASYLUM-FUTURE-DESIGN-2026-10-31.md` (no *Shutter Island* spoilers).

**Decision:** Integrate *ideas now*, not other projects' engines, GPL code, third-party artwork or unrelated data. Any future literal MIT reuse requires a file-by-file license review and notices.
