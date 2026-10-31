/* Capital & Consequence: dated Wardman family document contest.
 * The director's amended duty book is a documented event, NOT proof that he
 * committed the murder. Originals, witness notes and petition rulings are
 * earned by Edmund individually and survive ordinary profile saves.
 */
(function(root){'use strict';
const CASE='asylum-ward-death-1878';
const AMEND='1878-01-07T08:30';
const ACTIONS=Object.freeze(['familyPreserve','familyCompare','familyWitness','familyHearing','familyAppeal','familyPatientAppeal']);
const stamp=save=>root.FE_WASHINGTON_TIME?.now?.(save)?.iso||String(save?.gameDate||'')+'T12:00';
const day=iso=>{const t=Date.parse(String(iso||'').slice(0,10)+'T12:00:00Z');return Number.isFinite(t)?t:null};
const days=(a,b)=>{const x=day(a),y=day(b);return x===null||y===null?-1:Math.floor((x-y)/86400000)};
const has=(save,id)=>!!save?.incidentObservations?.records?.some(x=>x?.eventId==='asylum:'+id&&x?.incidentId===CASE);
function state(save){
 if(!save.familyRecords||save.familyRecords.version!==1)
  save.familyRecords={version:1,actions:[],original:null,comparison:null,witness:null,hearing:null,appeal:null};
 return save.familyRecords;
}
function official(world){
 return world?.institutionalRecords?.[CASE]||null;
}
function advanceWorld(world){
 if(!root.FE_SHARED_WORLD?.valid?.(world,world?.id)||!world.incidents?.[CASE])return null;
 if(!world.institutionalRecords)world.institutionalRecords={};
 let file=official(world);
 if(!file){
  file=world.institutionalRecords[CASE]={version:1,caseId:CASE,recordDate:'1878-01-05T08:45',
   original:{attendance:'Edmund Wardman signed the morning ward duty register at 08:45.',
    folio:'WARD-1878-005',signedBy:'ward clerk'},
   replacement:null,revisionDate:null,revisionSource:null};
 }
 const iso=root.FE_WORLD_CLOCK?.calendar?.(world.clock)?.iso||null;
 if(iso&&iso>=AMEND&&!file.replacement){
  // The alteration is fixed in this shared campaign, before either
  // protagonist can compare records. Whether it is criminal is NOT assumed.
  file.replacement={attendance:'The amended line alleges Edmund Wardman was absent from morning duty.',
   folio:file.original.folio,enteredBy:'director’s office'};
  file.revisionDate=AMEND;
  file.revisionSource='Director’s office amendment; original entry retained only by prior independent copies';
  root.FE_SHARED_WORLD.recordEvent(world,{id:'asylum-ward-register-amendment:'+CASE,
   type:'institution-record-amendment',at:AMEND,locationId:'blackwoodAsylum',
   summary:'An amended asylum staffing entry was entered into the administrative register. The reliability of the correction is disputed.'});
 }
 return file;
}
function proof(save){
 const personal=save?.familyRecords;
 const signed=!!personal?.original&&personal.original.recordedAt<AMEND;
 const comparison=!!personal?.comparison?.changed;
 const witness=!!personal?.witness;
 const publicMeeting=save?.wardmanStanding?.familyMeetings?.some(m=>m.choice==='familyPublic'&&m.witnessPresent);
 const decline=save?.wardmanStanding?.familyMeetings?.some(m=>m.choice==='familyDecline');
 const certificate=personal?.policeExtract;
 const police=!!certificate&&certificate.caseId===CASE&&
  certificate.certificateId==='wardman-police-certificate:'+CASE&&
  ['familyPoliceCopy','familyPatientPoliceCopy'].includes(certificate.action)&&
  has(save,certificate.action);
 return {signed,comparison,witness,publicMeeting:!!publicMeeting,decline:!!decline,police,
  score:(signed?4:0)+(comparison?2:0)+(witness?3:0)+(publicMeeting?2:0)+(decline?1:0)+(police?5:0)};
}
function preview(save,world,id){
 if(save?.characterRoute!=='wardman')return {ok:false,reason:'These family papers belong to Edmund.'};
 if(!ACTIONS.includes(id))return {ok:false,reason:'Unknown institutional record action.'};
 if(save.paused||save.phase!=='day')return {ok:false,reason:'The asylum and independent records offices are closed.'};
 const file=official(world),now=stamp(save),p=save.wardmanStanding;
 if(!file)return {ok:false,reason:'No institutional record exists for this incident.'};
 if(has(save,id))return {ok:false,reason:'This stage has already been recorded.'};
 if(id==='familyPreserve'){
  if(!has(save,'wardRecord'))return {ok:false,reason:'Examine the original ward record first.'};
  if(now>=AMEND)return {ok:false,reason:'The original register has already been replaced. Seek other witnesses.'};
 }
 if(id==='familyCompare'){
  if(!file.replacement||now<AMEND)return {ok:false,reason:'No amended director’s register has been posted yet.'};
  if(!has(save,'wardRecord'))return {ok:false,reason:'Read the ordinary duty book before comparing entries.'};
 }
 if(id==='familyWitness'){
  if(!has(save,'familyCompare'))return {ok:false,reason:'Compare the amended register before seeking a separate witness.'};
 }
 if(id==='familyHearing'){
  if(p?.petition?.status!=='review-requested')
   return {ok:false,reason:'First request independent review of a threatened family petition.'};
  if(days(now,p.petition.reviewRequestedAt)<2)return {ok:false,reason:'The independent hearing is scheduled at least two calendar days after the review request.'};
 }
 if(id==='familyAppeal'||id==='familyPatientAppeal'){
  if(p?.petition?.status!=='adverse-order'&&p?.petition?.status!=='enforced')
   return {ok:false,reason:'There is no adverse confinement order to appeal.'};
  if(save.familyRecords?.appeal)return {ok:false,reason:'This appeal has already been heard.'};
  if(id==='familyAppeal'&&p.petition.status==='enforced')
   return {ok:false,reason:'A confined Edmund must petition from his ward.'};
  if(id==='familyPatientAppeal'&&p.petition.status!=='enforced')
   return {ok:false,reason:'Patient-ward appeals are for an enforced order only.'};
 }
 return {ok:true};
}
function apply(save,world,id,spentSeconds){
 const allow=preview(save,world,id);if(!allow.ok)return allow;
 const sec={familyPreserve:300,familyCompare:600,familyWitness:600,
  familyHearing:1200,familyAppeal:900,familyPatientAppeal:900}[id];
 if(spentSeconds!==sec)return {ok:false,reason:'The documented action duration has not elapsed.'};
 const p=root.FE_WARDMAN_POLITICS?.ensure?.(save),s=state(save),file=official(world),at=stamp(save);
 if(!p)return {ok:false,reason:'Wardman family file is not available.'};
 let result='';
 if(id==='familyPreserve'){
  s.original={...file.original,recordedAt:at,source:'firsthand handwritten duplicate of original duty ledger'};
  result='Edmund preserved the original 08:45 staffing entry. A later change can be compared against this dated copy.';
 }else if(id==='familyCompare'){
  s.comparison={at,changed:!!file.replacement,
   originalPresent:!!s.original,source:'in-person director’s ledger comparison'};
  result=s.original?
   'The director’s amended line contradicts Edmund’s previously dated copy. Both texts remain in the private casebook.':
   'The director’s office changed the staffing line. Edmund lacks an original copy, so the alteration alone cannot prove the old wording.';
 }else if(id==='familyWitness'){
  s.witness={at,source:'ward porter witnessed account',
   statement:'A ward porter recalls Edmund working near the morning station, but did not watch every ward entrance.'};
  result='A porter signed a limited account. It supports Edmund’s presence, not an allegation about the murderer.';
 }else if(id==='familyHearing'){
  const evidence=proof(save),dismissed=evidence.score>=6;
  s.hearing={at,score:evidence.score,documents:{
   original:evidence.signed,comparison:evidence.comparison,witness:evidence.witness,
   familyMeeting:evidence.publicMeeting},result:dismissed?'dismissed':'adverse-order',
   authority:'independent hearing panel; order is challenged, not a medical diagnosis'};
  p.petition.status=dismissed?'dismissed':'adverse-order';
  p.petition.heardAt=save.gameDate;
  p.petition.evidenceScore=evidence.score;
  if(dismissed){
   p.workplaceTrust=Math.min(100,p.workplaceTrust+8);
   p.familyPressure=Math.max(0,p.familyPressure-18);
   result='The independent panel dismissed the petition after reviewing the documents. Edmund remains an orderly.';
  }else{
   p.petition.enforcementDate=new Date(Date.parse(save.gameDate+'T12:00:00Z')+2*86400000).toISOString().slice(0,10);
   result='The panel sustained a provisional confinement order. Edmund has two days before transfer, with a right to appeal.';
  }
 }else{
  // New independent corroboration can reverse an adverse hearing even
  // without a preserved original, but an unsupported assertion cannot.
  const evidence=proof(save),overturned=evidence.score>=5;
  s.appeal={at,score:evidence.score,result:overturned?'overturned':'denied',
   source:'recorded independent petition appeal'};
  if(overturned){
   p.petition.status='dismissed';p.petition.appealResult='overturned';
   p.status='employed';p.familyPressure=Math.max(0,p.familyPressure-12);
   if(id==='familyPatientAppeal'){
    // A formal discharge from involuntary custody: no illegal instant transfer
    // to a different city building and no fake clinical diagnosis.
    save.currentLocation={locationId:'blackwoodAsylum',roomId:'reception'};
   }
   result='The appeal overturned the unsupported confinement order; Edmund is free to resume his position.';
  }else{
   p.petition.appealResult='denied';
   result='The appeal was denied on the submitted record. Edmund may still seek new evidence, but this appeal cannot be repeated.';
  }
 }
 if(!Array.isArray(s.actions))s.actions=[];
 s.actions.push({id,date:save.gameDate,at,result});
 root.FE_LIFE_HISTORY?.record?.(save,{id:'wardman-records:'+id,date:save.gameDate,
  source:'institutional record contest',text:result});
 return {ok:true,source:'Wardman institutional record',description:result,
  familyStatus:p.petition?.status||'no-petition',result};
}
function summary(save,world){
 const p=save?.characterRoute==='wardman'?save.wardmanStanding:null;
 const file=official(world),s=save?.familyRecords;
 return {amended:!!file?.revisionDate&&has(save,'familyCompare'),copyPreserved:!!s?.original,
  comparison:!!s?.comparison,witness:!!s?.witness,
  petition:p?.petition?.status||null,confinement:p?.status==='patient',
  hearing:s?.hearing?.result||null,appeal:s?.appeal?.result||null};
}
const api=Object.freeze({CASE,AMEND,ACTIONS,advanceWorld,preview,apply,proof,summary});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WARDMAN_RECORDS=api;
})(typeof window!=='undefined'?window:globalThis);
