# Historical Notes

## Geographic direction

**Federal Electric** is a fictional American electrical and industrial corporation. It may evoke the breadth of major historical manufacturers, but it should not be represented as a real company under another name.

Washington, D.C. is now the leading headquarters and political setting. This gives the game direct access to federal procurement, regulators, military administration, newspapers, diplomats, bankers, lobbyists, and a later political-career path. Major manufacturing plants can exist outside the District as Federal Electric expands.

## Starting period

Target start: **1938**, before direct U.S. entry into World War II.

The timeline should allow the player to experience:
- lingering Depression-era business conditions
- European war and changing international demand
- U.S. rearmament and industrial mobilization
- Pearl Harbor and U.S. entry into the war
- wartime production
- material and labor constraints
- the end of the war
- postwar audits/investigations where simulation state warrants them
- eventual postwar reconversion

## Historical versus fictional naming

Use real historical events, dates, institutions, public offices, broad market conditions, and factual background when appropriate.

Use fictional names for most playable corporations, competitors, brokers, clubs, and recurring private characters. Fictional firms let player actions change company fortunes, scandals, bankruptcies, contracts, and stock prices without inventing false histories for real businesses.

A fictional name is not a substitute for historical research. When a fictional security is designed around a historical industry archetype, its sector conditions should still be grounded in the actual period.

## Newspapers and preservation

Historical newspapers are part of the preservation mission.

The game may reproduce complete historical material only when its rights/status has been checked for the intended use. Preserve source and provenance information with archived material. Historical archive material and fictional/generated game reporting should be clearly distinguishable.

The in-game newspaper can combine researched factual national/international developments with fictional local and Federal Electric stories generated from simulation state.

Potential sections:
- national/world wire
- financial page
- local industrial page
- society page
- sports/racing page
- advertisements/classifieds
- Federal Electric coverage when warranted

## Market research

The playable exchange uses fictional securities, but the historical market environment should be researched. Broad market regimes, sector behavior, major shocks, exchange practices, commissions, dividends, margin rules, and other specific mechanics should be verified for the selected year before being presented as historical fact.

The first Federal Exchange build intentionally uses a gameplay-oriented market model as scaffolding. Later passes should replace generic movement assumptions with researched historical regimes.

## Research rule

Historical accuracy is a game system. When implementing specific dates, prices, securities, wartime events, technologies, laws, government programs, military contracts, tax rules, or product availability, verify them against reliable historical sources rather than relying on memory.


## Fight-world research queue

The current fight and betting systems are gameplay foundations. Before labeling deeper rules historically authentic, verify the following against 1938 Washington-area sources:

- District of Columbia boxing commission rules, licensing, bout lengths, gloves, medical suspensions, judging, purses, promoters and venues
- whether and how wagering on licensed boxing was legal, tolerated, restricted or handled through bookmakers in the District and nearby jurisdictions
- actual evening card timing and the social mix around Washington boxing venues
- pari-mutuel and bookmaker practices around horse racing serving Washington-area bettors
- minimums, practical limits, pool effects, takeout and payout calculation for 1938 race wagering
- cockfighting legality and enforcement in the District of Columbia, Maryland and Virginia in 1938
- period terminology and social context for private/unsanctioned prizefighting
- enforcement patterns for private gambling, bookmaking and underground fights

Until that work is complete, named venues, fighters, bookmakers, promoters, odds and underground events remain fictional simulation content rather than claims about specific historical people or establishments.


## Verified boxing foundation

Primary-source research confirms that boxing regulation in Washington, D.C. had a formal statutory foundation before the game begins in 1938.

- Congressional Record material from 1934 documents legislation creating a District of Columbia Boxing Commission and requiring commission permits for covered boxing exhibitions.
- Later congressional material discussing the commission identifies the underlying law as the **Act of April 24, 1934**, confirming that the regulatory structure predates Federal Electric's January 1938 start.
- Library of Congress holdings include Washington boxing material from 1937–1938, supporting boxing as a contemporary part of the city's sporting world.

This supports licensed/commission-regulated boxing as a legitimate Washington activity in the 1938 simulation.

### Still not verified enough to lock as historical mechanics

