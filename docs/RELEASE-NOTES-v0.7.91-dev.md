# Capital & Consequence · v0.7.91-dev

## Whitcomb Family Loan, British-Egyptian Background, Real Minority Ownership and Creditor Consequences

**November 2, 2026 · Source development. NOT a released or accepted Linux executable.**

### Owner approval implemented
Charles Whitcomb has an **Egyptian mother** and a **British father**, a former British serviceman whose military career occurred **outside Egypt**. His father later established an affluent **overland** trading and warehousing enterprise in Alexandria rather than a merchant shipping fleet. Stern, methodical and sparing with praise, he loves his family but regards the American opportunity as a commercial investment. His father's and mother's given names, regiment, religion, Charlie's birth date and any playable Alexandria opening scene are **not** invented. Britain's military occupation of Egypt was in **1882**, so it is not retroactively used as the reason for the family arriving before the 1878 campaign.

The family paid to establish Charlie's **already existing** modest Washington electrical-component works, property and opening working capital. This source build **does not duplicate or mint that historical founding money**.

### Initial family equity and real corporate integration
- Initial cap table now has **10,000 issued voting shares**: Charles **7,500 (75%)**, his father **2,500 (25%)**. The shares are genuine non-tradable original private holdings, not part of the ordinary FEC public float.
- On company incorporation, the father has a **designated investor board seat** while his retained shares represent at least 15% of total voting power. Other outside directors remain subject to legitimate shareholder election. Board decisions, family voting influence and company presidency are separate mechanics.
- The actual IPO prospectus and commitment preserve the father's 2,500 shares as part of the **issued share count**; creating new public shares dilutes both father and son by the same denominator. Charlie cannot sell his father's stock in a secondary offering. No unearned father shares or founder payments appear at listing.
- The existing public dividend system credits Charlie's actual percentage to his personal cash and records the father's actual dividend portion in the **family investor's separate account**, rather than giving Charlie 100% of dividends.
- The existing corporate and IPO regressions were updated to assert the new **explicitly authorized 75/25 original ownership**, rather than weakening their required accounting and anti-double-issue checks.

### An independent, secured monthly loan
- New `whitcomb-family.js` owns the **per-profile historical loan account**, not a competing money clock or a loan with free starting cash.
- **Initial game-balance terms** are a $7,500 loan with 4% nominal annual interest charged at 1/12 each month and a **$45 monthly installment**. This was a *proposed balancing example*, now implemented provisionally at the owner's request, **not a researched legal contract**. Original date January 2, 1878, first bill February 2.
- A saved invoice records **actual interest** and **principal** due. On February 2, the first $45 bill consists of **$25 interest and $20 principal**. The next month's interest reflects the remaining principal. Interest is not silently charged on top of already overdue interest.
- Charles may pay any **positive part of a genuinely overdue invoice** from the **executive office** during normal gameplay. The payment debits real **company cash**, updates the existing component-workshop treasury, settles interest first and principal second, records a dated receipt and **cannot repeat with the same token**. A dismissed company president cannot authorize another cash withdrawal.
- No automatic deduction, free handout, fabricated creditor share sale, loss of owned personal stock, or idle clock advance is made. The player must manage payment decisions using the existing Washington world calendar.
- Repeated overdue months generate recorded formal letters, a warning and demand, followed by eventual secured factory **receivership/foreclosure** after six consecutive past-due cycles. The family severs its support and disowns Charlie. The original equity/shareholder ledger remains truthful, but he **loses management authority** over the factory. The playable character and his personal property do **not** disappear. Genuine new employment, settlement and factory recapture branches require later game design rather than fake instant options.

### Visible gameplay
- The existing Corporate Affairs panel now shows the full lender account, installment/interest split, next due date, father's separate voting shares and family dividends.
- Paid installments are available through the same existing corporate action-time gateway. Real lender letters appear beneath financial details.
- Charlie's existing page-turning **Business Ledger** now contains family financing, share ownership, payments and correspondence, without granting Edmund, Sam or Eli Charlie's private financial knowledge.
- The new `tests/whitcomb-family.cjs` exercises January financing, February invoice, partial/valid/invalid payments, shareholder elections, charter, proposed and completed IPO, dividend split, saved duplicate protections, book privacy, and six-month foreclosure.
- `tests/corporate-governance.cjs` and `tests/ipo-prospectus.cjs` now test the authorized shared ownership.

### Scope and unfinished work
- No Alexandria location, playable introductory vessel, extra Washington map pin, new shipping corridor, named father, new romantic interest, religion, port honor mission, NPC family AI, lender-office building or other unauthorized story was invented.
- Other approved character opening directions (Edmund in London, Sam in southern Africa, DC-born Eli without a voyage) and separate port-honor mission ideas are retained as lore/planning, **not falsely marked physically implemented**.
- The original Washington and EcoClipper images, manual map edits, all other player careers, 1878 factory production, streetlighting contract and late-1878 Fair chronology are unchanged.
- The family can hold a legally protected investor board seat; whether Charlie can eventually repurchase shares, negotiate a restructuring, return to management, work for another firm or reconcile with the family are **future branching features**, not already playable.
- Provisional loan amounts, voting thresholds and creditor enforcement are game design values, not historical legal conclusions. Nothing is promised about legal enforceability in actual Egypt, Britain or Washington of 1878.
- Current verification: **focused module-level V8 regression** and source syntax checks. **Complete Node `tests/run-all.cjs`, Ubuntu Electron interaction/playthrough, owner acceptance and compiled playable binary remain unverified**. Hosted Actions and billable compute not requested for this source-only change. No tags/releases, binary download or automatic browser windows.
