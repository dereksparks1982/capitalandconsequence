'use strict';
const assert=require('node:assert/strict');
const social=require('../npc-social.js');
const effects=require('../npc-social-consequences.js');
const memory=require('../npc-memory.js');
const agency=require('../npc-agency.js');
const personality=require('../npc-personality.js');
const defs=[
 {id:'chenMei',traits:{sociability:76,caution:65,ambition:62},goals:['maintain-business','develop-contacts']},
 {id:'liWen',traits:{sociability:56,caution:62,ambition:74},goals:['maintain-business','find-new-buyers']},
 {id:'pavelOrlov',traits:{sociability:70,caution:69,ambition:78},goals:['develop-trade']}
];
function make(seed){
 const agents={};
 for(const d of defs){
  agents[d.id]={id:d.id,status:'present',locationId:'oldChinatown',
   roomId:'market-street',relationships:{},social:null,
   needs:{version:1,mood:60,hunger:25,energy:80}};
 }
 // The third resident is not in the same physical room.
 agents.pavelOrlov.roomId='traders-office';
 const world={seed,agents,events:[]};
 return {npcSimulation:world};
}
const context={key:'1878-01-02|1',turn:1,date:'1878-01-02'};
function genuine(kind){
 for(let seed=0;seed<3000;seed++){
  const save=make(seed),world=save.npcSimulation;
  const records=social.meet(world,defs,context);
  if(records.some(r=>r.kind===kind))return {save,world,record:records.find(r=>r.kind===kind)};
 }
 throw Error('Could not find deterministic '+kind+' encounter');
}
for(const kind of ['conversation','assistance','disagreement']){
 const {save,world,record}=genuine(kind);
 assert.equal(record.type,'private-encounter');
 assert.equal(world.social.history.some(r=>r.id===record.id),true,
  'Record must originate in the real social engine');
 const before=JSON.stringify(world.agents.chenMei.relationships);
 const beforePartner=JSON.stringify(world.agents.liWen.relationships);
 assert.equal(effects.apply(save,world,{...record,id:'fake|'+record.id}),false,
  'Pretending to know a private encounter never changes state');
 assert.equal(save.npcLongMemory,undefined,'No false private memory');
 assert.equal(effects.apply(save,world,record),true,'Recorded encounter changes individual experiences');
 const change=kind==='disagreement'?-6:kind==='assistance'?5:2;
 assert.equal(world.agents.chenMei.needs.mood,60+change);
 assert.equal(world.agents.liWen.needs.mood,60+change);
 assert.equal(world.agents.pavelOrlov.needs.mood,60,'Remote people learn nothing');
 assert.equal(JSON.stringify(world.agents.chenMei.relationships),before,
  'Social core already settled trust; no second relationship payout');
 assert.equal(JSON.stringify(world.agents.liWen.relationships),beforePartner);
 assert.equal(memory.entries(save,'chenMei').length,1);
 assert.equal(memory.entries(save,'liWen').length,1);
 assert.equal(memory.entries(save,'pavelOrlov').length,0);
 const own=memory.entries(save,'chenMei')[0];
 assert.equal(own.withId,'liWen');
 assert.equal(own.verified,true);
 assert.equal(own.source,'firsthand-same-room');
 assert.equal(own.place,'oldChinatown');
 assert.equal(effects.apply(save,world,record),false,'Same period cannot improve mood twice');
 const reloaded=JSON.parse(JSON.stringify(save));
 const snapshot=JSON.stringify(reloaded);
 assert.equal(effects.apply(reloaded,reloaded.npcSimulation,record),false,
  'Reloading a saved meeting must not replay its outcomes');
 assert.equal(JSON.stringify(reloaded),snapshot);
 const stranger={...record,partnerId:'pavelOrlov'};
 assert.equal(effects.apply(save,world,stranger),false,'A new partner cannot be forged');
}
const {save,world,record}=genuine('assistance');
world.agents.liWen.roomId='private-bedroom';
assert.equal(effects.apply(save,world,record),false,
 'Different actual rooms cannot provide firsthand memory');
assert.equal(save.npcLongMemory,undefined);
world.agents.liWen.roomId='market-street';
assert.equal(effects.apply(save,world,record),true,
 'A valid still-co-present actual encounter may be processed once');
const ordinary={energy:80,needs:{mood:65,hunger:25},relationships:{}};
const happy={energy:80,needs:{mood:95,hunger:25},relationships:{}};
const greet={date:'1878-01-02',topic:'conversation'};
assert.ok(personality.approach(defs[0],happy,{id:'industrialist'},greet).score>
 personality.approach(defs[0],ordinary,{id:'industrialist'},greet).score,
 'A resident in better actual spirits becomes more approachable');
const safe={knowledge:{version:1,records:[]}};
const base=agency.observe(defs[0],{energy:80,memories:[],social:{encounters:1}}, {},safe);
const argumentative=agency.observe(defs[0],{
 energy:80,memories:[],social:{encounters:1,disagreements:4}
}, {},safe);
assert.ok(argumentative.risk>base.risk,'Recorded disputes affect future caution');
assert.ok(argumentative.social<base.social,'Disputes alter private social priorities');
const supportive=agency.observe(defs[0],{
 energy:80,memories:[],social:{encounters:1,assists:4}
}, {},safe);
assert.ok(supportive.social>base.social,'Recorded assistance informs independent sociability');
console.log('PASS actual social encounters affect participants only: mood, lasting firsthand memory, caution, saved replay and privacy');
