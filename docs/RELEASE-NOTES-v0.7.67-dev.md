# Capital & Consequence · v0.7.67-dev
November 1, 2026. One major household and Washington commerce build, not yet an accepted Linux release.

The home kitchen now supports saved, recipe-specific shopping lists based on missing actual ingredients; physical markets quote and settle entire finite-stock, paid 24-package baskets, in addition to normal purchases. The cookbook menu, cooking, pantry, icebox, delivery orders, physical bakery baskets and real market tills are wired into the same player's profile and Washington world clock. Load one purchased ice block at home to cool the icebox, and clear spoiled food. Bag/store transfers preserve purchased expiration time. Missed deliveries show reasons without duplicate records.

Bakery sales debit the counter's own merchant till; the UI offers packing all fresh portions and selling up to five, within the existing market/day rules. Regular market stalls also sell three packages at a time, reject goods outside the Chinatown vendor directory, and never destroy nonedible shopping-bag goods via a generic Use button. Chinatown's market availability and destructive “Use” behavior are separately corrected in the market-counter source.

No approved map art, pin placement or room-builder geometry changed. Full Node source regression and owner Ubuntu packaged Electron acceptance are required before a release. No GitHub Actions or downloadable package committed.

## Source-QA unblock after local test report
Owner test build on Ubuntu found 190 of 209 source tests passing, 19 failing. The failures were audited against the accepted 42-pin map, hand-painted road editor, and calendar-independent alternate-history venues. Corrected obsolete 40-place / 17-historical assertions; kept full route coverage at 1,722 directed pairs, updated precise two-click **line** mode instead of incorrectly testing freehand mode as two-click, and aligned merchant stock assertions with separate branch inventory. Added missing factual history-card entries for Ford’s Theatre and Center Market. Fixed the room-arrival fixture for the new household overlay.

Game runtime now allows all registered mapped places in any game year, while retaining invitations, private rooms and unimplemented activity locks; dog racing and alternate-history auto racing are available at the 1878 start. No map artwork, original pin coordinates, or manual right-drag pan / left-drag drawing were changed.

The complete 209-file Node suite and packaged executable smoke test still require rerunning on the owner's Ubuntu installation. No claim of a passing full suite is made from remote/static verification alone.
