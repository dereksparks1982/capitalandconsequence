'use strict';
const assert=require('node:assert/strict'),bridge=require('../calendar-bridge.js');
const world=require('../shared-world.js'),history=require('../life-history.js');
const edmund={sharedWorldId:'wtest1',phase:'day',gameDate:'1878-01-02',turnSerial:1,characterRoute:'wardman',
 npcSimulation:{version:1,agents:{a:{place:'hillsdale'}}},otherLives:{version:1,actors:{}}};
bridge.start(edmund,'1878-01-02');
const w=world.create(edmund.sharedWorldId,edmund);
assert.equal(world.recordEvent(w,{id:'body-1',type:'incident',summary:'Observed an incident'}).status,'recorded');
assert.equal(world.recordEvent(w,{id:'body-1',type:'incident',summary:'Observed an incident'}).status,'duplicate');
const sam={sharedWorldId:'wtest1',phase:'day',gameDate:'1878-01-02',characterRoute:'investigator',privateNote:'Only Sam knows this'};
world.attach(sam,w);assert.equal(sam.privateNote,'Only Sam knows this');
assert.equal(sam.lifeHistory,undefined);assert.equal(sam.worldCalendar.worldMinute,w.clock.worldMinute);
bridge.spend(sam,600);const next=world.capture(sam,w);
assert.equal(next.clock.worldMinute,w.clock.worldMinute+10);
assert.throws(()=>world.capture(edmund,next),/rewind/);
assert.equal(history.record(edmund,{id:'round-1',source:'ward',text:'Filed the linen round'}).status,'recorded');
assert.equal(history.record(edmund,{id:'round-1',source:'ward',text:'Filed the linen round'}).status,'duplicate');
assert.equal(history.pages(edmund)[0].items.length,1);assert.equal(sam.lifeHistory,undefined);
console.log('PASS shared time with separate minds, persistent event identity and private life history');
