/* v0.6.72: connect 1878 Component Works to the player's one world clock.
 * Uses the existing transaction-safe component engine. No new inventory model.
 */
(function(root){
 'use strict';
 const works=typeof module==='object'&&module.exports?require('./component-works.js'):root.FE_COMPONENT_WORKS;
 if(!works)throw Error('Component Works must load first');
 const periods=Object.freeze({order:5,purchase:5,ship:15});
 function transact(save,kind,details,token,spend,finishAtBell=null){
  if(!save?.componentWorks||save.paused)return {ok:false,reason:'Workshop unavailable or paused'};
  works.verify(save.componentWorks);
  if(!['order','purchase','assemble','ship'].includes(kind)||typeof token!=='string'||!token||token.length>120)
   return {ok:false,reason:'Invalid component action'};
  const earlier=Object.prototype.hasOwnProperty.call(save.componentWorks.receipts,token)?save.componentWorks.receipts[token]:null;
  if(earlier)return {...earlier,repeated:true};
  const date=root.FE_WASHINGTON_TIME?.now?.(save);
  if(!date)return {ok:false,reason:'Game clock is unavailable'};
  const weekday=new Date(date.date+'T12:00:00Z').getUTCDay();
  if(weekday===0)return {ok:false,reason:'Workshop closed Sunday'};
  if(kind==='ship'&&weekday!==6)return {ok:false,reason:'Customer deliveries are on Saturday'};
  if(kind!=='ship'&&weekday===6)return {ok:false,reason:'Saturday is for deliveries, not production'};
  if(date.minuteOfDay<540||date.minuteOfDay>=1020)return {ok:false,reason:'Workshop operates 9 AM to 5 PM'};
  if(kind==='assemble'){
   const assistant=save.npcSimulation?.agents?.foremanSullivan;
   if(assistant?.locationId!=='factory'||assistant?.status!=='present')
    return {ok:false,reason:'Sullivan must be at the factory to produce components'};
  }
  if(!Number.isFinite(save.companyCash)||save.companyCash<0)return {ok:false,reason:'Invalid company cash'};
  const next=JSON.parse(JSON.stringify(save.componentWorks));
  next.date=date.date;next.cashCents=Math.round(save.companyCash*100);
  let receipt,minutes=periods[kind];
  if(kind==='order')receipt=works.order(next,details,token);
  else if(kind==='purchase')receipt=works.purchase(next,details?.materialId,details?.quantity,token);
  else if(kind==='ship')receipt=works.ship(next,details?.orderId,details?.quantity,token);
  else{
   const job=next.orders.find(o=>o.id===details?.orderId),recipe=job&&works.PRODUCTS[job.productId];
   if(!recipe)return {ok:false,reason:'Unknown workshop order'};
   const availableMinutes=Math.floor(((1020-date.minuteOfDay)*60-(save.worldCalendarRemainder||0))/60);
   const fit=Math.floor(availableMinutes/recipe.minutes);
   if(fit<1)return {ok:false,reason:'No time to finish one unit before 5 PM; continue next weekday'};
   const units=Math.min(details?.quantity,fit);
   const quote=works.assemblyQuote(next,details?.orderId,units);
   if(!quote.ok)return quote;
   minutes=quote.minutesRequired;
   receipt=works.assemble(next,details.orderId,units,token);
   if(receipt.ok)receipt.requestedUnits=details.quantity;
  }
  if(!receipt.ok)return receipt;
  const seconds=minutes*60,remaining=(1020-date.minuteOfDay)*60-(save.worldCalendarRemainder||0);
  if(!Number.isSafeInteger(seconds)||seconds<=0||seconds>remaining)
   return {ok:false,reason:'Not enough time before 5 PM closing'};
  const atBell=seconds===remaining;
  if(atBell&&typeof finishAtBell!=='function')
   return {ok:false,reason:'5 PM settlement requires a workshop closing callback'};
  if(typeof spend!=='function'||spend(seconds,true,atBell)!==seconds)
   return {ok:false,reason:'Player clock could not complete this action'};
  save.componentWorks=next;save.companyCash=next.cashCents/100;
  if(kind==='purchase'||kind==='assemble')save.lastExpenses=(save.lastExpenses||0)+
   (kind==='purchase'?receipt.costCents:receipt.laborCostCents)/100;
  if(kind==='ship')save.lastRevenue=(save.lastRevenue||0)+receipt.revenueCents/100;
  // Only now may the 5 PM closing bell settle assistant payroll and the
  // day's company ledger. The old callback-free path cannot reach 5 PM.
  if(atBell&&finishAtBell()!==true)throw Error('Workshop closing bell could not settle');
  return {...receipt,elapsedSeconds:seconds,remainingOnOrder:kind==='assemble'?next.orders.find(o=>o.id===details.orderId).quantity-next.orders.find(o=>o.id===details.orderId).made:undefined};
 }
 const api=Object.freeze({transact});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_COMPONENT_LIVE=api;
})(typeof window!=='undefined'?window:globalThis);
