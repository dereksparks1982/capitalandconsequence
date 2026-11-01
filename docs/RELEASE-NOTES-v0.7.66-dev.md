# Capital & Consequence · v0.7.66-dev · Build 10/10
November 1, 2026. Source development only, not a release.

The previously committed food catalog, pantry/larder/icebox, cookbooks, recipe cooking, baking skills, physical bakery goods and standing wagon orders are now loaded from index.html into the game. The grocery catalog loads before WashingtonCommerce so its market stocks include the expanded goods; all other modules load before app.js.

The food panels render inside the existing home kitchen and actual provision markets only. Normal player actions validate the current room and profile, reject developer previews and paused/report states, and spend the game's one saved clock (1 minute to store, take, discard, pack, set an order or trade a book/bakery item; full recipe or book study time; 10 minutes to eat). No free duplicated goods, teleporting, desk-market purchases, or duplicate wagon receipts are intended.

Wagons settle through actual world-clock advancement, subtract physical shop inventory and personal cash, and credit the appropriate merchant accounts. The associated source test covers script ordering and data receipts.

No artwork, map coordinates, pin geometry, room-builder layout, GitHub Actions, ZIP, executable or accepted tag was changed. Full local Node regression suite and hands-on Ubuntu Electron acceptance are still required.
