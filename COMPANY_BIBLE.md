# CAPITAL & CONSEQUENCE
# COMPANY BIBLE

**Company:** Elderred Softworks LLC (DKLab)  
**Project:** Capital & Consequence  
**Authority:** The owner and creator  
**Established:** November 1, 2026  
**Status:** Binding development rules, not a feature proposal or permission to change the game

> **FIX THE PROBLEM. PRESERVE THE WORLD.**

This Bible records the ten rules the owner explicitly directed the developer to follow after unauthorized changes to established Capital & Consequence gameplay. It applies to every assistant, developer, automated process, future build, refactor, test revision, documentation update, and handoff.

**Read this file before touching the project.** Read the relevant existing canon and decisions too. This Bible does **not** replace the story bible, character codices, map canon, or owner-approved decisions. It protects them.

## THE TEN NON-NEGOTIABLE RULES

### 1. THE OWNER IS THE FINAL AUTHORITY
The owner decides what belongs in the game, what changes, and what stays. A developer's opinion that something would be an improvement does not overrule an owner decision. Do not substitute convenience, realism, a test result, or an assistant's preference for approval.

### 2. AUTHORIZATION IS SPECIFIC, NOT BLANKET PERMISSION
Permission for **one named exception** applies to **that exception only**. It cannot be generalized to unrelated years, locations, mechanics, laws, events, story triggers, or progression. Alternate-history freedom is not authority to rewrite established rules.

### 3. PRESERVE ESTABLISHED GAMEPLAY
A repair must not break, erase, bypass, or casually simplify a working or approved system elsewhere. Preserve already established player progression, restrictions, access, consequences, game time, finances, and interactions. Fix the requested problem without changing the rest of the game.

### 4. NEVER ASSUME STORY OR LORE
Established character identities, relationships, histories, secrets, locations, event timing, quest prerequisites, and outcomes stay authoritative. Do not invent new story facts, erase existing story facts, or alter the plot to make implementation easier. New ideas are proposals until the owner approves them.

### 5. NO UNAUTHORIZED CHANGES
Do not implement extra features, remove restrictions, redesign screens, move approved UI geometry, relocate pins, replace assets, change unrelated data, or expand a bug fix beyond the approved scope. **"While I was here" is not authorization.** If an additional change would help, propose it separately; do not silently make it.

### 6. READ THE PROJECT DOCUMENTATION BEFORE EDITING
Read this Bible and the relevant current decisions, world rules, story documents, and existing implementation before changing anything. Do not rely only on chat memory, historical assumptions, or a partial summary. When documents differ, identify which decision is later and actually approved; do not guess away conflicts.

### 7. TESTS MUST PROTECT THE GAME
Tests exist to catch regressions in approved behavior. **Never rewrite a legitimate expectation just to make a failing build pass.** A failing test is evidence to investigate, not permission to weaken its assertion or remove a rule. When a requirement really changes, record the owner's exact approval before revising the corresponding test. Add regression tests for fixes, particularly for story gates.

### 8. FAILED BUILDS ARE NOT ACCEPTED BUILDS
A local script completing, GitHub accepting a commit, or a handful of tests passing does not prove the full game works. Report what was and was not tested. Never label an untested or failed source snapshot an owner-accepted release. Do not invent successful gameplay tests.

### 9. DOCUMENT CHANGES AND PRESERVE HISTORY
Record what was changed, why, what was explicitly authorized, and what was actually verified. Preserve the original history and owner-approved decisions. Do not delete, overwrite, or rewrite past canon to hide a conflict or mistake. Correct mistakes transparently.

### 10. STOP MEANS STOP
When the owner says **stop**, stop making changes. No more editing, committing, pushing, testing that mutates project state, or carrying on with the same task until the owner explicitly gives a new instruction. A new instruction authorizes only its stated scope.

## CAPITAL & CONSEQUENCE: PROTECTED INTERPRETATIONS

