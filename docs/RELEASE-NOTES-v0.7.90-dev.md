# Capital & Consequence · v0.7.90-dev
## Physical Merchant Cargo, Finite Port Exchanges, Sea Losses & Foreign Market Sales

**November 2, 2026. Source development, NOT an accepted Ubuntu/Electron executable.**

### Why this was built
The game already had an owned schooner/steamship system, fixed-fee third-party freight, and Federal Electric component consignments. The owner requested a **large** gameplay build. This slice adds a *new*, separate merchant-goods trade loop, rather than changing the existing cargo modes, passenger fares, four career stories or either approved map.

### Real purchase, genuine transit and explicit sale
- New `merchant-trade.js` models **six provisional commercial cargo families**: timber, cotton, coffee, textiles, tea, and machine fittings. They are generic material types and do not introduce named buyers, unique historical products, or narrative characters.
- Cargo is physically available only at its modeled origin ports, and each port has a **finite weekly stock**. Quotations read that available quantity without altering saved money, goods or the authoritative world minute. New calendar weeks restock independently; paid purchase receipts remain in the profile.
- Schooners hold up to twelve units; steamships up to twenty-four. A player-selected quantity must actually fit in the vessel. An actual cargo departure **buys the units with fleet money**, records handling charges and paid departure costs, and creates a save-backed manifest with ship ID, source, destination, units, purchase amount and route geometry.
- Departure is only possible from a real, berthed, **owned** ship between already commercially verified ports. The existing route graph gives the distance and transit days. No free personal/company cash, fake cargo sale or map teleport is created.
- **The freight fee model and the Federal Electric warehouse shipment mode remain intact.** The new cargo option does not convert fictional third-party freight into player-owned goods.
- When a vessel actually arrives through the original date/clock settlement, its surviving cargo enters the **destination's physical trade-hold inventory**. It does not instantly create sale revenue. The ship's chart displays its real purchased cargo while underway.
- Port sales are explicit and use a live, provisional port market quote. Proceeds credit the **fleet treasury only** and independently record gross amount, commission and customs duty. The lot is removed from the destination hold exactly once.
- The existing world shipping chart and industrial ownership panel both expose physical cargo purchase, ship selection, insurance and sales. The chart has a non-mutating purchase/profit estimate with actual purchase, loading, voyage fees, hull cover, *separate* cargo cover, expected local proceeds, duties, agent fee and expected running upkeep. **No profit guarantee** is advertised.
- Charles can additionally inspect real merchant goods at the **walkable foreign Harbour Storehouse**, then perform a *physical* fifteen-minute cargo sale from that port's market using the existing saved Washington world clock. This market action is locked to a genuinely visited overseas harbour. Remote authorized fleet brokerage remains available from the existing shipping-office controls.

### Losses and insurance
- Physical cargo can suffer partial, deterministic damage on an existing genuine voyage hazard; the saved landed quantity shrinks. Insurance pays a proportional cargo-damage amount **only if separate cargo cover was purchased**.
- When an insured vessel genuinely sinks, the existing hull insurance still pays to the fleet. Cargo insurance adds a separately recorded payment covering part of the actual manifest purchase value. No lost goods can be sold or automatically replaced.
- Insurance and cargo delivery are part of the original exactly-once vessel-arrival settlement, so reloads/duplicate daily views cannot credit the same claim or generate a second landed cargo lot.
- All merchant prices, port production, duties, commissions, weather risk and lot capacities are **provisional game balance**, not researched 1878 trade statistics or historical buyers.

### Protected features
- The original Washington `title-map-1938.jpg` bitmap, its owner-edited pins, road and rail overlays, physical room layouts and the separate unaltered owner-provided EcoClipper shipping chart are unchanged.
- 1878 streetlighting, late-1878 World's Fair and character story gates are untouched.
- Existing third-party freight, Federal Electric's separate component warehouse/consignments, personal passage, foreign-port walking, health, personal money and corporate treasuries remain distinct.
- No new town pins, cities, NPC names, definitive port trade lore, geography, game-speed changes or separate clock.
- Full redesign of the inherited fixed-fee freight mode, authentic global supply chains, cash shortfall recovery and historically validated commercial rates remain future work.

### Verification
Focused current-source V8 execution against the actual fetched JavaScript was performed for:
1. `tests/merchant-navigation.cjs` (existing chart, routes, old cargo delivery/receipt).
2. `tests/merchant-route-quote.cjs` (existing non-mutating freight/Federal Electric dispatch quote).
3. `tests/merchant-physical-trade.cjs` (new cash-backed cargo purchase, finite stock, one arrival and deliberate sale, saved profiles).
4. `tests/merchant-trade-risk.cjs` (real deterministic insured vessel loss, independent cargo/hull claims, no cargo sale after loss, no repeat claims).
5. Passenger source travel regressions are unchanged, but full Ubuntu gameplay still requires validation.

**Limitations:** The full native Node suite `node tests/run-all.cjs`, an Ubuntu Electron GUI walkthrough and the owner's installed executable **have not been verified** for this source snapshot. No hosted Actions, expensive compute, executable, local backup, accepted snapshot or release tag has been created. See [ROADMAP.md](../ROADMAP.md) for the outstanding acceptance checks.
