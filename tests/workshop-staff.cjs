'use strict';
const assert=require('node:assert/strict');
const works=require('../component-works.js'),eco=require('../npc-economy.js'),staff=require('../workshop-staff.js');
const def={id:staff.ASSISTANT_ID,traits:{caution:81,sociability:45}};
const assistant={energy:88};
const save={gameDate:'1878-01-07',companyCash:2500,lastExpenses:0,componentWorks:works.createState(),
 npcSimulation:{agents:{[staff.ASSISTANT_ID]:assistant}}};
assert.equal(staff.DAILY_WAGE_CENTS,120);assert.equal(staff.WEEKLY_WAGE_CENTS,600);
function date(iso,worked=true){
 save.gameDate=iso;
 if(worked)eco.actionFor(def,assistant,{date:iso,key:iso+'|0',slot:0,
  weekday:new Date(iso+'T12:00:00Z').getUTCDay(),seed:188,
  defaultLocation:'factory',defaultActivity:'work',rest:false});
 return staff.settleDay(save);
}
assert.equal(date('1878-01-07').earnedCents,120);
assert.equal(save.companyCash,2500,'Monday wage accrued not paid');
assert.equal(assistant.economy.balanceCents,2100);
assert.equal(date('1878-01-08').accruedCents,240);
date('1878-01-09');date('1878-01-10');date('1878-01-11');
assert.equal(save.workshopPayroll.accruedCents,600);
const friday=JSON.stringify(save);
assert.equal(staff.settleDay(save).repeated,true);assert.equal(JSON.stringify(save),friday);
const saturday=date('1878-01-12',false);
assert.equal(saturday.paidCents,600);
assert.equal(saturday.operatingCostsCents,125,'January tools, oil and coal');
assert.equal(saturday.paidCostsCents,125);
assert.equal(save.companyCash,2492.75);
assert.equal(assistant.economy.balanceCents,2700);
assert.equal(assistant.economy.earnedCents,600);
assert.equal(save.componentWorks.cashCents,249275);
assert.equal(save.lastExpenses,7.25);
const snap=JSON.stringify(save);assert.equal(staff.settleDay(save).repeated,true);
assert.equal(JSON.stringify(save),snap);
assert.equal(date('1878-01-13',false).paidCents,0,'No Sunday pay');
date('1878-01-14');date('1878-01-15');date('1878-01-16',false);
date('1878-01-17');date('1878-01-18');
assert.equal(save.workshopPayroll.accruedCents,480,'Absence affects earnings');
const order=works.order(save.componentWorks,{customer:works.CUSTOMERS[0],productId:'telegraph-key',
 quantity:1,deadline:'1878-01-19'},'test:order');
assert.ok(order.ok);assert.equal(works.assemble(save.componentWorks,order.id,1,'test:make').ok,true);
save.componentWorks.date='1878-01-19';
assert.equal(works.ship(save.componentWorks,order.id,1,'test:ship').ok,true);
save.companyCash=.50;save.lastExpenses=0;
const poor=date('1878-01-19',false);
assert.equal(poor.paidCents,50);
assert.equal(poor.owedCents,430);
assert.equal(poor.operatingCostsCents,240,'Actual shipment adds freight');
assert.equal(poor.shopOwedCents,240);assert.equal(save.companyCash,0);
save.companyCash=10;
date('1878-01-20',false);
date('1878-01-21');date('1878-01-22');date('1878-01-23');date('1878-01-24');date('1878-01-25');
const clearing=date('1878-01-26',false);
assert.equal(clearing.paidCents,1000);
assert.equal(clearing.owedCents,30);
assert.equal(clearing.shopOwedCents>0,true);
console.log('PASS Saturday wages, work attendance, incurred shop bills, cash arrears and reload-safe settlement');
