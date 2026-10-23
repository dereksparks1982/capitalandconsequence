/* Federal Electric: saved calendar bridge, v0.6.47-dev.
 * This shadow calendar runs beside the old day/night gameplay clock until the
 * business, market and venue consumers are migrated. It never invents an hour
 * for a pre-calendar save and never advances while the game is closed.
 */
(function(root){
 'use strict';
 const clock=typeof module==='object'&&module.exports?require('./world-clock.js'):root.FE_WORLD_CLOCK;
 if(!clock)throw new Error('World clock required before calendar bridge');
 function valid(value){
  if(!value||value.version!==1||!Number.isSafeInteger(value.worldMinute)||!Number.isSafeInteger(value.nextSequence)||
    !Array.isArray(value.queue)||!Array.isArray(value.history))return false;
  try {clock.formatMinute(value.worldMinute);return true}catch(e){return false}
 }
 function start(save,date,openingMinute=480){
  if(!save||typeof save!=='object'||typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||
    !Number.isSafeInteger(openingMinute)||openingMinute<0||openingMinute>=1440)throw new Error('Invalid saved day start');
  const iso=date+'T'+String(Math.floor(openingMinute/60)).padStart(2,'0')+':'+String(openingMinute%60).padStart(2,'0');
  save.worldCalendar=clock.create(iso);
  save.worldCalendarRemainder=0;
  save.worldCalendarStatus='ready';
  return save.worldCalendar;
 }
 function migrate(save,original){
  if(!save||typeof save!=='object')throw new Error('Saved game required');
  const existing=original?.worldCalendar;
  if(valid(existing)){
   save.worldCalendar=JSON.parse(JSON.stringify(existing));
   const remainder=+original.worldCalendarRemainder;
   save.worldCalendarRemainder=Number.isSafeInteger(remainder)&&remainder>=0&&remainder<60?remainder:0;
   save.worldCalendarStatus='ready';
   return true;
  }
  // Legacy phases store remaining seconds but no authoritative start hour.
  // Do not retrofit a fake hour, even for 1938 saves.
  save.worldCalendar=null;
  save.worldCalendarRemainder=0;
  save.worldCalendarStatus='legacy-unmapped';
  return false;
 }
 function spend(save,seconds,onEvent=()=>{}){
  if(!save||!valid(save.worldCalendar))return 0;
  if(!Number.isSafeInteger(seconds)||seconds<0)throw new Error('Invalid elapsed seconds');
  if(save.paused)return 0;
  const accumulated=(save.worldCalendarRemainder||0)+seconds;
  const wholeMinutes=Math.floor(accumulated/60);
  if(!wholeMinutes){save.worldCalendarRemainder=accumulated;return 0}
  // The calendar is authoritative within the bridge: queued events run once,
  // chronologically, even on large action-driven time jumps.
  clock.spend(save.worldCalendar,wholeMinutes,onEvent);
  save.worldCalendarRemainder=accumulated%60;
  return wholeMinutes;
 }
 function beginTurn(save,date,openingMinute=480,onEvent=()=>{}){
  if(!save||typeof save!=='object'||typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||
     !Number.isSafeInteger(openingMinute)||openingMinute<0||openingMinute>=1440)
   throw Error('Invalid business turn date and opening minute');
  const iso=date+'T'+String(Math.floor(openingMinute/60)).padStart(2,'0')+':'+
   String(openingMinute%60).padStart(2,'0');
  const desired=clock.create(iso);
  if(!valid(save.worldCalendar)){
   start(save,date,openingMinute);
   return {status:'mapped',iso};
  }
  const before=save.worldCalendar.worldMinute;
  if(desired.worldMinute<=before){
   // Never rewind known saved time, even if provisional travel crossed a
   // scheduled future morning earlier than the legacy turn transition.
   save.worldCalendarStatus='ready';
   return {status:'retained',iso:clock.formatMinute(before)};
  }
  // Keep the queue and record chronological delivery during an explicit turn
  // transition; consumers must supply handling for future event types.
  clock.advanceTo(save.worldCalendar,desired.worldMinute,onEvent);
  save.worldCalendarRemainder=0;
  save.worldCalendarStatus='ready';
  return {status:'advanced',iso};
 }
 function label(save){
  if(!valid(save?.worldCalendar))return null;
  return clock.timeLabel(save.worldCalendar);
 }
 function moment(save){return valid(save?.worldCalendar)?clock.calendar(save.worldCalendar):null}
 const api=Object.freeze({start,beginTurn,migrate,spend,label,moment,valid});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_CALENDAR_BRIDGE=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
