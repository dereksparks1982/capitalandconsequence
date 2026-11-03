# v0.7.97-dev · Ship deck click-to-walk

Source-only, November 3, 2026; not accepted/tagged.

A shortest legal four-direction path now connects any reachable tile on the current deck in both steamer and schooner layouts. UI allows distant clicks, charges one game minute for each actual traversed tile through the existing authoritative world simulation and applies the resulting position without any new timer or invented vessel velocity. Wall, water and crew-only cells are not traversable, and a deck transfer still requires standing on the real stair hatch and using the existing stair action. Adjacent click and WASD remain; original maps, approved geometry and shore gameplay remain unchanged. Added one Node regression test for both hull types and static app hooks. Syntax and connector-side V8 pathfinder smoke passed; full native Node source suite and graphical Ubuntu Electron gameplay have NOT been verified. No accepted release.
