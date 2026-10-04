# Federal Electric — Design Decisions

This file records decisions that should not drift silently during development.

## 2026-10-01

- Title: **Federal Electric**. Repository: `dereksparks1982/federalelectric`.
- Work on **main** only unless Derek explicitly authorizes another branch.
- Setting begins in **1938** with Washington, D.C. as the principal headquarters/political setting.
- Federal Electric remains the center of the game.
- UI is a 1930s/1940s corporate spreadsheet/paperwork desk.
- Permanent color direction: **deep navy, aged/ivory white, and restrained patriotic red**, replacing the earlier green.
- Company and personal money remain separate.
- **One real hour equals one active in-game business day.**
- Time advances only while the player is actively in the app. Hidden/closed app time does not count.
- No offline progression. The company, market, events, and timer resume from their saved state.
- The current prototype automatically closes the business day when the hour expires; the planned two-phase day/night system will replace immediate rollover with a separate night phase and later Daily Report.
- Newspaper reading, market activity, gambling, Washington activity, and factory management all compete for the player's limited day.
- Newspaper reading and stock trading are optional. Federal Electric operations remain economically important.
- Federal Exchange prices move continuously behind the scenes during the active day, but the player sees the published opening quotation until the closing bell. The hidden close is then revealed and becomes the next day's opening basis.
- Federal Electric begins privately held. Going public is optional and the player may remain private forever.
- If public, personal scandal can affect Federal Electric's price, shareholders, directors, credit, government relationships, and corporate control.
- Founder ownership, public float, major shareholders, board composition, and voting control are planned systems.
- Losing controlling influence can make removal by the board/shareholders possible; permanent ouster can become a loss condition.
- The game uses its own evolving newspaper rather than depending on verbatim historical newspaper copy.
- Real historical facts/dates are researched; original in-game reporting combines history with simulation events.
- Newspaper editions form a permanent save-specific archive.
- Information has sources. Sources may be truthful, mistaken, incomplete, or deliberately deceptive.
- The Personal Notebook is now the **Journal**: it records meaningful meetings, conversations, rumors, poker sessions, and other player-known events in an Ultima-style running history. It records what the player experienced or was told, not guaranteed objective truth.
- **Contacts** uses a period-appropriate executive card-index concept inside the Journal section. A person is added only after the player legitimately meets them or obtains their contact information.
- Contacts can later support calls, letters, secretaries, requested meetings, invitations, and unanswered attempts.
- Washington activities are split into **Legal Sports** and **Illicit Activities**.
- Legal Sports changes with the phase: Capital Race Grounds during the Business Day and licensed boxing during Washington Night.
- **Contracts** is a first-class department. Customers, not the player, specify required product, quality standard, quantity, price, and deadline.
- Federal Electric begins with one existing customer contract and grows its contract book through successful performance.
- Factory production advances continuously against the shared one-hour business-day clock and displays a large live progress bar.
- The player can leave the factory while production continues, but unattended operation carries semi-uncommon breakdown risk.
- A works manager/foreman may resolve unattended problems independently or may need executive authorization, leaving production stopped until the player returns.
- The Star Club offers a 15-minute Brief Visit ($5) and a 30-minute Afternoon Visit ($12); production continues during either absence if the line remains operational.
- Customer history remembers correct, late, short, rejected, and eventually wrong-specification deliveries.
- NPCs should remember meaningful interactions and may develop loyalty, resentment, jealousy, rivalry, fear, affection, or indebtedness without exposing videogame meters.
- **The Star Club**, operated by fictional Madam Star, is the first Washington nightlife/underworld location.
- Bookmakers, private gambling, and backroom poker can exist as optional activities.
- Backroom poker is not one generic venue. Washington has at least three social strata of games: neighborhood/working-class, commercial/professional, and elite private-society games.
- Each poker circle has different stakes, access requirements, patrons, information opportunities, and police exposure.
- Poker opens as a separate dedicated game window, not an in-page modal.
- Daily poker availability is capped at 5 neighborhood games, 3 commercial games, and 1 elite private game.
- The elite game is not automatically available. It requires the correct introductions, invitations, or information from the player's social network.
- Poker raids should be uncommon. Playing poker must not routinely result in arrest.
- The Star Club/brothel is assumed to have protection and connections; direct raids there are rare, approximately twice per in-game year on average, with irregular timing.
- Rare Star Club raids should imply a meaningful change such as political pressure, failed protection, a new enforcement figure, betrayal, or a deliberately public crackdown.
- Production and shipment fulfillment consume active business-day time rather than resolving instantly.
- Ending the day early can cause an incomplete shipment.
- Where permitted, the player may make a partial shipment, but customers remember shortages and late deliveries.
- Customer contract history affects later order size, terms, willingness to renew, and access to valuable future contracts.
- Police raids are independent world events rather than punishment triggered by choosing to gamble.
- A player may attend a raid, avoid it knowingly, or skip gambling for unrelated reasons and discover the raid in the next newspaper.
- Police/political contacts may provide advance information, but information can be wrong or intentionally false.
- No universal morality meter. Consequences emerge through money, relationships, press, law, shareholders, boards, government, and history.
- Historical specifics are researched rather than guessed.
- Core gameplay additions remain updates to the same game rather than paid gameplay DLC.

