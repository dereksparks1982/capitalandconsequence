/* Federal Electric weekly NPC/venue appointments, v0.6.44-dev.
 * Consumes the offline 24-hour world clock. No invented canonical hours here.
 * Callers supply verified/approved schedules; the old runtime has not switched.
 */
(function(root){
 'use strict';
 const clock=typeof module==='object'&&module.exports?require('./world-clock.js'):root.FE_WORLD_CLOCK;
 if(!clock)throw new Error('World clock must load before NPC daybook');
 const okId=v=>typeof v==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(v);
 function verify(plan){
  if(!Array.isArray(plan))throw new Error('Appointment schedule list required');
  for(const r of plan){
   if(!r||!okId(r.id)||!okId(r.locationId)||!Array.isArray(r.weekdays)||!r.weekdays.length||
      r.weekdays.some(d=>!Number.isInteger(d)||d<0||d>6)||
      !Number.isInteger(r.from)||!Number.isInteger(r.until)||
      r.from<0||r.from>=1440||r.until<0||r.until>1440||r.from===r.until||
      typeof r.activity!=='string')
    throw new Error('Invalid explicit appointment window');
  }
  return plan;
 }
 function weekdayAt(midnightMinute){return new Date(midnightMinute*60000).getUTCDay()}
 function activeRule(world,r){
  const c=clock.calendar(world),overnight=r.until<r.from;
  if(!overnight)return r.weekdays.includes(c.weekday)&&c.minuteOfDay>=r.from&&c.minuteOfDay<r.until;
  // Late evening of an approved weekday OR its early following morning.
  return r.weekdays.includes(c.weekday)&&c.minuteOfDay>=r.from||
   r.weekdays.includes((c.weekday+6)%7)&&c.minuteOfDay<r.until;
 }
 function at(world,plan){
  verify(plan);
  return plan.filter(r=>activeRule(world,r)).map(r=>({...r,weekdays:[...r.weekdays]}));
 }
 function next(world,plan,locationId){
  verify(plan);
  if(!okId(locationId))throw new Error('Location ID required');
  const eligible=plan.filter(r=>r.locationId===locationId);
  if(!eligible.length)return null;
  const ongoing=eligible.find(r=>activeRule(world,r));
  if(ongoing)return {id:ongoing.id,at:world.worldMinute,iso:clock.formatMinute(world.worldMinute),ongoing:true};
  const dayStart=clock.parseMinute(clock.calendar(world).date+'T00:00');
  let first=null;
  for(let days=0;days<=7;days++){
   const midnight=dayStart+days*1440,weekday=weekdayAt(midnight);
   for(const r of eligible){
    const at=midnight+r.from;
    if(!r.weekdays.includes(weekday)||at<world.worldMinute)continue;
    if(!first||at<first.at)first={id:r.id,at,iso:clock.formatMinute(at),ongoing:false};
   }
  }
  return first;
 }
 const api=Object.freeze({verify,at,next});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_DAYBOOK=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
