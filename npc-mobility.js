/* Capital & Consequence: reproducible room-level NPC excursions. */
(function(root){
 'use strict';
 const hash=value=>{let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
 const access=typeof module==='object'&&module.exports?require('./city-access.js'):root.FE_CITY_ACCESS;
 function entry(city,actor,id,roomId,date){return access.canRoom(city,actor,id,roomId,date)}
 function destinations(city,actor,date){
  return city.listLocations().filter(loc=>entry(city,actor,loc.id,loc.defaultRoom,date).ok);
 }
 function visit(city,actor,context){
  if(!city||!actor?.id||!context||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(context.date||'')||
    !Number.isInteger(context.slot)||context.slot<0||context.slot>3)throw Error('Saved NPC visit context required');
  const prefix=String(context.seed||'')+'|'+String(context.key||'')+'|'+actor.id;
  const initial=context.defaultLocation||null;
  const primary=initial&&entry(city,actor,initial,null,context.date).ok?city.getLocation(initial):null;
  const choices=destinations(city,actor,context.date);
  const working=!!actor.onDuty&&actor.workplaceId===initial;
  let loc=primary;
  // A valid personal intention may redirect an actual journey. Check the same
  // gate as any other visitor; private homes and staff rooms stay restricted.
  const preferred=!working&&!context.priorityDestination&&context.preferredDestination?
   entry(city,actor,context.preferredDestination,null,context.date):null;
  if(preferred?.ok)loc=city.getLocation(context.preferredDestination);
  // Existing job obligations take precedence. Gambling losses cannot be
  // reassigned to a random room after the bet was actually settled.
  // Ordinary daytime work and market duty are not random broker visits.
  // Off-duty leisure has personality-dependent odds and real room access.
  const sociability=Number.isFinite(Number(context.sociability))&&context.sociability!==null&&context.sociability!==''?
   Math.max(0,Math.min(100,Number(context.sociability))):50;
  const chance=Math.round(6+sociability*.16);
  const leisure=choices.filter(x=>['social','theatre','sport','culture','park'].includes(x.category));
  const offDuty=context.slot>=2&&!working&&!context.priorityDestination;
  if(offDuty&&!preferred?.ok&&leisure.length&&hash(prefix+'|outing')%100<chance)
   loc=leisure[hash(prefix+'|outing-place')%leisure.length];
  else if(!loc&&offDuty&&leisure.length&&hash(prefix+'|errand')%100<12)
   loc=leisure[hash(prefix+'|errand-place')%leisure.length];
  if(!loc)return {locationId:null,roomId:null,activity:null,reason:'off-duty'};
  const allowed=access.rooms(city,actor,loc.id,context.date);
  if(!allowed.length)return {locationId:null,roomId:null,activity:null,reason:'access-denied'};
  let room=loc.defaultRoom;
  if(working){
   if(actor.id==='foremanSullivan'&&allowed.includes('production-floor'))room='production-floor';
   if(actor.id==='charlieWhitcomb'&&context.slot===1&&allowed.includes('executive-office'))room='executive-office';
   if(actor.id==='eliCrowe'&&allowed.includes('doorman-post'))room='doorman-post';
   if(loc.id==='nationalTheatre'){
    if(actor.id==='williamRapley'&&allowed.includes('manager-office'))room='manager-office';
    else if(actor.id==='charlesHanford'&&allowed.includes('backstage'))room='backstage';
    else if(context.slot===2&&allowed.includes('auditorium'))room='auditorium';
    else if(context.slot<2&&allowed.includes('backstage')&&
     hash(prefix+'|rehearsal-room')%100<50)room='backstage';
    else if(allowed.includes('auditorium'))room='auditorium';
   }
   if(actor.job==='orderly'&&allowed.includes('orderly-station'))room='orderly-station';
  }
  if(actor.id==='samHarlan'&&loc.id==='metropolitanPolice'&&allowed.includes('station-duty-room'))
   room='station-duty-room';
  if(!allowed.includes(room))room=allowed[hash(prefix+'|room')%allowed.length];
  return {locationId:loc.id,roomId:room,activity:preferred?.ok&&context.shoppingTrip===true&&loc.id==='oldChinatown'?
   'shopping for groceries':loc.id===initial?
   (context.defaultActivity||'attending to personal business'):'visiting '+loc.name,
   reason:working?'work':preferred?.ok?'goal-directed':loc.id===initial?'routine':'errand'};
 }
 const api=Object.freeze({entry,destinations,visit});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_MOBILITY=api;
})(typeof window!=='undefined'?window:globalThis);
