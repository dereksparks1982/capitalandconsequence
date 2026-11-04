/* Read-only merchant voyage preflight and route quote.
 * Mutations and money always belong to FE_EMPIRE.dispatch, never this estimator.
 * No passenger fare or physical player travel has been invented here.
 */
(function(root){
 'use strict';
 const nav=typeof module==='object'&&module.exports?require('./merchant-navigation.js'):root.FE_MERCHANT_NAV;
 const empire=typeof module==='object'&&module.exports?require('./industrial-empire.js'):root.FE_EMPIRE;
 const validDate=d=>{if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;
  const n=Date.parse(d+'T00:00:00Z');return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===d};
 function addDays(date,days){
  if(!validDate(date)||!Number.isInteger(days)||days<1||days>1000)return null;
  const m=Date.parse(date+'T00:00:00Z')+days*86400000;
  return Number.isFinite(m)?new Date(m).toISOString().slice(0,10):null;
 }
 function cargoSnapshot(save,cargo){
  if(cargo==='freight')return {ok:true,description:'Merchant freight (no Federal Electric stock transferred)'};
  if(cargo!=='electric')return {ok:false,reason:'Cargo type is not recognized.'};
  if(save.characterRoute!=='industrialist')return {ok:false,reason:'Only Charles can authorize Federal Electric cargo.'};
  const warehouse=save.componentWorks?.warehouse;
  const batch=warehouse&&Object.entries(warehouse).find(([,n])=>Number.isSafeInteger(n)&&n>=5);
  if(batch)return {ok:true,description:batch[1]+' '+batch[0]+' finished components available (5 to be loaded)'};
  if(Number.isSafeInteger(save.inventoryByGrade?.standard)&&save.inventoryByGrade.standard>=100)
   return {ok:true,description:'100 standard legacy warehouse units available'};
  return {ok:false,reason:'Federal Electric must have at least five finished components or 100 standard legacy units.'};
 }
 function quote(save,shipId,dest,cargo='freight',insured=false){
  if(!save||!empire||!nav)return {ok:false,reason:'Merchant ledger is unavailable.'};
  const fleet=empire.ensure(save).fleet,ship=fleet.ships.find(x=>x.id===Number(shipId));
  if(!ship)return {ok:false,reason:'The selected ship does not exist.'};
  if(ship.status!=='in-port')return {ok:false,reason:'The selected ship is not berthed and ready for departure.'};
  if(save.paused||save.phase==='report')return {ok:false,reason:'Voyages cannot depart while paused or during the daily report.'};
  if(!fleet.ports.includes(dest))return {ok:false,reason:'This port must be commercially verified first.'};
  if(dest===ship.port)return {ok:false,reason:'The vessel is already in that port.'};
  const itinerary=nav.plan(ship.port,dest,ship.type);
  if(!itinerary)return {ok:false,reason:'There is no connected maritime route to this destination.'};
  const cargoLoad=cargoSnapshot(save,cargo);
  if(!cargoLoad.ok)return cargoLoad;
  const fee=110;
  const insurance=insured?Math.ceil(empire.PRICE[ship.type]*.0075):0;
  const due=fee+insurance;
  if(fleet.cash<due)return {ok:false,reason:'Fleet treasury needs $'+due.toFixed(2)+' before this voyage can begin.',due};
  const eta=addDays(save.gameDate,itinerary.days);
  if(!eta)return {ok:false,reason:'The saved game date cannot be used for a voyage quote.'};
  return Object.freeze({ok:true,shipId:ship.id,shipName:ship.name,type:ship.type,from:ship.port,
   to:dest,cargo,insured:!!insured,cargoDescription:cargoLoad.description,
   due,fee,insurance,fleetCash:fleet.cash,
   days:itinerary.days,eta,depart:save.gameDate,
   nauticalMiles:itinerary.nauticalMiles,legs:itinerary.legs.map(v=>({...v})),
   points:itinerary.points.map(v=>v.slice()),estimate:true});
 }
 const api=Object.freeze({addDays,cargoSnapshot,quote});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_MERCHANT_ROUTE_QUOTE=api;
})(typeof window!=='undefined'?window:globalThis);
