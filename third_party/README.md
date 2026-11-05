# Real upstream repositories, pinned submodules

These are actual Git submodules (not names or URL-only citations). `git submodule update --init --recursive` retrieves their full source histories' checked-out files, artwork and licenses. The Space Station 14 repo is very large (around 1 GB repository content). The test center uses copied art immediately without needing submodules; it does not attempt to run unrelated Unity/.NET/editor code inside Electron.

- third_party/project-porcupine: https://github.com/TeamPorcupine/ProjectPorcupine.git at `6625ffe769acc18a54168818a8c30de950e38167` (GPL-3.0 code / CC BY-NC-SA 3.0 art)
- third_party/space-station-14: https://github.com/space-wizards/space-station-14.git at `feeea36c265247d536b9eba90f005b42083253fd` (MIT code / per-artwork licenses)
- third_party/ogmo-editor-3-ce: https://github.com/Ogmo-Editor-3/OgmoEditor3-CE.git at `b2a52159ebbf7b8a43b8a42243b7a96d3af847f7` (MIT)
- third_party/2dtiler-app: https://github.com/2dtiler/app.git at `591d20e0cc1b5b42081aac9c558f6d5a080687a4` (MIT)
- third_party/pathfinding-js: https://github.com/qiao/PathFinding.js.git at `2904a9afba483c02b5a61eb60fefd63e9b2db78c` (MIT)
- third_party/open-world-builder: https://github.com/OpenWorldBuilder/base.git at `598dfa11e5d79409f5e83d8571dcd61c8c959d36` (GPL-3.0)
