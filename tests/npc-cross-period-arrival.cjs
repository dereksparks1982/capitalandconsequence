'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const code=fs.readFileSync(path.join(__dirname,'../npc-ai.js'),'utf8');
const flow=code.slice(code.indexOf(' function syncClock('),code.indexOf(' function observedPosition('));
assert.ok(flow.includes('finishJourneys(w,S.worldCalendar.worldMinute);\n     calendarOnce(w,c,key);'),
 'An arriving resident must be resolved BEFORE the new calendar slot routine');
const from=code.indexOf(' function recordNpcArrival('),to=code.indexOf(' function stepOnce(',from);
assert.ok(from>0&&to>from,'Live journey code must be present');
const sales=[],actor={locationId:'factory',roomId:'production-floor',status:'present',
 needs:{hunger:85},economy:{balanceCents:150}};
const context={
 autonomous:()=>[{id:'buyer'}],w:{agents:{buyer:actor}},S:{},
 window:{FE_CALENDAR_BRIDGE:{moment:()=>({date:'1878-01-04'})}},
 observedDate:()=> '1878-01-04',
 shopAtObservedMarket:(def,a,date,key)=>{
  assert.equal(def.id,'buyer');assert.equal(a.status,'present');
  assert.equal(a.locationId,'oldChinatown');assert.equal(date,'1878-01-04');
  const receipt={id:71,key};sales.push(receipt);return receipt;
 }
};
const api=vm.runInNewContext('(function(){'+code.slice(from,to)+
 'return {journeyArrival,finishJourneys};})()',context);
const shopping={locationId:'oldChinatown',roomId:'market',activity:'shopping for groceries'};
assert.equal(api.journeyArrival(actor,shopping,1000,995).status,'travelling');
assert.equal(api.finishJourneys(context.w,1024),false);
assert.equal(sales.length,0,'No shopping until physically present');
assert.equal(api.finishJourneys(context.w,1025),true);
assert.equal(sales.length,1,'Completed journey triggers one observable sale');
assert.equal(actor.returnErrand.from,'oldChinatown');
assert.equal(actor.returnErrand.to,'factory','Return destination is actual origin');
assert.equal(actor.returnErrand.purchaseId,71);
assert.equal(api.finishJourneys(context.w,1025),false);
assert.equal(sales.length,1,'Arrival replay does not purchase twice');
const back={locationId:'factory',roomId:'production-floor',activity:'back to the workshop'};
assert.equal(api.journeyArrival(actor,back,1030,1025).status,'travelling');
assert.equal(api.finishJourneys(context.w,1055),true);
assert.equal(actor.locationId,'factory');
assert.equal(actor.returnErrand,null,'Return intent clears on reaching origin');
assert.equal(actor.journeyHistory.length,2);
console.log('PASS new-period arrival first, paid market visit, no in-transit shopping, and completed return');