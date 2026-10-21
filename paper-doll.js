/* Federal Electric v0.6.5: approved paper doll PNG and two placeholder pocket windows.
   Original illustration is unchanged; dressing and item persistence come later. */
(function () {
  'use strict';

  const IMAGE_PATH = 'assets/artwork/characters/paperdolls/paperdoll.png';
  let overlay = null;
  let pocket = null;
  let lastFocus = null;

  function buildUI() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'fePaperDoll';
    overlay.className = 'fe-paper-doll';
    overlay.hidden = true;
    overlay.innerHTML = 
      '<section class="fe-paper-doll__panel" role="dialog" aria-modal="true" aria-labelledby="fePaperDollTitle">' +
        '<header class="fe-paper-doll__header">' +
          '<div><h2 id="fePaperDollTitle">Personal Effects</h2><small>Federal Electric · Washington, D.C. · 1890</small></div>' +
          '<button id="fePaperDollClose" class="fe-paper-doll__close" type="button" aria-label="Close paper doll">×</button>' +
        '</header>' +
        '<div class="fe-paper-doll__figure">' +
          '<img id="fePaperDollArtwork" alt="Approved Federal Electric character paper doll with equipped clothing and accessories" src="' + IMAGE_PATH + '">' +
          '<p id="fePaperDollArtworkMissing" class="fe-paper-doll__missing" role="status" hidden>The approved paper-doll artwork is missing. Check the installed game files.</p>' +
        '</div>' +
        '<div class="fe-paper-doll__pocket-actions" aria-label="Clothing pockets">' +
          '<button type="button" data-pocket="left" aria-label="Open left pocket">Left Pocket</button>' +
          '<button type="button" data-pocket="right" aria-label="Open right pocket">Right Pocket</button>' +
        '</div>' +
        '<section id="fePaperDollPocket" class="fe-paper-doll__pocket" aria-labelledby="fePaperDollPocketTitle" hidden>' +
          '<div class="fe-paper-doll__pocket-head"><h3 id="fePaperDollPocketTitle">Pocket</h3>' +
            '<button id="fePaperDollPocketClose" type="button" aria-label="Close pocket">×</button></div>' +
          '<div class="fe-paper-doll__pocket-interior"><p>This pocket is empty.</p></div>' +
        '</section>' +
      '</section>';
    document.body.appendChild(overlay);
    pocket = document.getElementById('fePaperDollPocket');
    const art = document.getElementById('fePaperDollArtwork');
    const missing = document.getElementById('fePaperDollArtworkMissing');
    art.addEventListener('error', function () { art.hidden = true; missing.hidden = false; });
    art.addEventListener('load', function () { art.hidden = false; missing.hidden = true; });
    if (art.complete && !art.naturalWidth) {
      art.hidden = true;
      missing.hidden = false;
    }
    document.getElementById('fePaperDollClose').addEventListener('click', close);
    document.getElementById('fePaperDollPocketClose').addEventListener('click', closePocket);
    overlay.querySelectorAll('[data-pocket]').forEach(function (button) {
      button.addEventListener('click', function () { openPocket(button.dataset.pocket); });
    });
  }

  function isOpen() { return Boolean(overlay && !overlay.hidden); }

  function open() {
    if (typeof activeProfileId === 'function' && !activeProfileId()) return false;
    buildUI();
    if (isOpen()) return true;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('fe-paper-doll-open');
    document.getElementById('fePaperDollClose').focus();
    return true;
  }

  function closePocket() {
    if (pocket) pocket.hidden = true;
    if (overlay && !overlay.hidden) {
      const button = overlay.querySelector('[data-pocket][aria-expanded="true"]');
      if (button) button.focus();
    }
    if (overlay) overlay.querySelectorAll('[data-pocket]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
  }

  function openPocket(side) {
    if (side !== 'left' && side !== 'right') return false;
    if (!isOpen()) return false;
    pocket.hidden = false;
    document.getElementById('fePaperDollPocketTitle').textContent =
      side === 'left' ? 'Left Pocket' : 'Right Pocket';
    overlay.querySelectorAll('[data-pocket]').forEach(function (b) {
      b.setAttribute('aria-expanded', String(b.dataset.pocket === side));
    });
    document.getElementById('fePaperDollPocketClose').focus();
    return true;
  }

  function close() {
    if (!isOpen()) return;
    closePocket();
    overlay.hidden = true;
    document.body.classList.remove('fe-paper-doll-open');
    if (lastFocus && typeof lastFocus.focus === 'function' && lastFocus.isConnected) lastFocus.focus();
    lastFocus = null;
  }

  function toggle() { if (isOpen()) close(); else open(); }

  function editingText(target) {
    if (!target || typeof target.closest !== 'function') return false;
    return Boolean(target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'));
  }

  // Capturing Escape prevents the room and map listeners underneath the doll
  // from inadvertently closing or changing the player's location.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
      return;
    }
    if (event.code !== 'KeyP' && String(event.key).toLowerCase() !== 'p') return;
    if (event.altKey || event.ctrlKey || event.metaKey || editingText(event.target)) return;
    if (event.repeat) return;
    if (!isOpen() && typeof activeProfileId === 'function' && !activeProfileId()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    toggle();
  }, true);

  window.FE_PAPER_DOLL = Object.freeze({
    open: open, close: close, toggle: toggle, openPocket: openPocket,
    isOpen: isOpen,
    imagePath: IMAGE_PATH
  });
}());
