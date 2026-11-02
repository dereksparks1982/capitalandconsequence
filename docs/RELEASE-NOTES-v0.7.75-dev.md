# Capital & Consequence v0.7.75-dev | Real patrol property custody
November 1, 2026. Source-only development, not a released or accepted Ubuntu game.

## Roadmap delivery
Sam Harlan's existing Hillsdale foot patrol now generates a physical police property record **only** when the actual `lost-property` encounter was rolled and Sam chose custody. Merely recording a finder statement does not conjure an object, an owner, a defendant, a crime, or an arrest. The original incident and its contemporaneous date and location are the source of truth.

After the saved patrol report is filed at the actual Metropolitan Police duty room, Sam can carry out three additional realistic administrative actions: sealing the unidentified item, recording an identification check, and transferring the item to the property clerk. Every action requires the police career, on-duty station room, game date and real five-minute action charge, and leaves its own saved chain-of-custody entry. Transferring without inspection and sealing is refused. Once handed to the clerk, the item cannot be transferred twice. The owner is *unknown and unverified* in all saved records.

The station register is embedded in the existing patrolman duty-book panel and uses textual, bounded history, without a second map, made-up NPC identity or automatic detective authority. Existing patrol incidents, beat restrictions, commendation state and other character storylines remain unchanged.

## Verification
Executed focused V8 tests for a deterministically generated actual lost-property incident, a witnessed statement instead of physical custody, original report filing, absence of pre-filed station intake, exact time charge validation, sealing, inspection, audited clerk transfer, duplicate receipt protection, illegitimate character/room access and safe reload. Related patrol regressions and native gameplay need separate validation. No GitHub Actions or packaged release.