# Capital & Consequence

**One city. Countless lives. Every choice has consequences.**

At the actual **District General Hospital reception**, characters can pay for a physician examination or limited medical treatment, consuming personal cash and Washington game time. No remote healing or destination-choice menu. See `docs/RELEASE-NOTES-v0.7.51-dev.md`.\n\nThe permanent character-condition panel now shows **Health, Hunger, Thirst and Energy** below the existing clock. Prolonged starvation/dehydration can reduce health, and new bounded injury/treatment services prepare for real location-based medical care. No free heal button or destination menu. See `docs/RELEASE-NOTES-v0.7.50-dev.md`.\n\nTop-down sparring now rewards **manual WASD sidesteps** against visibly telegraphed punches, while movement drains round stamina and exhaustion slows footwork; completed rounds expose a readable scorecard. Practice still does not mutate actual career health or finances. See `docs/RELEASE-NOTES-v0.7.49-dev.md`.\n\nThe boxing practice ring now records each round and awards a **win, loss, or draw** by decision, rather than ending with an unexplained result. A knockout or referee stoppage also identifies the winner. This is still isolated practice, not a championship, wager, or career result. See `docs/RELEASE-NOTES-v0.7.48-dev.md`.\n\nAn optional **top-down sparring ring** now runs with the existing 32x32 art and room model. WASD moves, left click punches and hold right click blocks; stamina only partially returns between rounds. It is practice-only with no cash, injury, world-time or championship effects. See docs/RELEASE-NOTES-v0.7.47-dev.md.

*Capital & Consequence* is a single-player, alternate-history life simulation set in Washington, D.C., beginning in **1878**. Build a life in a changing city where your work, money, relationships, reputation, and decisions can affect what happens next.

The character condition system now tracks **hunger, thirst, and energy** against Washington's actual saved game clock. Characters receive brief non-modal alerts when they become hungry, thirsty, or tired, without being offered a destination menu or teleported anywhere. Charles's coffee, water, snack, and rest breaks now have shared and individual in-game cooldowns, and the factory break room follows the same rules. Home meals and restaurant/café service are future location-based systems, not falsely advertised as playable. The factory screen is planned to show its **top-down production room first**, with existing production and management tools in collapsible sections beneath it; that visual redesign is not yet implemented. See `docs/RELEASE-NOTES-v0.7.46-dev.md`.

The **original visual Room Builder** now includes named developer blueprints, a connected-tile fill bucket, rectangle painting, an eyedropper, explicit floor/construction/object layers, safe all-or-nothing painting, and reachability checks for doors and intended work/storage furniture. These ideas were independently implemented in JavaScript after a license-aware review of Ogmo, 2dtiler, Project Porcupine, Space Station 14, and Open World Builder. **No third-party engines, code, sprites, or dependencies have been imported.** See `docs/OPEN-SOURCE-TILE-GAME-LESSONS-2026-10-31.md`. These are source features pending Linux playtesting.

The **Metropolitan Ledger** now presents its live headlines, industrial coverage, Washington reports and sporting results as a three-column 1878 newspaper, with dated printed editions and readable archived issues. The in-game **Room Builder** uses the same deliberately crude original 32×32 sprites throughout: paint and decorate an office, validate reachability, run a non-destructive walk test without modifying the saved design, restore a backup, and interact with Charles's actual executive desk when physically beside it. These are development-source features pending real Linux gameplay acceptance.

The parlor-game register has Chess and **American Checkers (Draughts)**, with a real overhead board, bundled MIT-licensed alpha-beta computer opponent, selectable difficulty, compulsory jumps, playable named NPCs at five authentic in-game room locations, a recent-move journal and shared-world results. Checkers is source development pending Linux tests, not a newly verified package.

