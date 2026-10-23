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
  if(!working&&!preferred?.ok&&!context.priorityDestination&&context.slot===1&&choices.length&&hash(prefix+'|outing')%100<35)
   loc=choices[hash(prefix+'|outing-place')%choices.length];
  else if(!loc&&!working&&context.slot<3&&choices.length&&hash(prefix+'|errand')%100<28)
   loc=choices[hash(prefix+'|errand-place')%choices.length];
  if(!loc)return {locationId:null,roomId:null,activity:null,reason:'off-duty'};
  const allowed=access.rooms(city,actor,loc.id,context.date);
  if(!allowed.length)return {locationId:null,roomId:null,activity:null,reason:'access-denied'};
  let room=loc.defaultRoom;
  if(working){
   if(actor.id==='foremanSullivan'&&allowed.includes('production-floor'))room='production-floor';
   if(actor.job==='orderly'&&allowed.includes('orderly-station'))room='orderly-station';
  }
  if(!allowed.includes(room))room=allowed[hash(prefix+'|room')%allowed.length];
  return {locationId:loc.id,roomId:room,activity:loc.id===initial?
   (context.defaultActivity||'attending to personal business'):'visiting '+loc.name,
   reason:working?'work':preferred?.ok?'goal-directed':loc.id===initial?'routine':'errand'};
 }
 const api=Object.freeze({entry,destinations,visit});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_MOBILITY=api;
})(typeof window!=='undefined'?window:globalThis);
