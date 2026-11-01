# Painted Railroads, Custom Stations and Physical Map Icons
**Capital & Consequence · v0.7.64-dev · 1 November 2026**

## Accepted visual contract
- Keep the approved Washington In and Out Guide JPG exactly as it is. The printed roads, buildings, locations, colors and existing A–R / 1–30 grid are not repainted or altered.
- Railroad tracks are a distinct **transparent, saved map layer**, edited in the same map viewport as the Road Editor. Track geometry uses normalized positions so zoom/pan, different window sizes and map reset display without moving the underlying artwork.
- The current Road Editor for walking, horse, carriage, streets and building masks is preserved, and cannot be activated while the Rail Editor is active. Edit Pins is similarly mutually exclusive.
- Track drawing follows successive clicks: select a starting point, then additional bends, or finish the line. Each segment is individually saved in the player's profile. Separate tools establish named stations at connected track endpoints, erase individual rails or stations, undo, dispatch a demonstration train and clear the rail plan.
- A complete train route requires **connected physical track sections** and at least two real saved stations. Connectivity is calculated from painted endpoints with small snap tolerance. Disconnected lines do not produce phantom train travel.
- A demonstration locomotive advances from station to station according to **the existing Washington world-minute clock** and distance calculated from the chosen rail route. Render polling never creates its own world time. Trains cannot teleport to unconnected points. The current drawing is a deliberately crude top-down square with 'LO' letters, not a polished locomotive asset.
- Stations are drawn on the same layer with a simple 'ST' label and their saved names. These are **planning markers** rather than new government-sanctioned destination pins or functional train stops inside the travel system yet.

## Replace selected map pins with physical icons
- Each existing registered location's map card has a new **Map appearance** selector.
- Choose Numbered pin, Railroad station, Locomotive depot, Factory, Police station, Hospital, Circus tent, Clubhouse, Market building, House, Government building or Park.
- The physical icon **replaces the numbered marker for that individual location**, not its map position, click action, player-travel availability, official name, searchability or persistent 'YOU ARE HERE' label.
- Icons are deliberately simple blocklike characters on compact square badges to match the approved generic art. The default remains the numbered pin, and selecting Numbered pin restores it.
- Each profile's choices persist separately under `S.mapLocationIcons`, independent of the original numbered-pin placement file and the saved rail layout.

## Source delivered
- `railway-network.js`: sanitize, saved rail sections, connected-route pathfinding, stations, erase, demonstration train departure and position by game minute.
- `railway-editor.js`: in-map rail drawing canvas, construction tools, train control and reversible edits.
- `location-icons.js`: registry and per-profile choice for physical replacement icons.
- Updated `index.html`, `styles.css`, `app.js` and `road-editor.js`: load controls, retain approved zoom/coordinates, draw train/station overlay, prevent editor conflicts and save icons.
- `tests/rail-planner-and-icons.cjs`: checks saved route, valid station positioning, disconnected service refusal, clock-driven movement, targeted erasure, icon choices and wiring.

## Business roadmap: rails must eventually cost money
The rail painter is **a prototype planning tool**, not authorization to build entire railroad companies for free. A later railway business module should require genuine company ownership or franchises; track-length cost; land and right-of-way negotiation; graded terrain, bridges and water crossings; crew/labor expense; station property and facilities; engines, coaches and freight cars; timetables and operating costs; maintenance; accidents, delays and insurance; passengers and cargo contracts; land and property restrictions; and outright company sale or acquisition. The railway business may be sold or acquired independently of the playable character's current career. Shared economy and ownership records must remain authoritative.
- Do not deduct fictional infrastructure money until the real business transaction exists; do not invent stations in the official city registry just because a planning symbol was placed on the map.
- Train preview motion follows the saved in-game clock and manually connected sections; passenger purchases, path restrictions across waterways and conflict with buildings require future world simulation checks, not claims of existing capabilities.
- Moving custom rails must not mutate the approved printed JPEG or automatically move existing map pins.

## QA and delivery status
- Focused JavaScript replay of `tests/rail-planner-and-icons.cjs` passed. Source syntax checks succeeded for the new three modules and updated `app.js`.
- The complete project Node regression suite, live map painting/zoom behavior, Linux Electron visual smoke, and packaged executable have **not** been run. Do not call this an accepted release or claim every editor interaction is proved in the game.
- No GitHub Actions, no ZIP or terminal commands, and no changes to the public map artwork.
