/* Capital & Consequence: evidence-backed private household acquisitions.
 * Reads paid, shared physical Washington market receipts. This does NOT
 * consume provisions, invent meals, transfer additional funds or imply that a
 * purchased food item is still in the house weeks later.
 */
(function(root){
 'use strict';
 const market=typeof module==='object'&&module.exports?require('./washington-commerce.js'):root.FE_WASHINGTON_COMMERCE;
 const FOOD=Object.freeze(new Set(['bread','milk','eggs','bacon','stew-beef','potatoes',
  'onions','beans-grains','produce','tea-sugar','seasoning']));
 const MAINTENANCE=Object.freeze(new Set(['soap','lamp-fuel','cobbler','clothing']));
 const LIMIT=32;
 function ensure(agent){
  if(!agent||typeof agent!=='object')throw Error('Named resident state required');
  let state=agent.householdReceipts;
  if(!state||state.version!==1){
   state={version:1,lastPurchaseId:0,foodPurchases:0,maintenancePurchases:0,
    spentCents:0,lastFoodDate:null,history:[],purchasedGoods:{},lastPurchaseDate:null,provisions:[],consumption:[],lastMealKey:null};
   agent.householdReceipts=state;
  }
  if(!Number.isSafeInteger(state.lastPurchaseId)||state.lastPurchaseId<0)state.lastPurchaseId=0;
  for(const k of ['foodPurchases','maintenancePurchases','spentCents'])
   if(!Number.isSafeInteger(state[k])||state[k]<0)state[k]=0;
  if(!state.purchasedGoods||typeof state.purchasedGoods!=='object'||Array.isArray(state.purchasedGoods))state.purchasedGoods={};
  if(!Array.isArray(state.provisions))state.provisions=[];
  if(!Array.isArray(state.consumption))state.consumption=[];
  if(!Array.isArray(state.history))state.history=[];
  if(state.history.length>LIMIT)state.history=state.history.slice(-LIMIT);
  return state;
 }
 function sync(save,id){
  const actor=save?.npcSimulation?.agents?.[id];
  if(!actor||typeof id!=='string'||!id||id==='player')return {changed:false,added:0};
  const purchases=save?.washingtonCommerce?.purchases;
  if(!Array.isArray(purchases)||!market?.GOODS)return {changed:false,added:0};
  const state=ensure(actor),byId=new Map(market.GOODS.map(g=>[g.id,g]));
  const candidates=purchases.filter(r=>r&&Number.isSafeInteger(r.id)&&r.id>state.lastPurchaseId)
   .sort((a,b)=>a.id-b.id);
  let latest=state.lastPurchaseId,added=0;
  for(const receipt of candidates){
   latest=Math.max(latest,receipt.id);
   if(receipt.buyer!==id||!/^\d{4}-\d{2}-\d{2}$/.test(receipt.date||'')||
      !Number.isSafeInteger(receipt.cents)||receipt.cents<0)continue;
   const good=byId.get(receipt.good),service=MAINTENANCE.has(receipt.good)&&!good;
   if(good&&(
      good.cents!==receipt.cents||good.units!==receipt.units||
      good.vendor!==receipt.vendor
   ))continue;
   if(!good&&!service)continue;
   const category=FOOD.has(receipt.good)?'food':'household-maintenance';
   state.history.push({id:receipt.id,date:receipt.date,good:receipt.good,
    category,cents:receipt.cents});
   if(category==='food'){
    state.foodPurchases++;
    state.lastFoodDate=receipt.date;
   }else state.maintenancePurchases++;
   state.spentCents+=receipt.cents;
   state.purchasedGoods[receipt.good]=(Number.isSafeInteger(state.purchasedGoods[receipt.good])?state.purchasedGoods[receipt.good]:0)+1;
   state.lastPurchaseDate=receipt.date;
   if(category==='food')state.provisions.push({receiptId:receipt.id,good:receipt.good,
    bought:receipt.date,consumed:false});
   added++;
  }
  state.lastPurchaseId=latest;
  if(state.history.length>LIMIT)state.history.splice(0,state.history.length-LIMIT);
  return {changed:added>0,added};
 }
 // Food must be genuinely purchased before it can count as a meal.
 // This does not deduct money or generate market transactions.
 function consume(save,id,key,date){
  if(typeof id!=='string'||!id||id==='player'||typeof key!=='string'||!key||
    !/^\d{4}-\d{2}-\d{2}$/.test(date||''))return {ok:false,reason:'invalid'};
  const actor=save?.npcSimulation?.agents?.[id];
  if(!actor)return {ok:false,reason:'unknown-resident'};
  const state=ensure(actor);
  if(state.consumption.some(r=>r.key===key))return {ok:false,reason:'already-settled'};
  const item=state.provisions.find(r=>!r.consumed&&r.bought<=date);
  if(!item)return {ok:false,reason:'no-paid-provisions'};
  item.consumed=true;
  const result={key,date,good:item.good,receiptId:item.receiptId};
  state.consumption.push(result);
  if(state.consumption.length>32)state.consumption.splice(0,state.consumption.length-32);
  state.lastMealKey=key;
  return {ok:true,...result};
 }
 function available(agent){
  const state=ensure(agent);
  return state.provisions.filter(r=>!r.consumed).length;
 }
 const api=Object.freeze({ensure,sync,consume,available});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_HOUSEHOLD_RECEIPTS=api;
})(typeof window!=='undefined'?window:globalThis);
