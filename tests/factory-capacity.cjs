'use strict';
// v0.7.73: real factory investment, optional save migration, recipe time,
// materials requisition, 5 PM atomicity, paid specialists and wage arrears.
const assert=require('node:assert/strict');
const works=require('../component-works.js');
const clock={date:'1878-02-05',minuteOfDay:540};
global.FE_WASHINGTON_TIME={now:()=>({...clock})};
const factory=require('../factory-capacity.js');
const save={
 characterRoute:'industrialist',phase:'day',paused:false,
 currentLocation:{locationId:'factory'},companyCash:2500,lastExpenses:0,
 notes:[],componentWorks:works.createState()
};
const time=seconds=>{clock.minuteOfDay+=seconds/60;return seconds};
const action=(kind,details,token,close=()=>true)=>factory.transact(save,kind,details,token,time,close);
function date(iso,minutes=540){
 clock.date=iso;clock.minuteOfDay=minutes;
 save.componentWorks.date=iso;save.gameDate=iso;
}
assert.equal(works.unitMinutes(save.componentWorks,'insulated-wire'),180,
 'A founding workshop must keep its approved original recipe timing.');
assert.equal(factory.read(save).staff.winder.count,0,'Old saves have no free new staff');
const unmodified=JSON.stringify(save);
assert.equal(factory.read(save).machines.bench,1);
assert.equal(JSON.stringify(save),unmodified,'Read-only screens do not migrate or mutate a save');
// Machine purchase alone does not create faster work without wages.
let r=action('equipment',{role:'bench'},'fc:bench-machine');
assert.equal(r.ok,true);assert.equal(save.componentWorks.stations.bench,1);
assert.equal(works.unitMinutes(save.componentWorks,'switch-contact'),180);
assert.equal(action('equipment',{role:'bench'},'fc:again').ok,false,'Second machine purchase is once only');
const snapshot=JSON.stringify(save),after=clock.minuteOfDay;
assert.equal(action('equipment',{role:'bench'},'fc:bench-machine').repeated,true);
assert.equal(JSON.stringify(save),snapshot,'Replayed investments cannot charge cash or advance time');
assert.equal(clock.minuteOfDay,after);
date('1878-02-06');
r=action('hire',{role:'bench'},'fc:bench-hire');
assert.equal(r.ok,true);
assert.equal(works.unitMinutes(save.componentWorks,'switch-contact'),135);
assert.equal(works.unitMinutes(save.componentWorks,'insulated-wire'),180,'Bench work does not speed wire winding');
r=action('train',{role:'bench'},'fc:bench-train');
assert.equal(r.ok,true);
assert.equal(works.unitMinutes(save.componentWorks,'switch-contact'),110);
assert.equal(works.unitMinutes(save.componentWorks,'telegraph-key'),110);
assert.equal(works.unitMinutes(save.componentWorks,'incandescent-lamp'),300,
 'Paid bench specialists do not bypass separate bulb specialists and patent rules');
// Winder specialist needs second tool and training to speed its own station.
date('1878-02-07');
assert.equal(action('hire',{role:'winder'},'fc:hire-winder').ok,true);
assert.equal(works.unitMinutes(save.componentWorks,'insulated-wire'),180);
assert.equal(action('equipment',{role:'winder'},'fc:tool-winder').ok,true);
assert.equal(works.unitMinutes(save.componentWorks,'insulated-wire'),135);
assert.equal(action('train',{role:'winder'},'fc:train-winder').ok,true);
assert.equal(works.unitMinutes(save.componentWorks,'insulated-wire'),110);
assert.equal(works.unitMinutes(save.componentWorks,'telegraph-relay'),255);
assert.equal(clock.minuteOfDay,1020,'The three paid shift actions consume an entire workday');
const ordinary=works.order(save.componentWorks,{
 customer:works.CUSTOMERS[0],productId:'insulated-wire',quantity:3,deadline:'1878-02-20'},'fc:order');
