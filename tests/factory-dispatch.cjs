'use strict';
// v0.7.74: Delegated factory production cannot create free stock, time,
// staffing, money, technology, city contracts or duplicate customer receipts.
const assert=require('node:assert/strict');
const works=require('../component-works.js');
const capacity=require('../factory-capacity.js');
const operations=require('../workshop-operations.js');
const clock={date:'1878-02-05',minuteOfDay:540};
global.FE_WASHINGTON_TIME={now:()=>({...clock})};
const desk=require('../factory-dispatch.js');
function fixture(){
 const state=works.createState('1878-02-05');
 return {characterRoute:'industrialist',phase:'day',paused:false,
  companyCash:2500,notes:[],lastExpenses:0,
  currentLocation:{locationId:'factory'},componentWorks:state,
  npcSimulation:{seed:44,agents:{foremanSullivan:{status:'present',locationId:'factory'}}}};
}
const s=fixture();
const spend=sec=>{clock.minuteOfDay+=sec/60;return sec};
const transact=(kind,details,token)=>desk.transact(s,kind,details,token,spend,()=>true);
const bench=works.order(s.componentWorks,{customer:works.CUSTOMERS[0],productId:'switch-contact',
 quantity:3,deadline:'1878-02-21'},'fd:bench-order');
const wind=works.order(s.componentWorks,{customer:works.CUSTOMERS[1],productId:'insulated-wire',
 quantity:5,deadline:'1878-02-12'},'fd:wire-order');
assert.equal(bench.ok,true);assert.equal(wind.ok,true);
const ordinarySnapshot=JSON.stringify(s);
const initial=desk.forecast(s);
assert.equal(initial.orders[0].id,wind.id,'Earliest deadline is first');
assert.equal(JSON.stringify(s),ordinarySnapshot,'Reading a forecast cannot mutate a saved game');
assert.equal(initial.orders[0].staffed,false,'Old saves contain no secretly delegated employees');
assert.equal(transact('run',{minutes:240},'fd:unpaid').ok,false);
const staffing=capacity.fresh();
staffing.staff.bench.count=1;staffing.staff.bench.trained=true;staffing.machines.bench=2;
staffing.staff.winder.count=1;staffing.machines.winder=2;
s.componentWorks.factoryCapacity=staffing;
assert.equal(works.unitMinutes(s.componentWorks,'switch-contact'),110);
assert.equal(works.unitMinutes(s.componentWorks,'insulated-wire'),135);
const front=transact('prioritize',{orderId:bench.id},'fd:priority');
assert.equal(front.ok,true);assert.equal(front.elapsedSeconds,300);
assert.equal(desk.forecast(s).orders[0].id,bench.id);
const snapshot=JSON.stringify(s),minute=clock.minuteOfDay;
assert.equal(transact('prioritize',{orderId:bench.id},'fd:priority').repeated,true);
assert.equal(JSON.stringify(s),snapshot);assert.equal(clock.minuteOfDay,minute);
// A factory run must never manufacture an ineligible or material-starved product.
s.componentWorks.materials.brass=0;
assert.equal(desk.forecast(s).orders[0].possibleNow,0);
const buy=desk.forecast(s);
assert.ok(buy.shortages.brass>=6);
const before=JSON.stringify(s);
s.companyCash=0.01;s.componentWorks.cashCents=1;
const poorSnapshot=JSON.stringify(s);
assert.equal(transact('procure',{},'fd:poor').ok,false,'No free bulk materials');
assert.equal(JSON.stringify(s),poorSnapshot);
Object.assign(s,JSON.parse(before));
clock.minuteOfDay=minute;
const amount=desk.forecast(s).costCents,oldCash=s.companyCash;
const supplied=transact('procure',{},'fd:requisition');
assert.equal(supplied.ok,true);
assert.equal(Math.round((oldCash-s.companyCash)*100),amount);
assert.equal(desk.forecast(s).costCents,0);
assert.equal(transact('procure',{},'fd:requisition').repeated,true);
assert.equal(transact('procure',{},'fd:again').ok,false);
// Must still require Sullivan physically present, regardless of extra workers.
s.npcSimulation.agents.foremanSullivan.locationId='home';
const away=JSON.stringify(s),awayMinute=clock.minuteOfDay;
assert.equal(transact('run',{minutes:240},'fd:no-supervisor').ok,false);
assert.equal(JSON.stringify(s),away);assert.equal(clock.minuteOfDay,awayMinute);
s.npcSimulation.agents.foremanSullivan.locationId='factory';
const present=operations.availability(s,{...clock});
assert.equal(present.ok,true,'Fixture needs Sullivan to be present at this shift');
const run=transact('run',{minutes:240},'fd:bench-shift');
assert.equal(run.ok,true,run.reason);
assert.equal(run.delegated,true);assert.equal(run.productId,'switch-contact');
assert.equal(run.orderedUnits,2);assert.equal(run.goodUnits,2);
assert.equal(run.elapsedSeconds,2*110*60);
assert.equal(s.componentWorks.orders.find(x=>x.id===bench.id).made,2);
assert.equal(s.componentWorks.warehouse['switch-contact'],2);
assert.equal(s.componentWorks.materials.brass,2,'Two completed contacts consume four of six purchased brass parts');
const again=transact('run',{minutes:240},'fd:bench-shift');
assert.equal(again.repeated,true);
assert.equal(s.componentWorks.warehouse['switch-contact'],2,'No free duplicated factory lot');
const job=s.componentWorks.orders.find(x=>x.id===bench.id);
assert.equal(works.ship(s.componentWorks,bench.id,3,'fd:early-ship').ok,false,
 'Unmade units cannot be invoiced to a customer');
