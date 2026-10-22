# Three lives in one Washington
Date: October 21, 2026
Status: Proposed route framework, not three complete campaigns.

> Federal Electric is the company you own.  
> Washington is the world you inhabit.

## 1. Businessman / Tycoon (current playable character)
- Owns and operates Federal Electric. Starts in the factory office and uses the currently approved fixed paper doll and a personal Capitol Hill home.
- Can grow into investment holdings, real estate, clubs, transportation, other enterprises and the potential Blackwood Asylum venture.
- Existing main game and saves remain intact.

## 2. Police / Private Eye (future)
- Distinct character with a different entry story; consider police department assignment versus independent investigator as meaningful occupational choice.
- Cases, testimony, interviews, reports, locations, evidence chain and how to handle conflicts of interest.
- Uses the *same* Washington buildings, clubs, streets, institutional actors and world calendar, but not the industrialist's personal factory bank account.
- Exact protagonist identity, first case and paper doll not yet approved.

## 3. Criminal / Outlaw (future)
- A separate criminal story potentially covering bootlegging in later eras, protection rackets, theft, cheating, illegal gaming and law-enforcement pressure, with stable consequences and interpersonal memory.
- An optional darker **serial-killer thriller story** is a narrative possibility, *not* the required criminal path and not confirmed for the game.
- Investigation, capture, consequences, and non-glamorized serious wrongdoing belong to this kind of story.
- Exact identity, start year, initial situation, and paper doll not approved.

## Shared world principles
- One city registry, numbered pins, clubs, historical research database, clock engine, building and venue layers, opportunity gating and event scheduling.
- Each separate **profile has one unique character and one forward-moving autosave**. Choosing a different character is a new campaign, not a reload point. Existing three-profile limit need not mean only one profile per archetype.
- The *world design* is shared. Independent profiles are **not** already a multiplayer or synchronized common simulation: their saves are intentionally separate.
- A location may present a tycoon with a business prospect, an investigator with a witness, and a criminal with a risk, all without multiplying the underlying map.
- A distinct paper doll and wardrobe must be approved for each future protagonist. Do not substitute the businessman's picture.
- Design character-specific relationships and knowledge of events, not universal shared unlocks or wealth.

## Current state (v0.6.14)
- Route catalog has exactly three entries.
- Existing profile creation clearly labels the playable **Businessman / Tycoon** and displays the other two as coming later. Their selection is disabled, rather than sending players into a factory story under another name.
- Existing save files without a route are interpreted as **industrialist**. No rewrites to current stories or images.
- The serial-killer branch is **proposed only**, and its scope requires another explicit design decision.


## Autonomous other lives (v0.6.15)
- While the industrialist is selected, the non-selected **investigator** and **criminal** follow seeded trajectories and periodically trigger saved milestones. The reverse will be supported when their routes become playable.
- An organized-crime rise, petty-theft career, or series of unsolved deaths are **alternative** story paths, not cumulative guarantees. Investigators have separate career, political or corruption paths.
- What the game engine knows and what the player knows are distinct. Newspaper reports show only public facts and may describe suspicions, never silently reveal the hidden culprit's identity.
- Events are saved by turn and not rerolled by opening the paper. Outcomes will later affect shared institutions, venues and NPC responses.


## Public reporting interface (v0.6.21)
The Metropolitan Ledger now has a persistent published-dispatch strip using only the autonomous actor simulation's already-public records, with game dates or a legacy turn fallback. Private actor IDs, hidden paths and unreported behavior are not emitted to that display. Future investigations can corroborate or contradict what people read, and reporting need not equal truth.


## Registered physical whereabouts (v0.6.24)
Unplayed criminal/investigator story figures now have a stable current **registered location** each game turn in the selected profile. Room interfaces may display a neutral visitor observation if the player is in the same place. This does not automatically mark the figure as the culprit, reveal their name, or make an illegal contest accessible. Future character/encounter mechanics will decide whether the player can identify or interact with them. This is distinct from live multi-user simulation.
