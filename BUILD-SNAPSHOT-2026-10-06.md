# Federal Electric Build Snapshot — 2026-10-06

## Build identity

**v0.5.0-dev**

This snapshot opens the new Washington Power / delegation development line after the v0.4 closeout.

Current baseline before this refresh:
`7724d5a94ca9d99d3562642174e6580eab449cca`

## What changed from v0.4

The game now has a stronger presentation-editing and management foundation:

- editable title hotspots with saved local geometry
- DEV panel hidden on mobile (900px and below); player radio controls remain available
- compact persistent player radio controls
- radio power, station, exact 0–100 volume slider and context auto-tune controls in DEV PANEL
- iPhone radio architecture changed to one active feed at a time
- desktop metadata prewarm for the large Capital Melody file
- mobile audio mix moved toward louder radio / quieter street ambience
- Star Club map label corrected
- Foreman Sullivan delegation foundation
- General Manager hire/dismiss and daily payroll
- management alerts
- serious delegated breakdowns can still fail
- persistent management-neglect score that compounds unresolved problems into lower output and morale/discipline pressure

## New long-form game direction

Federal Electric remains the core company, but the player may eventually become a Washington power broker and political figure.

The alternate-history civic premise is explicit:
Washington's presidentially appointed mayoralty survives into 1938 in this fictional timeline. The player may eventually pursue a presidential appointment as Mayor of Washington, D.C.

Factory delegation exists specifically so political/social play does not require manually starting the factory every morning, while fallible managers ensure the company can still suffer if neglected.

## Known test targets

- verify hotspot editor on desktop and iPhone
- verify saved hotspot geometry survives reload
- verify Reset Selected and confirmed Reset Overrides
- verify iPhone radio can advance through all five stations repeatedly without locking
- verify Capital Melody first-tune delay is improved on desktop
- verify mobile radio 0–100 slider and exact numeric readout
- verify title startup always begins on station 1 theme from 0:00
- verify Star Club context selects Capital Melody when Auto Tune is ON
- verify manual tuning remains available afterward
- verify Foreman Auto-Start at next Business Day
- verify a serious breakdown still blocks automatic recovery when management fails
- verify General Manager salary appears in company expenses
- verify General Manager can sometimes contain serious away breakdowns

## Next slice

Add broader fallible management judgment calls, then build the first Washington influence/political-progression state model. The neglect system exists now; customer loss, layoffs and closure remain later escalation layers.


### Radio control sizing correction

The visible player radio is now hard-sized on the actual `#globalRadioBar` DOM node and backed by final ID-specific CSS overrides. This avoids the earlier situation where edited class rules did not produce the expected live dimensions.
