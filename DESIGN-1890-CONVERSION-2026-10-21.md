# Federal Electric: 1890 Conversion and Expansion Design
Date: 2026-10-21
Target candidate: v0.6.0-alpha.2
Status: Approved direction; implementation and Linux validation pending.

## Direction
- Standalone Linux first, eventual Windows/macOS distribution and Steam/GOG consideration. No mobile/web development target.
- New campaign begins January 1890, not 1938. Preserve later-era systems as unlockable content rather than deleting them.
- The 1893 World's Columbian Exposition is relocated to Washington, D.C. in this alternate history. Repeat fairs may return in later years, with distinct exhibits, games, prizes and collectible trinkets granting modest gameplay modifiers.
- Washington is a navigable persistent city. Reuse existing registry and six player-positioned pins. Add Old Chinatown near historic Pennsylvania Avenue NW / 4th Street NW, a fairgrounds location, and a second nightclub opposite Madam Star's social atmosphere. Do not move existing pins without approval.
- Locations and rooms can use rudimentary placeholder art. Eventually rebuild the executive office as layered backgrounds and movable/removable props for day/night.
- Imperial Russian visitors, exhibitors, diplomats, engineers and merchants recur naturally in the 1890s. One or more may secretly work for the Okhrana; identities and motives are discoverable through evidence, not revealed by default.
- Add Chinese-American community businesses and characters in their historical context. Research period-specific locations and discriminatory restrictions before finalizing historical claims.
- The second nightclub owner and Madam Star are contrasting but morally complex social counterparts, not simplistic good/evil factions.

## Core simulation and risk
- Start with a stable, modestly profitable bulb manufacturer that can remain stable indefinitely if the player declines expansion.
- Expansion into power generation, glass, railroads or other industries is optional and risky. A failed venture can lose capital, customers, reputation or control without automatically ending the save.
- Persistent investor NPCs remember returns, losses, honesty and previous deals. Pitch projects and negotiate equity (ongoing until sale/buyout), fixed-term loans, or time-limited profit-sharing; include control, collateral and default consequences.
- Develop layered failures: project failure, subsidiary insolvency, inability to meet payroll, plant closure, bankruptcy, loss of company control, or a legacy continuation path. Balance recovery against meaningful consequences.
- Retain a moving clock in the office and elsewhere. Reassess 60-minute phases and day length for long social visits, travel, work and fair attendance; do not silently lock a new time scale.

## Conversion checklist for alpha.2
1. Audit all 1938 assumptions: campaign date, save schema/migration, calendars, wages/prices, historical names, technologies, equipment, stocks, radio, automobiles, venues, newspaper, contracts and events.
2. Change new-game date to January 1890 while preserving older saves and preventing timeline corruption. Date-gate anachronistic content rather than deleting assets.
3. Rebalance startup bulb factory to stable small profit, real payroll and materials, period-appropriate electricity infrastructure.
4. Preserve city registry and current pin IDs; introduce new locations as placeholders with no final art and no unauthorized map-pin movement.
5. Verify clock, travel, production, persistence, poker and offline Linux packaged build with regression tests.
6. Produce a portable Linux test artifact with version and SHA-256; user validation precedes acceptance/tag/release.

## Historical caution
The real 1893 fair took place in Chicago. Washington hosting it is explicitly alternate history. Period accuracy remains important outside deliberate divergences.

## Build policy
Single main branch. Do not represent documentation as a completed executable. This document is the authorized design brief for the next engineering slice, not a claim that the conversion is implemented.
