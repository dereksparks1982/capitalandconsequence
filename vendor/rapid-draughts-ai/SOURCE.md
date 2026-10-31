# rapid-draughts AI source and adaptation

Original project: https://github.com/loks0n/rapid-draughts
Source revision inspected: `9e90d745288c1f5aea8a552c261740abfacefb91`
Package: `rapid-draughts@1.0.6` (MIT license, copyright 2023 loks0n).

`search.js` is an original JavaScript adaptation of the upstream **alpha-beta / position evaluation design** (`src/computer/alpha-beta.ts`, `src/english/computer.ts`). It is not a verbatim copy of the whole rapid-draughts package, and it uses Capital & Consequence's existing American checkers legal move generator. Its recursive alpha-beta pruning, capture-leaf extension and board score account for actual future opponent turns. The upstream copyright and full license are retained beside the adapted component.

Bundled as a static local script in `index.html`; no runtime `npm install`, remote server, API key, web calls or Windows dependency. The public game has its own separate proprietary license for original work. No upstream board artwork or portraits were imported.
