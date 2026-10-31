# Capital & Consequence · v0.7.31-dev
Development source on `main`, not an accepted Linux binary release.

## Custom road networks
- Konva-powered editor overlays the permanent Washington guide with user-drawn roads and building/ground exclusion rectangles.
- Automatic provisional road suggestions from existing graph, plus experimental browser-side straight-line image scan for possible streets.
- The user reviews yellow suggestions, explicitly accepts them, then explicitly activates custom routes. Otherwise the original approximate network remains active.
- PathFinding.js A* follows only submitted road cells, with blocked areas impassable. Yuka Vector3 computes route geometry.
- Editor supports connected point drawing, Finish Street, building rectangles, Undo, import/export JSON, clear and restore original routes.
- Per-profile drawings are stored in the game save. No original map artwork, pin positions, global map geometry or prior UI placement modified.
- On-screen walking, carriage and horse animations remain slower from v0.7.30, with no extra in-game time deducted.

## Verification
- Source-level regression files for custom road graph and editor hooks added, not executed here.
- Full Node suite and Ubuntu Electron visual walkthrough are still pending; GitHub Actions were not invoked.

## October 30 Linux distribution hardening (source only)
- FUSE-free AppImage toolset 1.0.3, portable Linux tar archive, and offline dependency audits committed to main.
- A bundled, project-generated WAV replaces the old external daytime ambience preview. The original Washington map remains unchanged.
- One Business Ledger entry in the Executive Office; no map geometry changes.
- Added `npm run verify:linux:artifacts` to run the actual AppImage and extracted portable executable with isolated save data and Electron smoke tests.
- Full source tests, actual new binary tests, audio approval and third-party distribution audit are **pending**. No new public release, tagged snapshot or GitHub Actions.

## Surface Pro 8 source QA and offline-audit correction, October 30
- Owner's updated local `main` checkout completed **153/153 source tests** and passed the runtime asset bundle audit.
- The next audit incorrectly rejected historical Wikipedia / Library of Congress reference hyperlinks in `app.js` and `city.js`, even though they do not load automatically or support game startup.
- Replaced the blanket URL scanner with a check for actual network APIs, remote media/style/script loads and remote renderer resources. Historical research links remain optional and are not required to play offline.
- Added executable negative and positive source regressions for this distinction. **The new audit has not yet been re-run on the user's Surface.** No release, tag, GUI validation, or GitHub Actions.

## Single-folder build output, October 30
- Removed the Electron Builder `dist/` output directory setting. Both Linux formats now build into the existing main project root only.
- Added safe one-time consolidation of pre-existing `dist/` contents; files are moved, never overwritten, and the empty folder is removed.
- Packaged-executable verification and artifact tests now read the project root, and generated files remain Git-ignored.
- No QA project copy, secondary branch, GitHub Actions, or release tag.

## Executable smoke-test defects and portable archive repair, October 30
- The first owner-built AppImage revealed four missing external script closing tags in `index.html`, which caused `FE_ROAD_LAYOUT.sanitize` to be undefined. Repaired closing tags without changing the map or its geometry.
- Updated the Electron smoke travel sequence to wait for actual async animated journeys, using the engine's supported reduced-motion animation for efficient verification.
- The initial portable `.tar.gz` was truncated (`gzip: unexpected end of file`). The portable build now assembles a complete archive from a fresh `linux-unpacked` game folder, checks gzip and tar integrity and the game executable, then atomically replaces the previous tarball.
- Added source regressions for HTML script integrity and portable archive integrity. **Both new executable formats still need owner-side rebuild and smoke rerun.** No Actions or second branch.

## Electron source smoke diagnostics, October 30
- Surface Pro 8 owner test: 157/157 source regressions and all asset audits passed. Both Linux executables start successfully; the verified portable tar archive extracts correctly.
- Only the first automated map visit (Commerce Club) fails its arrival assertion, while Star Club and Chinatown pass. Added explicit initial Washington image decode readiness, animation-start confirmation, and precise first-visit refusal diagnostics.
- `npm run smoke:linux:source` runs the identical Electron smoke test directly from the checked-out source, avoiding repeated AppImage/portable rebuilds during diagnosis. The new test instrumentation is **not yet verified on the Surface**; do not claim the executable test has passed.

