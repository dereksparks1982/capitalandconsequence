# Capital & Consequence v0.7.78-dev | Verified records in four private books
November 1, 2026 · Source-only, not an owner-accepted Linux release.

## Work delivered
The original page-turning private-book code now surfaces factual data already earned by actual actions in the four protagonists' separate saves. It adds no new book geometry or public NPC knowledge.

**Charlie Whitcomb:** the Business Ledger distinguishes manufacturing obligations (`made`, `delivered`, contract deadline) from proven receipts. It shows the recent Component Works ledger, real additional bench/winder specialists and wage arrears, separately earned incandescent lamp research/prototypes, and the District/World's Fair award and shipment status. A projected invoice is never represented as received money.

**Sam Harlan:** the patrol Casebook includes only physical lost-property items actually accepted on the Hillsdale beat and entered into the Metropolitan Police custody register. It shows custody stages, whether a bag was sealed/inspected, and explicit unknown-owner status. It does not invent witness evidence, charges or detective authority.

**Eli Crowe:** his personal Journal adds physically accepted Golden Peacock parcels and actual night reports, including unresolved handoff status. No concealed customer identity, criminal affiliation or owner's reaction is made up.

**Edmund Wardman:** the Duty Journal now references only filed ward supply requisitions and submitted shift handovers. A supply follow-up or escalation still says no goods arrived unless recorded by a future authorized supply system. The director's medical/administrative judgment remains unknown.

All views are read-only and character-local. Existing user-authored entries, case references, notes, pages and hidden story information remain untouched. The rendering code already uses text-only DOM insertion for records.

## QA
Focused source test loaded the actual casebook and personal-book modules across four different profile fixtures, checked pages against underlying saved events, rejected cross-character leakage, and verified that opening books does not mutate the current saved life. Full offline Node suite and native Ubuntu Electron UI playthrough not executed here. No GitHub Actions, installer, tag or accepted release.