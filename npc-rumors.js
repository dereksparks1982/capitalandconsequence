/* Capital & Consequence v0.6.65: local rumor consent and confidence.
 * This does not decide the truth of a fact. It only governs whether an actor
 * is willing and able to tell an acquaintance something they actually know.
 * All rumor outcomes remain private and source-attributed to those present.
 */
(function(root){
 'use strict';
 const bounded=(v,min,max)=>Math.max(min,Math.min(max,Number.isFinite(v)?v:min));
 function coPresent(from,to){
  return !!from&&!!to&&from.status==='present'&&to.status==='present'&&
   typeof from.locationId==='string'&&!!from.locationId&&
   from.locationId===to.locationId&&typeof from.roomId==='string'&&
   !!from.roomId&&from.roomId===to.roomId;
 }
 function shareable(fact){
  return !!fact&&typeof fact.factId==='string'&&
   !/^(?:private|confidential|sealed):/.test(fact.factId)&&
   fact.confidence>=.4&&fact.confidence<=1&&
   !['sealed-file','private-record','unpublished-case'].includes(fact.source);
 }
 function chance(speaker,listener,from,to,fact){
  if(!coPresent(from,to)||!shareable(fact))return 0;
  const sociability=(bounded(Number(speaker?.traits?.sociability),0,100)+
   bounded(Number(listener?.traits?.sociability),0,100))/4;
  const outgoing=bounded(Number(from.relationships?.[listener.id]||0),-100,100);
  const incoming=bounded(Number(to.relationships?.[speaker.id]||0),-100,100);
  const familiarity=(outgoing+incoming)/2;
  // Hostile acquaintances rarely confide; successful interactions improve
  // willingness modestly without guaranteeing trust or belief.
  const confidence=Math.min(1,Number(fact.confidence));
  return Math.round(bounded(sociability+familiarity*.38+(confidence-.65)*20,0,75));
 }
 const api=Object.freeze({coPresent,shareable,chance});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_RUMORS=api;
})(typeof window!=='undefined'?window:globalThis);