## Stale map-selection callback corrected, October 30
- Source-only Electron smoke diagnostic on the Surface identified the exact Commerce Club interruption: the previous M-key room-return test had queued a `requestAnimationFrame` auto-selection of `home`. That stale callback ran after Commerce Club was selected and while its animated journey was active, so the intended destination guard correctly canceled arrival.
- Deferred room focus now uses an epoch token and refuses to act if the map is closed, a trip is active, a newer selection or dismissal occurred, or the player is no longer at the original room.
- Regression test exercises normal room-return focus and all five interruption cases. **The updated executable smoke test is not yet confirmed on the Surface.** Travel billing and animated game mechanics, map pins and Washington artwork are unchanged.

## Real custody and map navigation smoke corrections, October 30
- The owner's 158/158 source regressions passed, then Electron reached a poker smoke test built with fabricated pending sessions and no cash-custody tickets. The real cash-custody resolver correctly refused both fake settlements.
- Smoke setup now reserves genuine personal stakes through escrow, verifies a forfeited $25 and an undealt canceled $20, and restores original profile custody. An independent regression exercises the live resolver with valid tickets, refunds and duplicate-payout protection.
- Refreshed a later legacy Electron navigation smoke block to await asynchronous street animation and check the currently always-visible `Enter Location` control. It no longer assumes instant travel or hidden same-location buttons.
- Source fixes await Surface Pro 8 full regression and Electron smoke runs; no verified binary release yet. One main folder, no GitHub Actions.

## Subsequent development: Federal Electric IPO prospectus
- Existing corporate charter, board approval and in-person broker listing remain the authoritative workflow; no second exchange system or artificial pre-IPO ticker was introduced.
- Added an interactive underwriting prospectus showing company versus founder proceeds, 5% placement fees, new capitalization, outside float, founder control dilution, and hostile-majority risk before confirmation.
- The broker button is withheld when underwriting checks fail. The confirmed listing consumes the same verified prospectus terms, enters an idempotent receipt, synchronizes company cash to the factory ledger, and records the fee/control result in the corporate minute book.
- Added substantial pure source coverage for invalid shares/prices, approvals, broker visits, company history, reputation, operating funds, personal versus company money, zero prelisting market history, and finite public float.
- **Development code only**; the latest binaries were accepted as test artifacts on Surface Pro 8 before these additional changes. No new binary, tag, GitHub Actions or public release.

## IPO interaction regression and securities documentation
- Added an isolated DOM-based underwriter interaction test: editable share quantities and price, live net proceeds, blocked invalid offers, majority-loss warning, separate treasury/personal credits, company capitalization and the 15-minute paperwork debit.
- Updated the opening README with the correct **159/159 source and both packaged smoke PASS** on the earlier Surface Pro 8 baseline. These results **do not** establish that the new IPO changes passed the full Linux smoke test.
- Expanded MARKET-DESIGN.md to describe the existing charter/board/broker-only listing route and the new read-only prospectus. No approved UI geometry, map artwork or pin positions were changed.

## Continuing asylum murder: corroboration and delayed shared police referral
- The existing single campaign death and four role-based potential culprits remain fixed before any investigator acts. A new casebook combines three independently sourced access, movement and chronology threads. Each clue leaves at least two possibilities; only the complete set narrows to a single supported suspect.
- Edmund's ward register, passage observation and visitor register produce **private**, provenance-backed concerns. Family pressure changes when he names someone; this is not a police arrest.
- Sam's authenticated statement folio, coat witness and porter account lead to an **in-person police station referral**, requiring two prior patrol reports, off-duty authorization, the coroner finding and a submitted preliminary police memorandum. A full filing takes ten in-game minutes.
- An accepted referral enters the shared Washington register through the existing atomic save/capture path, with the named suspect and date. A later campaign day independently reviews it against the original fixed scene, recording corroboration or rejection. A rejected accusation damages Sam's professional standing on his next shared-world attachment. Neither outcome manufactures a conviction or automatic imprisonment.
- Added in-room suspect selection, visible sourced clues and precise refusal reasons without changing map artwork or approved room geometry. New source remains **unverified in packaged builds**, no new release.

