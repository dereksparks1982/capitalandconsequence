# Capital & Consequence v0.7.8 Beta | Traveled Street Trail
**Development checkpoint: 29 October 2026**

## Visual improvement
- The Capital Travel animation now draws a second, copper-colored **completed street trail** under the moving pawn. The original light dotted route remains the untraveled itinerary.
- The trail follows the exact same original-guide-coordinate route used for the token, including modeled diagonal avenues and temporary doorway access lines.
- Progress advances along the **length of the path in native 2048 × 1159 map pixels**, not a simple fraction of screen width or time spent on individual turns.
- The map redraws both full and completed routes **after** following the traveler with the camera, preventing a one-frame mismatch during zoom or pan.
- At 100% the token snaps precisely to the destination pin with no floating-point visual drift. All temporary overlays are discarded on arrival or cancellation.
- New `routePrefix(points,fraction)` and improved `positionAt(points,fraction)` handle malformed, empty or out-of-range input without changing the original pin data.

## Tests
- `tests/capital-travel-route-progress.cjs`: 21 progress positions, monotonic traveled distance, trail endpoint matches pawn, exact arrival and no map changes.
- `tests/capital-travel-animation.cjs`: final highlighted line matches full route, correct room-side destination and cancellation.
- `tests/capital-travel-follow-camera.cjs`: zooming mid-trip keeps the line and pawn on the same camera transform.

The focused tests passed in an isolated JavaScript source harness. Full offline Node and Ubuntu Electron playthrough remain pending. No GitHub Actions were invoked and no installer or executable ZIP was generated.

## Boundaries
All 40 existing map pin defaults, the original permanent Washington artwork, approved UI layout, the game's travel time ledger, horse/carriage ownership and world-clock rules remain unchanged. The first-pass street graph remains **an approximate road model**, not a guarantee of visually correct building avoidance, measured miles or confirmed 1878 road locations. No compatibility with old saves is required; autosave for new games remains.
