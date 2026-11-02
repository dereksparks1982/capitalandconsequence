/* District Asylum: real orderly supply requests and daily service handovers.
 * Logs only actually filed ward assignments. Does not issue diagnoses,
 * patient identities, managerial approvals, or magically replenish stock.
 */
(function(root){
'use strict';
const VENUE='blackwoodAsylum',STATION='orderly-station';
const copy=x=>JSON.parse(JSON.stringify(x));
const blank=()=>({version:1,service:{},requests:{},handover:{},receipts:{}});
function date(d){
 if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return null;
 const t=new Date(d+'T12:00:00Z');return Number.isFinite(t.getTime())&&t.toISOString().slice(0,10)===d?t.getTime():null;
}
function read(save){
 const store=save?.wardServiceRegister||blank();
 if(store.version!==1||!store.service||!store.requests||!store.handover||!store.receipts)
  throw Error('Damaged orderly service journal. Do not discard previously filed duty.');
 return copy(store);
}
function ensure(save){if(!save.wardServiceRegister)save.wardServiceRegister=blank();read(save);return save.wardServiceRegister}
function record(save,log){
 if(save?.characterRoute!=='wardman'||!log||log.status!=='reported'||
  !/^WARD-[0-9]{4,}$/.test(log.id||'')||date(log.date)===null)
  return {ok:false,reason:'No verifiable filed asylum ward assignment.'};
 const store=ensure(save);
 if(store.service[log.id])return {ok:true,repeated:true};
 store.service[log.id]={id:log.id,date:log.date,taskId:log.taskId,
  choiceId:log.choiceId,result:log.result,wageCents:log.wageCents};
 if(log.taskId==='supplies'&&log.choiceId==='request'&&!store.requests['SUP-'+log.id]){
  const id='SUP-'+log.id;
  store.requests[id]={id,sourceId:log.id,created:log.date,
   description:'Unspecified everyday ward supplies reported missing',
   status:'awaiting-stores',followedUp:null,escalated:null,received:false,
   events:[{date:log.date,kind:'filed-request',source:log.id}]};
 }
 return {ok:true};
}
function preview(save,{action,id,date:day,locationId,roomId}){
 const now=date(day);if(now===null||!['handover','followup','escalate'].includes(action))
  return {ok:false,reason:'Invalid staff record or date.'};
 if(save?.characterRoute!=='wardman'||save?.wardmanStanding?.status==='patient'||
  save.paused||save.phase==='report'||locationId!==VENUE||roomId!==STATION)
  return {ok:false,reason:'Only Edmund working at the District Asylum orderly station may submit this record.'};
 const book=read(save);
 if(action==='handover'){
  const service=Object.values(book.service).filter(x=>x.date===day);
  const duty=save.orderlyDuty,realCount=duty?.completedByDate?.[day]||0;
  if(realCount<3||service.length!==realCount||duty?.pending)
   return {ok:false,reason:'Complete and file all three ordinary assigned rounds before daily handover.'};
  if(book.handover[day])return {ok:false,reason:'Today’s shift handover has already been recorded.'};
  return {ok:true,seconds:300};
 }
 const req=book.requests[id];
 if(!req)return {ok:false,reason:'Only requests from Edmund’s actually filed supply duties can be followed up.'};
 if(now<=date(req.created))return {ok:false,reason:'A supply request cannot be followed up on its original filing day.'};
 if(action==='followup'){
  if(req.followedUp)return {ok:false,reason:'The supply office has already received a follow-up.'};
  return {ok:true,seconds:300};
 }
 if(!req.followedUp)return {ok:false,reason:'Follow up once before escalating a supply request.'};
 if(req.escalated)return {ok:false,reason:'This supply request was already referred to the supervisor.'};
 if(now<date(req.created)+2*86400000)return {ok:false,reason:'Allow at least two days before supervisor escalation.'};
 return {ok:true,seconds:300};
}
function transact(save,{action,id,date:day,locationId,roomId,spentSeconds,token}){
 if(typeof token!=='string'||!/^[a-z0-9][a-z0-9:_-]{0,99}$/i.test(token))
  return {ok:false,reason:'Stable shift register receipt required.'};
 const cached=save?.wardServiceRegister?.receipts?.[token];if(cached)return {...copy(cached),repeated:true};
 const allowed=preview(save,{action,id,date:day,locationId,roomId});
 if(!allowed.ok)return allowed;
 if(spentSeconds!==300)return {ok:false,reason:'Station paperwork requires five charged game minutes.'};
 const book=ensure(save);let message,record=null;
 if(action==='handover'){
  const services=Object.values(book.service).filter(x=>x.date===day);
  const requests=Object.values(book.requests).filter(x=>x.created===day).map(x=>x.id);
  record={date:day,services:services.map(x=>x.id),supplyRequests:requests,
   status:'submitted-to-ward-supervisor',reviewed:false,managerDecision:null};
  book.handover[day]=record;
  message='Submitted '+services.length+' verified ward-service entries to the supervising staff.'+
   (requests.length?' '+requests.length+' unresolved supply request(s) attached.':'');
 }else{
  const request=book.requests[id],event={date:day,kind:action,source:token};
  request.events.push(event);
  if(action==='followup'){request.followedUp=day;request.status='follow-up-filed';
   message='Asked institutional stores about '+id+'; no delivery has been confirmed.';}
  else {request.escalated=day;request.status='referred-to-supervisor';
   message='Escalated '+id+' for a supervisor’s attention; the missing stock remains unverified.';}
  record={requestId:id,status:request.status};
 }
 const receipt={ok:true,kind:'orderly-'+action,date:day,token,id:id||null,
  record,message,elapsedSeconds:300};
 book.receipts[token]=receipt;
 if(Array.isArray(save.notes))save.notes.push({date:day,source:'District Asylum ordinary ward service',text:message});
 return {...copy(receipt),repeated:false};
}
const api=Object.freeze({read,record,preview,transact});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WARD_SERVICE_REGISTER=api;
})(typeof window!=='undefined'?window:globalThis);
