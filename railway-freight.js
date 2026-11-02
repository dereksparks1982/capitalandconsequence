/* Paid Federal Electric goods carriage on owned, already constructed rail.
 * Origin cartage moves actual warehouse stock. A shipment is not a sale.
 * A destination depot requires its own arrival receipt after real travel.
 */
(function(root){
'use strict';
const works=()=>root.FE_COMPONENT_WORKS,company=()=>root.FE_RAIL_COMPANY;
const clone=o=>JSON.parse(JSON.stringify(o));
function manifests(save){return Array.isArray(save?.railwayCompany?.freight)?save.railwayCompany.freight.map(clone):[]}
function preflight(save,{action,lineId,productId,quantity,manifestId,date,postTime=false}={}){
 if(!['load','receive'].includes(action))return {ok:false,reason:'Unknown rail goods instruction.'};
 if(save?.characterRoute!=='industrialist'||save.paused||save.phase!=='day'||
  save.currentLocation?.locationId!=='factory'||root.FE_CORPORATE?.canManage?.(save)===false)
  return {ok:false,reason:'Only the controlling businessman can authorize goods transfer from Federal Electric.'};
 const when=root.FE_WASHINGTON_TIME?.now?.(save);
 if(!when||when.date!==date)return {ok:false,reason:'The current Washington business date is required.'};
 const firm=company()?.read?.(save);
 if(!firm?.charter)return {ok:false,reason:'A chartered, owned railway is required.'};
 const jobs=manifests(save);
 let seconds,costCents=0;
 if(action==='load'){
  const line=firm.lines.find(x=>x.id===lineId&&x.status==='open');
  if(!line||!firm.engines.length)return {ok:false,reason:'Use a built owned railway with a purchased locomotive.'};
  if(jobs.some(x=>x.lineId===lineId&&['origin-loaded','in-transit'].includes(x.status)))
   return {ok:false,reason:'The corridor already has a freight consignment awaiting delivery.'};
  if(!works()?.PRODUCTS?.[productId]||!Number.isSafeInteger(quantity)||quantity<1||quantity>25)
   return {ok:false,reason:'Choose 1–25 actual Federal Electric finished components.'};
  if(!save.componentWorks)return {ok:false,reason:'The physical factory warehouse is unavailable.'};
  works().verify(save.componentWorks);
  const stock=save.componentWorks.warehouse[productId];
  if(!Number.isSafeInteger(stock)||stock<quantity)
   return {ok:false,reason:'Insufficient finished stock actually in the factory warehouse.'};
  seconds=1800;costCents=1000+20*quantity;
 }else{
  const manifest=jobs.find(x=>x.id===manifestId);
  if(!manifest||manifest.status!=='in-transit'||!manifest.tripId)
   return {ok:false,reason:'No outstanding train shipment with an arrival record.'};
  const trip=firm.trips.find(x=>x.id===manifest.tripId);
  if(!trip||trip.lineId!==manifest.lineId||!Number.isSafeInteger(save.worldCalendar?.worldMinute)||
    save.worldCalendar.worldMinute<trip.departMinute+trip.durationMinutes)
   return {ok:false,reason:'The actual locomotive has not yet arrived at the destination depot.'};
  seconds=600;
 }
 if(action==='load'&&Math.round(Number(save.companyCash)*100)<costCents)
  return {ok:false,reason:'Company treasury cannot pay the cartage and loading cost.'};
 if(!postTime){
  const secondsLeft=root.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(save);
  if(!Number.isSafeInteger(secondsLeft)||secondsLeft<=seconds)
   return {ok:false,reason:'Insufficient business-day time for freight paperwork and cartage.'};
 }
 return {ok:true,action,seconds,costCents};
}
function transact(save,{action,lineId,productId,quantity,manifestId,date,token,spentSeconds}={}){
 if(typeof token!=='string'||!/^[a-z0-9][a-z0-9:._-]{0,95}$/i.test(token))
  return {ok:false,reason:'A unique freight receipt is required.'};
 const old=save?.railwayCompany?.freightReceipts?.[token];
 if(old)return {...clone(old),repeated:true};
 const allowed=preflight(save,{action,lineId,productId,quantity,manifestId,date,postTime:true});
 if(!allowed.ok)return allowed;
 if(spentSeconds!==allowed.seconds)return {ok:false,reason:'The full freight action time must be charged.'};
 // Validate first; afterward all cash and inventory changes are applied together.
 const rail=save.railwayCompany;
 if(!rail.freight)rail.freight=[];
 if(!rail.depots)rail.depots={};
 if(!rail.freightReceipts)rail.freightReceipts={};
 let description,manifest;
 if(action==='load'){
  const line=rail.lines.find(x=>x.id===lineId);
  const num=rail.freight.length+1; // historical ID stable as older manifests are never removed
  manifest={id:'FE-RAIL-CARGO-'+num,date,lineId,productId,quantity,
   origin:'Federal Electric factory warehouse',destinationStation:line.stations[1].id,
   destinationName:line.stations[1].name,status:'origin-loaded',tripId:null,
   shippingCostCents:allowed.costCents,
   loadedMinute:save.worldCalendar?.worldMinute,receivedMinute:null,receivedDate:null,
   source:'componentWorks.warehouse',buyer:null,paymentCents:0};
  save.componentWorks.warehouse[productId]-=quantity;
  save.companyCash=(Math.round(Number(save.companyCash)*100)-allowed.costCents)/100;
  save.componentWorks.cashCents=Math.round(save.companyCash*100);
  rail.freight.push(manifest);
  description='Carted '+quantity+' real '+works().PRODUCTS[productId].name+
   ' from the factory to the railroad departure platform; no customer sale.';
 }else{
  manifest=rail.freight.find(x=>x.id===manifestId);
  manifest.status='at-destination-depot';
  manifest.receivedMinute=save.worldCalendar.worldMinute;
  manifest.receivedDate=date;
  const station=rail.depots[manifest.destinationStation]||{};
  station[manifest.productId]=(station[manifest.productId]||0)+manifest.quantity;
  rail.depots[manifest.destinationStation]=station;
  description='Arrival receipt: '+manifest.quantity+' '+works().PRODUCTS[manifest.productId].name+
   ' in '+manifest.destinationName+' depot. Not sold, no customer payment.';
 }
 const receipt={ok:true,kind:'rail-freight-'+action,manifestId:manifest.id,token,date,
  elapsedSeconds:allowed.seconds,costCents:allowed.costCents,description};
 rail.freightReceipts[token]=receipt;
 if(!Array.isArray(rail.ledger))rail.ledger=[];
 rail.ledger.push({date,action:'freight-'+action,manifestId:manifest.id,token,costCents:allowed.costCents});
 if(rail.ledger.length>180)rail.ledger.splice(0,rail.ledger.length-180);
 if(Array.isArray(save.notes))save.notes.push({date,source:'Federal Electric railroad freight register',text:description});
 return {...clone(receipt),repeated:false};
}
const api=Object.freeze({manifests,preflight,transact});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_RAIL_FREIGHT=api;
})(typeof window!=='undefined'?window:globalThis);
