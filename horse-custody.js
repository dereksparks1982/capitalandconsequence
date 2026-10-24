/* Capital & Consequence: take one purchased horse home only after an actual
 * recorded player journey. No free relocation or new clock source.
 */
(function(root){
 'use strict';
 const STABLES=['westLivery','eastLivery'];
 function prepare(save,id,from){
  if(!save||save.paused||!STABLES.includes(from)||
   save.currentLocation?.locationId!==from||!id)return {ok:false,reason:'Prepare a horse at its actual livery'};
  const asset=save.transport?.assets?.find(x=>x.id===id);
  if(!asset||asset.kind!=='horse'||asset.owner!=='personal'||asset.locationId!==from||
   !['stabled','tethered'].includes(asset.status))
   return {ok:false,reason:'An owned horse must be present at this stable'};
  if(save.horseCustody?.assetId===id&&save.horseCustody.from===from)
   return {ok:true,repeated:true,assetId:id};
  save.horseCustody={assetId:id,from,to:'factory'};
  return {ok:true,repeated:false,assetId:id};
 }
 function onArrival(save,from,to,recorded){
  const intent=save?.horseCustody;
  if(!intent||intent.from!==from||intent.to!==to||!recorded)return {ok:false,reason:'No completed horse journey'};
  const journey=save.transport?.journeys?.at(-1);
  if(!journey||journey.from!==from||journey.to!==to||!journey.calendarApplied)
   return {ok:false,reason:'No paid player journey recorded'};
  const asset=save.transport.assets?.find(x=>x.id===intent.assetId);
  if(!asset||asset.kind!=='horse'||asset.owner!=='personal'||asset.locationId!==from||
   !['stabled','tethered'].includes(asset.status))
   return {ok:false,reason:'Horse no longer available at the departure stable'};
  const eventId='horse-home:'+journey.id+':'+asset.id;
  if(save.transport.events.some(e=>e.id===eventId))
   return {ok:false,reason:'Travel transfer was already committed'};
  asset.locationId='factory';asset.status='stabled';
  save.transport.events.push({id:eventId,assetId:asset.id,type:'relocation',
   from,to,date:save.gameDate,journeyId:journey.id});
  delete save.horseCustody;
  return {ok:true,assetId:asset.id,from,to,journeyId:journey.id};
 }
 const api=Object.freeze({prepare,onArrival});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_HORSE_CUSTODY=api;
})(typeof window!=='undefined'?window:globalThis);
