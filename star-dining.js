/* Capital & Consequence: actual Star Club dining-room service, 1878.
 * A deliberately limited period menu. Money is personal, time uses the
 * authoritative Washington clock, food uses Character Needs, not player stock.
 * Quantities/prices are provisional game-balance, not documented 1878 prices.
 */
(function(root){
'use strict';
const MENU=Object.freeze({
 'tea-and-bread':Object.freeze({name:'Bread, butter and tea',cents:18,minutes:20,hunger:28,thirst:24,portions:12}),
 'roast-beef':Object.freeze({name:'Roast beef and potatoes',cents:67,minutes:35,hunger:58,thirst:4,portions:8}),
 'barley-broth':Object.freeze({name:'Chicken and barley broth',cents:42,minutes:25,hunger:42,thirst:16,portions:10}),
 'stewed-apples':Object.freeze({name:'Stewed apples with cream',cents:28,minutes:15,hunger:24,thirst:6,portions:10})
});
const DAYS_TO_KEEP=40;
const validDay=d=>{
 if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;
 const time=new Date(d+'T12:00:00Z');
 return Number.isFinite(+time)&&time.toISOString().slice(0,10)===d;
};
function empty(){return {version:1,days:{},receipts:{},history:[]}}
function read(save){
 const s=save?.starDining||empty();
 if(s.version!==1||!s.days||!s.receipts||!Array.isArray(s.history))
  throw Error('Invalid Star Club dining save; never reset a previous service.');
 return JSON.parse(JSON.stringify(s));
}
function remaining(save,date,id){
 const p=MENU[id];
 if(!p||!validDay(date))return 0;
 const row=save?.starDining?.days?.[date];
 const available=row?.portions?.[id];
 if(available===undefined)return p.portions;
 if(!Number.isSafeInteger(available)||available<0||available>p.portions)
  throw Error('Invalid Star Club kitchen portion count');
 return available;
}
function preview(save,id,{locationId,roomId,dev=false,postService=false}={}){
 const item=MENU[id];
 if(!item)return {ok:false,reason:'That dish is not on the Star Club menu.'};
 if(!save||save.paused||save.phase==='report'||dev||
  locationId!=='star'||roomId!=='dining-room'||
  save.currentLocation?.locationId!==locationId||
  save.currentLocation?.roomId!==roomId)
  return {ok:false,reason:'Dine only inside the real Star Club Dining Room during active play.'};
 const clock=root.FE_WASHINGTON_TIME?.now?.(save);
 if(!clock||!validDay(clock.date)||!Number.isSafeInteger(clock.minuteOfDay))
  return {ok:false,reason:'Authoritative Washington time is unavailable.'};
 const phase=save.phase;
 if(!['day','night'].includes(phase)||clock.minuteOfDay<660||
  clock.minuteOfDay+(postService?0:item.minutes)>=(phase==='day'?1020:1320))
  return {ok:false,reason:'The dining room serves meals 11 AM–10 PM, but this service would cross closing or a game-phase boundary.'};
 if(!root.FE_CHARACTER_NEEDS?.eatPrepared||!root.FE_WASHINGTON_COMMERCE?.ensure)
  return {ok:false,reason:'Dining requires the existing needs and commerce systems.'};
 if(root.FE_CHARACTER_NEEDS.minute(save)===null)
  return {ok:false,reason:'The character condition clock is unavailable.'};
 if((save.characterNeeds?.nextFoodAt??-Infinity)>root.FE_CHARACTER_NEEDS.minute(save))
  return {ok:false,reason:'You have recently eaten. Allow your next meal interval.'};
 if(remaining(save,clock.date,id)<=0)
  return {ok:false,reason:'The Star Club kitchen has sold out of this dish today.'};
 const personalCents=Math.round(save.personalCash*100);
 if(!Number.isSafeInteger(personalCents)||personalCents<item.cents)
  return {ok:false,reason:'Not enough personal cash for the meal.'};
 const left=root.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(save);
 if(!postService&&(!Number.isSafeInteger(left)||left<=item.minutes*60))
  return {ok:false,reason:'Not enough Washington time remains to finish dining.'};
 return {ok:true,seconds:item.minutes*60,menuId:id,item,date:clock.date};
}
function transact(save,{menuId,token,spentSeconds,date,locationId,roomId}){
 if(typeof token!=='string'||!/^[a-z0-9][a-z0-9:_-]{0,119}$/i.test(token))
  return {ok:false,reason:'Unique dining receipt token required.'};
 const earlier=save?.starDining?.receipts?.[token];
 if(earlier)return {...earlier,repeated:true};
 const item=MENU[menuId];
 if(!item||spentSeconds!==item.minutes*60)return {ok:false,reason:'The meal was not served for the required actual time.'};
 const allowed=preview(save,menuId,{locationId,roomId,postService:true});
 if(!allowed.ok)return allowed;
 // The menu action is preflighted BEFORE the caller spends world time;
 // recheck the exact in-world date for a service crossing midnight.
 if(date!==allowed.date)return {ok:false,reason:'Dining service crossed into a different Washington date.'};
 const paid=Math.round(save.personalCash*100);
 if(!Number.isSafeInteger(paid)||paid<item.cents)return {ok:false,reason:'Dining funds unavailable.'};
 // The needs engine records an actual prepared meal and its 30-minute interval.
 // It is called before accounting, so no charge/stock change if it refuses.
 const nourished=root.FE_CHARACTER_NEEDS.eatPrepared(save,{hunger:item.hunger,thirst:item.thirst},
  'star-dining:'+menuId);
 if(!nourished?.ok)return {ok:false,reason:nourished?.reason||'Unable to receive this meal.'};
 const commerce=root.FE_WASHINGTON_COMMERCE.ensure(save);
 const state=save.starDining||empty(),row=state.days[date]||{portions:{}};
 if(!state.days[date])state.days[date]=row;
 for(const [id,p] of Object.entries(MENU))
  if(!Number.isSafeInteger(row.portions[id]))row.portions[id]=p.portions;
 row.portions[menuId]--;
 save.personalCash=(paid-item.cents)/100;
 commerce.accounts['star:dining']=(commerce.accounts['star:dining']||0)+item.cents;
 const receipt={ok:true,kind:'star-meal',menuId,date,token,
  meal:item.name,costCents:item.cents,elapsedSeconds:spentSeconds,portionsRemaining:row.portions[menuId],
  message:'Served '+item.name+' for $'+(item.cents/100).toFixed(2)+
   '. The charge went to the Star Club dining till.'};
 state.receipts[token]=receipt;state.history.push(receipt);
 if(state.history.length>120)state.history.splice(0,state.history.length-120);
 const days=Object.keys(state.days).sort();
 for(const old of days.slice(0,-DAYS_TO_KEEP))delete state.days[old];
 save.starDining=state;
 if(Array.isArray(save.notes)){
  save.notes.push({date,source:'Star Club dining receipt',text:receipt.message});
  if(save.notes.length>320)save.notes.splice(0,save.notes.length-320);
 }
 return {...receipt,repeated:false,meters:nourished.meters};
}
const api=Object.freeze({MENU,read,remaining,preview,transact});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_STAR_DINING=api;
})(typeof window!=='undefined'?window:globalThis);
