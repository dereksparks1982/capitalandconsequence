'use strict';
const assert=require('node:assert/strict');
globalThis.FE_MISSIONS=require('../mission-engine.js');
globalThis.FE_LIFE_HISTORY=require('../life-history.js');
const scene=require('../peacock-story.js'),campaign=require('../main-story.js');
const loc=scene.VENUE,room=scene.ROOM;
const make=()=>({characterRoute:'criminal',phase:'night',paused:false,
 gameDate:'1878-01-06',personalCash:4.35,doormanDuty:{totalSegments:2,pending:null}});
function choose(s,id){
 const p=scene.preview(s,id,loc,room);
 assert.equal(p.ok,true,id+': '+p.reason);
 assert.equal(scene.apply(s,id,loc,room,{spentSeconds:0}).ok,false);
 const out=scene.apply(s,id,loc,room,{spentSeconds:p.seconds});
 assert.equal(out.ok,true,id+': '+out.reason);return out;
}
const novice=make();novice.doormanDuty.totalSegments=1;
assert.equal(scene.preview(novice,'hear',loc,room).ok,false);
assert.equal(scene.preview({...make(),characterRoute:'wardman'},'hear',loc,room).ok,false);
assert.equal(scene.preview({...make(),phase:'day'},'hear',loc,room).ok,false);
assert.equal(scene.preview(make(),'hear','factory',room).ok,false);
assert.equal(scene.preview(make(),'hear',loc,'wrong-room').ok,false);
assert.equal(scene.preview(make(),'hear',loc,room,{dev:true}).ok,false);
const busy=make();busy.doormanDuty.pending={id:'DOOR-002'};
assert.equal(scene.preview(busy,'hear',loc,room).ok,false);
for(const path of ['return','manager','sell']){
 const s=make();
 assert.equal(scene.preview(s,path,loc,room).ok,false);
 choose(s,'hear');
 assert.equal(FE_MISSIONS.find(s,scene.ID).stage,'first-contact');
 assert.equal(scene.preview(s,path,loc,room).ok,false,'Must return later night');
 s.gameDate='1878-01-07';
 choose(s,path);
 assert.equal(FE_MISSIONS.find(s,scene.ID).stage,'awaiting-return');
 assert.equal(s.personalCash,path==='sell'?6.85:4.35,'Only documented sale adds cash');
 assert.equal(scene.preview(s,'followUp',loc,room).ok,false);
 s.gameDate='1878-01-08';choose(s,'followUp');
 assert.equal(FE_MISSIONS.find(s,scene.ID).status,'completed');
 assert.equal(scene.summary(s).events.length,3);
 assert.equal(campaign.inspect(s).acts[1].status,'milestone-recorded');
 assert.equal(scene.preview(s,'sell',loc,room).ok,false);
 assert.equal(scene.preview(s,'followUp',loc,room).ok,false);
 assert.equal(s.personalCash,path==='sell'?6.85:4.35,'No duplicate payout');
 assert.equal(s.lifeHistory.events.length,3);
 const saved=JSON.parse(JSON.stringify(s));
 assert.equal(scene.summary(saved).outcome,scene.summary(s).outcome);
 assert.equal(scene.preview(saved,'hear',loc,room).ok,false,'No reload reroll');
 assert.equal(saved.sharedWorldPoliceEvidence,undefined,'Never invent an official police report');
}
console.log('PASS Peacock three-night choices, clock, room, trust, single payout, mission log and private provenance');
