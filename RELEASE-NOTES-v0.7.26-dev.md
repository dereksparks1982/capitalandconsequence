# Capital & Consequence v0.7.26-dev — Corporate Control

**Status:** Unaccepted development-branch source. Not a release, installer, or Linux gameplay certification. October 29, 2026.

## Federal Electric corporation and governance

- Charles Whitcomb starts as the sole private owner. He can optionally incorporate at Federal Electric for a recorded $75 company expense.
- Incorporation creates 10,000 voting shares owned by Charles, a three-person board, and a company president. The historically appropriate in-game office is **president**, not a modern chief-executive title.
- Directors have named records, distinct temperaments, relationship scores and time-consuming meetings; shareholders can elect replacement outside directors if they command enough voting shares or pledges.
- Directors vote on IPO authorization, dividends, and Charles's reinstatement. Loss of director confidence or an acquired hostile majority can produce an actual recorded removal vote.
- Removal from the presidency does **not** confiscate shares. Management access to the 1878 component workshop, material transactions, owner distributions and diverted company funds is blocked while Charles is dismissed.
- The corporate minute book keeps dated corporate events and board resolutions instead of truncating to a short rolling list.

## Underwriting and securities

- Federal Electric can list on the fictional Federal Exchange as **FEC** after its board authorizes an offering, the broker has received two separate-day visits, company records show four closed business days, reputation is at least 50, and $750 of operating cash remains.
- The founder chooses newly issued shares, secondary founder shares and a reasonable price within the underwriter's company-valuation range.
- Newly issued shares produce company treasury proceeds; secondary shares produce personal proceeds. Underwriter charges 5% on either.
- An actual FEC share entry is added to the existing broker's list, portfolio and historical quotations. Purchase and sale instructions are still broker-only and constrained by recorded share availability.
- The corporate cap table records issued, founder, personal-brokerage, public and hostile-syndicate shares, with no invented replacements for exhausted float on save loading.
- Close-of-day FEC prices include a limited reaction to real Federal Electric operating revenue, costs and unresolved accounting exposure. There are no invented intraday quotations.
- A board-approved dividend draws on company cash and pays Charles only for his outstanding economic stake, while other shareholder proceeds leave the business.

## Acquisition contests

- Vale and Mercer can attempt a hostile share accumulation if Charles leaves a substantial public float and investor confidence weakens. Defensive shareholder solicitation can delay their purchases.
- A hostile voting majority can elect opposing directors and vote Charles out. Even a majority owner can lose the presidency if his own board turns against him.
- Charles can solicit proxies, replace directors where voting control permits, and seek a reinstatement vote.
- Charles can tender for a majority of other currently listed businesses, elect 0–70% borrowed acquisition finance, increase stakes to 75% and 90%, and conduct a compensated minority buyout after crossing 90% under the game's fictional charter law.
- Leveraged acquisitions carry real recorded debt. Interest accrues as Washington dates advance; Charles can repay from personal funds, while prolonged unpaid debt can result in collateral foreclosure.
- Corporate paperwork uses the world clock, checking remaining working time before a validated action.

## Integration and testing

- New modules: `corporate-governance.js`, `corporate-governance-ui.js`.
- Updated: `app.js`, `index.html`, `component-works-live.js`, `package.json`, `README.md`.
- New executable regression: `tests/corporate-governance.cjs`. A JavaScript sandbox execution verified 43 assertions across IPO accounting, market float, tendering, minority buyouts, a hostile majority, independent director dismissal, and persistence of ownership; additional focused interest/repayment checks passed.
- **Pending:** Full local Node suite, Linux Electron smoke test with navigation between desk and broker, repeated save/reload, and playable management lockout. This source is not yet accepted.
- **Further depth:** Board directors currently have saved identities and relationships, but not fully scheduled physical NPC lives; leveraged-acquisition cash flows remain simplified; shared-world business ledger reconciliation across all four playable characters is not yet proven in Electron.

**Project rules maintained:** no GitHub Actions, no release, no alteration of `main`, no replacement of the original Washington map art or pinned UI map geometry, and no ZIP published before acceptance.
