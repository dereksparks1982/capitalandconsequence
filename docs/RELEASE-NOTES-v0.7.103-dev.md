# Development build 0.7.103 · Six illustrated character lives (November 3, 2026)

**Status:** Developer source candidate, unaccepted. No release tag. Local Linux installation and Electron UI playthrough are not yet verified.

- The existing main menu now shows portraits for Charles Whitecomb, Samuel Harlan, Elias Crowe, Edmund Wardman, Bridget Kennedy and Benjamin Leach using the approved image files under `assets/artwork/characters/portraits/`. Portraits were not regenerated or edited.
- Preserves original career card structure, adds horizontal overflow, an always-present scrollbar in supporting browsers, vertical mouse-wheel sideways movement when pointer is over the row, native mobile swipe, Arrow/Home/End keyboard focus navigation, and retained scroll position after rendering.
- Menu names use full names without nicknames. Removed the redundant off-duty disclaimer from Samuel's career summary.
- Existing internal route identifiers and saved-profile keys are unchanged. New `proprietor` and `mariner` IDs are additive, and existing four careers remain accessible. Four independent save slots remain the current limit.
- Bridget starts in the Star Club proprietor office, with distinct room authorization. Benjamin starts at a fictional Salem wharf office that is **not** shown as a Washington map pin, with the world shipping chart accessible from his desk.
- These two new paths are explicitly labeled career **foundations**. No claim of finished Star Club revenue simulations, maritime freight economies, or an authenticated historical wharf address.
- Updated asset cache identifiers and project README.

**Checks:** Syntax/asset-path/route/room checks should run under the offline Node source suite, followed by Linux visual smoke test. Owner acceptance is still pending.
