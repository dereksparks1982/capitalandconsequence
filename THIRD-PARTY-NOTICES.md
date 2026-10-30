# Third-Party Notices and Attribution Register

**Capital & Consequence | Elderred Softworks LLC**

This register identifies third-party materials **actually incorporated into the repository**, based on the files inspected on 29 October 2026. It does **not** transfer ownership of those materials to Elderred Softworks LLC or Derek Sparks. The project's proprietary [LICENSE](LICENSE) covers only material owned by the named copyright holder. Other code, artwork, audio, fonts, historical material and dependencies remain under their own licenses, copyright notices and other applicable terms.

**Licenses vary by component.** An MIT, BSD, ISC or Apache license does not make the whole game open source. Conversely, the proprietary project license does **not** take away rights that a third-party license grants in the third-party component itself. Read each applicable license. Nothing here grants rights the original author did not grant.

## Confirmed bundled third-party JavaScript

| Component | Copyright holder | Upstream | License applicable to component | Bundled paths | Original license notice |
|---|---|---|---|---|---|
| Astronomy Engine | Copyright (c) 2019–2025 Don Cross | [cosinekitty/astronomy](https://github.com/cosinekitty/astronomy) | MIT | `vendor/astronomy-engine/astronomy.browser.js` | [vendor/astronomy-engine/LICENSE](vendor/astronomy-engine/LICENSE) |
| Howler.js | Copyright (c) 2013–2020 James Simpson and GoldFire Studios, Inc. | [goldfire/howler.js](https://github.com/goldfire/howler.js) | MIT | `vendor/howler/howler.core.min.js` | [vendor/howler/LICENSE.md](vendor/howler/LICENSE.md) |

These copyright names and notices are taken from the **actual bundled license files**. This summary is for navigation; the complete upstream notices remain authoritative. Users may exercise rights granted by those upstream licenses **in those upstream components**, subject to their terms.

## Investigated candidates are not bundled dependencies

The 20 external board/tabletop repositories in [docs/OPEN-SOURCE-GAME-ENGINE-CANDIDATES.md](docs/OPEN-SOURCE-GAME-ENGINE-CANDIDATES.md) are **research candidates, not adopted dependencies**. They are **not** claimed as components of Capital & Consequence, and appearing in that survey does not imply their authors' endorsement. If any is incorporated later, add an actual adopted-components entry here **in the same change** that imports the code.

Earlier design references such as llama.cpp, Ollama, AI Town, Generative Agents, Mysterious Murder and Cold Truth are identified in [LEGAL.md](LEGAL.md) as reviewed, rather than copied software, wherever that is the repository's current status. They must not be represented as bundled merely because they are cited.

## Non-code materials still requiring provenance audit

This register is **not yet a comprehensive inventory of all existing audiovisual or historical assets**. Before any public release, audit each bundled or runtime-downloaded picture, map, sound recording, font and other third-party asset. For example, `desktop/prepare-runtime-assets.cjs` identifies an externally sourced Washington map image and a Freesound-hosted ambience file. **The source URL alone does not establish copyright ownership, public-domain status, attribution conditions or redistribution permission.** Do not claim these assets as original project property without separate evidence; preserve their unchanged visual contents where required by approved design.

The same applies to artwork and audio that may be in the assets tree without an explicit provenance record. Audit and record independently; attribution is not a substitute for permission when a license requires it.

## Required entry for every future imported project

Do not add a third-party library, game engine or asset to a distribution unless its exact license and rights are verified and the following fields are recorded:

| Field | Required record |
|---|---|
| Component / project | Official name and what our game actually uses |
| Author / copyright | Exact upstream notice(s), including relevant dates |
| Source and revision | Canonical source repository/link, version or commit SHA |
| Files included | Actual vendor/package paths in this repository and packaged app |
| License | SPDX identifier where appropriate, **plus complete applicable license text** preserved in the relevant vendor/package notices |
| Dependencies and assets | Any transitive dependencies and independent image/font/audio licenses |
| Modifications | Which upstream files were modified, and required modification notices |
| Attribution surface | This register; `LEGAL.md`; any license/NOTICE files; and the in-game legal/credits screen when such a screen is added |
| Distribution verification | Confirm all needed notices are in the Linux build and any public release before publication |
| Permission status | Verified / awaiting permission / rejected; never interpret an absent license as permission |

A suggested component entry template:

```text
Name:
Copyright holder(s) and notices:
Source URL and upstream revision:
Original license / third-party licenses:
Imported files and modifications:
Required full license notice path:
Bundled dependencies and art rights:
Legal/credits acknowledgment location:
Date checked / reviewer / disposition:
```

For components licensed under copyleft or source-sharing terms, complete a separate compatibility and distribution-obligation review before use. **Do not import unlicensed code or incompatible/copyleft code based solely on public GitHub visibility.**

## Release gate

Before marking a gameplay build accepted for publication, confirm:

1. Third-party materials in the actual build match the inventory, including bundled transitive dependencies and images/audio.
2. Complete required copyright/license/NOTICE files ship with the distributed game, are accessible to users, and any other legally required credits are present.
3. Any necessary permission, source provision, or additional obligations have been fulfilled for the chosen licenses.
4. The in-game legal/credits section reflects **what is actually shipped**, not merely the candidate-research list.
5. The original game's proprietary terms are presented **separately** from the third-party rights and do not imply ownership of upstream work.

This attribution register is an administrative inventory, not a replacement for any license, not a warranty of completeness, and not legal advice.
