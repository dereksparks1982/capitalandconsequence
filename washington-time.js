/* Capital & Consequence: authoritative saved clock, v0.6.71.
 * 1 real second = 1 Washington second in active play. Actions advance
 * explicit durations. NPCs consume elapsed time; they do not advance it.
 */
(function(root){
 'use strict';
 const bridge=typeof module==='object'&&module.exports?require('./calendar-bridge.js'):root.FE_CALENDAR_BRIDGE;
 const tx=typeof module==='object'&&module.exports?require('./time-transactions.js'):root.FE_TIME_TX;
 const sky=typeof module==='object'&&module.exports?require('./sky-cycle.js'):root.FE_WASHINGTON_SKY;
 if(!bridge||!tx)throw Error('Saved calendar services required');
 function now(save){
  const c=save?.worldCalendarStatus==='ready'?bridge.moment(save):null;
  return c?Object.freeze({iso:c.iso,date:c.date,weekday:c.weekday,minuteOfDay:c.minuteOfDay,time:bridge.label(save)}):null;
 }
 function rate(){return 1}
 function available(save){return save&&!save.paused?Number.MAX_SAFE_INTEGER:0}
 function canSpend(save,seconds){return Number.isSafeInteger(seconds)&&seconds>=0&&seconds<=available(save)}
 function debit(save,seconds){return canSpend(save,seconds)?seconds:0}
 function advance(save,seconds,kind='action',token=null){
  if(!Number.isSafeInteger(seconds)||seconds<0)throw Error('Nonnegative integer game seconds required');
  return tx.advance(save,seconds,kind,token);
 }
 function remainder(save){const r=save?.worldCalendarRemainder;return Number.isSafeInteger(r)&&r>=0&&r<60?r:0}
 function secondsToBoundary(save){
  const c=now(save);if(!c)return null;
  const next=[480,720,1020,1320,1440].find(m=>m>c.minuteOfDay)||1440;
  return (next-c.minuteOfDay)*60-remainder(save);
 }
 function secondsUntilMorning(save){
  const c=now(save);if(!c)return null;
  return ((c.minuteOfDay<480?480:1920)-c.minuteOfDay)*60-remainder(save);
 }
 function nextCivilDay(iso){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(iso||''))throw Error('Valid civil date required');
  const d=new Date(iso+'T00:00:00Z');if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==iso)throw Error('Invalid civil date');
  return new Date(+d+86400000).toISOString().slice(0,10);
 }
 function environment(save){
  const c=now(save);if(!c)return null;
  const weather=typeof save.turnConditions?.weather==='string'?save.turnConditions.weather:'Unknown';
  const s=sky?.snapshot?.(c.iso,weather);
  return Object.freeze({date:c.date,iso:c.iso,time:c.time,weather,
   sunlight:s?.sunlight??null,moonPhase:s?.moonPhase??null,eclipse:s?.eclipse??null,
   sunrise:s?.sunrise??null,sunset:s?.sunset??null});
 }
 const api=Object.freeze({now,rate,available,canSpend,debit,advance,secondsToBoundary,secondsUntilMorning,nextCivilDay,environment});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WASHINGTON_TIME=api;
})(typeof window!=='undefined'?window:globalThis);
