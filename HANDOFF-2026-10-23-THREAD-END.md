# ARCHIVED handoff · v0.6.58 historical snapshot · October 23, 2026

> **ARCHIVED. NOT A CURRENT HANDOFF OR DEVELOPMENT INSTRUCTION.** This filename is retained only so older links do not break. **New work must start with [CONTINUE-HERE.md](CONTINUE-HERE.md)**, checked against live `app.js`, `package.json`, the current [ROADMAP.md](ROADMAP.md), [DECISIONS.md](DECISIONS.md), and GitHub Source QA. Never follow directions from this historical snapshot as current policy.

At the time this document was originally written, the repository was at **v0.6.58-dev**. The original document asserted that the active game started in 1890, that the bulb-first workshop had not been converted to 1878, that the city had only 26 destinations, and that old saves needed preservation. Those assertions and instructions were **superseded**. The original wording remains recoverable in the repository's Git history; it is not reproduced here because it was causing new threads to resume from the wrong game state.

## Current source at archival correction

- **Project:** Capital & Consequence. **Federal Electric** is Charlie Whitcomb's company inside the game, not the game title.
- **Repository and branch:** `dereksparks1982/capitalconsequence`, one branch: `main`.
- **Current verified source candidate at this correction:** `v0.6.84-dev`, opening **January 2, 1878**, with the telegraph-component workshop, one paid assistant, Washington's four career paths, competing liveries and Charlie's home stable.
- **Source QA:** GitHub Actions run [40058726255](https://github.com/dereksparks1982/capitalconsequence/actions/runs/40058726255) succeeded at source commit `5d3c76f9865fa1f7c0f1c7c842d7be8cc5c0e414`. Documentation-only commits after that are not gameplay or executable acceptance tests.
- **No requirement to preserve or migrate 1890/1938 saved games.** Current-profile autosave and transaction integrity still matter.
- **Do not split `app.js` or other existing files.** The owner has explicitly rejected splitting the main game source for file-size or style reasons. Do not propose that as the next development task.
- **No unapproved code changes or packaged builds.** Continue only after explicit owner authorization, following the current handoff and roadmap.
- **Current-game time:** The game clock ticks 1:1; only player actions may skip time; NPCs catch up without moving the clock.

**Canonical continuation:** [CONTINUE-HERE.md](CONTINUE-HERE.md). **Current decisions:** [DECISIONS.md](DECISIONS.md). **Current tasks:** [ROADMAP.md](ROADMAP.md).

### Recovering the original archive

The historical full-length v0.6.58 handoff remains available at the [repository snapshot before this documentation correction](https://github.com/dereksparks1982/capitalconsequence/blob/c3d46f63a3e02bde1984a52994f81c456dd8a842/HANDOFF-2026-10-23-THREAD-END.md). That archived text is evidence of a past development point, **not authority over the present project**.
