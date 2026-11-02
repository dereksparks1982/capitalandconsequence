# Capital & Consequence v0.7.79-dev | Star Club dining service
November 1, 2026. Source-only development, NOT an owner-tested/accepted Ubuntu release.

## New playable venue action
Madam Eleanor Victoria “Star” Ashcroft's existing **Star Club Dining Room** (location `star`, room `dining-room`) now offers four provisional late-19th-century meals: bread/butter/tea, roast beef/potatoes, chicken/barley broth, and stewed apples/cream. Each costs real personal cents and 15–35 in-game minutes. The character must actually be inside the approved room with available in-world time. The meal closes at the saved phase boundary and does not permit service after the club's provisional 10 PM dining close. Existing travel and admission remain authoritative.

Use the original Character Needs prepared-meal action to restore hunger/thirst and enforce the existing 30-minute meal cooldown. The merchant receipt moves personal cash to the actual WashingtonCommerce merchant account `star:dining` and a save-backed kitchen ledger deducts one of a finite daily number of prepared portions. The allocation and prices are design estimates, not an archaeological menu. No groceries enter the player bag and no unlimited raw food or second currency system is created.

**Protected:** No poker, card games or wagering at Madam Star's club. The Brandy Room remains its own smoking/conversation space. The private office and suites remain restricted as before. No new location pin, furniture or alternate map image. Meals are only a dining room service, not free lodging, favors or access to management. No new NPC biography or scripted relationship result.

## Test evidence
Focused V8 source test loaded the actual food catalogue, commerce, character-needs and Star Dining modules. Passed paid purchases, real needs recovery, saved 30-minute meal cooldown, finite portions, physical room and time restrictions, replay-safe receipts, private save isolation and refusal of unsupported service. Full project Node suite and Ubuntu Electron visual playthrough have not been verified, and this is not an accepted release. No GitHub Actions, installer, tag or owner test request.