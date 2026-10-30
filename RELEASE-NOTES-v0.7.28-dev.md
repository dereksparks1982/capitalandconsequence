# Capital & Consequence · v0.7.28-dev

**Status:** Development source commit directly to `main`. No GitHub Actions, packaged Linux binary or accepted release.

## Cash & Accounts
- Factory cash UI appears only in the Executive Office, and bank accounts only at the Banking Hall teller.
- Transactions verify the saved player's room as well as building, preventing handling from Sullivan's rented room, receiving office, production floor, stable, break room and bank vault.
- Stale financial handlers are cleared when changing rooms or previewing developer locations; desk owner draws are limited to the Executive Office.

## Break Room
- Added an employee-only factory room without altering the original Washington map art, existing pins or their positions.
- Coffee Break buttons navigate using existing room movement and its one-minute cost.
- A ten-minute break, coffee, tea, biscuit and water advance game time; purchases deduct personal money and enter saved journal/history. Visitors use normal NPC schedules, with no fabricated staff appearances.

## Testing
- Updated source regression tests for cashier rooms, bank vault, and employee access. Full Node suite and Ubuntu Electron UI have not yet been run.
