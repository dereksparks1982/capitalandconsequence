# Medical Records, Exhaustion and Factory Emergencies
**Capital & Consequence · 1 November 2026 · development rules**

## Accepted gameplay rules
- Character Energy begins draining from actual awake/game time. It is separate from long-term accumulated exhaustion. The clock must never run while the game is closed.
- Coffee, snacks and breaks can restore some Energy but are not substitutes for proper bed rest. Coffee is still constrained by existing cooldowns and personal-money payments.
- Health, Hunger, Thirst and Energy remain visible in the existing condition strip. The map/interior status banner uses **two information rows above the existing condition strip**. Do not alter approved map art, pin positions or interior geometry.
- At zero Energy a collapse is recorded, with a character-specific permanent medical entry. It cannot be spammed, bypassed with another action or erased by an ordinary save/load.
- **Home:** pass out; wake on the floor after lost time with only enough Energy to reach a bed; no doctor or hospital fee.
- **Work:** colleagues stop to help. The factory, for Charles, actually stops producing during the emergency; staff remain entitled to normal wages. The company pays for a summoned physician. No fictitious output or profits are deducted twice.
- **Street:** transport to District General Hospital, lost time and personal medical bill.
- **Dangerous neighborhood:** same emergency medical transport and a deterministic possibility of lost carried cash or possessions. Do not invent ownership of items the character does not have.
- A physician summoned to Federal Electric is cheaper than hospital emergency care. Initial **game-balance** charges: factory call $4.00; emergency hospital $12.00. These are NOT verified historical fee quotes. More expensive overnight and inpatient treatment remains future balancing.
- Two collapses within seven days cause recurring exhaustion; three within fourteen days cause severe accumulated exhaustion. Severity limits next-morning Energy to 80 or 65 until consecutive distinct recovery nights, and lifetime collapse counts remain on the record.
- Every named resident and player can have a private medical file: dated episodes, treatments, doctor fees, unpaid charges and other observed events. The player's interface shows only the player's own record. NPC privacy must be maintained; mistakes or deliberate alteration are future story mechanics, not automatic false medical history.
- A calendar advance to morning is **not** sleep. To restore Energy, visit the home bedroom after closing bell and explicitly sleep. Alternative paid lodging elsewhere in Washington is planned; there are no invented inns, prices or routes in this build.
- Characters may be discovered by different parties at different workplaces. The real company ledger must never be charged for another playable character's employer.

## Implemented in this development pass
- Two-row persistent map/interior information banner; untouched four-condition meters.
- Saved medical registry under `S.medicalRecords`, individual player and named NPC entries, private own-record book opened from **Health** on the condition strips.
- Zero-Energy event; one pending emergency at a time; on-screen regain-consciousness action; real simulation advances during unconscious time.
- Location-aware home/work/street/danger consequences. Street and dangerous-neighborhood cases move to existing District General Hospital reception **only after** the episode, not as free navigation.
- For the 1878 owner at the factory: personal Energy triggers a real production hold while the current simulation clock advances; counts only staffed/open hours. Doctor charge debits company cash and the existing factory cents ledger. Production isn't charged as an additional imaginary dollar amount.
- Actual bedroom overnight recovery; morning time skips by themselves do not restore Energy. Normal meals and hydration remain independent of sleep.
- Separate NPC records seeded from the named city registry and NPC schedules; no omniscient access or made-up diagnoses.
- Focused regression files: `tests/medical-records.cjs` and `tests/character-bed-rest.cjs`.

## Pending before release acceptance
- Full native Linux desktop UI smoke and exhaustive local 195+ regression suite. Do not claim acceptance, tag a release, publish a binary or run GitHub Actions until tested.
- Map/room modal visual checks at small resolutions; bed control and Health link should not interfere with X, map, pin placement or room navigation.
- Alternate lodging and career-specific residences: Sam's Blacktown home, Elias's lodging, Edmund's room/ward, inn and hotel prices, medical access controls for police investigations and asylum paper trails.
- Employer-specific emergency payroll and administrative bills for Sam, Elias and Edmund instead of using Federal Electric accounts.
- Production reporting: real lost manufacturing throughput and any order deadlines from actual open-clock hours, plus superintendent delegation rules.
- More detailed long-term conditions, repeat hospitalization and physicians' case notes, including fraud, paper evidence and discoverable changes.
- Physical NPC injury/exhaustion event integration and hospital/physician encounters. Empty NPC files do not claim everyone has already been treated.

## Guardrails
One saved world clock; existing financial ledger; no clock or money manufactured by redraws; no new map or changed art; no GitHub Actions; local source review before any acceptance or packaging. No executable is delivered by this document.
