# 1878 Federal Electric component-works foundation · v0.6.62

**Status: tested source module; NOT connected to the live 1890 profile factory or a validated 1878 new game.**

The current historical-factory retrofit cannot safely consist of changing `CAMPAIGN_START_DATE` alone. `app.js` contains a bulb-first contract pipeline, tungsten/carbon filament purchasing, working-day timing, delivery lots, starting contracts, recurring lighting sales, newspapers, wages, stock quotations, starting material inventory, and a version-15 save schema. Those assumptions remain live for preserved 1890 campaigns.

`component-works.js` adds a separate, offline, deterministic factory transaction engine. All component stocks and payments use integer units and integer cents. Available preliminary products are telegraph keys, relays, switches/contacts, insulated wiring lengths, insulators and battery fittings. Company starts under the proprietor's `industrialist` route and uses only one bounded, established company cash account. Explicit accepted customer orders, supplier procurement, assembly and warehouse shipments record persistent unique action receipts. Completed production **does not imply shipment**. Materials and assembly labor are debited only after full preflight validation; cash is credited only upon shipment. Reload/replay of an already-used transaction token cannot duplicate a job, finished stock or money.

Early historical facts need further period research. **Recipe inputs, tool classes, customers, prices, wages, output times and balances are provisional GAME DATA, not authenticated 1878 industrial records.** The experimental future incandescent lamp is *not* eligible on January 2, 1878. Reaching 1880 alone is insufficient: a separate license and lamp-line station are also required. These deliberately conservative locks do not assert an exact historical first-sale date.

## Not yet wired

- `app.js` still opens **1890** and operates its existing bulb line. No silent old-save migration is attempted.
- This module's `minutesCommitted` is **production time due**, not proof an authoritative world-clock debit occurred. Runtime integration must charge through one shared world-time transaction and never double-charge.
- New 1878 player profiles, UI, company money initialization, component order offers/customer letters, competition, workforce/payroll, factory production over time, fair milestones and newspaper events remain separate integration slices.
- Product-specific historical sourcing, machine limits and period price realism must be reviewed before calling the 1878 conversion finished.

## Next safe source slices

1. Create a robust two-lane old-profile/new-profile schema gate with explicit date and catalog selection while preserving historical 1890 saves byte-for-byte where possible.
2. Wire component `accept → assemble → warehouse → ship` into Charlie's actual factory panels with the same time service, accessible controls and save transactions.
3. Replace bulb-only material/contract rendering and legacy standing sales in 1878 mode only; keep 1890 legacy unaffected.
4. Gate research and licensing, then test major 1878–1893 career milestones and competition before switching the live new-profile opening.
5. Only after test and player validation treat 1878 as a playable complete opening. No executable created by this source work.
