undefined

## v0.6.51-dev · Washington public contact intelligence (source-only) · October 23, 2026

- [x] Model provisional public next-appearance windows for seven named residents from the *persisted* absolute calendar, including weekend factory/police absence and true overnight periods.
- [x] Add visible, responsive itinerary cards under Journal → Contacts, **only after the active character's first physical greeting**. Private NPC goals, rumors and unpublished knowledge never populate this UI.
- [x] Add a distinctive third face-to-face topic per NPC: *Ask About Washington*. Once-per-date records, capped contact influence and autosaved journal entries; no omniscient testimony.
- [x] Refresh visitor panel without duplicating resident rows, refresh learned contacts on NPC schedule changes.
- [x] Test overnight/midnight, weekend, save/reload, legacy-unmapped, un-met secrecy and once-a-day dialogue. Preserve all previous market, factory and profile logic.
- [ ] Convert provisional routine windows into player-negotiated meetings only after one reliable authoritative calendar. Show that an NPC **may** be there; no guaranteed future appointment today.
- [ ] Expand NPC agency into typed motivations, cases, rivalry and consequences under explicit, testable mechanics; continue to distinguish locally observed information from rumors.


## v0.6.52-dev · Autonomous situational NPC decision layer (source-only) · October 23, 2026

- [x] Replace random/hashed named-NPC goal choice in mapped and legacy routine paths with a deterministic occupation-specific utility planner.
- [x] Introduce seven individually tailored goal weights grounded in ambition, caution, sociability, exhaustion, known current work pressure, public headlines and each agent's own private observations, never another NPC's hidden thoughts.
- [x] Persist each actor's most recent motive score, situation snapshot and plain-language reason as **private save data**; public contact cards and newspapers do not reveal confidential future intentions.
- [x] Preserve existing room destinations, movement rules, face-to-face talks, calendar periods, autosaves and phase fallback. Add a warmer acquaintance greeting after repeated earned conversations.
- [x] Test role-dependent priority switches, witnessed staff risk, club raid concerns, public police news, own knowledge isolation, fatigue/rest, deterministic replay and previous NPC behavior.
- [ ] Add richer autonomous plan execution and consequences: directed travel, open-ended choices constrained by world rules, local interactions with witnesses, and newspaper publication only after observed/documented events. Current goals shape private intention, not independent property purchases or running crime cases.
- [ ] Deliver full clock authority for factory/market/venue and negotiated appointments; allow resident decisions to evolve within a trustworthy continuous city calendar.


## v0.6.53-dev · Procedural Poirot-style detective cases (source only) · October 23, 2026

- [x] Add an offline truth-first mystery engine, four distinct suspects, hidden case truth, independently sourced means/motive/opportunity records, alibis and uncorroborated rumor.
- [x] Validate each generated case has exactly one supported culprit with a complete three-thread evidence intersection.
- [x] Integrate playable investigation, individual suspect interviews and accusation buttons into the Patrolman career desk. All interactions consume real game-clock time, never ambient wall-clock time.
- [x] Persist generated cases, discoveries, interviews, accusations, failure state and case archives inside individual character profiles, including reload and replay safety.
- [x] Add Legal section and third-party research notices in GitHub repository and README.
- [ ] Transition from police casebook generation into genuine autonomous murders: NPC choices cause irreversible witnessed city events; victims are removed from the active simulation consistently.
- [ ] Spawn case records from actual world events for all character routes, rather than independent casebook templates. Add real geography, witnesses, evidence access permissions and police procedures.
- [ ] Build historical investigation tools, witness memory accuracy, motive inference, relationship histories, evidence challenges and time-sensitive consequences.
