'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const second=require('../tarot-second-sight.js');
const interpretation=require('../tarot-interpretation.js');
const deck=require('../tarot-deck.js');
const minute=Math.floor(Date.UTC(1878,4,5,15)/60000);
function save(route='criminal'){
 return {characterRoute:route,worldCalendar:{worldMinute:minute},worldCalendarStatus:'ready',
  personalCash:50,companyCash:100,characterNeeds:{meters:{health:90,energy:75}},notes:[]};
}
const clean=save();
assert.deepEqual(second.trueSecrets(clean),[]);
const silent=deck.draw('private-reader','three');
const first={encounterId:'reading-crime',cards:silent.cards,minute};
assert.equal(second.vision(clean,first),null,'unrecorded crimes cannot be invented by tarot');
const recorded=second.record(clean,{id:'secret-taking-1',kind:'theft',subjectId:'npc:merchant',minute:minute-30});
assert.equal(recorded.ok,true);
assert.equal(second.record(clean,{id:'secret-taking-1',kind:'theft'}).duplicate,true);
assert.equal(second.ledger(clean).events.length,1);
assert.equal(second.trueSecrets(clean)[0].kind,'theft');
const encounter=[...Array(25)].map((_,i)=>({...first,encounterId:'crime-reading-'+i})).find(x=>second.vision(clean,x));
assert.ok(encounter,'real private events sometimes result in uncanny second sight');
const reading=interpretation.interpret(clean,encounter);
assert.equal(reading.ok,true);
assert.ok(reading.reading.passages.some(x=>x.meaning.includes(second.HINTS.theft.saying)));
assert.equal(reading.reading.visionKey,'private:secret-taking-1');
const locked=JSON.stringify(reading.reading);
second.record(clean,{id:'hidden-betrayal-2',kind:'betrayal',minute});
assert.equal(JSON.stringify(interpretation.interpret(clean,encounter).reading),locked,
 'historical tarot readings do not retcon themselves');
assert.equal(second.ledger(clean).events.length,2,'a reading never reports a private event as public evidence');
const company=save('industrialist');
company.unaccountedFunds=100;
assert.equal(second.trueSecrets(company).some(s=>s.kind==='fraud'),true);
const wager=save('criminal');
wager.underworld={events:{privateFight:{bet:{settled:true}},cockfight:{bet:null}}};
assert.equal(second.trueSecrets(wager).some(s=>s.kind==='illicitWager'),true);
const asylum=save('wardman'),world={incidents:{'asylum-ward-1':{status:'reported'}},
 worldTruth:{'asylum-ward-1':{at:'1878-05-04T11:00',culpritRole:'outside-visitor',victimId:'victim-1'}}};
assert.equal(second.trueSecrets(asylum).some(e=>e.kind==='asylum'),false);
assert.equal(second.trueSecrets(asylum,world).some(e=>e.kind==='asylum'),true);
assert.equal(JSON.stringify(second.trueSecrets(asylum,world)).includes('outside-visitor'),false,
 'hidden murderer identity must not be shown in a psychic reading');
const before=save();
second.record(before,{id:'future-event',kind:'killing',minute:minute+60});
assert.equal(second.trueSecrets(before).some(e=>e.kind==='killing'),false,
 'reading cannot see a future event that has not occurred');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert.match(source,/function tarotSharedWorld\(/);
assert.match(source,/sharedWorld:tarotSharedWorld\(\)/);
assert.ok(html.indexOf('tarot-second-sight.js?v=')<html.indexOf('tarot-interpretation.js?v='));
console.log('PASS rare confirmed private visions, frozen character readings, no fabricated crimes, world truth remains private');
