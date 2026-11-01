/* Capital & Consequence v0.7.74: owner-directed staffed production desk.
 * Real order stock, existing Washington clock and Friday/Saturday accounting.
 * Does NOT generate work while the app is closed or during unrelated travel.
 */
(function(root){
'use strict';
const works=typeof module==='object'&&module.exports?require('./component-works.js'):root.FE_COMPONENT_WORKS;
const operations=typeof module==='object'&&module.exports?require('./workshop-operations.js'):root.FE_WORKSHOP_OPERATIONS;
const capacity=typeof module==='object'&&module.exports?require('./factory-capacity.js'):root.FE_FACTORY_CAPACITY;
if(!works||!operations||!capacity)throw Error('Component workshop, operations and staff capacity are required.');
const int=(x,lo,hi)=>Number.isSafeInteger(x)&&x>=lo&&x<=hi;
const clone=x=>JSON.parse(JSON.stringify(x));
function state(save){
 const d=save?.componentWorks?.productionDesk||{version:1,priority:[]};
 if(d.version!==1||!Array.isArray(d.priority)||d.priority.some(x=>typeof x!=='string')||
   new Set(d.priority).size!==d.priority.length)throw Error('Damaged production desk priorities.');
 return d;
}
function orderView(save){
 works.verify(save.componentWorks);
 const open=save.componentWorks.orders.filter(o=>works.PRODUCTS[o.productId]&&o.made<o.quantity);
 const choices=state(save).priority;
 const rank=id=>{const index=choices.indexOf(id);return index<0?Number.MAX_SAFE_INTEGER:index};
 open.sort((a,b)=>rank(a.id)-rank(b.id)||a.deadline.localeCompare(b.deadline)||a.id.localeCompare(b.id));
 const staff=capacity.read(save);
 return open.map(o=>{
  const product=works.PRODUCTS[o.productId],role=product.station;
  const staffed=role==='lamp-line'?
   !!(save.electricCampaign?.lamps?.crew>=2&&save.electricCampaign?.lamps?.upgraded):
   !!(staff.staff[role]?.count>=1&&staff.machines[role]>=2);
  const enabled=works.eligibility(save.componentWorks,o.productId).ok;
  const remaining=o.quantity-o.made,per=works.unitMinutes(save.componentWorks,o.productId);
  const kits=Object.entries(product.inputs).map(([id,n])=>({
   id,per:n,stock:save.componentWorks.materials[id]||0,missing:Math.max(0,n-(save.componentWorks.materials[id]||0))
  }));
  const maxByStock=Math.min(1000,...kits.map(x=>Math.floor(x.stock/x.per)));
  return {id:o.id,productId:o.productId,name:product.name,customer:o.customer,deadline:o.deadline,
   remaining,made:o.made,delivered:o.delivered,role,staffed,enabled,minutesPerUnit:per,
   estimatedMinutes:remaining*per,possibleNow:Math.min(remaining,Math.max(0,maxByStock)),
   kits,priority:choices.includes(o.id)?rank(o.id)+1:null,
   due:save.componentWorks.date>o.deadline};
 });
}
function forecast(save){
 const orders=orderView(save),cents=Math.round((save.companyCash||0)*100);
 const materials={};
 for(const o of orders){
  const p=works.PRODUCTS[o.productId];
  for(const [id,per] of Object.entries(p.inputs))materials[id]=(materials[id]||0)+o.remaining*per;
 }
 const shortages={};let costCents=0;
 for(const [id,required] of Object.entries(materials)){
  const stock=save.componentWorks.materials[id]||0,missing=Math.max(0,required-stock);
  if(missing){shortages[id]=missing;costCents+=missing*works.MATERIALS[id].costCents}
 }
 const overdue=orders.filter(o=>o.due);
 const specialistWages=Object.entries(capacity.ROLES).reduce((n,[id,v])=>
  n+(capacity.read(save).staff[id].count*v.weeklyCents),0);
 const revenueCents=orders.reduce((n,o)=>{
  const item=save.componentWorks.orders.find(x=>x.id===o.id);
  if(item.special==='street-1878')return n; // certified and paid separately
  if(item.special==='fair-1878')return n+o.remaining*(save.electricCampaign?.fair?.playerBidCents||0);
  return n+o.remaining*item.priceCents;
 },0);
 return {orders,shortages,costCents,cashCents:cents,overdue:overdue.length,
  estimatedMinutes:orders.reduce((n,o)=>n+o.estimatedMinutes,0),
  specialistWeeklyCents:specialistWages,
  potentialInvoiceCents:revenueCents,
  note:'Forecast excludes customer defaults, late penalties, lamp scrap, general upkeep, other payroll and tender award uncertainty.'};
}
function requireShift(save,clock){
 if(save?.characterRoute!=='industrialist'||!save.componentWorks||save.paused||save.phase!=='day'||
  save.currentLocation?.locationId!=='factory')return {ok:false,reason:'Charlie must supervise at Federal Electric during an active workday.'};
 if(root.FE_CORPORATE&&!root.FE_CORPORATE.canManage(save))return {ok:false,reason:'Factory authorization requires corporate management.'};
 if(!clock||!/^\d{4}-\d{2}-\d{2}$/.test(clock.date)||!int(clock.minuteOfDay,0,1439))
  return {ok:false,reason:'Washington clock unavailable.'};
 const dow=new Date(clock.date+'T12:00:00Z').getUTCDay();
 if(!dow||dow===6||clock.minuteOfDay<540||clock.minuteOfDay>=1020)return {ok:false,reason:'Production office hours are Monday–Friday, 9 AM–5 PM.'};
 return {ok:true};
}
function transact(save,kind,details,token,spend,finishAtBell){
 if(!['prioritize','procure','run'].includes(kind)||typeof token!=='string'||
   !/^[a-z0-9][a-z0-9:._-]{0,119}$/i.test(token))return {ok:false,reason:'Invalid production desk instruction.'};
 if(!save?.componentWorks)return {ok:false,reason:'Component workshop missing.'};
 works.verify(save.componentWorks);
 if(save.componentWorks.receipts[token])return {...save.componentWorks.receipts[token],repeated:true};
 const current=root.FE_WASHINGTON_TIME?.now?.(save);
 const gate=requireShift(save,current);if(!gate.ok)return gate;
 const money=Math.round(save.companyCash*100);
 if(!int(money,0,Number.MAX_SAFE_INTEGER))return {ok:false,reason:'Company cash is not valid.'};
 const next=clone(save.componentWorks),old=state(save);
 const desk=clone(old),planned=forecast(save);
 let seconds,costCents=0,receipt={},incident=null;
 if(kind==='prioritize'){
  const id=details?.orderId;
  if(!planned.orders.some(o=>o.id===id))return {ok:false,reason:'Select an unfinished manufacturing order.'};
  if(desk.priority[0]===id)return {ok:false,reason:'This order is already the first priority.'};
  desk.priority=[id,...desk.priority.filter(x=>x!==id)];
  seconds=5*60;receipt={message:'Moved '+id+' to the front of the managed production queue.'};
 }else if(kind==='procure'){
  if(!Object.keys(planned.shortages).length)return {ok:false,reason:'All open orders have enough shared raw materials for their remaining production.'};
  if(Object.values(planned.shortages).some(v=>!int(v,1,100000)))return {ok:false,reason:'The shortage is too large for one procurement.'};
  costCents=planned.costCents;seconds=15*60;
  if(costCents>money)return {ok:false,reason:'Insufficient company funds for all outstanding factory materials.'};
  for(const [id,qty] of Object.entries(planned.shortages))next.materials[id]+=qty;
  receipt={materialsAdded:planned.shortages,message:'Bought the raw-material shortfall across all open workshop orders.'};
 }else{
  const shiftMinutes=Number(details?.minutes);
  if(![60,120,180,240].includes(shiftMinutes))return {ok:false,reason:'Choose a supervised shift of 1, 2, 3 or 4 hours.'};
  const assistant=save.npcSimulation?.agents?.foremanSullivan;
  if(assistant?.locationId!=='factory'||assistant?.status!=='present')
   return {ok:false,reason:'Sullivan must be present to oversee safe staffed production.'};
  // Use a copy for availability so rejected instructions cannot silently create incident records.
  const check=operations.availability({...save,workshopOperations:save.workshopOperations?clone(save.workshopOperations):undefined},current);
  if(!check.ok)return check;
  const totalSec=(1020-current.minuteOfDay)*60-(save.worldCalendarRemainder||0);
  if(totalSec<=0)return {ok:false,reason:'No work shift remains today.'};
  // A short shift skips long jobs rather than failing when a later queued
  // order can genuinely finish one unit in the available workday.
  const selected=planned.orders.find(o=>o.staffed&&o.enabled&&o.possibleNow>0&&
   o.minutesPerUnit<=shiftMinutes&&o.minutesPerUnit*60<=totalSec);
  if(!selected)return {ok:false,reason:'No qualified, supplied order fits one complete unit in this shift before the 5 PM bell.'};
  const maxUnits=Math.min(selected.remaining,selected.possibleNow,Math.floor(shiftMinutes/selected.minutesPerUnit),
   Math.floor(totalSec/(selected.minutesPerUnit*60)));
  if(maxUnits<1)return {ok:false,reason:'No complete unit fits within the selected shift or before 5 PM.'};
  next.date=current.date;
  const produced=works.assemble(next,selected.id,maxUnits,token);
  if(!produced.ok)return produced;
  seconds=produced.minutesRequired*60;
  const stored=next.receipts[token];
  stored.delegated=true;stored.workerRole=selected.role;stored.orderedUnits=maxUnits;
  stored.message='Specialist completed '+produced.goodUnits+' accepted '+selected.name+
   (produced.rejectedUnits?' and scrapped '+produced.rejectedUnits+' defective attempts.':'.');
  const entry=next.ledger.findLast(x=>x.token===token);if(entry)Object.assign(entry,stored);
  receipt={...stored,elapsedSeconds:seconds};
 }
 if(!seconds||!int(seconds,1,14400))return {ok:false,reason:'Invalid shift duration.'};
 const remaining=(1020-current.minuteOfDay)*60-(save.worldCalendarRemainder||0);
 if(seconds>remaining)return {ok:false,reason:'Not enough time before the 5 PM closing bell.'};
 const atBell=seconds===remaining;
 if(atBell&&typeof finishAtBell!=='function')return {ok:false,reason:'The closing bell settlement callback is required.'};
 if(typeof spend!=='function'||spend(seconds,true,atBell)!==seconds)
  return {ok:false,reason:'The authoritative clock could not record the factory work.'};
 if(kind!=='run'){
  receipt={ok:true,kind:'factory-'+kind,token,date:current.date,elapsedSeconds:seconds,costCents,...receipt};
  next.receipts[token]=receipt;next.ledger.push(receipt);
  if(next.ledger.length>128)next.ledger.splice(0,next.ledger.length-128);
 }
 next.productionDesk=desk;
 next.cashCents=money-costCents;
 save.componentWorks=next;
 save.companyCash=(money-costCents)/100;
 if(costCents)save.lastExpenses=Math.round((save.lastExpenses||0)*100+costCents)/100;
 if(kind==='run')incident=operations.afterAssembly(save,{...receipt,token},receipt.productId,current.date);
 if(kind!=='run'&&Array.isArray(save.notes))
  save.notes.push({date:current.date,source:'Federal Electric production office',text:receipt.message});
 if(atBell&&finishAtBell()!==true)throw Error('Factory closing settlement failed.');
 return {...receipt,incident,repeated:false};
}
const api=Object.freeze({state,orderView,forecast,transact});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_FACTORY_DISPATCH=api;
})(typeof window!=='undefined'?window:globalThis);
