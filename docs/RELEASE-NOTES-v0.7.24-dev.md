# Capital & Consequence v0.7.24-dev
Date: October 29, 2026
Status: development source, NOT an accepted game release.

Implemented on the working branch:
- Disk save restoration, fallback to healthy recovery copies, and typed record validation.
- Per-profile map layout disk mirrors; original Washington artwork and default positions unchanged.
- Live day and night duty countdown derived from the authoritative calendar.
- Shared Washington clock, objective incidents and NPC data for newly linked character profiles.
- Private lifelong event records for confirmed career actions and brokerage activity.
- Persistent mission records and preliminary District Asylum inquiry.
- Time-charged room actions for Edmund and limited assistance/report requests for Sam.
- Restricted morgue registry in the existing hospital location.
- Personal book pages for earned observations and full mission history.
- Updated source-level tests and new UI behavior regression checks.

Verification:
Eight focused tests passed in a V8 CommonJS test harness. One additional mocked room-interaction test passed. The original 40-pin artwork was verified unchanged and all index.html script/style references exist.
The full native Node suite and Ubuntu Electron playthrough have NOT been performed. This is not an acceptance build. No tags or GitHub Actions.

Still planned: a fully solvable suspect timeline, procedural witnesses and credible physical evidence, full cross-career economy integration, and sustained long-game save stress testing.
