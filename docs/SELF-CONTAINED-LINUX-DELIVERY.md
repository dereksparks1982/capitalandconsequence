# Self-contained Linux distribution contract

**Development only.** These changes are tracked on `main`. No public release or annotated release tag has been accepted. Never use GitHub Actions.

## Player requirement
Players download the official Linux AppImage from the repository's **Releases**, mark it executable if their desktop requires that, and launch it. No installation of Node, npm, FUSE, build-essential, or asset-download scripts. The GitHub-generated source ZIP is for **developers**, not a playable Linux distribution.

## Build requirement
- Bundle all JavaScript, vendor libraries, Electron runtime, Washington map, and audio inside the AppImage.
- AppImage toolset 1.0.3 avoids the FUSE 2 mounting requirement verified on Ubuntu 26.04 Surface Pro 8.
- The original Washington map stays byte-for-byte unchanged. Never adjust approved pin geometry in a distribution change.
- No first-run HTTP fetches. Developer startup/build checks fail if required local media is missing.
- The former externally downloaded daytime ambience preview is replaced by a small original procedural wind/bird/street recording in the repository. Do not copy an unverified third-party Freesound preview into a public build.
- Run offline source tests, asset audit, Linux build, and a fresh extracted executable test without network. Smoke testing must not secretly use files from the development checkout.
- Review all shipped third-party audio/artwork license provenance and notices before releasing. Existing audio rights are not assumed merely because files are present.
- Keep accepted-snapshot -> local commit and annotated tag -> GitHub push and verification for actual releases. No GitHub Actions.

## Known boundary
A Linux executable cannot be completely independent of the host kernel, core graphics/drivers, and every distro-specific library. Test supported distributions and document them; do not claim universal compatibility.

## One project folder; build products in the existing project root

Electron Builder now writes output to the project's **existing root** (`build.directories.output: "."`) instead of generating a `dist/` directory. Both Linux binaries, any builder YAML files, and the intermediate `linux-unpacked/` output are in `Capital&Consequence/` directly. They are ignored by Git and are not a second checkout or branch. The old `dist/` directory can be flattened and removed once with `npm run consolidate:linux:output`; the script refuses to overwrite existing names. The QA worktree directory is not part of the build and should not be created again.

## Two developer-generated Linux release targets

- \`npm run dist:linux\` generates the FUSE-free single-file AppImage.
- \`npm run dist:linux:portable\` generates a complete portable \`.tar.gz\` application folder that unpacks to its own executable and libraries. This is a true extracted-file distribution, not a zipped AppImage.
- Neither build automatically publishes or invokes GitHub Actions. Attach a tested binary artifact to this repository's Releases only after acceptance.
- \`desktopName\` and \`linux.syncDesktopName\` match the existing app ID to keep GNOME/KDE window associations stable.
- The executive-office book and paperwork remain visually in the same positions; only the Business Ledger button opens the actual ledger. The decorative book/paper are labelled as Federal Electric and Washington Works, not duplicate ledgers.

**Immutable source art guard:** the offline asset audit verifies the Git object SHA-1 of the existing Washington map (`57ab4c66dccb151a4153864f2fdd9790065ec77d`), not just whether a file with that name exists. This protects against accidental substitutions while retaining the approved image bytes.

## Offline release preflight

All three Linux packaging commands now automatically run `audit:bundle`, `audit:offline`, and `audit:artwork` before packaging. The bundle audit resolves every local `<script>`, `<link>`, `<img>`, `<audio>`, `<source>`, and `<video>` dependency in `index.html` and CSS `url(...)` resources; it also checks known JS audio/art paths and the immutable map's Git blob identity. Any missing file or remote renderer dependency stops the build.

Run `npm run qa:linux` for the complete offline source regression suite and asset checks before considering an acceptance snapshot. Those checks are **not equivalent** to testing a downloaded AppImage or portable archive on a clean machine with networking disabled.

## Packaged executable regression test
After locally creating **both** Linux outputs in the project root, run `npm run verify:linux:artifacts`. It starts the FUSE-free AppImage directly, extracts the portable tar.gz to a temporary folder, launches its included executable, and checks for Electron's real `FEDERAL_ELECTRIC_SMOKE_OK` token. Both run with isolated temporary HOME/XDG profile directories, which are removed afterward. The verification command uses developer-side `tar`; end users do not need tar after extraction. This does not replace testing without network access or on other Linux distributions.

## Optional research hyperlinks
Historical reading links (for example, Wikipedia and the Library of Congress) are optional and may open in a web browser only on player action. They are **not** bundled gameplay dependencies. The offline audit blocks remote script, media, stylesheet loading and selected network APIs instead of rejecting historical URLs embedded as data. The asset manifest still verifies local image, audio, script and stylesheet paths separately. This static check does not replace a live offline launch test.

## Verified portable archive packaging
`npm run dist:linux:portable` now builds the portable `linux-unpacked` directory directly inside the project and uses a local Node.js-driven tar/gzip assembly. The resulting `Capital-and-Consequence-<version>-x64.tar.gz` is renamed into place **only after** both gzip validation and tar member inspection confirm it contains `linux-unpacked/capital-consequence`. If packaging fails, a previous archive is preserved instead of being silently replaced by a truncated download. The launch smoke check separately tests the extracted executable. All output remains directly in the single project folder, without `dist/`.
