'use strict';
const assert=require('node:assert/strict');
const railway=require('../railway-network.js');globalThis.FE_RAILWAY=railway;
let clock={date:'1878-02-05',minuteOfDay:600};
globalThis.FE_WASHINGTON_TIME={now:()=>({...clock}),
 phaseSecondsRemaining:()=>Math.max(0,(1020-clock.minuteOfDay)*60)};
const company=require('../railway-company.js');
const s={characterRoute:'industrialist',gameDate:clock.date,phase:'day',paused:false,
 currentLocation:{locationId:'factory',roomId:'executive-office'},companyCash:5000,
 worldCalendar:{worldMinute:450000},notes:[],railwayCompany:{version:1,
 charter:{date:'1878-01-31',status:'registered'},
 lines:[{id:'RAIL-LINE-1',status:'open',length:200,
  stations:[{id:'west',name:'West Station'},{id:'east',name:'East Station'}],
  route:[{x:.1,y:.2},{x:.2,y:.2}],crewShiftsRequired:2,crewShiftsCompleted:2}],
 engines:[{id:'FE-LOCO-1',status:'serviceable'}],trips:[],receipts:{},ledger:[],serial:1}};
let spent=0;
function act(action,lineId,token){
 const req={action,lineId,date:clock.date},pre=company.preflight(s,req);
 assert.equal(pre.ok,true,pre.reason);
 spent=pre.seconds;
 clock.minuteOfDay+=spent/60;
 s.worldCalendar.worldMinute+=spent/60;
 const out=company.transact(s,{...req,spentSeconds:spent,token});
 assert.equal(out.ok,true,out.reason);
 return out;
}
assert.equal(company.preflight(s,{action:'engine-repair',lineId:'FE-LOCO-1',date:clock.date}).ok,false,'Undamaged engine needs no costly repair');
assert.equal(company.preflight(s,{action:'line-repair',lineId:'RAIL-LINE-1',date:clock.date}).ok,false,'Undamaged track needs no repair');
const cash=s.companyCash;
const first=act('dispatch','RAIL-LINE-1','departure:1');
assert.equal(s.railwayCompany.lines[0].condition,98);
assert.equal(s.railwayCompany.engines[0].condition,96);
assert.equal(s.companyCash,cash-12);
assert.equal(first.costCents,1200);
assert.equal(first.cargoManifestId,null,'Wear is not an automatic cargo sale');
assert.equal(company.transact(s,{action:'dispatch',lineId:'RAIL-LINE-1',date:clock.date,
 spentSeconds:900,token:'departure:1'}).repeated,true);
assert.equal(s.railwayCompany.engines[0].condition,96,'Replayed travel never consumes condition twice');
for(let i=1;i<18;i++){
 const old=s.railwayCompany.trips.at(-1);
 s.worldCalendar.worldMinute=old.departMinute+old.durationMinutes+1;
 clock={date:'1878-02-'+String(6+i).padStart(2,'0'),minuteOfDay:600};
 s.gameDate=clock.date;
 act('dispatch','RAIL-LINE-1','departure:'+(i+1));
}
assert.equal(s.railwayCompany.engines[0].condition,28);
assert.equal(s.railwayCompany.lines[0].condition,64);
assert.equal(company.preflight(s,{action:'dispatch',lineId:'RAIL-LINE-1',date:clock.date}).ok,false,
 'Unsafe, worn-out engine must stop the paid railway');
assert.equal(company.preflight(s,{action:'engine-repair',lineId:'FE-LOCO-1',date:clock.date}).ok,false,
 'Cannot wrench on a locomotive still moving along its route');
assert.equal(company.preflight(s,{action:'line-repair',lineId:'RAIL-LINE-1',date:clock.date}).ok,false,
 'Cannot send a maintenance gang onto an occupied line');
const lastTrain=s.railwayCompany.trips.at(-1);
s.worldCalendar.worldMinute=lastTrain.departMinute+lastTrain.durationMinutes+1;
const prior=JSON.stringify(s);
assert.equal(company.transact(s,{action:'engine-repair',lineId:'FE-LOCO-1',
 date:clock.date,spentSeconds:0,token:'repair:invalid'}).ok,false);
assert.equal(JSON.stringify(s),prior,'Zero-time engine repair is impossible');
const repair=act('engine-repair','FE-LOCO-1','repair:engine');
assert.equal(repair.costCents,5000);
assert.equal(s.railwayCompany.engines[0].condition,68);
assert.equal(repair.condition,68);
assert.equal(company.transact(s,{action:'engine-repair',lineId:'FE-LOCO-1',
 date:clock.date,spentSeconds:7200,token:'repair:engine'}).repeated,true);
assert.equal(s.railwayCompany.engines[0].condition,68,'Mechanics cannot repair twice on receipt replay');
const track=act('line-repair','RAIL-LINE-1','repair:track');
assert.equal(track.costCents,6500);
assert.equal(s.railwayCompany.lines[0].condition,100);
assert.equal(company.preflight(s,{action:'line-repair',lineId:'RAIL-LINE-1',date:clock.date}).ok,false);
assert.equal(company.read(JSON.parse(JSON.stringify(s))).engines[0].condition,68,'Condition survives serialized profile');
assert.equal(company.read(s).lines[0].constructionCostCents||0,0,'Maintenance did not rewrite original land or construction amounts');
assert.equal(s.railwayCompany.trips.every(t=>t.passengerRevenueCents===0&&t.freightRevenueCents===0),true,
 'Maintenance is an expense, not invented passenger income');
s.characterRoute='criminal';
assert.equal(company.preflight(s,{action:'engine-repair',lineId:'FE-LOCO-1',date:clock.date}).ok,false,
 'Eli may not repair Charles’s railway using his own access');
console.log('PASS 18 physical paid railway runs degrade line/engine, unsafe engine stops service, paid repairs restore exact condition, no repeats, no phantom income');
