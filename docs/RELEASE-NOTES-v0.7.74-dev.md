# Capital & Consequence v0.7.74-dev · Supervised production office
**November 1, 2026 | Source-only development, NOT accepted Linux release.**

## Features
**Production priority:** a read-only queue initially sorts real unfinished Federal Electric, District streetlighting and World's Fair bulb orders by existing due date. Charlie can raise a real unfinished job to the front for 5 game minutes; priorities persist with the existing component workshop, without changing a customer's actual deadline or creating a new order.

**Delegated manufacturing:** one explicitly authorized supervised 1–4 hour specialist shift manufactures only the quantity that fits the chosen duration and the remaining time before the factory's 5 PM close. Each job must have paid, hired specialist staff *and* corresponding fitted second machinery, while the separately licensed/upgraded bulb line must have its existing two bulb specialists. Sullivan must be physically present and workshop repair incidents cannot be ignored. The existing source-of-truth Component Works `assemble` method removes raw ingredients, counts produced goods by order and warehouse, applies lamp scrap, and records durable receipt tokens. The authoritative Washington clock advances exactly for attempted factory units. No production runs on the desktop while closed or during unrelated travel.

**Whole-order queue requisition:** all unmanufactured accepted orders contribute actual recipe inputs to a shared material plan. The forecast subtracts current shared factory inventory and quotes unit costs from the existing catalogue. A single valid cash-backed purchase uses 15 game minutes, buys exactly the shortage once and cannot manufacture or ship products, award municipal contracts or grant free raw stock. The previous per-order purchase controls still operate unchanged.

**Factory operations:** the existing Component Works screen now shows active jobs, deadlines, open raw-material shortages, projected manufacturing minutes, hypothetical invoice proceeds (not credited as real cash), existing specialist wages, and eight latest source receipts. Ordering is persisted only on a real action; rendering the panel never changes the save or advances time. Text is inserted with safe `textContent` DOM methods.

## Protected scope
The owner-approved 1878 component-business start, earlier District streetlighting tender, subsequent bulb technology and late-1878 Washington World's Fair remain untouched, as do permanent map art, all 42 pins, four protagonists, existing payroll, investment balance, physical orders, NPC arrival rules, repair effects and original location access.

## Verification
Focused tests cover deadline ordering, priority replay safety, bundled raw-material buying, absence of automatic revenue, paid specialist/machine qualification, bulb gating, inability to bypass Sullivan or an unresolved repair, factory hours, save-backed clock advances, output limits and shipment constraints. Full offline Node suite, packaged Electron runtime and Ubuntu playthrough **have not been run**. No GitHub Actions, release tag, executable or owner acceptance.