# Capital & Consequence | Four Main Campaigns, One Living Washington

**Approved story direction:** 30 October 2026. **Development status:** Main-campaign outlines and first-party milestone tracking, not four finished playable campaigns.

## The mandatory structure

Every playable protagonist has a **long-form main campaign** with an introduction, escalating complications, genuine dilemmas, a climactic confrontation, and divergent outcomes. It is separate from ordinary paid work, open-world activities, optional side missions, and repeatable events. The character must remain free to ignore the main campaign temporarily, earn a living, travel and socialize. The game must never pretend finishing two work shifts is a complete narrative chapter.

The four campaigns unfold in **the same diverging 1878 Washington**. Shared institutional actions, police filings, deals, witnesses, documents and published consequences may change other campaigns, but private notes and unpublished discoveries NEVER teleport between characters. A chapter can fail or become inaccessible for believable reasons; other evidence paths or alternative conclusions must exist for core mysteries. Main-story progress comes only from actual gameplay and verified world facts, not from selecting a page or from a hidden scripted flag.

## Charles Whitcomb | The Current That Built Washington

*Widowed industrialist, proprietor of Federal Electric.*

1. **First Light:** Build a small legitimate components business alongside Sullivan; fulfill real orders, keep workers and suppliers paid.
2. **A Name in the Register:** Seek a charter and business contacts, face moral and financial obligations as owner.
3. **Selling the Future:** Raise capital and attempt an exchange listing, knowing that the founder could lose control.
4. **The Battle for the Board:** Face rival financiers, directors and hostile takeover attempts. Alliances, investment risks and worker relations matter.
5. **The Cost of Progress:** Decide whether the Whitcomb legacy is public electrification, an oppressive monopoly, ruined finances, a worker-conscious enterprise or a company sold to rivals.

**Endings** may include public success, private wealth without control, financial ruin, and a slower independent firm. No automatic happy ending from owning stock. Corporate finances are separate from personal finances. The World's Fair and electrification progress may diverge from historical chronology.

## Samuel Harlan | The Hillsdale Papers

*Married Black patrolman, lives and works in Hillsdale / Barry Farm.*

1. **The Hillsdale Beat:** Serve on foot and earn credibility through routine contacts and filed reports.
2. **A Call Beyond the Beat:** Receive a credible asylum case lead and formal station permission to assist, not an instant detective promotion.
3. **Two Conflicting Accounts:** Work the death scene lawfully, consult authorized staff, compare evidence and take risks to reputation.
4. **The Papers That Changed:** Discover discrepancies in the asylum register and determine what the conflicting institutional accounts actually establish.
5. **Justice in the Capital:** Face a wider web of corruption and a difficult case. Justice, failure, political compromise, career advancement or resignation are all possible without making Sam secretly culpable by default.

**Endings** depend on admissible evidence and decisions, not on the hidden culprit automatically appearing in his notebook. His household, neighborhood and racial discrimination in period society create real stakes rather than a caricature. Side investigations and a serial-murder arc can connect later.

## Elias Crowe | Behind the Golden Peacock

*Single low-ranking doorman at Lui's Le Paon d'Or.*

1. **At the Peacock Door:** Establish his paid routine and discover which guests might be worth knowing.
2. **A Favor with a Price:** Choose between protecting a vulnerable patron and exploiting valuable information.
3. **The Keeper of Secrets:** Follow favors, blackmail, gambling and rival clubs until ordinary work no longer shields him.
4. **Debts Come Due:** Decide whether to betray an employer, a companion, a criminal patron or his own financial interests.
5. **The Last Door:** Escape the underworld, establish his own syndicate, turn informer, disappear or face punishment.

**Endings** must be earned. Eli can be dishonest and use consensual adult partners without automatically becoming an abuser; sex is not a mandatory mission gate. Some actions should open private opportunities but expose him to blackmail and legal consequences.

## Edmund Wardman | The Wardman Inheritance

*Estranged orderly, younger brother of the asylum director.*

1. **The Family Black Sheep:** Work real orderly shifts and learn the institution's existing hierarchy.
2. **A Death in the Ward:** Discover and record the asylum homicide through firsthand evidence.
3. **The Family Petition:** Challenge a disputed register and a possible family attempt to seize control of his life.
4. **The Patient in His Own Asylum:** A family commitment can confine him. His choices, appeals and physical confinement may culminate in release, continued custody, escape or irreversible experimental lobotomy.
5. **Blood and Evidence:** Discover whether the family conspiracy and the homicide overlap, and who has been manipulating whom. His brother must not automatically be the murderer.

**Endings** include emancipation, damaged reputation, reconciled family ties, permanent confinement, exposure of a conspiracy and the harshest fictional medical outcome. Experimental lobotomy in 1878 is deliberate alternate history, not factual medical history.

## Cross-campaign event examples (design, not automatic revelations)

- **A changed asylum register:** Edmund may preserve a copy; Sam may independently certify the conflict. Neither immediately learns the other character's private story.
- **Nightclub visitors:** Eli may meet witnesses who later become relevant to Sam. Sam learns only through an interview, filed evidence or documented contact.
- **Federal Electric contracts:** Charlie may provide lighting to the asylum or city streets, affecting security and opportunities for other characters, when a genuine contract system implements it.
- **Family finances:** The Wardmans may hold industrial shares or clandestine debts, making Charles's market and Eli's underworld relevant without making all plots secretly identical.

## Runtime implementation boundary: v0.7.33-dev

The first **main-story register** records five chapter destinations for each protagonist and a handful of **verified introductory milestones** from existing production, corporate, patrol, doorman and orderly systems. Read-only main-story pages appear in their existing private books. **This does not mean the later dramatic chapters are playable.** The chapters explicitly say when the interactive missions still need to be developed.

Next implementation targets: playable introductory main-story *scenes*, multiple meaningful choices in Elias's club storyline, consequential family and corporate antagonist NPCs, later branch/ending conditions, and integrated cross-character discovery with authored evidence. Design must not alter approved Washington map art, coordinates, existing room geometry, or player-facing career histories to force new outcomes.

Work locally without GitHub Actions; require source test verification before accepting a playable Linux build.