Choose from different lives, including a businessman building **Federal Electric**, a police patrolman, a criminal-world doorman, and an asylum worker. **Each character has a distinct five-act main-campaign plan**, alongside jobs and side stories. A main-story page in the private book tracks verified milestones. Eli's second act now features a three-night branching encounter at the Golden Peacock and Edmund's documented confinement hearing advances his fourth act. Later acts remain in development. Each life experiences Washington from a different perspective. Eli has a fourth branching chapter dealing with debts and criminal contacts; source updates can now be installed inside the existing Ubuntu game executable without replacing the launcher. Edmund Wardman’s asylum storyline now includes dangerous misconduct, family confinement, independent appeals, a verifiable family-settlement letter showing possible financial incentives, and a possible irreversible experimental lobotomy in its fictional 1878 timeline.

Explore the city on its illustrated Washington map, travel on foot, horseback, or by carriage, visit businesses and social clubs, meet residents, work, trade, invest, gamble, play poker, and pursue opportunities or trouble. The **same digital Washington time, date, weather, market and funds banner** now appears on the map and inside registered rooms as well as on the executive desk. Street-route animations display the projected in-game time passing during the journey, and successful travel is charged once at arrival. Returning from another location to Federal Electric requires a normal map journey, never a remote desk teleport. These travel presentation changes remain development source until Linux playtesting. Time passes, people follow schedules, and your actions can have lasting consequences. The game takes place in a fictional United States with its own political and social history.

The game also includes a **visual room builder** using its original intentionally crude, 32×32 pixel-art furniture, floors, doors and character sprites. Construct, decorate, resize, save and test-walk the Federal Electric executive office first; the same tools are intended for other buildings after acceptance. The private books include dated, player-written pages in addition to recorded events. These features are development source pending Linux gameplay testing.

The Washington map includes optional developer tools for laying out streets and painting buildings blue as movement obstacles. Approved streets and buildings are stored as editable overlays rather than altering the original city illustration. The map also supports a saved road directory, route previews, walking, horseback travel and carriage travel.

## Personal desk objects and carried possessions (development)

The executive desk's original wooden surround is unchanged. Its green felt now
runs the full inside width and holds the same Washington paper guide and
Business Ledger, initially at their previously approved right-hand positions.
Click either object to use it. Drag with the pointer to reposition it anywhere
inside the felt; release to store the new coordinates in that character's
current-game state. The Washington map **image itself is never edited**.

Collected physical items have two distinct homes: **On Your Person** (carried
in pockets) and **On the Desk** (left in the executive office). Game events may
call `FE_PERSONAL_EFFECTS.acquire({id,name,kind,description})` to award an item,
such as a legitimately discovered key, letter or document. New games do not
magically include keys. Acquired items can be inspected, put onto the felt,
dragged, and retrieved into the carried inventory. A left-behind key is not
available in the pockets; desktop items can be accessed only while physically
at the executive office. All objects and coordinates are stored in the active
game autosave, without any prior-save migration.

This is a source-development milestone; Linux gameplay acceptance remains
pending a direct run of the updated executable.


## Linux sandbox compatibility (local ZIP/extracted game)

On Ubuntu 24.04+ where AppArmor restricts unprivileged user namespaces, unpacked
Electron executables fail at startup when the bundled `chrome-sandbox` helper is
not installed by root with the setuid mode. This game's requested Linux ZIP workflow
must not require users to run `sudo`, alter kernel security settings, or use a
launcher that adds terminal flags.

The packaged Linux distribution therefore includes a small, auditable **native
ELF launcher** named `capitalandconsequence` beside the complete Electron game
binary `capitalandconsequence-runtime`. The launcher directly executes the
bundled game with `--no-sandbox` on the command line **before Chromium starts**.
The previous `app.commandLine.appendSwitch` change inside the game was too
late to stop Linux SUID sandbox errors. No shell, sudo, compiler, installer,
AppImage, extra download, or second project directory is required.

