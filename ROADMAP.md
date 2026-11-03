> **CHART QA FOLLOW-UP · v0.7.101-dev:** First hosted source run was 245/247, with only two retired-EcoClipper-filename checks failing. Those are now updated to owner-approved Admiralty asset identity; source pixel-aware zoom limit and saved-camera migration added. Await rerun before declaring acceptance. Original Washington map and historical decisions unchanged.

> **LATEST DEV SOURCE · NOVEMBER 3, 2026 · v0.7.101-dev (unaccepted):** Replaced every active EcoClipper shipping chart appearance with owner-uploaded British Admiralty 1888 JPG (1.64MB, under the 25MB cap). Natural image proportions 800x434, repositioned visual ports/routes, preserved independent world clock, existing saved sea routes, original desk geometry, right-button pan, wheel zoom and fixed Washington map. The 1888 date is image provenance only, NOT a change of 1878 story chronology. One new size/coordinate compatibility test; full source CI and Electron smoke pending. See `docs/RELEASE-NOTES-v0.7.101-dev.md`.

## November 3, 2026 · v0.7.101-dev · maritime image replacement
- [x] New Admiralty JPEG under 25MB as all active shipping chart art and movable desk thumbnail.
- [x] Retain original 1878 lore, saved routes/coordinates and shipping business rules.
- [x] Reproject visible ship/port paths and saved custom chart pins onto the 800x434 new chart without modifying saved records.
- [x] Keep zoom, fit and right mouse panning, both map and fleet views.
- [ ] Verify hosted source suite and real Ubuntu Electron zoom/visual game.

> **SOURCE QA VERIFIED · v0.7.100-dev · November 3, 2026:** GitHub Actions Ubuntu 24.04 / Node 22 full offline `node tests/run-all.cjs`: **246 passed, 0 failed, 246 total**. One targeted source QA run `41623029430`, completed successfully; this confirms the source suite including all seven previously failed regressions. **Actual local Electron packaging/smoke and owner's playtest are still NOT verified**. The workflow only reruns on its own changes or manual invocation. No accepted release/tag.

> **LATEST SOURCE · v0.7.100-dev · NOVEMBER 3, 2026 (unaccepted):** The seven-failure repair from v0.7.99 exposed one additionally stale IPO test expectation dating from before the owner-approved 75% Charles / 25% father cap table. Actual IPO logic already respects family equity. The underwriter test now asserts the correct 53.85% Charles / 19.23% father voting split, 2,500 preserved family votes, 13,000 issued shares, real receipts, invalid-price blocking and majority-loss warnings. An isolated full IPO scenario passed. Set up one targeted offline Node 22 source-suite workflow on GitHub, triggered only when the workflow file changes and manually thereafter, to avoid repeated full Linux builds. No gameplay economics/canon/geometry changed. Source is still not an accepted Linux release; see `docs/RELEASE-NOTES-v0.7.100-dev.md`.

## November 3, 2026 · v0.7.100-dev · approved family IPO and one-shot offline QA
- [x] Rebase outdated underwriter test expectations on owner-approved 75/25 Whitcomb family equity rather than returning to obsolete all-Charles control.
- [x] Verify both independent votes and dilution, founder-only sale, correct $2,850 company and $475 personal net proceeds, 15-minute game time, and invalid-offer protection.
- [x] Add a sparingly triggered GitHub Node 22 source regression check, no artifacts, no schedules and no build downloads.
- [ ] Verify the actual hosted source QA result before claiming a full 246+ test pass; Linux Electron runtime build and hands-on QA still outstanding.

> **LATEST SOURCE · v0.7.99-dev · NOVEMBER 3, 2026 (unaccepted):** Repair of seven failures reported in Ubuntu v0.7.98 suite (238 passed, 7 failed). Separate the 42 Washington mapped destinations from 2 nonmapped but still playable transport locations, preserve restricted city pins, retire competing desk mini-chart caption, move unchanged approved 1878 event sequence up in DECISIONS, restore IPO 'Founder voting stake' label, make map-return focus safe without global S, and separately gate the neutral menu and unfinished Whitcomb prelude. No existing tests weakened, canonical maps/years/shares untouched. Targeted source/V8 checks pass; native full Node/Linux Electron acceptance pending. See `docs/RELEASE-NOTES-v0.7.99-dev.md`.

## November 3, 2026 · v0.7.99-dev · full suite regression repair
- [x] The two maritime stage areas remain addressable but are excluded from the 42 mapped Washington location cards. All Washington underground rooms/pins remain.
- [x] Remove competing mini-chart caption while retaining original desk geometry and mini shipping-chart button.
- [x] Preserve owner-approved November 1 1878 sequence and original financing; correct source/preview wording.
- [x] Map return focus regression isolated safely, and both neutral-menu and Alexandria introduction simulation clock freezes retained.
- [ ] Run full native source suite and Linux executable smoke, then visual playtest. Never claim acceptance early.

> **LATEST SOURCE · v0.7.98-dev · NOVEMBER 3, 2026 (unaccepted):** The owner-requested Linux in-place GitHub builder no longer creates timestamped source backup archives in `~/DKLab/Archives`. Updates still stage files in the original project and retain only temporary rollback copies deleted with the build's temporary directory. The developer build script remains noninteractive, preserves the approved Washington map and continues its existing Linux smoke process. Added a regression that exercises the Python file synchronizer in a temporary directory. JS test syntax and static script-policy checks passed; full native Node suite, actual end-to-end Linux build and graphical playthrough remain unverified. `docs/RELEASE-NOTES-v0.7.98-dev.md`.

## November 3, 2026 · v0.7.98-dev · no-archive in-place Linux updater
- [x] Honor no persistent backups while synchronizing changed sources from GitHub into the original project folder.
- [x] Retain only temporary, automatically deleted rollback files if synchronization fails partway through.
- [x] Add a native Python synchronization regression invoked by Node source suite; source syntax checked.
- [ ] First invocation from a machine still holding the prior old builder must bootstrap the new script, or its old code will still create an archive. Do not give the obsolete old-script command.
- [ ] Full Ubuntu compile, smoke and actual game playtest remain outstanding before acceptance.

> **LATEST SOURCE · v0.7.97-dev · NOVEMBER 3, 2026 (unaccepted):** Passenger deck boards now support clicking any reachable floor or station tile. A shortest-path solver finds lawful orthogonal routes without crossing walls or crew-only spaces, and each tile is charged one game minute on the existing real voyage clock. Hatch/stair changes, original vessel and Washington maps, established art style, WASD, onboard activities, weather and shipmate schedules remain untouched. Syntax and targeted V8 steamer/schooner path checks passed; native Node suite and Ubuntu Electron playthrough remain pending. `docs/RELEASE-NOTES-v0.7.97-dev.md`.

## November 3, 2026 · v0.7.97-dev · click-to-walk ship interiors
- [x] BFS routes across only publicly walkable tiles on the current deck, without diagonal movement or wall/crew bypass.
- [x] Click any reachable tile; charge real voyage time proportional to shortest route length, not free teleportation.
- [x] Keep hatch transfers separate and preserve all existing map artwork and app layouts.
- [ ] Animated tile-by-tile movement, native full source suite and Ubuntu UI playtest remain pending.
- [ ] Alexandria origin voyage still needs approved historical schedule and campaign chronology resolution.

> **LATEST SOURCE · v0.7.96-dev · NOVEMBER 3, 2026 (unaccepted):** Charles can now keep his own saved voyage journal by writing at his real shipboard berth, spending ten world-clock minutes per page. Pages persist and can be reviewed in foreign harbors; author text is escaped, empty/oversize entries refused, drafts held through refresh. Also prevents simultaneous unfinished Twenty-One and checkers games, matching existing dominoes exclusion. Focused V8 tests and source syntax passed; full native source suite and Ubuntu Electron test still pending. See `docs/RELEASE-NOTES-v0.7.96-dev.md`.

## November 3, 2026 · v0.7.96-dev · passenger travel journal
- [x] Author 800-character voyage diary pages at a physical berth, each costing ten real game minutes, preserved through save/reload and after landing.
- [x] Escape diary content in the UI and preserve drafts during live world renders. Do not invent Charles's thoughts.
- [x] Complete tabletop interlock among Twenty-One, dominoes and draughts.
- [ ] Test full native Node suite and Ubuntu Electron passage flow; researched Alexandria-origin itinerary still pending.

> **LATEST SOURCE · v0.7.95-dev · NOVEMBER 3, 2026 (unaccepted):** Added playable double-six dominoes at the existing ship saloon table: a full 28-bone set, seven-bone hands, legal left/right placement, real boneyard draws, pass/blocked-hand scoring, simple computer response, resignation, and save-safe bounded results. Shared voyage time advances 3 to 10 minutes for actions using the original world simulation; no new clock, stakes, cash, trade routes, characters, lore or map changes. Dominoes, Twenty-One and checkers cannot be started on top of another unfinished table game. Source syntax and focused V8 gameplay smoke passed; native full Node suite and Ubuntu Electron playthrough remain unverified. `docs/RELEASE-NOTES-v0.7.95-dev.md`.

## November 3, 2026 · v0.7.95-dev · shipboard dominoes
- [x] Add a complete playable casual dominoes game with drawing, compulsory matching, pass, blocked scoring and opponent decisions at an actual shipboard station.
- [x] Record game results in the voyage save; prohibit cash transfers and parallel table games; continue ship motion through the one world clock.
- [x] Add a dedicated regression test for end-to-end settlement and source/UI wiring.
- [ ] Native Node `npm run test:source` and Ubuntu Electron UI acceptance are still needed before a release.
- [ ] Historically researched Alexandria departure and actual one-clock transoceanic origin journey remain outstanding.

> **LATEST SOURCE · v0.7.94-dev · NOVEMBER 2, 2026 (unaccepted):** Charlie's four-scene Alexandria introduction now includes saved, walkable 12×9 top-down **family office, courtyard, overland storehouse, departure quay and small cabin preview**, with actual door/hatch gates, WASD/arrows/mouse movement and in-person inspection. The intro clock remains frozen and **this is not a simulated Alexandria-to-America trip**; no unresearched fare, route, port coordinate or factory start change. Existing booked overseas passenger voyages now carry three anonymous, autonomously positioned shipmates following the **same authoritative game minute**, with actual deck/stair paths, co-location-gated two-minute conversations, a thirty-minute per-person cooldown, saved conversation records and visible in-world symbols. Neither NPC movement nor UI drawing starts a second clock or transfers cash. v0.7.93 shipboard cards, existing sea weather/ETA and original maps remain. **141 focused current-source V8 assertions passed; complete native Node suite and Ubuntu Electron walkthrough were NOT run.** Details: `docs/RELEASE-NOTES-v0.7.94-dev.md`. No accepted Linux executable or release tag.

## November 2, 2026 · v0.7.94-dev · Alexandria slice and time-based shipmates
- [x] Build five modest 12×9 prelude-only top-down areas: the Alexandria family office, courtyard, overland merchant storehouse, quay, and a cabin staging room. WASD/arrows/adjacent clicks, blocked walls/water, real connecting doors, inspection notes and saved explored position work inside the original Charles introductory overlay.
- [x] Preserve all four authored Alexandria/Washington opening decisions and existing father-son investor-confidence consequences. The prelude remains outside ordinary Washington game time; no new clock, port transaction, map pixel, boarding receipt or fictitious historic crossing was added.
- [x] Add three anonymous passenger/crew figures with repeated public-deck routines and collision-safe traversable paths across actual stair hatches on each built passenger vessel type, derived solely from the saved world clock.
- [x] Render physically present shipmates and add short face-to-face conversations only within one tile, with two actual game minutes, per-person cooldown and saved bounded replies. Neither NPCs nor UI ticking can advance the vessel on their own.
- [x] Add offline regressions `tests/whitcomb-alexandria-walk.cjs` and `tests/merchant-shipboard-life.cjs`; 141 targeted in-memory assertions passed in a connector-side V8 harness.
- [ ] **Still outstanding:** the real historic Alexandria-to-USA passenger route and charter, proper pre-Washington sailing timeline, physical American disembarkation, deeper Mediterranean/Atlantic chart lane research and visual integration.
- [ ] Independent historically grounded NPC identities/relationships aboard, cross-voyage contacts, shipboard incidents and crew interactions; full offline native Node regression suite plus actual Ubuntu Electron graphical testing and owner acceptance.

> **LATEST SOURCE BUILD · NOVEMBER 2, 2026 · v0.7.93-dev (unaccepted):** Integrated moving passenger-vessel interiors into the existing saved-clock maritime journey. Steamships have lower cabin/stores, main dining/card saloon and upper promenade; schooners have passenger berths/mess and weather deck. Both use 12×9 deliberately low-detail, Prison Architect-inspired floorplans. WASD/arrows/adjacent tile walking and connected stair hatch changes each spend one real game minute while the vessel keeps progressing along the already approved EcoClipper shipping chart. Cabin sleep, galley food, water, casual zero-stakes Twenty-One, and lookout activities now require genuine station presence. Card hands/deck positions save with the voyage; no independent ship clock, ship profit, free gambling cash, crew permissions, or invented NPC lives. Source tests `tests/merchant-shipboard.cjs` were added and targeted V8 module checks passed; **complete offline Node suite and actual Ubuntu Electron gameplay remain unverified**. The earlier four-scene Charlie Alexandria introductory vignette remains unchanged, and **physical Alexandria and its origin-specific crossing to America are not implemented**. See `docs/RELEASE-NOTES-v0.7.93-dev.md`. Washington and maritime map art and chronology are untouched. No accepted executable or release tag.

## November 2, 2026 · v0.7.93-dev · living shipboard travel (source only)
- [x] Attach a genuinely walkable, saved top-down vessel interior to **existing** passenger sea voyages. Steamship has three decks; schooner has two, all distinct 12×9 sections with floor, blocked walls, bunks, amenities, lookout and no free access to crew-only areas.
- [x] Drive each successful tile walk and hatch-only neighboring deck climb through the existing `advanceWorldSimulation` at one game minute. The existing passenger voyage continues along the original EcoClipper chart while activities consume clock minutes; no independent timer.
- [x] Require Charlie to physically reach berth, galley, water stand, lookout or card table to use the corresponding existing sleep/needs services or new activities; preserve player cash and shared health system.
- [x] Add a casual, no-money-wagered Twenty-One table with deterministic saved cards, genuine hit/stand decisions, fixed clock costs, result history and non-duplicable settling.
- [x] Display vessel marker and progress from the existing saved world clock. The UI redraw interval is presentation-only and cannot alter voyage speed.
- [x] Add `merchant-shipboard.js` and `tests/merchant-shipboard.cjs` with static source wiring and targeted V8 checks; existing passenger journey, original two map images, corporate accounting and story arcs remain untouched.
- [ ] Run the **complete native Node test suite** and owner-reviewed Ubuntu Electron interactive travel, including deck input, report boundaries, weather-driven arrivals and reload, before acceptance.
- [ ] Physical Alexandrian streets/trading house/harbor and Charlie's actual Alexandria-to-American arrival remain future connected gameplay: the existing story prelude is not yet that simulation. Do not alter chart or claim passage without surveyed/researched route.
- [ ] Extend ship to genuinely autonomous passengers, their schedules and interactions, varied period-specific games, event triggers/crew permissions and historically researched deck plans only through separately grounded work.

> **CURRENT DEVELOPMENT POLICY · NOVEMBER 2, 2026:** [COMPANY_BIBLE.md](COMPANY_BIBLE.md) contains **development/build/release rules only**; [GAME_LORE.md](GAME_LORE.md) indexes story, world, character, map, and gameplay canon. The owner **allows GitHub Actions and other compute, both sparingly**. Prefer appropriate local Linux checks and use hosted resources only when justified. Older dated “No GitHub Actions” statements below are preserved as history and are **superseded**, not current prohibitions. No gameplay or release authorization follows from this documentation change.

## November 2, 2026 · v0.7.92-dev · Charles's Alexandria opening and father-son business confidence (source only)
- [x] Add an authored four-scene new-campaign prelude: Alexandria family trade office, departure quay, passenger cabin and arrival at the **unchanged** Washington factory in January 1878. Three decisions per scene, saved once each; no uncharted commercial port, new map coordinate, fabricated boarding receipt or extra paid voyage.
- [x] Auto-enter the intro only for new industrialist profiles on the established January 1878 opening date, and resume an unfinished chapter on profile reload. Never overwrite old saves or impose Charlie's opening on Samuel, Edmund or Elias.
- [x] Freeze regular Washington time, hidden market and other player-initiated time jumps while the story card is open; do not change factory starting cash, warehouse materials, existing company shares, loan or map geometry.
- [x] Preserve chosen answers in the family-finance model with deterministic, replay-proof father-son business confidence. Genuine timely loan payments can increase that confidence; delinquency can damage it.
- [x] Incorporate the saved relationship into father's actual corporate investor voting. Keep his 25% initial family shares, separate secured debt, shareholder rights, dividends and later public dilution unchanged.
- [x] Add isolated accessible intro interface, original styling, Corporate Affairs confidence and Charlie-only personal-book pages for the four recorded choices.
- [x] Source/engine regression `tests/whitcomb-intro.cjs` passed alongside the prior three family/corporate/IPO regressions in a focused connector-side JavaScript harness. This does NOT establish native Ubuntu Electron or complete Node suite acceptance.
- [x] Rewrite the README as a brief player-facing game-back-cover description with a conventional GitHub Pages address; preserve the entire existing copyright/legal section and links to proprietary/third-party license records. Put technical updates here and in versioned release notes, NOT in README.
- [ ] Build physical Alexandria port, verified international route and full introductory sea journey only after separate research and real in-world navigation integration. Do not invent a historical 1878 crossing schedule or move either approved map.
- [ ] Full Node test suite, Ubuntu Electron visual/playthrough verification, opening overlays on mobile, profile save/reload and owner acceptance are still outstanding.
See `docs/RELEASE-NOTES-v0.7.92-dev.md`. No GitHub Actions, expensive compute, accepted binary, backup or release tag.

## November 2, 2026 · v0.7.91-dev · Whitcomb family investor & secured factory loan (source only)
- [x] Approve and record Charlie's British father/Egyptian mother; his father's prior British Army service outside Egypt, stern yet well-intentioned character and Alexandria **overland trading** enterprise. Exact parent names, family religion and service record remain unspecified.
- [x] Original Federal Electric 10,000-vote cap table: **7,500 Charles (75%), 2,500 father (25%)**. Make his investment real equity, not a phantom cash bonus or a substitute for loan repayment.
- [x] Preserve father's original voting shares on charter and IPO. Apply correct dilution to both parties, prohibit Charlie selling family shares, reserve an investor director seat while family holds 15% or more of voting stock.
- [x] Give dividend receipts to each investor's actual shareholding. Charlie's portion enters personal cash; the family investor's dividend income is separately recorded rather than paid to Charlie.
- [x] Track a **separate secured loan** against the already-financed factory: provisional $7,500, 4% nominal annual interest, $45 monthly installments beginning February 2, 1878. One saved world calendar determines bills; no clock skips, automatic mortgage payments or additional startup cash.
- [x] Require physical office presence, company cash, business time and authorized presidency for real loan payments; pay interest first, reduce principal only after actual cash transfer, prevent duplicated receipts, keep component treasury synchronized.
- [x] Dated Alexandria creditor letters, escalating delinquency, warning, demand and eventually secured-factory receivership/disownment. Charlie remains a playable person, but cannot operate a lost factory or spend its business money; his original shares aren't silently transferred to a lender.
- [x] Show family shares, invoice, interest, next due, payment controls, dividends and formal notices in existing Corporate Affairs and private Business Ledger, with correct privacy for other playable characters.
- [x] Add direct `tests/whitcomb-family.cjs` and update legitimate preexisting corporate/IPO tests for explicitly approved father shares. Three focused V8 suites checked.
- [ ] Complete full local native Node source QA and Ubuntu Electron playthrough before an accepted playable release. Audit long game-time skips, monthly bills, Charter/IPO and nonindustrialist save isolation.
- [ ] Design and build **real** Alexandria arrival intro, Edmund's London prologue, Sam's southern Africa origin, and Eli's Washington-born opening only as separately planned gameplay. No unearned shipping-route coordinates or source-map changes.
- [ ] Extend earned good/bad-honor port business contacts, family negotiations, share buyback, other careers after losing the factory, reconciliation and recovery as future real systems, not claims of this financial build.
See `docs/RELEASE-NOTES-v0.7.91-dev.md` and `GAME_LORE.md`. GitHub Actions/compute used sparingly; none triggered for this build.

