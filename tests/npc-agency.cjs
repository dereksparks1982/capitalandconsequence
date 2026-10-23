'use strict';
const assert=require('node:assert/strict');
const agency=require('../npc-agency.js');
const foreman={id:'foremanSullivan',traits:{ambition:85,caution:90,sociability:45},
 goals:['check-workshop-tools','fill-component-orders','handle-supplies']};
const agent={goal:'check-workshop-tools',energy:88,memories:[]};
const s={npcSimulation:{knowledge:{version:1,records:[]}},workforce:{absent:0},
 lineStatus:'running',turnConditions:{powerOutageSeconds:0}};
let observed=agency.observe(foreman,agent,s,s.npcSimulation);
assert.equal(observed.workPressure,75);assert.equal(observed.risk,15);
let choice=agency.choose(foreman,agent,observed);
assert.equal(choice.goal,'fill-component-orders','Deadline priority can override baseline equipment checks');
s.lineStatus='idle';s.workforce.absent=6;s.turnConditions.powerOutageSeconds=420;
observed=agency.observe(foreman,agent,s,s.npcSimulation);
choice=agency.choose(foreman,agent,observed);
assert.equal(choice.goal,'handle-supplies','Staff danger changes independent assistant decision');
assert.equal(observed.risk,100);
const copy=JSON.parse(JSON.stringify(s));
assert.deepEqual(agency.choose(foreman,agent,agency.observe(foreman,agent,copy,copy.npcSimulation)),
 choice,'Reload replays the same decision given the same local evidence');
assert.equal(agency.choose(foreman,{...agent,energy:25},observed,'late-night').goal,'rest-and-recover');
const star={id:'madamStar',traits:{ambition:78,caution:95,sociability:81},
 goals:['maintain-the-club','cultivate-trusted-contacts','protect-staff']};
const club={goal:'maintain-the-club',energy:90,memories:[]};
const context={headline:'SOCIAL NEWS',starRaidOccurred:false,npcSimulation:{knowledge:{version:1,records:[]}}};
const quiet=agency.choose(star,club,agency.observe(star,club,context,context.npcSimulation));
context.starRaidOccurred=true;
const alarm=agency.choose(star,club,agency.observe(star,club,context,context.npcSimulation));
assert.equal(alarm.goal,'protect-staff');
assert.notEqual(quiet.goal,alarm.goal,'Personal circumstances influence NPC goals');
const inspector={id:'inspectorHayes',traits:{ambition:82,caution:91,sociability:54},
 goals:['review-open-cases','maintain-public-order','build-professional-standing']};
const cop={energy:90,goal:'review-open-cases',memories:[]},intel={headline:'POLICE RAID PRIVATE CLUB',npcSimulation:{knowledge:{version:1,records:[]}}};
assert.equal(agency.observe(inspector,cop,intel,intel.npcSimulation).risk,82);
intel.headline='CLEAR WEATHER';assert.equal(agency.observe(inspector,cop,intel,intel.npcSimulation).risk,18);
const merchant={id:'liWen',traits:{ambition:74,caution:75,sociability:56},goals:['find-new-buyers','protect-local-trust','maintain-business']};
const mind={energy:95,memories:[{key:'greet'}],goal:'maintain-business'};
const observedOther={knowledge:{version:1,records:[
 {actorId:'chenMei',factId:'private-one',source:'secret',confidence:1},
 {actorId:'liWen',factId:'heard-sales',source:'heard-from:chenMei',confidence:.65},
 {actorId:'liWen',factId:'introduced:industrialist',source:'direct-introduction',confidence:1}
 ]}};
const isolated=agency.observe(merchant,mind,{},observedOther);
assert.equal(isolated.rumors,12,'Own hearsay is visible to the planner');
assert.equal(isolated.firstHand,10,'Own direct observations are counted');
observedOther.knowledge.records.push({actorId:'pavelOrlov',source:'heard-from:eddieDoyle',confidence:1});
assert.deepEqual(agency.observe(merchant,mind,{},observedOther),isolated,'Other residents knowledge cannot leak into plans');
assert.throws(()=>agency.observe(null,mind,{},observedOther));
assert.throws(()=>agency.choose(null,mind,isolated));
console.log('PASS NPC utility planner, condition-driven priorities, private knowledge and stable reload');
