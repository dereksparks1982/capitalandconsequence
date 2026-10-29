# Capital & Consequence · v0.7.25-dev
Date: October 29, 2026
Branch: work/2026-10-29-foundations
Status: UNACCEPTED development source. No Linux executable/release/tag.

## Changes since v0.7.24-dev
- Shared-world snapshots now deep-copy incident, morgue, clock and other nested records. Earlier states cannot be mutated by later case progress.
- Added a deterministic four-role suspect scene for the asylum death. The culprit is selected once per shared campaign. Person movements, alibis and observations derive from that single incident, not different character saves.
- Added registries for ward roster, visitor sign-in, porter bell statement, passage impression, ambiguous clothing recollection, and certified witness statements. Evidence comes through actual in-room, timed actions.
- Preliminary Edmund reports require firsthand ward observations and comparisons with visitor/passage sources. Sam's reports require porter evidence, certified statements and authorized medical records.
- Sam cannot access institutional statements or hospital reports without signed station-sergeant authorization. His rookie rank stays intact.
- Added provenance (time, source, venue and room) to character-private evidence records.
- Added mutually exclusive choices for Edmund's family meeting, with explicit changes to workplace trust and family pressure.
- Family correspondence evolves on saved Washington dates. Under adverse circumstances a petition may be threatened and challenged through independent review. No automatic commitment, diagnosis or guilt is generated.
- Updated README version to 0.7.25-dev and added focused source and scenario regression tests.

## Verification and remaining work
- Selected case, family, world-snapshot and full two-character flow tests have been exercised through a V8 CommonJS shim. This is NOT a native Node regression suite or Linux Electron playthrough.
- Full offline tests (`node tests/run-all.cjs`), actual room navigation, save recoveries under disk failures, and long-lived simulations require local verification.
- The homicide remains unresolved: there is no fully authored trial, arrest, final culprit determination, or complete NPC witness-interview system.
- Existing approved Washington map image, default pin coordinates, and UI geometry remain unchanged.
- No GitHub Actions, release, tag or changes to `main`.