- Contract hunting is an explicit player action. Seeking new business consumes 2 active business minutes and may return multiple offers or no suitable work.
- Contract acceptance is not artificially capped. The player may overcommit the factory and suffer deadline/customer consequences.
- Small, medium, and large light-bulb orders target roughly 10, 20, and 30 minutes of production time at the starting factory, leaving room for multiple orders during a one-hour business day.
- Accepted contracts enter a player-controlled production queue. The player may reprioritize waiting work; completed orders automatically hand the line to the next queued order.
- The Factory warns when estimated queued production exceeds remaining business-day time but does not block the decision.
- Federal Exchange orders use arbitrary positive whole-share quantities rather than fixed 1/10/100 lots, with Buy, Sell, and Sell All actions.
- The Federal Exchange keeps personal cash available visible and reports realized profit/loss on each stock sale and cumulatively by security.

- Poker access progression is social: the Neighborhood Game is open by default; meeting Eddie Doyle through Madam Star unlocks the Commerce Club; Commerce Club play can introduce Harrison Vale, whose invitation unlocks the Embassy Room.
- Simulated poker is a first-class alternative to manually playing a session. Each simulation consumes exactly 5 active business minutes, advances unattended factory production, consumes one daily room session, changes personal cash, records the result in the Journal, and can trigger the same progression/events as a played session.
- A positive poker session counts as a win whether manually played or simulated.
- Poker music and its UI are out of current scope and removed until explicitly revisited.

- Contract customers now have persistent buying personalities that affect specification tolerance and partial-shipment acceptance.
- Finished light-bulb inventory is separated by Economy, Standard, and Long-Life grade.
- Production grade is a deliberate factory setting and may differ from the customer's specification; customers can reject a wrong-grade shipment for replacement or accept it only at a discount according to their buying personality.
- Customer history records correct, discounted, rejected, partial, and late/short outcomes and feeds future commercial terms.
- Switching light-bulb grades costs factory setup time.
- Important customer fulfillment outcomes are recorded as correspondence in the Journal.

- All meaningful activities consume the same one-hour active business day; there are no free-time pockets.
- Manual poker displays the authoritative Federal Electric business-day clock; elapsed table time passes on that shared clock and is not charged a second time on exit.
- Poker simulation costs are tiered by room: Neighborhood Game 5 business minutes, Commerce Club 10 business minutes, Embassy Room 25 business minutes.
- A simulation cannot begin unless enough business-day time remains to pay its full time cost.
- Contract production runs are normalized to the established 10/20/30-minute bands. Legacy or malformed productionSeconds values above 30 minutes are repaired during migration and before starting queued work.


## 2026-10-01 — Autosave, stabilization, and poker clock

- Federal Electric is an autosave game. Manual Save and Load controls are removed.
- The destructive reset control is named **New Game** and must warn that all previous progress will be lost before resetting.
- The business-day clock is authoritative across activities. Poker must display the same remaining day time and must not charge elapsed time twice.
- Development proceeds one verified slice at a time on `main` until the stabilization list and roadmap are cleared.
- Horse racing remains the next major gameplay system after stabilization: the meeting begins automatically halfway through the business day, missed races resolve without the player, qualifiers advance through a visible bracket, and the player may arrive late solely for later races or the Main Event.

## 2026-10-01 — Star Club visit lengths

