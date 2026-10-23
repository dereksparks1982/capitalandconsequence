/* Federal Electric NPC knowledge: hearsay and private observations are not world truth.
 * Source-only groundwork, v0.6.41. Per-profile NPC state; no global publication.
 */
(function(root){
 'use strict';
 const MAX_RECORDS=512;
 const validKey=k=>typeof k==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9:_./-]{0,119}$/.test(k);
 function ensure(sim){
  if(!sim||typeof sim!=='object')throw new Error('NPC simulation state required');
  if(!sim.knowledge||sim.knowledge.version!==1||!Array.isArray(sim.knowledge.records))
   sim.knowledge={version:1,records:[]};
  return sim.knowledge;
 }
 function learn(sim,actorId,factId,assertion,source,date,confidence=1){
  if(!validKey(actorId)||!validKey(factId)||typeof assertion!=='boolean'||
     !validKey(source)||typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||
     !Number.isFinite(confidence)||confidence<0||confidence>1)
   throw new Error('Invalid sourced NPC observation');
  const knowledge=ensure(sim);
  // Idempotent within one day, but a second source or a changed claim may
  // legitimately compete with the first one. Rumors are not adjudicated here.
  if(knowledge.records.some(r=>r.actorId===actorId&&r.factId===factId&&r.assertion===assertion&&r.source===source&&r.date===date))
   return false;
  knowledge.records.push({actorId,factId,assertion,source,date,confidence});
  if(knowledge.records.length>MAX_RECORDS)knowledge.records.splice(0,knowledge.records.length-MAX_RECORDS);
  return true;
 }
 function belief(sim,actorId,factId){
  if(!validKey(actorId)||!validKey(factId))return null;
  const records=ensure(sim).records.filter(r=>r.actorId===actorId&&r.factId===factId);
  if(!records.length)return null;
  // Highest-trust observation wins. A later equally trusted observation can
  // change a mind; the engine never reads an authoritative global true/false.
  let best=records[0];
  for(const r of records.slice(1))if(r.confidence>=best.confidence)best=r;
  return {...best};
 }
 function share(sim,fromActor,toActor,factId,date){
  if(!validKey(fromActor)||!validKey(toActor)||fromActor===toActor||!validKey(factId))return false;
  const observed=belief(sim,fromActor,factId);
  if(!observed)return false;
  return learn(sim,toActor,factId,observed.assertion,'heard-from:'+fromActor,date,Math.round(observed.confidence*60)/100);
 }
 function knownFacts(sim,actorId){
  if(!validKey(actorId))return [];
  return ensure(sim).records.filter(r=>r.actorId===actorId).map(r=>({...r}));
 }
 const api=Object.freeze({ensure,learn,belief,share,knownFacts});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_KNOWLEDGE=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
