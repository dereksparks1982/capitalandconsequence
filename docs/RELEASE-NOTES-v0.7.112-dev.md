# Capital & Consequence v0.7.112-dev · Normal Linux Startup Repair

**Unaccepted development source, November 4, 2026.**

The owner ran the existing in-place Ubuntu updater and verified that 0.7.111 installed 16 changed files, all 258 source regressions passed, but the packaged Electron smoke rejected the six-character menu because its own acceptance assertion still demanded four routes. The launch also emitted a Wayland/Vulkan GPU diagnostic, and automatic cleanup moved two temporary items into a newly created archive despite the owner's no-backup directive.

## Repair

- Keep all six selected routes in exactly their approved order. The actual packaged UI smoke now reads each career card's ID and requires all six, then still tests real Wardman profile creation/reload, desk identity and factory permission hiding. No career/system is bypassed.
- Native root ELF launcher sends `--disable-vulkan` and `--disable-features=Vulkan,VulkanFromANGLE,DefaultANGLEVulkan` to Chromium **before process startup**; leave Ozone backend automatic to allow direct Wayland rather than forcing X11. Preserve the existing unsandboxed unpacked-root policy with explicit opt-in for a configured sandbox.
- Compile the actual launcher C file for x86_64 Linux, bundle it as a checksum-verified gzip+base64 ELF (`sha256 18878c1edc4e952748defb70466203897f0596ccff82865599eafe474804cff9`); existing executable remains entirely offline with no sudo or external program requirement.
- Packaged Electron smoke becomes mandatory for installation. If it fails, source is updated but the existing installed ELF and runtime are preserved. Do not present the game as successfully installed.
- Remove automatic `clean-project.py` invocation from normal build. No archive, backup export, or unexpected project cleanup will occur.
- The local packaged game returns exit 0 only on a genuinely successful source, packaging, native smoke and installation sequence; an oversized GitHub source/release ZIP remains informational and does not invalidate a local game.
- New regression suite verifies this entire startup contract, including native command-line graphics flags and sandbox opt-in.

## Limitations

A Node source test is not a full GPU/desktop acceptance. Real Electron packaging and smoke should be checked in an Ubuntu graphics session before owner installation. User's hardware-specific NVIDIA/Wayland result remains unverified until that machine is tested. No saved-game compatibility work, story edits, maps, economy, art, UI geometry, or character relocations.

## Packaged Ubuntu run: diagnosis and regression coverage
The first successfully installed CI dependencies allowed a real Electron package to launch. The six-character check passed, as did the road-to-Commerce, Star Club and Chinatown visits. The next smoke assertion still demanded a pre-supersession **1893 Fair lock**, although the owner's November 1 decision moved the exposition to late 1878 and preserved public access to its mapped approach. Replaced that stale condition with direct checks of the public approach, event restriction before October 1878 and positive eligibility at the provisional late-1878 boundary. Game fair code and event admission policy are unchanged.

The next full Ubuntu packaged run passed the updated Fair checks, physical Commerce/Star/Chinatown travel, and the second navigation sequence but revealed a stale expectation that `returnCityRoomToOffice()` instantly teleports from the remote Russian Trade Hall to the factory. The owner's no-teleport contract is intentional. The revised runtime check **requires** this shortcut to fail without moving the character or closing the room. Normal travel behavior remains unchanged.

## Native Wayland test feedback
Actual Weston/Wayland startup confirmed the earlier Vulkan conflict diagnostic no longer occurs, and the app loaded. A headless compositor did not provide animation frames to Electron's deliberately hidden smoke-test window; the map animation consequently exceeded its test deadline. The smoke-only BrowserWindow is now mapped visibly in test sessions, with background throttling off. Ordinary player startup still follows the original `ready-to-show` behavior. The Wayland log additionally exposed a genuine defect in `crowe-butchery-ui.js`: the immediately invoked function received no `root` argument and crashed while accessing `FE_CROWE_BUTCHERY`. Its original browser/global root is now supplied explicitly and an executable VM test protects against recurrence. No shop story, costs, layouts, or action access have been modified.

### Distinguishing full gameplay from headless compositor boot
The user's real machine has a Wayland GPU path, unlike the CI headless Weston compositor which may suspend animation frame callbacks or run without a DRM device. Full packaged game smoke (including every travel, UI and save interaction) remains mandatory under Ubuntu's virtual desktop and **passed**. The separate native Wayland test now runs a bounded `--graphics-smoke` check of a mapped real Electron window, city registry, all six menu cards and live Crowe panel, with the launcher's automatic Vulkan safety flags. It rejects the former Wayland/Vulkan incompatibility diagnostic. This does not bypass or weaken the full packaged smoke test and does not add an end-user launch flag.
