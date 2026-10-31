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
