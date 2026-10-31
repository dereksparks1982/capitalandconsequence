'use strict';
const assert=require('node:assert/strict');
globalThis.FE_MISSIONS=require('../mission-engine.js');
globalThis.FE_LIFE_HISTORY=require('../life-history.js');
const debts=require('../peacock-debts.js'),main=require('../main-story.js');
const make=()=>({characterRoute:'criminal',phase:'night',paused:false,gameDate:'1878-01-12',
 personalCash:4,peacockNetwork:{stage:'resolved',completedAt:'1878-01-11'}});
const place={locationId:debts.VENUE,roomId:debts.ROOM};
function run(s,id){const p=debts.preview(s,id,place.locationId,place.roomId);
 assert.equal(p.ok,true,id+': '+p.reason);
 assert.equal(debts.apply(s,id,place.locationId,place.roomId,{spentSeconds:0}).ok,false);
 const r=debts.apply(s,id,place.locationId,place.roomId,{spentSeconds:p.seconds});
 assert.equal(r.ok,true,id+': '+r.reason);return r;}
for(const id of ['settle','defy','disclose']){
 const s=make();
 assert.equal(debts.preview(s,id,place.locationId,place.roomId).ok,false);
 assert.equal(debts.preview({...s,characterRoute:'industrialist'},'summons',place.locationId,place.roomId).ok,false);
 assert.equal(debts.preview(s,'summons','factory',place.roomId).ok,false);
 run(s,'summons');
 assert.equal(debts.preview(s,'summons',place.locationId,place.roomId).ok,false);
 s.gameDate='1878-01-13';
 run(s,id);
 assert.equal(s.personalCash,id==='settle'?1:4);
 assert.equal(debts.preview(s,'consequence',place.locationId,place.roomId).ok,false);
 s.gameDate='1878-01-14';run(s,'consequence');
 assert.equal(main.inspect(s).acts[3].status,'milestone-recorded');
 assert.equal(FE_MISSIONS.find(s,debts.ID).status,'completed');
 assert.equal(s.lifeHistory.events.length,3);
 assert.equal(debts.preview(s,id,place.locationId,place.roomId).ok,false);
 assert.equal(s.personalCash,id==='settle'?1:4);
 const copy=JSON.parse(JSON.stringify(s));
 assert.equal(debts.summary(copy).outcome,debts.summary(s).outcome);
 assert.equal(copy.worldTruth,undefined);
}
const poor=make();poor.personalCash=1;run(poor,'summons');poor.gameDate='1878-01-13';
assert.equal(debts.preview(poor,'settle',place.locationId,place.roomId).ok,false);
assert.equal(debts.preview(poor,'defy',place.locationId,place.roomId).ok,true);
console.log('PASS Eli fourth chapter: staged choices, insufficient cash, time and location limits, private outcomes and persistence');
