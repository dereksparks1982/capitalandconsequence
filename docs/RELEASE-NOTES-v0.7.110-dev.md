# Capital & Consequence v0.7.110-dev · Benjamin's World Chart and Direct Ubuntu Updater

**Status: development source, not an accepted release. November 4, 2026.**

## Usability and career isolation
- Fixed the Benjamin Leach desktop-map opener: it now opens the **existing** high-resolution Mitchell 1880 world atlas and camera system rather than refusing his `mariner` route.
- Benjamin receives a clearly labeled Salem chart-study mode, inspectable existing port/reference sectors, schooner route estimates and his own saved map study pins. The route study is **not** physical travel, an established Salem commercial berth, or an awarded ship/contract.
- Charles Whitecomb retains his existing paid merchant shipping UI, ships and transactions unchanged. Benjamin cannot access or advance the industrialist's fleet, cash, cargo, passenger booking or trading privileges. The economic action handler guards against forged button presses, not merely hiding the buttons.
- The original Washington and Salem city maps, room geometry, 1878 chronology, portraits and historically chosen image files are unchanged.

## In-place Ubuntu update
- Replaced `scripts/build-from-github.py` ZIP fetching with a GitHub Git-tree manifest and **per-file blob SHA-1 validation**. Existing identical local source files are skipped and only changed/new tracked paths downloaded into a temporary staging area.
- Validates **all** downloaded changes and the Linux-builder script declaration before installing any changed source files into the **existing** project directory.
- Does not download repository ZIP archives, duplicate the source directory, create original-source archives, use Git password prompts, require sudo, or create rollback backup copies. It does not delete local untracked files.
- No automatic rollback is possible without backup copies: an unexpected interruption **during the short final replacement loop** can leave a partially updated installation. Staging failures leave current source unchanged. The standard build and Linux smoke sequence still runs afterward.

## Verification
- Added an executable VM regression for Benjamin's chart opening and economic isolation, including forged merchant purchase buttons.
- Updated Linux updater regression to check the new source manifest, absence of ZIP/backups, SHA validation and in-place replacement using a temporary toy directory.
- JavaScript syntax and source-level checks can be performed remotely. **The entire Node suite and the packaged Ubuntu/Electron graphical walkthrough still require execution on the owner's computer.**

## Source QA snapshot (GitHub Ubuntu / Node 22)
- Run `41890333957` tested the main v0.7.110 feature commit: **250 of 257 source tests passed**. Both new checks (`merchant-mariner-atlas.cjs` and `linux-in-place-builder.cjs`) passed.
- The seven failing tests were **already failing in preceding v0.7.109** (249 of 256 passed): `character-menu-portraits.cjs`, `electrified-washington-1878.cjs`, `peacock-debts.cjs`, `peacock-favor-story.cjs`, `peacock-network.cjs`, `recent-seven-regressions.cjs`, and `source-contracts.cjs`. Most reference older menu/biography/progression decisions; investigate each against current canon rather than silently deleting assertions.
- The subsequent updater follow-up commit supports zero-byte Git blobs and restores prior nonfatal Linux packaging-status behavior. The owner's real Ubuntu desktop build and visual confirmation remain pending.