The launcher source is in `scripts/linux-root-launcher.c`; a compressed,
SHA256-verified Linux x86_64 ELF copy is bundled in the repository so building
does not depend on a C compiler being installed. Both launcher and actual
Electron runtime remain real ELF executables in the existing game folder.
**Security warning:** this disables the Chromium process sandbox and should not
be used for browsing untrusted websites. Game content is bundled local HTML;
external URLs are opened by the default browser and foreign in-app navigation is
blocked. Users who have installed a working Chromium sandbox/AppArmor policy
can opt back in by launching with `CAPITAL_ENABLE_CHROMIUM_SANDBOX=1`.
This compatibility mode has not yet passed the actual packaged desktop smoke
test; successful local Linux build and download-ZIP QA remain prerequisites
for claiming a release.

## Clean project folder (no rebuild)

The project root contains two current Linux binaries: `capitalandconsequence`
(the native launcher) and `capitalandconsequence-runtime` (the full Electron
application). Both are required. All bundled Chromium support files,
`resources/`, `locales/`, assets, source code, docs, and player saves must
remain untouched.

`python3 scripts/clean-project.py` safely moves obsolete legacy
executables (`capital-consequence`, `capital-consequence-bin`) and temporary
build folders, old Linux packages and logs into a dated
`~/DKLab/Archives/Capital-Consequence-cleanup-*/` folder. It checks both
current ELF files and the packaged resources before touching anything. Other
unrecognized user files stay put and are reported. For a preview, use
`python3 scripts/clean-project.py --dry-run`. A successful local executable
build also performs this cleanup automatically. No network, sudo, password,
additional build or GitHub Actions is needed once the script is present.

## Linux runnable-game acceptance rule

The requested game format is a self-contained Linux x64 root-level **ELF executable named `capitalandconsequence`**, with its complete `resources/`, `locales/` and other Electron runtime files at the top level of the **same repository**. Players must be able to extract GitHub's repository ZIP and double-click that executable. An AppImage, a source-only checkout, a shell wrapper, or a downloader does **not** meet the requirement.

`npm run build:root:linux` is a local-only builder that attempts to package the actual Electron application, validates the executable's ELF header, runs the genuine Electron smoke test, and places the runtime in the original project folder. It does not use GitHub Actions. It also reports a **failure of GitHub ZIP readiness** if any compiled runtime file exceeds GitHub's 100 MiB blob limit. Only publishing all runtime files to the repository and independently testing the extracted GitHub ZIP establishes a playable release. **As of this development commit, no such complete root executable is published or verified; source changes alone are not a build.**

## Older Linux packaging notes (historical)


A GitHub **source-code ZIP is for developers** and cannot be made an executable merely by extracting it. Official playable downloads will be attached to this repository's **Releases** as a self-contained Linux AppImage or a portable Linux `.tar.gz` folder. The AppImage packages Electron, game code, map, and audio; no Node.js, npm, FUSE 2, online asset fetches, or GitHub Actions are required on the player's machine. Compatibility still depends on normal Linux system graphics and libraries. A release artifact is distinct from a GitHub-generated source archive.

Both Linux formats are built directly into the existing `Capital&Consequence/` project folder, without creating `dist/` or any second project checkout. An earlier static AppImage build was playable on a Surface Pro 8 (Ubuntu 26.04). Both newly built formats must pass `npm run qa:linux:release` before public acceptance. All game media must be local before packaging; `npm run audit:bundle` rejects missing files. The code is now on **`main`**, but **no accepted public Linux release has been published**. Use the official downloadable game artifact when one is released, not GitHub's source ZIP. Audio/artwork provenance and permissions still require approval before public distribution.



### Federal Electric underwriting prospectus (continuing development)
The existing FEC charter → board vote → physical broker listing now includes a live read-only prospectus. Edit the primary share issue, founder secondary sale, and offer price to see the allowable underwriter price range, exact company and founder proceeds after the 5% underwriting charge, post-issue capitalization, and Charlie's resulting voting stake. The offer button remains disabled until all published prerequisites are met. Sale receipts and the minute book record the actual share allocation and fee; duplicate requests cannot issue shares twice. The original Washington map, room geometry and broker-only execution rule remain unchanged. Work is on `main` only; no new playable release has been approved.

