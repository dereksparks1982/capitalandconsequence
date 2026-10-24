# Washington Sports, Championships and Government Gambling

**Planned integration, October 24, 2026.** These rules supersede proposals that every poker room should host a tournament, or that unsanctioned cards are legal. Existing racing, poker and fighting prototypes are not yet the full championship engine.

## Government permits determine gambling legality

**Legal gambling exists only where the District government has affirmatively authorized the specific activity and venue.** Authorization can specify permitted game, event or tournament, dates, eligible participants, bets and licensing conditions. Everything else remains unauthorized regardless of participant wealth or venue prestige.

| Venue | Normal activities | Gambling law in the game |
| --- | --- | --- |
| **Boiler Room / Neighborhood Game** | Working-class regular poker; many social groups and races represented | **Unauthorized** ordinary cards; liable to raids |
| **Commerce Club** | Private middle-class regular poker | **Unauthorized** ordinary cards |
| **Embassy Room** | Private, restricted high-stakes regular poker, wealthy political/social patrons | **Unauthorized** ordinary cards |
| **Star Club** | Meals, drinks, companionship, musicians | **Absolutely NO CARDS or gambling** |
| **Lui's club** | Cabaret, nightlife, private decadence | Any hidden wagering is **unauthorized** unless separately licensed |
| **D.C. Poker Challenge**, dedicated venue TBD | Formal **five-card** tournament only | **Government-sanctioned** five-card play **solely while participating in the approved tournament** |

The existing three poker venues are **not** converted into constant tournaments. Other private poker may continue at its usual clubs but is **not legalized by this system**. Do not assume Texas Hold'em is legalized merely because the current `poker.js` implements it. The D.C. Challenge's detailed five-card variant must be selected before implementation, rather than silently treating all variants as equivalent. A government permit is a **fictional law of the alternate world**, not a statement about actual 1878 D.C. laws.

## Monthly competitive titles

A shared competition layer should track tournament ID, sport, month, event schedule, competitors, qualification and standings, pending/results, government permits, the current **D.C. champion**, former titleholders, winning streaks, record ledger, persistent wagers and payouts. Competitions:

- **Horse racing:** daily/regular meetings plus meaningful heats, semifinals and monthly championship; win/place/show, heat winner, qualifiers and outright champion.
- **Boxing:** ordinary scheduled bouts plus elimination/championship card, local rankings and titleholder; bet on bout or tournament outcome subject to authorization.
- **Dog racing:** ordinary heats and full championship season, not a single identical daily card.
- **Midget car racing:** registered **12 named drivers** and their cars; motorsport tournament **not present in 1878**. Proper future era gate needed.
- **Poker:** three normal social clubs. **One separate** formal D.C. Poker Challenge venue for approved five-card tournament brackets/final table; no automatic transformation of all rooms.
- **Private fights / underground competition:** may have an **unofficial** underground champion, but a title does not magically legalize gambling or acts of violence.

Individual races/fights/cards occur outside monthly championships and can contribute toward qualification. The player can **follow standings and predict champions before the final**, without every day repeating identical random events.

## Wager and payout integrity

Offer sport-appropriate markets: individual heat, race and bout winners; win/place/show where appropriate; qualifiers, later rounds, championship final and outright champion. Every wager stores **event ID, market, selection, captured odds, stake, placed time, location, authorization status and final settlement**. Funds deducted **exactly once** from personal cash. Results close markets; payouts occur **exactly once** on actual qualifying results. Failed, canceled, void or unauthorized outcomes require explicit deterministic handling. Do not permit bet placement after knowing a result or duplicate settlement on reload. Taxes/permit fees or penalties apply only after game-world rules are specified.

## Sources and source status

Current `poker.js` is **Texas Hold'em**, with named Boiler Room/Commerce/Embassy opponents. Current `oval-racing.js` creates dog and midget-car meetings on **every game date** with two heats and a final and retains some form; `racing.js` has horses and jockeys; `boxing.js` and `underworld.js` have named fighters. All need integration, shared championship progression and persistence. Do not call the monthly title or separate five-card tournament already playable until tests and UI verify it.

### Existing driver names

**Eddie Marsh, Tom Vale, Ray Collins, Frank Dwyer, Sam Burke, Johnny Hale, Mickey Dean, Arthur Cole, Bill Mercer, Lou Grant, Harry Webb, Joe Pike**.

## Implementation slices

1. Immutable **government gambling authorization registry**, permission checks, source tests. Never authorize unsanctioned poker.
2. Persistent **tournament/rankings ledger**, start/date/qualifier/result lifecycle, titleholder continuity and save-safe settlements.
3. Connect **existing sporting results** to monthly standings and brackets; avoid daily duplicate events and delay motor racing until correct era.
4. Build D.C. Poker Challenge's **separate venue and five-card engine** after choosing precise game variant. Existing three venues still offer regular social poker.
5. Bet selection/odds interface, championship lists and results archive, cash tests; venues/room access, clock, NPC routines and government enforcement.
6. Integration testing and owner's desktop playthrough.

The player may legally bet only where specifically permitted; **outlaw games may be available but remain risky**. An authorization should apply narrowly to that government-approved event, not retroactively exempt the entire venue.
