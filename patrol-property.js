/* Metropolitan Police: Hillsdale lost-property custody and station register.
 * No invented owner, no unsupported return of goods, and no promotion.
 * Every action belongs to a real filed or witnessed patrol incident.
 */
(function(root){
'use strict';
const STATION='metropolitanPolice',ROOM='station-duty-room';
const validDate=d=>{
 if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;
 const value=new Date(d+'T12:00:00Z');
 return Number.isFinite(value.getTime())&&value.toISOString().slice(0,10)===d;
};
const copy=x=>JSON.parse(JSON.stringify(x));
const blank=()=>({version:1,items:{},receipts:{},history:[]});
function read(save){
 const store=save?.patrolProperty||blank();
 if(store.version!==1||!store.items||!store.receipts||!Array.isArray(store.history))
  throw Error('Invalid patrol property register; never erase existing evidence.');
 return copy(store);
}
function ensure(save){
 if(!save.patrolProperty)save.patrolProperty=blank();
 read(save);
 return save.patrolProperty;
}
function accept(save,incident){
 if(save?.characterRoute!=='investigator'||!incident||incident.typeId!=='lost-property'||
  incident.dispositionId!=='custody'||incident.status!=='awaiting-report'||
  incident.locationId!=='hillsdale'||!validDate(incident.date))return {ok:false,reason:'No witnessed Hillsdale property custody.'};
 const store=ensure(save),id='PROP-'+incident.id;
 if(store.items[id])return {ok:true,repeated:true,item:copy(store.items[id])};
 const record={id,patrolId:incident.id,date:incident.date,foundAt:incident.locationId,
  description:'Unidentified personal item from Hillsdale pavement',status:'officer-custody',
  claimedOwner:null,verifiedOwner:false,reportFiled:false,sealed:false,inspected:false,transferDate:null,
  chain:[{stage:'collected',date:incident.date,place:'hillsdale',holder:'Samuel Harlan',source:incident.id}]};
 store.items[id]=record;
 store.history.push({id,kind:'collected',date:incident.date,source:incident.id});
 if(store.history.length>160)store.history.splice(0,store.history.length-160);
 return {ok:true,item:copy(record)};
}
function file(save,record){
 if(save?.characterRoute!=='investigator'||!record||record.typeId!=='lost-property'||
  record.status!=='filed'||!validDate(record.date))return {ok:false,reason:'No filed Hillsdale property report.'};
 if(record.dispositionId!=='custody')return {ok:true,recordedStatementOnly:true};
 const store=ensure(save),id='PROP-'+record.id,item=store.items[id];
 // Legacy cases filed before this subsystem were not physically booked. Never
 // fabricate the missing custody chain just to give players extra property.
 if(!item)return {ok:false,reason:'No contemporaneous custody record. Historical report requires manual review.'};
 if(item.reportFiled)return {ok:true,repeated:true,item:copy(item)};
 item.reportFiled=true;item.status='station-intake';
 item.chain.push({stage:'intake',date:record.date,place:STATION,holder:'Station property desk',source:record.id});
 store.history.push({id,kind:'intake',date:record.date,source:record.id});
 return {ok:true,item:copy(item)};
}
function preview(save,{id,kind,date,locationId,roomId}){
 if(typeof id!=='string'||!/^PROP-PAT-[0-9]{4,}$/.test(id)||
  !['seal','inspect','transfer'].includes(kind)||!validDate(date))
  return {ok:false,reason:'Invalid property record instruction.'};
 if(save?.characterRoute!=='investigator'||!save?.patrolDuty?.onDuty||
  save.paused||save.phase==='report'||locationId!==STATION||roomId!==ROOM)
  return {ok:false,reason:'On-duty Sam must work at the police station duty room.'};
 const item=save?.patrolProperty?.items?.[id];
 if(!item||!item.reportFiled||item.status==='officer-custody')
  return {ok:false,reason:'Only physical items already entered in the station register can be processed.'};
 if(item.transferDate)return {ok:false,reason:'The item was transferred to the property clerk; no duplicate release.'};
 if(kind==='seal'&&item.sealed)return {ok:false,reason:'Property bag already sealed.'};
 if(kind==='inspect'&&item.inspected)return {ok:false,reason:'Identification check already entered.'};
 if(kind==='transfer'&&(!item.sealed||!item.inspected))
  return {ok:false,reason:'Seal and inspect the station record before transfer to the clerk.'};
 return {ok:true,seconds:300};
}
function manage(save,{id,kind,token,date,locationId,roomId,spentSeconds}){
 if(typeof token!=='string'||!/^[a-z0-9][a-z0-9:_-]{0,99}$/i.test(token))
  return {ok:false,reason:'Invalid property transaction receipt.'};
 const prior=save?.patrolProperty?.receipts?.[token];
 if(prior)return {...copy(prior),repeated:true};
 const can=preview(save,{id,kind,date,locationId,roomId});
 if(!can.ok)return can;
 if(spentSeconds!==can.seconds)return {ok:false,reason:'Property paperwork requires five charged game minutes.'};
 const book=ensure(save),item=book.items[id];
 if(kind==='seal')item.sealed=true;
 if(kind==='inspect')item.inspected=true;
 if(kind==='transfer'){item.status='clerk-custody';item.transferDate=date;}
 const description=kind==='seal'?'Sealed unidentified property in a logged evidence bag.':
  kind==='inspect'?'Compared the item to its original report; no owner identified.':
  'Transferred sealed property to the station clerk; ownership remains unverified.';
 item.chain.push({stage:kind,date,place:STATION,holder:kind==='transfer'?'Station property clerk':'Samuel Harlan',source:token});
 const receipt={ok:true,kind:'property-'+kind,id,token,date,elapsedSeconds:spentSeconds,
  message:description,status:item.status};
 book.receipts[token]=receipt;
 book.history.push({id,kind,date,source:token});
 if(book.history.length>160)book.history.splice(0,book.history.length-160);
 if(Array.isArray(save.notes))save.notes.push({date,source:'Metropolitan Police property register',text:id+' · '+description});
 return {...receipt,repeated:false};
}
const api=Object.freeze({read,accept,file,preview,manage});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PATROL_PROPERTY=api;
})(typeof window!=='undefined'?window:globalThis);
