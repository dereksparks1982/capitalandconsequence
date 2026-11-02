'use strict';
const assert=require('node:assert/strict');
const rail=require('../railway-network.js');
globalThis.FE_RAILWAY=rail;
let clock={date:'1878-02-05',minuteOfDay:600};
globalThis.FE_WASHINGTON_TIME={
 now:()=>({...clock}),
 phaseSecondsRemaining:()=>Math.max(0,(1020-clock.minuteOfDay)*60)
};
globalThis.FE_CORPORATE={canManage:s=>s.corporateGovernance?.president!=='vale'};
const company=require('../railway-company.js');
const fixture=()=>({characterRoute:'industrialist',phase:'day',paused:false,
 gameDate:'1878-02-05',currentLocation:{locationId:'factory',roomId:'executive-office'},
 companyCash:10000,personalCash:600,worldCalendar:{worldMinute:450000},
 componentWorks:{cashCents:1000000},notes:[]});
const s=fixture();
const a={x:.15,y:.25},b={x:.25,y:.25},c={x:.3,y:.25};
assert.equal(rail.addSegment(s,a,b).ok,true);
assert.equal(rail.addSegment(s,b,c).ok,true);
const x=rail.addStation(s,a,'Western Junction').station,y=rail.addStation(s,c,'Eastern Junction').station;
const before=JSON.stringify(s),rights={action:'rights',from:x.id,to:y.id,date:clock.date};
assert.equal(company.preflight(s,rights).ok,false,'Cannot purchase railway rights before charter');
assert.equal(JSON.stringify(s),before,'Quote is read-only and does not convert a pencil line into property');
assert.equal(company.transact(s,{...rights,token:'rail:nocharter',spentSeconds:3600}).ok,false);
assert.equal(company.read(s).lines.length,0);
let token=0;
function work(request){
 const proposal=company.preflight(s,request);
 assert.equal(proposal.ok,true,proposal.reason);
 clock.minuteOfDay+=proposal.seconds/60;
 s.worldCalendar.worldMinute+=proposal.seconds/60;
 const receipt=company.transact(s,{...request,date:request.date||clock.date,
  spentSeconds:proposal.seconds,token:'rail:work:'+(++token)});
 assert.equal(receipt.ok,true,receipt.reason);
 assert.equal(receipt.elapsedSeconds,proposal.seconds);
 assert.equal(s.componentWorks.cashCents,Math.round(s.companyCash*100));
 return {proposal,receipt};
}
let w=work({action:'charter',date:clock.date});
assert.equal(w.receipt.costCents,25000);
assert.equal(company.read(s).charter.owner,'Federal Electric');
assert.equal(company.read(s).lines.length,0);
assert.equal(company.preflight(s,{...rights,from:x.id,to:'missing'}).ok,false);
const cashBefore=s.companyCash;
w=work(rights);
const lineId=w.receipt.lineId,line=company.read(s).lines[0];
assert.equal(line.status,'under-construction');
assert.equal(line.crewShiftsCompleted,0);
assert.equal(line.route.length,3,'Route follows BOTH physically drawn segments, not a straight shortcut');
assert.ok(s.companyCash<cashBefore);
assert.equal(company.read(s).lines.length,1);
assert.equal(company.preflight(s,rights).ok,false,'Original acquired rights cannot be duplicated');
assert.equal(company.preflight(s,{action:'engine',date:clock.date}).ok,false,'Cannot acquire a free train before track is built');
assert.equal(company.preflight(s,{action:'dispatch',lineId,date:clock.date}).ok,false);
const snapshot=JSON.stringify(s);
assert.equal(company.transact(s,{action:'build',lineId,spentSeconds:0,date:clock.date,token:'rail:invalid'}).ok,false);
assert.equal(JSON.stringify(s),snapshot,'Claiming construction without the 90-minute time cost cannot change balances or deeds');
for(let i=0;i<line.crewShiftsRequired;i++){
 clock={date:'1878-02-'+String(6+i).padStart(2,'0'),minuteOfDay:600};
 s.gameDate=clock.date;s.worldCalendar.worldMinute+=1440;
 const shift=work({action:'build',lineId,date:clock.date}).receipt;
 assert.equal(shift.costCents,3500);
 assert.equal(shift.status,i===line.crewShiftsRequired-1?'open':'under-construction');
}
const open=company.read(s).lines[0];
assert.equal(open.openDate,s.gameDate);
assert.equal(open.crewShiftsCompleted,open.crewShiftsRequired);
assert.equal(open.constructionCostCents,3500*open.crewShiftsRequired);
assert.equal(company.preflight(s,{action:'build',lineId,date:clock.date}).ok,false,'Completed construction cannot be paid twice');
const engine=work({action:'engine',date:clock.date}).receipt;
assert.equal(engine.costCents,140000);
assert.equal(company.read(s).engines.length,1);
assert.equal(company.read(s).trips.length,0,'Purchasing a locomotive must not invent a passenger service');
const paid=work({action:'dispatch',lineId,date:clock.date}).receipt;
assert.equal(paid.costCents,1200);
const t=company.trips(s).at(-1);
assert.equal(t.status,'running');
assert.equal(t.passengerRevenueCents,0);
assert.equal(t.freightRevenueCents,0);
assert.ok(company.locomotivePosition(s)?.x>=a.x);
assert.equal(company.preflight(s,{action:'dispatch',lineId,date:clock.date}).ok,false,'One engine may not run duplicate simultaneous trains');
const copy=JSON.parse(JSON.stringify(s));
assert.equal(company.read(copy).lines[0].route.length,3);
assert.equal(company.read(copy).trips.length,1);
const ref=paid.token,oldCash=s.companyCash,oldTrips=company.read(s).trips.length;
assert.equal(company.transact(s,{action:'dispatch',lineId,date:clock.date,token:ref,spentSeconds:900}).repeated,true);
assert.equal(s.companyCash,oldCash);
assert.equal(company.read(s).trips.length,oldTrips);
s.worldCalendar.worldMinute+=t.durationMinutes;
assert.equal(company.trips(s).at(-1).status,'arrived');
assert.equal(company.locomotivePosition(s),null);
s.railwayPlanner={version:1,segments:[],stations:[],trains:[]};
assert.equal(company.read(s).lines[0].status,'open','Editing free planning marks cannot demolish registered railroad');
assert.equal(company.read(s).lines[0].route.length,3);
const stranger=fixture();
assert.equal(company.read(stranger).lines.length,0,'Other characters / save files cannot inherit purchased railway property');
s.corporateGovernance={president:'vale'};
assert.equal(company.preflight(s,{action:'dispatch',lineId,date:clock.date}).ok,false,'Removed corporate president cannot spend railway treasury');
console.log('PASS railway charter, rights, paid crew construction, separate permanent owned routes, actual locomotive and fuel, one world clock, no imaginary fares, receipts and control guards');
