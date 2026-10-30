# Self-contained Linux distribution contract

**Development only.** No public release, main-branch change, tag, or GitHub Actions run is authorized by this document.

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

## Two developer-generated Linux release targets

- \`npm run dist:linux\` generates the FUSE-free single-file AppImage.
- \`npm run dist:linux:portable\` generates a complete portable \`.tar.gz\` application folder that unpacks to its own executable and libraries. This is a true extracted-file distribution, not a zipped AppImage.
- Neither build automatically publishes or invokes GitHub Actions. Attach a tested binary artifact to this repository's Releases only after acceptance.
- \`desktopName\` and \`linux.syncDesktopName\` match the existing app ID to keep GNOME/KDE window associations stable.
- The executive-office book and paperwork remain visually in the same positions; only the Business Ledger button opens the actual ledger. The decorative book/paper are labelled as Federal Electric and Washington Works, not duplicate ledgers.
