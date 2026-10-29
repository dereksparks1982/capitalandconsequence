/* Capital & Consequence: authoritative player travel accounting.
   Pixel-based trip times remain provisional until the Washington guide is
   calibrated against verified streets/distances. Successful visits are
   recorded once; historic game minutes never change after a pin is moved. */
(function(){
'use strict';
const MODES=Object.freeze([
 Object.freeze({id:'walk',name:'Walking',requires:null}),
 Object.freeze({id:'horse',name:'On Horseback',requires:'horse'}),
 Object.freeze({id:'owned-carriage',name:'Owned Carriage',requires:'carriage-and-horse'}),
 Object.freeze({id:'hired-carriage',name:'Hired Carriage',requires:'hire-service'})
]);
const DEFAULT_TRAVEL_MINUTES=30;
const MODE_GAME_MINUTES=Object.freeze({walk:30,horse:20,carriage:24});
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
 // Physical route duration is still unknown; the provisional half hour is a game cost.
 return {status:'route-survey-pending',minutes:null,miles:null,mode};
}
function notice(from,to){
 const status=plan(from,to,'walk').status;
 if(status==='invalid')return 'Already here or no valid destination.';
 return 'Capital Travel estimates trip time from the current pin positions; times remain provisional until street routes are surveyed. Walking, horseback and carriage require their own travel conditions. Room changes cost 1 in-game minute.';
}
// Called as part of the same autosave as an actual player location change.
// Only journeys between two different sites incur city-travel time.
// The last optional argument is a SNAPSHOT of a provisional map itinerary,
// never a permanently cached distance for a pair of location identifiers.
function recordProvisional(from,to,journeyId=null,chosenMode=null,estimatedMinutes=null,routeDetails=null){
 if(!getLocation(from)||!getLocation(to)||from===to||S.paused)return false;
 if(!S.transport||!Array.isArray(S.transport.journeys))return false;
 const custody=S.horseCustody;
 const mode=chosenMode||((custody?.from===from&&custody?.mode)||'walk');
 if(!Object.hasOwn(MODE_GAME_MINUTES,mode))return false;
 // A faster itinerary requires the same physically prepared animal/vehicle
 // later transferred by horse-custody.js after the paid player arrival.
 if(mode!=='walk'&&(!custody||custody.from!==from||custody.mode!==mode||
   !S.transport.assets?.some(a=>a.id===custody.assetId&&a.locationId===from&&a.kind==='horse')||
   (mode==='carriage'&&!S.transport.assets?.some(a=>a.id===custody.vehicleId&&a.locationId===from&&a.kind==='carriage'))))
  return false;
 const id=journeyId===null?(window.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)):journeyId;
 if(typeof id!=='string'||!id||id.length>128||S.transport.journeys.some(v=>v.id===id))return false;
 const gameMinutes=Number.isSafeInteger(estimatedMinutes)&&estimatedMinutes>=4&&estimatedMinutes<=120?
  estimatedMinutes:ROUTE_MINUTES[[from,to].sort().join('|')]||MODE_GAME_MINUTES[mode];
 const guidePixels=routeDetails&&Number.isSafeInteger(routeDetails.guidePixels)&&
  routeDetails.guidePixels>=0&&routeDetails.guidePixels<=8192?routeDetails.guidePixels:null;
 const allowedRoutes=['provisional-right-angle','provisional-street-network','provisional-street-access'];
 const routeType=guidePixels!==null&&allowedRoutes.includes(routeDetails.routeType)?
  routeDetails.routeType:null;
 const accessPixels=guidePixels!==null&&Number.isSafeInteger(routeDetails?.accessPixels)&&
  routeDetails.accessPixels>=0&&routeDetails.accessPixels<=8192?
  routeDetails.accessPixels:null;
 const turns=guidePixels!==null&&Number.isSafeInteger(routeDetails?.turns)&&
  routeDetails.turns>=0&&routeDetails.turns<=128?routeDetails.turns:null;
 const allowedNamedRoads=['Pennsylvania Avenue corridor','Massachusetts Avenue corridor',
  'New York Avenue corridor'];
 const namedRoads=guidePixels!==null&&Array.isArray(routeDetails?.namedRoads)?
  [...new Set(routeDetails.namedRoads.filter(v=>allowedNamedRoads.includes(v)))].slice(0,3):[];
 const bridge=window.FE_CALENDAR_BRIDGE;
 const departedAt=bridge?.moment?.(S)?.iso||null;
 const applied=window.advanceWorldTime?.(gameMinutes*60,true)||0;
 if(applied!==gameMinutes*60)return false;
 const arrivedAt=bridge?.moment?.(S)?.iso||null;
 S.transport.journeys.push({id,from,to,turn:S.turnSerial,provisional:true,mode,miles:null,minutes:null,
  guidePixels,routeType,accessPixels,turns,namedRoads,temporaryGameMinutes:gameMinutes,
  departedAt,arrivedAt,
  calendarApplied:applied===gameMinutes*60});
 if(S.transport.journeys.length>256)S.transport.journeys.splice(0,S.transport.journeys.length-256);
 return true;
}
// Only moves between distinct rooms of the SAME location cost one minute.
// A map preview, a resume, and re-entering the same room are not room moves.
function recordRoomMove(locationId,fromRoom,toRoom,journeyId=null){
 if(!getLocation(locationId)||!fromRoom||!toRoom||fromRoom===toRoom||S.paused)return false;
 if(!window.FederalElectricCity?.getRoom?.(locationId,fromRoom)||
    !window.FederalElectricCity?.getRoom?.(locationId,toRoom))return false;
 if(!S.transport||!Array.isArray(S.transport.journeys))return false;
 const id=journeyId===null?(window.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)):journeyId;
 if(typeof id!=='string'||!id||id.length>128||S.transport.journeys.some(v=>v.id===id))return false;
 const departedAt=window.FE_CALENDAR_BRIDGE?.moment?.(S)?.iso||null;
 const applied=window.advanceWorldTime?.(60,true)||0;
 if(applied!==60)return false;
 const arrivedAt=window.FE_CALENDAR_BRIDGE?.moment?.(S)?.iso||null;
 S.transport.journeys.push({id,from:locationId,to:locationId,fromRoom,toRoom,
  turn:S.turnSerial,kind:'room-move',provisional:true,mode:null,miles:null,
  minutes:null,temporaryGameMinutes:1,departedAt,arrivedAt,calendarApplied:true});
 if(S.transport.journeys.length>256)S.transport.journeys.splice(0,S.transport.journeys.length-256);
 return true;
}
window.FE_TRAVEL=Object.freeze({DEFAULT_TRAVEL_MINUTES,MODE_GAME_MINUTES,ROUTE_MINUTES,modes:MODES,plan,notice,recordProvisional,recordRoomMove});
})();
