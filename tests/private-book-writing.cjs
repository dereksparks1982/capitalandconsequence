'use strict';
/* Regression for the fourth-page navigation and per-character handwritten entries. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.join(__dirname,'..');
const root={},scope={window:root,globalThis:root,module:{exports:{}}};
vm.runInNewContext(fs.readFileSync(path.join(base,'personal-book-pages.js'),'utf8'),scope,{filename:'personal-book-pages.js'});
const build=root.FE_PERSONAL_BOOK_PAGES.buildPages;
const record={characterRoute:'industrialist',gameDate:'1878-01-02',companyCash:2500,personalCash:600,
 debt:0,workers:1,personalBookNotes:'testing',
 personalBookEntries:[{id:'entry-test',date:'1878-01-02',text:'A second test entry.'}]};
let pages=build(record);
assert.equal(pages.at(-1).id,'notes','blank writing page stays available');
assert.ok(pages.some(p=>p.id==='private-legacy'&&p.paragraphs.includes('testing')),'old fourth-page notes remain visible');
assert.ok(pages.some(p=>p.id==='private-entry:entry-test'&&p.paragraphs.includes('A second test entry.')),'new dated notes become permanent pages');
assert.equal(pages.find(p=>p.id==='private-entry:entry-test').kicker,'1878-01-02');
assert.equal(pages.at(-1).editable,true);
assert.equal(pages.at(-1).note,'','new entry starts blank; saved text stays on previous page');
assert.equal(build({...record,personalBookEntries:[...record.personalBookEntries,
 {id:'later',date:'1878-01-03',text:'Another day.'}]}).filter(p=>p.id.startsWith('private-entry:')).length,2);
const many={...record,personalBookNotes:'',personalBookEntries:Array.from({length:260},(_,i)=>({
 id:'n'+i,date:'1878-02-02',text:'Entry '+i}))};
pages=build(many);
assert.equal(pages.filter(p=>p.id.startsWith('private-entry:')).length,260,'never silently drop first 10 of 260 entries');
const other=build({characterRoute:'wardman',gameDate:'1878-01-02',personalBookNotes:'',personalBookEntries:[]});
assert.equal(other.some(p=>p.paragraphs?.includes('testing')),false,'writing is per character, not world case evidence');
const ui=fs.readFileSync(path.join(base,'personal-book-ui.js'),'utf8');
assert.match(ui,/Page '\+\(i\+1\)/,'section menu should list every page');
assert.doesNotMatch(ui,/if\(i%2!==0\)return/,'odd-numbered index pages must not be omitted');
assert.match(ui,/personalBookEntries/,'Save Entry should persist appended records');
assert.match(ui,/Save Entry to Ledger/,'explicit entry-saving button');
console.log('PASS private ledger saved entry pages, legacy recovery and fourth-page navigation source contract');
