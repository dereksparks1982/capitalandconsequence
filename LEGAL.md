# Capital & Consequence · Legal, Licensing and Attribution

**Copyright © 2026 Derek Sparks. All rights reserved in original materials owned by that copyright holder.**  
**Published by Elderred Softworks LLC.**

## Ownership and separate licenses

**Capital & Consequence is a proprietary project, not a general open-source release.** Its original source, writing, game-specific expression, characters, original artwork and documentation remain governed by the [project LICENSE](LICENSE), to the extent owned by the named copyright holder. The public GitHub repository does **not** grant a general reuse license for those original materials.

**We do not claim ownership of third-party works.** The game may contain libraries, engines, historical art or maps, audio, fonts, and other assets created and copyrighted by others. Each incorporated component retains its **own applicable license, copyright holder and terms**, which may differ from component to component. Those independent licenses govern recipients' rights in the component itself. The project's proprietary license does **not** replace or restrict any rights granted by a third-party license. Attribution does not replace obtaining permission where permission is needed.

See the [Third-Party Notices and Attribution Register](THIRD-PARTY-NOTICES.md) for the actual bundled-code inventory, paths to full original license notices, the future adoption checklist, and the outstanding historical/art/audio provenance audit.

The fictional people and events in Capital & Consequence are not claims about real persons. A reference to or use of properly licensed third-party software does not imply affiliation, sponsorship or endorsement by its original authors.

## Currently bundled third-party libraries

The actual repository contains these separately licensed components:

| Component | Author / copyright holder from bundled notice | License | License file in this repo |
|---|---|---|---|
| [Astronomy Engine](https://github.com/cosinekitty/astronomy) | © 2019–2025 Don Cross | MIT | [vendor/astronomy-engine/LICENSE](vendor/astronomy-engine/LICENSE) |
| [Howler.js](https://github.com/goldfire/howler.js) | © 2013–2020 James Simpson and GoldFire Studios, Inc. | MIT | [vendor/howler/LICENSE.md](vendor/howler/LICENSE.md) |

These entries acknowledge **upstream authorship**, not a transfer of rights to Elderred Softworks LLC. Complete terms are in the referenced files. Additional third-party packages or art may be present and require further inventory before release. The register is not yet a complete audiovisual audit.

## Evaluated or cited projects: **not** bundled just because they are mentioned

The tabletop/board-game engine survey in [docs/OPEN-SOURCE-GAME-ENGINE-CANDIDATES.md](docs/OPEN-SOURCE-GAME-ENGINE-CANDIDATES.md) describes **possible future dependencies**, including chess, checkers, Mahjong, Western dominoes, Xiangqi and backgammon engines. **None of those surveyed game engines has been adopted by the survey itself.** If we later use one, its actual author, revision, license and full required notices will be added to the real bundled-component list in the same development change.

Other existing research and interoperability references:

- [llama.cpp](https://github.com/ggml-org/llama.cpp) and [Ollama](https://github.com/ollama/ollama) were reviewed for optional local language-model connectivity. No upstream server/source or model weights are bundled through those references.
- [AI Town](https://github.com/a16z-infra/ai-town) and [Generative Agents](https://github.com/joonspk-research/generative_agents) were reviewed for autonomous resident concepts, not imported as a result of being cited.
- [Mysterious Murder](https://github.com/corinnaj/mysterious-murder), © 2018–2019 Corinna Jaschek and Tom Beckmann, and [Cold Truth](https://github.com/elliefox-ai/cold-truth), © 2026 Ellie-Fox-AI, informed crime and evidence design. The previously documented v0.6.53 murder-case implementation was original JavaScript, not copied upstream source.
- [AI Murder Mystery v2](https://github.com/DilanRG/ai-murder-mystery-v2) and [Murdle / TheDeductionist](https://github.com/cacheparadox/Murdle) were examined as design references. No source is represented as incorporated; unverified rights must not be treated as permissions.
- Optional local AI models, if acquired by the user, have their **own model-weight terms**, independent of the code/server licenses.

Being listed under research is an acknowledgment of the reference, **not a claim that the project is installed, copied, owned, licensed for distribution, or endorsed by its authors**.

## New library and game-engine attribution requirements

Before incorporating any external project into the game or a public build, we must identify its real copyright owner, source URL, exact revision, license and license text, modifications, transitive components, art/audio rights and redistribution obligations. Preserve the full required notices; record what is **actually included**, not what we only considered. All candidates with unclear terms remain research-only until resolved.

The distributable Linux build and an eventual **in-game Legal & Credits view** must make adopted third-party acknowledgments accessible. If a library is replaced or removed, its status in the credits must be updated. For the exact required fields and a release checklist, see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Historical imagery, recordings and other assets

Some source files or runtime preparation instructions point to external images or audio. Their presence or URL **does not establish** public-domain status, authorship, redistribution rights or a complete attribution. Each map, recording, music track, font and image must be independently audited and credited under its proper terms before a public release. The existing approved Washington map image must not be changed without the owner's approval.

## Contact

For rights, permission, licensing, takedown or correction requests, contact the repository maintainer via [dereksparks1982 on GitHub](https://github.com/dereksparks1982). No private email address is published here.

**This document is a plain-language rights and credit summary, not a replacement for the applicable license documents or legal advice.**