- Madam Star will offer two adult, non-explicit visit lengths rather than a single fixed 30-minute visit.
- **Brief Visit:** 15 business minutes, lower price, lower opportunity for useful conversations/introductions.
- **Afternoon Visit:** 30 business minutes, higher price, stronger opportunity for conversations, introductions, rumors, and encounters.
- Both consume the same authoritative Federal Electric business-day clock and advance unattended factory production while the owner is away.
- The shorter option exists so late-day visits remain possible without creating a free-time pocket.

## 2026-10-01 — Blackmail and leverage

- Federal Electric will support blackmail/leverage in both directions: NPCs may blackmail the player, and the player may acquire compromising information about NPCs.
- A Star Club encounter may expose compromising conduct involving a fictional public figure or fictional presidential candidate, creating leverage rather than an automatic scripted outcome.
- Information has provenance and strength; rumor is not equivalent to documented proof.
- Leverage outcomes are systemic: compliance, refusal, favors, money, retaliation, counter-leverage, police/reporting risk, relationship damage, and consequences for Federal Electric.
- Generated compromising conduct should attach to fictional political characters. Historical figures are handled only with sourced historical facts and clearly separated simulation consequences.

## 2026-10-01 — Federal Exchange quantity control

- The share quantity field sits immediately above Buy/Sell/Sell All so the player can change quantity and execute a trade without moving across the row.
- The share-quantity placement is implemented. Preserving an in-progress typed quantity through every rerender remains a separate stabilization item until verified.

## 2026-10-01 — Persistent top controls

- The accepted current layout keeps the persistent header, business-day clock, and primary navigation visible while scrolling.

## 2026-10-01 — Revised poker access progression

- The Neighborhood Game is unlocked by default at game start.
- Eddie Doyle no longer gates the low-tier game. Meeting Eddie Doyle instead provides access/invitation to the mid-tier Commerce Club.
- The previous requirement to win 10 Neighborhood Games before entering the Commerce Club is removed.
- While playing Commerce Club sessions, the player has a chance to meet Harrison Vale.
- Harrison Vale is the social gate to the third/highest tier, the Embassy Room; the player must receive his invitation rather than grind a win counter.
- Poker progression therefore follows social access: open low tier → meet Eddie for mid tier → play mid tier and meet Vale → receive Vale invitation for elite tier.

## 2026-10-01 — Capital Race Grounds implementation

- Federal Electric now has a scheduled fictional race meeting at Capital Race Grounds.
- The meeting does not wait for the player: Heat 1 runs at 30:00 remaining, then 26:00, 22:00, 18:00, semifinals at 14:00 and 10:00, and the Main Event at 05:00.
- Twenty-four entrants begin in four six-horse heats. The top two from each heat advance to two four-horse semifinals; the top two from each semifinal advance to a four-horse Main Event.
- Horses are persistent rather than regenerated between races. Career record, form, fitness, fatigue, health/injury, preferences, and jockey data carry forward.
- The player can bet Win, Place, or Show using personal cash. Arriving late is allowed; missed races are already resolved and visible in the progression.
- Attending the entire meeting costs the time actually spent there. There is no separate fixed admission-time penalty.

## 2026-10-01 — End Day Early consequences

- End Day Early remains available, but a future event pool will make leaving early capable of producing a random good or bad consequence.
- Examples may include useful quiet-time maintenance or favorable messages on the positive side, and missed customer calls, lost leads, unattended problems, gossip, or missed contacts on the negative side.
- These events are contextual simulation consequences, not a morality system, and are documented/roadmapped but not yet implemented.

## 2026-10-01 — New Game separation

- New Game is visually separated from End Day Early so a destructive reset is not adjacent to a routine day-management action.

## 2026-10-01 — Core product terminology

- Federal Electric begins as a manufacturer of **light bulbs, not finished lamps**.
- Starting grades are Economy, Standard, and Long-Life light bulbs. Existing saves displaying the older Electric Lamps wording are migrated to Electric Light Bulbs.
- Future expansion moves into broader electrical products/components and, as the historical timeline develops, researched wartime electrical/electronic production.


## 2026-10-01 — Hidden intraday quotations

- The market itself continues moving during the business day.
- Federal Electric does not have a modern live-computer quotation display, so the player sees the day's published opening quotation while trading continues unseen.
- The closing quotation is revealed at the closing bell and becomes the next business day's opening basis.
- The hidden market state may continue to react to market, sector and company forces even though the player cannot watch those movements tick by tick.