### Alternate history is not a universal override
The story begins in an alternate 1878 Washington, and the owner may authorize inventions, institutions, or events earlier than their real-world dates, including ideas historically associated with later decades. **Every such authorization is specific.** A developer must never infer that *all* dates and gates are now optional.

### The World's Fair is part of the story
**Preserve the World's Fair's already established opening date, event schedule, prerequisites, and story integration.** Do not open the Fair early, remove its narrative gates, rewrite its date, or change its consequences without the owner's **specific** permission. The owner did not authorize any change to the World's Fair merely by authorizing unrelated alternate-history exceptions.

A location's map visibility or general visitability is **not** permission to trigger a gated event or skip its story. Being able to visit a mapped destination does not automatically mean its fairgrounds event, ceremonies, attractions, characters, quests, or time-limited activities have begun. Preserve that distinction wherever it is present in existing canon.

### The world, map, cast, and UI are not disposable
- Preserve the owner's **single approved Washington map image across every playable year**. Never replace, redraw, automatically reposition, or date-swap the artwork.
- Keep owner-set location coordinates, approved pin behavior, and user-approved UI geometry unless specifically directed otherwise.
- Preserve the four protagonist identities, careers, relationships, private knowledge, progression, and story arcs. Do not grant one character another's knowledge through private player books or developer shortcuts.
- Preserve political canon, location and institution rules, NPC behavior boundaries, and explicitly approved narrative choices.
- An individual feature request does not silently revoke any of these protections.

### Scope and review discipline
Before a change, a developer must be able to state:
1. **Exact request:** What did the owner actually authorize?
2. **Affected scope:** Which files, behaviors, locations, dates, and story gates should change?
3. **Protected behavior:** What related systems must remain untouched?
4. **Verification:** Which tests prove both the intended change and the preserved behavior?
5. **Reporting:** Which checks ran, which failed, and what still needs owner acceptance?

If the requested work cannot be done without an unapproved collateral change, **do not make that collateral change**. Explain the conflict instead.

## DEVELOPMENT AND RELEASE RULES

- **No GitHub Actions.**
- **Linux-first.** Work in the existing project and existing installed game; do not silently create a replacement project or duplicate installation.
- No password prompts, SSH-agent or keyring dependencies, automatic browser opens, or `set -e` commands.
- Do not split or reorganize existing source files merely for style, size, or aesthetics.
- Do not ship unrequested executables, installers, or downloadable builds. When an authorized local patch is needed, follow the established changed-files approach.
- Do not treat a GitHub source commit as approval of the executable.
- For a formal release, obey the owner's sequence: **accepted snapshot → local commit and annotated tag → GitHub push and verification**. One accepted build at a time. Include appropriate version and release notes.
- A documentation-only commit requested by the owner is **not** a new game release and does not authorize gameplay changes.

## REQUIRED READING BEFORE FUTURE WORK

Start with this Bible, then check the documents relevant to the change:

- [Recorded owner decisions](DECISIONS.md)
- [Current project handoff](CONTINUE-HERE.md)
- [World rules](WORLD-RULES-2026-10-21.md)
- [Permanent map canon](MAP-CANON.md)
- [Character canon index](CODEX-INDEX.md)
- [Story, missions, morgue and asylum canon](docs/OCT-29-2026-MISSIONS-RECORDS-AND-ASYLUM-CANON.md)
- [Roadmap and implementation status](ROADMAP.md)

Older proposals and old release notes do not override a later explicit owner decision. If the current documents disagree, establish what the owner actually approved rather than deciding unilaterally.

## WHEN A DEVELOPER GETS IT WRONG

Acknowledge the precise unauthorized change. Identify the affected files, mechanics, tests, and story consequences. Do **not** conceal it by rewriting tests, inventing an approval, or making still more unrequested edits. Stop changes when told; wait for explicit direction about restoration or repair.

**THE OWNER DECIDES WHAT CHANGES. THE DEVELOPER IMPLEMENTS ONLY THAT DECISION.**

**FIX THE PROBLEM. PRESERVE THE WORLD.**