assert.equal(ordinary.ok,true);
date('1878-02-08');
save.componentWorks.materials.copper=0;save.componentWorks.materials.insulation=0;
const quote=factory.quoteOrder(save,ordinary.id);
assert.equal(quote.ok,true);assert.deepEqual(quote.shortages,{copper:6,insulation:6});
assert.equal(quote.costCents,180);assert.equal(quote.estimatedWorkMinutes,330);
const cash=save.companyCash;
const bought=action('requisition',{orderId:ordinary.id},'fc:buy-order');
assert.equal(bought.ok,true);
assert.equal(Math.round((cash-save.companyCash)*100),180);
assert.equal(save.componentWorks.materials.copper,6);assert.equal(save.componentWorks.materials.insulation,6);
assert.equal(factory.quoteOrder(save,ordinary.id).costCents,0);
assert.equal(action('requisition',{orderId:ordinary.id},'fc:no-more').ok,false);
assert.equal(action('requisition',{orderId:ordinary.id},'fc:buy-order').repeated,true,
 'Reopening a material requisition may not charge twice');
const made=works.assemble(save.componentWorks,ordinary.id,3,'fc:make');
assert.equal(made.ok,true);assert.equal(made.minutesRequired,330);
assert.equal(save.componentWorks.warehouse['insulated-wire'],3);
assert.equal(factory.quoteOrder(save,ordinary.id).remaining,0);
// No money, no goods, not even a minute must move on an unaffordable purchase.
const second=works.order(save.componentWorks,{customer:works.CUSTOMERS[0],
 productId:'telegraph-relay',quantity:2,deadline:'1878-02-20'},'fc:order2');
assert.equal(second.ok,true);
save.componentWorks.materials.copper=0;
const beforeInsufficient=JSON.stringify(save),beforeMinute=clock.minuteOfDay;
save.companyCash=0.01;save.componentWorks.cashCents=1;
const tooPoor=JSON.stringify(save);
assert.equal(action('requisition',{orderId:second.id},'fc:poor').ok,false);
assert.equal(JSON.stringify(save),tooPoor);assert.equal(clock.minuteOfDay,beforeMinute);
save.companyCash=Number(JSON.parse(beforeInsufficient).companyCash);
save.componentWorks.cashCents=Math.round(save.companyCash*100);
// Real location and opening hours are required even if player knows a token.
date('1878-02-09');
assert.equal(new Date(clock.date+'T12:00:00Z').getUTCDay(),6);
const closed=JSON.stringify(save);
assert.equal(action('hire',{role:'winder'},'fc:saturday').ok,false);
assert.equal(JSON.stringify(save),closed);
date('1878-02-11'); // Monday
save.currentLocation.locationId='home';
assert.equal(action('hire',{role:'winder'},'fc:home').ok,false);
save.currentLocation.locationId='factory';
save.characterRoute='investigator';
assert.equal(action('hire',{role:'winder'},'fc:wrong-role').ok,false);
save.characterRoute='industrialist';
const serialized=JSON.parse(JSON.stringify(save));
assert.equal(factory.read(serialized).staff.bench.trained,true,'Profile reload retains paid capacity');
assert.equal(works.unitMinutes(serialized.componentWorks,'insulated-wire'),110);
// Payroll happens once on Saturday; wages owed survive insolvency.
date('1878-02-16'); // Saturday
assert.equal(new Date(clock.date+'T12:00:00Z').getUTCDay(),6);
save.companyCash=2;save.componentWorks.cashCents=200;
const pay=factory.settleSaturday(save);
assert.equal(pay.earnedCents,1350,'Bench $6 + winding $7.50 weekly');
assert.equal(pay.paidCents,200);
assert.equal(pay.owedCents,1150);
const owedCopy=JSON.stringify(save);
assert.equal(factory.settleSaturday(save).repeated,true);
assert.equal(JSON.stringify(save),owedCopy);
date('1878-02-23'); // following Saturday
assert.equal(new Date(clock.date+'T12:00:00Z').getUTCDay(),6);
save.companyCash=25;save.componentWorks.cashCents=2500;
const paid=factory.settleSaturday(save);
assert.equal(paid.earnedCents,1350);
assert.equal(paid.paidCents,2500);
assert.equal(paid.owedCents,0,'Company clears arrears plus current salary');
assert.equal(save.companyCash,0);assert.equal(save.componentWorks.cashCents,0);
assert.equal(factory.settleSaturday(save).repeated,true);
console.log('PASS 1878 paid bench/winder staffing, tools, training, real capacity, material requisitions, no free shifts, Saturday wages and arrears');