## 2026-10-01 — Race Betting v2

- The player may place Win / Place / Show tickets in advance on any race whose field is already established.
- All four heats can therefore be wagered before Heat 1; semifinal and Main Event betting opens only after their qualifying fields exist.
- There is no arbitrary per-race wager ceiling. Limits should come only from available cash and later historically justified betting mechanics.
- Races resolve on the same authoritative world clock whether or not the player is at Capital Race Grounds.
- Existing tickets settle automatically while the player is elsewhere.
- The Race & Wager Ledger records race results and the player's betting profit/loss in race order.

## 2026-10-01 — Day / night architecture

- The intended daily structure is **one hour of Business Day followed by one hour of Washington Night**.
- Business Day contains Federal Electric operations, contracts, the Federal Exchange, the regular race meeting, ordinary daytime business and daytime contacts.
- At night the exchange and ordinary daytime business close. A different set of people, events and locations becomes available rather than simply giving the player another unrestricted hour.
- Madam Star is available in both phases. Her establishment uses different encounter pools by phase, and some contacts can only be met during the day or only at night.
- Planned night Star Club choices include **Brief Evening Visit** and **Evening Visit** in addition to the existing daytime choices.
- Legal sporting activity and illicit activity are separate concepts. Horse racing and sanctioned boxing belong with Legal Sports; poker, cockfighting, backroom prizefights and similar underground activity belong with Illicit Activities.
- The Daily Report is private and comes after the night phase.
- The Metropolitan Ledger is delivered at the beginning of the next day, not at the end of the previous day.

## 2026-10-01 — Strategic stock ownership

- Arbitrary videogame caps should not limit legitimate stock purchases; constraints should come from cash, actual share availability, market mechanics and historically justified rules.
- Shares represent ownership. Future public-company systems will track finite outstanding shares and percentage ownership.
- Large positions can eventually unlock strategic influence, board access, negotiated combinations, takeover attempts and mergers without forcing the player through unnecessary securities-law busywork.
- If Federal Electric goes public, the same ownership system can work against the player through dilution, outside share accumulation, board/proxy contests and possible loss of control.
- Exact historical disclosure, merger, takeover and antitrust rules must be researched before implementation.


## 2026-10-01 — Legal Sports, illicit activities, and fight-world discovery

- The player-facing underworld category is **Illicit Activities**.
- The current Race Track area evolves into **Legal Sports**.
- Capital Race Grounds is the daytime legal-sports anchor.
- Licensed boxing is the nighttime legal-sports anchor, with persistent fighters, scheduled cards, automatic world-clock resolution and betting.
- Private prizefights belong to Illicit Activities and may occur during either the Business Day or Washington Night. Daytime private fights intentionally compete with factory work, racing and legitimate meetings for the player's time.
- Cockfighting belongs to Illicit Activities and is discovered separately from private prizefights.
- Eddie Doyle's bookmaker role expands into a recurring source of leads. Speaking with him can reveal a private fight, cockfight, unusual betting action or no useful information.
- The bookmaker is not the sole progression gate. Legal boxing contacts, Madam Star, poker contacts and other underworld relationships can independently reveal private prizefights or cockfighting.
- Underground unlocks are independent rather than one master criminal-access switch.
- Licensed boxing and private prizefighting share a connected fight world: contacts and fighters may cross between respectable and underground circles when the simulation provides a reason.


## 2026-10-01 — Fight-world implementation status

- The two-phase clock foundation is implemented: Business Day transitions to Washington Night, which transitions to a mandatory private Daily Report before the next morning begins.
- The morning Metropolitan Ledger is generated only when the next business day begins.
- Legal Sports is now the player-facing navigation label for daytime horse racing and nighttime licensed boxing.
- **Illicit Activities** is the player-facing underworld category.
- Licensed boxing has a persistent roster, scheduled four-bout nightly card, fighter styles/records/condition, automatic resolution and winner betting.
- Capital Race Grounds is hidden during Washington Night; licensed boxing is hidden during the Business Day.
- Madam Star now exposes separate daytime and evening visit controls with different encounter pools.
- Eddie Doyle can be asked what is running and may reveal a private prizefight, cockfight, useful schedule information, or nothing useful.
- Capital Race Grounds can introduce Eddie Doyle while the player is actually present, so Madam Star is not the only route to meeting the bookmaker.
- Private prizefights and cockfighting are independently unlockable and settle on the shared world clock.
- Private prizefights can be scheduled during either phase. Cockfighting currently schedules during Washington Night.
- Licensed boxing can introduce Marty Kane, a fight-world contact who can become another route into private prizefights.


