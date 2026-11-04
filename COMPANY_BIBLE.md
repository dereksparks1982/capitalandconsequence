# CAPITAL & CONSEQUENCE
# COMPANY BIBLE

**Company / studio brand:** DK Softworks  
**Meaning:** Russian **ДК** = **Дом культуры** (*Dom kultury*), “House of Culture.”  
**Historical organizational attribution:** Elderred Softworks LLC (DKLab), preserved where applicable in legal and historical records.  
**Project:** Capital & Consequence  
**Authority:** The owner and creator  
**Established:** November 1, 2026  
**Status:** Binding development rules, not a feature proposal or permission to change the game

> **FIX THE PROBLEM. PRESERVE THE WORLD.**

This Bible records the owner's binding rules for development, including the explicit requirement to listen fully and wait for authorization before building. It applies to every assistant, developer, automated process, future build, refactor, test revision, documentation update, and handoff.

**Read this file before touching the project.** Read the relevant existing canon and decisions too. This document contains **development procedures only**, not lore. See [GAME_LORE.md](GAME_LORE.md) and its linked canon files for the story and world; those decisions remain authoritative **until the owner approves a revision**. No creative decision is inherently permanent or beyond criticism.

## THE ELEVEN NON-NEGOTIABLE RULES

### 1. THE OWNER IS THE FINAL AUTHORITY
The owner has final approval over what belongs in the game, what changes, and what stays. **Developers are expressly allowed and encouraged to suggest improvements, challenge weak ideas, point out conflicts, and recommend alternatives.** Explain the reason, likely consequences, and tradeoffs candidly. Advice is not an override: do not implement a departure from an owner decision without approval.

### 2. AUTHORIZATION IS SPECIFIC, NOT BLANKET PERMISSION
Permission for **one named exception** applies to **that exception only**. It cannot be generalized to unrelated years, locations, mechanics, laws, events, story triggers, or progression. Alternate-history freedom is not authority to rewrite established rules.

### 3. PRESERVE ESTABLISHED GAMEPLAY
A repair must not break, erase, bypass, or casually simplify a working or approved system elsewhere. Preserve already established player progression, restrictions, access, consequences, game time, finances, and interactions. Fix the requested problem without changing the rest of the game.

### 4. NEVER ASSUME STORY OR LORE
Established character identities, relationships, histories, secrets, locations, event timing, quest prerequisites, and outcomes stay authoritative. Do not invent new story facts, erase existing story facts, or alter the plot to make implementation easier. New ideas are proposals until the owner approves them.

### 5. NO UNAUTHORIZED CHANGES
Do not implement extra features, remove restrictions, redesign screens, move approved UI geometry, relocate pins, replace assets, change unrelated data, or expand a bug fix beyond the approved scope. **"While I was here" is not authorization.** Suggestions and constructive disagreement are welcome, including proposals to revise existing rules or canon. Discuss and secure approval before implementing a change outside the approved scope.

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

### 11. LISTEN FIRST. NEVER BUILD WITHOUT CLEAR AUTHORIZATION
**No code changes, gameplay builds, assets, releases, or commits for a build may begin until the owner has actually authorized that work.** Authorization can be conversational and contextual, such as "build," "go ahead," "implement it," "do the next build," or an equally clear instruction referring to a defined development task; those exact words are **not** required. But an idea, suggestion, correction, design discussion, or continuation of an explanation is **not** permission to start implementing it.

**Do not run off while the owner is still talking.** The owner commonly develops a request over several messages. Listen to the whole explanation, accept further details and revisions, discuss options when asked, and **wait for a clear go-ahead** before writing code or launching a build. Phrases such as "what do you think," "maybe," "I'm thinking," "let's say," or "hold on" are not build authorization. An approval of one idea is not automatic permission to build all ideas under discussion.

An instruction to **read, inspect, research, explain, plan, or document** authorizes only that named task, **not** a build. If the owner's intent to begin implementation is uncertain, ask instead of assuming. Even after authorization, stay within the requested scope and keep listening for changes or a stop instruction. An express stop immediately overrides any earlier permission to continue.

## CHANGE-SCOPE AND REVIEW DISCIPLINE

Before a change, a developer must be able to state:
1. **Exact request:** What did the owner actually authorize?
2. **Affected scope:** Which files, behaviors, locations, dates, and story gates should change?
3. **Protected behavior:** What related systems must remain untouched?
4. **Verification:** Which tests prove both the intended change and the preserved behavior?
5. **Reporting:** Which checks ran, which failed, and what still needs owner acceptance?

If the requested work cannot be done without an unapproved collateral change, **do not make that collateral change**. Explain the conflict, propose workable options, and seek approval for any broader change.

## DEVELOPMENT AND RELEASE RULES

- **PRE-RELEASE SAVE POLICY (OWNER DIRECTIVE, NOVEMBER 3, 2026):** The owner starts **a new game with every development build**. **Old save files and compatibility with earlier builds are NOT a priority or development requirement at this stage.** Do not delay implementation for previous-build save migrations, schema preservation, or fallback handling unless the owner explicitly requests it later. Functional saving and loading **within the current build** are still required where the game uses them. Do not confuse old save files with source history, approved lore, or currently working gameplay, which remain protected.

- **GitHub Actions and compute policy (owner revised November 2, 2026; shared DK LAB rule):** GitHub Actions **and** limited or billable compute are permitted, but **use both sparingly**. Prefer local Linux checks when they adequately verify a change. Run hosted tests or compute jobs only when they bring clear verification or development value, not automatically after every commit.
- Keep necessary Actions jobs and other compute work targeted, efficient, and proportionate; avoid wasteful reruns, large artifact uploads, unnecessary retention, and avoidable resource charges. Do not infer unlimited usage merely because quotas have reset. Record what was actually executed and verified.
- **Linux-first.** Work in the existing project and existing installed game; do not silently create a replacement project or duplicate installation.
- No password prompts, SSH-agent or keyring dependencies, automatic browser opens, or `set -e` commands.
- Do not split or reorganize existing source files merely for style, size, or aesthetics.
- Do not ship unrequested executables, installers, or downloadable builds. When an authorized local patch is needed, follow the established changed-files approach.
- Do not treat a GitHub source commit as approval of the executable.
- For a formal release, obey the owner's sequence: **accepted snapshot → local commit and annotated tag → GitHub push and verification**. One accepted build at a time. Include appropriate version and release notes.
- A documentation-only commit requested by the owner is **not** a new game release and does not authorize gameplay changes.

## REQUIRED READING BEFORE FUTURE WORK

Read **this Company Bible** for how the game is developed. Read [Game Lore & Canon](GAME_LORE.md) and its linked owner decisions and source documents for the world itself. Read [ROADMAP.md](ROADMAP.md) and [CONTINUE-HERE.md](CONTINUE-HERE.md) for implementation and test status. **Do not place story facts, characters, plot dates, map coordinates, or gameplay canon into this build-rules document.**

Older proposals and release notes do not override a later explicit owner decision. If documents disagree, determine what was actually approved instead of making a unilateral change.

## WHEN A DEVELOPER GETS IT WRONG

Acknowledge the precise unauthorized change. Identify the affected files, mechanics, tests, and story consequences. Do **not** conceal it by rewriting tests, inventing an approval, or making still more unrequested edits. Stop changes when told; wait for explicit direction about restoration or repair.

**DEVELOPERS MAY PROPOSE BETTER IDEAS. THE OWNER DECIDES WHICH CHANGES TO APPROVE.**

**FIX THE PROBLEM. PRESERVE THE WORLD.**
