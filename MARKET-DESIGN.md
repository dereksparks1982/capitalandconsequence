# Federal Exchange — Market Design

## Purpose

The Federal Exchange is a personal-wealth, information, and eventually corporate-ownership system orbiting Federal Electric. It should feel like a 1938 market rather than a modern electronic quote screen.

## Authoritative market rule

- The market continues moving internally during the active Business Day.
- The player sees the **published opening quotation** throughout the day rather than watching a live intraday ticker.
- Hidden market movement continues to use broad-market, sector, and company components.
- At the closing bell, the hidden final quotation is revealed as the day's close.
- That close becomes the next business day's opening basis.
- Closing/hiding the app freezes the simulation. There is no offline catch-up.
- Exact state is autosaved.

The information limitation is intentional: the market is alive, but the player does not have a modern computer displaying every tick.

## Current universe

v0.3 carries 50 fictional common-stock issuers across Automotive, Aviation, Banking, Chemicals, Communications, Consumer, Electrical, Food, Machinery, Mining, Petroleum, Railroads, Retail, Shipping, Steel and Utilities.

Federal Electric is **not quoted at game start**.

## Current trading

- personal cash only
- arbitrary positive whole-share quantities
- Buy, Sell, and Sell All
- no arbitrary game-imposed investment ceiling
- average cost basis
- unrealized and realized profit/loss
- commissions
- transaction blotter
- dividends

The current commission and execution model remain gameplay scaffolding pending historical research.

## Information and execution

The displayed opening quotation is the player's published decision reference during the business day. Hidden intraday movement must not leak through the UI in a way that lets the player read a modern live market.

Future broker, newspaper, telephone, ticker, delayed-quote, limit-order, and execution mechanics should be researched before they are represented as historically authentic.

## Strategic ownership — planned

Shares eventually represent actual fractional ownership rather than functioning only as investment counters.

Later public-company mechanics may include:
- finite shares outstanding
- player percentage ownership
- large-holder and insider relationships
- board influence
- strategic stakes
- friendly acquisitions
- hostile control attempts
- merger proposals
- competing bidders
- financing requirements
- dilution and new issuance
- historically appropriate disclosure and antitrust consequences

The goal is to turn large holdings into occasional major corporate decisions and event chains, not continuous legal/accounting micromanagement.

## Federal Electric IPO — planned

Federal Electric begins private and may remain private forever.

If the player chooses an IPO, later systems will track founder ownership, public float, major shareholders, board composition, voting control, dilution, additional offerings and buybacks.

Going public can raise capital and create a market for FE shares, but it also creates genuine risk:
- the founder's voting percentage can fall through sales or dilution
- outside investors can accumulate meaningful positions
- coalitions or proxy contests can threaten board control
- losing sufficient voting influence can eventually make removal possible

Personal cash, Federal Electric corporate cash, and the founder's personal FE shares remain separate.

## Research queue

Before deeper market/control systems are treated as historical mechanics, verify:
- 1938 quotation and ticker practices
- broker order handling and execution delays
- commissions
- margin/leverage rules
- exchange disclosure
- beneficial ownership reporting
- proxy solicitation
- corporate merger voting rules by state of incorporation
- takeover practice before the later Williams Act framework
- antitrust limits on stock acquisitions and mergers
- dividends, preferred shares, bonds, splits, suspensions, bankruptcies and reorganizations

## Expansion

- researched historical market regimes
- high/low/volume and price history
- fundamentals and earnings
- preferred shares and bonds
- limit orders and delayed execution where appropriate
- brokers, tips and rumors
- historically appropriate leverage/margin
- bankruptcies, mergers, splits and suspensions
- control battles and IPOs
- newspaper financial pages


## First playable day — previous close and security records

Implemented in the current test build:
- every fictional security is seeded with a prior close before the first playable morning
- the opening quotation is compared against that prior close, so the Day column can begin positive or negative instead of universally +0.00%
- later business mornings receive a small opening gap from the prior close, preserving a meaningful Day comparison at the opening bell
- the opening quotation remains the visible trade reference throughout the Business Day; hidden intraday movement is still not exposed
- each security begins with approximately 90 synthetic pre-game trading sessions generated consistently for that ticker
- clicking a company name opens its Security Record with a graph-paper quotation chart and recent quotation ledger
- completed playable business days are appended to that security's saved quotation history

The seeded history is fictional market context for fictional companies. It is not presented as real historical exchange data.


## Implemented development rules (v0.7.31-dev, after the verified Linux baseline)

The founding-era Federal Exchange quotes from **1878** are fictional securities. The player sees published opening and closing prices, never secret intraday values. Orders remain broker-only, except correspondence from the executive office after the required broker relationship is earned.

Federal Electric starts **privately held and unquoted**. Choosing to list requires a $75 corporate charter at the factory, a board vote approving the IPO, four closed company-account records, reputation 50 or higher, $750 in operating cash and two broker visits on separate dates. The owner must submit the actual offer from the broker's office during an active business day.

The interactive underwriting prospectus forecasts, before any cash moves:
- 500–10,000 newly issued shares and any secondary sale from Charles's existing holdings; new shares enlarge the share register while secondary sales do not
- An underwriter-supported offer price between $1 and $25, constrained to roughly 75–150 percent of the displayed fictional valuation
- The exact receipts credited separately to **Federal Electric's treasury** and **Charles's personal money**, net of a 5 percent underwriting charge for each portion
- Total shares issued after the offering, placed public float, Charles's resulting voting percentage and warnings when majority control or a stronger buffer is lost

The completed offering is recorded in the corporate minute book with an idempotent receipt; FEC then enters the brokerage quotation sheet without fabricated pre-IPO prices. Market purchases and sales transfer finite public shares between outside holders and the personal share account. Later directors, proxy relationships, dividends and hostile bids can change who governs Federal Electric. These are **fictional game rules**, not a claim to reproduce every historical federal or state securities law.

The prospectus and UI changes are presently **development source on main**, not a new user-accepted release. The prior packaged Linux smoke run predates this implementation.
