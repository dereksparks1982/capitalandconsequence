'use strict';
const assert=require('node:assert/strict');
const works=require('../component-works.js');
const bridge=require('../calendar-bridge.js');
const clock=require('../washington-time.js');
global.FE_WASHINGTON_TIME=clock;
const factory=require('../factory-capacity.js');
const desk=require('../factory-dispatch.js');
const s={characterRoute:'industrialist',phase:'day',paused:false,
 companyCash:2500,lastExpenses:0,lastRevenue:0,currentLocation:{locationId:'factory'},
 notes:[],componentWorks:works.createState(),
 npcSimulation:{seed:44,agents:{foremanSullivan:{status:'present',locationId:'factory'}}}};
bridge.start(s,'1878-01-02',540);
const spend=seconds=>clock.advance(s,seconds,'action').applied?seconds:0;
const hire=factory.transact(s,'hire',{role:'winder'},'fd:hire',spend,()=>true);
const machine=factory.transact(s,'equipment',{role:'winder'},'fd:machine',spend,()=>true);
assert.equal(hire.ok,true);assert.equal(machine.ok,true);
assert.equal(clock.now(s).time,'2:00 PM');
assert.equal(works.unitMinutes(s.componentWorks,'insulated-wire'),135);
const order=works.order(s.componentWorks,{customer:works.CUSTOMERS[0],
 productId:'insulated-wire',quantity:7,deadline:'1878-01-12'},'fd:order');
assert.equal(order.ok,true);
const first=desk.transact(s,'run',{minutes:240},'fd:first-shift',spend,()=>true);
assert.equal(first.ok,true,first.reason);
assert.equal(first.goodUnits,1,'Only one 135-minute unit fits before the 5 PM bell');
assert.equal(first.elapsedSeconds,8100);
assert.equal(clock.now(s).time,'4:15 PM');
assert.equal(s.componentWorks.orders.find(o=>o.id===order.id).made,1);
const clockSnapshot=JSON.stringify(s);
assert.equal(desk.transact(s,'run',{minutes:240},'fd:no-time',spend,()=>true).ok,false);
assert.equal(JSON.stringify(s),clockSnapshot);
const repeated=desk.transact(s,'run',{minutes:240},'fd:first-shift',spend,()=>true);
assert.equal(repeated.repeated,true);
assert.equal(JSON.stringify(s),clockSnapshot);
bridge.start(s,'1878-01-03',540);s.componentWorks.date='1878-01-03';
const trained=factory.transact(s,'train',{role:'winder'},'fd:train',spend,()=>true);
assert.equal(trained.ok,true);assert.equal(clock.now(s).time,'12:00 PM');
assert.equal(works.unitMinutes(s.componentWorks,'insulated-wire'),110);
const next=desk.transact(s,'run',{minutes:240},'fd:next-shift',spend,()=>true);
assert.equal(next.ok,true,next.reason);
assert.equal(next.goodUnits,2,'Trained winder completes two real units in four hours');
assert.equal(next.elapsedSeconds,13200);
assert.equal(clock.now(s).time,'3:40 PM');
assert.equal(s.componentWorks.orders.find(o=>o.id===order.id).made,3);
assert.equal(s.componentWorks.warehouse['insulated-wire'],3);
assert.equal(s.componentWorks.cashCents,Math.round(s.companyCash*100));
console.log('PASS staffed delegated shifts consume the saved Washington clock; no overrun, ghost lots or duplicate production');
