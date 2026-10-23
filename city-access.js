/* Capital & Consequence: city and room authorization shared across lives.
 * No role inherits every locked door. Save-friendly ids, no side effects. */
(function(root){
 'use strict';
 function has(list,value){return Array.isArray(list)&&list.includes(value)}
 function canLocation(city,actor,id,date){
  const loc=city?.getLocation?.(id);
  if(!loc)return {ok:false,reason:'unknown location'};
  if(loc.plannedOnly)return {ok:false,reason:'location is not yet open'};
  if(loc.availableFrom&&date<loc.availableFrom)return {ok:false,reason:'location opens in '+loc.availableFrom};
  if(actor?.kind==='npc'&&id==='home'&&!has(actor.invitations,id)&&!has(actor.residences,id))
   return {ok:false,reason:'private residence'};
  if(loc.hiddenFromDirectory&&!has(actor?.invitations,id)&&!has(actor?.permits,id))
   return {ok:false,reason:'invitation required'};
  return {ok:true};
 }
 function canRoom(city,actor,id,roomId,date){
  const entry=canLocation(city,actor,id,date);
  if(!entry.ok)return entry;
  const loc=city.getLocation(id),room=city.getRoom(id,roomId||loc.defaultRoom);
  if(!room)return {ok:false,reason:'unknown room'};
  if(!room.restricted)return {ok:true,locationId:id,roomId:room.id};
  const grant=id+':'+room.id;
  if(has(actor?.roomPermits,grant))return {ok:true,locationId:id,roomId:room.id};
  const role=actor?.route,person=actor?.id;
  if(id==='factory'){
   if(room.id==='executive-office'&&role==='industrialist')return {ok:true,locationId:id,roomId:room.id};
   if(room.id==='production-floor'&&(role==='industrialist'||(person==='foremanSullivan'&&actor.onDuty)))
    return {ok:true,locationId:id,roomId:room.id};
  }
  if(id==='secondNightclub'){
   if(room.id==='doorman-post'&&role==='criminal')return {ok:true,locationId:id,roomId:room.id};
  }
  if(id==='metropolitanPolice'){
   if(room.id==='station-duty-room'&&(role==='investigator'||(person==='inspectorHayes'&&actor.onDuty)))
    return {ok:true,locationId:id,roomId:room.id};
  }
  if(id==='blackwoodAsylum'){
   if((room.id==='orderly-station'||room.id==='patient-ward')&&(role==='wardman'||(actor?.job==='orderly'&&actor.onDuty)))
    return {ok:true,locationId:id,roomId:room.id};
  }
  return {ok:false,reason:'room authorization required'};
 }
 function rooms(city,actor,id,date){
  const loc=city?.getLocation?.(id);
  return loc?loc.rooms.filter(r=>canRoom(city,actor,id,r.id,date).ok).map(r=>r.id):[];
 }
 const api=Object.freeze({canLocation,canRoom,rooms});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_CITY_ACCESS=api;
})(typeof window!=='undefined'?window:globalThis);
