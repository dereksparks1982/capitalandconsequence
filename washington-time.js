/* Capital & Consequence v0.6.69: one authoritative saved 24-hour timestamp.
 * This module is a thin integration of existing world-clock/calendar-bridge/
 * time-transactions + astronomy. The old factory's phase/time budget remains
 * transitional, NOT a competing source of calendar dates for NPCs.
 */
(function(root){
 'use strict';
 const bridge=typeof module==='object'&&module.exports?require('./calendar-bridge.js'):root.FE_CALENDAR_BRIDGE;
 const tx=typeof module==='object'&&module.exports?require('./time-transactions.js'):root.FE_TIME_TX;
 const sky=typeof module==='object'&&module.exports?require('./sky-cycle.js'):root.FE_WASHINGTON_SKY;
 if(!bridge||!tx)throw Error('World calendar bridge and time transactions required');
 const UTC_DAY_MS=86400000;
 function now(save){
  const c=save?.worldCalendarStatus==='ready'?bridge.moment(save):null;
  if(!c)return null;
  return Object.freeze({iso:c.iso,date:c.date,weekday:c.weekday,minuteOfDay:c.minuteOfDay,
   time:bridge.label(save)});
 }
 function advance(save,seconds,kind='action',token=null){
  // Only FE_TIME_TX mutates worldCalendar for timed actions and passive ticks.
  return tx.advance(save,seconds,kind,token);
 }
 function nextCivilDay(iso){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(iso||''))throw Error('Valid campaign date required');
  const d=new Date(iso+'T00:00:00Z');
  if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==iso)throw Error('Invalid civil date');
  return new Date(+d+UTC_DAY_MS).toISOString().slice(0,10);
 }
 function handoff(save,stage,accountingDate){
  // The legacy factory's report still has its own accounting date. A phase
  // handoff explicitly moves the *world* to the next real clock boundary.
  // No backward jumps, no invented unobserved NPC meetings.
  if(!['close-business','close-night','new-day'].includes(stage))throw Error('Unknown clock handoff');
  const c=now(save);
  if(!c)return {status:'unmapped',iso:null};
  const chosen=stage==='close-business'?accountingDate:
   stage==='close-night'?nextCivilDay(accountingDate):accountingDate;
  const minute=stage==='close-business'?17*60:8*60;
  return bridge.beginTurn(save,chosen,minute);
 }
 function environment(save){
  const c=now(save);if(!c)return null;
  const wx=typeof save?.turnConditions?.weather==='string'?save.turnConditions.weather:'Unknown';
  const s=sky?.snapshot?.(c.iso,wx);
  return Object.freeze({date:c.date,iso:c.iso,time:c.time,weather:wx,
   sunlight:s?s.sunlight:null,moonPhase:s?s.moonPhase:null,eclipse:s?s.eclipse:null,
   sunrise:s?s.sunrise:null,sunset:s?s.sunset:null});
 }
 const api=Object.freeze({now,advance,handoff,environment,nextCivilDay});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WASHINGTON_TIME=api;
})(typeof window!=='undefined'?window:globalThis);
