/* Federal Electric v0.6.19: travel route contracts without invented mileages.
   No route has a verified length yet. Go There costs one temporary game hour,
   without claiming historic distances or transporting owned vehicles. */
(function(){
'use strict';
const MODES=Object.freeze([
 Object.freeze({id:'walk',name:'Walking',requires:null}),
 Object.freeze({id:'horse',name:'On Horseback',requires:'horse'}),
 Object.freeze({id:'owned-carriage',name:'Owned Carriage',requires:'carriage-and-horse'}),
 Object.freeze({id:'hired-carriage',name:'Hired Carriage',requires:'hire-service'})
]);
const DEFAULT_TRAVEL_MINUTES=60;
const ROUTE_MINUTES=Object.freeze({}); // Override by sorted location IDs after map design.
function getLocation(id){return window.FederalElectricCity?.getLocation?.(id)||null}
function plan(from,to,mode='walk'){
 if(!getLocation(from)||!getLocation(to)||from===to)return {status:'invalid',minutes:null,miles:null,mode};
 const m=MODES.find(v=>v.id===mode);
 if(!m)return {status:'unknown-transport',minutes:null,miles:null,mode};
 if(m.requires==='hire-service')return {status:'hiring-not-implemented',minutes:null,miles:null,mode};
 if(m.requires==='horse'&&!window.FE_TRANSPORT?.at?.(from)?.some(v=>v.kind==='horse'))return {status:'no-horse-here',minutes:null,miles:null,mode};
 if(m.requires==='carriage-and-horse'){
  const items=window.FE_TRANSPORT?.at?.(from)||[];
  if(!items.some(x=>x.kind==='carriage')||!items.some(x=>x.kind==='horse'))return {status:'no-team-and-carriage-here',minutes:null,miles:null,mode};
 }
 // Physical route duration is still unknown; the generic hour is a game cost.
 return {status:'route-survey-pending',minutes:null,miles:null,mode};
}
function notice(from,to){
 const status=plan(from,to,'walk').status;
 if(status==='invalid')return 'Already here or no valid destination.';
 return 'Travel between different locations costs one in-game hour for now. Walking between rooms at the same location is free. Distances are not yet surveyed.';
}
// Called as part of the same autosave as an actual player location change.
// It does not imply measured mileage or a transport mode; only location changes
// incur a temporary hour. The factory and its executive office share an ID.
function recordProvisional(from,to){
 if(!getLocation(from)||!getLocation(to)||from===to)return false;
 if(!S.transport||!Array.isArray(S.transport.journeys))return false;
 const id=window.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 const gameMinutes=ROUTE_MINUTES[[from,to].sort().join('|')]||DEFAULT_TRAVEL_MINUTES;
 const bridge=window.FE_CALENDAR_BRIDGE;
 const departedAt=bridge?.moment?.(S)?.iso||null;
 const elapsed=bridge?.spend?.(S,gameMinutes*60)||0;
 const arrivedAt=bridge?.moment?.(S)?.iso||null;
 S.transport.journeys.push({id,from,to,turn:S.turnSerial,provisional:true,mode:null,miles:null,minutes:null,
  temporaryGameMinutes:gameMinutes,departedAt,arrivedAt,calendarApplied:elapsed===gameMinutes});
 if(S.transport.journeys.length>256)S.transport.journeys.splice(0,S.transport.journeys.length-256);
 return true;
}
window.FE_TRAVEL=Object.freeze({DEFAULT_TRAVEL_MINUTES,ROUTE_MINUTES,modes:MODES,plan,notice,recordProvisional});
})();
