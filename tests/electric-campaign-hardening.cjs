'use strict';
// Regression cases for v0.7.72: no phantom contracts, guaranteed cheap bids,
// unmanufactured shipments, free experiments, or unaccounted late payments.
const assert=require('node:assert/strict');
const works=require('../component-works.js');
const clock={date:'1878-02-05',minuteOfDay:540};
global.FE_WASHINGTON_TIME={now:()=>({...clock})};
const electric=require('../electric-campaign.js');
const weekday=iso=>new Date(iso+'T12:00:00Z').getUTCDay();
function fixture(seed){
 return {characterRoute:'industrialist',phase:'day',paused:false,
  currentLocation:{locationId:'factory'},companyCash:2500,
  componentWorks:works.createState(),lastRevenue:0,lastExpenses:0,notes:[],
  npcSimulation:{seed}};
}
function date(save,iso){
 clock.date=iso;clock.minuteOfDay=540;save.componentWorks.date=iso;
}
const time=seconds=>{clock.minuteOfDay+=seconds/60;return seconds};
const act=(save,kind,args,token)=>electric.transact(save,kind,args,token,time,()=>true);
// Two independent competitor markets must sometimes beat even the lowest price.
const streetLoser=fixture(3);date(streetLoser,'1878-02-05');
streetLoser.componentWorks.receipts.old={kind:'shipment',ok:true};
const streetBid=act(streetLoser,'street-bid',{priceCents:1450},'street:low');
assert.equal(streetBid.ok,true);
assert.equal(streetBid.won,false,'Low bid is not a guaranteed municipal contract');
assert.equal(streetLoser.electricCampaign.street.status,'lost');
assert.equal(streetLoser.componentWorks.orders.length,0,'No factory jobs without award');
const lostFair=fixture(5);date(lostFair,'1878-08-01');
lostFair.electricCampaign=electric.initial();
lostFair.electricCampaign.lamps.upgraded=true;
lostFair.componentWorks.lampDevelopment={attempted:5,good:5,rejected:0};
const fairBid=act(lostFair,'fair-bid',{priceCents:240},'fair:low');
assert.equal(fairBid.ok,true);
assert.equal(fairBid.won,false,'Low Fair bid can lose to a serious competitor');
assert.equal(lostFair.electricCampaign.fair.status,'lost');
assert.equal(lostFair.componentWorks.orders.length,0);
// Material-poor experiments refuse before time/cash/state is charged.
date(streetLoser,'1878-03-04');
const beforeFailedLab=JSON.stringify(streetLoser),minute=clock.minuteOfDay;
const noCarbon=act(streetLoser,'research',{},'lab:empty');
assert.equal(noCarbon.ok,false);
assert.match(noCarbon.reason,/stock/i);
assert.equal(JSON.stringify(streetLoser),beforeFailedLab);
assert.equal(clock.minuteOfDay,minute);
streetLoser.componentWorks.materials.carbon=20;
const carbonBefore=streetLoser.componentWorks.materials.carbon;
const copperBefore=streetLoser.componentWorks.materials.copper;
const trial=act(streetLoser,'research',{},'lab:actual');
assert.equal(trial.ok,true);
assert.equal(streetLoser.componentWorks.materials.carbon,carbonBefore-2);
assert.equal(streetLoser.componentWorks.materials.copper,copperBefore-1);
assert.equal(streetLoser.componentWorks.cashCents,Math.round(streetLoser.companyCash*100));
// Warehouse stock alone cannot authorize fulfillment of an unmade municipal job.
const winner=fixture(314);date(winner,'1878-02-05');
winner.componentWorks.receipts.old={kind:'shipment',ok:true};
assert.equal(act(winner,'street-bid',{priceCents:1450},'winner:bid').won,true);
for(const id of ['insulated-wire','switch-contact','insulator'])
 winner.componentWorks.warehouse[id]=1;
date(winner,'1878-02-09');assert.equal(weekday(clock.date),6);
const prior=JSON.stringify(winner);
assert.equal(act(winner,'street-dispatch',{quantity:1},'street:phantom').ok,false);
assert.equal(JSON.stringify(winner),prior,'Unmanufactured shipment has no side effects');
for(const id of ['insulated-wire','switch-contact','insulator']){
 const job=winner.componentWorks.orders.find(o=>o.special==='street-1878'&&o.productId===id);
 // Fabricated generic warehouse quantity must not be accepted as a special order.
 winner.componentWorks.warehouse[id]=0;
 const build=works.assemble(winner.componentWorks,job.id,1,'district:made:'+id);
 assert.equal(build.ok,true);
 assert.equal(job.made,1);
}
const generic=works.order(winner.componentWorks,{customer:works.CUSTOMERS[0],
 productId:'insulated-wire',quantity:1,deadline:'1878-10-20'},'generic:order');
assert.equal(generic.ok,true);
const other=works.ship(winner.componentWorks,generic.id,1,'generic:stolen');
assert.equal(other.ok,false,'A second customer cannot invoice the District-made wire');
assert.equal(winner.componentWorks.warehouse['insulated-wire'],1);
const actual=act(winner,'street-dispatch',{quantity:1},'street:real');
assert.equal(actual.ok,true);
assert.equal(winner.componentWorks.orders.find(o=>o.special==='street-1878'&&o.productId==='insulated-wire').delivered,1);
// The District can accept delayed work, but settles its real 10% invoice deduction.
date(winner,'1878-10-01');assert.equal(weekday(clock.date),2);
const late=act(winner,'street-certify',{quantity:1},'street:late');
assert.equal(late.ok,true);
assert.equal(late.grossCents,1450);
assert.equal(late.latePenaltyCents,145);
assert.equal(late.incomeCents,1305);
assert.equal(act(winner,'street-certify',{quantity:1},'street:late').repeated,true);
assert.equal(winner.electricCampaign.street.certified,1);
// Fair late penalties are separate and cannot pay for unbuilt bulbs.
const delayedFair=fixture(314);date(delayedFair,'1879-01-04');
assert.equal(weekday(clock.date),6);
delayedFair.electricCampaign=electric.initial();
delayedFair.electricCampaign.fair.status='awarded';
delayedFair.electricCampaign.fair.playerBidCents=240;
delayedFair.componentWorks.orders.push({
 id:'FE-1878-FAIR-BULBS',customer:'Washington World’s Fair',
 productId:'incandescent-lamp',quantity:100,priceCents:0,
 made:0,delivered:0,status:'accepted',deadline:'1878-12-31',special:'fair-1878'});
delayedFair.componentWorks.warehouse['incandescent-lamp']=1;
const blank=JSON.stringify(delayedFair);
assert.equal(act(delayedFair,'fair-dispatch',{quantity:1},'fair:phantom').ok,false);
assert.equal(JSON.stringify(delayedFair),blank);
delayedFair.componentWorks.orders[0].made=1;
const lateFair=act(delayedFair,'fair-dispatch',{quantity:1},'fair:late');
assert.equal(lateFair.ok,true);
assert.equal(lateFair.grossCents,240);
assert.equal(lateFair.latePenaltyCents,24);
assert.equal(lateFair.incomeCents,216);
assert.equal(delayedFair.componentWorks.warehouse['incandescent-lamp'],0);
console.log('PASS cheap bids can lose, material-bound lab, separate order stock and late District/Fair invoice deductions');
