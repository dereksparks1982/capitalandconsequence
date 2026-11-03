# Capital & Consequence v0.7.92-dev · Alexandria Opening Chapter

**November 2, 2026 · Development source only; not an accepted Ubuntu executable.**

## New opening for Charles Whitcomb
A freshly created Charles profile beginning on January 2, 1878 now receives a four-scene, choice-driven opening chapter:

1. **Alexandria Family Trading Office:** Charles discusses the secured loan and genuine voting equity with his demanding British father, a former soldier who runs an overland Egyptian trading business.
2. **Departure Quay:** Charles faces leaving his Egyptian mother and the city that raised him; no free shipping customers or commercial licenses appear.
3. **Passenger Cabin:** Charles reflects on factory expenses, equipment and independence during an authored introductory passage.
4. **Washington / Federal Electric:** Charles arrives at the already financed factory and enters the established 1878 game with its original opening world clock, cash and inventory.

Each scene has **three meaningful recorded choices**, for 12 choices in total. The current scene, selected text, and cumulative decisions survive autosave/reload. The special intro is **not** shown again to established profiles, is not available to Sam, Eli or Edmund, and cannot be replayed for additional benefits.

This is **an authored introductory vignette**, NOT a fictitious interactive Alexandria port, a charted vessel with game-advanced days, a separate time system, a world map replacement, or the full future international passenger-travel experience. An actual origin-specific voyage remains a different development milestone. This honest separation prevents inventing ocean route coordinates or arbitrary paid ship fares, and leaves January 2, 1878 and the approved permanent maps untouched.

## Family consequences
- `whitcomb-family.js` now records **investment confidence** (starting at 50/100), with fixed changes for each opening decision. These records are not randomly rerolled and cannot be replayed.
- Actually paid monthly obligations improve his father's confidence; major repeated defaults reduce it. The final secured foreclosure still produces financial control consequences instead of erasing Charlie or his private shares.
- His father's actual investor **board votes** reflect saved confidence, financial condition and cash rather than being a generic villain or automatic yes vote. The approved 75/25 original cap table, separate secured loan and dividend rights remain intact.
- The existing Corporate Affairs screen displays investor confidence beside the actual loan and ownership accounts. Charles's personal book keeps a separate record of his own introductory decisions, distinct from repayment receipts.

## UI and navigation
- New `whitcomb-intro.js` save model, `whitcomb-intro-ui.js` accessible scene/choice overlay and `whitcomb-intro.css` isolated dark period presentation.
- New industrialist profiles with the regular opening date start the prelude before free-roam. Completing it restores the existing factory screen, without moving approved geometry.
- A saved unfinished prelude reopens on returning to that profile. Existing/older profiles without prelude state are considered already introduced; their factory progress is preserved.
- Ambient market, world clock ticks and player time-spending actions do **not advance** while a prelude is open. Individual choices do not charge time or change starting company/personal cash, inventory, shares or house property.

## Verification
- Added `tests/whitcomb-intro.cjs`. Focused current-source JavaScript checks passed with **four** test files: `tests/whitcomb-intro.cjs`, `tests/whitcomb-family.cjs`, `tests/corporate-governance.cjs`, and `tests/ipo-prospectus.cjs`.
- Source parse validation passed for game startup, intro engine/interface, family ledger, and corporate governance; source wiring checks verify script ordering and first-profile/resume integration.
- **Not claimed:** full Node source suite, complete rendered Ubuntu Electron gameplay, functioning physical Alexandria location, an ocean-journey simulation or accepted Linux release. Those still require testing and additional authoring.

## README policy
Per the owner's request, the root README was **rewritten separately as a game-box-style description with the GitHub Pages link and the legally preserved copyright, proprietary license and third-party attribution section**. Development details and these release notes belong **here**, not in the README. Do not resume dumping development logs into the README after this update.

No GitHub Actions, separate expensive compute jobs, binary packaging, backups, approved artwork edits, release tags or automatic browser actions.
