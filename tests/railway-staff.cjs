'use strict';
const assert=require('node:assert/strict');
const rail=require('../railway-network.js');globalThis.FE_RAILWAY=rail;
let clock={date:'1878-02-05',minuteOfDay:600};
globalThis.FE_WASHINGTON_TIME={now:()=>({...clock}),
 phaseSecondsRemaining:()=>Math.max(0,(1020-clock.minuteOfDay)*60)};
const company=require('../railway-company.js');
const staff=require('../railway-staff.js');
const make=()=>({characterRoute:'industrialist',phase:'day',paused:false,gameDate:clock.date,
 currentLocation:{locationId:'factory',roomId:'executive-office'},
 companyCash:1000,personalCash:100,worldCalendar:{worldMinute:450000},
 componentWorks:{cashCents:100000},notes:[],railwayCompany:{version:1,
 charter:{date:'1878-01-31',status:'registered'},
 lines:[{id:'RAIL-LINE-1',status:'open',length:160,
  stations:[{id:'a',name:'Origin'},{id:'b',name:'Destination'}],
  route:[{x:.1,y:.2},{x:.2,y:.2}]}],
 engines:[{id:'FE-LOCO-1',status:'serviceable'}],
 trips:[],receipts:{},ledger:[],serial:1}});
const s=make();
assert.equal(staff.preview(s,'engineer',clock.date).ok,true);
assert.equal(staff.preview(s,'bogus',clock.date).ok,false);
const original=JSON.stringify(s);
assert.equal(staff.hire(s,{role:'engineer',date:clock.date,spentSeconds:0,token:'staff:wrong'}).ok,false);
assert.equal(JSON.stringify(s),original,'Unpaid training cannot hire anyone');
function hire(role,token){
 const q=staff.preview(s,role,clock.date);assert.equal(q.ok,true,q.reason);
 clock.minuteOfDay+=q.seconds/60;s.worldCalendar.worldMinute+=q.seconds/60;
 const outcome=staff.hire(s,{role,date:clock.date,spentSeconds:q.seconds,token});
 assert.equal(outcome.ok,true);return outcome;
}
const engineer=hire('engineer','staff:engineer');
assert.equal(engineer.costCents,12000);
assert.equal(s.companyCash,880);
assert.equal(s.componentWorks.cashCents,88000);
const conductor=hire('conductor','staff:conductor');
assert.equal(conductor.costCents,7000);
assert.equal(s.companyCash,810);
assert.equal(staff.current(s).engineer.hired,true);
assert.equal(staff.current(s).conductor.hired,true);
assert.equal(staff.preview(s,'engineer',clock.date).ok,false,'Duplicate paid job not available');
const replay=staff.hire(s,{role:'engineer',date:clock.date,spentSeconds:5400,token:'staff:engineer'});
assert.equal(replay.repeated,true);
assert.equal(s.companyCash,810,'Staff receipt replay cannot pay a second signing bonus');
const start=company.preflight(s,{action:'dispatch',lineId:'RAIL-LINE-1',date:clock.date});
assert.equal(start.ok,true);
clock.minuteOfDay+=start.seconds/60;s.worldCalendar.worldMinute+=start.seconds/60;
assert.equal(company.transact(s,{action:'dispatch',lineId:'RAIL-LINE-1',date:clock.date,
 token:'rail:staff:departure',spentSeconds:start.seconds}).ok,true);
assert.equal(s.railwayCompany.lines[0].condition,99,'A hired conductor reduces track wear from two to one');
assert.equal(s.railwayCompany.engines[0].condition,98,'A hired engineer reduces locomotive wear from four to two');
assert.equal(s.companyCash,798,'Fuel still costs twelve dollars with hired staff');
clock={date:'1878-02-09',minuteOfDay:900};s.gameDate=clock.date;
assert.equal(new Date(clock.date+'T12:00:00Z').getUTCDay(),6,'Fixture uses a real Saturday');
let wages=staff.settleSaturday(s);
assert.equal(wages.ok,true);
assert.equal(wages.weeklyCents,3000);
assert.equal(wages.paidCents,3000);
assert.equal(wages.arrearsCents,0);
assert.equal(s.companyCash,768);
assert.equal(staff.settleSaturday(s).repeated,true,'Closing Saturday twice never pays again');
assert.equal(s.companyCash,768);
clock={date:'1878-02-16',minuteOfDay:900};s.gameDate=clock.date;
s.companyCash=5;
wages=staff.settleSaturday(s);
assert.equal(wages.weeklyCents,3000);
assert.equal(wages.paidCents,500);
assert.equal(wages.arrearsCents,2500,'Short payroll must become actual employee arrears');
assert.equal(s.companyCash,0);
assert.equal(s.componentWorks.cashCents,0);
clock={date:'1878-02-23',minuteOfDay:900};s.gameDate=clock.date;
s.companyCash=100;
wages=staff.settleSaturday(s);
assert.equal(wages.dueCents,5500,'Old arrears are paid in addition to next week’s wages');
assert.equal(wages.paidCents,5500);
assert.equal(wages.arrearsCents,0);
assert.equal(s.companyCash,45);
assert.equal(staff.current(JSON.parse(JSON.stringify(s))).paidCents,9000);
assert.equal(s.railwayCompany.staffPayroll.length,3);
s.characterRoute='criminal';
assert.equal(staff.preview(s,'conductor',clock.date).ok,false);
const other=make();assert.equal(staff.current(other).engineer,null,'No railway employee is free across profiles');
console.log('PASS paid rail specialists improve only owned-train wear, Saturday wages exactly once, company cash/arrears, delayed debt repayment and profile privacy');
