/* Capital & Consequence: one District Asylum case, separate character knowledge.
 * Sam's case referral and Edmund's concerns require three physically sourced
 * leads. An allegation never equals an arrest, conviction or diagnosis.
 * Official review is resolved on a later shared-world date, not on accusation.
 */
(function(root){'use strict';
const CASE='asylum-ward-death-1878';
const ROUTES=Object.freeze({
 investigator:Object.freeze({access:'statementFolio',trace:'clothingAccount',time:'bellStatement',file:'policeMemo'}),
 wardman:Object.freeze({access:'wardRoster',trace:'passageMark',time:'visitorRegister',file:'wardMemo'})
});
const SOURCES=Object.freeze({
 access:'Authenticated access and staffing records',
 trace:'Passage, clothing and movement observations',
 time:'Reception and porter time comparison'
});
const copy=x=>JSON.parse(JSON.stringify(x));
const observed=(save,id)=>!!save?.incidentObservations?.records?.some(x=>
 x?.incidentId===CASE&&x.eventId==='asylum:'+id&&typeof x.source==='string');
const reject=reason=>({ok:false,reason});
function scene(world){
 const source=world?.incidentScene?.[CASE],incident=world?.incidents?.[CASE];
 if(!source||source.version!==1||!incident||!Array.isArray(source.persons)||source.persons.length!==4)return null;
 const people=source.persons;
 const at=String(incident.at).slice(0,13)+':00';
 const present=people.filter(p=>p.moments?.some(m=>m.time===at&&m.at==='private-ward'));
 if(present.length!==1)return null;
 return {incident,people,present:present[0],others:people.filter(p=>p.personId!==present[0].personId)};
}
function dossier(save,world){
 const place=scene(world),route=ROUTES[save?.characterRoute];
 if(!place||!route)return null;
 const suspects=place.people.map(p=>({id:p.personId,name:p.publicName,statement:p.statedAlibi}));
 const leadSpecs=[
  ['access',place.others[0]],['trace',place.others[1]],['time',place.others[2]]
 ];
 const leads=leadSpecs.map(([kind,other])=>{
  const sourceAction=route[kind],available=observed(save,sourceAction);
  const candidateIds=[place.present.personId,other.personId];
  const names=candidateIds.map(id=>suspects.find(s=>s.id===id).name);
  const note=kind==='access'?
   'The authenticated access comparison leaves '+names.join(' or ')+' potentially able to reach the service passage. An entry permission is not proof of entry.':
   kind==='trace'?'Comparison of the observed passage and clothing descriptions leaves '+names.join(' or ')+
    ' compatible with the unidentifiable figure. A coat or footprint is not an identification.':
    'Independent bell and reception timestamps leave '+names.join(' or ')+
    ' within the relevant interval. Presence near the ward is not proof of violence.';
  return {kind,label:SOURCES[kind],sourceAction,available,
   ...(available?{candidates:candidateIds,description:note}:{})};
 });
 const revealed=leads.filter(l=>l.available);
 const options=revealed.length?place.people.filter(p=>revealed.every(l=>l.candidates.includes(p.personId)))
  .map(p=>p.personId):[];
 const ready=leads.every(l=>l.available)&&options.length===1;
 const pending=world.incidents[CASE].referral||null;
 return {incidentId:CASE,at:place.incident.at,
  status:place.incident.status,route:save.characterRoute,suspects,leads,
  ready,remaining:leads.filter(l=>!l.available).map(l=>l.sourceAction),
  intersection:ready?[...options]:[],
  supplements:['drainSurvey','drainReport','motiveLedger','motiveDocket']
   .filter(id=>observed(save,id))
   .map(id=>root.FE_ASYLUM_EVIDENCE?.describe?.(world,id,CASE))
   .filter(Boolean).map(x=>({source:x.source,description:x.description})),
  filed:copy(save.asylumCasebook?.referrals||[]),
  concern:copy(save.asylumCasebook?.concerns||[]),
  // Only publicly recorded submissions/reviews, never secret world truth.
  publicReview:pending?{status:pending.status,accusedId:pending.accusedId,
   submittedAt:pending.submittedAt,reviewedAt:pending.reviewedAt||null,
   decision:pending.decision||null}:null};
}
function canFile(save,world,where,personId){
 const file=dossier(save,world);
 if(!file)return reject('No asylum case or authorized investigative career');
 if(!file.suspects.some(p=>p.id===personId))return reject('The selected person is not on this case roster');
 if(!file.ready)return reject('Compare authenticated access, physical movement and time accounts first');
 if(!observed(save,ROUTES[save.characterRoute].file))
  return reject('File your preliminary case memorandum before naming a suspect');
 if(save.paused||save.phase!=='day')return reject('Case papers require an active business-day clock');
 if(where?.dev)return reject('A developer room cannot produce an official inquiry');
 if(save.characterRoute==='investigator'){
  if(save.patrolDuty?.onDuty)return reject('Sam must finish his assigned Hillsdale patrol first');
  if(where?.locationId!=='metropolitanPolice'||where?.roomId!=='station-duty-room')
   return reject('Take the allegation to the police duty sergeant in person');
  if(!observed(save,'medical')||save.casePermissions?.[CASE]?.issuedBy!=='station-sergeant')
   return reject('Obtain the authorized coroner finding and sergeant referral first');
  if(world.incidents[CASE].referral)return reject('An official asylum referral has already been lodged');
 }else if(where?.locationId!=='blackwoodAsylum'||where?.roomId!=='orderly-station'){
  return reject('Edmund must enter his concern in the asylum orderly-station register');
 }
 if(save.asylumCasebook?.referrals?.length&&save.characterRoute==='investigator')
  return reject('This police case referral has already been filed');
 if(save.asylumCasebook?.concerns?.some(x=>x.personId===personId)&&save.characterRoute==='wardman')
  return reject('The same personal concern has already been entered');
 return {ok:true,caseId:CASE,seconds:600,supported:file.intersection.includes(personId),
  warning:file.intersection.includes(personId)?
   'The three independent leads agree; a sergeant must still review the accusation.':
   'WARNING: Your chosen person contradicts the combined leads. A wrongful allegation can damage your standing.'};
}
function file(save,world,where,personId,{spentSeconds}={}){
 const check=canFile(save,world,where,personId);
 if(!check.ok)return check;
 if(spentSeconds!==check.seconds)return reject('Ten in-game minutes must be charged before filing');
 const state=save.asylumCasebook||{version:1,referrals:[],concerns:[]};
 if(!Array.isArray(state.referrals))state.referrals=[];
 if(!Array.isArray(state.concerns))state.concerns=[];
 save.asylumCasebook=state;
 const item={id:'asylum-referral:'+CASE+':'+personId,caseId:CASE,personId,
  date:save.gameDate,at:root.FE_WASHINGTON_TIME?.now?.(save)?.iso||save.gameDate,
  supportedBy:ROUTES[save.characterRoute],
  source:'three separately observed case records',supportedAtFiling:check.supported};
 if(save.characterRoute==='investigator'){
  state.referrals.push(item);
 }else{
  state.concerns.push(item);
  // Private confrontation with the director is not a police charge.
  const politics=root.FE_WARDMAN_POLITICS?.ensure?.(save);
  if(politics){
   politics.familyPressure=Math.min(100,politics.familyPressure+(personId==='ward-director-01'?12:4));
   politics.workplaceTrust=Math.max(0,politics.workplaceTrust-(personId==='ward-director-01'?5:2));
  }
 }
 root.FE_LIFE_HISTORY?.record?.(save,{id:item.id+':'+save.characterRoute,
  date:save.gameDate,source:save.characterRoute==='investigator'?'police duty-sergeant file':'orderly-station private memorandum',
  text:save.characterRoute==='investigator'?'Filed a named referral for independent review. No arrest was ordered.':
   'Recorded a personally reasoned concern in the asylum memorandum. No police charge was made.'});
 return {ok:true,kind:save.characterRoute==='investigator'?'referral':'concern',
  warning:check.warning,supported:check.supported};
}
function publish(world,save,profileId){
 if(!root.FE_SHARED_WORLD?.valid?.(world,world?.id)||save?.characterRoute!=='investigator'||
  typeof profileId!=='string'||!profileId)return false;
 const record=world.incidents?.[CASE],file=save.asylumCasebook?.referrals?.[0];
 if(!record||record.referral||!file||file.caseId!==CASE)return false;
 // Replay protection: only a police profile that collected its own required
 // sources and a real station referral can enter the shared official register.
 const refs=ROUTES.investigator;
 if(![refs.access,refs.trace,refs.time,refs.file,'medical'].every(id=>observed(save,id))||
  save.casePermissions?.[CASE]?.issuedBy!=='station-sergeant')return false;
 if(!scene(world)?.people.some(p=>p.personId===file.personId))return false;
 record.referral={id:'referral:'+CASE,accusedId:file.personId,profileId,
  submittedAt:file.at,submittedDate:file.date,status:'pending',decision:null};
 root.FE_SHARED_WORLD.recordEvent(world,{id:'asylum-referral:'+CASE,
  at:file.at,type:'police-case-referral',locationId:'metropolitanPolice',
  summary:'The police duty sergeant received a named asylum case referral. No arrest or verdict has been entered.'});
 return true;
}
function review(world){
 const place=scene(world),ref=place?.incident?.referral;
 if(!place||!ref||ref.status!=='pending')return null;
 const time=root.FE_WORLD_CLOCK?.calendar?.(world.clock)?.iso;
 const submitted=Date.parse(String(ref.submittedDate)+'T00:00:00Z');
 const today=Date.parse(String(time||'').slice(0,10)+'T00:00:00Z');
 if(!Number.isFinite(submitted)||!Number.isFinite(today)||today-submitted<86400000)return null;
 // Review uses the fixed contemporaneous scene, NOT the player's guess or
 // protagonist route. A corroborated referral is still not a conviction.
 const matched=place.present.personId===ref.accusedId;
 ref.status='reviewed';ref.reviewedAt=time;ref.decision=matched?'corroborated':'unsupported';
 if(matched)place.incident.status='referred-for-formal-inquiry';
 root.FE_SHARED_WORLD.recordEvent(world,{id:'asylum-referral-review:'+CASE,
  at:time,type:matched?'case-referral-corroborated':'case-referral-declined',
  locationId:'metropolitanPolice',
  summary:matched?'The named asylum referral was independently corroborated and advanced for formal inquiry. No conviction has been entered.':
   'Independent case review rejected the unsupported accusation. The incident remains unresolved.'});
 return {caseId:CASE,decision:ref.decision,accusedId:ref.accusedId};
}
function syncReview(save,world){
 const ref=world?.incidents?.[CASE]?.referral;
 if(save?.characterRoute!=='investigator'||!ref||ref.status!=='reviewed'||!save.asylumCasebook?.referrals?.length)
  return false;
 const state=save.asylumCasebook;
 if(state.reviewedId===ref.id||state.referrals[0].personId!==ref.accusedId)return false;
 state.reviewedId=ref.id;state.review=ref.decision;
 if(ref.decision==='unsupported'){
  save.reputation=Math.max(0,Number(save.reputation||50)-8);
  if(!save.patrolDuty)save.patrolDuty={};
  save.patrolDuty.caseCautions=Math.max(0,Number(save.patrolDuty.caseCautions||0))+1;
 }else{
  save.reputation=Math.min(100,Number(save.reputation||50)+3);
 }
 if(!Array.isArray(save.notes))save.notes=[];
 save.notes.push({date:save.gameDate,source:'Metropolitan Police case review',
  text:ref.decision==='unsupported'?'The sergeant rejected my unsupported asylum accusation; professional standing suffered.':
   'Independent inquiry corroborated the named asylum referral. Arrest and trial remain separate proceedings.'});
 return true;
}
const api=Object.freeze({CASE,ROUTES,dossier,canFile,file,publish,review,syncReview});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_ASYLUM_CASEWORK=api;
})(typeof window!=='undefined'?window:globalThis);
