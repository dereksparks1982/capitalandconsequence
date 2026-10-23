/* Capital & Consequence v0.6.59: intention-driven local destinations.
 * NPC goals may influence travel only for genuine personal time. The shared
 * city room-access service remains authoritative. No hidden future knowledge,
 * fixed outcomes, off-screen advancement, or simulated teleportation.
 */
(function(root){
 'use strict';
 const PREFERENCES=Object.freeze({
  alexiRurik:Object.freeze({'find-honest-work':'russianTradeHall','protect-allies':'russianTradeHall','establish-independence':'oldChinatown'}),
  eddieDoyle:Object.freeze({'expand-connections':'star','protect-reputation':'races','balance-finances':'races'}),
  chenMei:Object.freeze({'maintain-business':'oldChinatown','help-neighbors':'oldChinatown','develop-contacts':'russianTradeHall'}),
  liWen:Object.freeze({'find-new-buyers':'russianTradeHall','protect-local-trust':'oldChinatown','maintain-business':'oldChinatown'}),
  pavelOrlov:Object.freeze({'develop-trade':'russianTradeHall','expand-connections':'star','protect-reputation':'russianTradeHall'}),
  inspectorHayes:Object.freeze({'review-open-cases':'metropolitanPolice','maintain-public-order':'metropolitanPolice','build-professional-standing':'washingtonArena'}),
  madamStar:Object.freeze({'maintain-the-club':'star','cultivate-trusted-contacts':'russianTradeHall','protect-staff':'star'}),
  foremanSullivan:Object.freeze({'check-workshop-tools':'factory','fill-component-orders':'factory','handle-supplies':'factory'})
 });
 function plan(def,agent,action){
  if(!def||!agent||!action||action.kind!=='personal'||!action.locationId||
     !Number.isInteger(action.slot)||action.slot<0||action.slot>2)return null;
  const destination=PREFERENCES[def.id]?.[agent.goal]||null;
  return destination===action.locationId?null:destination;
 }
 const api=Object.freeze({plan});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_INTENTIONS=api;
})(typeof window!=='undefined'?window:globalThis);
