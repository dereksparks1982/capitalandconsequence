/* Capital & Consequence: consequences of actual private resident encounters.
 * Only a meeting already settled by npc-social.js may affect individual mood
 * or add first-hand memory. No independent clock, public rumor, invented trade,
 * second relationship reward, or access grant is created here.
 */
(function(root){
 'use strict';
 const SOCIAL_KINDS=Object.freeze({
  conversation:Object.freeze({mood:2,memory:'conversation',text:'I had a conversation with another resident.'}),
  assistance:Object.freeze({mood:5,memory:'kindness',text:'Another resident and I shared an act of assistance.'}),
  disagreement:Object.freeze({mood:-6,memory:'conflict',text:'I disagreed with another resident.'})
 });
 const LIMIT=160;
 const memory=typeof module==='object'&&module.exports?require('./npc-memory.js'):root.FE_NPC_MEMORY;
 const clamp=(number)=>Math.max(0,Math.min(100,Number.isFinite(number)?number:65));
 function ensure(world){
  if(!world||typeof world!=='object'||!world.agents||typeof world.agents!=='object')
   throw Error('Persistent private NPC world required');
  if(!world.socialConsequences||world.socialConsequences.version!==1||
      !Array.isArray(world.socialConsequences.seenIds))
   world.socialConsequences={version:1,seenIds:[]};
  return world.socialConsequences;
 }
 function apply(save,world,record){
  if(!save||save.npcSimulation!==world||!record||
   typeof record.id!=='string'||!record.id||
   !SOCIAL_KINDS[record.kind]||record.type!=='private-encounter'||
   !/^\d{4}-\d{2}-\d{2}$/.test(record.date||''))return false;
  // The social engine is the authority for real encounters. An arbitrary
  // object calling itself a meeting must never gain mood or memory rewards.
  const authentic=world?.social?.history?.some(entry=>entry.id===record.id&&
   entry.actorId===record.actorId&&entry.partnerId===record.partnerId&&
   entry.kind===record.kind&&entry.locationId===record.locationId&&
   entry.roomId===record.roomId&&entry.date===record.date);
  if(!authentic)return false;
  const left=world.agents?.[record.actorId],right=world.agents?.[record.partnerId];
  if(!left||!right||left===right||record.actorId===record.partnerId||
   !record.locationId||!record.roomId||
   ![left,right].every(actor=>actor.status==='present'&&
     actor.locationId===record.locationId&&actor.roomId===record.roomId))
   return false;
  const state=ensure(world);
  if(state.seenIds.includes(record.id))return false;
  // Apply a small change in each actual participant's mood. The relationship
  // delta has ALREADY been recorded once by npc-social; do not double it.
  const consequence=SOCIAL_KINDS[record.kind];
  for(const [actor,otherId] of [[left,record.partnerId],[right,record.actorId]]){
   if(actor.needs?.version===1)
    actor.needs.mood=Math.round(clamp(actor.needs.mood+consequence.mood)*100)/100;
   if(!Array.isArray(actor.socialExperience))actor.socialExperience=[];
   if(!actor.socialExperience.some(item=>item.meetingId===record.id)){
    actor.socialExperience.push({meetingId:record.id,date:record.date,
     otherId,kind:record.kind,locationId:record.locationId});
    if(actor.socialExperience.length>24)actor.socialExperience.splice(0,actor.socialExperience.length-24);
   }
   memory?.remember?.(save,actor.id,{
    date:record.date,key:'social|'+record.id+'|'+actor.id,
    kind:consequence.memory,withId:otherId,place:record.locationId,
    source:'firsthand-same-room',verified:true,
    text:consequence.text
   });
  }
  state.seenIds.push(record.id);
  if(state.seenIds.length>LIMIT)state.seenIds.splice(0,state.seenIds.length-LIMIT);
  return true;
 }
 const api=Object.freeze({ensure,apply});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_SOCIAL_CONSEQUENCES=api;
})(typeof window!=='undefined'?window:globalThis);
