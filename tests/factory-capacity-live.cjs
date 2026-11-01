'use strict';
const assert=require('node:assert/strict');
const works=require('../component-works.js');
const bridge=require('../calendar-bridge.js');
const clock=require('../washington-time.js');
global.FE_WASHINGTON_TIME=clock;
const factory=require('../factory-capacity.js');
const live=require('../component-works-live.js');
const s={characterRoute:'industrialist',paused:false,phase:'day',
 currentLocation:{locationId:'factory'},companyCash:2500,lastRevenue:0,lastExpenses:0,
 notes:[],componentWorks:works.createState(),
 npcSimulation:{seed:44,agents:{foremanSullivan:{locationId:'factory',status:'present'}}}};
bridge.start(s,'1878-01-02',540);
const spend=seconds=>clock.advance(s,seconds,'action').applied?seconds:0;
const invest=(kind,role,token,close=()=>true)=>factory.transact(s,kind,{role},token,spend,close);
assert.equal(invest('hire','winder','fc:hire').ok,true);
assert.equal(clock.now(s).time,'11:00 AM');
assert.equal(invest('equipment','winder','fc:machine').ok,true);
assert.equal(clock.now(s).time,'2:00 PM');
assert.equal(works.unitMinutes(s.componentWorks,'insulated-wire'),135);
const order=works.order(s.componentWorks,{
 customer:works.CUSTOMERS[0],productId:'insulated-wire',quantity:3,deadline:'1878-01-12'
},'fc:test-order');
assert.equal(order.ok,true);
const units=live.transact(s,'assemble',{orderId:order.id,quantity:3},'fc:fast-lot',spend);
assert.equal(units.ok,true);
assert.equal(units.units,1,'Only one accelerated 135-minute wire lot fits before 5 PM');
assert.equal(units.elapsedSeconds,135*60);
assert.equal(clock.now(s).time,'4:15 PM');
const prior=JSON.stringify(s);
assert.equal(live.transact(s,'assemble',{orderId:order.id,quantity:1},'fc:no-time',spend).ok,false);
assert.equal(JSON.stringify(s),prior,'Failed lot is atomic when the shift is almost over');
assert.equal(clock.now(s).time,'4:15 PM');
// Paid training consumes 3 hours and cannot be smuggled into the last 45 minutes.
assert.equal(invest('train','winder','fc:late').ok,false);
assert.equal(clock.now(s).time,'4:15 PM');
bridge.start(s,'1878-01-03',540);s.componentWorks.date='1878-01-03';
assert.equal(invest('train','winder','fc:training').ok,true);
assert.equal(clock.now(s).time,'12:00 PM');
assert.equal(works.unitMinutes(s.componentWorks,'insulated-wire'),110);
const trained=live.transact(s,'assemble',{orderId:order.id,quantity:2},'fc:trained-lot',spend);
assert.equal(trained.ok,true);
assert.equal(trained.units,2);
assert.equal(trained.elapsedSeconds,2*110*60);
assert.equal(clock.now(s).time,'3:40 PM');
assert.equal(s.componentWorks.orders.find(o=>o.id===order.id).made,3);
console.log('PASS hired winder, purchased tool and training lower real-world-clock assembly time without manufacturing after the closing bell');
