'use strict';
const assert=require('node:assert/strict'),plans=require('../npc-life-plans.js');
const def={id:'chenMei',goals:['maintain-business','develop-contacts']};
const situation=(goal,workScore,contactScore,rest=false)=>({
 goal,score:goal==='maintain-business'?workScore:contactScore,
 reason:rest?'fatigue':'opportunity',rest,
 scores:[{goal:'maintain-business',score:workScore},
  {goal:'develop-contacts',score:contactScore}]
});
const actor={energy:80,relationships:{},memories:[]};
const initial=plans.commit(def,actor,situation('maintain-business',51,43),'1878-01-02|0');
assert.equal(initial.goal,'maintain-business');
assert.equal(actor.lifePlan.status,'considering');
const held=plans.commit(def,actor,situation('develop-contacts',50,56),'1878-01-02|1');
assert.equal(held.goal,'maintain-business','Small shifts retain a private purpose');
assert.equal(held.reason,'sustained-commitment');
const snapshot=JSON.stringify(actor.lifePlan);
assert.deepEqual(plans.commit(def,actor,situation('develop-contacts',50,56),'1878-01-02|1'),held);
assert.equal(JSON.stringify(actor.lifePlan),snapshot,'Repeat decision must be a pure replay');
assert.equal(plans.record(def,actor,held,{kind:'work',locationId:'oldChinatown'},
 {locationId:'oldChinatown',roomId:'market-street'},'1878-01-02|1'),true);
assert.equal(actor.lifePlan.attempts,1);
assert.equal(actor.lifePlan.status,'first-observed-effort');
assert.equal(plans.record(def,actor,held,{kind:'work',locationId:'oldChinatown'},
 {locationId:'oldChinatown',roomId:'market-street'},'1878-01-02|1'),false);
assert.equal(plans.record(def,actor,held,{kind:'personal',locationId:'star'},
 {locationId:'oldChinatown',roomId:'market-street'},'1878-01-02|1@750'),false,
 'A claimed visit cannot count where the NPC never actually went');
assert.equal(plans.record(def,actor,held,{kind:'household',locationId:'oldChinatown'},
 {locationId:'oldChinatown',roomId:'market-street'},'1878-01-02|3'),false,
 'Household ledger is not proof of a work-related goal');
const rest=situation('rest-and-recover',0,0,true);
const paused=plans.commit(def,actor,rest,'1878-01-02|2');
assert.equal(paused.rest,true);
assert.equal(actor.lifePlan.goal,'maintain-business','Sleep does not reset independent aspirations');
assert.equal(actor.lifePlan.attempts,1);
assert.equal(plans.record(def,actor,paused,{kind:'rest',locationId:null},
 {locationId:'factory',roomId:'workers-lodging'},'1878-01-02|2'),false);
const before=JSON.stringify(actor.lifePlan);
assert.equal(plans.witness(def,actor,{
 type:'private-encounter',actorId:def.id,partnerId:'liWen',
 roomId:'market-street',locationId:'oldChinatown'},'1878-01-02|2'),false,
 'Work-focused goal must not claim a social milestone');
assert.equal(JSON.stringify(actor.lifePlan),before);
const revised=plans.commit(def,actor,situation('develop-contacts',39,76),'1878-01-03|0');
assert.equal(revised.goal,'develop-contacts','A genuinely stronger priority revises intention');
assert.equal(actor.lifePlan.attempts,0,'Different goal starts its own effort ledger');
assert.equal(actor.lifePlan.history.some(h=>h.type==='revision'),true);
const denied={type:'private-encounter',actorId:def.id,partnerId:'liWen',
 roomId:'market-street',locationId:'oldChinatown'};
actor.status='off-duty';actor.locationId=null;actor.roomId=null;
assert.equal(plans.witness(def,actor,denied,'1878-01-03|0'),false,
 'An unobserved social encounter cannot appear in a private plan');
actor.status='present';actor.locationId='oldChinatown';actor.roomId='market-street';
assert.equal(plans.witness(def,actor,denied,'1878-01-03|0'),true);
assert.equal(plans.witness(def,actor,denied,'1878-01-03|0'),false,'No repeat social credit');
assert.equal(actor.lifePlan.encounters,1);
assert.equal(actor.lifePlan.status,'following-through');
const saved=JSON.parse(JSON.stringify(actor)),beforeReload=JSON.stringify(saved.lifePlan);
assert.equal(plans.witness(def,saved,denied,'1878-01-03|0'),false);
assert.equal(JSON.stringify(saved.lifePlan),beforeReload,'Save reload must not replay an encounter');
const clock={worldMinute:1000};
assert.equal(plans.record(def,actor,revised,{kind:'personal',locationId:'oldChinatown'},
 {locationId:'oldChinatown',roomId:'market-street',reason:'routine'},'1878-01-03|1'),true);
assert.equal(plans.record(def,actor,revised,{kind:'personal',locationId:'russianTradeHall'},
 {locationId:'oldChinatown',roomId:'market-street',reason:'goal-directed'},'1878-01-03|2'),true,
 'Authorized intentional movement counts as observed effort');
assert.equal(plans.record(def,actor,revised,{kind:'personal',locationId:'russianTradeHall'},
 {locationId:'oldChinatown',roomId:'market-street',reason:'errand'},'1878-01-03|3'),false,
 'A random detour is not progress toward a stated goal');
assert.equal(clock.worldMinute,1000,'Resident plan never advances the world clock');
assert.equal(actor.lifePlan.status,'following-through','Two actual visits now demonstrate follow-through on the revised goal');
assert.equal(actor.lifePlan.attempts,2,'Only observed routine and intentional visits count');
for(let i=0;i<40;i++)plans.record(def,actor,revised,{kind:'personal',locationId:'oldChinatown'},
 {locationId:'oldChinatown',roomId:'market-street',reason:'routine'},'later|'+i);
assert.ok(actor.lifePlan.history.length<=12&&actor.lifePlan.evidenceKeys.length<=16,
 'Long-running private plan memory stays bounded');
assert.equal(actor.lifePlan.status,'following-through');
assert.equal(actor.lifePlan.history.some(h=>h.type==='claimed-contract-complete'),false);
assert.throws(()=>plans.commit(def,{},situation('unapproved',1,1),'x'));
console.log('PASS NPC sustained private goals, actual activity, verified social evidence, revision and save replay');
