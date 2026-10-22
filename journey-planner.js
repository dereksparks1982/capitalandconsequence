/* Federal Electric v0.6.19: travel route contracts without invented mileages.
   No route has a verified length yet. Existing Go There remains a labeled
   provisional direct movement, with no charged time or vehicle teleport. */
(function(){
'use strict';
const MODES=Object.freeze([
 Object.freeze({id:'walk',name:'Walking',requires:null}),
 Object.freeze({id:'horse',name:'On Horseback',requires:'horse'}),
 Object.freeze({id:'owned-carriage',name:'Owned Carriage',requires:'carriage-and-horse'}),
 Object.freeze({id:'hired-carriage',name:'Hired Carriage',requires:'hire-service'})
]);
const VERIFIED_ROUTES=Object.freeze({}); // Fill only with historically researched site-to-site measurements.
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
 const record=VERIFIED_ROUTES[[from,to].sort().join('|')];
 if(!record)return {status:'route-survey-pending',minutes:null,miles:null,mode};
 return {status:'route-survey-pending',minutes:null,miles:null,mode};
}
function notice(from,to){
 const status=plan(from,to,'walk').status;
 if(status==='invalid')return 'Already here or no valid destination.';
 return 'Street-route mileage and travel time are not yet verified. Go There currently moves directly without consuming journey time. Horses and carriages remain where left.';
}
// Called as part of the same autosave as an actual player location change.
// It does not imply a measured journey, transport mode, or charge.
function recordProvisional(from,to){
 if(!getLocation(from)||!getLocation(to)||from===to)return false;
 if(!S.transport||!Array.isArray(S.transport.journeys))return false;
 const id=window.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 S.transport.journeys.push({id,from,to,turn:S.turnSerial,provisional:true,mode:null,miles:null,minutes:null});
 if(S.transport.journeys.length>256)S.transport.journeys.splice(0,S.transport.journeys.length-256);
 return true;
}
window.FE_TRAVEL=Object.freeze({modes:MODES,plan,notice,recordProvisional});
})();
