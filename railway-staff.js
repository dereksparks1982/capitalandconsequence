/* Rail company staff: deliberately unnamed paid professionals until NPC
 * identities are approved. Hiring and weekly wages debit the actual company
 * account; inability to pay becomes arrears, never manufactured funds.
 */
(function(root){
'use strict';
const JOBS=Object.freeze({
 engineer:Object.freeze({title:'Locomotive engineer',hireCents:12000,wageCents:1800,minutes:90}),
 conductor:Object.freeze({title:'Railway conductor',hireCents:7000,wageCents:1200,minutes:60})
});
const clone=x=>JSON.parse(JSON.stringify(x));
function current(save){const state=save?.railwayCompany?.staff||{};
 return {engineer:state.engineer||null,conductor:state.conductor||null,
  lastPayrollDate:state.lastPayrollDate||null,
  arrearsCents:Number.isSafeInteger(state.arrearsCents)?state.arrearsCents:0,
  paidCents:Number.isSafeInteger(state.paidCents)?state.paidCents:0};}
function preview(save,role,date,postTime=false){
 const job=JOBS[role],now=root.FE_WASHINGTON_TIME?.now?.(save);
 if(!job)return {ok:false,reason:'Unknown railway appointment.'};
 if(save?.characterRoute!=='industrialist'||save.paused||save.phase!=='day'||
  save.currentLocation?.locationId!=='factory'||
  root.FE_CORPORATE?.canManage?.(save)===false)
  return {ok:false,reason:'Railway appointments must be made by the current company president at Federal Electric.'};
 if(now?.date!==date)return {ok:false,reason:'An actual Washington business date is required.'};
 if(!save.railwayCompany?.charter||!save.railwayCompany.lines?.some(x=>x.status==='open'))
  return {ok:false,reason:'A chartered operating rail corridor is required before hiring permanent rail staff.'};
 const staff=current(save);
 if(staff[role]?.hired)return {ok:false,reason:'This railway post is already filled.'};
 if(Math.round(Number(save.companyCash)*100)<job.hireCents)
  return {ok:false,reason:'Company treasury cannot afford the signing and training expense.'};
 if(!postTime){
  const available=root.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(save);
  if(!Number.isSafeInteger(available)||available<=job.minutes*60)
   return {ok:false,reason:'Insufficient Washington working time for the appointment.'};
 }
 return {ok:true,role,seconds:job.minutes*60,costCents:job.hireCents,date};
}
function hire(save,{role,date,token,spentSeconds}={}){
 if(typeof token!=='string'||!/^[a-z0-9][a-z0-9:._-]{0,99}$/i.test(token))
  return {ok:false,reason:'A unique railway staff appointment receipt is required.'};
 const old=save?.railwayCompany?.staffReceipts?.[token];
 if(old)return {...clone(old),repeated:true};
 const quote=preview(save,role,date,true);if(!quote.ok)return quote;
 if(spentSeconds!==quote.seconds)return {ok:false,reason:'The full appointment training time must pass.'};
 const company=save.railwayCompany;
 if(!company.staff)company.staff={engineer:null,conductor:null,lastPayrollDate:null,arrearsCents:0,paidCents:0};
 if(!company.staffReceipts)company.staffReceipts={};
 company.staff[role]={hired:true,since:date,weeklyCents:JOBS[role].wageCents,identity:null};
 save.companyCash=(Math.round(Number(save.companyCash)*100)-quote.costCents)/100;
 if(save.componentWorks)save.componentWorks.cashCents=Math.round(save.companyCash*100);
 const receipt={ok:true,kind:'rail-hire',role,date,token,elapsedSeconds:quote.seconds,
  costCents:quote.costCents,message:JOBS[role].title+
   ' contracted. Weekly wages are actual company obligations, not a free character perk.'};
 company.staffReceipts[token]=clone(receipt);
 company.ledger.push({date,action:'hire-'+role,token,costCents:quote.costCents});
 if(Array.isArray(save.notes))save.notes.push({date,source:'Railway employment register',text:receipt.message});
 return {...receipt,repeated:false};
}
function settleSaturday(save){
 const date=save?.gameDate;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||new Date(date+'T12:00:00Z').getUTCDay()!==6)
  return {ok:false,reason:'Railway weekly payroll is due only on the Saturday closing date.'};
 const rail=save?.railwayCompany;
 if(!rail?.charter||!rail.staff)return {ok:true,skipped:true,paidCents:0,owedCents:0};
 if(rail.staff.lastPayrollDate===date)return {ok:true,repeated:true,paidCents:0,
  owedCents:rail.staff.arrearsCents||0};
 const wage=Object.entries(JOBS).reduce((amount,[role,cfg])=>
  amount+(rail.staff[role]?.hired?cfg.wageCents:0),0);
 if(!wage)return {ok:true,skipped:true,paidCents:0,owedCents:0};
 const arrears=Math.max(0,Number(rail.staff.arrearsCents)||0);
 const due=wage+arrears;
 const balance=Math.max(0,Math.round(Number(save.companyCash||0)*100));
 const paid=Math.min(due,balance),unpaid=due-paid;
 rail.staff.lastPayrollDate=date;
 rail.staff.arrearsCents=unpaid;rail.staff.paidCents=(rail.staff.paidCents||0)+paid;
 save.companyCash=(balance-paid)/100;
 if(save.componentWorks)save.componentWorks.cashCents=Math.round(save.companyCash*100);
 if(!rail.staffPayroll)rail.staffPayroll=[];
 const entry={date,dueCents:due,weeklyCents:wage,paidCents:paid,arrearsCents:unpaid};
 rail.staffPayroll.push(entry);if(rail.staffPayroll.length>120)rail.staffPayroll.shift();
 rail.ledger.push({date,action:'staff-payroll',costCents:paid,dueCents:due,arrearsCents:unpaid});
 if(Array.isArray(save.notes))save.notes.push({date,source:'Railway wages',text:
  'Railway wages $'+(paid/100).toFixed(2)+' paid; $'+(unpaid/100).toFixed(2)+' still owed.'});
 return {ok:true,...clone(entry)};
}
const api=Object.freeze({JOBS,current,preview,hire,settleSaturday});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_RAIL_STAFF=api;
})(typeof window!=='undefined'?window:globalThis);