assert.equal(job.made,2);
assert.equal(works.ship(s.componentWorks,bench.id,2,'fd:real-ship').ok,true,
 'Paid customer shipping still uses existing order-specific ledger');
assert.equal(s.componentWorks.warehouse['switch-contact'],0);
// A factory breakdown must not be ignored by the managed shift.
s.workshopOperations={version:1,hold:{description:'Bench fixture seized',sourceToken:'fd:stopped'},
 repairReceipts:{},lastIncident:null,incidentHistory:[]};
const blocked=JSON.stringify(s),blockedMinute=clock.minuteOfDay;
assert.equal(transact('run',{minutes:240},'fd:broken').ok,false);
assert.equal(JSON.stringify(s),blocked);assert.equal(clock.minuteOfDay,blockedMinute);
s.workshopOperations.hold=null;
clock.minuteOfDay=970;
const closeBefore=JSON.stringify(s);
assert.equal(transact('run',{minutes:60},'fd:late').ok,false,'Full unit cannot finish after shift');
assert.equal(JSON.stringify(s),closeBefore);
assert.equal(clock.minuteOfDay,970);
// Fair lighting remains technology- and staffing-gated despite pending bulb orders.
const lamp=fixture();lamp.componentWorks.date='1878-08-15';
lamp.componentWorks.stations['lamp-line']=2;
lamp.componentWorks.licenses.push('incandescent-rights');
lamp.componentWorks.materials.carbon=20;
lamp.componentWorks.orders.push({id:'FE-1878-FAIR-BULBS',special:'fair-1878',
 customer:'Washington World’s Fair',productId:'incandescent-lamp',quantity:100,
 made:0,delivered:0,status:'accepted',priceCents:0,deadline:'1878-12-31'});
let fair=desk.forecast(lamp).orders[0];
assert.equal(fair.staffed,false,'Bulb specialists must be hired and trained via their existing line');
lamp.electricCampaign={lamps:{crew:2,upgraded:true}};
fair=desk.forecast(lamp).orders[0];
assert.equal(fair.staffed,true);
assert.equal(fair.minutesPerUnit,60);
assert.equal(works.unitMinutes(lamp.componentWorks,'incandescent-lamp'),60,
 'Delegation cannot change the established 1878 Fair lamp line');
// The queue should skip long jobs for a one-hour shift if a later
// eligible machine can produce a shorter completed lot.
const short=fixture();
short.componentWorks.date='1878-03-04';
const crew=capacity.fresh();crew.staff.bench.count=1;crew.staff.bench.trained=true;crew.machines.bench=2;
short.componentWorks.factoryCapacity=crew;
short.componentWorks.stations['lamp-line']=2;
short.componentWorks.licenses.push('incandescent-rights');
short.componentWorks.materials.carbon=5;
short.electricCampaign={lamps:{crew:2,upgraded:true}};
const slow=works.order(short.componentWorks,{customer:works.CUSTOMERS[0],
 productId:'switch-contact',quantity:1,deadline:'1878-03-10'},'short:bench');
assert.equal(slow.ok,true);
short.componentWorks.orders.push({id:'FE-1878-FAIR-BULBS',special:'fair-1878',
 customer:'Washington World’s Fair',productId:'incandescent-lamp',quantity:1,
 made:0,delivered:0,status:'accepted',priceCents:0,deadline:'1878-12-31'});
clock.date='1878-03-04';clock.minuteOfDay=600;
assert.equal(operations.arrival(short,clock.date).absent,false,'Shift fixture has an available foreman');
const shorter=desk.transact(short,'run',{minutes:60},'short:run',spend,()=>true);
assert.equal(shorter.ok,true,shorter.reason);
assert.equal(shorter.productId,'incandescent-lamp','Short shift skips a first-priority job that cannot finish');
assert.equal(shorter.elapsedSeconds,3600);
assert.equal(short.componentWorks.warehouse['incandescent-lamp'],1);

console.log('PASS priority queue, shared shortages, cash-backed bulk procurement, staffed factory shifts, real stock, duplicate safety, Sullivan/repair gates and bulb qualifications');
