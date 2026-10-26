/* Federal Electric: provisional public NPC itinerary, v0.6.51.
 * Planning uses the persisted world minute, never wall time or secret NPC state.
 * Public routines are approximate, not guarantees of future attendance.
 */
(function(root){
 'use strict';
 const clock=typeof module==='object'&&module.exports?require('./world-clock.js'):root.FE_WORLD_CLOCK;
 const weekly=typeof module==='object'&&module.exports?require('./npc-weekly-schedule.js'):root.FE_NPC_WEEKLY;
 const periods=weekly.segments;
 function publicPlace(def,weekday,slot){
  if(!def||!Array.isArray(def.places)||!Number.isSafeInteger(weekday)||weekday<0||weekday>6)
   throw Error('NPC public routine required');
  return weekly.at(def,weekday,slot).locationId;
 }
 function windows(def,world,days=8){
  if(!Number.isInteger(days)||days<1||days>14)throw Error('Invalid public horizon');
  const now=clock.calendar(world),day=clock.parseMinute(now.date+'T00:00'),out=[];
  // Include yesterday so an overnight (10 PM–8 AM) period is detected after midnight.
  for(let offset=-1;offset<days;offset++){
   const at=day+offset*1440,weekday=new Date(at*60000).getUTCDay();
   for(const p of periods){
    const plan=weekly.atMinute(def,weekday,p.from);
    if(!plan.locationId)continue;
    const start=at+p.from,end=at+p.until;
    if(end<=world.worldMinute)continue;
    out.push({id:def.id,locationId:plan.locationId,activity:plan.activity||'visiting',
     from:start,until:end,iso:clock.formatMinute(start),
     untilIso:clock.formatMinute(end),ongoing:world.worldMinute>=start});
   }
  }
  return out.sort((a,b)=>a.from-b.from||a.until-b.until);
 }
 function next(def,save){
  if(!save||save.worldCalendarStatus!=='ready'||!save.worldCalendar)return null;
  try{return windows(def,save.worldCalendar)[0]||null}catch(e){return null}
 }
 function label(minute){
  const iso=clock.formatMinute(minute),d=new Date(iso+':00Z');
  const h=d.getUTCHours(),m=d.getUTCMinutes();
  return iso.slice(0,10)+' · '+(h%12||12)+':'+String(m).padStart(2,'0')+(h>=12?' PM':' AM');
 }
 const api=Object.freeze({publicPlace,windows,next,label});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_ITINERARY=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