The current game's boxing **betting** is still gameplay scaffolding. Research has not yet established a sufficiently precise 1938 District of Columbia rule for whether, where, and through what legal mechanism spectators could lawfully wager on a licensed boxing card. Do not treat the current in-game betting interface as a claim that a specific 1938 D.C. sportsbook system existed.

Likewise, exact bout rules, card timing, commission fees, purse structures, medical requirements, judging procedure, venue schedules, and enforcement details remain on the research queue before they are represented as historical facts.

### Primary sources consulted

- U.S. Congressional Record, 1934, legislation creating the District of Columbia Boxing Commission and regulating boxing exhibitions.
- U.S. Congressional Record, 1944, later amendments referring back to the Act of April 24, 1934 and the existing District Boxing Commission.
- Library of Congress, Harris & Ewing Collection, Washington boxing photograph dated 1937 or 1938.


## Period newspapers, cinema, radio and preserved media

Federal Electric treats period media as part of the historical simulation rather than as modern on-demand content.

### Metropolitan Ledger

- The current title-screen issue is priced at **3¢** because that price is printed into the approved newspaper prop and is now a gameplay cost.
- A purchased paper is a physical object and may be reread without paying again.
- Future dated editions should distinguish researched historical reporting from fictional/simulation-generated local reporting.
- Historical dates, headlines, prices, advertisements and major-event claims should be verified before an issue is labeled as period-authentic.

### Motion pictures

- The planned theater model charges per attendance rather than granting permanent ownership.
- Current gameplay targets are **25¢** for an ordinary showing and **40¢** for a major first-run/premiere. These are period-oriented design rates, not claims that every Washington theater charged those exact amounts.
- Venue-specific ticket prices, taxes, matinee/evening differences and premiere pricing remain research items.
- Theater playback intentionally omits modern conveniences such as pause, rewind, fast-forward, scrubbing and resume bookmarks.
- Before a film is packaged, streamed or otherwise distributed through the game, verify the copyright/public-domain status of the **exact film version and scan/restoration** being used. A public-domain underlying film does not automatically make every modern restoration or soundtrack unrestricted.

### Radio

- The intended broadcast model is schedule-driven. Real stations continue through programming whether the player is listening or not, and tuning in joins the program in progress.
- The Federal Electric title theme is intentionally exempt from that historical model and restarts from the beginning whenever its station is selected.
- Mercury Theatre programming may be scheduled by time of day, including nighttime-only placement where appropriate for the game's atmosphere.
- Morse-code and weak-signal material should sound period-plausible and should not rely on very short modern training loops when a longer broadcast texture is required.
- Historical news interruptions should use period-appropriate network-bulletin conventions and must not imitate the later Emergency Broadcast System.


## Factory economics calibration — October 5, 2026

The v0.4.0 economics audit corrected a unit-semantics problem in the bulb model.

- Social Security Administration historical tables report average 1938 manufacturing earnings of **$0.62 per hour** and **35.6 hours per week**.
- The NBER Macrohistory electrical-manufacturing series published through FRED reports roughly **$0.80 per hour** for U.S. electrical manufacturing in 1938. Federal Electric therefore uses **$0.80/hour × 8 hours = $6.40 per worker** for its representative Business Day payroll.
- A surviving April 1938 U.S. newspaper advertisement lists common 75-watt and 100-watt Mazda lamps at **15¢ retail**. Federal Electric's game guide prices are now 12¢ Economy, 15¢ Standard and 20¢ Long-Life, with customer negotiation still moving actual contract prices.
- Copper, glass and tungsten inventory values in Federal Electric are **production stock units**, not pounds or ounces. Their prices are calibrated against the amount consumed by one lamp. This fixes the old error where a Standard bulb consumed more than its selling price in raw-material replacement cost before labor.

Research references:
- SSA, Annual Statistical Supplement, Table 3.B3: https://www.ssa.gov/policy/docs/statcomps/supplement/2023/3b.html
- FRED / NBER Macrohistory, Average Hourly Earnings, Electrical Manufacturing: https://fred.stlouisfed.org/series/M0811AUSM259NNBR
- The Wheeler Times, April 28, 1938, Mazda lamp price advertisement: https://newspapers.swco.ttu.edu/bitstreams/3d9b9804-30ed-437f-9ee4-d2a995973756/download