**Development status:** Beta, **v0.7.40-dev** on `main`, not yet an accepted Linux gameplay build. The board, public stock and corporate control systems remain in development alongside Washington's shared casework. **Chess is the first playable tabletop system integrated into the source**: licensed BSD-2-Clause [chess.js v0.10.3](vendor/chessjs/SOURCE.md) move legality, a new overhead Victorian table with original generic silhouette portraits, local challenges to NPCs physically present in eligible rooms, real move-by-move play against deterministic basic AI, autosaved match records, offscreen scheduled NPC-versus-NPC fixtures when two residents share an actual room, and completed-game newspaper reporting. The other **27 planned games remain documented, not implemented**. On October 30 the Surface Pro 8 passed **159/159 source regressions**, all bundle/offline/artwork audits, a full Electron source smoke test, and packaged AppImage/portable runtime smoke checks. Those checks validated the v0.7.31 development baseline **before** the subsequent IPO prospectus changes; the newer source remains pending a fresh full-suite and packaged-game retest. Real AppImage testing then caught unclosed renderer script tags and an obsolete synchronous travel-test assumption; portable extraction found a truncated tarball. Targeted source fixes and verified-archive packaging were committed after that failure. Both packaged formats reached the Commerce Club travel regression; diagnostics isolated a stale M-key map focus callback from an earlier test. The source guard was corrected and the rebuilt Linux executables passed both packaged smoke tests on the Surface. Additional IPO development after that successful build is not yet packaged or approved. An earlier AppImage was playable on a Surface Pro 8; that does not validate the latest code. See [game/competition design](docs/TABLETOP-PARLOR-GAMES-AND-LIVING-CIRCUITS.md), [engine survey](docs/OPEN-SOURCE-GAME-ENGINE-CANDIDATES.md) and [attribution](THIRD-PARTY-NOTICES.md).

**Factory v0.7.28-dev:** Cash and accounts are limited to Federal Electric's Executive Office or the District Bank Banking Hall, not Sullivan's rented room or any other factory space. The cash ledger enforces the actual saved room. A new staff break room can be entered through existing factory room navigation or a Coffee Break button; time and personal cash are spent on refreshments. The Washington map artwork and pin positions are unchanged. Full Ubuntu Electron gameplay validation is still outstanding.

**Washington map directory (v0.7.29-dev):** The existing pin color guide now lives inside Washington Location Directory, immediately below its heading and above the location buttons. Closing the directory also collapses the guide, freeing map viewing space without changing the approved map artwork, pin coordinates, colors or controls. Full Ubuntu Electron graphical validation is still pending.


**Travel navigation upgrade (v0.7.30-dev):** Bundles open-source PathFinding.js, Konva, and Yuka locally, each under its own MIT license, rather than using remote CDNs. On-screen travel pacing has been slowed without changing saved Washington journey minutes. An editable, independently stored overlay roadmap can be layered onto the immutable Washington artwork; route reconstruction remains explicitly provisional until reviewed. See the bundled licensing register and release notes.

**Custom Washington roads (v0.7.31-dev):** The **Road Editor** overlays editable streets and blocked rectangles on the unchanged original Washington map. Konva powers interactive drawing; PathFinding.js A* follows the user-accepted road cells and avoids explicitly marked blocks; Yuka provides route geometry. `Suggest Current Streets` seeds provisional roads from the existing approximate graph. `Scan Printed Map` experimentally proposes high-contrast straight patterns from the image (these are suggestions, not verified roads). Suggestions only affect travel after **Accept Suggestions** and **Activate Custom Routes**. Custom maps can be undone, imported, exported, deactivated and stored in the profile. An incomplete activated map may temporarily make some destinations unreachable; **Use Original Routes** restores the existing network. Full Ubuntu Electron UI testing remains outstanding.

## Legal: All Rights Reserved

**Copyright © 2026 Derek Sparks. All rights reserved. Published by Elderred Softworks LLC.**

