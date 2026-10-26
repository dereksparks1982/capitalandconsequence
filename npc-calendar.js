/* Saved-calendar NPC presence uses minute-scale windows; four bounded financial periods. */
(function(root){
 'use strict';
 const weekly=typeof module==='object'&&module.exports?require('./npc-weekly-schedule.js'):root.FE_NPC_WEEKLY;
 const NAMES=Object.freeze(['early-business','late-business','early-night','late-night']);
 function slot(t){
  if(!Number.isSafeInteger(t)||t<0||t>=1440)throw Error('Invalid NPC minute');
  return t>=480&&t<720?0:t>=720&&t<1020?1:t>=1020&&t<1320?2:3;
 }
 function businessDay(c){
  if(!c||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(c.date||'')||
   !Number.isSafeInteger(c.weekday)||c.weekday<0||c.weekday>6)throw Error('Invalid NPC calendar date');
  const segment=weekly.segmentAt(c.minuteOfDay);
  if(!segment.priorDay)return c.date;
  const today=Date.parse(c.date+'T00:00:00Z');
  if(!Number.isFinite(today))throw Error('Invalid saved calendar date');
  return new Date(today-86400000).toISOString().slice(0,10);
 }
 function signature(c){
  const day=businessDay(c),segment=weekly.segmentAt(c.minuteOfDay);
  const base=day+'|'+segment.slot;
  return [600,750,1170].includes(segment.from)?base+'@'+segment.from:base;
 }
 function at(c,d){
  const key=signature(c);
  if(!d||!Array.isArray(d.places)||!Array.isArray(d.activities))throw Error('NPC definition required');
  const plan=weekly.atMinute(d,c.weekday,c.minuteOfDay),day=businessDay(c);
  const open=!(d.availableFrom&&c.date<d.availableFrom)&&!(d.availableUntil&&c.date>d.availableUntil);
  return {key,slot:plan.slot,name:NAMES[plan.slot],locationId:open?plan.locationId:null,
   activity:open?plan.activity:null,weekday:plan.weekday,day,
   economyKey:day+'|'+plan.slot};
 }
 const api=Object.freeze({slot,signature,at});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_CALENDAR=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
