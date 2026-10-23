/* v0.6.72: connect 1878 Component Works to the player's one world clock.
 * Uses the existing transaction-safe component engine. No new inventory model.
 */
(function(root){
 'use strict';
 const works=typeof module==='object'&&module.exports?require('./component-works.js'):root.FE_COMPONENT_WORKS;
 if(!works)throw Error('Component Works must load first');
 const periods=Object.freeze({order:5,purchase:5,ship:15});
 function transact(save,kind,details,token,spend){
  if(!save?.componentWorks||save.paused)return {ok:false,reason:'Workshop unavailable or paused'};
  works.verify(save.componentWorks);
  if(!['order','purchase','assemble','ship'].includes(kind)||typeof token!=='string'||!token||token.length>120)
   return {ok:false,reason:'Invalid component action'};
  const earlier=Object.prototype.hasOwnProperty.call(save.componentWorks.receipts,token)?save.componentWorks.receipts[token]:null;
  if(earlier)return {...earlier,repeated:true};
  const date=root.FE_WASHINGTON_TIME?.now?.(save);
  if(!date)return {ok:false,reason:'Game clock is unavailable'};
  if(date.minuteOfDay<480||date.minuteOfDay>=1020)return {ok:false,reason:'Workshop operates 8 AM to 5 PM'};
  if(!Number.isFinite(save.companyCash)||save.companyCash<0)return {ok:false,reason:'Invalid company cash'};
  const next=JSON.parse(JSON.stringify(save.componentWorks));
  next.date=date.date;next.cashCents=Math.round(save.companyCash*100);
  let receipt,minutes=periods[kind];
  if(kind==='order')receipt=works.order(next,details,token);
  else if(kind==='purchase')receipt=works.purchase(next,details?.materialId,details?.quantity,token);
  else if(kind==='ship')receipt=works.ship(next,details?.orderId,details?.quantity,token);
  else{
   const quote=works.assemblyQuote(next,details?.orderId,details?.quantity);
   if(!quote.ok)return quote;
   minutes=quote.minutesRequired;
   receipt=works.assemble(next,details.orderId,details.quantity,token);
  }
  if(!receipt.ok)return receipt;
  const seconds=minutes*60,remaining=(1020-date.minuteOfDay)*60-(save.worldCalendarRemainder||0);
  if(!Number.isSafeInteger(seconds)||seconds<=0||seconds>=remaining)
   return {ok:false,reason:'Not enough time before 5 PM closing'};
  if(typeof spend!=='function'||spend(seconds,true)!==seconds)
   return {ok:false,reason:'Player clock could not complete this action'};
  save.componentWorks=next;save.companyCash=next.cashCents/100;
  if(kind==='purchase'||kind==='assemble')save.lastExpenses=(save.lastExpenses||0)+
   (kind==='purchase'?receipt.costCents:receipt.laborCostCents)/100;
  if(kind==='ship')save.lastRevenue=(save.lastRevenue||0)+receipt.revenueCents/100;
  return {...receipt,elapsedSeconds:seconds};
 }
 const api=Object.freeze({transact});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_COMPONENT_LIVE=api;
})(typeof window!=='undefined'?window:globalThis);
