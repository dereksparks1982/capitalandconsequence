# Capital & Consequence

**One city. Countless lives. Every choice has consequences.**

*Capital & Consequence* is an in-development single-player life simulation in an alternate-history **Washington, D.C., beginning January 2, 1878**. Work, earn a living, go shopping, travel, encounter strangers, form friendships and rivalries, visit clubs, gamble, compete, and discover the consequences of choices years later.

**Federal Electric is the company you own. Washington is the world you inhabit.**

## October 26 source development: physical money and a lived-in Washington

- **No mandatory bank.** Federal Electric cash sits at the works until the owner physically collects it. Business cash carried remains business property, distinct from personal cash. A fictional District Bank allows optional **business**, **personal checking**, and **general-purpose personal savings** accounts. Deposits and withdrawals require entering the bank. Company distributions/diversions require returning to Federal Electric; the ledger records improper personal withdrawals.
- **Horse-racing cash:** Select personal carried cash or physically carried Federal Electric cash. Corporate wagers and any winnings remain company money. Accounting shortfalls from company gambling are recorded. Actual trips carrying large amounts involve a small saved risk of cash loss. Personal cash and carried company cash appear in the city-room header.
- **Washington destinations:** the original, unchanging map gains **National Theatre (pin 39)** and **District Bank (pin 40)**. Pin **15** now names Lucien Étienne Delacroix's existing establishment **Le Paon d’Or, “The Golden Peacock”**. Hillsdale butcher and market occupy **rooms within Hillsdale (pin 13)** rather than extra pins; both sell finite stock. Broker office shows the full posted Federal Exchange security sheet and order controls.
- **Residents and speech:** Edwin Booth, Joseph Jefferson, John McCullough, Clara Morris, John T. Raymond, Charles B. Hanford, and William W. Rapley live and work in **alternate-history 1878 Washington** with independent NPC schedules. Li Wen speaks Chinese only. NPC discretionary trips prioritize duties and personal sociability; simple greetings have an offline fallback. The date/time header no longer advertises the retired turn-based “FREE PLAY” mode.

This work is a **source build, not a Linux acceptance release**. Targeted JavaScript regression passed (56 finance, 25 Hillsdale and 104 multi-route/multi-era NPC assertions), but complete offline Node tests and actual Electron gameplay remain unverified. No GitHub Actions are used, no executable was requested, and the original Washington map artwork must never be changed.

### Further October 26 source work: betting and bank handling

Company and personal money stay different even inside a betting room. Licensed boxing and the Boiler Room, Commerce Club and Embassy Room poker games now accept a deliberate choice of *carried personal cash* or *carried Federal Electric cash* (for its owner). Poker popup reservations, refunds, forfeitures and quick simulated sessions preserve that origin, with persistent wager receipts preventing double payment. An invalid bank or factory money transaction consumes no time; an accepted one takes two minutes of player-triggered world time. Theatre residents now retain their individual rehearsals and stage-management routines in authorized theatre rooms rather than turning into generic retail clerks.

The offline regressions now include finance/teller timing, long-lived wagering, and seven theater workers. In source-only V8 checks, 405 focused finance assertions, 145 theater assertions and 104 two-era/four-route integration assertions passed. A complete Node regression run and Electron hands-on test have **not** been performed. No GitHub Actions or new Linux executable were used.

## Choose your life

| Character | Starting life | What you can pursue |
| --- | --- | --- |
| **Charles “Charlie” Whitcomb** | Owns a small telegraph and electrical component workshop, Federal Electric | Manufacture and deliver actual orders; hire, acquire, invest, socialize, gain influence and possibly enter politics. |
| **Samuel “Sam” Harlan** | Black rookie Metropolitan Police patrolman | Walk the **Hillsdale / Barry Farm** beat, handle neighborhood incidents and station reports, build relationships, advance or leave the force. |
| **Elias “Eli” Crowe** | Unknown doorman at a French nightclub | Work entrance shifts, meet patrons, earn trust or suspicion, and choose whether ordinary employment leads somewhere respectable or dangerous. |
| **Edmund Wardman** | Unfavored son of the wealthy Wardman family, a low-ranking orderly at District Asylum | Work hospital duties, discover institutional politics, pursue advancement or strike out on his own. |

