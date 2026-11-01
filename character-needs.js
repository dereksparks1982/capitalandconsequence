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
const INITIAL=Object.freeze({hunger:82,thirst:85,energy:80});
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
 const safeUntil=n=>Number.isSafeInteger(n)&&n>=0&&(at===null||n<at+5256000)?n:0;
 const cooldowns={};for(const k of Object.keys(CONFIG))cooldowns[k]=safeUntil(source?.cooldowns?.[k]);
 const warned={};
 for(const k of Object.keys(INITIAL))warned[k]=source?.warned?.[k]===true;
 return {version:1,meters,lastMinute,sharedUntil:safeUntil(source?.sharedUntil),
  cooldowns,warned,entries:Array.isArray(source?.entries)?source.entries.filter(e=>
   e&&Object.hasOwn(CONFIG,e.kind)&&Number.isSafeInteger(e.minute)&&typeof e.source==='string'
  ).slice(-80):[]};
}
function ensure(save){
 if(!save||typeof save!=='object')return null;
 const at=minute(save);
 if(at===null)return null;
 if(!save.characterNeeds||save.characterNeeds.version!==1)save.characterNeeds=sanitize(save.characterNeeds,at);
 return save.characterNeeds;
}
function sync(save){
 const now=minute(save),state=ensure(save);
 if(now===null||!state)return {ok:false,events:[],reason:'The Washington calendar is not available.'};
 const previous=Number.isSafeInteger(state.lastMinute)&&state.lastMinute<=now?state.lastMinute:now;
 const passed=now-previous;
 if(passed>0){
  for(const [key,rate] of Object.entries(RATES))
   state.meters[key]=clamp(state.meters[key]-passed*rate);
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
 return {ok:true,events,meters:{...state.meters},minute:now};
}
function availability(save,key){
 if(!Object.hasOwn(CONFIG,key))return {ok:false,reason:'Unknown break.'};
 const now=minute(save);
 if(now===null)return {ok:false,reason:'Washington time is unavailable.'};
 const state=ensure(save);
 const allowed=Math.max(state.sharedUntil,state.cooldowns[key]);
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
 for(const [meter,value] of Object.entries(rule.effects))
  state.meters[meter]=clamp(state.meters[meter]+value);
 for(const [meter,threshold] of Object.entries(THRESHOLDS))
  if(state.meters[meter]>threshold+15)state.warned[meter]=false;
 state.entries.push({kind:key,minute:now,source:String(source||'unknown').slice(0,50)});
 if(state.entries.length>80)state.entries.splice(0,state.entries.length-80);
 return {ok:true,kind:key,minute:now,meters:{...state.meters},
  nextSharedAt:state.sharedUntil,nextSpecificAt:state.cooldowns[key]};
}
function formatClock(worldMinute){
 if(!Number.isSafeInteger(worldMinute)||worldMinute<0)return 'unknown';
 const d=new Date(worldMinute*60000);
 const h=d.getUTCHours(),m=String(d.getUTCMinutes()).padStart(2,'0');
 return (h%12||12)+':'+m+(h>=12?' PM':' AM');
}
function status(save,key){
 const result=availability(save,key);
 if(!result.ok&&result.remaining)return 'Available at '+formatClock(result.availableAt)+' ('+formatDuration(result.remaining)+')';
 return result.reason||'Unavailable';
}
const api=Object.freeze({CONFIG,SHARED_COOLDOWN,RATES,THRESHOLDS,INITIAL,minute,sanitize,ensure,sync,take,availability,status,formatDuration,formatClock});
root.FE_CHARACTER_NEEDS=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
