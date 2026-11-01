/* Capital & Consequence: per-person private medical ledger and exhaustion.
 * No independent clock, automatic travel, fictional cash printing or
 * medical facts from NPCs that the player has not observed.
 */
(function(root){
'use strict';
const VERSION=1;
const WORK=new Set(['factory','metropolitanPolice','blackwoodAsylum','secondNightclub']);
const DANGER=new Set(['hillsdale','oldChinatown','chinatown','blacktown']);
const PLAYER_NAMES=Object.freeze({industrialist:'Charles Whitcomb',investigator:'Samuel Harlan',criminal:'Elias Crowe',wardman:'Edmund Wardman'});
const FEES=Object.freeze({home:0,work:400,street:1200,danger:1200});
const MINUTES=Object.freeze({home:90,work:120,street:180,danger:180});
const safeId=id=>typeof id==='string'&&/^(?:player|npc):[a-zA-Z0-9_-]{1,75}$/.test(id);
const dateMinute=n=>Number.isSafeInteger(n)?new Date(n*60000).toISOString().slice(0,16):null;
function minute(save){return save?.worldCalendarStatus==='ready'&&Number.isSafeInteger(save.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null;}
function ensure(save){
 if(!save||typeof save!=='object')return null;
 if(!save.medicalRecords||save.medicalRecords.version!==VERSION||typeof save.medicalRecords.patients!=='object'||!save.medicalRecords.patients)
  save.medicalRecords={version:VERSION,patients:{},pending:null,factory:{minutesLost:0,incidents:0,doctorFeesCents:0}};
 const data=save.medicalRecords;
 if(!data.factory||typeof data.factory!=='object')data.factory={minutesLost:0,incidents:0,doctorFeesCents:0};
 if(!Number.isFinite(data.factory.minutesLost))data.factory.minutesLost=0;
 if(!Number.isFinite(data.factory.incidents))data.factory.incidents=0;
 if(!Number.isFinite(data.factory.doctorFeesCents))data.factory.doctorFeesCents=0;
 return data;
}
function ensurePatient(save,id,name,kind='npc'){
 if(!safeId(id))return null;
 const data=ensure(save);
 if(!data)return null;
 if(!Object.prototype.hasOwnProperty.call(data.patients,id)){
  data.patients[id]={id,name:String(name||id).slice(0,90),kind,collapses:0,recoveryNights:0,unpaidCents:0,history:[]};
 }
 const patient=data.patients[id];
 if(!Array.isArray(patient.history))patient.history=[];
 if(!Number.isSafeInteger(patient.collapses)||patient.collapses<0)patient.collapses=patient.history.filter(e=>e.kind==='collapse').length;
 if(!Number.isSafeInteger(patient.recoveryNights)||patient.recoveryNights<0)patient.recoveryNights=0;
 if(!Number.isSafeInteger(patient.unpaidCents)||patient.unpaidCents<0)patient.unpaidCents=0;
 return patient;
}
function playerId(save){return 'player:'+(PLAYER_NAMES[save?.characterRoute]?save.characterRoute:'industrialist');}
function player(save){return ensurePatient(save,playerId(save),PLAYER_NAMES[save?.characterRoute]||PLAYER_NAMES.industrialist,'player');}
function recent(patient,now,days){
 return patient.history.filter(e=>e.kind==='collapse'&&Number.isSafeInteger(e.minute)&&now-e.minute>=0&&now-e.minute<=days*1440).length;
}
function severity(patient,now){
 if(!patient||now===null)return 'normal';
 if(recent(patient,now,14)>=3&&patient.recoveryNights<3)return 'severe';
 if(recent(patient,now,7)>=2&&patient.recoveryNights<2)return 'chronic';
 return 'normal';
}
function energyCap(save){
 const state=severity(player(save),minute(save));
 return state==='severe'?65:state==='chronic'?80:100;
}
function locationKind(save,locationId){
 if(locationId==='home')return 'home';
 if(DANGER.has(locationId))return 'danger';
 if(WORK.has(locationId))return 'work';
 return 'street';
}
function hash(s){let x=2166136261;for(const ch of s){x^=ch.charCodeAt(0);x=Math.imul(x,16777619)}return x>>>0;}
function append(patient,entry){
 patient.history.push(entry);
 if(patient.history.length>160)patient.history.splice(0,patient.history.length-160);
 return entry;
}
function bill(save,patient,cents,payer){
 if(cents<=0)return {paidCents:0,owedCents:0};
 const field=payer==='company'?'companyCash':'personalCash';
 const available=Math.max(0,Math.round((Number(save[field])||0)*100));
 const paid=Math.min(available,cents),owed=cents-paid;
 save[field]=Math.round((available-paid))/100;
 patient.unpaidCents+=owed;
 if(payer==='company'){
  save.lastExpenses=Math.round(((Number(save.lastExpenses)||0)*100+paid))/100;
  if(save.componentWorks)save.componentWorks.cashCents=Math.round(save.companyCash*100);
 }
 return {paidCents:paid,owedCents:owed};
}
function collapse(save,locationId){
 const now=minute(save),needs=save?.characterNeeds;
 if(now===null||!needs||needs.meters?.energy>0)return {ok:false,reason:'No exhaustion collapse is due.'};
 const ledger=ensure(save);
 if(ledger.pending)return {ok:false,reason:'An earlier collapse remains unresolved.'};
 const patient=player(save),where=locationKind(save,locationId);
 const last=patient.history.at(-1);
 if(last?.kind==='collapse'&&last.minute===now)return {ok:false,reason:'Collapse already recorded.'};
 const count=patient.collapses+1;
 const robbed=where==='danger'&&(hash(playerId(save)+'|'+now+'|'+count)%4===0);
 const cashBefore=Math.max(0,Math.round((Number(save.personalCash)||0)*100));
 const stolenCents=robbed?Math.min(cashBefore,Math.max(50,Math.floor(cashBefore*.1))):0;
 save.personalCash=Math.round(cashBefore-stolenCents)/100;
 const payer=where==='work'?'company':'personal';
 const charge=bill(save,patient,FEES[where],payer);
 const record=append(patient,{kind:'collapse',minute:now,date:dateMinute(now),locationId,
  setting:where,minutesLost:MINUTES[where],doctorFeeCents:where==='work'?FEES[where]:0,
  hospitalFeeCents:where==='street'||where==='danger'?FEES[where]:0,
  payer,paidCents:charge.paidCents,owedCents:charge.owedCents,stolenCents});
 patient.collapses=count;patient.recoveryNights=0;
 if(where==='work'&&locationId==='factory'&&save.characterRoute==='industrialist'){
  ledger.factory.incidents++;
  ledger.factory.doctorFeesCents+=FEES.work;
 }
 ledger.pending={id:playerId(save)+'|'+now,patientId:playerId(save),minute:now,locationId,
  setting:where,minutesLost:MINUTES[where],stolenCents,paidCents:charge.paidCents,
  owedCents:charge.owedCents,doctorFeeCents:record.doctorFeeCents,feeCents:FEES[where],
  count,severity:severity(patient,now)};
 return {ok:true,event:{...ledger.pending}};
}
function pending(save){return ensure(save)?.pending||null;}
function wake(save,secondsSpent){
 const ledger=ensure(save),event=ledger?.pending,needs=save?.characterNeeds;
 if(!event||!needs)return {ok:false,reason:'No collapse to recover from.'};
 const spent=Math.max(0,Math.floor(Number(secondsSpent)||0));
 const missed=Math.min(event.minutesLost*60,spent);
 if(event.setting==='work'&&event.locationId==='factory'&&save.characterRoute==='industrialist'){
  // Time that falls within an open shift is production downtime; never
  // subtract invented profits from the books. Production itself did not run.
  ledger.factory.minutesLost+=Math.ceil(missed/60);
 }
 needs.meters.energy=Math.min(energyCap(save),event.setting==='home'?12:18);
 needs.lastMinute=minute(save);
 const patient=player(save);
 append(patient,{kind:'recovered-consciousness',minute:minute(save),date:dateMinute(minute(save)),
  locationId:event.locationId,relatedCollapseMinute:event.minute,minutesUnconscious:Math.ceil(missed/60)});
 ledger.pending=null;
 return {ok:true,event,minutesLost:Math.ceil(missed/60),energy:needs.meters.energy};
}
function onSleep(save){
 const patient=player(save);
 patient.recoveryNights++;
 const status=severity(patient,minute(save));
 return {severity:status,energyCap:status==='severe'?65:status==='chronic'?80:100};
}
function record(save,id,details){
 const patient=ensurePatient(save,id,details?.name||id,id.startsWith('player:')?'player':'npc');
 if(!patient||!details||typeof details.kind!=='string'||!details.kind)return null;
 const at=Number.isSafeInteger(details.minute)?details.minute:minute(save);
 return append(patient,{kind:details.kind.slice(0,45),minute:at,date:dateMinute(at),
  locationId:details.locationId||null,description:String(details.description||'').slice(0,350)});
}
function viewOwn(save){
 const patient=player(save),now=minute(save);
 return {...patient,severity:severity(patient,now),energyCap:energyCap(save),
  recentSevenDays:now===null?0:recent(patient,now,7),recentFourteenDays:now===null?0:recent(patient,now,14)};
}
const api=Object.freeze({VERSION,FEES,MINUTES,PLAYER_NAMES,ensure,ensurePatient,player,playerId,viewOwn,
 locationKind,collapse,pending,wake,onSleep,record,severity,energyCap});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_MEDICAL_RECORDS=api;
})(typeof window!=='undefined'?window:globalThis);
