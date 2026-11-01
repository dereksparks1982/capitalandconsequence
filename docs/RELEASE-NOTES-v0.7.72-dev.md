# Capital & Consequence v0.7.72-dev | Municipal contract integrity and electric workshop QA
November 1, 2026 · Development source only; not an accepted Ubuntu release.

## Why this build
The newly playable 1878 contracts could previously invoice goods whose order had no recorded manufacture. A full warehouse did not prove that the specific customer obligation was fulfilled. The cheapest possible bids were also guaranteed winners, and failed laboratory experiments charged money but did not reduce the raw-material inventory they described consuming.

## Corrections
- Every ordinary customer shipment is limited by the actual per-order manufactured-but-undelivered balance, as well as warehouse stock.
- District streetlighting dispatch checks each of the three awarded manufacture orders. The building's general stock alone cannot substitute for unmade District goods. This closes a duplicate-payment and phantom-delivery route.
- World's Fair delivery similarly requires both sound bulbs physically in the warehouse AND enough actual undelivered units produced on the awarded Fair order. Failed bulbs never count as deliverable.
- Independent rival bids can now undercut the lowest offered price. Seeded bidding remains repeatable for a saved campaign, but low-price bids can genuinely lose.
- Carbon, glass, copper, brass and insulating stock are now deducted for each laboratory trial, including failures. Rejected attempts without enough materials leave inventory, company money and Washington time unchanged.
- Late work is still fulfillable; the already recorded September 30 District acceptance and December 31 Fair delivery targets now impose a transparent 10% payment reduction on late installments. Gross payment, deduction and net received are all saved in the transaction receipt.
- The existing Component Works screen shows raw materials required for the next experiment and the two contract deadlines. Bulb-product controls are removed when switching to a profile without the corresponding rights.

## What did not change
Protagonists, character arcs, alternate 1878 electric Washington, fixed map artwork and 42 pins, the World's Fair provisional late-1878 access gate, existing workday clock, baseline component recipes, 50-site scenario size, 100-bulb Fair scenario and the previously established contract phases are preserved.

## Validation
Verified in focused JavaScript execution: original component-workshop regression, updated municipal/Fair gameplay test (including the need to replace one defective bulb), and a new contract-hardening regression covering even low bids losing, failed raw-material preflight, cross-order stock, verified street dispatch, late penalties and nonduplicate payment. Source syntax checks passed for modified JavaScript and tests. **The full offline Node suite and packaged Ubuntu Electron game remain untested here.** No GitHub Actions, source archive, installer, annotated tag or accepted release was created.