/* Capital & Consequence v0.6.63: Edmund Wardman's entry orderly duties.
 * Ordinary institution work, not ownership, nursing certification or access
 * to confidential medical diagnoses. Pay only when ward work is reported.
 */
(function(root){
 'use strict';
 const VENUE='blackwoodAsylum',STATION='orderly-station',WARD='patient-ward',
  WAGE_CENTS=35,MAX_ASSIGNMENTS=3;
 const ASSIGNMENTS=Object.freeze([
  Object.freeze({id:'linen',title:'Fresh ward linens',description:'The ward attendant requests a routine linen change.',
   choices:Object.freeze([
    {id:'replace',label:'Deliver clean linens',result:'Replaced linens and entered the service in the ward register.'},
    {id:'supervise',label:'Coordinate the supply handoff',result:'Coordinated a linen delivery with ward staff.'}
   ])}),
  Object.freeze({id:'meal',title:'Meal service assistance',description:'The ward staff need help delivering a prepared meal tray.',
   choices:Object.freeze([
    {id:'carry',label:'Carry the meal with the attendant',result:'Assisted ward staff with ordinary meal service.'},
    {id:'notify',label:'Notify the responsible nurse before delivery',result:'Coordinated the meal delivery with the responsible nurse.'}
   ])}),
  Object.freeze({id:'supplies',title:'Routine supply shortage',description:'Staff report a missing item from their everyday care supplies.',
   choices:Object.freeze([
    {id:'inventory',label:'Verify and record the supply count',result:'Checked the ward supply count and recorded the shortage.'},
    {id:'request',label:'Request supplies through the orderly station',result:'Submitted the needed supply request through ordinary channels.'}
   ])}),
  Object.freeze({id:'visitation',title:'Visitor asking for directions',description:'A visitor needs directions to the public reception for an inquiry.',
   choices:Object.freeze([
    {id:'escort',label:'Escort the visitor to the public entrance',result:'Directed a visitor to the authorized reception desk.'},
    {id:'staff',label:'Ask reception staff to assist',result:'Referred the visitor to reception without exposing ward records.'}
   ])}),
  Object.freeze({id:'quiet',title:'Keep the ward clear',description:'A corridor is obstructed by supplies during the routine round.',
   choices:Object.freeze([
    {id:'clear',label:'Help clear the corridor safely',result:'Helped remove the corridor obstruction with ward staff.'},
    {id:'report',label:'Ask the attendant to coordinate clearance',result:'Notified the responsible attendant and kept access clear.'}
   ])})
 ]);
 const BY_ID=new Map(ASSIGNMENTS.map(a=>[a.id,a]));
 const hash=value=>{let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
 function ensure(save){
  if(!save||typeof save!=='object')throw Error('An actual character save is required');
  if(!save.orderlyDuty||save.orderlyDuty.version!==1||!Array.isArray(save.orderlyDuty.logs))
   save.orderlyDuty={version:1,nextId:1,pending:null,completedByDate:{},totalAssignments:0,
    wagesEarnedCents:0,logs:[],lastAction:null};
  return save.orderlyDuty;
 }
 function access(save,stage,locationId,roomId){
  if(save?.characterRoute!=='wardman')return {ok:false,reason:'This is Edmund Wardman’s ordinary asylum employment.'};
  if(save.paused||save.phase==='report')return {ok:false,reason:'The game clock must be active.'};
  if(locationId!==VENUE)return {ok:false,reason:'Duty is carried out at District Asylum.'};
  if(stage==='assign'&&(save.phase!=='day'||roomId!==STATION))
   return {ok:false,reason:'Receive assignments at the orderly station during the Business Day.'};
  if(stage==='attend'&&(save.phase!=='day'||roomId!==WARD))
   return {ok:false,reason:'Ordinary care service requires the patient ward during the Business Day.'};
  if(stage==='file'&&roomId!==STATION)
   return {ok:false,reason:'Return to the orderly station to file the service entry.'};
  return {ok:true};
 }
 function assign(save,{locationId,roomId,date,profileId,spentSeconds}){
  const allow=access(save,'assign',locationId,roomId);if(!allow.ok)return allow;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||!profileId||spentSeconds!==300)
   return {ok:false,reason:'A real five-minute assignment review is required.'};
  const d=ensure(save);
  if(d.pending)return {ok:false,reason:'Complete and file the existing ward assignment first.'};
  if((d.completedByDate[date]||0)>=MAX_ASSIGNMENTS)return {ok:false,reason:'You have completed today’s assigned rounds.'};
  const id=d.nextId++,task=ASSIGNMENTS[hash(profileId+'|'+date+'|'+id)%ASSIGNMENTS.length];
  d.pending={id:'WARD-'+String(id).padStart(4,'0'),date,taskId:task.id,status:'assigned'};
  d.lastAction='Received an ordinary ward assignment.';
  return {ok:true,assignment:{...d.pending},task};
 }
 function attend(save,{locationId,roomId,choiceId,spentSeconds}){
  const allow=access(save,'attend',locationId,roomId);if(!allow.ok)return allow;
  const d=ensure(save),p=d.pending,task=BY_ID.get(p?.taskId);
  if(!p||p.status!=='assigned'||!task)return {ok:false,reason:'No assigned ward task is awaiting attention.'};
  const response=task.choices.find(c=>c.id===choiceId);
  if(!response||spentSeconds!==600)return {ok:false,reason:'Choose a valid ten-minute ward response.'};
  p.status='awaiting-report';p.result=response.result;p.choiceId=choiceId;
  d.lastAction=response.result+' Return to the station to record it.';
  return {ok:true,assignment:{...p},result:response.result};
 }
 function file(save,{locationId,roomId,spentSeconds}){
  const allow=access(save,'file',locationId,roomId);if(!allow.ok)return allow;
  const d=ensure(save),p=d.pending;
  if(!p||p.status!=='awaiting-report'||spentSeconds!==300)
   return {ok:false,reason:'Only completed work can be filed after a five-minute report.'};
  const log={...p,status:'reported',wageCents:WAGE_CENTS};
  d.logs.push(log);if(d.logs.length>80)d.logs.shift();
  d.pending=null;d.totalAssignments++;
  d.completedByDate[p.date]=(d.completedByDate[p.date]||0)+1;
  for(const old of Object.keys(d.completedByDate).sort().slice(0,-60))delete d.completedByDate[old];
  d.wagesEarnedCents+=WAGE_CENTS;
  save.personalCash=Math.round(((Number.isFinite(save.personalCash)?save.personalCash:0)*100+WAGE_CENTS))/100;
  d.lastAction=p.result+' Filing completed and ordinary wage received.';
  return {ok:true,log,wageCents:WAGE_CENTS};
 }
 function task(save){return BY_ID.get(ensure(save).pending?.taskId)||null}
 function summary(save){const d=ensure(save);return {totalAssignments:d.totalAssignments,
  wagesEarnedCents:d.wagesEarnedCents,pending:d.pending?{...d.pending}:null,
  completedByDate:{...d.completedByDate},logs:d.logs.map(x=>({...x})),lastAction:d.lastAction};}
 const api=Object.freeze({VENUE,STATION,WARD,WAGE_CENTS,MAX_ASSIGNMENTS,ASSIGNMENTS,
  ensure,access,assign,attend,file,task,summary});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_ORDERLY_DUTY=api;
})(typeof window!=='undefined'?window:globalThis);