## November 2, 2026 · v0.7.90-dev · physical maritime merchant commerce (source only)
- [x] Add six generic merchant cargo families in a separate, cash-backed inventory from third-party freight and Federal Electric components. Port supply is finite by saved game week, ship holds are capacity-limited and quotes do not mutate state.
- [x] Purchase physical goods with the actual fleet treasury, pay loading and original departure costs, and assign a unique saved bill of lading to an owned, berthed vessel on an established mapped shipping route.
- [x] Only after an actual world-clock arrival may surviving cargo enter the receiving port's saved storehouse. No sale credit on dispatch, no double arrival, and no instant return or teleport.
- [x] Offer genuine local port-agent sales with gross amount, commission, duty, net fleet receipt and unique one-time removal of the sold cargo.
- [x] Extend sea-loss and partial-damage outcomes to actual merchant goods, paying separately purchased cargo insurance independently of the vessel's hull cover. Lost goods cannot be sold.
- [x] Make purchase, forecast profit, premium, ship capacity, route and live stock visible on the existing world chart and industrial fleet screens; remember chart quotation controls across redraws.
- [x] Display actual delivered merchant goods in physical overseas warehouses and offer fifteen-minute in-person market sale only when Charles has arrived and walked into the market on the single world clock.
- [x] Add two new offline cargo regressions covering finite stocks, ownership, purchase, shipment, insurance, damage, sea loss, deliberate sales, save/reload and original Washington chart preservation; focused V8 source checks also reran existing maritime freight/route quote regressions.
- [ ] Run the **complete** local Node suite and genuine Ubuntu Electron visual and multi-day gameplay tests before an accepted game build. In particular review port form selection, remote vs physical agent sales, long-period settlement and insured damage.
- [ ] Research historic cargo prices, seasonal supply, customs rules and document original chart image redistribution rights; current rates are explicitly **provisional**. No named NPC or canon chronology was changed.
See `docs/RELEASE-NOTES-v0.7.90-dev.md`. GitHub Actions and billable compute were not used in this build.

## November 2, 2026 · v0.7.89-dev · observable weather delays and real foreign lodging (source only)
- [x] Deterministic voyage-specific, saved rough-sea delays revealed only after the ship reaches the affected ocean segment, never rolled by refreshing the map or reloading.
- [x] Adjust saved ETA/arrival minute at most once, and preserve normal world-clock reports, health, ship location, paid fares, cargo and cash ownership.
- [x] Correct the return-voyage sequence: the Atlantic/ocean portion precedes the final Baltimore-to-Washington feeder. The distinct shipping chart and unchanged reference bitmap show the correct route position.
- [x] Show revised ETA, voyage notices, return-connection status and a simple captain's register on the existing passenger panel.
- [x] Physically reached overseas Sailors' Lodging now offers paid, timed rest with personal-cash receipt and existing energy/medical rules. No named roomkeeper, free equipment or imaginary company settlement.
- [ ] Execute complete local Node source tests and a genuine Ubuntu Electron playthrough; test long multi-day passages, day-close payments, low health and map overlays before accepting any playable release.
- [ ] Replace estimated weather, feeder duration, fare, and $1.25 lodging price with researched period-specific services; source map redistribution rights remain unverified.
See `docs/RELEASE-NOTES-v0.7.89-dev.md`. No Actions run, executable, release or tag.

## November 2, 2026 · v0.7.88-dev · paid overseas passenger loop (source only)
- [x] Add Passenger Pier to the existing Potomac River Fishing Bank, without changing Washington's map image or existing pin coordinates.
- [x] Require Charles to physically reach the pier and buy passage with personal money before moving him to a saved passenger-vessel location. Include a provisional two-day Chesapeake/Baltimore feeder and real ocean-route days from the existing shipping chart.
- [x] Display a separate passenger marker across the unaltered EcoClipper chart and an onboard crossing screen. The saved world clock advances in normal bounded game actions; physical arrival requires elapsed days and settles only once.
- [x] Give arriving Charles six small **physical** foreign harbour sectors with WASD/arrow walking and one-minute movement; read the actual docked-owned-vessel and Federal Electric cargo records, without creating imaginary inventory.
- [x] Offer a distinct personally paid and clock-advanced return journey, landing at the same Washington Passenger Pier. Ordinary Washington map travel is blocked while away.
- [x] Connect shipboard cabin sleep, galley food/water and doctor expenses to existing personal cash, human needs and medical systems, keeping collapse recovery on the boat/in foreign harbour.
- [x] Add dedicated offline source tests for boarding, exact fares, clock progress, unique arrivals, foreign walking, safe return and maritime medical care.
- [ ] Run full local Node test suite and Ubuntu Electron end-to-end gameplay. Confirm city-room boarding UX, original map layers, health survival and long-journey day/report transitions with owner approval.
- [ ] Verify period sailing/feeder geography, passenger fares, chart redistribution permission, weather-delay realism and next-layer authentic foreign trade/social scenes.
See `docs/RELEASE-NOTES-v0.7.88-dev.md`. No Actions, binaries or release tags.