**This is a proprietary project, not open-source software.** No permission is granted to use, copy, modify, redistribute, republish, sell, incorporate into another project, or create derivative works from the project's original source code, artwork, game systems, writing, characters, or other original materials without the copyright holder's **prior express written permission**, except as required by applicable law or GitHub's governing terms.

Public visibility on GitHub does **not** grant a license to reuse this project's original proprietary materials. Official unmodified game builds, if intentionally released for public play, may be played personally and noncommercially under the limited terms in [LICENSE](LICENSE).

**Third-party credit and ownership:** We do **not** claim ownership of external libraries, game engines, artwork, recordings, fonts or other third-party works merely because they are included here. Every adopted component remains subject to **its own license**, which may vary by project, including whatever independent rights that license grants. We preserve required notices and attribution. Merely researching a repository does **not** mean its code has been included.

See [LICENSE](LICENSE), [LEGAL.md](LEGAL.md) and [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) for ownership, currently bundled credits, license locations and release-review requirements.



## Murder case development (post-verified-build source)
The shared District Asylum case now has four possible perpetrator roles and three independent lines of personally sourced evidence. Sam's official referral is reviewed on a later campaign day and can be rejected, costing professional standing; Edmund can privately record a concern, potentially intensifying his family's pressure. The asylum's service culvert is a possible entry in the outside-visitor variant and remains an investigable alternative in other cases. The officer's casebook and orderly's notebook do not exchange private facts automatically. No arrest, conviction, or confinement is fabricated by a single statement. This is **development source on main** following the verified 159-test Linux baseline, not a newly verified packaged release.

### Shared District Asylum inquiry (development)
The same dated 1878 death belongs to shared Washington rather than a protagonist-specific roll. A new casebook contrasts the ward's access records, a physical trace and independent time accounts. Edmund can record a private workplace concern; Sam, after earning off-duty sergeant access, may submit a named suspect for later police review. A single clue is ambiguous, private discoveries do not automatically transfer between characters, and a police referral is not a conviction. The director may be among the suspected actors. Family pressure, professional credibility and official history can change without moving the original map. These additions have not yet been included in a newly verified Linux executable.


### Wardman family conspiracy and disputed records (development)
Edmund's brother can have the asylum duty register amended on January 7 after the death. Edmund may preserve the dated original before the amendment, compare the altered register, obtain independent porter testimony and attend a later independent petition hearing. The choices of witnessed, private or declined family meetings influence his defense. An adverse recorded order is enforced only after a further two-day period, making Edmund a patient with blocked travel and paid orderly work. There is an appeal process both before and after confinement, and an overturned order restores his employment. A document alteration is *not* proof the director committed the murder, and a family allegation is *not* a diagnosis or a conviction. All actions use existing asylum/hospital rooms and charge real game minutes. Development source only, not a new accepted or verified executable.

### AI Checkers opponent: adopted MIT search algorithm
The first one-step opponent was upgraded to a locally bundled **alpha-beta search adaptation** based on [loks0n/rapid-draughts](https://github.com/loks0n/rapid-draughts) (MIT, v1.0.6). The search evaluates multiple future legal turns, centers, kings, promotions and mandatory jump chains; the physical checkers table offers depths 2–5, while offscreen NPC matches use bounded two-turn search. Copyright notice and full MIT license are retained in `vendor/rapid-draughts-ai/`. No internet, Python service, AI API or installer dependency is needed. Source tests and packaged Linux verification remain outstanding.


### Certified Sam-to-Edmund police evidence (development)
After the disputed asylum duty register is revised, Sam can inspect both documents in person, then file a certified comparison through the metropolitan police duty sergeant. The certificate becomes part of the shared Washington record only after a valid campaign save, not by sharing Sam’s private observations. Edmund must obtain his own official copy in reception or request delivery while confined. The proof can support his petition at an initial hearing, or reopen a previously denied patient appeal when received afterward. This is an administrative discrepancy, not proof that the director committed murder. No new map locations or packaged release have been made for this change.
