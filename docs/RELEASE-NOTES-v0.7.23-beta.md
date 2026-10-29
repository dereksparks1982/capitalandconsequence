# Capital & Consequence v0.7.23 Beta | Police Report Desk

**29 October 2026 · Source-development checkpoint, not an accepted executable release**

A player's previously filed report about a formal duel can now receive a **case-desk review** at the Metropolitan Police station on a subsequent saved game day.

- Police casework reads **only reports actually submitted** in the active save by the player. It does not invent reports, witnesses, or criminal facts from an NPC's hidden schedule.
- A first-person statement remains an allegation. A report cannot be reviewed on the day it was submitted or at an unrelated location.
- After at least one in-game day, visiting Metropolitan Police can display **Request case update · 12 minutes**. The established game clock charges the action once, and the player receives a personal journal note.
- The case is then marked **awaiting corroboration**. The review explicitly records zero independent witnesses, zero criminal charges and no arrest warrant. A repeated review of the same report is rejected.
- Ordinary hospital aftercare and new police statements retain their previously established controls and time charges. No retroactive changes to previous reports or map pins.

**Tests:** `tests/police-casework.cjs` and `tests/police-casework-ui.cjs` passed in focused isolated JavaScript checks. Earlier duel aftermath and NPC social-memory infrastructure remain authoritative. The full offline Node suite and hands-on Ubuntu Electron playthrough remain unverified.

**Scope:** This is a foundation for an eventual playable police career, not a complete detective system, prosecution, dispatch, arrest AI, or recreation of any other game. The original Washington artwork, all 40 approved pin defaults, short README, LICENSE and LEGAL notices remain unchanged. No GitHub Actions, releases, installer ZIPs or compiled binaries were created.
