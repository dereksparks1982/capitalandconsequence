/* Capital & Consequence: authenticated police-to-Wardman evidence handoff.
 * Sam's station filing is shared publicly only by an atomic world capture.
 * Edmund must personally collect the certificate before it can support a
 * petition, including a single reopened appeal after an earlier denial.
 * This certificate cannot determine who murdered the asylum resident.
 */
(function(root){'use strict';
const CASE='asylum-ward-death-1878';
const CERT='wardman-police-certificate:'+CASE;
const ACTIONS=Object.freeze(['policeWardmanCompare','policeWardmanCertify',
 'familyPoliceCopy','familyPatientPoliceCopy','familyReopenAppeal']);
const POLICE=Object.freeze(['policeWardmanCompare','policeWardmanCertify']);
const COPIES=Object.freeze(['familyPoliceCopy','familyPatientPoliceCopy']);
const observed=(save,id)=>save?.incidentObservations?.records?.some(x=>
 x?.incidentId===CASE&&x.eventId==='asylum:'+id&&typeof x.source==='string')||false;
const at=save=>root.FE_WASHINGTON_TIME?.now?.(save)?.iso||null;
const reject=reason=>({ok:false,reason});
const registry=world=>world?.institutionalRecords?.[CASE]||null;
function preview(save,world,id){
 if(!ACTIONS.includes(id))return reject('Unknown Wardman evidence action.');
 if(save?.paused||save?.phase!=='day')return reject('The public records desk is closed.');
 if(!root.FE_SHARED_WORLD?.valid?.(world,world?.id))return reject('The campaign record is unavailable.');
 const book=registry(world),p=save?.wardmanStanding;
 if(!book)return reject('The asylum’s original records have not yet been registered.');
 if(observed(save,id))return reject('This specific document action has already been completed.');
 if(POLICE.includes(id)){
  if(save?.characterRoute!=='investigator')return reject('Only Sam may certify police case evidence.');
  if(!book.replacement)return reject('No revised asylum duty register has yet appeared.');
  if(save.patrolDuty?.onDuty)return reject('Sam must finish his assigned Hillsdale patrol first.');
  if(save.casePermissions?.[CASE]?.issuedBy!=='station-sergeant'||
    !['stationMemo','medical','statementFolio','policeMemo'].every(x=>observed(save,x)))
   return reject('Obtain the sergeant referral, physician report and certified statements, then file a preliminary police memo.');
  if(id==='policeWardmanCertify'&&!observed(save,'policeWardmanCompare'))
   return reject('Compare the two registers in person before signing a certificate.');
  if(id==='policeWardmanCertify'&&book.policeCertificate)
   return reject('An independent certificate already exists in this campaign.');
  return {ok:true};
 }
 if(save?.characterRoute!=='wardman')return reject('Edmund alone can obtain evidence for his family petition.');
 if(COPIES.includes(id)){
  if(book.policeCertificate?.version!==1||book.policeCertificate?.id!==CERT)
   return reject('The police station has not yet filed an independent certificate.');
  if(save.familyRecords?.policeExtract)return reject('Edmund already holds an authenticated copy.');
  if(id==='familyPoliceCopy'&&p?.status==='patient')
   return reject('Edmund must request delivery to the patient ward.');
  if(id==='familyPatientPoliceCopy'&&p?.status!=='patient')
   return reject('This action is reserved for an involuntarily confined Edmund.');
  return {ok:true};
 }
 if(id==='familyReopenAppeal'){
  if(p?.status!=='patient'||p?.petition?.status!=='enforced')
   return reject('The special rehearing requires an enforced confinement order.');
  if(save.familyRecords?.reopening)return reject('The special rehearing has already been held.');
  const previous=save.familyRecords?.appeal,extract=save.familyRecords?.policeExtract;
  if(previous?.result!=='denied')return reject('First exhaust the initial patient-ward appeal.');
  if(!extract||extract.caseId!==CASE||extract.certificateId!==CERT||
    !COPIES.includes(extract.action)||!observed(save,extract.action)||
    !Date.parse(extract.at)||Date.parse(extract.at)<=Date.parse(previous.at))
   return reject('Obtain a certified police comparison after the first appeal was denied.');
  return {ok:true};
 }
 return reject('No authorized action.');
}
function apply(save,world,id,seconds){
 const permission=preview(save,world,id);if(!permission.ok)return permission;
 const required={policeWardmanCompare:600,policeWardmanCertify:600,
  familyPoliceCopy:600,familyPatientPoliceCopy:600,familyReopenAppeal:900}[id];
 if(seconds!==required)return reject('The full scheduled time has not been spent.');
 const now=at(save);if(!now)return reject('The game date is unavailable.');
 let description='',released=false;
 if(id==='policeWardmanCompare'){
  description='Sam compared the signed January 5 asylum duty register against a January 7 revision. The discrepancy does not establish a murderer or a medical condition.';
 }else if(id==='policeWardmanCertify'){
  save.wardmanPoliceFiling={version:1,caseId:CASE,at:now,date:save.gameDate,
   source:'Metropolitan Police station-sergeant certified discrepancy'};
  description='Sam filed his own sworn comparison with the duty sergeant. It becomes a public record upon a successful campaign save.';
 }else if(COPIES.includes(id)){
  const cert=registry(world).policeCertificate;
  if(!save.familyRecords||save.familyRecords.version!==1)
   save.familyRecords={version:1,actions:[],original:null,comparison:null,witness:null,hearing:null,appeal:null};
  save.familyRecords.policeExtract={caseId:CASE,certificateId:CERT,action:id,
   issuedAt:cert.issuedAt,at:now,source:'certified Metropolitan Police document'};
  description='Edmund received an authenticated copy of Sam’s filed register comparison. It supports a petition challenge but says nothing about who killed the patient.';
 }else{
  const record=save.familyRecords,standing=root.FE_WARDMAN_POLITICS?.ensure?.(save);
  if(!record||!standing)return reject('The pending appeal record is unavailable.');
  const prior=record.appeal;
  // Independent documentation supports a rehearing after a first rejected
  // appeal; this is a recorded procedural result, never a diagnosis.
  record.reopening={at:now,caseId:CASE,previousDecision:prior?.result,
   certificateId:CERT,result:'overturned',source:'independent rehearing with new police certificate'};
  standing.petition.status='dismissed';
  standing.petition.appealResult='overturned-on-new-police-evidence';
  standing.status='employed';
  standing.familyPressure=Math.max(0,(standing.familyPressure||0)-12);
  save.currentLocation={locationId:'blackwoodAsylum',roomId:'reception'};
  released=true;
  description='A new independent hearing overturned Edmund’s disputed confinement order after considering the later police certificate. He has been discharged and may return to work.';
 }
 root.FE_LIFE_HISTORY?.record?.(save,{id:'wardman-police:'+id+':'+CASE,
  date:save.gameDate,source:'cross-character institutional evidence',text:description});
 return {ok:true,source:POLICE.includes(id)?'Metropolitan Police record':'Wardman independent petition',
  description,released};
}
function publish(world,save,profileId){
 if(!root.FE_SHARED_WORLD?.valid?.(world,world?.id)||save?.characterRoute!=='investigator'||
  typeof profileId!=='string'||!profileId)return false;
 const file=registry(world),record=save.wardmanPoliceFiling;
 if(!file?.replacement||file.policeCertificate||record?.version!==1||record?.caseId!==CASE||
   !record.at||record.date!==record.at.slice(0,10))return false;
 const required=['stationMemo','medical','statementFolio','policeMemo','policeWardmanCompare','policeWardmanCertify'];
 if(!required.every(x=>observed(save,x))||save.casePermissions?.[CASE]?.issuedBy!=='station-sergeant')return false;
 const observation=save.incidentObservations.records.find(x=>
  x.incidentId===CASE&&x.eventId==='asylum:policeWardmanCertify');
 if(observation?.at!==record.at||!observation.source?.includes('Metropolitan Police'))return false;
 file.policeCertificate={version:1,id:CERT,caseId:CASE,issuedAt:record.at,
  submittedBy:profileId,source:'Metropolitan Police signed administrative comparison',
  finding:'A January 5 staffing record conflicts with a January 7 administrative revision; no murder culprit or medical diagnosis was identified.'};
 root.FE_SHARED_WORLD.recordEvent(world,{id:CERT,type:'asylum-register-certified',at:record.at,
  locationId:'metropolitanPolice',summary:'A police-certified administrative register discrepancy was filed for independent petition review.'});
 return true;
}
function summary(save){
 return {policeCompared:observed(save,'policeWardmanCompare'),
  policeFiled:observed(save,'policeWardmanCertify'),
  received:!!save?.familyRecords?.policeExtract,
  rehearing:save?.familyRecords?.reopening?.result||null};
}
const api=Object.freeze({CASE,CERT,ACTIONS,preview,apply,publish,summary});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WARDMAN_POLICE=api;
})(typeof window!=='undefined'?window:globalThis);
