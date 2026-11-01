/* Capital & Consequence: saved human needs and anti-spam break rules.
 * Pure game-state module. Uses Washington's existing authoritative worldMinute.
 * No UI destinations, no extra clock, no passive offline progression. */
(function(root){
'use strict';
const clamp=n=>Math.max(0,Math.min(100,n));
const CONFIG=Object.freeze({
 coffee:Object.freeze({label:'Coffee',cooldown:180,effects:{energy:17,thirst:5}}),
 water:Object.freeze({label:'Water',cooldown:60,effects:{thirst:30}}),
 snack:Object.freeze({label:'Small Snack',cooldown:180,effects:{hunger:21,energy:4}}),
 rest:Object.freeze({label:'Rest Break',cooldown:90,effects:{energy:13}})
});
const SHARED_COOLDOWN=90;
const RATES=Object.freeze({hunger:.12,thirst:.18,energy:.085});
const THRESHOLDS=Object.freeze({hunger:40,thirst:40,energy:32});
const INITIAL=Object.freeze({hunger:82,thirst:85,energy:80,health:100});
const HEALTH_RULES=Object.freeze({dehydrationDelay:180,starvationDelay:720,dehydrationDamage:.025,starvationDamage:.008});
function minute(save){
 return save?.worldCalendarStatus==='ready'&&Number.isSafeInteger(save?.worldCalendar?.worldMinute)?
  save.worldCalendar.worldMinute:null;
}
function validNumber(n){return typeof n==='number'&&Number.isFinite(n)}
function sanitize(raw,at=null){
 const source=raw&&raw.version===1?raw:null;
 const meters={};
 for(const k of Object.keys(INITIAL)){
  const n=source?.meters?.[k];
  meters[k]=validNumber(n)?clamp(n):INITIAL[k];
 }
 const since=source?.lastMinute;
 const lastMinute=Number.isSafeInteger(since)&&(at===null||since<=at)?since:at;
 const safeUntil=n=>Number.isSafeInteger(n)&&(at===null||Math.abs(n-at)<5256000)?n:null;
 const cooldowns={};for(const k of Object.keys(CONFIG))cooldowns[k]=safeUntil(source?.cooldowns?.[k]);
 const deprivation={hunger:Number.isFinite(source?.deprivation?.hunger)?Math.max(0,source.deprivation.hunger):0,thirst:Number.isFinite(source?.deprivation?.thirst)?Math.max(0,source.deprivation.thirst):0};
 const warned={};
 for(const k of Object.keys(INITIAL))warned[k]=source?.warned?.[k]===true;
 return {version:1,meters,lastMinute,sharedUntil:safeUntil(source?.sharedUntil),
  cooldowns,warned,deprivation,nextFoodAt:safeUntil(source?.nextFoodAt),entries:Array.isArray(source?.entries)?source.entries.filter(e=>
   e&&Object.hasOwn(CONFIG,e.kind)&&Number.isSafeInteger(e.minute)&&typeof e.source==='string'
  ).slice(-80):[]};
}
function ensure(save){
 if(!save||typeof save!=='object')return null;
 const at=minute(save);
 if(at===null)return null;
 if(!save.characterNeeds||save.characterNeeds.version!==1||!Number.isFinite(save.characterNeeds.meters?.health)||!save.characterNeeds.deprivation)save.characterNeeds=sanitize(save.characterNeeds,at);
 return save.characterNeeds;
}
function sync(save){
 const now=minute(save),state=ensure(save);
 if(now===null||!state)return {ok:false,events:[],reason:'The Washington calendar is not available.'};
 const previous=Number.isSafeInteger(state.lastMinute)&&state.lastMinute<=now?state.lastMinute:now;
 const passed=now-previous;
 if(passed>0){
  for(const [key,rate] of Object.entries(RATES)){
   const previousMeter=state.meters[key];
   const nextMeter=clamp(previousMeter-passed*rate);
   state.meters[key]=nextMeter;
   if(key==='hunger'||key==='thirst'){
    const depleted=rate>0?Math.max(0,passed-Math.max(0,previousMeter)/rate):0;
    const start=state.deprivation[key],end=start+depleted;
    const delay=key==='hunger'?HEALTH_RULES.starvationDelay:HEALTH_RULES.dehydrationDelay;
    const rateDamage=key==='hunger'?HEALTH_RULES.starvationDamage:HEALTH_RULES.dehydrationDamage;
    state.meters.health=clamp(state.meters.health-(Math.max(0,end-delay)-Math.max(0,start-delay))*rateDamage);
    state.deprivation[key]=nextMeter===0?end:0;
   }
  }
 }
 state.lastMinute=now;
 const events=[];
 for(const [key,threshold] of Object.entries(THRESHOLDS)){
  const meter=state.meters[key];
  if(meter>threshold+15)state.warned[key]=false;
  else if(meter<=threshold&&!state.warned[key]){
   state.warned[key]=true;
   events.push({kind:key,minute:now,text:{
    hunger:'You are getting hungry. Find something to eat when you can.',
    thirst:'You are getting thirsty. You should have something to drink.',
    energy:'You are growing tired. A proper rest would help.'
   }[key]});
  }
 }
 if(state.meters.health<=30&&!state.warned.health){
  state.warned.health=true;
  events.push({kind:'health',minute:now,text:'Your health is poor. You need medical attention.'});
 }else if(state.meters.health>50)state.warned.health=false;
 return {ok:true,events,meters:{...state.meters},minute:now};
}
function overnight(save){
 const at=minute(save),state=ensure(save);
 if(at===null||!state)return {ok:false,reason:'Washington calendar unavailable.'};
 // Explicit report-to-morning transition; skipped hours are not simulated chores.
 // Sleeping restores energy only, never food, water or an injury.
 state.lastMinute=at;
 // Sleep is restorative but not a magical cure for repeated collapse.
 // Medical history reduces the next morning's maximum until recovery nights.
 const recovery=root.FE_MEDICAL_RECORDS?.onSleep?.(save);
 const cap=recovery?.energyCap??100;
 state.meters.energy=Math.min(cap,Math.max(state.meters.energy,90));
 state.warned.energy=false;
 return {ok:true,minute:at,meters:{...state.meters}};
}
function availability(save,key){
 if(!Object.hasOwn(CONFIG,key))return {ok:false,reason:'Unknown break.'};
 const now=minute(save);
 if(now===null)return {ok:false,reason:'Washington time is unavailable.'};
 const state=ensure(save);
 const allowed=Math.max(now,state.sharedUntil??now,state.cooldowns[key]??now);
 const remaining=Math.max(0,allowed-now);
 return {ok:remaining===0,remaining,availableAt:allowed,
  reason:remaining?'Available in '+formatDuration(remaining)+'.':'Available now.'};
}
function formatDuration(minutes){
 const m=Math.max(0,Math.ceil(minutes));
 if(m>=60)return Math.floor(m/60)+'h '+String(m%60).padStart(2,'0')+'m';
 return m+'m';
}
function take(save,key,source){
 if(!Object.hasOwn(CONFIG,key))return {ok:false,reason:'Unknown refreshment.'};
 const clock=sync(save);
 if(!clock.ok)return {ok:false,reason:clock.reason};
 const allowed=availability(save,key);
 if(!allowed.ok)return {ok:false,reason:allowed.reason,remaining:allowed.remaining};
 const state=ensure(save),now=clock.minute;
 const rule=CONFIG[key];
 state.sharedUntil=now+SHARED_COOLDOWN;
 state.cooldowns[key]=now+rule.cooldown;
 for(const [meter,value] of Object.entries(rule.effects)){
  state.meters[meter]=clamp(state.meters[meter]+value);
  if((meter==='hunger'||meter==='thirst')&&state.meters[meter]>0)state.deprivation[meter]=0;
 }
 for(const [meter,threshold] of Object.entries(THRESHOLDS))
  if(state.meters[meter]>threshold+15)state.warned[meter]=false;
 state.entries.push({kind:key,minute:now,source:String(source||'unknown').slice(0,50)});
 if(state.entries.length>80)state.entries.splice(0,state.entries.length-80);
 return {ok:true,kind:key,minute:now,meters:{...state.meters},
  nextSharedAt:state.sharedUntil,nextSpecificAt:state.cooldowns[key]};
}
function applyInjury(save,amount,reason='injury'){
 const clock=sync(save);if(!clock.ok)return {ok:false,reason:clock.reason};
 if(!Number.isFinite(amount)||amount<=0||amount>100)return {ok:false,reason:'Invalid injury.'};
 const state=ensure(save);state.meters.health=clamp(state.meters.health-amount);
 state.entries.push({kind:'injury',minute:clock.minute,source:String(reason).slice(0,50),damage:amount});
 state.entries=state.entries.slice(-80);
 const events=[];
 if(state.meters.health<=30&&!state.warned.health){state.warned.health=true;events.push({kind:'health',minute:clock.minute,text:'You are seriously injured and need medical attention.'});}
 return {ok:true,health:state.meters.health,events};
}
function treat(save,amount,source='medical-care'){
 const clock=sync(save);if(!clock.ok)return {ok:false,reason:clock.reason};
 if(!Number.isFinite(amount)||amount<=0||amount>100)return {ok:false,reason:'Invalid treatment.'};
 const state=ensure(save);state.meters.health=clamp(state.meters.health+amount);
 state.entries.push({kind:'treatment',minute:clock.minute,source:String(source).slice(0,50),restored:amount});
 state.entries=state.entries.slice(-80);
 if(state.meters.health>50)state.warned.health=false;
 return {ok:true,health:state.meters.health};
}
const PROVISIONS=Object.freeze({
 bread:Object.freeze({hunger:34}),milk:Object.freeze({hunger:8,thirst:24}),
 eggs:Object.freeze({hunger:29}),bacon:Object.freeze({hunger:27}),
 'stew-beef':Object.freeze({hunger:42}),potatoes:Object.freeze({hunger:24}),
 onions:Object.freeze({hunger:8}),'beans-grains':Object.freeze({hunger:35}),
 produce:Object.freeze({hunger:22,thirst:8})
});
function eatProvision(save,goodId){
 const benefit=PROVISIONS[goodId];
 if(!benefit)return {ok:false,reason:'This purchase is not ready-to-eat food.'};
 const clock=sync(save);
 if(!clock.ok)return {ok:false,reason:clock.reason};
 const state=ensure(save);
 if(clock.minute<(state.nextFoodAt??clock.minute))return {ok:false,reason:'You have only just finished eating.'};
 for(const [key,value] of Object.entries(benefit)){
  state.meters[key]=clamp(state.meters[key]+value);
  if(state.meters[key]>0)state.deprivation[key]=0;
  if(state.meters[key]>THRESHOLDS[key]+15)state.warned[key]=false;
 }
 state.nextFoodAt=clock.minute+30;
 state.entries.push({kind:'meal',minute:clock.minute,source:'market-provision:'+goodId});
 state.entries=state.entries.slice(-80);
 return {ok:true,meters:{...state.meters}};
}
function provisionAvailability(save,goodId){
 if(!Object.hasOwn(PROVISIONS,goodId))return {ok:false,reason:'Not edible without preparation.'};
 const at=minute(save),state=ensure(save);
 if(at===null||!state)return {ok:false,reason:'Washington time unavailable.'};
 const wait=Math.max(0,(state.nextFoodAt??at)-at);
 return {ok:wait===0,remaining:wait,reason:wait?'Available in '+formatDuration(wait)+'.':'Ready to eat.'};
}
function formatClock(worldMinute){
 if(!Number.isSafeInteger(worldMinute))return 'unknown';
 const d=new Date(worldMinute*60000);
 const h=d.getUTCHours(),m=String(d.getUTCMinutes()).padStart(2,'0');
 return (h%12||12)+':'+m+(h>=12?' PM':' AM');
}
function status(save,key){
 const result=availability(save,key);
 if(!result.ok&&result.remaining)return 'Available at '+formatClock(result.availableAt)+' ('+formatDuration(result.remaining)+')';
 return result.reason||'Unavailable';
}
const api=Object.freeze({CONFIG,SHARED_COOLDOWN,RATES,THRESHOLDS,INITIAL,HEALTH_RULES,PROVISIONS,minute,sanitize,ensure,sync,overnight,take,eatProvision,provisionAvailability,applyInjury,treat,availability,status,formatDuration,formatClock});
root.FE_CHARACTER_NEEDS=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
