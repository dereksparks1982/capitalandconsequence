/* Capital & Consequence: physical horse and carriage custody, October 2026.
 * Private home stable is the normal base. Factory stable is daytime shelter.
 * Only an explicitly prepared animal/vehicle moves with an actual recorded
 * player journey. Walking alone never teleports owned assets.
 */
(function(root){
 'use strict';
 const PUBLIC_LIVERIES=Object.freeze(['westLivery','eastLivery']);
 const PRIVATE_STABLES=Object.freeze(['home','factory']);
 const goodStatus=status=>status==='stabled'||status==='tethered';
 function stableAt(id){return PUBLIC_LIVERIES.includes(id)||PRIVATE_STABLES.includes(id)}
 function present(save,id,from,kind){
  return save?.transport?.assets?.find(a=>a.id===id&&a.locationId===from&&a.kind===kind&&
   (a.owner==='personal'||a.owner==='rental')&&goodStatus(a.status))||null;
 }
 function prepare(save,id,from,vehicleId=null){
  if(!save||save.paused||!id||typeof from!=='string'||save.currentLocation?.locationId!==from)
   return {ok:false,reason:'You must be beside the animal to take it on a journey'};
  const horse=present(save,id,from,'horse');
  if(!horse)return {ok:false,reason:'This horse is not in your custody at this location'};
  if(vehicleId!==null){
   if(!present(save,vehicleId,from,'carriage'))
    return {ok:false,reason:'A horse and the selected carriage or wagon must be together'};
  }
  const earlier=save.horseCustody;
  if(earlier?.assetId===id&&earlier.from===from&&earlier.vehicleId===(vehicleId||null))
   return {ok:true,repeated:true,assetId:id,vehicleId};
  save.horseCustody={assetId:id,vehicleId:vehicleId||null,from,mode:vehicleId?'carriage':'horse'};
  return {ok:true,repeated:false,assetId:id,vehicleId,mode:vehicleId?'carriage':'horse'};
 }
 function onArrival(save,from,to,recorded){
  const intent=save?.horseCustody;
  if(!intent||intent.from!==from||from===to||typeof to!=='string'||!recorded)
   return {ok:false,reason:'No prepared animal on a completed journey'};
  const journeys=save.transport?.journeys||[];
  const journey=journeys[journeys.length-1];
  if(!journey||journey.from!==from||journey.to!==to||journey.calendarApplied!==true)
   return {ok:false,reason:'A real player journey must be recorded first'};
  const horse=present(save,intent.assetId,from,'horse');
  const vehicle=intent.vehicleId?present(save,intent.vehicleId,from,'carriage'):null;
  if(!horse||(intent.vehicleId&&!vehicle))
   return {ok:false,reason:'The horse or carriage was not present for the journey'};
  const moved=[horse,...(vehicle?[vehicle]:[])];
  for(const asset of moved)
   if(save.transport.events?.some(e=>e.id==='carry:'+journey.id+':'+asset.id))
    return {ok:false,reason:'Animal or carriage already transferred on this journey'};
  const isStable=stableAt(to);
  for(const asset of moved){
   asset.locationId=to;
   asset.status=isStable?'stabled':'tethered';
   save.transport.events.push({id:'carry:'+journey.id+':'+asset.id,assetId:asset.id,type:'relocation',
    from,to,journeyId:journey.id,date:save.gameDate,mode:intent.mode});
  }
  delete save.horseCustody;
  return {ok:true,from,to,assetIds:moved.map(a=>a.id),journeyId:journey.id,mode:intent.mode};
 }
 const api=Object.freeze({PUBLIC_LIVERIES,PRIVATE_STABLES,stableAt,prepare,onArrival});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_HORSE_CUSTODY=api;
})(typeof window!=='undefined'?window:globalThis);
