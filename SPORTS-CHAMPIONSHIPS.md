# Washington Sports, Championships and Government Gambling

## October 24, 2026 · Club membership and underground-fight correction (supersedes earlier design)

**Being invited to the Commerce Club or Embassy Room is only the right to play a trial game, not automatic membership.** The first match is observed. Good conversation, restraint when winning, polite manners, spreading money around and tasteful hospitality matter; a crude or greedy player may be told not to return for a **short cooling-off period** and then permitted another trial. Gaining acceptance should be fairly easy if the player is respectful. Membership is **gifted as a physical personal item**, notably the **Embassy Club Membership Card**, recognized as a powerful social credential. Commerce Club has its own membership card; the open, mixed-class and mixed-race **Boiler Room requires no invitation or membership**. This is distinct from the **unrelated government-authorized D.C. Poker Challenge**.

**Licensed boxing** is a championship **tournament** that runs through the needed weeks, potentially across calendar months. Do not award a champion arbitrarily merely because the month ends. **Underground fights are absolutely NOT tournaments:** there are no brackets, rankings, champions or title defense in the fight-club brotherhood. The volunteer fighters on a given night are whoever decides to fight, with no promised rematch, and yesterday's victor may lose today. Friendships, mutual respect and social trust from the brotherhood can continue, but fight results do not create rankings. **No underground sport gets a tournament system**, including private fighting.

All other approved competitions are distinct from unlawful spontaneous underground activity. Government permission remains the only source of *legal gambling*.



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
- **Private fights / underground competition:** **no tournaments or champions**, spontaneous volunteers on any given night. Relationships can persist; fight scores never create a title.

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

## Current sports integration: kennel and motor titles

Dog races and later-era midget car races have **regular meetings**, and the **last Sunday** of a month additionally serves as their D.C. championship day. The existing two heats and feature final determine the title; outcomes are recorded in the same per-profile champions ledger as boxing and horse racing. The racing calendar does **not** produce matches in 1878 for either modern sport. The separate tournament-wide betting screen and legally permitted bookmaking are still not implemented; normal wagers do not become legal merely because a championship was staged.
