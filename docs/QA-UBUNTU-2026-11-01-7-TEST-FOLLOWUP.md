# v0.7.68 Ubuntu source QA: 202/209 to final seven
The owner's second local build synchronized correctly and found seven remaining failures. This grouped repair addresses those failures without changing the approved map, pin positions or room geometry.

- Map test fixture supplies the active-profile function expected by the real current-location marker; the game keeps YOU ARE HERE displayed even under filters.
- Source contract tests check the intentional current-location pin filter exception, rather than expecting a pure category filter at all times.
- Viewport right-button pan now ignores buttons, inputs, links, and the location card; preserves left-hand manual road painting.
- NPC intention tests recognize that the mapped public gaming hall can be visited, but unimplemented roulette is not playable and private homes/hidden venues still require access.
- Resident-agent checks distinguish Silas Pike and the traveling fortune-teller, whose positions live in the independent touring schedule; no invented permanent physiological or life-plan state.
- Road editor behavioral regression verifies the actual reopening status line, explaining left-drag freehand road drawing and right-drag panning.

The full source suite and actual Linux executable smoke test require a new owner-local run. All source edits were syntax-checked; no GitHub Actions, downloadable artifacts, or accepted release tag were made.