## 2026-10-01 — World-time catch-up and morning sports reporting

- Time-consuming actions that jump the authoritative clock must advance all appropriate Business Day systems for the elapsed time rather than only subtracting minutes from the display.
- The hidden Federal Exchange therefore advances during Star Club visits, contract searches, simulated poker, underworld lead-chasing and factory changeovers while the Business Day is open.
- Hidden market movement remains hidden from the player until the closing bell even when a time jump advances it.
- Major Capital Race Grounds and licensed-boxing results are carried forward into the **Sports** section of the next morning's Metropolitan Ledger.
- Underground results stay in the player's private records unless a separate public event makes them newspaper-worthy.
- The Underground Ledger records completed private prizefights, cockfights and associated wager results in chronological order.


## 2026-10-02 — Night business gating and boxing registry

- Washington Night is not a second unrestricted business shift.
- Factory production controls, suppliers, contract acceptance/decline, production-grade changes, queue changes and shipping are unavailable after the Business Day closes.
- The Federal Exchange remains closed throughout Washington Night with final closing quotations posted.
- Licensed boxing now exposes a persistent **Commission Fighter Registry** showing fighter class, age, style, record, condition and medical status.
- Completed decision bouts expose their final score totals in addition to the official result.


## 2026-10-02 — Company cash, personal cash, and corporate misuse

- Company cash and personal cash remain separate resources, and both are permanently visible in the fixed header.
- A recorded owner distribution can move company cash into personal cash during the Business Day and is entered in the company record.
- The player may instead divert company funds to personal use during an active phase, including Washington Night.
- Diverted funds are not treated as legitimate operating expenses. They accumulate as **Unaccounted Company Funds** and increase **Accounting Exposure**.
- There is no arbitrary videogame ceiling on either transfer; the immediate hard limit is available company cash.
- Treasury activity is included in the private Daily Report.
- Future public-company, audit, board, shareholder, banking, blackmail and investigation systems can react to the accumulated misuse rather than treating each diversion as an isolated event.


## 2026-10-02 — Closed build and next online milestone

- The 2026-10-02 Day/Night, Fight World & Treasury build is closed as the current accepted development snapshot.
- The large blue **Federal Electric / Confidential** masthead scrolls with page content.
- Only the red phase/date/time/exchange/cash status bar and the primary navigation remain sticky.
- Company Cash and Personal Cash remain visible in the sticky status bar on desktop and mobile.
- The next active development milestone is **Accounts → Global Chat → Global Rankings**.
- Accounts exist primarily to preserve long-running progress across new builds and devices.
- New builds must migrate valid older saves forward rather than treating schema changes as permission to reset progress.
- Cloud save and local save should coexist, with local storage retained as an emergency fallback rather than discarded.
- Global Chat is account-backed but must remain operationally separate from game saving; chat failure cannot prevent the game from saving or loading.
- Global Rankings must be derived from server-stored/validated game state rather than accepting arbitrary leaderboard numbers from the client.
- Final leaderboard categories and formulas will be explicitly designed before implementation.
- The first playable Federal Exchange now seeds a fictional previous close so first-day day-change values are not universally +0.00%.


## 2026-10-02 — Pause, materials, contract negotiation, and security history

- PAUSE is a true gameplay freeze rather than extra decision time. Entering pause immediately returns the interface to **Executive Desk**.
- While paused, every navigation tab and gameplay control is disabled and visibly grayed out. The only usable controls are **PLAY** and **New Game**.
- Raw materials are not restricted to fixed lots. Copper, glass and tungsten can be bought or sold in arbitrary whole-unit quantities, and the player can sell all held inventory.
- Customer requests define what the buyer wants, but the customer does not dictate Federal Electric's selling price.
- Before accepting new work, Federal Electric proposes quantity, grade and unit price. The buyer can accept, reject, or counter; only agreed terms become a production contract.
- Wrong-grade delivery consequences remain separate from pre-contract bargaining: a buyer may still reject an out-of-spec shipment or accept it only at a reduced price.
- Federal Exchange Day movement is measured against a stored prior close.
- Each fictional listed company carries a persistent quotation history. The game seeds roughly 90 pre-start sessions and appends completed playable business days.
- Wartime copper scarcity, priority allocation, and government-contract access are planned future systems and were not implemented in this build.


