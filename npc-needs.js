/* Capital & Consequence: private per-person energy and needs.
 * Evaluates elapsed SAVED world minutes only. It never advances the clock,
 * touches money, creates a residence or asserts an unseen event occurred.
 * More than 14 days of a single jump is deliberately approximated; complete
 * long-range social/economic reconciliation is a separate roadmap task.
 */
(function(root){
 'use strict';
 const clamp=value=>Math.max(0,Math.min(100,Number.isFinite(value)?value:50));
 const HORIZON=14*1440;
 function ensure(agent){
  if(!agent||typeof agent!=='object')throw Error('Resident state required');
  let needs=agent.needs;
  if(!needs||needs.version!==1){
   needs={version:1,lastMinute:null,energy:clamp(Number.isFinite(agent.energy)?agent.energy:80),
    hunger:25,mood:65,restHours:0,activeHours:0,lastMealDay:null,unresolvedMinutes:0,dailyHistory:[]};
   agent.needs=needs;
  }
  for(const key of ['energy','hunger','mood'])needs[key]=clamp(needs[key]);
  for(const key of ['restHours','activeHours','unresolvedMinutes'])
   if(!Number.isFinite(needs[key])||needs[key]<0)needs[key]=0;
  if(!Array.isArray(needs.dailyHistory))needs.dailyHistory=[];
  needs.dailyHistory=needs.dailyHistory.filter(r=>r&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&
   Number.isSafeInteger(r.activeMinutes)&&Number.isSafeInteger(r.restMinutes)).slice(-14);
  agent.energy=needs.energy;
  return needs;
 }
 function settle(agent,definition,worldMinute,weekly){
  if(!definition?.id||!weekly?.atMinute||!Number.isSafeInteger(worldMinute))
   throw Error('Saved time and a named resident schedule required');
  const needs=ensure(agent),previous=needs.lastMinute;
  if(previous===null){needs.lastMinute=worldMinute;return {changed:true,elapsed:0,approximated:0,needs}}
  if(!Number.isSafeInteger(previous))throw Error('Invalid saved resident needs time');
  if(worldMinute<=previous)return {changed:false,elapsed:0,approximated:0,needs};
  const elapsed=worldMinute-previous,from=Math.max(previous,worldMinute-HORIZON);
  needs.unresolvedMinutes+=from-previous;
  let day=needs.lastMealDay;
  // Hour-aligned boundaries ensure that 59-minute advances and one-hour
  // advances settle identically, even through midnight and weekends.
  // Daily meal entries are private physiological recovery, not market receipts.
  for(let minute=from;minute<worldMinute;){
   const until=Math.min(worldMinute,(Math.floor(minute/60)+1)*60);
   const hours=(until-minute)/60,d=new Date(minute*60000);
   const weekday=d.getUTCDay(),clockMinute=d.getUTCHours()*60+d.getUTCMinutes();
   const plan=weekly.atMinute(definition,weekday,clockMinute);
   const active=!!plan.locationId,night=clockMinute>=1320||clockMinute<480;
   const rest=!active&&night;
   needs.energy=clamp(needs.energy+(rest?7:active?-3.5:1.25)*hours);
   needs.hunger=clamp(needs.hunger+(rest?1.25:active?2.75:2)*hours);
   if(rest)needs.restHours+=hours;
   if(active)needs.activeHours+=hours;
   const today=d.toISOString().slice(0,10);
   let record=needs.dailyHistory.find(r=>r.date===today);
   if(!record){
    record={date:today,activeMinutes:0,restMinutes:0,otherMinutes:0,mealPeriods:0};
    needs.dailyHistory.push(record);
    if(needs.dailyHistory.length>14)needs.dailyHistory.shift();
   }
   const duration=until-minute;
   if(rest)record.restMinutes+=duration;
   else if(active)record.activeMinutes+=duration;
   else record.otherMinutes+=duration;
   if(/\bmeal\b/i.test(String(plan.activity||''))&&day!==today){
    needs.hunger=clamp(needs.hunger-28);
    record.mealPeriods++;
    day=today;
   }
   // Private mood reflects exhaustion/comfort, never demographic identity.
   const shift=rest?1.4:active?-.55:.35;
   const strain=(needs.energy<30?1.8:0)+(needs.hunger>75?1.1:0);
   needs.mood=clamp(needs.mood+(shift-strain)*hours);
   minute=until;
  }
  needs.lastMinute=worldMinute;
  needs.lastMealDay=day;
  needs.restHours=Math.round(needs.restHours*100)/100;
  needs.activeHours=Math.round(needs.activeHours*100)/100;
  needs.energy=Math.round(needs.energy*100)/100;
  needs.hunger=Math.round(needs.hunger*100)/100;
  needs.mood=Math.round(needs.mood*100)/100;
  agent.energy=needs.energy;
  return {changed:true,elapsed,approximated:from-previous,needs};
 }
 const api=Object.freeze({ensure,settle});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_NEEDS=api;
})(typeof window!=='undefined'?window:globalThis);