The three characters you do not select lead **autonomous lives within that profile's Washington**. No character is destined to be a murderer, criminal boss, honest officer or tycoon. Four career desk foundations exist now; **Charlie's business gameplay is the most developed**.

## Live in Washington

**Work and the economy.** Produce 1878 telegraph/electrical components at Federal Electric; buy real materials, assemble at a bench, ship orders from actual inventory and collect payments. Business and personal cash remain separate. Sullivan, the workshop's sole paid assistant, earns **$6 for his five-day workweek** and rents a room on the premises for **25¢ a week**, leaving money for food and occasional clothes or repairs. Chinatown's active Market Street has a **finite shared merchant stock**: NPCs and the player purchase from the same inventory and tills. Competing shops, more realistic stock, additional professions and property ownership are planned.

**Explore the city.** The existing **38 numbered destinations** include Federal Electric, Chinatown, Hillsdale / Barry Farm, the Star Club, the Embassy Room, a police station, hospitals, shops, markets, horse liveries, the racetrack and fishing sites. Many rooms have distinct entrance restrictions. Buy or hire horses, keep them physically where you leave them, pay for feed and boarding, and travel between destinations. Fishing has an active tackle, casting and landing system. Some interiors and travel-time calculations remain provisional.

**Meet Washington's residents.** The original eleven named residents now share the city simulation with the **three playable protagonists you did not select**. Up to fourteen autonomous characters have provisional routines, occupations and individual conversation cards (historical figures also obey their year restrictions); the player-controlled protagonist is never also spawned as an NPC. They may be absent when you visit. When someone is actually in the same room, select their name to open an individual **character card** with a temporary silhouette, saved conversation history, and unrestricted text entry. No topic menus tell you what to ask. Residents may decline to talk, express individual opinions, or admit ignorance. Each active character now also retains an early private energy, hunger and mood model, shaped by elapsed in-game time and their usual work/rest routine; these conditions influence their willingness to speak. Sullivan's established factory-rented bedroom is now an actual scheduled overnight room, with normal private-door restrictions. Other residents' unconfirmed homes, real travel durations, physical meals and extended life consequences remain unfinished. The current AI is an early combination of individual decision logic and character-specific conversation with an optional local model backend. Residents now also carry private, save-backed **ongoing goals** with bounded evidence of actual work, visits and witnessed social contact, and can revise their priorities when circumstances materially change. Recorded same-room conversations, assistance and disagreements also leave individual first-hand memories, change participants' mood, and influence later social caution or willingness to talk. These consequences belong to the specific residents, not to a globally shared reputation or an automatic friendship. These are records of effort, not proof that a business deal, career promotion or friendship succeeded. Independent housing, fully realistic travel, deeper goals, historically verified knowledge, and mature lifelong memory remain in development. You talk to **characters through their own cards**, never to a separate AI assistant.

**Pass the time your way.** Poker, racing, boxing, private fights and social encounters have existing foundations. A D.C. Sporting Champions register records established titleholders and tournament progress. Betting, persistent championships and venue-specific government authorization are the next major planned expansions. Players can also pursue personal effects, news, markets, music and relationships. **An NPC never advances the world clock on its own**: the clock runs normally, and player activities can advance it explicitly. There is no offline simulation.

**Read and change Washington.** The **one original Washington In and Out Guide map** is permanent for *every playable year*, including 1878 and 1938. Its printed **A–R / 1–30 grid** remains, along with numbered pins, editable profile-local pin names, search, location filters, a directory, and confirmation before a moved pin is saved. History cards distinguish real sites from fictional sites in writing. A **purpose-based pin-color system** is planned; do not interpret the current red/blue artwork as the final palette.

## An evening in Washington

**The Star Club** belongs to **Eleanor Victoria Ashcroft**, known as **Madam Star**, a British proprietor of exceptional discretion. A past president founded the establishment in the fictional history; his identity is not yet chosen. The atmosphere is expensive and rule-bound: high-quality meals, drinks, discreet adult companionship, and accomplished **background musicians, not a stage show**. **There is no poker or card gambling at Madam Star's club.** It is possible to spend hours there rather than perform one isolated interaction. Jazz belongs to later eras; in 1878 the music must be period-appropriate.

