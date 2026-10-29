'use strict';
const assert=require('node:assert/strict');
const ops=require('../workshop-operations.js'),works=require('../component-works.js');
const bridge=require('../calendar-bridge.js'),clock=require('../washington-time.js');
const s={gameDate:'1878-01-02',companyCash:100,lastExpenses:0,
 componentWorks:works.createState(),npcSimulation:{seed:413,agents:{foremanSullivan:{locationId:'factory',status:'present'}}}};
bridge.start(s,'1878-01-02',540);
let late=null,absent=null;
for(let d=0;d<1500;d++){
 const iso=new Date(Date.UTC(1878,0,2+d)).toISOString().slice(0,10),a=ops.arrival(s,iso);
 if(!late&&a.delayMinutes)late={iso,a};
 if(!absent&&a.absent)absent={iso,a};
 if(late&&absent)break;
}
assert.ok(late&&absent,'Seeded visits include both delays and absences');
const copy=JSON.stringify(s);
assert.deepEqual(ops.arrival(s,late.iso),ops.arrival(s,late.iso));
assert.equal(JSON.stringify(s),copy,'Checking arrivals never rerolls or writes to saves');
let time={date:late.iso,minuteOfDay:540};
assert.equal(ops.availability(s,time).ok,false,'Cannot produce before Sullivan arrives');
time.minuteOfDay=late.a.arrivalMinute;
assert.equal(ops.availability(s,time).ok,true);
assert.equal(ops.availability(s,{date:absent.iso,minuteOfDay:660}).ok,false);
let holding=null,incident=null;
for(let n=0;n<150;n++){
 const v=ops.afterAssembly(s,{token:'test:'+n},'telegraph-relay','1878-01-02');
 if(v&&!v.assistantFixed){holding=v;incident=n;break}
}
assert.ok(holding,'Some breakdowns exceed the assistant ability');
assert.equal(holding.assistantTried,true);
assert.ok(s.workshopOperations.hold);
assert.ok(s.workshopOperations.incidentHistory.length>=1);
assert.ok(s.workshopOperations.incidentHistory.length<=32);
assert.equal(ops.availability(s,{date:'1878-01-02',minuteOfDay:600}).ok,false);
const snapshot=JSON.stringify(s);
const close=ops.repair(s,'repair:one',{date:'1878-01-02',minuteOfDay:1010},()=>{throw Error('No overtime')});
assert.equal(close.ok,false);
assert.equal(JSON.stringify(s),snapshot,'Rejected overtime has no effect');
const actions=[];
const fix=ops.repair(s,'repair:one',{date:'1878-01-02',minuteOfDay:600},(seconds,away,atBell)=>{
 actions.push({seconds,away,atBell});return seconds;
});
assert.equal(fix.ok,true);assert.equal(fix.costCents,30);
assert.equal(s.workshopOperations.lastRepair.costCents,30);
assert.equal(s.workshopOperations.lastRepair.elapsedMinutes,45);
assert.equal(s.companyCash,99.70);
assert.equal(s.lastExpenses,.3);
assert.equal(s.workshopOperations.hold,null);
assert.equal(actions[0].seconds,2700);
assert.equal(ops.repair(s,'repair:one',{date:'1878-01-02',minuteOfDay:600},()=>{throw Error('No duplicate')}).repeated,true);
assert.equal(s.companyCash,99.70);
assert.equal(ops.availability(s,{date:'1878-01-02',minuteOfDay:600}).ok,true);
console.log('PASS seeded late/absent shifts, saved assistant repair failure, owner repair cash/time and idempotence');
