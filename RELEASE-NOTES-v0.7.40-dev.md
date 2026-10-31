# v0.7.40-dev | Root executable packaging contract, not a playable release

Correct the Electron executable name to `capitalandconsequence`. The standalone local build task `npm run build:root:linux` first runs source regressions, builds an unpacked x86_64 Electron runtime, validates genuine ELF + app.asar + locales + other offline Chromium resource files, runs a native packaged smoke test, then moves the complete runtime to the existing repository root without a new persistent build folder.

If any resulting file is at or above 100 MiB, the task explicitly fails GitHub ZIP readiness: a source ZIP would not contain that Git blob. Passing local smoke alone is NOT proof of a working published ZIP. No release is claimed. No GitHub Actions and no AppImage used.

The current development environment does not have an Electron runtime or network access to download one; therefore there is no compiled game to commit with this source revision. It must not be described as built, packaged or double-click ready.
