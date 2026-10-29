# Capital & Consequence v0.6.96-dev
## Stacked source checkpoint: verified provisions and resident consequences

This checkpoint builds on v0.6.95 without changing the Washington map, approved office geometry, playable characters, or financial ownership rules.

### Connected changes
1. Paid market receipts now create specific unconsumed provisions for eligible food goods, distinct from generic household spending and purchase totals.
2. A resident present in an actual meal routine can use a purchased provision. Travel, absence, duplicate calendar processing, past-dated food, or zero provisions do not grant a meal. No new bank or market charge occurs.
3. Verifiably purchased meals modestly relieve the resident's hunger, improve mood, increment verified-meal counts and annotate the existing 14-day daybook when that date is available. Routine meal periods are still recorded separately and are NOT equivalent to receipt-backed consumption.
4. The resident's private planning observes food pressure from their individual hunger and actual remaining provisions. High food pressure modestly reduces willingness to pursue social interaction. This does not manufacture an employer, groceries, or a new destination.
5. Consumed meal history is bounded; outstanding purchased supplies remain traceable to receipt IDs.

### Test evidence
Focused isolated V8 runs of the existing NPC household-receipt and NPC agency source tests passed after the modifications, including same-key replay, receipt-date rules, no free food after exhaustion, and food-pressure social differences.

The full offline Node suite and real Linux Electron gameplay have NOT been run. This is a source checkpoint for stacking, NOT an accepted release.

### Explicitly unfinished
- Historic consumption quantities, perishability and diet requirements.
- Full NPC household budgets, genuine supply runs, and purchased household facilities.
- Measured NPC travel routes and full chronological skip reconciliation.
- End-to-end runtime testing with the existing Linux installation.

### Delivery
Do not create an install ZIP yet. On the owner's request, use the existing changed-files-only `apply_delta.py` patch workflow from a verified pinned GitHub commit.
