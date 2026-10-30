# Federal Electric artwork

Images and visual resources belong under `assets/artwork/`, while sounds remain under `assets/audio/`.

- `branding/logos/`
- `branding/stamps/`
- `branding/banners/`
- `locations/offices/`
- `locations/rooms/`
- `maps/`
- `newspapers/`
- `effects/`
- `characters/paperdolls/`
- `characters/clothing/`
- `characters/accessories/`
- `objects/items/`
- `objects/pockets/`
- `interfaces/`

The 16 root artwork assets have been moved without altering their original binary SHA. Their earlier/alternate approved files are retained. The original Washington map is now tracked in Git at `assets/artwork/maps/title-map-1938.jpg`. Its approved artwork must never change. `npm run audit:bundle` checks its Git blob identity and local media paths; no network download is required.

The approved paper-doll picture belongs under `characters/paperdolls/` once its exact bytes are supplied; no art has been regenerated in this housekeeping slice.


### Paper doll image selection, v0.6.5

`characters/paperdolls/paperdoll.png` is the approved in-game picture. `characters/paperdolls/Steampunk Paper Doll Equipment Screen.png` is retained unchanged as an alternate/source artwork. The current interface uses the original image exactly as provided; it does not crop, repaint or redraw it.
