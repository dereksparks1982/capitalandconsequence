/* Federal Electric v0.6.52: deterministic per-person utility planning.
 * Autonomous NPC decisions use observable circumstances and each actor's
 * individual knowledge. This is game AI, not a generative language model.
 * Keep intentions private; public contact lists may only show routine locations.
 */
(function(root){
 'use strict';
 const PROFILES=Object.freeze({
  'madamStar':{
   'maintain-the-club':[45,0,0,0,0],
   'cultivate-trusted-contacts':[31,0,.60,0,.30],
   'protect-staff':[28,0,0,1.20,0]},
  'foremanSullivan':{
   'maintain-machinery':[43,.17,0,.35,0],
   'meet-contract-deadlines':[35,1.10,0,0,0],
   'protect-workforce':[34,.1,0,.90,.15]},
  'eddieDoyle':{
   'expand-connections':[37,0,.75,0,.25],
   'protect-reputation':[35,0,0,.72,.30],
   'balance-finances':[35,.55,0,.15,0]},
  'inspectorHayes':{
   'review-open-cases':[34,0,0,.96,.45],
   'maintain-public-order':[34,0,.15,1.02,0],
   'build-professional-standing':[37,.15,.25,0,0]},
  'chenMei':{
   'maintain-business':[43,.62,0,0,0],
   'help-neighbors':[36,0,.50,.35,.35],
   'develop-contacts':[33,0,.74,0,.20]},
  'liWen':{
   'find-new-buyers':[39,.30,.88,0,0],
   'protect-local-trust':[37,0,.20,.54,.35],
   'maintain-business':[41,.60,0,.10,0]},
  'pavelOrlov':{
   'develop-trade':[42,.76,.15,0,0],
   'expand-connections':[36,.12,.84,0,.20],
   'protect-reputation':[35,0,.12,.85,0]}
 });
 const bounded=v=>Math.max(0,Math.min(100,Number.isFinite(v)?v:0));
 // Only witnessed operational conditions, public current headlines, and the
 // actor's OWN beliefs may shape choices. Never inspect global hidden odds,
 // unpublished investigations or another NPC's confidential facts.
 function observe(def,agent,save,simulation){
  if(!def||!agent||!save||!simulation)throw Error('NPC world context required');
  const known=Array.isArray(simulation.knowledge?.records)?
    simulation.knowledge.records.filter(f=>f.actorId===def.id&&f.confidence>=.40):[];
  const firstHand=known.filter(f=>f.confidence>=.95).length;
  const hearsay=known.filter(f=>String(f.source).startsWith('heard-from:')).length;
  const conversations=Array.isArray(agent.memories)?
    agent.memories.filter(m=>m.key==='greet'||m.key==='city').length:0;
  let workPressure=25,risk=10,social=bounded(22+conversations*6),rumors=bounded(hearsay*12);
  if(def.id==='foremanSullivan'){
   workPressure=save.lineStatus==='awaiting'?93:save.lineStatus==='running'?75:36;
   risk=bounded(15+(save.workforce?.absent||0)*13+(save.turnConditions?.powerOutageSeconds>0?30:0));
  }else if(def.id==='madamStar'){
   risk=save.starRaidOccurred?82:10;
   social=bounded(42+conversations*6);
  }else if(def.id==='inspectorHayes'){
   // Newspaper headline is public. Unpublished case details are not.
   risk=/\bRAID\b|\bPOLICE\b/.test(String(save.headline||''))?82:18;
  }else if(def.id==='eddieDoyle')social=bounded(46+conversations*7);
  else if(def.id==='chenMei'||def.id==='liWen'||def.id==='pavelOrlov'){
   workPressure=bounded(36+hearsay*4);
  }
  const finance=agent.economy?Math.round((agent.economy.balanceCents<600?(600-agent.economy.balanceCents)/8:0)+(agent.economy.debtCents||0)/30):0;
  return Object.freeze({financialStrain:bounded(finance),workPressure:bounded(workPressure),risk:bounded(risk),
   social:bounded(social),rumors,firstHand:bounded(firstHand*10),
   fatigue:bounded(100-(Number.isFinite(+agent.energy)?+agent.energy:80))});
 }
 function choose(def,agent,situation,period='early-business'){
  if(!def||!Array.isArray(def.goals)||!def.goals.length||!agent||
     !situation||typeof situation!=='object')throw Error('NPC planning input required');
  const profiles=PROFILES[def.id]||{};
  const energy=bounded(+agent.energy||0),night=period==='early-night'||period==='late-night';
  if(energy<=32&&night)return Object.freeze({goal:'rest-and-recover',rest:true,score:100,reason:'fatigue'});
  let best=null;
  const scores=[];
  for(const goal of def.goals){
   const p=profiles[goal]||[35,.25,.25,.25,.25];
   const ambition=bounded(+def.traits?.ambition||50)/100;
   const caution=bounded(+def.traits?.caution||50)/100;
   const sociability=bounded(+def.traits?.sociability||50)/100;
   const score=p[0]+p[1]*bounded(situation.workPressure)*ambition+
    p[2]*bounded(situation.social)*sociability+
    p[3]*bounded(situation.risk)*caution+
    p[4]*(bounded(situation.rumors)+bounded(situation.firstHand))*.35-
    (goal===agent.goal?8:0)+(['balance-finances','find-new-buyers','develop-trade'].includes(goal)?bounded(situation.financialStrain)*.35:0);
   const item={goal,score:Math.round(score*100)/100};
   scores.push(item);
   if(!best||score>best.score)best={goal,score};
  }
  // Scores exist only in private actor state, never in contact or newspapers.
  const reason=best.goal===def.goals[0]?'routine':best.goal===def.goals[1]?'opportunity':'precaution';
  return Object.freeze({goal:best.goal,rest:false,score:Math.round(best.score*100)/100,
   reason,scores:Object.freeze(scores.map(x=>Object.freeze(x)))});
 }
 const api=Object.freeze({observe,choose});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_AGENCY=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
