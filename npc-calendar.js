/* v0.6.49: provisional saved-calendar NPC periods, no wall time. */
(function(root){
 'use strict';
 const NAMES=Object.freeze(['early-business','late-business','early-night','late-night']);
 function slot(t){
  if(!Number.isSafeInteger(t)||t<0||t>=1440)throw Error('Invalid NPC minute');
  return t>=480&&t<720?0:t>=720&&t<1020?1:t>=1020&&t<1320?2:3;
 }
 function signature(c){
  if(!c||!/^\d{4}-\d{2}-\d{2}$/.test(c.date||'')||!Number.isSafeInteger(c.weekday)||
   c.weekday<0||c.weekday>6)throw Error('Invalid NPC calendar date');
  return c.date+'|'+slot(c.minuteOfDay);
 }
 function at(c,d){
  const key=signature(c),n=slot(c.minuteOfDay);
  if(!d||!Array.isArray(d.places)||!Array.isArray(d.activities))throw Error('NPC definition required');
  let locationId=d.places[n]||null;
  // Provisional workweek only. Absence does not disclose private whereabouts.
  if((c.weekday===0||c.weekday===6)&&n<2&&
   (d.id==='foremanSullivan'||d.id==='inspectorHayes'))locationId=null;
  return {key,slot:n,name:NAMES[n],locationId,
   activity:locationId?(d.activities[n]||'occupied'):null};
 }
 const api=Object.freeze({slot,signature,at});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_CALENDAR=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
