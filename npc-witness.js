/* Capital & Consequence v0.6.64: first-hand city encounter witnessing.
 * Only a player actually in the same room in the same reached clock period
 * can keep a witnessed account. The observation is not the hidden dialogue,
 * crime truth or omniscient agenda of the residents involved.
 */
(function(root){
 'use strict';
 function record(save,encounters,position,definitions){
  if(!save||!Array.isArray(encounters)||!encounters.length||
   !position?.locationId||!position.roomId||!Array.isArray(definitions)||
   !Array.isArray(save.notes))return [];
  if(!Array.isArray(save.witnessedSocial))save.witnessedSocial=[];
  const names=Object.fromEntries(definitions.map(d=>[d.id,d.name]));
  const observed=[];
  for(const e of encounters){
   if(!e||e.type!=='private-encounter'||e.locationId!==position.locationId||
    e.roomId!==position.roomId||typeof e.id!=='string'||
    !names[e.actorId]||!names[e.partnerId]||
    save.witnessedSocial.some(w=>w.id===e.id))continue;
   const kind=e.kind==='disagreement'?'disagreeing':e.kind==='assistance'?'helping one another':'conversing';
   const text='Observed '+names[e.actorId]+' and '+names[e.partnerId]+' '+kind+
    ' at '+position.locationId+'. Their private words and motives were not established.';
   const item={id:e.id,date:e.date,locationId:e.locationId,roomId:e.roomId,
    actorId:e.actorId,partnerId:e.partnerId,kind:e.kind,text};
   save.witnessedSocial.push(item);observed.push({...item});
   save.notes.push({date:e.date,source:'first-hand city observation',text});
  }
  if(save.witnessedSocial.length>128)save.witnessedSocial.splice(0,save.witnessedSocial.length-128);
  if(save.notes.length>320)save.notes.splice(0,save.notes.length-320);
  return observed;
 }
 const api=Object.freeze({record});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_WITNESS=api;
})(typeof window!=='undefined'?window:globalThis);
