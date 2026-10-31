'use strict';
const assert=require('node:assert/strict');
globalThis.FE_MISSIONS=require('../mission-engine.js');
globalThis.FE_LIFE_HISTORY=require('../life-history.js');
const n=require('../peacock-network.js'),main=require('../main-story.js');
const make=()=>({characterRoute:'criminal',phase:'night',paused:false,gameDate:'1878-01-09',
 personalCash:3,peacockStory:{stage:'resolved',finishedAt:'1878-01-08'}});
function act(s,id){
 const preview=n.preview(s,id,n.VENUE,n.ROOM);
 assert.equal(preview.ok,true,id+': '+preview.reason);
 assert.equal(n.apply(s,id,n.VENUE,n.ROOM,{spentSeconds:0}).ok,false);
 assert.equal(n.apply(s,id,n.VENUE,n.ROOM,{spentSeconds:preview.seconds}).ok,true);
}
const unready=make();unready.peacockStory.stage='offered';
assert.equal(n.preview(unready,'meet',n.VENUE,n.ROOM).ok,false);
assert.equal(n.preview({...make(),phase:'day'},'meet',n.VENUE,n.ROOM).ok,false);
assert.equal(n.preview({...make(),characterRoute:'wardman'},'meet',n.VENUE,n.ROOM).ok,false);
assert.equal(n.preview(make(),'meet','factory',n.ROOM).ok,false);
for(const decision of ['protect','leverage','report']){
 const s=make();act(s,'meet');
 assert.equal(n.preview(s,decision,n.VENUE,n.ROOM).ok,false);
 assert.equal(FE_MISSIONS.find(s,n.ID).stage,'inquiry');
 s.gameDate='1878-01-10';act(s,decision);
 assert.equal(FE_MISSIONS.find(s,n.ID).stage,'waiting');
 assert.equal(s.personalCash,decision==='leverage'?8:3);
 assert.equal(n.preview(s,'consequence',n.VENUE,n.ROOM).ok,false);
 s.gameDate='1878-01-11';act(s,'consequence');
 assert.equal(FE_MISSIONS.find(s,n.ID).status,'completed');
 assert.equal(main.inspect(s).acts[2].status,'milestone-recorded');
 assert.equal(n.summary(s).events.length,3);
 assert.equal(n.preview(s,'leverage',n.VENUE,n.ROOM).ok,false);
 assert.equal(s.personalCash,decision==='leverage'?8:3,'No second bribe');
 const copy=JSON.parse(JSON.stringify(s));
 assert.equal(n.summary(copy).outcome,n.summary(s).outcome);
 assert.equal(copy.worldTruth,undefined);
}
console.log('PASS Eli Act III earned contacts, three nights, privacy, distinct outcomes, no repeated cash');