At the other extreme, **Lucien Étienne “Lui” Delacroix**, a French gay nightclub owner and Eli's employer, runs a cabaret with can-can/burlesque entertainment and a much more disreputable private world. Public dancing and drinking conceal darker pleasures and crime the player must discover, not simply know at the door. Food and drinks will also be offered. The code still labels the premises **Second Nightclub** until the designed identity is integrated.

**The Embassy Room** is a separate elite card room at the existing Chevy Chase Club location in the game's fictional history, accessible through contacts such as **Harrison Vale**. It is **not** located in Madam Star's club. Ordinary poker also exists at the open-to-all **Boiler Room** and the more selective **Commerce Club**. Commerce and Embassy invitations allow a **trial game**, not immediate membership: polite conduct and sportsmanship can earn a gifted **membership card**; arrogant behavior can bring a temporary refusal and a later retry. Racial and class barriers depend on the institution and its patrons.

**D.C. Poker Challenge** is the planned separate **government-sanctioned five-card tournament**. Under this alternate-history city's rules, gambling is legal **only where government permission applies**; the three standing poker rooms are otherwise unauthorized. Major horse, dog, boxing and later-era automobile competitions can lead toward **monthly D.C. titles**, with bets on heats, individual events and tournament champions. The detailed rules and permitted wagers are still in development.

## A recognizable but different United States

In the game's history, the actual **1861–1865 Civil War** was followed by the replacement of states and old borders with **national districts organized around economic purposes**. The Electoral College was abolished, presidential terms last **ten years**, and there is **no term limit**. **Samuel J. Tilden** won the nationwide popular vote in 1876 and **is president in 1878 in our alternate history**, unlike actual history. His first term runs from **March 4, 1877 through March 4, 1887** unless events cause early succession, with the next regular election in **1886**. Future winners and the exact district constitution remain undecided.

Real historical people will live alongside original characters. Tilden's associates, members of Congress, influential businesspeople and Black Washington entrepreneurs may appear at offices, hotels, social clubs and other appropriate venues. Meet them naturally, build trust, and potentially work toward appointed government service, elected office and political power. **Tilden now has a dated NPC schedule at the White House; other historical encounters and political careers remain in development.** The 1893 World's Fair will take place in Washington in this fictional timeline, opening later industrial possibilities.

Read more: [Character roster](CHARACTER-ROSTER.md) · [Living city and map](WASHINGTON-LIVING-CITY.md) · [Politics and historical people](POLITICAL-WASHINGTON.md) · [Championships and betting](SPORTS-CHAMPIONSHIPS.md).

## Project status and future work

This is a **private development alpha for Linux**, not a finished or accepted release. The current source milestone is **v0.6.88-dev**. [Source QA passed](https://github.com/dereksparks1982/capitalconsequence/actions/runs/40069611982) on the previously tested source. The prior Linux packaging workflow verified its archive, but delivery through GitHub Actions failed owing to artifact storage quota. **No new accepted desktop executable or validated end-to-end human playthrough can be claimed from that run.**

The game has an existing Washington map, shop/finance systems, timed factory work, basic protagonist jobs, personal records, fishing, transport, and sporting prototypes. The expanded political cast, retail neighborhoods, social venues, tournament system and government gambling law are **development goals**, not false promises that everything is already playable.

[Development roadmap](ROADMAP.md) · [Decisions and guardrails](DECISIONS.md) · [Current NPC AI + Star Club thread handoff](HANDOFF-2026-10-25-NPC-AI-AND-STAR-CLUB.md) · [Technical continuation](CONTINUE-HERE.md) · [Room navigation repair](ROOM-NAVIGATION-REPAIR.md) · [Permanent map rules](MAP-CANON.md) · [LEGAL.md](LEGAL.md).

**Elderred Softworks LLC · DKLab**. Single `main` branch. Changes, acceptance, and release follow explicit owner approval.

### Local quality checks

The repository has **no GitHub Actions**. A developer with Node.js already installed can run `bash scripts/local-source-qa.sh` to check JavaScript syntax and source regressions **without downloading packages, building installers, running cloud workflows or uploading artifacts**. This is not a substitute for real desktop playtesting.
