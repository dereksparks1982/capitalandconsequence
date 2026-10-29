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
const hungry={...mind,needs:{version:1,hunger:95},
 householdReceipts:{provisions:[]}};
const fed={...mind,needs:{version:1,hunger:25},
 householdReceipts:{provisions:[{good:'bread',consumed:false}]}};
const hungrySituation=agency.observe(merchant,hungry,{},observedOther);
const fedSituation=agency.observe(merchant,fed,{},observedOther);
assert.ok(hungrySituation.foodPressure>fedSituation.foodPressure);
assert.ok(hungrySituation.social<fedSituation.social,
 'Hunger discourages casual networking without inventing a purchase');
assert.equal(agency.observe(merchant,fed,{},observedOther).foodPressure,0,
 'An adequately fed resident has no synthetic food pressure');
assert.throws(()=>agency.observe(null,mind,{},observedOther));
assert.throws(()=>agency.choose(null,mind,isolated));

const mobility=require('../npc-mobility.js');
const places=[
 {id:'factory',name:'Factory',defaultRoom:'floor',category:'industry',rooms:[{id:'floor'}]},
 {id:'park',name:'Park',defaultRoom:'path',category:'park',rooms:[{id:'path'}]}
];
const city={listLocations:()=>places,getLocation:id=>places.find(p=>p.id===id),
 getRoom:(id,room)=>places.find(p=>p.id===id)?.rooms.find(r=>r.id===room)};
const wanderer={kind:'npc',id:'quietResident',onDuty:false,permits:[],invitations:[],roomPermits:[]};
const hash=value=>{let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
let outingKey=null;
for(let i=0;i<10000;i++){
 const key='evening-'+i;
 const roll=hash('7|'+key+'|quietResident|outing')%100;
 if(roll>=6&&roll<14){outingKey=key;break}
}
assert.ok(outingKey,'Found reproducible low-sociability boundary case');
const evening={date:'1878-01-02',slot:2,seed:7,key:outingKey,defaultLocation:'factory'};
assert.equal(mobility.visit(city,wanderer,{...evening,sociability:0}).locationId,'factory',
 'Zero sociability must not be silently replaced with 50');
assert.equal(mobility.visit(city,wanderer,{...evening,sociability:50}).locationId,'park',
 'Higher sociability permits an accessible discretionary outing');
assert.deepEqual(mobility.visit(city,wanderer,{...evening,sociability:50}),
 mobility.visit(city,wanderer,{...evening,sociability:50}),
 'Outings are deterministic for the same saved moment');
assert.equal(mobility.visit(city,{...wanderer,onDuty:true,workplaceId:'factory'},
 {...evening,sociability:100}).locationId,'factory','Duty comes before leisure');

console.log('PASS NPC utility planner, condition-driven priorities, private knowledge and stable reload');
