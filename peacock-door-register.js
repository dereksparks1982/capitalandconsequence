/* Le Paon d'Or: saved door register and management reporting for Eli Crowe.
 * No imaginary guests, criminal affiliation, free tips, or instant promotion.
 */
(function(root){
'use strict';
const VENUE='secondNightclub',ROOM='doorman-post';
const copy=o=>JSON.parse(JSON.stringify(o));
const blank=()=>({version:1,events:[],parcels:{},shiftReports:{},receipts:{}});
const validDate=d=>{
 if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;
 const v=new Date(d+'T12:00:00Z');
 return Number.isFinite(v.getTime())&&v.toISOString().slice(0,10)===d;
};
function read(save){
 const s=save?.peacockDoorRegister||blank();
 if(s.version!==1||!Array.isArray(s.events)||!s.parcels||!s.shiftReports||!s.receipts)
  throw Error('Invalid Golden Peacock door book; never discard earlier work.');
 return copy(s);
}
function ensure(save){
 if(!save.peacockDoorRegister)save.peacockDoorRegister=blank();
 read(save);return save.peacockDoorRegister;
}
function record(save,log){
 if(save?.characterRoute!=='criminal'||!log||log.status!=='completed'||
  !validDate(log.date)||typeof log.id!=='string'||!log.id.startsWith('DOOR-'))
  return {ok:false,reason:'No completed Golden Peacock shift contact.'};
 const book=ensure(save);
 if(book.events.some(x=>x.id===log.id))return {ok:true,repeated:true};
 const item={id:log.id,date:log.date,kind:log.typeId,choice:log.choiceId,
  wageCents:log.wageCents,statement:log.result};
 book.events.push(item);
 if(book.events.length>160)book.events.splice(0,book.events.length-160);
 if(log.typeId==='coat-parcel'&&log.choiceId==='receipt'&&!book.parcels[log.id]){
  book.parcels[log.id]={id:'PARCEL-'+log.id,contactId:log.id,date:log.date,
   description:'Wrapped delivery addressed to Le Paon d’Or',status:'held-at-door',
   receivedBy:'Elias Crowe',transferredTo:null,
   chain:[{date:log.date,place:VENUE,kind:'door-receipt',holder:'Elias Crowe',source:log.id}]};
 }
 return {ok:true,event:copy(item)};
}
function preview(save,{kind,parcelId,date,locationId,roomId}){
 if(!['handover','report'].includes(kind)||!validDate(date))
  return {ok:false,reason:'Invalid door book instruction.'};
 if(save?.characterRoute!=='criminal'||save.paused||save.phase!=='night'||
  locationId!==VENUE||roomId!==ROOM)
  return {ok:false,reason:'Eli must be working at the Golden Peacock entrance at Washington Night.'};
 const book=read(save);
 if(kind==='handover'){
  const p=book.parcels[parcelId];
  if(!p||p.status!=='held-at-door')return {ok:false,reason:'No physical parcel awaits floor-manager collection.'};
  return {ok:true,seconds:300};
 }
 const duty=save?.doormanDuty;
 if(!duty||duty.pending)return {ok:false,reason:'Finish the waiting visitor before submitting the shift report.'};
 const worked=duty.segmentsByDate?.[date]||0;
 if(worked<4)return {ok:false,reason:'Complete all four scheduled door segments before filing the nightly work report.'};
 if(book.shiftReports[date])return {ok:false,reason:'Tonight’s work report has already been submitted.'};
 const todays=book.events.filter(e=>e.date===date);
 if(todays.length!==worked)return {ok:false,reason:'Shift report incomplete: visitor contacts and paid segments do not match.'};
 return {ok:true,seconds:300};
}
function transact(save,{kind,parcelId,date,locationId,roomId,spentSeconds,token}){
 if(typeof token!=='string'||!/^[a-z0-9][a-z0-9:_-]{0,99}$/i.test(token))
  return {ok:false,reason:'Unique door book transaction token required.'};
 const prev=save?.peacockDoorRegister?.receipts?.[token];
 if(prev)return {...copy(prev),repeated:true};
 const can=preview(save,{kind,parcelId,date,locationId,roomId});
 if(!can.ok)return can;
 if(spentSeconds!==can.seconds)return {ok:false,reason:'Door paperwork requires five game minutes.'};
 const book=ensure(save);
 let message,report=null;
 if(kind==='handover'){
  const parcel=book.parcels[parcelId];
  parcel.status='manager-custody';parcel.transferredTo='Floor manager';
  parcel.chain.push({date,place:VENUE,kind:'manager-handoff',holder:'Floor manager',source:token});
  message='Transferred the logged wrapped parcel to the club floor manager. Contents remain unverified.';
 }else{
  const todays=book.events.filter(e=>e.date===date);
  const outstanding=Object.values(book.parcels).filter(p=>p.status==='held-at-door');
  const requests=todays.filter(e=>['refer','supervisor','manager'].includes(e.choice)).length;
  const disputes=todays.filter(e=>e.kind==='tense-visitor').length;
  const resolved=todays.filter(e=>['calm','line','directions','decline'].includes(e.choice)).length;
  report={date,contacts:todays.length,requestsForManager:requests,tenseContacts:disputes,
   routineResolutions:resolved,untransferredParcels:outstanding.map(p=>p.id),
   status:outstanding.length?'filed-with-outstanding-custody':'submitted-for-manager-review',
   caseIds:todays.map(e=>e.id),managerDecision:null,ownerDecision:null,promotion:false};
  book.shiftReports[date]=report;
  message='Submitted four actual door contacts to the floor manager'+
   (outstanding.length?'; '+outstanding.length+' delivery remains in Eli’s custody.':'.');
 }
 const receipt={ok:true,kind:'door-'+kind,date,token,parcelId:parcelId||null,report,
  elapsedSeconds:spentSeconds,message};
 book.receipts[token]=receipt;
 if(Array.isArray(save.notes))save.notes.push({date,source:'Golden Peacock entrance duty book',text:message});
 return {...copy(receipt),repeated:false};
}
const api=Object.freeze({read,record,preview,transact});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PEACOCK_DOOR_REGISTER=api;
})(typeof window!=='undefined'?window:globalThis);
