# Capital & Consequence · v0.6.90-dev Source Build
**Date:** 28 October 2026  
**Status:** Unaccepted development checkpoint, not an Electron-tested release.

## Owner-approved additions

- **Sixty independent skills**, each 0–100 with career-based starting levels, save-backed progress, individual practice events, anti-repeat protection and daily caps. In the game, use **Journal → Skills** to view and filter all 60. The catalog is complete; activities not yet implemented cannot earn their associated skill.
- **Fishing:** Fishing and Angling Knowledge increase through actual casts, losses and catches. Skill 100 has a **0.5% chance to hook a legendary Potomac sturgeon per eligible cast**. Landing is still a separate skill-based struggle. Legendary catches can be professionally mounted for a fee and covered by the *Metropolitan Ledger*. Saturday fishing meets cost 25 cents to enter; winnings depend on actual recorded catch weights.
- **Commercial fishing craft:** Period-appropriate rowing skiff and fishing smack can be purchased from 1878; steam fishing trawlers become available later. Vessels have upkeep, condition, repairs, hauls, crew costs and a low chance of permanent storm loss.
- **Industrial expansion:** An owned fictional steelworks rolls rails or makes iron products and maintains its own treasury and inventory. A regional railroad has its own passenger and third-party freight revenues, wage/coal/track expenses, upkeep and rail replacement. The owner can supply rails from the mill to the railroad without generating cash from nothing.
- **Merchant shipping:** Buy schooners and steamships, maintain hulls, dispatch to established ports, complete freight or Federal Electric cargo consignments, pay working expenses, insure hulls, risk storm or region-specific piracy losses, and gain new destinations through captain/merchant leads and paid port-agent verification. Voyages progress with **player-advanced in-game days**, never independent NPC time.
- **Federal Electric freight:** In 1878, merchant vessels transport **real telegraph/electrical components from the 1878 component-works warehouse**, not nonexistent bulbs. Inventory is deducted on departure; sale proceeds return to Federal Electric's own company books.
- **Brokerage:** The stock-market trading screen is no longer accessible through the executive desk. The physical stockbroker's office has a searchable, sector-filtered list derived from the exact period-eligible market registry, with a quotation-history detail card. Orders require an in-person broker visit until a repeated-visit relationship grants **telegram instructions from the executive office**. Ordinary telephone orders are not introduced. Issued shares and currently offered shares are finite per fictional period corporation.
- **Washington office and map:** The existing CITY MAP tile is replaced with a **flat, fully opened miniature of the exact original paper Washington map on the desk**, without pins or a frame. Click it for the full map. The 40 original map pins retain their exact coordinate anchors, with hovered labels above neighboring markers. Owned mapped places (including Federal Electric from the beginning) display **black markers** without relocating their coordinates. Newly acquired railroad/mill sites have no new Washington pin until a location is explicitly approved.

## Quality assurance and source-audit response

The owner supplied an independent six-page source audit by Claude, based on source snapshot **3021283**, reporting **77 test files, 66 passed, 11 failed**. The audit explicitly did **not** run Electron. It found a fail-fast QA command, stale hard-coded counts, brittle source-text assertions, a missing Go There test stub, and a possible map pin/Go There defect.

Corrections applied here:
- Replaced the chained npm test command with **`node tests/run-all.cjs`**, which executes **every test** and reports the entire failure list locally. The local shell checker also syntax-checks JS and does not use GitHub Actions, network, `set -e`, or a forced terminal exit.
- Updated stale 38→40 map and 16/22→23 NPC counts, 16→17 historical map facts, the physical market delivery count after extra neighborhood shops, the current 34-pixel pin-spacing contract and developer-room guard text.
- Repaired the Go There test's missing cash-review stub; added a test asserting that **rejected travel cannot relocate, close the map, or autosave the destination**.
- Changed the live Go There bridge so its provisional 30-minute travel cost or one-minute room-walk charge **must be successfully recorded before committing the destination**. Secondary room-panel exceptions can no longer waive travel time. The original map art and approved desk geometry were not changed.
- Added focused tests for the 60-skill registry and new industrial, merchant-shipping, fishing-boat and legendary-fish mechanics.
- Executed **focused V8 source simulations** of company acquisition, railway repair, successful merchant voyages, fishing boats, skill learning, and **20,000 skill-100 fishing casts (96 legendary hooks, 0.48%)**. The checked source parsed successfully in these targeted scenarios.

**Not yet verified:** The full `node tests/run-all.cjs` / `scripts/local-source-qa.sh` suite has **not** been executed in a real Node checkout in this assistant environment; neither has the updated game been play-tested in Ubuntu Electron. As a result there is **no claim of a fully green suite or accepted build**. The earlier audit's 11 failure count must **not** be assumed to remain the present count without rerunning the new suite.

## Delivery and acceptance

Source commits only, no GitHub Actions and no full app packaging required. The owner's existing local `apply_delta.py` can update its pinned GitHub revision and apply **changed runtime files into the existing ASAR**, preserving the game's launcher, original map artwork, and local save files. A local test of the actual modified executable and owner acceptance are required before a release tag.
