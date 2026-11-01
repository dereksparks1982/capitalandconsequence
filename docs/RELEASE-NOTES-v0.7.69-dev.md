# Capital & Consequence v0.7.69-dev | Restore 1893 World's Fair story boundary

**November 1, 2026.** Source development only; not an accepted Linux game release.

## Why
v0.7.65–v0.7.68 extended a map-visitability exception into blanket deletion of the World's Fair date. The owner did not authorize altering the 1893 Fair storyline. An overly broad test then demanded the incorrect behavior. This build repairs both.

## Changes
- Fair #9 retains its exact existing map position, name and 1893 story eligibility (`1893-01-01` is the earliest registry date, not evidence that a ceremony or campaign contract has been implemented).
- The map always permits travel to a new **Public Approach** room; pre-1893 players cannot enter the **Exposition Grounds** event room.
- Room navigation, travel preflight, event-room buttons, ordinary room entry and temporary developer room-unlock checks respect the story date. Developer previews do not grant gameplay or NPC privileges.
- Other map landmarks, including airport, monastery, kennel and car racing venues, retain year-independent map access.
- Regression tests assert the *actual* 1893 event rule instead of weakening the story to satisfy a test.

## Untouched
The fixed Washington artwork and pins, approved UI geometry, roads, characters, clock, Federal Electric progression, 1893 competitive bulb-supply contract and subsequent separate streetlighting opportunity are not changed. No fair opening ceremony, supplier win or newspaper story has been fabricated.

## Validation
JavaScript syntax and isolated V8 execution for city/access behavior were checked before the source commit. Full `node tests/run-all.cjs` and an Ubuntu Electron playthrough **have not been run**. This is **unaccepted v0.7.69 development source**, not an executable, tagged release or owner-approved build. No GitHub Actions were used.