## Optional asylum culvert and competing motives
- The District Asylum now has two additional, physical-evidence actions for Edmund (service culvert survey and staff grievances), and two documented counterpart records for Sam (certified culvert report and correspondence docket). All require a real visit, normal action time and Sam's limited sergeant authorization where appropriate.
- In a campaign with an outsider culprit, the fixed 08:55 scene chronology uses the service culvert and produces genuinely fresh outfall traces. Other campaigns retain the passage as an ambiguous possibility with no confirmed recent entry. Evidence remains sourced and the identity is not exposed by a single drain report.
- The correspondence docket includes a visitor with a possible personal grievance over harm to a relative, alongside staffing, patient and director disputes. These are hypotheses, not automatic truths, confessions, or convictions.
- The director remains Edmund Wardman's **unnamed elder brother**; the original public District Asylum and map location are unchanged.

## Additional sourced culvert regressions
- Expanded the existing 48-campaign scene test to check fresh masonry at the service culvert only in the outsider variant, stable scene provenance and distinct staff versus police documents.
- Expanded the full two-protagonist case walkthrough to visit the culvert and grievance registers, obtain authorized officer copies, spend game minutes and verify neither character inherits the other's private observations.

## Offline script-load contract
- The renderer regression now enforces the shared-world → incident → asylum scene → casework → story → game → in-room inquiry load order and requires the new local casework module to ship with the bundle.

## Restricted casebook testimony
- Opening a casebook now shows the four listed persons but **not** their unearned alibis. Sam must read the certified statement folio; Edmund must inspect the ward staffing book. Neither gains the other character's private findings.
- Shared-world test fixtures now timestamp observations using each protagonist's actual game clock, not a later synthetic timestamp.


### Wardman family conspiracy and disputed records (development)
Edmund's brother can have the asylum duty register amended on January 7 after the death. Edmund may preserve the dated original before the amendment, compare the altered register, obtain independent porter testimony and attend a later independent petition hearing. The choices of witnessed, private or declined family meetings influence his defense. An adverse recorded order is enforced only after a further two-day period, making Edmund a patient with blocked travel and paid orderly work. There is an appeal process both before and after confinement, and an overturned order restores his employment. A document alteration is *not* proof the director committed the murder, and a family allegation is *not* a diagnosis or a conviction. All actions use existing asylum/hospital rooms and charge real game minutes. Development source only, not a new accepted or verified executable.

### Family appeal and evidence privacy refinements
- The casebook does not reveal the existence of an altered director’s register until Edmund personally compares it. Passive shared-world knowledge cannot spoil the investigation.
- A fresh independent porter statement after an adverse hearing can improve an appeal to the independent panel. A still-unsupported allegation cannot automatically overturn the petition.

## Contested-family hearing UI and offline loader regressions
- The active in-room inquiry now tells Edmund the actual hearing or appeal result, with workplace trust, family pressure and petition status. It no longer hides the result behind a generic family-status message.
- The renderer load-order contract verifies the new Wardman records script runs after shared-world and casework prerequisites but before asylum story and app startup.
- New dedicated source regression: real calendar, dated register preservation and revision, family meeting pressure, hearings, reversal after additional evidence, delayed confinement, no wages during custody, and a once-only patient-ward appeal.

## Saved confinement opens the original ward room
After the family review order becomes enforceable, a successful local save schedules the actual asylum patient-ward room overlay. Staff rooms, room-directory choices and outside travel are blocked during custody. The transfer is not billed as a voluntary journey and cannot be introduced by a failed autosave. No UI geometry or artwork changed.
