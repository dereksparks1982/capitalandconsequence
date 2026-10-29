/* Capital & Consequence: saved, deterministic 1878 shift/repair incidents.
 * No offline progress, clock creation, phantom staff or company cash mutation.
 */
(function(root){
 'use strict';
 const hash=value=>{
  let h=2166136261;
  for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
  return h>>>0;
 };
 function ensure(save){
  if(!save?.componentWorks)throw Error('1878 workshop required');
  let ops=save.workshopOperations;
  if(!ops){ops={version:1,hold:null,repairReceipts:{},lastIncident:null,incidentHistory:[]};save.workshopOperations=ops}
  if(!Array.isArray(ops.incidentHistory))ops.incidentHistory=[];
  if(ops.version!==1||!ops.repairReceipts||typeof ops.repairReceipts!=='object')throw Error('Damaged workshop incidents');
  return ops;
 }
 function arrival(save,date){
  const seed=save?.npcSimulation?.seed||0;
  const roll=hash('attendance|'+seed+'|'+date);
  // Rare absence, occasional delay. A calendar date always gives the same
  // result for this campaign, even when opening menus or reloading.
  const absent=roll%47===0;
  const delay=absent?0:(roll%11===0?(15+Math.floor(roll/11)%4*15):0);
  return {date,absent,delayMinutes:delay,arrivalMinute:540+delay,
   reason:absent?'Sullivan is absent today.':delay?'Sullivan has been delayed by personal circumstances.':''};
 }
 function availability(save,clock){
  const ops=ensure(save);
  const day=clock?.date,minute=clock?.minuteOfDay;
  if(!day||!Number.isFinite(minute))return {ok:false,reason:'Clock unavailable'};
  const a=arrival(save,day);
  if(ops.hold)return {ok:false,reason:'Production stopped: '+ops.hold.description+'. Charlie must authorize repair.',hold:ops.hold,attendance:a};
  if(a.absent)return {ok:false,reason:'Sullivan is absent today.',attendance:a};
  if(minute<a.arrivalMinute)return {ok:false,reason:'Sullivan has not arrived. Expected '+(a.arrivalMinute===540?'9:00 AM':(Math.floor(a.arrivalMinute/60)%12||12)+':'+String(a.arrivalMinute%60).padStart(2,'0')+' AM')+'.',attendance:a};
  return {ok:true,attendance:a};
 }
 function afterAssembly(save,receipt,productId,day){
  const ops=ensure(save);
  if(!receipt||typeof receipt.token!=='string'||!receipt.token)throw Error('Assembly receipt required');
  const existing=ops.incidentHistory.find(i=>i.token===receipt.token);
  if(existing)return {...existing,repeated:true};
  if(ops.hold)return null; // No new assembly incident while production is stopped.
  const n=hash('workshop-fault|'+(save.npcSimulation?.seed||0)+'|'+receipt.token+'|'+day);
  if(n%9!==0)return null;
  const description=productId==='telegraph-relay'?'Winder gearing seized':'Bench vise or fixture failed';
  const assistantFixed=(Math.floor(n/9)%3===0);
  const incident={date:day,token:receipt.token,description,
   assistantTried:true,assistantFixed};
  ops.lastIncident=incident;
  if(!ops.incidentHistory.some(i=>i.token===incident.token))ops.incidentHistory.push(incident);
  if(ops.incidentHistory.length>32)ops.incidentHistory.splice(0,ops.incidentHistory.length-32);
  if(!assistantFixed)ops.hold={date:day,description,sourceToken:receipt.token};
  return incident;
 }
 function repair(save,token,clock,spend,finishAtBell){
  const ops=ensure(save);
  if(ops.repairReceipts[token])return {...ops.repairReceipts[token],repeated:true};
  if(!ops.hold)return {ok:false,reason:'No outstanding workshop breakdown'};
  const minutes=45,costCents=30,seconds=minutes*60;
  const remaining=(1020-clock.minuteOfDay)*60-(save.worldCalendarRemainder||0);
  if(!Number.isSafeInteger(remaining)||remaining<seconds)
   return {ok:false,reason:'Not enough time before 5 PM to repair equipment'};
  const money=Math.round(save.companyCash*100);
  if(!Number.isSafeInteger(money)||money<costCents)return {ok:false,reason:'Not enough company cash for repair parts'};
  const atBell=remaining===seconds;
  if(atBell&&typeof finishAtBell!=='function')
   return {ok:false,reason:'Closing bell requires payroll callback'};
  if(typeof spend!=='function'||spend(seconds,true,atBell)!==seconds)
   return {ok:false,reason:'Player clock could not complete repair'};
  const incident=ops.hold;
  ops.hold=null;
  save.companyCash=(money-costCents)/100;
  save.componentWorks.cashCents=money-costCents;
  save.lastExpenses=Math.round((save.lastExpenses||0)*100+costCents)/100;
  const receipt={ok:true,kind:'repair',token,elapsedSeconds:seconds,costCents,incident};
  ops.repairReceipts[token]=receipt;
  ops.lastRepair={token,date:clock.date,costCents,elapsedMinutes:minutes,
   incidentToken:incident.sourceToken};
  if(atBell&&finishAtBell()!==true)throw Error('Closing bell repair transaction incomplete');
  return {...receipt,repeated:false};
 }
 const api=Object.freeze({ensure,arrival,availability,afterAssembly,repair});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WORKSHOP_OPERATIONS=api;
})(typeof window!=='undefined'?window:globalThis);
