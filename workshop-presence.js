/* Capital & Consequence: read-only, minute-accurate location projection for Sullivan.
 * The NPC calendar makes intentions at broad slots; this overlays true arrival
 * and departure without rescheduling anyone or creating a second world clock.
 */
(function(root){
 'use strict';
 const ops=typeof module==='object'&&module.exports?require('./workshop-operations.js'):root.FE_WORKSHOP_OPERATIONS;
 function position(save,actor,id,clock){
  if(!actor||id!=='foremanSullivan'||!save?.componentWorks||!ops||!clock)return actor;
  if(actor.locationId!=='factory'||actor.status!=='present')return actor;
  // Arrival/absence projection concerns production work, never Sullivan's
  // existing privately rented bedroom on factory grounds.
  if(actor.roomId==='workers-lodging')return actor;
  const day=new Date(clock.date+'T12:00:00Z').getUTCDay();
  const a=ops.arrival(save,clock.date);
  if(day<1||day>5||a.absent||clock.minuteOfDay<a.arrivalMinute||clock.minuteOfDay>=1020)
   return {...actor,locationId:null,roomId:null,status:'off-duty',activity:a.absent?'absent today':'not at the workshop'};
  return actor;
 }
 const api=Object.freeze({position});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WORKSHOP_PRESENCE=api;
})(typeof window!=='undefined'?window:globalThis);
