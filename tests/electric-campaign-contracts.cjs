'use strict';
// Offline regression: 1878 Federal Electric municipal contracts use real receipts,
// shared finished stock, earned lab research, workers, time, and business cash.
const assert=require('node:assert/strict');
const works=require('../component-works.js');
const clock={date:'1878-02-05',minuteOfDay:540};
global.FE_WASHINGTON_TIME={now:()=>({...clock})};
const electric=require('../electric-campaign.js');
const save={
 characterRoute:'industrialist',phase:'day',paused:false,
 currentLocation:{locationId:'factory',roomId:'executive-office'},
 companyCash:2500,componentWorks:works.createState(),
 lastRevenue:0,lastExpenses:0,notes:[],npcSimulation:{seed:314}
};
function date(iso,weekday){
 clock.date=iso;clock.minuteOfDay=540;
 save.componentWorks.date=iso;save.gameDate=iso;
 if(weekday!==undefined)assert.equal(new Date(iso+'T12:00:00Z').getUTCDay(),weekday,'date fixture weekday');
}
const spend=seconds=>{clock.minuteOfDay+=seconds/60;return seconds};
const act=(kind,args,token)=>electric.transact(save,kind,args,token,spend,()=>true);
assert.equal(act('street-bid',{priceCents:1450},'street:tooearly').ok,false,'No street tender before actual component shipment');
assert.equal(save.electricCampaign,undefined,'Rejected bid must not add campaign state');
save.componentWorks.receipts.actualShipment={ok:true,kind:'shipment',date:'1878-01-12',productId:'insulator',units:2};
const tender=act('street-bid',{priceCents:1450},'street:bid');
assert.equal(tender.ok,true);assert.equal(tender.won,true);
assert.equal(save.componentWorks.orders.filter(o=>o.special==='street-1878').length,3,
 'An award creates three actual component production obligations');
const afterBid=JSON.stringify(save);
assert.equal(act('street-bid',{priceCents:1450},'street:bid').repeated,true);
assert.equal(JSON.stringify(save),afterBid,'Replayed bid never charges time, money or creates duplicate orders');
assert.equal(act('street-bid',{priceCents:1850},'street:second').ok,false,'Tender resolved only once');
// No fabricated stock; each dispatch needs accepted parts.
date('1878-02-09',6);
const noStock=JSON.stringify(save);
assert.equal(act('street-dispatch',{quantity:5},'street:nostock').ok,false);
assert.equal(JSON.stringify(save),noStock,'Failed shipment is atomic');
// Stock belonging to unrelated orders cannot satisfy the District factory jobs.
for(const id of ['insulated-wire','switch-contact','insulator'])save.componentWorks.warehouse[id]=10;
assert.equal(act('street-dispatch',{quantity:10},'street:unmade').ok,false,
 'Unmade District orders cannot ship even when a shared warehouse has stock');
