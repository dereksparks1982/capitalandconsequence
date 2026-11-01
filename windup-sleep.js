/* Wind-up twin-bell alarm and deterministic personal sleep planning.
 * Uses the saved 1878 Washington calendar; no independent real-time clock.
 */
(function(root){
'use strict';
const VERSION=1;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function now(save){return save?.worldCalendarStatus==='ready'&&Number.isSafeInteger(save?.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null;}
function ensure(save){
 if(!save||typeof save!=='object')return null;
 if(!save.windupAlarm||save.windupAlarm.version!==VERSION)
  save.windupAlarm={version:VERSION,enabled:false,hour:7,minute:0,woundAt:null,lastOutcome:null};
 const a=save.windupAlarm;
 a.enabled=a.enabled===true;
 a.hour=Number.isInteger(a.hour)?clamp(a.hour,0,23):7;
 a.minute=Number.isInteger(a.minute)?clamp(a.minute,0,59):0;
 if(!Number.isSafeInteger(a.woundAt))a.woundAt=null;
 return a;
}
function configure(save,{enabled,hour,minute}={}){
 const a=ensure(save);
 if(!a)return {ok:false,reason:'Alarm unavailable.'};
 if(!Number.isInteger(hour)||hour<0||hour>23||!Number.isInteger(minute)||minute<0||minute>59)
  return {ok:false,reason:'Choose a valid alarm time.'};
 a.enabled=enabled===true;a.hour=hour;a.minute=minute;
 return {ok:true,alarm:{...a}};
}
function wind(save){
 const at=now(save),a=ensure(save);
 if(at===null||!a)return {ok:false,reason:'Washington time is unavailable.'};
 a.woundAt=at;return {ok:true,alarm:{...a}};
}
function hash(value){
 let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0;
}
function plan(save,{hours}={}){
 const at=now(save),a=ensure(save),h=Number(hours);
 if(at===null||!a)return {ok:false,reason:'Washington time is unavailable.'};
 if(!Number.isFinite(h)||h<.5||h>12||!Number.isInteger(h*2))
  return {ok:false,reason:'Choose between half an hour and twelve hours in 30-minute steps.'};
 const requestedMinutes=Math.round(h*60);
 const wound=a.enabled&&a.woundAt!==null&&at>=a.woundAt&&at-a.woundAt<18*60;
 const minuteOfDay=((at%1440)+1440)%1440;
 const target=a.hour*60+a.minute;
 const untilAlarm=((target-minuteOfDay+1439)%1440)+1;
 const alarmScheduled=wound&&untilAlarm<=requestedMinutes;
 const plannedMinutes=alarmScheduled?untilAlarm:requestedMinutes;
 const roll=hash(String(save.characterRoute||'person')+'|'+at+'|'+h+'|'+a.enabled+'|'+a.woundAt)%1000;
 // Wind-up clock: a well-prepared alarm almost always works. Unwound
 // clocks have no ring; natural oversleep remains rare, never guaranteed.
 const overslept=roll<(alarmScheduled?15:65);
 const extraMinutes=overslept?30+(hash('late|'+at+'|'+save.characterRoute)%3)*30:0;
 return {ok:true,requestedMinutes,plannedMinutes,totalMinutes:plannedMinutes+extraMinutes,
  alarmScheduled,alarmWound:wound,alarmEnabled:a.enabled,
  alarmRang:alarmScheduled&&!overslept,overslept,extraMinutes};
}
function settle(save,result,sleptMinutes){
 const alarm=ensure(save);
 if(!alarm||!result?.ok||!Number.isSafeInteger(sleptMinutes)||sleptMinutes<0)return {ok:false};
 const complete=sleptMinutes>=result.totalMinutes;
 const entry={minute:now(save),requestedMinutes:result.requestedMinutes,sleptMinutes,
  alarmRang:complete&&result.alarmRang,overslept:complete&&result.overslept,
  alarmWound:result.alarmWound,complete};
 alarm.lastOutcome=entry;
 if(result.alarmScheduled)alarm.woundAt=null; // must wind again for next ringing
 if(!Array.isArray(save.sleepHistory))save.sleepHistory=[];
 save.sleepHistory.push(entry);save.sleepHistory=save.sleepHistory.slice(-100);
 return {ok:true,entry};
}
const api=Object.freeze({VERSION,ensure,configure,wind,plan,settle});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_WINDUP_SLEEP=api;
})(typeof window!=='undefined'?window:globalThis);
