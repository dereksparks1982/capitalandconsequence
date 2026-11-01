/* Saved household kitchen stock, backed by the SAME WashingtonCommerce bag.
 * Each purchased package is moved exactly once, not copied. Recipe spending
 * is atomic and available only from physical, unspoiled kitchen ingredients.
 */
(function(root){'use strict';
const CONTAINERS=Object.freeze(['pantry','larder','icebox']);
const minute=s=>Number.isSafeInteger(s?.worldCalendar?.worldMinute)?s.worldCalendar.worldMinute:null;
const catalog=id=>root.FE_FOOD_CATALOG?.find?.(id)||null;
function ledger(save){
 const commerce=root.FE_WASHINGTON_COMMERCE?.ensure?.(save);
 if(!commerce)return null;
 if(!commerce.kitchen||commerce.kitchen.version!==1)
  commerce.kitchen={version:1,serial:0,goods:[],meals:[],iceUntil:null,history:[]};
 const k=commerce.kitchen;if(!Array.isArray(k.goods))k.goods=[];
 if(!Array.isArray(k.meals))k.meals=[];if(!Array.isArray(k.history))k.history=[];
 if(!Number.isSafeInteger(k.serial))k.serial=0;
 return {commerce,k};
}
function atKitchen(save){return save?.currentLocation?.locationId==='home'&&save?.currentLocation?.roomId==='kitchen'}
function next(k){return 'kitchen-'+(++k.serial)}
function sync(save){
 const data=ledger(save);if(!data)return {ok:false,reason:'Household inventory unavailable'};
 const {k}=data,t=minute(save);
 if(t===null)return {ok:false,reason:'Game clock unavailable'};
 for(const g of k.goods){
  if(g.spoiled)continue;
  const product=catalog(g.good);
  if(g.container==='icebox'&&product?.storage==='icebox'&&(!k.iceUntil||k.iceUntil<=t)){
   // Melted ice accelerates deterioration, never turns good meat instantly bad.
   if(!g.uncooledAt)g.uncooledAt=t;
   if(t-g.uncooledAt>=480)g.spoiled=true;
  }else if(g.container==='icebox'&&k.iceUntil>t)g.uncooledAt=null;
  if(g.expires!==null&&g.expires<=t)g.spoiled=true;
 }
 for(const meal of k.meals)if(meal.expires!==null&&meal.expires<=t)meal.spoiled=true;
 return {ok:true,goods:k.goods,meals:k.meals,iceUntil:k.iceUntil};
}
function stock(save,container){
 if(!CONTAINERS.includes(container))return [];
 const o=sync(save);return o.ok?o.goods.filter(x=>x.container===container).map(x=>({...x})):[];
}
function packaged(k,good,units,container,t,source){
 const p=catalog(good);if(!p||!Number.isSafeInteger(units)||units<1)return null;
 const result={id:next(k),good,units,container,source,storedAt:t,
  expires:Number.isFinite(p.shelfDays)?t+p.shelfDays*1440:null,spoiled:false,uncooledAt:null};
 k.goods.push(result);return result;
}
function store(save,id,container){
 if(!atKitchen(save))return {ok:false,reason:'Bring your shopping home to the kitchen.'};
 if(!CONTAINERS.includes(container))return {ok:false,reason:'Unknown storage cupboard.'};
 const data=ledger(save),t=minute(save);if(!data||t===null)return {ok:false,reason:'Household clock unavailable.'};
 const index=data.commerce.playerBag.findIndex(g=>g.id===id);
 if(index<0)return {ok:false,reason:'The purchased package is not in your shopping bag.'};
 const bag=data.commerce.playerBag[index],p=catalog(bag.good);
 if(!p)return {ok:false,reason:'This is not an item from the grocery catalog.'};
 if(data.k.goods.length>=350)return {ok:false,reason:'The kitchen is full.'};
 const entry=packaged(data.k,bag.good,bag.units||p.units,container,t,'market:'+id);
 if(!entry)return {ok:false,reason:'Invalid grocery package.'};
 data.commerce.playerBag.splice(index,1);
 data.k.history.push({action:'store',id:entry.id,minute:t,container});
 data.k.history=data.k.history.slice(-150);
 return {ok:true,entry};
}
function storeAll(save){
 if(!atKitchen(save))return {ok:false,reason:'Visit your kitchen to put groceries away.'};
 const {commerce}=ledger(save);
 const ids=commerce.playerBag.filter(g=>catalog(g.good)).map(g=>g.id);
 let stored=0;for(const id of ids){
  const p=catalog(commerce.playerBag.find(x=>x.id===id)?.good);
  if(store(save,id,p?.storage||'pantry').ok)stored++;
 }
 return {ok:true,stored};
}
function take(save,id){
 if(!atKitchen(save))return {ok:false,reason:'Visit your kitchen to collect food.'};
 const data=ledger(save),i=data.k.goods.findIndex(g=>g.id===id);
 if(i<0)return {ok:false,reason:'Food not stored in this kitchen.'};
 if(data.commerce.playerBag.length>=24)return {ok:false,reason:'Shopping bag full.'};
 const entry=data.k.goods[i];if(entry.spoiled)return {ok:false,reason:'Spoiled goods must be discarded.'};
 data.commerce.playerBag.push({id:entry.id,good:entry.good,
  label:catalog(entry.good)?.label||entry.good,units:entry.units,date:save.gameDate||''});
 data.k.goods.splice(i,1);
 return {ok:true,entry};
}
function discard(save,id){
 if(!atKitchen(save))return {ok:false,reason:'Visit your kitchen.'};
 const data=ledger(save),i=data.k.goods.findIndex(g=>g.id===id);
 if(i<0)return {ok:false,reason:'Unknown package.'};
 const [item]=data.k.goods.splice(i,1);return {ok:true,item};
}
function acceptDelivery(save,good,units,source){
 const data=ledger(save),p=catalog(good),t=minute(save);
 if(!data||!p||t===null||!Number.isSafeInteger(units)||units<1||units>100)
  return {ok:false,reason:'Invalid delivery.'};
 if(data.k.goods.length>=350)return {ok:false,reason:'Kitchen capacity reached.'};
 const entry=packaged(data.k,good,units,p.storage,t,String(source).slice(0,90));
 return {ok:true,entry};
}
function ice(save,blocks){
 const data=ledger(save),t=minute(save);
 if(!data||t===null||!Number.isSafeInteger(blocks)||blocks<1||blocks>10)
  return {ok:false,reason:'Invalid ice block count.'};
 data.k.iceUntil=Math.max(t,Number.isFinite(data.k.iceUntil)?data.k.iceUntil:t)+blocks*1440;
 return {ok:true,until:data.k.iceUntil};
}
function available(save,ingredients){
 const o=sync(save);if(!o.ok)return {ok:false,reason:o.reason,missing:[]};
 const missing=[];
 for(const [id,quantity] of Object.entries(ingredients||{})){
  if(!catalog(id)||!Number.isSafeInteger(quantity)||quantity<1)return {ok:false,missing:[],reason:'Invalid ingredient'};
  const count=o.goods.filter(g=>g.good===id&&!g.spoiled).reduce((n,g)=>n+g.units,0);
  if(count<quantity)missing.push({id,needed:quantity,have:count});
 }
 return {ok:missing.length===0,missing};
}
function consume(save,ingredients){
 if(!atKitchen(save))return {ok:false,reason:'You must be in your kitchen to cook.'};
 const availability=available(save,ingredients);
 if(!availability.ok)return {ok:false,reason:availability.reason||'Ingredients missing',missing:availability.missing};
 const {k}=ledger(save);
 for(const [id,needed] of Object.entries(ingredients)){
  let remaining=needed;
  for(const item of k.goods.filter(g=>g.good===id&&!g.spoiled).sort((a,b)=>a.storedAt-b.storedAt)){
   const removed=Math.min(remaining,item.units);item.units-=removed;remaining-=removed;
   if(remaining===0)break;
  }
 }
 k.goods=k.goods.filter(g=>g.units>0);
 return {ok:true};
}
function addMeal(save,recipe,servings,expiresAfterMinutes=2880){
 const data=ledger(save),t=minute(save);if(!data||t===null)return null;
 const meal={id:next(data.k),recipe,servings,created:t,expires:t+expiresAfterMinutes,spoiled:false};
 data.k.meals.push(meal);data.k.meals=data.k.meals.slice(-100);return meal;
}
const api=Object.freeze({CONTAINERS,ledger,atKitchen,sync,stock,store,storeAll,take,discard,acceptDelivery,ice,available,consume,addMeal,minute});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_KITCHEN=api;
})(typeof window!=='undefined'?window:globalThis);
