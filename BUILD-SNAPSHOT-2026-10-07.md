# Federal Electric Build Snapshot — 2026-10-07

## Build identity

**v0.6.0-alpha.1 — Washington City / Standalone Stabilization Candidate**

This build turns the first reusable Washington location work into a testable standalone slice.

## Washington city foundation

- City/location data is character-agnostic and can be reused by later playable characters and separate stories.
- Existing six map locations use the shared registry without changing their IDs or the player's saved pin placement.
- White House, Washington Arena, Washington Airport and Metropolitan Police remain registered for DEV access even though their final map pins and artwork are not assigned.
- Existing mapped locations now expose **Go There** from the location card.
- Normal travel writes an authoritative saved current location.
- DEV room teleport remains session/testing behavior and does not rewrite the saved current location.
- Room shells now include Return to Map, Return to Executive Office and a room-directory hook for future multi-room locations.

## Standalone stabilization

- Profile label remains on the far-left wooden navigation strip rather than the red status bar.
- Desktop status/navigation spacing has an additional compact breakpoint for narrower supported desktop windows.
- Build CI rejects remote runtime dependencies in gameplay scripts/styles or HTML resource tags.
- Historical/research hyperlinks remain external by design and open through the system browser.
- The packaged Linux smoke test now verifies:
  - Federal Electric title/DOM load
  - city registry and room overlay
  - localStorage persistence across renderer reload
  - no status/navigation overflow at the packaged test width
  - local poker popup creation through Electron's window policy
- Desktop diagnostics are written locally under Electron's Federal Electric user-data directory in **Federal-Electric.log**. There is no telemetry or cloud reporting.

## Build target

Package version: **0.6.0-alpha.1**

Target: portable Linux standalone directory packaged as a `.tar.gz`, inside the private GitHub Actions artifact.

## Validation

GitHub Actions run **37670530912** completed successfully. The offline audit, packaged build, exact double-click launcher smoke test, persistence/layout checks, and local poker popup test all passed.

## Still intentionally future work

- final room artwork
- final room assignments inside locations such as the White House
- player discovery/access/invitation rules
- travel-time charging
- Washington influence and political progression
- broader fallible management incidents
- final app icon
