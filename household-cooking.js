/* Source-of-truth household cooking and bakery progression.
 * Consumes the real kitchen's purchased ingredients, with recipe learning
 * and earned baking proficiency. Clock advances in app before completion.
 */
(function(root){'use strict';
const recipes=()=>root.FE_RECIPES, kitchen=()=>root.FE_KITCHEN;
const atMarket=s=>['oldChinatown','easternMarket','georgetownMarketHouse','centerMarket'].includes(s?.currentLocation?.locationId)||
 (s?.currentLocation?.locationId==='hillsdale'&&s?.currentLocation?.roomId==='hillsdale-market');
function state(save){
 if(!save||typeof save!=='object')return null;
 if(save.householdCookery?.version!==1)save.householdCookery={version:1,known:[],booksRead:[],purchases:[],
  bakingXp:0,mealsMade:0,bakingMade:0,sales:[],soldByDate:{},history:[]};
 const s=save.householdCookery;
 for(const key of ['known','booksRead','purchases','sales','history'])if(!Array.isArray(s[key]))s[key]=[];
 if(!s.soldByDate||typeof s.soldByDate!=='object')s.soldByDate={};
 if(!Number.isFinite(s.bakingXp))s.bakingXp=0;
 const basic=['bread-and-butter','fried-eggs','boiled-eggs','fried-potatoes','oat-porridge',
  'bacon-and-eggs','potato-mash','steamed-rice'];
 for(const id of basic)if(!s.known.includes(id))s.known.push(id);
 return s;
}
function canCook(save,id){
 const recipe=recipes()?.byId?.[id],data=state(save);
 if(!data||!recipe)return {ok:false,reason:'Unknown recipe.'};
 if(!data.known.includes(id))return {ok:false,reason:'Learn the recipe from a cookbook.'};
 if(!kitchen()?.atKitchen?.(save))return {ok:false,reason:'You must prepare food in your own kitchen.'};
 const stock=kitchen().available(save,recipe.ingredients);
 if(!stock.ok)return {ok:false,reason:stock.reason||'Missing ingredients.',missing:stock.missing};
 return {ok:true,recipe};
}
function buyBook(save,id,award){
 const book=recipes()?.bookById?.[id],s=state(save);
 if(!book||!s||!atMarket(save))return {ok:false,reason:'Visit a provision market to buy this cookbook.'};
 if(s.purchases.some(p=>p.id===id))return {ok:false,reason:'You already own this cookbook.'};
 const cents=Math.round(Number(save.personalCash||0)*100);
 if(cents<book.cents)return {ok:false,reason:'Not enough personal cash.'};
 const old=save.personalCash;save.personalCash=(cents-book.cents)/100;
 const item={id:'cookbook:'+id,name:book.name,kind:'cookbook',description:'A printed book of recipes to study and practice.'};
 let received;
 try{received=typeof award==='function'?award(item):null}catch(_){received={ok:false}}
 if(!received?.ok){save.personalCash=old;return {ok:false,reason:received?.reason||'No room to carry the book.'}}
 const merchant=root.FE_WASHINGTON_COMMERCE?.ensure?.(save);
 if(merchant)merchant.accounts.bookshop=(merchant.accounts.bookshop||0)+book.cents;
 const receipt={id,minute:save.worldCalendar?.worldMinute||null,cents:book.cents};
 s.purchases.push(receipt);return {ok:true,book,receipt};
}
function canRead(save,id){
 const book=recipes()?.bookById?.[id],s=state(save);
 if(!book||!s)return {ok:false,reason:'Unknown cookbook.'};
 if(s.booksRead.includes(id))return {ok:false,reason:'You have already studied this book.'};
 const held=save?.personalEffects?.items?.some(x=>x.id==='cookbook:'+id&&
  (x.container==='left-pocket'||x.container==='right-pocket'));
 if(!held)return {ok:false,reason:'Carry the actual cookbook to read it.'};
 return {ok:true,book};
}
function learn(save,id){
 const available=canRead(save,id);if(!available.ok)return available;
 const s=state(save);s.booksRead.push(id);
 const discovered=recipes().RECIPES.filter(r=>r.book===id).map(r=>r.id);
 for(const recipeId of discovered)if(!s.known.includes(recipeId))s.known.push(recipeId);
 s.history.push({action:'learn',id,minute:save.worldCalendar?.worldMinute||null,count:discovered.length});
 s.history=s.history.slice(-140);
 return {ok:true,book:available.book,unlocked:discovered};
}
function bakingLevel(save){return Math.min(100,Math.floor(Math.sqrt(Math.max(0,state(save)?.bakingXp||0))*2))}
function complete(save,id){
 const allowed=canCook(save,id);if(!allowed.ok)return allowed;
 const recipe=allowed.recipe,s=state(save);
 const consumed=kitchen().consume(save,recipe.ingredients);
 if(!consumed.ok)return consumed;
 const level=recipe.kind==='baking'?bakingLevel(save):
  Number(root.FE_SKILLS?.level?.(save,'cooking')||7);
 const difficulty=Math.max(0,recipe.difficulty-level);
 const seed=String(save.worldCalendar?.worldMinute||0)+':'+id+':'+s.mealsMade;
 let hash=2166136261;for(const c of seed){hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619)}
 // Novices sometimes spoil complex meals, but never more than 10% of rounds.
 const failed=difficulty>15&&(hash>>>0)%100<Math.min(10,Math.ceil(difficulty/5));
 s.mealsMade++;
 if(recipe.kind==='baking'){s.bakingMade++;s.bakingXp+=Math.max(1,Math.ceil(recipe.minutes/20));}
 root.FE_SKILLS?.practice?.(save,'cooking',{event:'recipe:'+s.mealsMade+':'+id,
  difficulty:recipe.difficulty,amount:recipe.kind==='baking'?.12:.18,source:'household kitchen'});
 let result=null;
 if(!failed)result=kitchen().addMeal(save,id,recipe.servings);
 s.history.push({action:failed?'burnt':'cooked',id,minute:save.worldCalendar?.worldMinute||null,servings:failed?0:recipe.servings});
 s.history=s.history.slice(-140);
 return {ok:true,burnt:failed,recipe,meal:result,servings:failed?0:recipe.servings,
  bakingLevel:bakingLevel(save)};
}
function eat(save,mealId){
 if(!kitchen()?.atKitchen?.(save))return {ok:false,reason:'Eat your prepared meals at home.'};
 const data=kitchen().ledger(save),meal=data?.k.meals.find(m=>m.id===mealId);
 if(!meal||meal.spoiled||meal.servings<1)return {ok:false,reason:'No edible serving remains.'};
 const needs=root.FE_CHARACTER_NEEDS;
 const recipe=recipes().byId[meal.recipe],benefit={hunger:recipe?.kind==='baking'?25:42,
  thirst:recipe?.id.includes('soup')?14:0};
 const res=needs?.eatPrepared?.(save,benefit,meal.recipe);
 if(!res?.ok)return res||{ok:false,reason:'Needs system unavailable.'};
 meal.servings--;if(meal.servings<=0)data.k.meals=data.k.meals.filter(m=>m!==meal);
 return {ok:true,recipe:meal.recipe,meters:res.meters};
}
function sell(save,mealId,servings){
 const data=kitchen()?.ledger?.(save),meal=data?.k.carriedMeals?.find(m=>m.id===mealId);
 const recipe=recipes()?.byId?.[meal?.recipe],s=state(save);
 if(!meal||!recipe||!s||!atMarket(save)||meal.spoiled||recipe.kind!=='baking')
  return {ok:false,reason:'Bring a baked product to a market to sell it.'};
 if(!Number.isSafeInteger(servings)||servings<1||servings>meal.servings)
  return {ok:false,reason:'Invalid number of servings.'};
 const date=save.gameDate||'',sold=s.soldByDate[date]||0;
 if(sold+servings>40)return {ok:false,reason:'The market is finished buying baked goods for today.'};
 const merchant=root.FE_WASHINGTON_COMMERCE?.ensure?.(save);
 const centsEach=Math.max(2,Math.round(recipe.difficulty*.7+recipe.minutes*.07));
 const cents=centsEach*servings,account='bakery';
 if(!merchant||Number(merchant.accounts[account]||0)<cents)
  return {ok:false,reason:'The market bakery has insufficient cash to buy your goods.'};
 merchant.accounts[account]-=cents;
 save.personalCash=(Math.round(Number(save.personalCash||0)*100)+cents)/100;
 meal.servings-=servings;
 if(meal.servings===0)data.k.carriedMeals=data.k.carriedMeals.filter(m=>m!==meal);
 const receipt={minute:save.worldCalendar?.worldMinute||null,date,recipe:recipe.id,
  servings,amountCents:cents};
 s.sales.push(receipt);s.soldByDate[date]=sold+servings;s.sales=s.sales.slice(-200);
 return {ok:true,receipt};
}
const api=Object.freeze({state,bakingLevel,canCook,buyBook,canRead,learn,complete,eat,sell,atMarket});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_COOKERY=api;
})(typeof window!=='undefined'?window:globalThis);