for(const id of ['insulated-wire','switch-contact','insulator']){
 save.componentWorks.warehouse[id]=0;
 const assigned=save.componentWorks.orders.find(o=>o.special==='street-1878'&&o.productId===id);
 const made=works.assemble(save.componentWorks,assigned.id,10,'street:factory:'+id);
 assert.equal(made.ok,true,'District component must be physically made');
}
const dispatched=act('street-dispatch',{quantity:10},'street:dispatch');
assert.equal(dispatched.ok,true);assert.equal(dispatched.shipped,10);
for(const id of ['insulated-wire','switch-contact','insulator']){
 assert.equal(save.componentWorks.warehouse[id],0,id+' physically consumed');
 assert.equal(save.componentWorks.orders.find(o=>o.special==='street-1878'&&o.productId===id).delivered,10,
  'Real production-order receipt must reflect municipal dispatch');
}
const beforeInspection=save.companyCash;
date('1878-02-11',1);
const inspected=act('street-certify',{quantity:10},'street:inspect');
assert.equal(inspected.ok,true);
assert.equal(inspected.incomeCents,14500,'Only actual installed sites receive payment');
assert.equal(Math.round((save.companyCash-beforeInspection)*100),14500);
assert.equal(act('street-certify',{quantity:1},'street:overinspect').ok,false,'Cannot invoice unshipped city equipment');
// Four multi-hour experimental R&D stages; failed tests spend costs/time but cannot advance.
date('1878-03-04',1);
// Research begins with actual purchased carbon in the inventory fixture.
save.componentWorks.materials.carbon=30;
let trials=0;
while(electric.read(save).lamps.stage<electric.RESEARCH.length&&trials<25){
 clock.minuteOfDay=540;
 const prior=electric.read(save).lamps.stage;
 const result=act('research',{},'research:'+trials);
 assert.equal(result.ok,true,result.reason);
 if(!result.passed)assert.equal(result.stage,prior,'Failed research cannot advance stages');
 trials++;
}
assert.equal(electric.read(save).lamps.stage,4,'Research can actually complete');
clock.minuteOfDay=540;assert.equal(act('license',{},'lab:license').ok,true);
clock.minuteOfDay=540;assert.equal(act('prototype-line',{},'lab:prototype').ok,true);
assert.equal(save.componentWorks.stations['lamp-line'],1);
assert.equal(works.eligibility(save.componentWorks,'incandescent-lamp').ok,true);
assert.equal(works.unitMinutes(save.componentWorks,'incandescent-lamp'),300,'Hand-built bulb requires five hours');
save.componentWorks.materials.carbon=30;
const bulbs=works.order(save.componentWorks,{
 customer:works.CUSTOMERS[0],productId:'incandescent-lamp',quantity:6,deadline:'1878-12-31'
},'lamp:order');
assert.equal(bulbs.ok,true,'Use existing company customer-order engine');
const prototypes=works.assemble(save.componentWorks,bulbs.id,5,'lamp:attempt');
assert.equal(prototypes.ok,true);
assert.equal(prototypes.goodUnits,4);assert.equal(prototypes.rejectedUnits,1);
assert.equal(save.componentWorks.warehouse['incandescent-lamp'],4);
assert.equal(works.assemble(save.componentWorks,bulbs.id,1,'lamp:second').goodUnits,1);
assert.equal(save.componentWorks.lampDevelopment.good,5,'Failed bulbs never become good warehouse goods');
clock.minuteOfDay=540;assert.equal(act('hire-crew',{},'lamp:hire').ok,true);
clock.minuteOfDay=540;assert.equal(act('upgrade-line',{},'lamp:upgrade').ok,true);
assert.equal(save.componentWorks.stations['lamp-line'],2);
assert.equal(works.unitMinutes(save.componentWorks,'incandescent-lamp'),60,'Batch line is faster but never instant');
const FairNotWon={...electric.read(save).fair};
assert.equal(FairNotWon.status,'not-open');
date('1878-08-01',4);
const award=act('fair-bid',{priceCents:240},'fair:bid');
assert.equal(award.ok,true);assert.equal(award.won,true);
assert.equal(save.componentWorks.orders.filter(o=>o.special==='fair-1878').length,1,
 'Fair tender creates a real 100-bulb order, not imaginary stock');
const fairOrder=save.componentWorks.orders.find(o=>o.special==='fair-1878');
assert.equal(fairOrder.quantity,100);
assert.equal(works.ship(save.componentWorks,fairOrder.id,1,'fake:ship').ok,false,
 'Ordinary customer dispatcher cannot create a second payment for a municipal contract');
save.componentWorks.materials.carbon+=40;
const completed=works.assemble(save.componentWorks,fairOrder.id,10,'fair:manufacture');
assert.equal(completed.ok,true);
assert.ok(completed.goodUnits<10,'Defective bulk lamps are rejected');
// Failed lamps are scrap; make a replacement before promising ten delivered bulbs.
const replacement=works.assemble(save.componentWorks,fairOrder.id,10-completed.goodUnits,'fair:replacement');
assert.equal(replacement.ok,true);
assert.equal(replacement.goodUnits,10-completed.goodUnits);
date('1878-08-03',6);
assert.equal(act('fair-dispatch',{quantity:10},'fair:premature').ok,false,'Cannot deliver to Fair before Q4 window');
date('1878-10-05',6);
const fairShipment=act('fair-dispatch',{quantity:10},'fair:delivery');
assert.equal(fairShipment.ok,true);
assert.equal(fairShipment.incomeCents,2400);
assert.equal(save.componentWorks.orders.find(o=>o.special==='fair-1878').delivered,10);
assert.equal(save.electricCampaign.fair.shipped,10);
const beforeWages=save.companyCash;
const wages=electric.settleWeek(save);
assert.equal(wages.paidCents,1800,'Two hired specialists receive Saturday wages');
assert.equal(Math.round((beforeWages-save.companyCash)*100),1800);
assert.equal(electric.settleWeek(save).repeated,true);
const afterPayroll=save.companyCash;
assert.equal(electric.settleWeek(save).repeated,true);
assert.equal(save.companyCash,afterPayroll,'Reading the ledger again cannot duplicate salaries');
assert.equal(save.componentWorks.cashCents,Math.round(save.companyCash*100),
 'The new module must not fork the existing company cash ledger');
console.log('PASS 1878 competitive streetlight and Fair bids, 50-site physical orders, earned bulbs, rejection, clock, invoices, once-weekly wages');
