'use strict';
const assert=require('node:assert/strict'),works=require('../component-works.js'),
 railNet=require('../railway-network.js');
globalThis.FE_RAILWAY=railNet;
globalThis.FE_COMPONENT_WORKS=works;
let clock={date:'1878-02-05',minuteOfDay:600};
globalThis.FE_WASHINGTON_TIME={now:()=>({...clock}),
 phaseSecondsRemaining:()=>Math.max(0,(1020-clock.minuteOfDay)*60)};
const company=require('../railway-company.js');
globalThis.FE_RAIL_COMPANY=company;
const freight=require('../railway-freight.js');
const s={gameDate:clock.date,phase:'day',paused:false,characterRoute:'industrialist',
 currentLocation:{locationId:'factory',roomId:'executive-office'},companyCash:3000,personalCash:300,
 worldCalendar:{worldMinute:450000},notes:[],componentWorks:works.createState('1878-02-05'),
 railwayCompany:{version:1,charter:{date:'1878-01-10',status:'registered'},
 lines:[{id:'RAIL-LINE-1',status:'open',fromId:'first',toId:'second',
 stations:[{id:'first',name:'Factory platform'},{id:'second',name:'Market depot'}],
 route:[{x:.1,y:.2},{x:.2,y:.2}],length:205,
 crewShiftsRequired:2,crewShiftsCompleted:2}],
 engines:[{id:'FE-LOCO-1',purchasePriceCents:140000,status:'serviceable'}],
 trips:[],receipts:{},ledger:[],serial:1}};
s.componentWorks.warehouse['insulated-wire']=12;
const fake={action:'load',lineId:'RAIL-LINE-1',productId:'insulated-wire',quantity:5,date:clock.date};
const snapshot=JSON.stringify(s);
assert.equal(freight.preflight(s,fake).ok,true);
assert.equal(JSON.stringify(s),snapshot,'Inspecting a booking does not debit the workshop');
assert.equal(freight.transact(s,{...fake,token:'rail:wrong',spentSeconds:0}).ok,false);
assert.equal(JSON.stringify(s),snapshot,'No free warehouse loading');
assert.equal(freight.preflight(s,{...fake,quantity:13}).ok,false);
assert.equal(freight.preflight(s,{...fake,lineId:'invented'}).ok,false);
function advance(seconds){clock.minuteOfDay+=seconds/60;s.worldCalendar.worldMinute+=seconds/60;}
const quote=freight.preflight(s,fake);advance(quote.seconds);
const charged=freight.transact(s,{...fake,token:'rail:loading:1',spentSeconds:quote.seconds});
assert.equal(charged.ok,true);
assert.equal(charged.costCents,1100);
assert.equal(s.companyCash,2989);
assert.equal(s.componentWorks.cashCents,298900);
assert.equal(s.componentWorks.warehouse['insulated-wire'],7);
assert.equal(freight.manifests(s)[0].status,'origin-loaded');
assert.equal(freight.manifests(s)[0].paymentCents,0);
assert.equal(freight.preflight(s,fake).ok,false,'Cannot book infinite cargo onto one unpaid movement');
assert.equal(freight.transact(s,{...fake,token:'rail:loading:1',spentSeconds:quote.seconds}).repeated,true);
assert.equal(s.componentWorks.warehouse['insulated-wire'],7,'Replay never deducts warehouse twice');
const dispatch={action:'dispatch',lineId:'RAIL-LINE-1',date:clock.date};
const open=company.preflight(s,dispatch);
assert.equal(open.ok,true);
advance(open.seconds);
const train=company.transact(s,{...dispatch,token:'rail:dispatch:1',spentSeconds:open.seconds});
assert.equal(train.ok,true);
assert.equal(train.cargoManifestId,'FE-RAIL-CARGO-1','Only a real paid train loads the manifest');
assert.equal(s.railwayCompany.freight[0].status,'in-transit');
assert.equal(s.railwayCompany.freight[0].tripId,train.tripId);
assert.equal(s.companyCash,2977,'Fuel and factory cartage paid, no customer revenue');
const receive={action:'receive',manifestId:'FE-RAIL-CARGO-1',date:clock.date};
assert.equal(freight.preflight(s,receive).ok,false,'Cannot receive unsent freight before actual train arrival');
assert.deepEqual(s.railwayCompany.depots,{},'Booking and departure do not place unarrived inventory at the destination.');
const trip=s.railwayCompany.trips.at(-1);
s.worldCalendar.worldMinute=trip.departMinute+trip.durationMinutes;
clock.minuteOfDay+=trip.durationMinutes;
assert.equal(freight.preflight(s,receive).ok,true,'Station arrival is proved by existing world time');
const check=freight.preflight(s,receive);advance(check.seconds);
const delivered=freight.transact(s,{...receive,token:'rail:delivery:1',spentSeconds:check.seconds});
assert.equal(delivered.ok,true);
assert.equal(s.railwayCompany.depots.second['insulated-wire'],5);
assert.equal(s.componentWorks.warehouse['insulated-wire'],7,'Depot is a real transfer, not duplication into factory');
assert.equal(s.railwayCompany.freight[0].status,'at-destination-depot');
assert.equal(s.railwayCompany.freight[0].paymentCents,0);
const balance=s.companyCash;
assert.equal(freight.transact(s,{...receive,token:'rail:delivery:1',spentSeconds:check.seconds}).repeated,true);
assert.equal(freight.transact(s,{...receive,token:'rail:delivery:2',spentSeconds:check.seconds}).ok,false);
assert.equal(s.railwayCompany.depots.second['insulated-wire'],5);
assert.equal(s.companyCash,balance);
const loaded=JSON.parse(JSON.stringify(s));
assert.equal(freight.manifests(loaded)[0].status,'at-destination-depot');
assert.equal(company.read(loaded).trips[0].cargoManifestId,'FE-RAIL-CARGO-1');
loaded.characterRoute='criminal';
assert.equal(freight.preflight(loaded,{...fake,date:clock.date}).ok,false);
assert.equal(s.personalCash,300);
console.log('PASS warehouse stock moved to paid rail freight, authentic departure and arrival, saved depot, no external fictitious customer money, time and replay safety');
