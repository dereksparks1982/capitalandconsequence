/* Washington household shopping plan. Planning changes no time or money;
 * fulfilled batches debit existing finite stalls and physically fill the bag. */
(function(root){'use strict';
const market=()=>root.FE_WASHINGTON_COMMERCE,kitchen=()=>root.FE_KITCHEN,recipes=()=>root.FE_RECIPES;
const fail=reason=>({ok:false,reason});
function state(save){
 if(!save||typeof save!=='object')return null;
 if(save.householdShopping?.version!==1)save.householdShopping={version:1,recipeId:null,history:[]};
 if(!Array.isArray(save.householdShopping.history))save.householdShopping.history=[];
 return save.householdShopping;
}
function choose(save,id){
 const recipe=recipes()?.byId?.[id],s=state(save);
 if(!s||!recipe||!root.FE_COOKERY?.state?.(save)?.known.includes(id))return fail('Learn the recipe before planning groceries.');
 s.recipeId=id;s.history.push({action:'plan',recipe:id,minute:save.worldCalendar?.worldMinute??null});
 s.history=s.history.slice(-80);return {ok:true,recipe};
}
function clear(save){const s=state(save);if(!s?.recipeId)return fail('No active shopping plan.');s.recipeId=null;return {ok:true}}
function quote(save,siteId=null){
 const recipe=recipes()?.byId?.[state(save)?.recipeId],m=market()?.ensure?.(save);
 if(!recipe||!m)return fail('Choose a known recipe in your kitchen first.');
 const current=kitchen()?.sync(save);if(!current?.ok)return fail('Kitchen inventory unavailable.');
 const lines=[],missing=[];
 for(const [id,required] of Object.entries(recipe.ingredients)){
  const good=market().GOODS.find(x=>x.id===id);
  if(!good)return fail('Unknown ingredient '+id);
  const atHome=current.goods.filter(x=>x.good===id&&!x.spoiled).reduce((n,x)=>n+x.units,0);
  const inBag=m.playerBag.filter(x=>x.good===id&&
    (!Number.isFinite(x.expiresAt)||x.expiresAt>save.worldCalendar?.worldMinute)).reduce((n,x)=>n+x.units,0);
  const deficit=Math.max(0,required-atHome-inBag);
  if(deficit){
   const packages=Math.ceil(deficit/good.units);
   lines.push({id,packages});
   missing.push({id,label:good.label,needed:required,atHome,inBag,deficit,packages});
  }
 }
 const totalPackages=lines.reduce((n,x)=>n+x.packages,0);
 const receipt=siteId===null?null:(lines.length?market().quoteBasket(save,siteId,lines):{ok:true,packages:0,totalCents:0});
 return {ok:true,recipe,missing,lines,totalPackages,receipt,complete:lines.length===0,possible:receipt?.ok===true};
}
function buy(save,siteId){
 if(root.FE_COOKERY?.marketSite?.(save)!==siteId)return fail('Visit that physical market counter first.');
 const info=quote(save,siteId);
 if(!info.ok||info.complete||!info.receipt?.ok)return fail(info.receipt?.reason||'Shopping plan cannot be filled here.');
 const result=market().purchaseBasket(save,siteId,info.lines,{date:save.gameDate});
 if(result.ok){
  const s=state(save);
  s.history.push({action:'bought',recipe:s.recipeId,site:siteId,
   packages:result.packages,cents:result.totalCents,minute:save.worldCalendar?.worldMinute??null});
  s.history=s.history.slice(-80);
 }
 return result;
}
const api=Object.freeze({state,choose,clear,quote,buy});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_HOUSEHOLD_SHOPPING=api;
})(typeof window!=='undefined'?window:globalThis);