## November 2, 2026 · v0.7.87-dev · walkable harbor plans and voyage preflight (source only)
- [x] Six deliberately generic 12×9 survey floorplans (quay, warehouse, customs, market, sailors' lodging, street) with walls, water and furnishings; one-tile WASD/arrows/adjacent-click movement and collision.
- [x] Open those small planning scenes from a named commercial port or owner-marked harbour candidate on the exact existing EcoClipper chart. Save **independent** survey cursor positions for each port and section; do not move Charles or advance time from a map preview.
- [x] Give owned docked schooners/steamships a read-only quotation before real dispatch, including all chartered sea legs, distance, plausible ETA, cargo eligibility, optional insurance and actual fleet-treasury departure costs; show the proposed route as a distinct line.
- [x] Keep the real cargo dispatch, maintenance, verified ports, payment, risks and single authoritative world clock in existing systems. Never make previewed cargo, money or journey receipts.
- [x] Add local offline source regressions for harbor tile walking and quote-to-dispatch accounting.
- [ ] **Real passenger travel remains open:** locate and physically reach a legitimate port of embarkation, buy passage, process the existing daily report/time gates throughout voyage, prevent Washington on-site activity while away, and arrive in small playable foreign-port rooms with authentic return travel.
- [ ] Run complete Node suite and Ubuntu Electron graphical/interaction test, verify original chart reproduction and redistribution rights, and seek owner acceptance before release/tag.
See `docs/RELEASE-NOTES-v0.7.87-dev.md`.

## November 2, 2026 · v0.7.86-dev · full desk-accessible maritime map (source only)
- [x] Add a distinct original-image maritime miniature to Charles's existing movable desk items. Persist its saved position independently of approved Washington map and business book.
- [x] Open full shipping map from miniature, desk button, or merchant fleet; zoom, fit, right-drag pan, close, select existing port or ship, live read-only vessel overlay redraw from saved Washington clock.
- [x] Place, rename, reposition and delete up to 60 per-profile personal chart marks without creating fictional commercial port access.
- [x] Perform schooner/steamship purchase, authorized dispatch, insurance, hull repair, real consignment sales and discovered port verification on the map using the existing fleet economy.
- [x] View eight established or unverified port markers and low-fidelity clickable small harbor **planning scenes**: quay, warehouse, customs, market, lodging and street. No unearned resident, revenue or property.
- [x] Add focused regression tests for map/source wiring, commercial authority, saved annotations, protection of the original Washington map and nonteleporting harbor inspections.
- [x] Add a map directory that centers eight established ports and personal ocean annotations, remember the chart pan/zoom between visits, and support SVG ship/port keyboard activation.
- [x] Classify personal chart marks as harbor candidate, coast, sea or study area; preview simple harbor zones without converting survey marks into verified ports.
- [x] Read existing owned docked ships and Federal Electric consigned goods within quay/storehouse zones; inspect voyage notices and actual trade verification, never mint inventory.
- [x] Give each owned ship a saved-clock voyage manifest/insurance panel and expose fleet operating receipts and event journal in the shipping office; show labeled estimate of days/speeds from Baltimore to selected ports.
- [ ] Actual **character travel** to distant ports remains a separate integration: embarkation from a physically reached American harbor, passenger fares and provisions, full in-game clock/day-report passage, arrival, physical presence/return, and playable port-zone walking/interactions with the shared systems. Do not count the planning scenes as visited locations.
- [ ] Full Node suite, Linux Electron interactive screenshot inspection, owner approval, exact line tracing and source-image licensing remain outstanding. No GitHub Actions, tagged release or packaging.
See `docs/RELEASE-NOTES-v0.7.86-dev.md`.

## November 2, 2026 · v0.7.85-dev · working merchant vessel position viewer (source only)
- [x] Identify owner-added `assets/artwork/maps/SHIPPING-LINES-ECOCLIPPER-small.jpg` and use it unedited in a **separate** maritime chart inside Charles's existing fleet page. No changes to the protected Washington map or 1878 narrative.
- [x] Add a connected sea-lane graph with image-coordinate tracks for the existing eight merchant ports and estimate passage days from nautical-distance and schooner/steamer speeds. Intermediate waypoints never grant trade access or cargo sales.
- [x] Snapshot route coordinates, distance and departure clock minute to new saved voyages. Show owned ship icons and inspection cards at port or underway, with progress derived only from the player-advanced game clock.
- [x] Preserve the existing dispatch, cargo inventory, fleet vs Federal Electric cash, wear/upkeep, insurance, weather loss, ports, freight receipt and same-day duplicate settlement gates.
- [x] Add a focused offline `tests/merchant-navigation.cjs` source regression and execute targeted connector-side V8 route/dispatch/arrival checks.
- [ ] Run the full local Node suite, inspect the chart in Ubuntu Electron, confirm each line overlays the uploaded JPEG accurately, and get owner acceptance before any release/tag.
- [ ] Verify chart licensing/provenance. Survey period-accurate port tracks, vessel-specific routing, winds, seasonality, weather delays, canal feasibility and actual harbor layovers; current timing is a labeled estimate.
See `docs/RELEASE-NOTES-v0.7.85-dev.md`. No GitHub Actions or accepted release.

## November 1, 2026 · v0.7.84-dev · hired railway staff and real weekly wage settlement
- [x] Hire an optional unnamed locomotive engineer for $120 with 90 game minutes of onboarding, or a conductor for $70 with 60 minutes, **only** from Charlie's authorized factory office with a constructed, owned railway.
- [x] An employed engineer reduces actual bought-locomotive wear from 4 to 2 points per paid trip; an employed conductor reduces track wear from 2 to 1, leaving all existing fare/dispatch restrictions and initial unstaffed behavior unchanged.
- [x] Hires add a real $18/week engineer and $12/week conductor wage obligation to the canonical railway company's records, not a gratuitous NPC paycheck or a source of passenger income.
- [x] Real Saturday closing automatically pays wages once from Federal Electric company funds, recognizes prior unpaid arrears, preserves debt when cash is insufficient, and credits subsequent payment without duplicating wage expense.
- [x] Add role, signing costs, weekly wages and arrears display to the existing rail finance editor and Charles's own Business Ledger, without giving other protagonists access.
- [x] Focused source regression verified time/cash hire gates, duplicate receipt protection, reduced real-trip wear, correct Saturday classification, single settlement, partial payment, arrears recovery and save isolation.
- [ ] Named labor contracts, staffing levels, time-off, union matters, actual external railway revenues, complete Node regression suite and live Ubuntu Electron playthrough remain open.

## November 1, 2026 · v0.7.83-dev · owned rail serviceability and workshop repairs
- [x] Real paid company train departures gradually wear the owned line (2/100) and the actual purchased locomotive (4/100). No wear on map-editor demonstration sprites or automatic world-clock progression.
- [x] A line below 30/100 or a locomotive below 30/100 cannot authorize another revenue-independent company departure. Other purchased serviceable locomotives may still be used.
- [x] Paid track maintenance restores up to 40 condition points for $65 company funds and 90 game minutes, and locomotive fitters restore up to 40 points for $50 and 120 game minutes. Full-condition assets cannot trigger unnecessary charges.
- [x] Maintenance cannot run while a genuine train still occupies its line or while a purchased locomotive is away on its unfinished trip; no repairs by unauthorized characters or a removed company president.
- [x] Condition is tracked in the canonical railway ownership ledger, shown beside line and locomotive controls and in Charles's read-only Business Ledger, and restored deterministically after save/reload.
- [x] Focused maintenance regression covers 18 genuine paid runs, condition loss, unsafe-engine lockout, paid repair, occupied-track lockout, cost, replay safety, and no fictional passenger revenue.
- [x] Re-ran earlier real railroad charter/construction and freight-inventory tests against the modified engine; both passed unchanged.
- [ ] Real payroll staffing, rail/engine age, operating risk, third-party transport markets, full Node suite and native Ubuntu Electron gameplay remain future work. No Actions or release tags.

## November 1, 2026 · v0.7.82-dev · tactile, paid-clockwork carnival challenge
- [x] Add **Clockwork Duck Challenge** as a seventh independent booth rather than overwriting any of the six already implemented carnival games and their saved rules.
- [x] Actual duck target changes between five aim lanes by deliberately winding the mechanism for an extra thirty Washington game seconds. The old carnival's paid booth admission and score/prize ledgers still apply.
- [x] Limit each shot to at most two extra mechanism movements, retain the current target until the player aims, and log the visible lane/position and timing for later replay.
- [x] Render the currently lit moving duck lane and a 'Turn Clockwork' button in the existing deliberately simple wooden carnival booth, without moving the city's map, changing any story gate or relying on real timers.
- [x] Keep all six original prize tables, per-booth physical cash fees, genuine award/inventory behavior, traveling circus schedule and save history unchanged.
- [x] Focused source regression covers actual in-world minute-plus-seconds remainder, admission fee, inability to skip wait time or exceed per-shot wind cap, repeated aim results, save/reload and refusal to affect the original ring-toss booth.
- [ ] More fully animated booth art and physics, full Node suite and actual Ubuntu Electron visual/play acceptance remain future work. No Actions, released executable or alternate World's Fair timing.

## November 1, 2026 · v0.7.81-dev · actual Federal Electric rail cargo
- [x] Allow loading only **real finished physical components** in Federal Electric warehouse and only for a completed, genuinely owned rail corridor with a paid locomotive available.
- [x] Record company-paid cartage and loading from the existing factory to the departure platform in thirty Washington minutes. Warehouse stock is consumed once on successful load, with no invented second bag or customer payment.
- [x] Bind exactly one outstanding manifest to an actual fuel-paid train departure. The manifest stays loaded in transit and cannot be received before its actual existing world-clock arrival minute.
- [x] Enter a separate ten-minute factory-office arrival acknowledgment after the train arrives; the destination station's depot inventory increases by the delivered quantity without returning goods to the source warehouse.
- [x] Prevent concurrent double booking on the same line and duplicate receipt tokens. Preserve any failed attempt's source inventory and treasury balances.
- [x] Expose the freight register inside the existing railroad finance tools and add genuine corporate rail/cargo records to Charlie's read-only Business Ledger; no knowledge leak to other protagonists.
- [x] New focused source regression checks real item quantities, fee accounting, clock-gated departure/arrival, empty depot before arrival, final depot stock, duplicate protection, and profile restrictions.
- [ ] Real third-party freight buyers, actual customer settlements, tariffs, timetables, railway staffing, open depot retail and separate existing Capital Branch Railway integration remain future work. No speculative railway revenue, accepted Ubuntu executable, or GitHub Actions.

## November 1, 2026 · v0.7.80-dev · paid railway ownership and construction
- [x] The separate Rail Editor remains only a drawing/planning layer. Acquiring a company railway first requires an actual paid charter and company authority, not a free line for every painted sketch.
- [x] Survey existing connected planned track between distinct planned stations and acquire dated, paid corridor rights. Snapshot the surveyed geometry so editing or deleting a planning sketch does not erase legitimate owned construction.
- [x] Finish construction through repeated paid 90-minute labor shifts and company-material budgets; no platforms or travel revenue until the full crew work has been funded and completed.
- [x] Buy up to four actual locomotives for real company cash and authorize paid-fuel trains on completed owned track; preserve the existing Washington world minute for movement.
- [x] Draw constructed company-owned routes and an FE locomotive distinct from the free rail planning sketch, without changing the fixed map image or pinned geography.
- [x] Add the Finance/Build controls *inside* the existing map Rail Editor, preserving its original controls, manual track painting and existing demonstration train.
- [x] Reuse Federal Electric company treasury, sync component works accounting, respect presidential control and save profile isolation, and block duplicate spending with receipt tokens.
- [x] Focused isolated JS regression covers charter, surveyed route, rights costs, crew progress, completed line, locomotive/fuel, replay guard, no invented passenger fares and no edits to already-constructed lines.
- [ ] Actual passenger/freight demand, schedules, cargo loading, retained operating workers and maintenance are not yet created; no speculative profit. Full Node suite and native Ubuntu Electron QA remain pending.

## November 1, 2026 · v0.7.79-dev · real Star Club dining room
- [x] Replace the Star Club's previously descriptive-only **Dining Room** menu promise with four playable table-service meals, preserving the existing approved rooms, proprietor and the absolute prohibition on cards or gambling.
- [x] Require a genuine entered Star Club Dining Room, valid game-clock service period, personal funds and actual spent Washington minutes for each purchase. No remote dining, closed-day magic or private-suite bypass.
- [x] Use the authoritative Character Needs `eatPrepared` hunger/thirst restoration and 30-minute meal cooldown, not a second need meter or unlimited refreshment exploit.
- [x] Deduct personal funds and place real cents in WashingtonCommerce's existing Star Club dining till; each in-game date has a finite, provisional menu portion allocation and durable single-use receipts.
- [x] Existing salon and parlor remain non-gambling social spaces, Brandy Room retains smoking-only context, and Madam Star's office/suites remain permission-gated.
- [x] Focused source regression with actual needs and commerce modules verifies finite supplies, cash, nourishment, cooldown, fake-time refusal, room/phase guards, replay safety and separated profile saves.
- [ ] Historical culinary supply details and actual Star Club staff interactions remain future design; no claim of full offline Node suite or native Linux Electron acceptance. No GitHub Actions.

## November 1, 2026 · v0.7.78-dev · verified life records in all four private books
- [x] Charlie's existing Business Ledger includes **real** accepted component/District/Fair production obligations, documented manufacturing and purchase receipts, earned staffing/equipment and actual contracted deliveries. A hypothetical order is never labeled as paid cash.
- [x] Sam's existing Casebook includes a private, read-only reference to his own actually filed Hillsdale property custody chain, with explicit unverified-owner status and no fabricated crime evidence.
- [x] Eli's personal journal includes his genuinely held/transferred nightclub parcels and filed four-contact night shift reports. A manager review or promotion is not silently granted.
- [x] Edmund's Duty Journal includes actual unresolved stores requests, dated escalations and completed shift handovers. Neither private patient diagnoses nor his unnamed brother's decisions are invented.
- [x] Original page-turning book design, writer's own notes, saved annotations, story gates and map geometry unchanged. New book pages do not mutate save state.
- [x] Cross-route isolated regression confirms current profile-only data isolation, recorded facts and no fictional outcomes.
- [ ] Full Node source suite and Ubuntu Electron actual book rendering/readability still awaiting acceptance; no packaged executable or Actions.

## November 1, 2026 · v0.7.77-dev · Edmund's documented institutional service
- [x] Save actual reported ordinary ward assignments as independently verifiable services, with original task and response; no invented patient names or medical histories.
- [x] Real **supply shortage/request** tasks can create tracked unresolved requisitions only after Edmund physically attends and files the source assignment. Inventory-check-only tasks do not automatically create a supply order.
- [x] Allow a five-minute station follow-up on later in-game days and a separate two-day-later escalation to supervisory channels; no fictional receiving entry or guarantee that supplies arrived.
- [x] Let Edmund submit a five-minute daily handover after three actually filed ordinary ward-service entries, including unresolved supply notices; no automatic brother/manager approval or promotion.
- [x] Show pending requests and original service references inside his existing orderly station panel, protecting all other asylum and shared murder-case lore.
- [x] Execute the legacy orderly service regression and a new complete-flow, wrong-role, exact-time, save-reload, and duplicate-token regression.
- [ ] Full offline Node regression suite and native Ubuntu Electron gameplay QA remain unverified. Future actual supply delivery must use real institution staff/inventory sources rather than self-granted stock.

## November 1, 2026 · v0.7.76-dev · Golden Peacock door-book and employee consequences
- [x] Give Eli Crowe a persistent record of actual paid nightclub entrance contacts rather than only a wages counter.
- [x] An existing courier parcel chosen for **physical receipt** enters Eli's custody with the original numbered contact, date, and chain. Choosing to call for the manager does not create unearned stock or owner facts.
- [x] Let Eli transfer an actual held parcel to the floor manager in a new five-minute nighttime door action, recording provenance and preserving unresolved contents.
- [x] After four existing real paid segments, let Eli submit a single five-minute nightly floor-manager report recording visitors, manager referrals, tense contacts, routine resolutions, and unresolved parcel responsibilities.
- [x] Save/reload and duplicate tokens do not pay wages twice, create a second parcel, or submit duplicate nightly reports. Reporting never grants criminal rank, property, favors, club ownership, or automatic promotions.
- [x] Existing Golden Peacock location, doorman station, proprietor canon, other stories and map art unchanged; add controls within Eli's current venue panel.
- [x] The legacy doorman regression plus new parcel and manager-report regression passed in isolated JavaScript execution.
- [ ] Autonomous named patron schedules and the owner-approved broader nightclub social arc remain future work. Full Node suite and Ubuntu Electron gameplay unverified.

## November 1, 2026 · v0.7.75-dev · actual Hillsdale lost-property custody
- [x] Ground police property in Sam's already witnessed Hillsdale incident. Only selecting **Take into station custody** creates an item and dated collection record; selecting **Record the finder's account** is statement-only.
- [x] The Metropolitan Police duty-room report transfers the existing item to station intake. A preexisting report with no contemporaneous custody is not retroactively invented as property.
- [x] Five-minute sealed bag, identity-check and station-clerk transfer steps preserve an auditable personal custody chain, saved original incident ID, intact station record, chronological action receipts and duplicate protection.
- [x] Property-clerk transfer cannot occur before sealing and inspection; the owner remains unknown and unverified. No evidence of an actual crime, police warrant, new rank or invented plaintiff is created.
- [x] Add property register panel inside Sam's existing patrol duty desk, restricted to his actual career and station office; preserve his one-beat jurisdiction, fixed map and all original UI geometry.
- [x] Focused source regression covers witness-versus-custody, station entry, office restrictions, time validation, replay-safety, genuine chain entries, profile save reload and no fabricated owner.
- [ ] Full offline Node regression suite and native Ubuntu Electron testing remain owner-unaccepted. Other policing careers, independent complainants and case progression remain future substantive work.

## November 1, 2026 · v0.7.74-dev · supervised production office and order priorities
- [x] Add the production office below existing Federal Electric Component Works controls, without changing accepted map or page geometry.
- [x] Persist prioritized existing production orders; initial order defaults to earliest contractual due date, and moving one to the front costs 5 Washington minutes.
- [x] Supervised factory shifts of 1–4 hours allocate actual hired bench/winder crews (or qualified lamp line) to a real order; use original company warehouse/production receipts, manufacturing recipes, defects, and authoritative clock.
- [x] Enforce Charlie's factory visit and management authority, Sullivan's physical attendance, no unrepaired machinery breakdown, one staffed station, weekday hours, and no work past 5 PM. No offline automation.
- [x] Aggregate shortage planning across the entire remaining manufacturing queue with a single 15-minute cash-backed multi-material requisition and retry-safe receipt.
- [x] Display order priority, deadline, quantity, current input-limited capacity, projected factory minutes, estimated future invoices (not money in hand), worker wages, and recent production ledger.
- [x] Isolated tests cover no phantom manufacturing, real save/clock consumption, priority, invoice restrictions and compatibility with prior factory/business systems.
- [ ] Full `node tests/run-all.cjs` and native Ubuntu Electron gameplay have not been verified; no GitHub Actions, release tag, executable or downloaded build.

## November 1, 2026 · v0.7.73-dev · expandable 1878 component factory and procurement
- [x] Hire one additional bench technician and one winding specialist on top of Charlie and the existing salaried foreman; specialists cost hiring fees and weekly company wages.
- [x] Purchase and fit a second bench and second winding machine separately. **Worker plus machine** is required for each corresponding speed improvement, rather than creating imaginary output.
- [x] Advanced specialist training uses real company cash and three game hours; basic worker/machine pairing reduces eligible component work to 75% of the original time, trained pairing to ~60%. Unrelated products and the separately unlocked incandescent lamp line retain their own rules.
- [x] Use the existing assembly quotes and authoritative clock for capacity gains. The shift boundary, Sullivan’s physical attendance and machine breakdowns still block inappropriate production.
- [x] Per-order raw-material planning shows unmet copper, glass, brass, iron, insulation, carbon and timber requirements, estimated manufacturing time and actual purchase cost. A single confirmed requisition uses shared factory bins and company cash without creating or completing any goods.
- [x] Saturday specialist payroll once per week with replay safety and persistent cash arrears; no offline wages or free labor.
- [x] Same existing Factory → Component Works screen displays staffing, machines, capacity, order planning and material requirements. Approved map/UI geometry and character arcs unchanged.
- [x] Six focused source regression groups (existing component, live-clock, District/Fair campaign, contract hardening, new staffing/requisition and live-clock staffing) passed in isolated V8 execution.
- [ ] Full `node tests/run-all.cjs` and native Ubuntu Electron playthrough have not been run. No GitHub Actions, packaged download, owner acceptance or release tag.

## November 1, 2026 · v0.7.72-dev · Contract integrity and electric-workshop safeguards
- [x] Protect customer order balances: shared warehouse inventory alone cannot justify a second unpaid or unmade delivery.
- [x] District wire/contact/insulator dispatch requires actual manufacturing against the awarded District orders; Fair lamp dispatch requires sound units manufactured against its awarded order.
- [x] Independent seeded rival bids span below the cheapest player offer for both streetlighting and the Fair; low prices improve competitiveness but no longer guarantee victory.
- [x] Each experimental carbon/glass/vacuum/endurance trial consumes its specified raw material stock, even on a failed experiment; insufficient stock rejects the trial before money, clock or save mutations.
- [x] Late streetlight inspection and Fair shipment record the existing 10% contract delay deduction explicitly as gross, penalty and net receipt. No hidden cancellation of unfinished contracts.
- [x] Show workshop research ingredients and delivery deadlines; prevent lamp-product choices from leaking between unlicensed game profiles.
- [x] Focused V8 regression groups: legacy component orders, revised municipal and Fair gameplay, and new no-phantom-stock / losable-cheapest-bid / late-payment cases passed.
- [ ] Full offline Node source suite and actual Ubuntu Electron gameplay acceptance still pending; no GitHub Actions, tagged release or executable produced.

## November 1, 2026 · v0.7.71-dev · 1878 municipal streetlighting and incandescent production
- [x] Competitive February–June streetlighting tender with real eligibility (shipped component customer order), rival bid, outcomes and 50-site physical component obligations.
- [x] Awarded order creates actual wire, switch contact and insulator jobs in existing Component Works; Saturday dispatch consumes real warehouse stock; weekday inspection pays the contract incrementally.
- [x] Four time- and money-costed lamp experiments (carbon filament, seals, vacuum, endurance) with possible failed trials, then paid license, hand-built prototype line and 300-minute bulb attempts with real rejects.
- [x] Two hired specialist lamp workers with Saturday payroll and arrears, paid production line upgrade to 60-minute bulb attempts (still with occasional defects). Uses existing company balance and stock.
- [x] Competitive late-1878 Fair tender creates an actual 100-bulb workshop job. Saturday physical shipment after the provisional October eligibility window earns only delivered-bulb receipts.
- [x] Real workshop interface, player-save persistence, idempotent tokens, factory-location and clock checks. Existing four careers, map geometry and unrelated access remain unchanged.
- [ ] Full local Node test suite and native Ubuntu Electron playthrough not completed. Contract quantities and rival prices are adjustable balance targets, not irreversible lore. No GitHub Actions.

## November 1, 2026 · v0.7.70-dev · Electrified Washington chronology
- [x] Record the new owner's 1878 city-electricity premise and industrial progression.
- [x] Component production first, competitive District streetlighting work earlier in 1878, then experimental bulbs and late-1878 Fair.
- [x] Change the Fair event-room earliest eligibility to October 1, 1878 (provisional Q4, not an actual opening day), without moving pin #9 or changing other access rules.
- [x] Update Company Bible, decisions, world knowledge, README and regression expectations for this explicit authorization.
- [ ] Implement competitive streetlighting contracts with components, arc-lamp hardware, deliveries, installation, payment, and rival companies. Fifty streetlights remains a suggestion only.
- [ ] Implement real 1878 bulb research, vacuum/glass/filament manufacture, tooling, failures, time and factory scale-up; legacy 1880 bulb gate and 24-minute recipe are not yet a real solution.
- [ ] Implement the late-1878 Fair's contests, contracts and earned coverage. A 100–200 bulb order is a suggested starting scale only.
- [ ] Full Node regression suite and Linux Electron playthrough still needed. No GitHub Actions or accepted release.

> The older 1893 Fair and post-Fair streetlighting plans below are superseded dated records.

## November 1, 2026 · v0.7.69-dev: World's Fair story timing correction (source only)
- [x] Restore 1893 story date for Fair #9 without hiding its fixed map pin or public approach.
- [x] Separate public site visits from gated exposition ground entry; do not invent any fair supply-contract result.
- [x] Respect this story gate through room menu, map arrival and developer room-unlock shortcuts.
- [x] Add regression tests while preserving other mapped sites' year-independent availability.
- [ ] Full local Node regression suite and Ubuntu Electron gameplay acceptance remain pending. No Actions or executable.

## 1 November 2026 · v0.7.65-dev: manual Washington painting and landmark access
- [x] Pan entire Washington map by RIGHT mouse drag, leaving LEFT clicks and dragging free for road and blue-building painting and pin interaction.
- [x] Fix painted first-point alignment with actual displayed map image bounds rather than incorrect viewport offset.
- [x] Add real Paint-style LEFT-drag road strokes, precise two-click roads, building blue brush and rectangle, independent road/building erasers and brush sizes.
- [x] Remove inaccurate auto suggested road and raster scan controls entirely; manual street marking is the chosen authoring method.
- [x] Preserve 8,000 road sections / 4,000 blue obstacle marks in routing sanitization, with saved undo, import and export.
- [x] Add Ford’s Theatre as provisional map pin #41 and a visitable theatre shell with public and private rooms.
- [x] Ignore real-world year restrictions for all mapped city places, including World's Fair, airport and later-era entertainments, while preserving staff-only room permissions.
- [x] Document additional printed-Washington-map destination candidates with verified/unverified status and development priorities.
- [ ] Native Linux pointer precision, browser right-button drag and long-map painting performance need visual testing before accepting this build.
- [ ] Add further user-identified landmarks, activities and accurate pin coordinates to the existing registry without moving approved locations.

## 1 November 2026 · v0.7.64-dev: painted railroad planning and landmark map icons
- [x] Separate Rail Editor from Road Editor, preserving fixed printed Washington artwork and existing approved city pin placements.
- [x] Click-to-paint saved rail segments and bends, undo or erase individual track sections; place named stations only beside connected track endpoints.
- [x] Demonstration locomotive dispatch and slow movement along validated connected segments from the authoritative Washington game clock; unconnected track offers no service.
- [x] Replace an individual location's numbered pin with a profile-saved basic physical icon, or restore the numbered pin, without relocating it.
- [x] Prevent simultaneous road, rail and pin edit modes from stealing each other's map interactions.
- [x] Add isolated rail, station, train-clock and physical icon regression coverage.
- [ ] Turn rail plans into OWNED, paid construction with land/rights-of-way, workers, maintenance, locomotives, passenger timetables, freight, station access, loans and operating revenue.
- [ ] Connect purchasing, selling and closing a company to railroad ownership and independent character careers, without duplicating personal/company finances.
- [ ] Visual Linux playtest, full local Node regression and finished native executable still required. No GitHub Actions.

## 1 November 2026 · v0.7.63-dev: real touring wagons and NPC encounters
- [x] Register the visiting tarot reader and Silas Pike as special NPCs with saved identity, ordinary conversation cards and actual physical presence, not another phantom list of map markers.
- [x] Schedule a horse-drawn wagon approach and departure for each during the recurring circus engagement; route only on valid streets and calculate trip time from the actual road distance.
- [x] Show wagon silhouettes only to characters who have already heard about or met the traveler, and never reveal their private destinations.
- [x] Exclude the visitors from ordinary resident payroll, workplaces and weekly routines; do not duplicate wages or simulate imaginary employment.
- [x] Prevent the circus tent from remaining visible during departures; preserve the historical engagement in the save only long enough for the real wagon ride to finish.
- [x] Ensure a visitor's room conversation and discovery depend on the character actually being at the same location.
- [x] Add focused source regressions covering real travel clock, map discovery, actual same-room NPC conversation, and departure.
- [ ] Native Linux visual acceptance, complete Node regression suite, original painted cards and full wooden wagon interiors still outstanding.
- [ ] Add merchant bargaining, meaningful item effects, more crimes with witnesses and victims, and full animated carnival physics in future substantive builds.

## 1 November 2026 · v0.7.62-dev: genuine second sight and persistent map location
- [x] The fortune-teller may rarely read a genuine hidden event even if nobody told her; her saved cards and words stay fixed.
- [x] Record underworld wagers and unreported company withdrawals only when actual gameplay actions succeed; never fabricate crimes.
- [x] Read actual shared asylum-case truth for cryptic hints without leaking culprit, evidence or future events.
- [x] Fix ordinary tarot reading of observed investigations, scandals and production interruptions.
- [x] Keep the current map-location name visible after closing its details, hiding other labels or filtering place pins; don't move any approved map geometry.
- [x] Add focused tests for private tarot vision and map-location label persistence.
- [ ] More recorded criminal-career wrongdoing, victims, witnesses, consequences, and private relationships must be implemented before supernatural clues reference them.
- [ ] Character artwork for the tarot deck, reader's independent wagon route and richer readings pending.
- [ ] Complete native Linux runtime smoke and full Node regression suite before accepting/releasing. No GitHub Actions.

## 1 November 2026 · v0.7.61-dev: real Big Top attendance and traveling salesman
- [x] Separate midway booth play from actually attending a circus performance. Tickets: 20¢; three scheduled shows per day; 45 minutes including real waiting time on the Washington clock.
- [x] Make Big Top completion the sole gameplay source of circus show attendance, with recorded acts and non-repeatable receipts.
- [x] Add a separate in-person conman salesman (Silas Pike) at the circus, with plausible and false merchandise claims, saved item inspections and actual pocket purchases.
- [x] Discover travelers only when encountered; knowing their existence does not reveal their later routes or locations.
- [x] Extend tarot's character-only interpretation with player-witnessed cases, news scandals and factory interruption context, without omniscient mystery spoilers.
- [x] Add regression coverage for show vs midway and inspection/one-off trader purchases.
- [ ] Independent merchant street journey, dialogue and negotiation; genuine gameplay effects of rare equipment still outstanding.
- [ ] Actual circus stage visuals, performer NPC schedules and moving targets in carnival booths outstanding.
- [ ] Native Linux executable and full game UI/source test suite still need testing before acceptance. No GitHub Actions.

## 1 November 2026 · v0.7.60-dev: playable circus midway, bedroom chest and in-world readings
- [x] Recurring seasonal circus weeks at existing Capital Race Grounds, public temporary tent icon.
- [x] Six paid physical midway booths: ring toss, balloon darts, tin duck gallery, cans, high striker and penny peg drop. Each has a playable five-position selection, aim clue, fee, finite attempts and score.
- [x] Real physical prize awards and historical-style carnival collectibles, rare items on exceptional scores, saved unclaimed receipts.
- [x] Real bedroom chest with 64 item positions; deposit/withdraw between pockets and the saved belongings register; restrict access to the room.
- [x] A fortune-teller at her visiting pitch draws cards herself and reads about the character's recorded Washington life. She never treats the player's actual life as input.
- [x] Evaluate existing MIT and unlicensed GitHub examples and build a self-contained implementation without copying their assets/code.
- [ ] Improve carnival games with full target animation and more tactile minigame physics.
- [ ] Full standalone Gypsy wagon, named roaming character, self-contained residence and original tarot illustration artwork.
- [ ] Write traveling conman's inventory, actual goods provenance, pricing, interrogations and trickery.
- [ ] Full Node regression suite and native Linux game UI acceptance. No GitHub Actions or release before acceptance.

## 1 November 2026 · v0.7.59-dev: character discovery, public circus, tarot and bedroom rest
- [x] Hide moving NPCs until learned through actual encounters, newspaper names or in-person accounts. Preserve their unknown destinations.
- [x] Public traveling circus date/venue model and only-when-in-town map tent, with optional NPC circus conversation that observes actual attendance.
- [x] Art-independent 78-card offline tarot deck and reading history foundation; original card art and actual fortune-teller visit pending.
- [x] Home bedroom nap/full/custom sleep, blackout transition and 1878-style wind-up ringing alarm with uncommon oversleeping.
- [x] DEV toggle always available in room view.
- [ ] Author specific circus dates, campsite, tickets, performances and actual visitor interactions before claiming it has arrived.
- [ ] Name and author the traveling fortune-teller, verified horse-drawn wagon and playable tarot sitting with original art.
- [ ] Design the roaming confidence man, real goods, inspection and provenance; no placeholder goods granted without receipts.
- [ ] Full native Linux Electron smoke, audio and multi-day game-clock QA outstanding. No GitHub Actions.
 
## 1 November 2026 · v0.7.59-dev: medical records, energy consequences, interactive street NPCs
- [x] Record player/NPC private medical histories; track collapses, long-term exhaustion, house-call and hospital expense.
- [x] Zero-energy collapse with setting-dependent consequences: home recovery, factory emergency shutdown, street hospital transport, risky neighborhood cash loss chances.
- [x] A genuine bedroom sleep action; no automatic energy restoration just because the calendar reaches morning.
- [x] Make moving NPC tokens clickable with distinct crude profession shapes and a documented wagon shape when actually traveling by wagon. Show actual identity/route and select real destination, with no remote NPC talking.
- [ ] User-proposed traveling Gypsy wagon character identity still needs actual NPC/vehicle assignment before it can be labeled or rendered as such.
- [ ] Full Linux runtime tests, payroll/emergency balances, more playable residences, lodging options and NPC in-world encounters require player acceptance. No GitHub Actions.
- [ ] Accept/test a full build locally before tag and publish.

## 31 October 2026 · v0.7.58-dev: symmetric boxing stamina\n- [x] Opponent movement and guards consume the same finite round stamina as the player.\n- [x] Exhausted opponent pursuit slows instead of bypassing stamina limits.\n- [x] Opponent stamina visible in practice HUD.\n- [x] Tests added for exhausted pursuit, blocking cost, and empty-stamina guard prevention.\n- [ ] Career injuries, betting, standings and Linux UI acceptance remain separate. No GitHub Actions.\n\n## 31 October 2026 · v0.7.57-dev: directional punching and locked punch lines
- [x] Strikes only connect while facing the opponent.
- [x] AI marks an intended target tile and cannot automatically follow the dodging player during the windup.
- [x] Existing WASD footwork, right-mouse guarding, stamina/exhaustion and round scoring remain.
- [x] Additional direction and manual dodge model assertions; graphical Ubuntu QA pending.
- [ ] Actual career boxing bout and health/wager reconciliation remain a later integrated milestone.

## 31 October 2026 · v0.7.56-dev: carried food beyond the market counter
- [x] Existing purchased market provisions now show in the Personal Journal's Carried Provisions panel and remain available after leaving the merchant.
- [x] Food consumption requires an active non-dev character profile, time debit, owned bag item and the same shared meal cooldown.
- [x] Consuming a carried item never recharges purchase cash, regenerates shop inventory or manufactures free goods.
- [x] Keep explicit non-food items separate from consumables, with no notification destination choices.
- [ ] Confirm local Ubuntu journal scrolling and save/reload; home kitchen and restaurants remain later.

## 31 October 2026 · v0.7.55-dev: purchased food becomes usable nourishment
- [x] Existing Chinatown/Hillsdale market player bags support eating purchased provisions with their own hunger and thirst benefits.
- [x] Existing market stock, purchase receipts, personal cash and physically present room gating remain the only way to obtain provisions.
- [x] Food consumption requires Washington game time, removes exactly one bag entry and enforces 30-minute space between meals.
- [x] Non-food supplies remain ordinary items and never heal hunger or thirst.
- [x] Added needs model tests for meals and drink, food cooldown and unusable items.
- [ ] Prepared restaurant meals, home cooking, cooking requirements and inventory outside the market remain future work.

## 31 October 2026 · v0.7.54-dev: correct overnight needs accounting
- [x] Distinguish consciously played Washington time from implicit report-to-morning rest.
- [x] Sleep restores energy without automatically restoring food, water or injury health.
- [x] Preserve hunger/thirst warnings and carry the existing needs into the next day without applying hidden overnight starvation damage.
- [x] Extend offline model regressions for overnight recovery.
- [ ] Detailed sleeping environments, illness and proper home/restaurant meals remain future location-based features.

## 31 October 2026 · v0.7.53-dev: physical condition visible in map and rooms
- [x] Mirror the four existing health/hunger/thirst/energy meters in the map and room world-clock banners.
- [x] Reuse the saved state and original per-minute source UI; no additional timer, object IDs, or simulation clock.
- [x] Keep the approved map painting, pins, original time/status banner and all room navigation intact.
- [ ] Linux Electron visual QA and smaller-screen acceptance remain outstanding.

## 31 October 2026 · v0.7.52-dev: real formal-duel health consequences
- [x] Apply physical damage from actually resolved formal duel outcomes through the saved health service.
- [x] Ensure duplicate duel reports cannot multiply an injury or invent another fight.
- [x] Keep practice boxing, spectators, wagers and uncompleted challenges from affecting career health.
- [ ] Expand medical recovery and player-owned official boxing after visible owner-accepted gameplay.
- [ ] Full Ubuntu visual QA remains outstanding.

## 31 October 2026 · v0.7.51-dev: actual hospital reception treatment
- [x] Existing District General reception now offers physician examinations using game time and personal cash.
- [x] Limited treatment restores up to 28 Health, requires physical location, and persists to the journal/save.
- [x] Prevent dev-room, remote, unavailable-time and unaffordable use without inventing new map pins.
- [ ] Real Linux UI test, hospitals beyond reception, injury complications and insurance remain later roadmap items.

## 31 October 2026 · v0.7.50-dev: shared physical health and permanent UI
- [x] Four condition bars under the world clock; preserves existing map artwork and navigation.
- [x] Sustainably accumulating hunger/thirst depletion eventually damages health after grace periods.
- [x] Add bounded, auditable applyInjury and treat APIs for later genuine combat and medical service.
- [x] Upgrade existing character saves with health 100; preserve break cooldowns and character needs.
- [x] Add model regressions and dev notes. Full Linux source suite/gameplay pending.
- [ ] Physical hospital/clinic treatment tied to the real room, time and personal cash.
- [ ] Connect actual licensed/private combat and hazards to persistent injury service.
- [ ] Room-first factory floor and collapsible real management controls after office acceptance.

## 31 October 2026 · v0.7.46-dev: saved hunger/thirst, real breaks and future room-first factory
- [x] Human needs accrue with the authoritative Washington world calendar. Character hunger, thirst and energy persist with profile saves; crossing a threshold produces one non-modal notification until that need has been meaningfully restored.
- [x] **No destination-choice buttons:** alerts never force travel, provide a teleporter or ask the player to choose home/café/restaurant. Food and drink must eventually be accessed through genuine physical locations.
- [x] Four desk activities: coffee, water, small snack and rest. Separate per-item locks plus **90-minute shared lock**; disabled choices display the actual next available game time.
- [x] Factory refreshments including tea and biscuit share these limits with the desk. Individual purchases still use personal funds; existing factory duration/cost rules remain intact.
- [x] Handle negative pre-1970 worldMinute timestamps correctly for 1878. The condition remains frozen when the Washington simulation is frozen, and survives save/load without a second clock.
- [x] Add `character-needs.js`, `character-needs-ui.js`, `character-needs.css`, and two source tests. Focused source QA passed.
- [x] Document proposed **top-down factory production room first, existing management functions below in independently collapsible panels**, with disclosure states persisted. See `docs/FACTORY-ROOM-FIRST-MANAGEMENT-BELOW-2026-10-31.md`.
- [ ] The factory-screen redesign, home cooking, café/restaurant dining, household meals, purchasable provisions and NPC needs integration are **future work**, not implemented in this checkpoint.
- [ ] Full local Node suite, Linux Electron visual/play regression, and owner acceptance remain outstanding; no GitHub Actions, terminal commands, executable or release tag.
- [ ] See `docs/RELEASE-NOTES-v0.7.46-dev.md`.

## 31 October 2026 · v0.7.45-dev: original tile-toolkit build and license-aware source study
- [x] Verify Project Porcupine and Open World Builder are **GPL-3.0**, while Ogmo Editor 3 CE, 2dtiler, and Space Station 14 content code advertise **MIT**; their artworks and engines require separate file-by-file analysis. Never import GPL code or unreviewed sprites into this game's existing license.
- [x] Document what to learn versus what not to integrate in `docs/OPEN-SOURCE-TILE-GAME-LESSONS-2026-10-31.md`, including original engineering equivalents and remaining game-system gaps.
- [x] Add `room-builder-kit.js` as the original, dependency-free 32×32 toolkit: connected-region flood fill, rectangular construction/floor painting, eyedropper, atomic collision-validated edits, visual layer awareness.
- [x] Expand DEV Room Builder UI with painting mode controls, named blueprint save/open/delete (separate from active career and current office), category-aware object descriptions, and clickable/keyboard-accessible tools.
- [x] Define truthful furniture behavior metadata and a room-path audit of approachable workstations/storage/seating. Existing real executive desk action remains the only concrete furniture gameplay interaction; no fictitious NPC wages or inventories.
- [x] Repair solid furniture/actor overlap in **both placement orders**, movement, and import validation; keep existing approved map, office UI geometry and sprites unchanged.
- [x] New `tests/room-builder-kit.cjs`; expanded room-builder core regressions. Focused editor core/toolkit checks passed using fetched GitHub source, not a live Electron run.
- [ ] **Not accepted:** complete offline Node suite, live Ubuntu Electron mouse/keyboard pass, updated newspaper visual acceptance, named blueprint restore in the actual app.
- [ ] Next after owner-approved Charles office: connect object positions to real NPC work slots and factory operations. Other factory rooms and asylum art remain later.
- [ ] No GitHub Actions, new executable/release/tag, third-party dependency, user testing command, or unauthorized map/UI movement.

## 1 November 2026 · v0.7.44-dev: printed broadsheet + navigable office editor
- [x] The Metropolitan Ledger live page now uses a date-stamped, three-column 1878 printed-newspaper design, large masthead and period rules; no published story or public dispatch content replaced.
- [x] Archive cards reopen stored prior issues, with frozen financial narrative for newly saved editions. Legacy missing fields are disclosed rather than fabricated. Original archives remain intact.
- [x] Optional crude 16×12 demonstration office available in the room editor, but does not override any saved/approved owner design.
- [x] Room reachability/exit inspector, tile pathfinder, mouse grab-offset preservation, keyboard furniture nudges, non-destructive door and walking tests, backup and restore.
- [x] Block characters from walls, solid furniture and Charles's occupied spawn in placement, import and move operations.
- [x] Saved executive office scene supports proximity-bound **E / click desk** to open Charles's real desk; real character/location/session checks, no additional travel or teleport.
- [x] New `tests/metropolitan-newspaper-print.cjs`, `tests/office-scene-interaction.cjs`; expanded `tests/room-builder-core.cjs`. Four focused compatibility-harness checks passed without GitHub Actions.
- [ ] Still requires full local Linux Electron and mouse/UI acceptance. No executable/release or owner test requested yet.
- [ ] After approved office layout: expand shared tile tools to factory rooms; then eventually other locations and District Asylum (documented separately, spoiler-free).
- [ ] No approved Washington map geometry, 40 pins, executive UI or old 69-sprite appearance moved.
- [ ] See `docs/RELEASE-NOTES-v0.7.44-dev.md`.

## 31 October 2026 · v0.7.43-dev: visible world clock and real return journey
- [x] Remove instant long-distance `Return to Executive Desk` travel shortcut. Only Charles, while physically at Federal Electric, sees this button; other rooms have `Return to Map` and proper map travel.
- [x] Same-factory desk return still records one minute, refuses failed debit, and never changes location before a successful room move.
- [x] Re-check return-button visibility after map's dev-render bridge commits a real arrival, so returning to the factory still exposes the local desk button.
- [x] Add original desk-style **digital world clock/status banner** inside Washington map header and city-room shell: phase, live date, time, weather, exchange, company/personal cash, Pause/Play.
- [x] Street-following pawn animation now projects the trip's in-game minutes live in the map banner. One official journey debit is charged on completed arrival; cancellation discards the visual projection and restores the saved clock. No extra ambient second/market ticks during animations.
- [x] Add `tests/world-banner-travel.cjs`, update README and `docs/RELEASE-NOTES-v0.7.43-dev.md`. No map art or pin coordinates modified.
- [ ] Pending: complete local Node suite, Ubuntu Electron walkthrough, travel cancellation testing across route and dates, and owner acceptance. Source integration does **not** mean packaged gameplay tested.
- [ ] Continue building the room editor and executive office first. Defer asylum visuals and story expansion until reusable scene systems are accepted. No GitHub Actions or terminal commands for the owner.

## 31 October 2026 · ACTIVE v0.7.42-dev source checkpoint: reusable visual Room Builder
- [x] Developer DEV panel opens a 32×32 pixel **Pandora's Box-inspired original Room Builder** with the already tracked 69 generic sprites; no new artwork style or Washington map changes.
- [x] First room targets Charles's real `factory/executive-office` registry ID. Tile paint, solid doors/walls, mouse furniture placement, drag, rotation, duplication/deletion, undo/redo, spawn selection and collision-aware preview are committed as source.
- [x] Layout resizes 8–40 tiles and rejects destructive clipping; separate versioned developer save/load and JSON import/export added.
- [x] Saved office scene viewer added inside the existing location overlay, with keyboard walking and doors; old business desk and room travel remain the actual gameplay authority.
- [x] Ledger fourth/right-hand page now selectable, and handwritten notes append to dated permanent private pages. Older single-field notes remain readable as Earlier Private Notes.
- [x] Added `tests/room-builder-core.cjs` and `tests/private-book-writing.cjs`; 18 focused JavaScript parse/model/source checks passed in development inspection.
- [ ] **NOT ACCEPTED:** Complete offline Node suite, Linux Electron gameplay review, packaged executable tests, and owner visual acceptance remain outstanding.
- [ ] **NEXT:** Improve editor interaction reliability and real room/desk integration, accept the Charles office layout, then extend the same tool to other factory rooms.
- [ ] Only later: other city locations, streets and District Asylum scene building. Inspiration and stories parked in `docs/DISTRICT-ASYLUM-FUTURE-DESIGN-2026-10-31.md`, without movie spoilers.
- [ ] No GitHub Actions, terminal requests to the owner, or new release/tag. See `docs/RELEASE-NOTES-v0.7.42-dev.md` and `docs/PANDORAS-BOX-ROOM-EDITOR-2026-10-31.md`.

## October 28, 2026 · stacked source checkpoint v0.6.93-dev (owner-approved build continuation)
- [x] Player-visible provisional inter-location travel and room movement remain unchanged; the approved 40-pin map and artwork are immutable.
- [x] NPC calendar transitions can create thirty-minute saved in-transit journeys rather than always switching location instantly.
- [x] In-transit residents are absent from room-based conversation, rumors and meetings, while arrivals use only the existing player-controlled world clock.
- [x] A pending trip can complete within the same routine period; no new wage, encounter or independent NPC clock is created merely by finishing arrival.
- [x] Arrival records preserve last sixteen completed trips and support sequential destinations across a long time jump.
- [x] Dedicated travel-state regressions added. No current full offline Node suite or Ubuntu Electron playthrough has been claimed.
- [ ] Travel durations remain provisional, not measured routes. Future: historical route network, intermediate stops, true pathfinding, overnight itineraries and deeper economic timing.
- [ ] Continue stacked builds before the owner's next installation/test request; use the existing local Python changed-files patch workflow.

- [x] **October 28 final owner map correction:** Pin **#12 Home** (not “Our Home”) is **black for Charlie**, identical to Federal Electric's black owned pin. Its original x/y and `home` ID remain unchanged. Added regression assertion and refreshed JS cache links.
[Current handoff: v0.6.90-dev, 28 Oct 2026](HANDOFF-2026-10-28-v0.6.90-dev.md) · [Canonical owner decisions](DECISIONS.md) · [Character Codex](CODEX-INDEX.md). **Read newest headings first: older completed source slices are archival and may describe superseded UI behaviors.**

## October 28, 2026 owner correction · anchored Washington pins

- [x] Remove **white anchor dots, leader lines, and dynamic collision-spreading**. User rejected pins jumping between zoom levels.
- [x] Numbered map pins stay at their **assigned plotted coordinates** through pan, zoom, filters and open location cards. Preserve original Washington artwork, 40-pin directory, edited names and historical x/y.
- [x] For overlapping pins, bring hovered/focused/selected marker labels above neighbors rather than pushing markers elsewhere. Directory still selects all 40.
- [x] Three known off-print provisional destinations remain edge-docked with warnings, pending real map placement; do not invent sites.
- [x] Revise map source regressions to require fixed anchors and forbid white-dot/tether rendering.
- [ ] Still requires complete local Node QA and owner-tested Ubuntu Electron confirmation. No GitHub Actions.

## 28 October 2026 · v0.6.90-dev, not accepted
- [x] Save-backed **60** individual 0–100 skills across all four playable characters, role-starting values and a **Journal → Skills** directory. Fishing and selected industrial/maritime actions now earn skill; other categories await their actual activities, not free XP.
- [x] Full unfolded paper map lying on the career desk. Click it to enter the original fixed Washington map with 40 numbered, editable pins. Hover names stay in front; mapped owned property pins appear black. No new unapproved geographic map pins or map art.
- [x] Broker-only stock trade access; all period-listed stocks displayed at physical office, searchable by company or ticker and filterable by sector. Repeated visits unlock *telegram* instructions from the executive office, not telephone trading. Finite fictional issued/offered shares.
- [x] First playable steelworks, regional railroad, merchant cargo shipping, and fishing vessels. Different treasuries, upkeep, repairs, finite goods, commercial routes, captain/merchant leads, some sea-loss hazards.
- [x] Skill-100 legendary sturgeon (0.5% per eligible cast); preserved/paid trophy mounting, Saturday fishing meets, newspaper notices, and skiff/smack/trawler types.
- [x] Audit repairs: source runner now reports all tests; updated old 38/40 and NPC count assumptions, map collision spec, market branches, Go There test stub. Go There now requires successful travel/room-walk accounting before location commit.
- [x] Focused V8 simulations for industry, ship arrivals, fishing vessels, skills and 20,000 high-skill fishing casts passed.
- [ ] **Release gate:** Run `bash scripts/local-source-qa.sh` locally, fix any remaining failures, perform direct Ubuntu Electron playthrough. Full current Node suite and Electron gameplay have **not** been run here. Do **not** claim QA green or create an accepted release/tag yet. No Actions.
- [ ] Remaining design: concrete player ownership/acquisition registration for additional sites, ship captains as autonomous named individuals, historically verified port risks, full steel/rail capacity, broader cargo invoicing, meaningful activities for remaining skills, stock liquidity across NPC traders, realistic IPO underwriting, marine insurance claims and international navigation.
- [ ] After owner accepts a tested snapshot, follow required local commit+annotated tag, then GitHub push+verify; keep original fixed 1938 guide art and user-approved UI geometry.
See [v0.6.90 development notes](docs/RELEASE-NOTES-v0.6.90-dev.md).

### October 28 follow-up: 1–30 / A–R historical coordinate preservation
- [x] Recount all forty distinct numbered markers, ensure no duplicates or missing numbers.
- [x] Use a single printed-image grid converter in `city.js` for the map, location card and directory.
- [x] Correct inconsistent descriptive grid labels: White House 12-I, Government Hospital 25-R, Washington Airport 9-P, Georgetown Canal 7-I, Eastern Branch 24-M.
- [x] Show #22 District Asylum at its fictional approximate sector 26-Q without claiming a real historic asylum there.
- [x] **ARCHIVED v0.6.89 experiment, REVERSED at owner request:** Previously repositioned badges behind information cards with white dots and leader lines. The current source removes this behavior. Never reintroduce shifting; preserve original anchors and map art.
- [x] Add on-map true rendered pin count (40/40 when no filters) and regression check for card obstruction and five fixed anchors.
- [x] Publish a complete forty-row pinned image-grid audit for approval.
- [ ] Owner actual Ubuntu run, full offline Node suite, check all forty click targets. No GitHub Actions.

### Map visibility & optional IPO proposal · October 28, 2026
- [x] Unfiltered All categories / All pins renders 40 of 40 numbered location markers, including #4 poker, #14 stockbroker, #39 National Theatre and #40 District Bank.
- [x] **Historical v0.6.89 only; collision spacing removed in v0.6.90:** Three off-guide sites remain warning-labeled edge-docked. All other pins retain their exact displayed map anchors on zoom/pan, without white dots or lines.
- [x] Pins are colored by actual purpose, with National Theatre entertainment blue and finance offices commerce red, regardless of historical/fictional label.
- [x] Red map close X permanently visible at upper-right inside map at desktop and narrow viewports.
- [x] **Archived prior QA:** An earlier V8 demonstration checked 40 registered pins and artificially spaced markers. That no-overlap assertion was intentionally discarded when the owner rejected drifting pins; current tests now assert stable coordinates, filters and 40 directory entries.
- [ ] Owner verification on Linux and full offline Node suite. Do not claim this v0.6.89 development patch accepted yet.
- [ ] Optional IPO gameplay: sustained business performance + reputable broker/underwriter, accounting review, valuation/pricing, sale of shares, cash receipt, founder control and market quotation. No automatic listing or arbitrary mandatory calendar date. Existing Explore Public Offering remains disabled planning-only.

### v0.6.89 development continuation · incremental player time, October 28, 2026
- [x] Exact desk button order: Step Away From Desk → Go to Lunch → End Business Day (New Game retained separately).
- [x] Step Away opens the Washington map without automatically entering a room; opening and closing the visible map cost one minute apiece.
- [x] Go to Lunch jumps only to the current day's noon with all intervening world simulation; End Business Day jumps only to the current day's 5 PM closing bell. No automatic food, sleep, or relocation.
- [x] Provisional travel costs 30 minutes per new location; moving between different rooms of one location costs one minute. No duplicate charge for choosing the same room.
- [x] Accepted bets incur one minute at horse/dog/midget races, boxing, underground prizefights/cockfights and poker. Event/game durations are additional. Invalid bets and blocked poker popup reservations incur no placement-time charge.
- [x] Boy Mercer has an unpredictable, date-based gambling-heavy schedule, one small weekly liquor-wagon unloading job, no steady employment, personal card wins/losses, risky cheating and theft, separate cash/expenses, and contradictory unverified stories. No fabricated jobs, housing, named victims or automatic player money transfer.
- [x] Focused source syntax tests plus travel idempotence checks; room and bet source-contracts extended.
- [ ] Full offline Node suite and Linux Electron hands-on playthrough, plus owner acceptance. No GitHub Actions, finished executable claim, changed Washington artwork, or old-save migration.
- [ ] Later: real NPC pathfinding across journeys, complete social consequences, deep poker/club membership gameplay, broader business/social economy and character-career content.

### Additional v0.6.89 source update (October 28): Boy Mercer and map information scrolling
- [x] Keep long location information scrollable within its card; only pointer wheel on the map itself zooms the map.
- [x] Add independent resident **Boy Mercer** (Boy given name, Mercer surname), using existing races/Chinatown/card-room spaces; no new map locations or pin changes.
- [x] His self-contradictory statements respond to repeated questions from SAVED conversation history. Claims are unreliable, never treated as canonical work, finances, real housing or scheduled appointments.
- [x] Add source regression expectations for NPC roster, schedule, truth status and map wheel handler; full Linux Electron owner test still pending.

## v0.6.89 source checkpoint · October 28, 2026 (pending owner acceptance)

- [x] Developer panel starts hidden on every launch; deliberate DEV button or Ctrl+Shift+D toggles it without disturbing map/rooms.
- [x] Remove dashed/unverified visual rings from Washington pins without deleting location verification metadata, editing pins, or replacing original artwork.
- [x] Add individually authored public occupational dialogue for the defined NPCs and truthful activity replies based solely on the actor's current simulated activity. Established Sullivan lodging may be stated; unknown residences and proposed engagements remain uncertain. Free-text character cards and quick questions coexist.
- [x] Add script-level/source-contract regression checks for the fixes. No GitHub Actions or installer.
- [ ] Owner-run complete offline Node tests and actual Ubuntu gameplay acceptance; do not label this source slice a finished release.
- [ ] Next deeper living-city slice: verified physical NPC travel, schedules and consequential economic outcomes without a second clock, invented homes or missed/duplicated settlements.

# Active build queue and handoff · October 25, 2026

**October 26 continuation (source committed, test executable deferred):** Financial custody beyond the horse track is now connected to **licensed boxing and the three poker tiers**, including poker window/game simulation, popup blocked, undealt refund and forfeited unfinished game. Player selects carried personal vs company money; corporate stakes remain corporate, actual losses stay on the company's books, profits return to the same ownership. Unsettled wagers have a persistent escrow independent of the rolling 160-item transaction history; retries and wrong-account claims cannot mint money. Physical cash desk/bank transfers quote available funds before spending **two player-triggered minutes**. Executive office draws/diversions also cost two minutes. Theatre actors retain individual actual stage/rehearsal schedule activities and distribute to allowed backstage/auditorium rooms; apprentice Hanford backstage, proprietor Rapley office; no fictional theatre payroll. Three new regression scripts registered with the existing offline source suite. **Source-only V8 checks passed: 405 banking/betting; 145 theatre permissions/attendance; 104 route/era simulation. Full Node test suite and Linux Electron UI NOT run.** No GitHub Actions, installers, map-artwork or old-save migration.

**Later slices, NOT YET DONE:** Extend explicit custody to underground fights/cockfighting with real tickets; verify private/social invitation systems and actual club hours; give all NPCs specific authentic conversations and earned theater/broker careers; run offline Node and Linux hands-on integration when a larger playable candidate is requested. Do not advertise test readiness or a compiled executable before these checks.


**October 26 large source slice implemented, PLAYABLE TEST BUILD DEFERRED:** existing secondNightclub/pin 15 renamed **Le Paon d’Or** with translation, fully owned by Lui, decadent cabaret and influential protection; National Theatre/pin 39 added with Booth, Jefferson, McCullough, Morris, Raymond, Hanford and Rapley as local autonomous 1878 residents; optional District Bank/pin 40. Hillsdale/pin 13 gained butcher and market as room-level businesses with own limited inventory and supplier deliveries. Real stock quotation list and in-person brokerage orders available on broker map arrival. Physical company cash at works vs carried company vs company bank; personal carried/checking/general savings, separately accounted. Bank visits fully optional. Carried company cash can fund horse wagers with recorded corporate exposure and company-owned payouts. Rare travel risk requires actual journey (including executive desk return), no idle losses. Room cash indicators remain visible; top header shows time instead of obsolete FREE PLAY label. Resident off-duty movement based on obligations and sociability; Li Wen's Chinese-only speech and offline greeting fallback. Original Washington bitmap unchanged; rooms/pin name references stay editable/filterable. **No Actions, installers, or executable.**

**Next QA/remaining:** Run `npm run test:source` locally and actual Linux/Electron navigation as a later large acceptance candidate; check broker buy/sell funds and UI, full bank teller flows, race cash ownership and time, Hillsdale shopping, NPC language character cards, seven theatre visitors and no duplicated events. V8 source checks so far: 56 finance, 25 Hillsdale, 104 across four routes x two eras. Broader bets (boxing/dog/poker), future banking risk events, stronger physical cash-custody interactions, fictional theatre booking mechanics remain separate future slices, not claimed complete.


**October 25 next source build: actual social encounters now have lasting personal consequences.** Added `npc-social-consequences.js` after the existing same-room `npc-social.js` engine and private `npc-memory.js`. Only a verified meeting present in the saved social ledger, with both residents **currently in the same actual room**, can adjust both participants' own saved moods and create their own verified first-hand memories of a conversation, assistance, or disagreement. Only those participants receive effects; the already-settled bilateral relationship is **not** paid a second time. The module rejects forged or cross-room records and records a replay-proof saved settlement key. `npc-agency.js` now responds to this character's already-logged assistance and disputes when weighing caution and sociability; `npc-personality.js` lets a higher mood modestly affect approach to an NPC's existing individual **free-text character card**. No invented romance, friendships, contracts, invites, public reports, secret sharing, wages, homes, or separate AI-chat UI. New `tests/npc-social-consequences.cjs` plus source-contract script-order requirements in offline `npm run test:source`. **70 focused V8 unit assertions and 898 eight-scenario integration assertions with 413 generated co-present encounters passed.** Full Node source suite, actual packaged Linux gameplay and player acceptance remain **unrun**. No GitHub Actions, executable, save migration, map changes or altered player-time authority. Next: connect verified work/commerce outcomes and true physical journeys, finish households and broad NPC coverage.


**October 25 · persistent NPC goal-follow-through source slice:** Added `npc-life-plans.js` and hooked it into `npc-ai.js` after per-person utility scoring and after actually settled actions/encounters. **Each eligible autonomous resident retains a private, save-backed goal commitment**, provisional progress stage, bounded verified-work/visit/encounter evidence, and a small revision history. Minor utility-score fluctuations do not erase a character's running plan; a sufficiently strong new priority can change it. Fatigue can pause effort without deleting the aspiration. **Only actions tied to actual occupied rooms and new financial-period receipts count; only `npc-social.js` encounters count toward social follow-through.** A stage means effort observed, **NOT that a contract was delivered, a promotion earned, a friendship guaranteed, a goal completed, or unknown NPC histories simulated**. The module never advances time or creates a separate user-facing AI chat. `tests/npc-life-plans.cjs` joins the offline source suite; extra per-character assertions and load-order contracts were updated. Focused V8 checks: **38 plan unit assertions and 88 post-fix four-route/two-era integration assertions passed**. Complete `npm run test:source` and actual Linux/Electron playthrough remain **unrun**. Goal execution linked to concrete worldly outcomes, complete travel/sleep/economy simulation, broader population and complete Star Club gameplay remain open. No GitHub Actions, packaging or map replacement.


**Next source housing slice, October 25: verified lodging without invented properties.** New `npc-residences.js` uses the established room registry plus `city-access.js` to resolve **Sullivan's confirmed rented factory bedroom**, `factory:workers-lodging`, between 10 PM and 8 AM. Normal access applies; the resident doesn't receive universal staff, private-club, or home permission. `npc-ai.js` places Sullivan there through the existing saved calendar, and `workshop-presence.js` no longer hides him on account of being off shift **while in his rented room**. At 8 AM he leaves for the next usual activity. `tests/npc-residences.cjs` and night/morning assertions in `tests/npc-unselected-protagonists.cjs` were added, with source contract/load-order checks. **12 residence permission checks and 40 four-route integration assertions passed in a V8 source harness**, not the complete offline Node suite or live Electron desktop. **No addresses, bedrooms or rent payments were invented for other NPCs**. Arrival at the existing routine boundary is not yet a pathfinding/journey-duration simulation; that and full independent households remain open. No map changes, old-save migration, GitHub Actions, executable or packaged archive.


**Next source slice: saved-clock NPC needs (October 25, source only):** New `npc-needs.js` maintains individual saved **energy, appetite/hunger, mood, observed active/rest hours and last processed world minute** for era-eligible autonomous residents. The `npc-ai.js` calendar path settles these personal conditions against the **player-controlled authoritative calendar**, so ordinary clock sampling and autosave do not manufacture fatigue; `npc-personality.js` takes the resident's present condition into account when they respond through **their own free-text character card**. Resolved routine hours come from each person's provisional weekly plan; off-duty rest has **no claimed bedroom, travel, purchase or economic receipt**. For jumps longer than fourteen days, the system explicitly records **unresolvedMinutes** and models only the last fourteen days, so this is NOT complete chronological NPC catch-up. `tests/npc-needs.cjs`, the upgraded route/character and personality tests, and source-contract load-order assertions are registered for local offline QA. Focused V8 unit and 42 cross-route integration assertions passed; the **complete Node source suite and live Linux Electron playthrough have NOT been run**. The broader all-person homes/sleep, practical food economy, employment consequences, all-actor chronological travel and private agent planning remain open. No Github Actions, executable, or map change.


**Source continuation (October 25, after minute-window slice):** Added the four canonical protagonists as possible NPCs in `npc-ai.js`; **the chosen protagonist is never simulated as an NPC**, while the other three join the original eleven Washington residents, giving **fourteen active autonomous identities in each profile**. Charlie's company, Sam's Hillsdale patrol, Eli's nightclub door and Edmund's asylum orderlies are anchored to existing genuine rooms and door restrictions. Initial workweek/weekend routines and uniquely authored Star Club opinions/uncertainty use each character's own card; no menu or separate AI chat. The unselected protagonists' economy intentionally does **not** manufacture unapproved salary, savings, credit or betting proceeds. Sullivan's Saturday grocery errand is now scheduled at the existing Chinatown market while preserving his five-day factory workweek. `tests/npc-unselected-protagonists.cjs` covers route exclusion, actual occupancy, card opening, evening doorman duties, saving and owner-only clock. Legacy source-contract checks for removed dialogue topic widgets were corrected. **Source integration was exercised in a V8 in-memory harness, not the full local Node suite or real Linux desktop.** This is only a limited roster/life-foundation sub-slice; independent home life, earned finances, dated appointments, true journey durations, broader public resident coverage and complete planning all remain open.


**October 25 source continuation, minute-schedule slice (committed, not Linux accepted):** The original eleven named NPCs retain their own definitions/AI; each now has a **seven-window provisional daily activity rhythm** (morning duties, second morning activity, short midday meal, afternoon work, two evening intervals, and an overnight interval) where their weekday/Saturday/Sunday availability permits it. `npc-weekly-schedule.js`, `npc-calendar.js`, `npc-itinerary.js`, and `npc-ai.js` share these refinements; the night period keeps the previous business date after midnight. **Economic actions and fatigue remain bounded to their former four daily financial periods**, preventing twice-paid wages or duplicate purchases merely because an activity changes mid-period. `tests/npc-minute-routines.cjs` is registered in `npm run test:source`. Focused in-memory logic checks were performed; **no complete local Node suite, Electron UI, or actual Linux-owner acceptance occurred**. This does **NOT** complete all-NPC timetables, housing, dated appointments, actual travel-time simulation, chronological skip reconciliation, multi-step agency, or Star Club women's schedules. Continue the unchecked queue below; do not promote this limited refinement to an autonomous-life milestone.


**READ FIRST:** [Full NPC AI, dialogue-card, scheduling and Star Club handoff](HANDOFF-2026-10-25-NPC-AI-AND-STAR-CLUB.md), then [AI dependency/source audit](AI-DEPENDENCIES-AND-NPC-SLICES.md). This new handoff captures **every owner request from the latest conversation**, exact built-versus-planned boundaries, and manual acceptance criteria. It supersedes stale older instructions below when they conflict. Source work was authorized in slices, **NO GitHub Actions, NO executable**, one existing `main` branch.

**Completed in source, pending complete local/Electron verification:**
- [x] Resident importance-ranked private memory, uncertain player statements, occasional reflection, per-NPC temperament and deterministic brush-offs.
- [x] A distinct silhouette **NPC card opened from people actually in the same room**. Conversation text and free-text input **inside the card**; **NO visible prompts, topics or menus**.
- [x] Partial local-model dialogue bridge, small authored responses for the Star Club and sensible uncertainty, Russian-language gating, tested initial personality and memory modules.
- [x] Initial weekday/Saturday/Sunday **four-period** routines for eleven main simulated residents; public itinerary is approximate, not a guaranteed whereabouts tracker. This is **NOT a complete schedule for every NPC**.

**Next approved source slices, do NOT prematurely check off:**
- [ ] 1. Run existing local source test baseline if an actual local checkout is available, and fix any latest-source regressions without triggering GitHub Actions; explicitly report tests not run.
- [ ] 2. Expand **all interactable people's** individual schedules to real dated appointment/work/meal/rest/errand/household actions with time-skip reconciliation, actual travel, source-of-truth room position, finances, Saturdays and no NPC master-clock authority.
- [ ] 3. Add multi-step goal execution/plan revision, relevant work and purchases, remembered relationships and witnesses. Unchosen protagonists must play genuine lives, not preselected newspaper endings.
- [ ] 4. Enrich Sims-style traits, moods, goodwill, refusal, rudeness, class attitudes and personal social behavior; never one stereotype shared by a whole group.
- [ ] 5. Extend contextual **free-text-only** authored dialogue/semantic fact recognition and era-specific knowledge toward hundreds of individual responses; unknown facts → admitted ignorance. Make optional local AI sound natural while preventing invented world events/permissions.
- [ ] 6. Show the **nightly adult ladies roster** at Madam Star's club; save each woman's **gold-star favorite** state without summoning her. Give all their distinct personalities/schedules.
- [ ] 7. Create **one private bedroom per individual woman**, each locked until that woman's affirmative invitation; private office remains Madam Star-invitation only; NO generic private-room menu bypass.
- [ ] 8. Make Star Club Salon, Main Parlor, Dining Room and Brandy Room meaningfully playable with period music, personal expenses, conversation/social memory, and smoking **only** in the Brandy Room. **No cards/poker or floor-show at Star Club**.
- [ ] 9. Perform full offline tests and genuine Linux UI regression/acceptance, including confirmed map **Go There** entering full-screen actual rooms; no artifacts or package until separately requested.

**Do not rewrite the map, resurrect old dialogue topic buttons, call the partial NPC system finished, claim a bundled LLM, or turn an invented NPC opinion into verified history.**

> **October 25 AI/character-card source slices (CURRENT):** Read [AI dependencies and living-NPC slices](AI-DEPENDENCIES-AND-NPC-SLICES.md). The owner approved incremental direct-GitHub source building with **no GitHub Actions or executable**. The committed work adds (1) importance-ranked per-profile memory/reflection, (2) temperament and refusal, (3) separate silhouette **character cards** opened from a same-room resident list, with one **free-text conversation** field inside the card and **NO dialogue topics**; (4) curated Star Club perspectives and honest ignorance with optional loopback LLM; (5) scheduled Anna Petrovna, retiring old fixed authored-location conversation pages; and (6) 11 named NPC weekly patterns consumed by both live NPC calendar and learned public itineraries. Map Go There full-screen navigation and normal room permission checks remain intact. **Only targeted V8/offline suites have been run here; full Node/Electron acceptance is pending.** Full autonomous life simulation, long-horizon planning, hundreds of dialogue variants, Star Club nightly roster/gold favorites and per-woman room invitations remain OPEN. Original GitHub design references AI Town, Generative Agents, llama.cpp, optional Ollama; see audit doc.\n\n> **October 25 room travel confirmation and next proposal:** The owner reports that the Washington map's **Go There** now enters actual building rooms after the direct local patch. The successful combined repair reused the known-working developer room renderer after ordinary player checks, restored `dev:false`, persisted location/room, closed the map and isolated the click from dragging. **No single cause was isolated**. A developer-access workaround is not the final architectural ideal. Mandatory future-room regressions and packaging rules are recorded in [Room navigation repair playbook](ROOM-NAVIGATION-REPAIR.md). **Next *proposed*, not started:** N1 Star Club playable social-room slice (Salon, Main Parlor, Dining Room, Brandy Room; private rooms remain restricted; period-appropriate background music; no poker, no new map). No gameplay change/build, GitHub Actions or accepted executable in this documentation checkpoint.

> **Navigation repair:** The map **Go There** button now verifies entry into a visible city room and stops click propagation. Successful travel enters the room scene and closes the map; failed travel stays on the map with an explanation. Previously saved same-location visits reopen their rooms rather than silently doing nothing. Every visited room uses an opaque full-screen view so the businessman’s desk does not remain visible beneath it. Star Club's default room now identifies its salon. No map bitmap, number or pin position changes. `tests/map-go-there.cjs` checks the real travel function offline. No GitHub Actions or artifact uploads.

> **Championships register:** The Sporting tab now shows a read-only **D.C. Sporting Champions** register: actual saved titleholders, resolved competitor names (including named midget drivers), period-aware sports and active qualifying progress. The display never guesses champions or independently advances time. Source tests cover period gating, cross-roster names and zero state mutations. The map is unchanged, and no GitHub Actions are used.

> **G3d regular vs championship oval sport:** Last Sunday of every available sporting month is a D.C. title meeting at **Potomac Kennel Track (1919+)** and **Capital Speedway (1933+)**. The existing two heats and feature final now produce saved tournament results and a titled champion. Ordinary meetings remain separate, including across other weekends. Titles, names and records persist per profile; the original printed map is untouched. Dedicated regression verifies real results and exactly-once champion award. No GitHub Actions used.

> **M1 map-category slice:** `map-pin-palette.js` now classifies the existing Washington markers by ten functional colors, with the separate Fiction/Non-Fiction dropdown and reading cards untouched. Government Hospital gold, private District Asylum off-white, Madam Star and Lui blue, Hillsdale brown; historical real/fake is no longer a pin color. Original map asset, 38 numbered locations, editable names, saved positions and printed grid unchanged. Focused `tests/map-pin-palette.cjs` added; human visual validation remains outstanding.

> **Map-facing names:** Map pin **#13** displays **Hillsdale / Barry Farm**, preserving existing `hillsdale` ID, coordinates and editable names. Fictional venue origin cards now identify **Madam Star/Eleanor Victoria Ashcroft** and **Lui/Lucien Étienne Delacroix**; neither new geography nor a map swap. README notes President Tilden is an actual scheduled NPC while the rest of the historical cast is still in progress.

> **G3c sporting era gates:** Dog racing is gated from **1919** and midget-car racing from **1933**, matching the championship model. No fantasy 1878 dog/motor meetings or betting; existing map and pin identities are untouched. Regression checks exercise 1878, 1920 and 1938 simulation setup.

> **P1a live historical NPC:** **Samuel J. Tilden** now has a saved NPC schedule at the existing White House during his first known presidential term (**March 4, 1877 through March 3, 1887**). Historical dates gate his appearances; the outcome of the 1886 election remains unknown and no later White House presidency is invented. His government duties do not create independent offscreen time progression or automatic gambling. Existing fictional NPCs remain intact. James Wormley and the larger political circle stay in the verified/proposed historical roster until proper venues and appointments are established.

> **P1 roster slice:** New `historical-people.js` lists Tilden, Hendricks, Hewitt, Bigelow, Marble, Manning, Wormley and Douglass with historical/public backgrounds separated from **proposed** game positions; merely listing them does not make them scheduled or playable. `world-canon.js` now knows Tilden became president on **1877-03-04**, not just beginning in 1878, and stops assuming his tenure after his scheduled first term. Historical roster regression included in required Source QA.

> **G3b boxing integration:** The existing Washington Arena card now carries an officially scheduled **Saturday D.C. Boxing Championship** bout in its main event. The two qualifiers occur on consecutive Saturdays followed by a title final; a draw does not advance. The titleholder remains in the saved championship ledger. Once the first champion is established, subsequent championships open on a month's first Saturday (and may finish in later months). Standard boxing bouts still happen between championship nights. Fight Club has no tournament, rankings, or champion. Added dedicated engine test to the source suite; broader browser and desktop validation is still pending.

> **Club follow-up QA:** Only **completed hands** count toward the trial, so simply opening/leaving a new poker window cannot grant membership. The actual Commerce/Embassy venue access now recognizes a stored member's card, respects temporary cooling-off periods, and continues honoring ordinary invitations for trial games. Added integrated source-contract test.

> **Fight Club slice:** Private fights are now night-only and unranked. Members at the concealed venue can volunteer for a 20-minute bout; every night is fresh and yesterday's result does not grant a title or compel a rematch. The club's persistent profile state captures acquaintances without ranking wins. The licensed boxing tournament remains entirely separate.

> **Constitutional source slice (October 24):** Ten-year presidential terms, **unlimited reelection**, nationwide popular vote, first alternate winner Samuel J. Tilden (1876), next regular election **1886**, first term 1877–1887. No 1880 presidential election. New `presidential-charter.js` API plus historic dialogue updates and source tests. The actual 1886 contest, candidates and any dynamic presidency succession remain unimplemented and undecided.

> **Member trial integration (October 24):** Commerce and Embassy invitees play a **first trial session**, with table-etiquette choices, actual poker winnings, and optional paid hospitality affecting whether they receive a personal membership card or must return after a short cooldown. Member cards live in per-profile belongings and bypass re-invitation. Unrestricted Boiler Room unchanged. The trading clubs remain unauthorized gambling; this is not the D.C. Poker Challenge.

> **New owner-directed slices, October 24:** Implement **Commerce Club / Embassy Room trial sessions**, social/financial etiquette, short reentry cooldowns, and actual **Commerce Club and Embassy Club Membership Cards** in personal effects. Boiler Room no restrictions. Properly distinguish *licensed boxing long-form championship* from **unscheduled underground fights with no ranking or champion**. No underground tournament system.

# Capital & Consequence Development Roadmap

> **G3a source integration:** The **last Sunday of each month** at Capital Race Grounds hosts the **D.C. Horse Racing Championship** using its already existing four heats, two semifinals, and Main Event. Source results feed `championships.js`, which stores the winner and past titleholders in the active profile; other daily meetings remain regular. No different map or race minigame. **Other sports and advance outright-betting UI remain future slices.**

> **N1a named social character slice:** **Eleanor Victoria Ashcroft / Madam Star** has a documented full identity, and **Lucien Étienne “Lui” Delacroix** now has a separate autonomous NPC identity and workplace at the existing `secondNightclub` location. The venue is visibly attributed to Lui while its formal commercial name/address remains undecided. Madam Star forbids cards. **Meal ordering, stage performance, VIP visits and hidden intrigue are still future interaction systems.** Existing location IDs and map positions are unchanged.

> **G2 source slice:** Profile-serializable `championships.js` supports distinct-entrant monthly brackets, qualifying rounds, an actual final and a persistent D.C. titleholder ledger. Fixed-odds wagers are government-classified at placement; stake debits and payout credits are returned for the caller to apply exactly once. **Poker tournament ID matches government permit (`dc-poker-challenge-YYYY-MM`)**; private room play does not. Motor racing is blocked before 1933 and organized kennel racing before 1919. This is engine groundwork **not yet a playable D.C. Poker Challenge, betting UI, or integrated event calendar**; source test is now included in Source QA.

> **G1 source slice:** `gambling-law.js` establishes a narrow government permit for **only five-card D.C. Poker Challenge tournaments at their own venue**. Private Boiler Room, Commerce Club, Embassy Room poker and other unlicensed wagering stay illegal; Star Club forbids cards. Current poker and sporting UI now discloses the distinction. `tests/gambling-law.cjs` added to Source QA. The five-card tournament **game**, full enforcement and actual championships remain pending.

**Current design priorities (October 24, 2026)**

The **[README](README.md) is player-facing**; technical details, previous source milestones and log entries are in Git history, this roadmap and [CONTINUE-HERE](CONTINUE-HERE.md). Source is currently **v0.6.88-dev**, last previously verified QA run [40069611982](https://github.com/dereksparks1982/capitalconsequence/actions/runs/40069611982). This planning/documentation checkpoint **does not imply the following features are implemented**.

### Approved next-build slices

- [x] **D1 · Story canon and player-facing introduction**: rewrite README, establish [named character roster](CHARACTER-ROSTER.md), [living-city plans](WASHINGTON-LIVING-CITY.md), [politics](POLITICAL-WASHINGTON.md) and [sports/gambling](SPORTS-CHAMPIONSHIPS.md); connect decisions and handoff.
- [x] **G1 · Government gambling authorization**: separate legal event permits from unsanctioned Boiler Room, Commerce Club and Embassy Room; Star Club remains no-card. Tests for authorized versus illicit cases, dates and game variants.
- [x] **G2 · Persistent tournament and betting kernel**: stateful monthly standings/champions, legal-permit validation, event identity, no duplicate bets or payouts.
- [ ] **G3 · Individual sporting integrations**: horse/dog/boxing and later car qualification and championship events; proper 1878 technology gates. Existing daily meeting generator should not fabricate daily titles.
- [ ] **G4 · D.C. Poker Challenge**: a **separate** government-sanctioned **five-card** poker tournament venue; choose variant and integrate real card simulation. The three social poker clubs continue regular sessions.
- [ ] **N1 · Social venues**: British **Eleanor Victoria “Madam Star” Ashcroft** runs refined dining, drinks and music **without poker**; French **Lucien Étienne “Lui” Delacroix** runs a cabaret and Eli Crowe's job.
- [ ] **P1 · Historical Washington**: Tilden inner-circle characters and plausible named historical figures with persistent independent city routines; researched biographies, fiction separation, earned acquaintances.
- [ ] **P2 · Political career**: grounded opportunities for district appointment/office, congressional access and later national popular-vote political ambitions, no invented district rules.
- [ ] **C1 · Neighborhood retail**: *Capital Meats* east, *District Meats* west, separate Black-owned Hillsdale butcher + market, Chinatown meat, neighborhood essentials; actual shared stock, costs, access and remembered discrimination. **Medford Meats rejected.**
- [ ] **M1 · Category-colored pins**: gold for government **only**, red commerce, blue social, brown Hillsdale, green parks/education, purple religion, charcoal industry, teal recreation/water, white private healthcare, gray housing. **No blue=fake/red=real.** Explicit Fiction/Non-Fiction cards remain. Keep the **same map**.
- [ ] **QA · Integrated suites and desktop validation**: all economy/time/career/map/venue/sport regression checks, then owner acceptance before any release.

**Current invariant:** No map replacement or year swaps. No splitting `app.js`. NPCs never make the clock advance. All gameplay, cash and choices persist per profile. No fabricated playable features or unapproved alternate-president appointments. Only `main` branch. No user-approved executable yet.

---

# Capital & Consequence Development Roadmap

> **LATEST STORY CARD UPDATE · October 24:** All **22 fictional/blue** map locations now present their own openly readable **Our Alternate History · Fiction** narratives on map and room cards, explicitly separated from real history. The **16 non-fiction/red** places continue to offer collapsible factual summaries and Wikipedia + LOC further reading. Four focused map/history source+simulated-DOM checks passed. Map artwork unchanged; full Ubuntu/Electron acceptance remains pending. See `CONTINUE-HERE.md` for exact handoff.


> **MAP EDUCATION / VISUALS · October 24:** All 38 map destinations show Fiction or Non-Fiction explicitly on map cards and destination rooms. The 16 real places have collapsible historical reading with Wikipedia and Library of Congress references, external browser opening and clear separation from alternate-history events. Historical red and invented blue pin fills are 68% opaque. Source and simulated-DOM tests pass; Electron mouse interactions and the complete Ubuntu source test suite still require native verification. No map replacement or accepted executable.


> **HISTORICAL EDUCATION & PIN VISIBILITY · October 24, 2026:** Both map and room cards explicitly say **Fiction** or **Non-Fiction**. All 16 real-world destinations display collapsible historical summaries with targeted Wikipedia + Library of Congress links, independently of game lore; the 22 invented destinations do not. Red and blue pin fills are semi-transparent (alpha 0.68), leaving marker numbers readable. Focused map and history-card source behavior checks passed; full Ubuntu/Electron hands-on acceptance still pending. See `tests/map-history-card.cjs`, [MAP-CANON.md](MAP-CANON.md), and [MAP-LOCATION-GRID-AUDIT.md](MAP-LOCATION-GRID-AUDIT.md).


> **LATEST MAP & COMMERCE UPDATE · October 24, 2026:** The fixed map now carries **38** numbered city destinations, with red historic / blue invented identities, including Franciscan Monastery #35, Cobbler #36, Eastern Market #37 and Georgetown Market House #38. The newest 3 are registered public locations with placeholder service rooms, not yet functioning trade/repair gameplay. Map grid audit: 5 depicted features, 19 documented area placements, 14 precise sites undecided. Map drag changes require confirmation and reject off-image positions; they never auto-save. Search/category/origin filters, directory, export and pin renames remain. See [MAP-LOCATION-GRID-AUDIT.md](MAP-LOCATION-GRID-AUDIT.md). Full Ubuntu Node/Electron playthrough is **not yet verified** for this code. No new executable distributed.


> **CURRENT MAP SOURCE · 38 destinations, October 24, 2026:** Red marks real historical places, blue invented destinations. Added Franciscan Monastery **35** (Brookland), fictional Cobbler & Shoe Repair **36** (beside Eastern Market), historic Eastern Market **37**, Georgetown Market House **38**. Only existing permanent guide artwork is used for every playable year. Category/search/grounded grid, directory and per-profile JSON export are live source features; no map movement changes. Pin drops require explicit confirmation at a valid printed map coordinate; unchecked or canceled moves revert. Audit: **5 printed features, 19 real/stated geographic areas, 14 premises without an established address**. Cobbler repairs and merchant markets still need an actual economic gameplay slice, not an invented empty promise. Read [MAP-LOCATION-GRID-AUDIT.md](MAP-LOCATION-GRID-AUDIT.md). Full Ubuntu/Electron interactive QA and playable executable acceptance remain outstanding.


## CURRENT SOURCE · v0.6.88-dev · fishing and living Washington merchant market (October 24, 2026)

**[x] Playable shore fishing:** Six existing locations (pins 29–34) now host a location-bound rod-and-line game. A personal 75¢ tackle purchase equips the character; casting takes six player-controlled minutes and reel/hold/steer/give-line each take one minute using the canonical 1:1 clock. Fish have visible direction, tension, distance and stamina, and can be landed, escape or break free. Caught fish remain in the player's saved eight-fish creel, with voluntary release only. No aquarium, automatic sale, new map artwork or additional map is included. Fishing tests verify save/load and reachable catches.

**[x] Shared finite merchant economy:** Chinatown's existing Market Street lets players buy physical supplies with **personal** cash. NPCs autonomously buy from the **same** finite merchant stock and tills, and Sullivan's Saturday groceries draw from that stock without changing his $6 weekly wage or 25¢ factory rent. Supplier deliveries are recorded on observed Monday/Thursday morning slots, add physical quantities and explicitly track wholesale payments/debts. The seller can run out of an item. Player purchases persist in a saved shopping bag. NPC choices never independently advance time. Deterministic source tests cover market cash, supplier deliveries, stockouts, duplicate prevention, and shared NPC/player purchases.

**[x] Original map and UI stay:** One canonical alternate-history map for 1878, 1938 and every other year. All **34 numbered pins**, editable profile-local names, Save Name, Reset Name, and all Locations filters are retained and source-tested.

**Verified full Source QA:** [run 40069611982](https://github.com/dereksparks1982/capitalconsequence/actions/runs/40069611982), source commit `4eaf1d55b652c8d8b7d8222b8af0777742cb135b`, passed. This is not proof of interactive human playthrough. Desktop candidate pending. The approved packaging process is one **private, unaccepted Linux v0.6.88 test executable** after all source slices, source QA, desktop smoke test and SHA-256; do not publish/tag/accept until owner validates it. GitHub release-upload by bot was denied (403), so the manual-only Linux workflow now tries a **private Actions artifact** with an archive and checksum. GitHub artifact storage may be full; if so, report the actual delivery blocker without calling the build downloadable.

**Future concept, not implemented:** The user likes vintage engraved banknote-style square `Ledger Marks` icons and saved concept art for later. Do not integrate the icon set or modify map art in this gameplay candidate without a new approval.


> **CURRENT OWNER DECISION · OCTOBER 24, 2026 · PERMANENT MAP CANON:** The bundled Washington map is the single authoritative alternate-history map for **1878, 1938 and every playable year**. It never changes with the calendar. No historical replacement, reconstruction, map survey or map-image swap is authorized or planned. The asset filename `title-map-1938.jpg` is a legacy name, **not** the map's in-world date. Preserve all 34 numbered markers, working editable per-profile pin names, Save/Reset Name, map pin dragging/zoom and Locations category filters. Map pin labels are user-editable display names; location identity and access logic are separate. **This overrides all earlier 1878-map replacement requests, research, checklists, and draft roadmap items.** See [MAP-CANON.md](MAP-CANON.md).


> **Current planning constraint:** No file-splitting or `app.js` modularization tasks. The owner explicitly rejected them. Current build priorities remain gameplay and verified 1878 behavior; documentation changes alone do not authorize code changes.

## HISTORICAL SOURCE · v0.6.86-dev · six fishing locations, editable map labels and category filters (October 23, 2026)

**[x] Six fishing destinations (pins 29–34):** Potomac River Fishing Bank, Babcock Lake (date-gated after 1888), Fletcher's Cove, Georgetown Canal Towpath, Eastern Branch Fishing Shore and Chain Bridge Riverbank. All six are public room locations under **Leisure & Outdoors**, separate from **Recreation & Competition** (racing/boxing) and **Gambling & Games**. All 34 map pins remain on the single, permanent alternate-history Washington map, across all playable years.

**[x] Existing map filters and editable pin labels:** The map category selector distinguishes leisure, competitive sport and gambling. Selected pins offer Save Name and Reset Name. Per-profile custom names and pin positions persist in the existing map-layout storage without changing immutable destination IDs, source names, travel permissions or geography; resetting pin *positions* does not discard names. Source QA includes tests for six registered fishing places, 34 pins, category labels, Babcock expiry and label persistence.

**Verified source build:** `v0.6.86-dev` on `main`; all Source QA tests succeeded on source commit `6f858f0a582c6592fd0646e665d997795bb19cea`, [run 40062272284](https://github.com/dereksparks1982/capitalconsequence/actions/runs/40062272284). No Electron/Linux executable has been completed or accepted for this version. Owner **explicitly requested an executable for testing after these six pins**; next permitted packaging step is to run the existing **manual-only** `Linux Desktop Build` workflow, verify smoke testing, SHA-256 and private draft candidate; do not create a public release/tag/acceptance snapshot without user validation.

**[x] HISTORICAL MAP REPLACEMENT CANCELLED BY OWNER (October 24):** Do not change the bundled map or switch it by year. The existing alternate-history Washington map is canon for 1878, 1938 and every other year. Keep all 34 pins, editable per-profile pin names, Save/Reset Name, drag/zoom and Locations filters. The old 1878 replacement research has been archived/withdrawn. See [MAP-CANON.md](MAP-CANON.md).

**[ ] Fishing gameplay still conceptual:** Fish direction/line tension should be shown live, with menu/dialogue actions such as give line, hold steady, steer, or reel. Fish react to choices; no aquarium and no automatic sale. No fishing engine, fish inventory, fish-fighting, tackle or catch economy has been built. The source candidate is **map-only**.

**Owner workflow:** Single branch `main`, do **not** split `app.js` or other source files, preserve 1:1 ticking game clock and player-only action-time jumps, and never assert old-save compatibility as a requirement. A successful source suite is not an Electron playtest.

## HISTORICAL MILESTONE · v0.6.85-dev · original Potomac fishing pin (superseded by v0.6.86)

**[x] Requested single-location slice:** Added **Potomac River Fishing Bank** (`potomacFishingBank`), public `riverbank` room, map marker **29**, in the existing **Sports & Recreation** category. Coordinates are an explicitly **provisional** Potomac-shore map placement, not an asserted historic street address. Ordinary existing Washington travel/room access applies. **No fishing minigame, fish catches, aquarium, fish economy, artwork, gear system, or fishing time mechanic has been built.** Fishing gameplay has been discussed (reactive fish direction, tension and menu choices) but remains **design-only until separately approved**.

**Verification:** Full GitHub Source QA succeeded on source commit `b136d4016a14d5af50c7e2eb401c1e4218fd144b`, run **40061471151**. The source candidate is `v0.6.85-dev`, main branch, **not a packaged or user-accepted executable**. Existing `app.js` stays intact, no file splitting or structural refactor. This paragraph supersedes the older "CURRENT SOURCE" v0.6.84 checkpoint immediately below.

## HISTORICAL MILESTONE · v0.6.84-dev · Private home stable, riding and livery hire (completed October 23, 2026)

**Verified GitHub Source QA:** run **40058726255** passed the entire `npm run test:source` suite at source commit **`5d3c76f9865fa1f7c0f1c7c842d7be8cc5c0e414`**, including `tests/home-stable.cjs`, `tests/livery-hire.cjs`, the existing horse custody, care and all Washington career tests. Later commits to these documents do not change tested source. **Source build only**, not a packaged Linux executable, rendered playthrough, accepted release or tag. Active branch remains **main**.

**[x] v0.6.84 private-home horse custody and rented liveries**. Owner **Charlie Whitcomb's own Capitol Hill home** has an addressable **Private Stable and Carriage House** (room `home/private-stable`, initially empty, industrialist access only). Federal Electric's `factory/rear-stable` is a **temporary shelter during the workday**, not a permanently assigned home for the horse. The previous v0.6.83 shortcut that always transported a newly bought horse from its livery to the **factory** was **incorrect and has been replaced**. At either brother-owned livery, or at the home/factory stable, the owner may select an actual physically present purchased or hired horse to **ride/lead on the next player trip**. Optional wagon/carriage requires horse and vehicle **together at the departure location**. Only after an actually charged and recorded player journey do saved horse and vehicle locations change together; on-site stable destinations mark them stabled, other destinations tethered. No automatic follow if Charlie walks, no magical return at 5 PM, no free horse, no invented world-clock advances. Example: **home horse → ride to factory → shelter at factory → ride home**; walking away leaves horse at the factory until retrieved. Journey times still use existing explicitly provisional one-hour travel until geographic timing is approved.

**[x] Livery services:** The two rival brothers on opposite sides of Washington now offer **purchase, outside boarding and paid hire**. Purchase still uses existing personal-cash prices and saves assets at the actual seller. Boarding of owned animals is physically determined and assessed through existing daily animal care; private home/factory shelter avoids commercial board. Hire of a horse, a horse-and-buggy or a horse-and-wagon pays a provisional **first calendar day** price ($1, $2.50, $2.20 respectively); subsequent days accrue personal debt to the *issuing* livery, paid on Saturdays when cash allows. Rented animals and vehicles have real locations, must be returned **together, in person, to the issuing service desk**, and are removed from player inventory only upon a successful ten-minute return action. No imaginary refund, instant return, unlimited one-day hire or company-fund deduction. These are **game-economy estimates**, not substantiated 1878 invoices.

**Still open:** travel-mileage surveying and genuinely shorter long/short animal journeys; interior art, harness animations, equine fatigue/illness and hoof care; parking/guard fees at non-livery public venues; NPC-owned horse movement and stable employees; player choice of horse names; paying household expenses separately from factory overhead. The player uses explicit horse custody choices; real-world city movement remains grounded in one protagonist-controlled world clock. **Do not conflate Capital & Consequence with the Federal Electric company name or reinstate old-save compatibility mandates.**


## HISTORICAL MILESTONE · v0.6.83-dev · verified October 23, 2026 (superseded by v0.6.84)

**GitHub Source QA verified successful:** full `npm run test:source`, run **40057661933**, source commit **`df99f238d7fce15d86a761e96e92bde56da2f3b6`**. Four incremental, tested Washington-first source slices advance v0.6.79 to **v0.6.83**. Source only: **NO Electron playthrough, executable package, accepted snapshot, tag or release**. The active repository stays **`dereksparks1982/capitalconsequence` on single branch `main`**. Older verification and "current" version statements below are historical, not instructions to roll back.

### Newly completed roadmap slices

- [x] **v0.6.80, Sullivan's real whereabouts**: A *read-only* minute-aware projection of the existing NPC calendar hides the workshop assistant before his actual arrival, while absent, at closing time and on closed days. City-room visitors, ordinary conversation and free-form conversations all consult the same physical presence. It does not spawn staff, expose private NPC schedules or advance time; the source QA includes `tests/workshop-presence.cjs`. Independent NPC minute-by-minute movements and full autonomous production remain future work.
- [x] **v0.6.81, paid horse care**: Personal ownership now accrues **$0.20/day horse feed**, **$0.25/day commercial livery boarding** for horses actually held there, and **$0.10/day commercial wagon/carriage storage**. No external boarding at Charlie's own factory stable. Actual Saturday settlements debit *personal*, **never company**, money, credit feed suppliers or specific brother-owned livery accounts, and persist arrears if cash runs short. No bills for nonexistent or missing/stolen horses. Provisional game-balance numbers, not verified 1878 invoices. Uses the authoritative daily closing bell without NPC clock jumps; `tests/horse-care.cjs` passes.
- [x] **v0.6.82, late railway invoice**: Capital Railway Telegraph pays only for physically shipped stock. Late shipped quantities receive a **10% customer payment discount**, debited once from the real receipt; on-time quantities retain the full agreed price. The component register shows deductions and undelivered railway orders block renewal. `tests/workshop-deadlines.cjs` passes. No fabricated customer prepaid money or automatic make-up shipment.
- [x] **v0.6.83, bring a horse home**: At the livery, an owner may mark **one personally purchased horse** to accompany the next trip to Federal Electric. The horse remains at its seller until the player **actually completes the existing paid/clock-charged provisional one-hour livery-to-factory journey**. Both factory map-entry and return-to-desk paths resolve custody after recorded travel, placing the horse in the private rear stable and changing future boarding costs. Invalid/unrecorded trips cannot move it; replay and reload cannot duplicate the transfer. `tests/horse-custody.cjs` passes. This does not grant a free horse, invent route mileage or implement a full horse-riding speed model.

**Next honest roadmap tasks:** make Sullivan's production assistance truly continuous but imperfect (9 AM late arrivals, breakdown triage, owner decisions and no perfect automation), complete physical wagon/carriage movement and practical freight replacement, build finite merchant stock and restocking rather than unbounded shopping goods, tie railway customer finances to actual accounts, implement owner household expenses independently of business profits, and complete a full multi-day Electron acceptance playthrough. Keep all other career paths and the alternate Washington world intact. **Do not prioritize backward compatibility with old 1890 saves; that constraint was never approved.** No national-map expansion or guessed historical prices.


## HISTORICAL MILESTONE · v0.6.79-dev · October 23, 2026 (superseded by v0.6.84)

**Verified source QA:** Complete GitHub Actions "Capital & Consequence Source QA" run **40043515075** succeeded on commit `a10c3df7d4e52ebae15c238e9ef5398ab81b4fa4`. All existing suites and new workshop incidents, local commerce and livery transaction tests passed. **Source-only. No new Linux executable, Electron playthrough, accepted release or tag.** The previous packaged v0.6.34 draft remains unaccepted.

**Three checked incremental Washington slices (v0.6.77–v0.6.79):**
- [x] **Shop attendance and breakdown intervention:** Saved per-campaign/date attendance variation for Sullivan, including occasional delays and absence; assembly requires staff presence and arrival time. Completed assembly may trigger a workshop machinery fault. Sullivan tries first; some faults stop future production until Charlie deliberately spends **45 game minutes and $0.30** to repair. Repairs and incidents are replay-safe and use the player-controlled world clock. The NPC calendar's broad 8 AM/noon location slot has not yet been fully reconciled with fine-grained lateness in every resident/contact presentation.
- [x] **Real weekly purchases and 25-cent factory room rent:** On Saturdays Sullivan pays **$0.25** to Federal Electric for his room on its property and purchases a bounded basket of bread (one loaf), milk (two quart bottles), groceries, fuel and soap using his actual personal money. **$2.79** is the regular estimated merchant-goods basket; together with rent **$3.04**, leaving **$2.96 from a full $6 wage** on an ordinary week. Purchases credit vendor tills and persist in the save. Clothes and boots are *occasional* expenses. Goods prices are provisional game estimates, not sourced 1878 price records. Full shopkeeper schedules, household inventories, stockouts and an economy-wide flow of market goods remain open.
- [x] **Two rival horse/carriage liveries and paid ownership:** Washington now has **28** mapped locations. New **Western Livery and Carriage Yard** (pin 27) and **Eastern Livery and Wagon Works** (pin 28) are provisional map positions on opposite sides of the city, operated by **two rival brothers whose names and feud cause are undecided**. The physical service desks sell horses, wagons and carriages for actual personal cash using different fixed quotes. Payments enter the chosen seller's till, purchases create saved physical assets **at that stable**, no teleportation or free horse. Charlie's factory now contains an empty **Rear Stable and Carriage Shed** and a restricted **Sullivan's Rented Room**, with owner/resident entry rights. Actual boarding, feed, horse-care expenses, equipping personal transport for business deliveries, movement of newly bought horses from the livery, and NPC stable operations remain open.

**Important fixed policies:** January 2, **1878** start; Federal Electric is a company within **Capital & Consequence**, not the project title. Monday–Friday 9 AM–5 PM manual manufacturing; Saturday delivery and company/assistant payroll; no overtime. One paid assistant, Sullivan, not a foreman/general manager on top of him. Time ticks 1:1 with explicit protagonist-initiated skips; **NPC actions never advance the clock**. Old 1890-save compatibility was an invented requirement and is **NOT required**. Use existing single `main` branch; owner validation is required before accepting any executable.

**Next scoped code priorities:** synchronize minute-granular Sullivan arrival with NPC visible room/contact records; support assistant troubleshooting and work-rest continuation without turning him into a self-running perfect factory; week-to-week vendor supply, property/horse care and use of purchased carts for physical shipment, fairer cash/reinvestment accounting and city newspaper consequences. Washington-first only; no national-map expansion and no made-up compatibility mandates. This block supersedes older handoff wording and version-specific claims below.



## v0.6.76 · Weekly 1878 telegraph works and household economy (source-only)

**Factory:** Charlie and Sullivan work **Monday-Friday 9 AM-5 PM**, with **Saturday 9 AM-5 PM for customer delivery and payroll**, Sunday closed. Production requires Sullivan physically at the works. Orders larger than the available shift time make only complete units that fit; the rest carries over. No automatic 9 AM restart, autonomous assistant fabrication or breakdown-repair intervention is claimed by this slice. The player retains the existing 1:1 ticking game clock and action-time jumps.

**First real standing contract:** Capital Railway Telegraph buys **2 telegraph keys at $4.20**, **2 relays at $7.60**, and **3 switch contacts at $2.40**. Total **$30.80** gross, **$5.40** replacement materials from the current component catalog, and **29 hours** proposed hands-on production across the 40-hour Mon-Fri workweek. The first full-week Saturday is **January 12, 1878** (the January 2 opening is Wednesday). Future weekly batches appear on a Monday only if the previous batch was fully delivered. All amounts and production times are provisional gameplay estimates, not proven period prices.

**Staff and bills:** Sullivan earns **$1.20 per day actually worked**, maximum **$6 per five-day week**, accrued weekdays and paid by company-cash transfer to his NPC account on Saturday. Unpaid employee wages persist as arrears. Saturday shop costs are **$0.55 lamp oil/tools** plus **$0.70 winter coal heat in November-March**, assessed only when the workshop worked; **$1.15 wagon transport only if stock was actually shipped that Saturday**. Unpaid costs remain visible as liability, not fabricated negative cash. Owned raw stock is consumed without paying for it twice; raw material purchases actually debit company cash.

**Representative successful winter week:** $30.80 customer payment minus $5.40 replacement materials, $6 Sullivan salary and $2.40 shop/transport = **$17 before Charlie's draw, personal living costs, unusual repairs, taxes or reinvestment**. Initial inventory is already owned, so material replacement is an economic cost but not an automatic duplicate cash debit in week one. No fixed invisible owner withdrawal has been added. Sullivan's 25-cent weekly factory-room rent, household grocery basket (milk, bread, bacon, eggs, stew meat, potatoes, onion, soap), and Charlie's separate groceries/housing remain planned NPC purchasing features, not implemented market transactions.

**Future city economy, proposal only:** Two competing brother-owned horse/carriage stables on **opposite sides of Washington**, cause of feud undecided. Some residents own private horse sheds; many do not own a horse. Charlie could eventually keep a horse and delivery wagon in a rear factory stable/carriage house, owing feed, shoeing and upkeep, but no commercial boarding. A modest 1878 shop uses hand/foot machinery, coal heat, and oil or municipal manufactured-gas lighting where service exists; no assumed electric utility or diesel power.

**Status:** Source-only candidate v0.6.76. No executable or release built; GitHub source QA must be checked independently. Old-save compatibility is not a requirement.


> **NEW THREADS START HERE:** [CONTINUE-HERE.md](CONTINUE-HERE.md) is the authoritative, GitHub-persisted continuation handoff: exact verified source commit and QA, approved clock rules, current 1878 workshop, open milestones, and next build order. Read it **before** older handoffs, this README or roadmap.

> **Archived context:** [October 23 v0.6.65 historical handoff](HANDOFF-2026-10-23-SOURCE-CONTINUATION.md) describes an earlier source snapshot. The current source candidate is **v0.6.84-dev**, and the current continuation instructions are in [CONTINUE-HERE.md](CONTINUE-HERE.md). Do not copy old clock assumptions from historical sections.

## Current policy: remove invented old-save preservation constraint

**NO old-save compatibility requirement.** The previous assistant invented it; the owner did not approve it. Old 1890 saves and legacy save formats do not need preservation, migration, or regression work. Remove obsolete compatibility paths when useful for the current 1878 campaign. Keep proper autosave and replay protection for **new/current profiles**. Earlier historical checklist statements to the contrary are superseded.

## ACTIVE DEVELOPMENT SCOPE · WASHINGTON FIRST (decision of October 23, 2026)

**Capital & Consequence is a Washington, D.C. life simulation.** Until the owner explicitly expands the scope, prioritize **only the playable city, its residents, institutions, rooms, four career paths, local history, and the interactions between them**. The rest of the restructured United States is **background canon and a deferred roadmap**, not a second playable map to build now.

**Alternate-world design rule:** The city must remain *recognizably* nineteenth-century Washington, but it is **not a documentary reconstruction of the real United States**. Familiar buildings, social institutions, technology, contemporary personalities and historical reference points can coexist with deliberately changed politics, geography, districts, events, and outcomes. The inspiration is an alternate-reality variation: **similar, but not the same**. Keep changes internally consistent with the game's post-Civil-War United States of purpose-defined districts; avoid importing real state-based laws/elections automatically. The comparison to *Rick and Morty* describes the alternate-universe feeling, **not a crossover**.

### Now · highest-priority D.C. playable slices

**v0.6.75 SOURCE UPDATE:** Workbench orders, material purchases, assembly and shipments finishing exactly at 5 PM now commit their receipts, materials, cash and UI transaction sequence **before** the payroll/market/day-report closing process. The player clock's ordinary 1:1 ticks and other actions still trigger 5 PM; actions that exceed the workday are refused. The new `tests/workshop-closing.cjs` exercises the actual `app.js` time gateway and is mandatory source QA. Six targeted V8 tests passed; full GitHub Actions source QA and desktop UI are not independently verified. This is a narrow settlement boundary fix, **not** the entire 24-hour economic/report migration.\n\n**v0.6.74 SOURCE UPDATE:** Charlie Whitcomb is owner/operator, supported by exactly **one paid workshop assistant, Sullivan**, using the existing named NPC schedule and personal economy. New profiles begin with one worker. Provisional $1.00 wage is funded once from company money for a worked day at 5 PM, with arrears tracked instead of overdraft. Manual assembly no longer charges an additional fictional labor wage. Focused V8 behavior checks passed; full new GitHub Actions CI and desktop playthrough have NOT been independently confirmed. Full continuous economics and hourly autonomous employee work are still unfinished.



**v0.6.73 SOURCE UPDATE:** The 1878 Exchange gains eight fictional, founding-era railway/telegraph/financial/industrial listings with year-gated published quotations, index, sectors and portfolios. Existing 1890-origin markets are kept separate; unlisted securities do not gain pre-listing prices. Targeted JavaScript checks passed; GitHub Actions CI and desktop gameplay have **not** yet been independently confirmed. Company payroll, 1878 staff, newspapers and 24-hour economic settlement remain separate open work. The broader 1878 economy is **not complete**.

**v0.6.72 SOURCE UPDATE:** The new January 1878 campaign now contains the first actually playable component works, not a renamed 1890 bulb factory. Materials, electrical/telegraph orders, assembly time, receipts and shipments are integrated with the owner's cash and the single world clock. The **1878 workshop submilestone below is checked**, while the broader period/economy integration remains open and must be independently verified.

**v0.6.71 SOURCE UPDATE:** Correct 1:1 clock while playing; action and journey time jumps reuse the authoritative world calendar; NPC scheduling is processed at crossed boundary slots; the timer never expires after 60 real minutes. Business/nights are reached at real 5 PM/8 AM clock hours. **Next:** full 1878 components-first campaign, genuinely independent NPC poker/racing and full-day economic settlements, dynamic weather, strong LLM conversations and actual eclipse-driven investigations. The complete owner's instructions are in [the design record](DESIGN-2026-10-23-LIVING-WASHINGTON.md).

**Source advancement v0.6.70 (historical, REJECTED clock assumption):** The two 60-real-minute gameplay segments now drive the single 24h Washington calendar at 9x business / 15x night passive rate, with exact game-second charges for player actions and production. Phase budget expenditure preserves fractional sub-second costs through save/reload; contracts and activities check true available simulated time. Midnight, day/night and Eclipse displays follow the same clock, though legacy four-turn-per-month accounting and report transitions remain in place.

**Source advancement v0.6.69:** The visible Washington 12-hour clock/date, NPC period scheduler, weather and astronomy now all consult the same saved `worldCalendar`. Timed actions and ticks route through a shared gateway and the legacy day/night/report handoffs move that saved clock to real evening/next-morning moments without backwards jumps. NPC risk judgments and conversational sky descriptions use only present conditions. **Not finished:** replacing old 60-minute phase budgets, payroll and stock exchange settlement with continuous hour-based authority and real 1878 component-factory gameplay. These are immediate follow-ups, not claims of completion.

**Source advancement v0.6.68:** Existing daily Washington weather is visible in the gameplay top bar. A licensed, bundled astronomy engine supplies historical sun/moon phases, daylight, sunrise/sunset, and local eclipse detection using the saved in-game minute. The July 29, 1878 Washington solar eclipse is a tested fixture. Eclipse-motivated NPC crime and detective pattern recognition remain **future emergent gameplay**, not fabricated existing murders. Next: actual self-directed actions, events, and observer-accessible evidence.

**Source advancement v0.6.67:** In-person named residents can now accept free-text speech through a sandboxed, loopback-only local OpenAI-compatible LLM server. Each actor receives its own bounded profile conversation transcript, date-gated alternate-history briefing, public personality, current observed weather and room, and genuine shared-language checks. NPC responses alone perform NO irreversible world actions. The actual local model/server is not bundled or performance-validated. Next: properly licensed model recommendations/weights, curated year-by-year Washington historical knowledge retrieval, translation earnability, truthful NPC conversational claims, and validated conversation-to-action tools that affect the same shared world.

**Source advancement v0.6.66:** Existing developer controls float above every live game screen and room (collapsible and draggable). Unlock All Rooms lets the selected player inspect all registered Washington locations and rooms regardless of normal duties, invitations, opening date or door permissions without giving NPCs unrestricted access. Developer sessions never create non-existent scenes or permanent access entitlements.

**Source advancement v0.6.65:** Gossip now depends on precise co-room presence, shared language, relationship strength and source confidence. Classified private records are barred from casual hearsay; private events retain room and language provenance. Future full NPC evidence and investigation systems should build on these guarded facts without treating rumor as confirmed truth.

**Source advancement v0.6.64:** Actual co-room social meetings can now leave first-hand observations in the active character's private journal, without hidden motives or off-site hearsay. Seen meetings are idempotent and bounded, and no newspaper claim is created. Next: deeper evidence provenance, witness disagreement and earned follow-up contact actions.

**Source advancement v0.6.63:** Edmund Wardman now has an actual playable District Asylum work loop: assignment at the orderly desk, service inside the patient ward, filed report and one bounded earned wage. Shift logs, pending tasks and funds persist per profile; medical confidentiality and restricted superintendent access remain intact. Next: institutional roster and brother's managerial decisions grounded in local cause and effect.

**Source advancement v0.6.62:** Independent component-works module now supports owner-specific 1878 component recipes, inventory purchase, transaction-proof assembly, contracted customer orders, physical warehouse shipments and technology prerequisites, with dedicated save/reload tests. **Not yet connected to playable new 1878 saves or authoritative calendar.** The existing 1890 profiles remain unchanged. See `COMPONENT-WORKS-1878-FOUNDATION.md`.

**Source advancement v0.6.61:** Russian-only NPCs no longer exchange rumors or conversational relationship gains with English-only residents without a shared spoken language. Pavel Orlov has explicit English/Russian fluency as a provisional trade intermediary. Interpreters, player language study, earned translated testimony and period-correct dialogue still require future gameplay.

**Source advancement v0.6.60:** NPCs now make one bounded social encounter per reached period with co-located residents in the same room, create reciprocal private relationship changes, and persist ordinary contact memories. No meetings occur merely from opening a panel. Continue with consequences linked to careers, witnesses and transactions. The earlier intentional travel improvement remains documented below.

**Source advancement v0.6.59:** Intent-driven personal travel is now implemented and source-testable. An NPC's chosen goal may direct optional personal time toward an accessible registered workplace/contact, but never bypass a restricted room, wager result or mandatory shift. Still pending: independent social transactions, actual journey traversal, household links, proper 24-hour clock authority and genuine witnessed city events.

- [x] **1878 founding-era exchange listings (v0.6.73; targeted source checks).** Eight invented, era-consistent securities are visible and tradable via the existing broker, with no future-company pre-listing quotation history and no change to 1890-origin portfolios. Broader historical economics, payroll, reporting and full CI/desktop verification remain open.
- [x] **1878 closing-bell transaction ordering (v0.6.75, targeted executable source checks).** Component work finishing at 5 PM commits cash/inventory/receipt and transaction token before the same clock settles Sullivan wages and closes the daily report; overtime and duplicates are rejected. Full accounting/report migration and desktop testing remain open.
- [x] **1878 two-person workshop and funded wages (v0.6.74, targeted source checks).** Charlie works as owner; Sullivan is the only starting employee, an independent named NPC with 8 AM–5 PM weekday routine, recorded work actions, personal off-duty life and wages actually deducted from Federal Electric. No double-charged per-assembly salary; unpaid wages are tracked. Full real-time payroll and staffing/hiring development remains open.
- [x] **1878 Component Works: playable owner manufacturing (v0.6.72).** Start a new January 2, 1878 profile; buy actual materials, accept real customer component orders, assemble at workbench/winder with the shared world-clock time cost and ship warehouse stock for recorded company cash. Bulb-era starter contract/controls no longer appear in that profile.
- [ ] **1878 market and historical-economy follow-through.** Correct legacy stock-listing, newspaper, employee/payroll, production and market assumptions before declaring a fully historical 1878 economy. Later licensing, 1893 fair and streetlights also remain separate work.
- [ ] **1878 real starting experience:** Convert *new* profiles from the old 1890 bulb-first factory to **January 2, 1878** with correct component-making machinery, recipes, suppliers, inventory, and contracts. Charles “Charlie” Whitcomb **owns Federal Electric** immediately. Historical electrical lighting R&D and eventual bulb lines must follow technology progression. Do not change the calendar alone; implement the actual 1878 products and systems. Old-save migration and preservation are not requirements.
- [ ] **Washington rooms and local map:** Strengthen the 26 recorded places into an accessible, legible city with real room navigation, player/NPC access parity, fixed or clearly provisional pins, category filters, discovery, and appropriate period openings. A pin is merely the location's map representation; its rooms are the simulation.
- [ ] **Resident lives:** Improve locally consistent daily schedules, clock granularity, travel, jobs, pay, needs, savings, relationships, choices, private knowledge and observable consequences. NPCs should use the same doors, rules and workplaces as protagonists. Alexi Rurik remains a Russian-only, independently acting NPC, not a playable fifth career.
- [ ] **Four separate desks and grounded entry jobs:** Charlie owns his modest component factory; Samuel “Sam” Harlan walks a beat and writes citations/incident reports, earning later advancement or pursuing personal inquiries off duty; Elias “Eli” Crowe is an obscure nightclub doorman paid by the shift; Edmund Wardman is the black-sheep orderly at District Asylum under his unnamed brother. All four may remain ordinary or advance; none is forced into an empire. Do not present a detective casebook as rookie beat duty.
- [ ] **City as cause-and-effect engine:** Newspapers reflect verifiable local events, not arbitrary player-centered stories; crime, policing, institutional affairs, gambling, marriages, commerce, illness, employment and relationships affect residents over time. Start with small believable interactions in existing rooms rather than multiplying unfinished destinations.
- [ ] **Longer local arcs:** Period-appropriate Washington electricity milestones, an alternate-history 1893 Washington World's Fair, a conditional Federal Electric bulb-supply contract, and a **later separate streetlighting bid**. Politics begins with city-based contacts/influence and may eventually lead to national office; build a nationally consistent election framework only when necessary.

### Later · national worldbuilding backlog (deferred, not cancelled)

- [ ] Decide the actual names, number, centers and **new geographic borders** of the postwar purpose-based districts. Never treat old state lines as their borders by default.
- [ ] Create the national district map, transport links, trade networks, supply chains, migration, and cross-district simulation **only after Washington's systems support them**.
- [ ] Determine district governance, constitution, taxation, courts, representation and federal election procedures compatible with a nation without states; then connect the businessman-to-president political arc.
- [ ] Expand beyond D.C. only on a later explicit scope decision. Until then, external districts can appear as **background newspaper mentions, trade origins, visiting NPC backstories, or political references** without being visitable simulated worlds.

**Implementation discipline:** Design decisions go immediately into this roadmap and `DECISIONS.md`. Previous work remains preserved below as chronological history, including older national-feature proposals; **this section supersedes their priority**. No national code expansion is authorized by this scoped planning instruction. Current-game reliability, single-branch Git workflow and tested incremental builds remain in force. Old-save compatibility is not required.

## Future Washington case arc: Chinatown smuggling and police corruption · proposed 2026-10-23

**Setting:** A specific Washington trafficking/smuggling network moves contraband, including drugs suitable to the period, through contacts and businesses in Chinatown. **Some Metropolitan Police officers secretly take payments to protect the network**. The criminal ring and its protectors are individually identifiable actors with records, money, schedules and relationships; they are **not representative of Chinatown as a community**. Chinatown continues as an ordinary, living neighborhood, with families, merchants, social life and residents who may have no involvement, oppose the ring, or be harmed by it.

**Player discovery:** Samuel “Sam” Harlan begins as a rookie **assigned on duty to Hillsdale only**. He cannot investigate Chinatown as an official Hillsdale patrol assignment. **Off duty**, as a civilian, he can visit Chinatown like other accessible city locations, talk to residents and observe suspicious circumstances. Any later *official* police work in Chinatown needs an **actually earned assignment, transfer or promotion**, not an automatic exception to the existing shift travel lock. Sam may misunderstand signs, encounter misinformation or fail to discover a lead.

**Uncertain captain:** The police captain's truth is deliberately **not predetermined as always corrupt**. At campaign generation, choose a reproducible hidden variant and persist it to that profile: captain involved; captain knows and ignores it; captain genuinely unaware; or captain investigating corrupt officers. These are *working possible variants*, not a claim every campaign needs identical probabilities. A particular campaign has one coherent underlying reality, not a fact that changes based on player guesses. The captain's reputation, behavior, associates and evidence must agree with that truth.

**NPC cause-and-effect:** Corrupt officers receive plausible hidden payments from concrete sources; protected drug deliveries have routes and risks; missing/altered police records should be traceable to actual authorized actors and times. Witnesses only know what they encountered, rumors can be wrong, personal testimony may be self-serving, and the player should never see the secret conspiracy truth through unearned omniscient UI. The player can follow money, discrepancies, unusual meeting patterns and contradictory witness statements. Avoid guaranteed revelations or turning every officer into a criminal.

**Possible consequences (not implemented):** Sam may protect himself, quietly investigate, report evidence, challenge a corrupt superior, choose not to intervene, or become compromised himself. Suspicion is not proof; accusations should have realistic institutional risks. Captains, corrupt officers and criminals remain active regardless of whether Sam ever encounters the story. This could later intersect with Eli Crowe's **optional** underworld route without forcing Eli to participate.

**Current status:** **Roadmap/canon groundwork only.** No smuggling simulation, police corruption system, named captain, randomized captain truth, evidence-chain code, Chinatown patrol authorization or new role privileges have been built. Future slices must be source-tested, save-stable and respect the Hillsdale-on-duty versus citywide-off-duty travel rules. 

## v0.6.58-dev · Hillsdale patrol jurisdiction, civilian freedom · October 23, 2026

- [x] Display **Hillsdale** as the neighborhood and its street; keep the existing `hillsdale` place identifier for autosave/map compatibility. Mention Barry Farm only as a historical alternative name.
- [x] Limit **Samuel “Sam” Harlan's official police foot patrol to Hillsdale**. The only places accessible for *on-duty travel* are his Hillsdale neighborhood beat and the Metropolitan Police station where he writes reports.
- [x] Provide **clock-in and clock-out controls at the police duty-room desk**. While on duty, both map navigation and direct city-room travel prevent visits outside the police station and Hillsdale. Police encounters cannot be started in Chinatown.
- [x] Once **off duty**, Sam is free to visit Chinatown and other normally accessible Washington locations **as a civilian**, without special policing privileges. No global location ban on Chinatown or other profiles/NPCs.
- [x] Preserve patrol autosaves. Missing duty flags default to off duty. A formerly assigned, unresolved Chinatown patrol incident can be transferred to a sergeant from the station, retaining its history without inventing a solved case or deleting it.
- [x] Update Sam's character codex, canonical route description, README and regression tests for on-duty/off-duty restrictions and saved incidents.
- [ ] Design future promotions, new assignments and any possible change of jurisdiction **only after explicit later approval**. Hillsdale is Sam's sole current police beat.
- [ ] Complete richer Hillsdale neighborhood events, residents, policing, and an earned career path while respecting unrestricted *civilian* movement.

## v0.6.57-dev · The Unknown Doorman · October 23, 2026

- [x] Give Eli Crowe his actual **restricted Doorman’s Station** at the existing second nightclub. The club’s permanent public name and proprietor identity remain **undecided**. A generic club room and closed proprietor office remain separate.
- [x] Create a playable night-only employee loop: spend **10 in-game minutes** minding the door, handle one of five everyday visitor situations in **5 more minutes**, and earn **$0.30 provisional wage per completed segment**, capped at four segments per game night.
- [x] Save actual cash, activity, pending visitors and ledger records to the criminal protagonist’s own autosave. Reject multiple wages for the same segment, incorrect location, another career and day-only activity.
- [x] Provide Eli’s personal desk **work ledger** and a live room UI at the nightclub door. Add **Enter Current Location** to each of the four desks, so a new character can enter an assigned workplace directly.
- [x] Regression-test wage payments, night windows, caps, duplicate pay denial, staff-only room access, and source/runtime wiring. Preserve existing police, industrialist, Wardman and NPC systems.
- [ ] Replace provisional shift wages with researched, period-appropriate pay rules integrated into the same labor/economy simulator used by all four careers and NPCs.
- [ ] Build owner/floor-manager relationships, genuinely autonomous club customers, the nightclub's permanent design/name, job discipline and advancement, and optional underworld contacts that arise from actual interactions rather than predetermined crime.
- [ ] Complete the **1878 component-first Federal Electric factory** and authoritative continuous Washington world clock next, before broadening the rest of the city.

**Historical supersession notice:** The v0.6.56 two-beat patrol is no longer Sam's assignment. **v0.6.58 Hillsdale-only on-duty patrol and citywide off-duty civilian access control current gameplay.**

## v0.6.56-dev · The Patrolman’s Beat · October 23, 2026

- [x] Introduce a Metropolitan Police **restricted patrolmen's duty room** and **sergeant's office**, separate from the existing public station entrance. Sam begins at his authorized desk; ordinary visitors and rookies cannot access the sergeant's private office.
- [x] Walk actual registered **Barry Farm** and **Chinatown** neighborhood-street rooms as Sam; charge 10 game minutes per patrol circuit.
- [x] Offer small ordinary encounters with choices: wagon crossing obstruction, shop dispute, found property, street noise and directions. Charge 5 game minutes for a response. Issue a summons only where applicable, never random fines as personal income.
- [x] Return to Sam’s station duty room to complete 5-minute written reports; allow paperwork after the business day. Carry pending incidents and saved reports through time passage, room travel, autosave and reload. Bound archival history while retaining totals.
- [x] Leave rookie detective casebook disabled and company operations owned by Charlie. Preserve alternate Washington and all four lives.
- [x] Add source and repeat-action regression tests; document exact limits.
- [ ] Expand to timed shift assignments, beats covering more neighborhoods, proper roster/payroll, lost-property chain of custody and citation ordinances suitable to the alternate 1878 city.
- [ ] Attach witnesses and street incidents to actual NPC locations/behaviors; implement referrals, supervisory review, measurable fairness and historical discriminatory treatment where applicable.
- [ ] Support off-duty investigations, earned detective training, rank progression and real case assignment after Sam proves himself.
- [ ] Continue **1878 electrical component manufacturing** as the priority next major Washington-only factory slice.

## v0.6.51-dev · Washington public contact intelligence (source-only) · October 23, 2026

- [x] Model provisional public next-appearance windows for seven named residents from the *persisted* absolute calendar, including weekend factory/police absence and true overnight periods.
- [x] Add visible, responsive itinerary cards under Journal → Contacts, **only after the active character's first physical greeting**. Private NPC goals, rumors and unpublished knowledge never populate this UI.
- [x] Add a distinctive third face-to-face topic per NPC: *Ask About Washington*. Once-per-date records, capped contact influence and autosaved journal entries; no omniscient testimony.
- [x] Refresh visitor panel without duplicating resident rows, refresh learned contacts on NPC schedule changes.
- [x] Test overnight/midnight, weekend, save/reload, legacy-unmapped, un-met secrecy and once-a-day dialogue. Preserve all previous market, factory and profile logic.
- [ ] Convert provisional routine windows into player-negotiated meetings only after one reliable authoritative calendar. Show that an NPC **may** be there; no guaranteed future appointment today.
- [ ] Expand NPC agency into typed motivations, cases, rivalry and consequences under explicit, testable mechanics; continue to distinguish locally observed information from rumors.


## v0.6.52-dev · Autonomous situational NPC decision layer (source-only) · October 23, 2026

- [x] Replace random/hashed named-NPC goal choice in mapped and legacy routine paths with a deterministic occupation-specific utility planner.
- [x] Introduce seven individually tailored goal weights grounded in ambition, caution, sociability, exhaustion, known current work pressure, public headlines and each agent's own private observations, never another NPC's hidden thoughts.
- [x] Persist each actor's most recent motive score, situation snapshot and plain-language reason as **private save data**; public contact cards and newspapers do not reveal confidential future intentions.
- [x] Preserve existing room destinations, movement rules, face-to-face talks, calendar periods, autosaves and phase fallback. Add a warmer acquaintance greeting after repeated earned conversations.
- [x] Test role-dependent priority switches, witnessed staff risk, club raid concerns, public police news, own knowledge isolation, fatigue/rest, deterministic replay and previous NPC behavior.
- [ ] Add richer autonomous plan execution and consequences: directed travel, open-ended choices constrained by world rules, local interactions with witnesses, and newspaper publication only after observed/documented events. Current goals shape private intention, not independent property purchases or running crime cases.
- [ ] Deliver full clock authority for factory/market/venue and negotiated appointments; allow resident decisions to evolve within a trustworthy continuous city calendar.


## v0.6.53-dev · Procedural Poirot-style detective cases (source only) · October 23, 2026

- [x] Add an offline truth-first mystery engine, four distinct suspects, hidden case truth, independently sourced means/motive/opportunity records, alibis and uncorroborated rumor.
- [x] Validate each generated case has exactly one supported culprit with a complete three-thread evidence intersection.
- [x] Integrate playable investigation, individual suspect interviews and accusation buttons into the Patrolman career desk. All interactions consume real game-clock time, never ambient wall-clock time.
- [x] Persist generated cases, discoveries, interviews, accusations, failure state and case archives inside individual character profiles, including reload and replay safety.
- [x] Add Legal section and third-party research notices in GitHub repository and README.
- [ ] Transition from police casebook generation into genuine autonomous murders: NPC choices cause irreversible witnessed city events; victims are removed from the active simulation consistently.
- [ ] Spawn case records from actual world events for all character routes, rather than independent casebook templates. Add real geography, witnesses, evidence access permissions and police procedures.
- [ ] Build historical investigation tools, witness memory accuracy, motive inference, relationship histories, evidence challenges and time-sensitive consequences.

## Approved campaign direction · January 2, 1878 opening and the electric-lighting revolution (planning only, October 23, 2026)

**Design target:** A new Federal Electric campaign opens on **January 2, 1878**, before commercially practical incandescent bulbs. This is a decision about future gameplay, not a change to the currently implemented **January 1890** start. Audit every historical location, machine, vehicle, electrical process, newspaper, political event, and contract for date accuracy. Obsolete autosaves are not a compatibility target; no old-save migration or its tests are required.

### 1878–1879 · A component factory, not a light-bulb factory

- [ ] Start as a modest **manufacturer of electrical components and apparatus**, with early production recipes grounded in the period: telegraph keys, relays, contacts, switches, insulators, wiring and fittings, and battery hardware. Verify every historically specific item before enabling it.
- [ ] Build component-focused factory stations and tooling, raw material needs, stock bins, quality grades, labor, maintenance, orders, suppliers and delivery deadlines. The player's first actual sales contracts should be for components, not finished light bulbs.
- [ ] Add early customers: telegraph offices, railway and communications companies, laboratories, inventors, electrical installers and government purchasing departments.
- [ ] Keep early bulbs an **experimental research opportunity**, not a routine sellable product, until manufacturing capability, technical knowledge, appropriate tooling, materials, and patent/licensing constraints allow it.
- [ ] Give the industrialist choices: keep a steady component business, expand to electrical systems, invest in risky research, license inventions, or prepare for lamp production. Research costs money and time; component orders should still sustain the business.

### 1879–1880s · Practical incandescent lighting arrives

- [ ] Advance historical technology and markets on the authoritative saved world date. Incandescent lamps become manufacturable only after the relevant technical milestones and player's investment, not on day one.
- [ ] Add evolving bulb methods, machine tools, glass and filament supply, defects, burn-life tests, output capacity, royalties or patents as appropriate, component-to-lamp production line upgrades, and commercial bulb buyers.
- [ ] Retain multiple realistic product families: telegraph/electrical components, lighting apparatus, wiring/switchgear and eventually incandescent lamps. The user chooses where capacity is committed.
- [ ] Represent early **electric arc streetlights** separately from ordinary incandescent bulbs. Washington began electric streetlighting before the 1893 fair; the fair must not be presented as the first electric light in the District.
- [ ] Make 1878–1892 gameplay substantial and replayable: customers can be gained or lost, rival inventors and manufacturers compete, electrical demand grows, capital is raised, and reputation, manufacturing record and political contacts persist.

### 1893 · Alternate-history Washington World's Fair

- [ ] Preserve the **1893 World's Fair in Washington, D.C.** as **intentional alternate history**; the real World's Columbian Exposition took place in Chicago.
- [ ] Add an achievable landmark contract to **manufacture and deliver incandescent bulbs for the fairgrounds**. The player must qualify and win based on capacity, price, quality, financing, reliability and relationships. Avoid a guaranteed award that negates business decisions.
- [ ] When the bulb supply contract is awarded, publish a prominent historically styled **Metropolitan Ledger front page** celebrating the fair's electrification and mentioning Federal Electric as its bulb supplier. Do **not** issue this contract story on January 2, 1878, before the company can manufacture bulbs.
- [ ] Model phased deliveries, worker schedules, supplier failures, production bottlenecks, lamp defects, fair opening deadlines, rivals, demonstrations and reputational gains or losses. Finishing a manufacturing lot does not automatically complete a delivery.
- [ ] During the fair, visitors, workers, dignitaries, business rivals, reporters and independently scheduled residents can attend the actual fair **rooms**, and interact within normal access limits. Lighting changes the physical scene and newspaper coverage when the player's deliveries genuinely succeed.

### 1894 onward · Compete for Washington streetlighting modernization

- [ ] **After** the fair arc, announce a separate District modernization tender. Federal Electric can compete to supply lighting hardware, lamps and/or fixtures, subject to the specific procurement requirements and available technology. This must be distinct from the already existing 1880s arc-light installations.
- [ ] No guaranteed streetlighting contract: bidding, engineering suitability, funding, competitor bids, public opinion, mayoral/District patronage, political contacts, and fair performance affect the outcome.
- [ ] Awarded contracts create production and delivery obligations, operating consequences, newspaper reporting and a believable link to later business-to-politics opportunities. Failing the fair does not necessarily end the whole campaign.

### Russian-speaking NPC and language realism

- [ ] Include **at least one persistent NPC who speaks Russian only**, with no magically available English conversation. Do not quietly make all Russian NPCs bilingual.
- [ ] Store language fluency per NPC. The player may use an interpreter, learn enough Russian, or pursue communication through appropriate intermediaries; only understood messages enter the detective notebook or business contacts as understood facts.
- [ ] Allow Russian-only speech to matter for negotiations, witnesses, clues, social relationships and independent NPC routines. Keep text legible and appropriately translated only through an earned or supplied translation.
- [ ] Retain the Russian Trade Hall and Russian visitors/merchants, with **Imperial Russian** context in the 1870s and later historical transitions only when the game calendar reaches them.

### Russian-only character · Niko Bellic-inspired dramatic design

- [ ] Create an original, **Russian-speaking-only** resident with a guarded personality, dry humor, personal loyalties, practical skills and a complicated past, loosely inspired by the **narrative depth** of Niko Bellic rather than copying him. Niko is Serbian, not Russian; our NPC is Russian and should have an authentically 1870s Imperial Russian backstory, not Niko's modern Balkan-war history.
- [ ] Let circumstances decide whether he works as a laborer, guard or tradesman, assists others, gives a difficult witness account, becomes an ally, or gravitates toward criminal associates. Avoid forcing a criminal ending.
- [ ] Model trust, interpreters, untranslated testimony and language barriers honestly; the player cannot automatically understand a Russian-language witness statement.

### Sequencing, QA and safeguards

- [ ] Plan first, then implement in approved source slices: campaign-start migration; component inventory/recipes; historical research and technology gates; component customers/orders; lamp R&D and factory conversion; fair contract; newspaper/fair experience; later streetlighting bid; language fluency.
- [ ] Test 1878 new-profile starting inventory and products, pre-invention bulb lockouts, license/technology decisions, fair eligibility and branch outcomes, delivery timing, historical arc/incandescent distinction, save/reload, and post-fair bid requirements.
- [ ] Keep NPC jobs and travel grounded in actual registered rooms; map markers are only visual navigation. Apply venue and room-specific authorization equally to player and NPCs except for justified job/household permissions, with time-dependent availability.
- [ ] No code, playable starting-year changes, builds, binaries, or asset replacements are authorized by this **documentation-only planning update**.

## v0.6.54-dev · Capital & Consequence foundation · October 23, 2026

- [x] Rename visible title/menu, desktop package metadata, Linux launch/archive labels and development docs to **Capital & Consequence**. Federal Electric remains the businessman's company, not the whole game. Legacy save namespaces can be cleaned up; no compatibility obligation applies.
- [x] Preserve **four** canonical protagonists in code: **Charles “Charlie” Whitcomb** (businessman/factory owner), **Samuel “Sam” Harlan** (rookie Black patrolman), **Elias “Eli” Crowe** (anonymous nightclub doorman), **Edmund Wardman** (District Asylum orderly). Show established names on career selection without changing persistent route IDs.
- [x] Keep the rookie cop on beat duty and desk reports rather than presenting detective work at starting rank. Existing standalone mystery engine remains as unassigned groundwork for future promotion/career progression.
- [x] Name the **District Asylum** (historically fictional, separate from the Government Hospital for the Insane) in the city registry, with public reception, orderly station, patient ward, administration and superintendent office. Edmund begins as an orderly; his unnamed brother directs the institution.
- [x] Register **26 numbered pins**, with 14 previously positioned and 12 **provisional**. Add map category labels for institutions, gaming and underground locations. Do not treat a pin as a separate entity from its room registry.
- [x] Add staff/permission-checked room entry shared by player and NPCs; restricted factory offices and hospital areas are not available to ordinary visitors. Build a deterministic NPC visit planner across visitable city rooms.
- [x] Add per-profile NPC income, shift attendance, small expenses, gambling and loan ledger, settled once per observed clock period. No away-from-game progression; no unpublished omniscient NPC data. Add **Alexi Rurik** to autonomous cast, Russian-only.
- [x] Create source tests for room access, NPC economics and named protagonist/locale contracts, and trigger source QA on main.
- [ ] Finish verified beginning in **1878**, with component manufacturing, authentic 1878 customers, tooling and orders before incandescent lamps; do not swap the date while bulb-first production is still hardcoded.
- [x] CANCELLED: historically surveyed map replacement / redesign. The existing alternate-history city map remains fixed through all playable years; its 34 pins retain player-editable display names and location filters.
- [ ] Implement real patrol citations, repeatable shift assignments, paperwork, wages, promotion, independent inquiries; doorman duty, shifts and personal desk; Edmund's institutional duties and family drama; industrialist production overhaul.
- [ ] Integrate NPC money and movement with journey duration, local work, encounters and the shared minute-accurate world clock. Currently period-based deterministic groundwork; not a simulated round-the-clock society.
- [ ] Add the alternate-history **1893 Washington World's Fair** competitive bulb-supply contract and later separate D.C. streetlighting opportunity, with branching business outcomes.
- [ ] Verify manual packaged executable under real desktop interactions after source test acceptance. Packaging remains manual, not triggered by every source push.

## v0.6.55-dev · United States of Districts · October 23, 2026

- [x] Verify the **live** title screen, not the retired title scaffold, says **CAPITAL & CONSEQUENCE** and **One city. Countless lives. Every choice has consequences.**
- [x] Add the national post-Civil-War alternate history. The real U.S. Civil War ended **1865**; a *fictional postwar reorganization* then dissolved states and erased their old boundaries in favor of purpose-based federal districts.
- [x] Provide a title-screen **District Register** and testable national charter. The capital is Washington, District of Columbia; **Agriculture & Husbandry District** represents the national breadbasket; foundry, mining, timber, maritime, transport and commercial divisions are working concepts.
- [x] Clearly mark the reorganization date, noncapital names, district capitals, new borders and national government architecture as **undecided**, not fabricated historical geography.
- [x] Preserve existing 26 local Washington pins, career saves and factory systems without pretending that a whole U.S. national map or electoral system has been built.
- [ ] Design geographically coherent **new** district boundaries that **do not trace the abolished states**, with appropriate agricultural regions, industrial areas, harbors, mines, rail routes and capital access.
- [ ] Define the alternate government's legislature, district representation, courts, revenues, constitutional powers and the businessman's presidential candidacy and election requirements.
- [ ] Connect district economic specializations to future Federal Electric supply chains, national trade, NPC migration, politics, transportation and newspaper stories.
- [ ] Complete the remaining 1878 factory/economy integration; obsolete save migrations are not a prerequisite.