## 2026-10-02 — Primary navigation consolidation

- The sticky primary navigation is reduced to five top-level buttons: **Executive Desk**, **Factory**, **Markets & News**, **Journal**, and **Pastimes**.
- **Factory** contains the existing **Production** and **Contracts** sections. Contract hunting, negotiation, accepted contracts, customer records, production, materials, and shipping keep their existing gameplay behavior.
- **Markets & News** contains **Federal Exchange** and **Metropolitan Ledger**.
- **Journal** contains **Journal** and **Contacts**.
- **Pastimes** contains **Legal Sports** and **Illicit Activities**.
- The selected top-level button is visibly **blue with white text**. Related secondary section buttons use the same selected-state treatment.
- The underlying section IDs and gameplay systems remain intact; this is a navigation consolidation rather than a rewrite of the affected systems.
- Pause behavior is unchanged: pressing **PAUSE** returns the player to **Executive Desk**, disables and grays out gameplay navigation and controls, and leaves only **PLAY** and **New Game** usable.

## 2026-10-04 — Title-screen interactive objects and future Easter eggs

- The title-screen office remains a fixed approved artwork. Interactive ideas should use precise overlays/hit targets rather than altering unrelated parts of the image.
- **Newspaper:** only the **M in "Metropolitan Ledger"** on the visible desk newspaper is the hidden click target. Clicking that M opens the approved 1938 Metropolitan Ledger mockup about the Munich Agreement.
- **Washington wall map:** clicking the framed Washington, D.C. map on the far-right wall should open a readable map of Washington, D.C. as it stood in 1938.
- **Flag history:** a specific middle red stripe of the U.S. flag beside the green desk lamp should be clickable and open a short history of the United States and the 48-star flag as it stood in 1938. This must remain separate from the documented future star Easter egg.
- **Desk lamp:** clicking the green shade of the desk lamp should toggle its light state. The green shade itself is the intended hit target because the physical switch/base is not visible.
- **Weather lighting:** future live Washington weather may affect the title screen. Rain or storm conditions during daytime should use the darker night-style office illumination, automatically light the lamps, and add rain/storm animation only in the window. This changes visual lighting only; it does not change the game clock or phase to night.
- **Bookcase Easter egg:** on the left bookcase, use the shelf directly below the top shelf. After the row of upright books on the left and the small tilted/lying stack near the middle, the intended target is the **next upright book immediately to the right of that tilted stack**. It is not the far-left book. The future behavior for clicking this book is not yet defined.
- **Clock cleanup:** the title artwork currently contains more clocks than desired, including the main live clock plus small decorative clocks near the bust/picture area. A future overlay or other non-destructive visual treatment may hide one of the redundant decorative clocks. Do not change this until a specific clock and replacement treatment are approved.



## 2026-10-04 — Title-screen radio station architecture

- The radio remains part of the fixed approved title artwork. Radio interactions use transparent hit targets and do not alter the artwork.
- The **lower radio dial** is the tuning control. Each click advances to the next available station and wraps from the final available station back to Station 1. It no longer powers the radio off.
- The **upper tuning/display window directly above the dial** is the power control. Clicking it turns the radio off or back on.
- Every station is an ordered playlist, including stations that currently contain only one file. A station plays file 1, then 2, then 3, and so on; after its final file it returns to file 1.
- Station 1 is the existing title music.
- Station 2 is the approved Cloud-10 radio-static recording on continuous rotation.
- Station 3 is the original October 30, 1938 Mercury Theatre / Orson Welles War of the Worlds broadcast on continuous rotation.
- Station 4 is reserved for a growing sequence of compatible Library of Congress recordings. Files are appended in the approved order as they are supplied.
- Future dial positions may include additional distinct static/dead frequencies and a faint distant station whose single signal fades in and out under interference without sounding like someone is retuning the dial.
- Long term, stations grow by appending compatible recordings rather than replacing existing material, creating progressively longer period radio programming.
- Future historical news interruptions may be added when suitable original audio is found. Any 1938 interruption behavior should reflect contemporary network bulletins rather than the later Emergency Broadcast System.
