'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'career-shell.js'),'utf8');
const css=fs.readFileSync(path.join(root,'career-shell.css'),'utf8');
assert.ok(src.includes("const bookTitle=route.id==='industrialist'?'Business Ledger'"),
 'Charles has one Business Ledger title on the physical desk book');
assert.equal((src.match(/'Business Ledger'/g)||[]).length,1,
 'Business Ledger is defined once for the executive desk');
assert.ok(src.includes('id="careerDeskLedger" class="career-desk-ledger"'),
 'The desk book is a real semantic button, not inert decoration');
assert.ok(src.includes('title="Open ${escape(bookTitle)}" aria-label="Open ${escape(bookTitle)}"'),
 'Accessible desk book explains its action');
assert.ok(src.includes("desk.querySelector('#careerDeskLedger').onclick=()=>window.FE_PERSONAL_BOOK?.open?.()"),
 'Clicking the sole desk book opens the complete existing personal-book records');
assert.ok(!src.includes('careerDeskJournal') && !src.includes('career-desk-sheet'),
 'No separate ledger button or faux report sheets compete with the physical book');
assert.ok(src.includes('id="careerDeskMap"')&&src.includes('id="careerDeskMapButton"'),
 'Existing map controls and office navigation remain intact');
const deskArt=src.slice(src.indexOf('<div class="career-desk-art"'),src.indexOf('<p class="career-desk-summary">'));
const blotter=deskArt.slice(deskArt.indexOf('<div class="career-desk-blotter">'),deskArt.indexOf('</div>',deskArt.indexOf('<div class="career-desk-blotter">')));
assert.equal((deskArt.match(/id="careerDeskLedger"/g)||[]).length,1,'One and only one visible ledger on the desk');
assert.ok(blotter.includes('id="careerDeskLedger"'),'Business Ledger must be a book ON the green blotter');
assert.ok(blotter.includes('id="careerDeskMap"'),'Original Washington map remains beside that book');
assert.ok(blotter.indexOf('id="careerDeskMap"')<blotter.indexOf('id="careerDeskLedger"'),
 'Replace the previous right-side Reports & Notes with the book to the right of the map');
assert.ok(deskArt.indexOf('id="careerDeskLedger"')>deskArt.indexOf('career-desk-blotter'),
 'The old far-left oversized ledger banner is forbidden');
assert.ok(!deskArt.includes('WASHINGTON · PRIVATE PAPERS')&&!deskArt.includes('<small>'),
 'No faux stationery poster or giant inscription competes with the book');
assert.match(css,/flex:0 0 112px;width:112px;height:132px/,
 'The ledger is compact, not a 35-percent-width paper placard');
assert.ok(css.includes('career-desk-book-spine'),'The ledger is drawn as a bound book with a spine');
assert.ok(src.includes("'Coffee Break':'Spend 5 Minutes'"),
 'The executive desk has Coffee Break while other career time controls remain unchanged');
assert.ok(src.includes("advanceWorldTime(300,true)"),
 'Refreshments use five minutes of actual world time');
assert.ok(src.includes('data-desk-refreshment="coffee"')&&src.includes('data-desk-refreshment="water"')
 &&src.includes('data-desk-refreshment="snack"'),
 'Break uses coffee, water and ordinary period snacks, no vending machines');
assert.ok(src.includes("window.FE_NPC_AI?.visibleAt?.('factory')")&&src.includes('window.FE_NPC_CARD?.open?.('),
 'Only actual nearby NPCs open their existing conversation cards');
assert.ok(!src.includes("+' · '+clockText()+' remaining'"),
 'The executive desk must not duplicate the time remaining already shown in the top bar');
assert.ok(src.includes('id="careerDeskEnterLocation"')&&src.includes('id="careerDeskWait"')&&src.includes('id="careerDeskMenu"'),
 'Existing travel, time, and menu controls stay intact');
assert.ok(css.includes('.career-desk-ledger:focus-visible'),
 'The business book remains keyboard-focusable with a visible focus indication');
assert.ok(!css.includes('.career-desk-sheet'),
 'Retired decorative paper style is not left in the active desktop stylesheet');
const pages=fs.readFileSync(path.join(root,'personal-book-pages.js'),'utf8');
assert.ok(pages.includes("industrialist:Object.freeze({title:'BUSINESS LEDGER'"),
 'The book uses the existing account and personal-record content, not a replacement UI');
console.log('PASS single clickable Business Ledger, no duplicate executive papers or button');
