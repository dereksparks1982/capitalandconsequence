/* Capital & Consequence: first shared asylum inquiry gameplay slice.
 * The victim dies at a fixed campaign time without player intervention.
 * Observations require visits and action time, never reveal the hidden culprit.
 */
(function(root){'use strict';
const CASE_ID='asylum-ward-death-1878',BODY_ID='body-asylum-1878';
const TIME='1878-01-05T09:00',ARRIVAL='1878-01-05T11:15',EXAM='1878-01-05T13:30';
const FINDINGS=Object.freeze([
 'A contusion was observed behind the left ear.',
 'The recorded condition permits an approximate morning time of death.',
 'The physical examination does not identify an assailant.'
]);
const ACTIONS=Object.freeze({
 notice:{label:'Read the official notice · 1 minute',seconds:60,location:'blackwoodAsylum',room:'reception',
  routes:['wardman','investigator'],source:'public asylum reception notice',
  text:'An unexplained death was reported inside District Asylum on the morning of January 5. No cause or perpetrator has been established.'},
 wardRecord:{label:'Examine your ordinary duty register · 5 minutes',seconds:300,location:'blackwoodAsylum',room:'orderly-station',
  routes:['wardman'],source:'orderly station duty book',
  text:'The care-service register contains a gap during the morning ward handover. It does not show who entered the ward.'},
 wardCorridor:{label:'Inspect the ward corridor · 5 minutes',seconds:300,location:'blackwoodAsylum',room:'patient-ward',
  routes:['wardman'],source:'direct observation in authorized ward',
  text:'The ward door was left partly open. By the time you inspected it, the corridor had already been used by other attendants.'},
 reception:{label:'Ask the reception desk about the report · 5 minutes',seconds:300,location:'blackwoodAsylum',room:'reception',
  routes:['investigator'],source:'asylum reception inquiry',
  text:'The receiving clerk confirms that an incident report went to the metropolitan police station. Further patient records are restricted.'},
 stationMemo:{label:'Request limited assistance from the duty sergeant · 10 minutes',seconds:600,location:'metropolitanPolice',room:'station-duty-room',
  routes:['investigator'],source:'signed desk-sergeant referral',
  text:'After reviewing your prior filed patrol reports, the sergeant authorizes a copy of the hospital finding. This is assistance, not a detective promotion.'},
 medical:{label:'Request the coroner’s authorized finding · 10 minutes',seconds:600,location:'governmentHospital',room:'reception',
  routes:['investigator'],source:'District General Hospital coroner report',
  text:'A hospital physician documented the physical findings. Medical observations alone cannot identify an assailant.'},
 wardMemo:{label:'File an orderly incident memorandum · 5 minutes',seconds:300,location:'blackwoodAsylum',room:'orderly-station',
  routes:['wardman'],source:'signed orderly station memorandum',
  text:'Filed a factual memorandum summarizing personally observed details. No accusation or patient diagnosis was asserted.'},
 policeMemo:{label:'File a preliminary police inquiry memo · 10 minutes',seconds:600,location:'metropolitanPolice',room:'station-duty-room',
  routes:['investigator'],source:'police station preliminary memorandum',
  text:'Submitted a preliminary report with sources and the coroner’s observations. The case remains unresolved and no arrest was requested.'},
 wardRoster:{label:"Consult ward staffing book · 5 minutes",seconds:300,location:'blackwoodAsylum',room:'orderly-station',routes:["wardman"],source:'scene evidence',text:'Observation of scene evidence.'},
 visitorRegister:{label:"Consult visitor sign-in book · 5 minutes",seconds:300,location:'blackwoodAsylum',room:'reception',routes:["wardman","investigator"],source:'scene evidence',text:'Observation of scene evidence.'},
 bellStatement:{label:"Speak to the duty porter · 5 minutes",seconds:300,location:'blackwoodAsylum',room:'reception',routes:["wardman","investigator"],source:'scene evidence',text:'Observation of scene evidence.'},
 passageMark:{label:"Examine the passage threshold · 5 minutes",seconds:300,location:'blackwoodAsylum',room:'patient-ward',routes:["wardman"],source:'scene evidence',text:'Observation of scene evidence.'},
 clothingAccount:{label:"Ask about the corridor figure · 5 minutes",seconds:300,location:'blackwoodAsylum',room:'reception',routes:["investigator"],source:'scene evidence',text:'Observation of scene evidence.'}
});
function now(world){const clock=root.FE_WORLD_CLOCK;if(!clock?.calendar||!world?.clock)return null;return clock.calendar(world.clock)?.iso||null}
function advanceWorld(world){
 if(!root.FE_SHARED_WORLD?.valid?.(world,world?.id))return {ok:false};
 const at=now(world);if(!at||at<TIME)return {ok:true,status:'not-due'};
 if(!world.incidents?.[CASE_ID])root.FE_ASYLUM_INCIDENT.start(world,{id:CASE_ID,at:TIME,victimId:'unnamed-asylum-resident'});
 root.FE_ASYLUM_EVIDENCE?.ensure?.(world,CASE_ID);
 if(at>=ARRIVAL&&!world.morgue?.bodies?.[BODY_ID])
  root.FE_MORGUE_REGISTRY.admit(world,{bodyId:BODY_ID,incidentId:CASE_ID,arrivedAt:ARRIVAL});
 if(at>=EXAM&&!world.morgue?.reports?.[BODY_ID]){
  const truth=world.worldTruth[CASE_ID];
  truth.evidenceReady=true;
  truth.verifiedTimeline={medicalFindings:[...FINDINGS]};
  root.FE_MORGUE_REGISTRY.examine(world,{bodyId:BODY_ID,examinerId:'districtCoroner',examinedAt:EXAM,findings:[...FINDINGS]});
 }
 return {ok:true,status:at>=EXAM?'examined':at>=ARRIVAL?'admitted':'reported'};
}
function visible(world){return root.FE_ASYLUM_INCIDENT?.publicFile?.(world,CASE_ID)||null}
function permission(save){return save?.casePermissions?.[CASE_ID]||null}
function seen(save,id){return !!save?.incidentObservations?.records?.some(e=>e.incidentId===CASE_ID&&e.eventId==='asylum:'+id)}
function preview(save,world,id,where){
 const action=ACTIONS[id],record=visible(world);
 const scene=root.FE_ASYLUM_EVIDENCE?.EXHIBITS?.[id]||null;
 if(!record||!action)return {ok:false,reason:'No verified inquiry is available'};
 if(!action.routes.includes(save?.characterRoute))return {ok:false,reason:'Not available to this career'};
 if(save.paused||save.phase==='report')return {ok:false,reason:'The game clock is not active'};
 if(where?.locationId!==action.location||where?.roomId!==action.room)return {ok:false,reason:'Visit the named room to do this'};
 if(where.dev)return {ok:false,reason:'Developer rooms cannot produce case evidence'};
 if(seen(save,id))return {ok:false,reason:'This observation is already recorded'};
 if((id==='wardRecord'||id==='wardCorridor')&&save.phase!=='day')
  return {ok:false,reason:'Regular ward rounds have ended for the day'};
 const iso=root.FE_WASHINGTON_TIME?.now?.(save)?.iso;
 if(!iso||iso<record.at)return {ok:false,reason:'The incident has not occurred yet'};
 const minute=+(iso.slice(11,13))*60+(+iso.slice(14,16));
 if(['notice','reception','stationMemo','medical'].includes(id)&&(minute<8*60||minute*60+(save.worldCalendarRemainder||0)+action.seconds>=17*3600))
  return {ok:false,reason:'Reception and station staff are available between 8 AM and 5 PM'};
 if(id==='stationMemo'&&(+save?.patrolDuty?.reportsFiled||0)<2)
  return {ok:false,reason:'Your sergeant has not yet assigned you case assistance. First file two ordinary patrol reports'};
 if(id==='stationMemo'&&save.patrolDuty?.onDuty)
  return {ok:false,reason:'Finish your assigned Hillsdale shift before requesting outside-beat assistance'};
 if(id==='reception'&&save.patrolDuty?.onDuty)
  return {ok:false,reason:'Off-duty civilian inquiries only outside Hillsdale'};
 if(id==='medical'&&!permission(save))
  return {ok:false,reason:'A written station-sergeant referral is required'};
 if(id==='medical'&&!world?.morgue?.reports?.[BODY_ID])
  return {ok:false,reason:'The coroner has not filed the report'};
 if(id==='medical'&&iso<world.morgue.reports[BODY_ID].examinedAt)
  return {ok:false,reason:'The coroner has not yet issued this report'};
 if(id==='wardMemo'&&(!seen(save,'wardRecord')||!seen(save,'wardCorridor')))
  return {ok:false,reason:'The memorandum requires both your own ward record and corridor observation'};
 if(id==='policeMemo'&&(!seen(save,'reception')||!seen(save,'medical')||!permission(save)))
  return {ok:false,reason:'A sourced reception account, authorized report and referral are required'};
 if(id==='policeMemo'&&save.patrolDuty?.onDuty)
  return {ok:false,reason:'Outside-beat inquiry must be filed during your own off-duty time'};
 if(scene){
  const observed=root.FE_ASYLUM_EVIDENCE?.describe?.(world,id,CASE_ID);
  if(!observed)return {ok:false,reason:'Scene evidence is not available'};
  if(iso<observed.at)return {ok:false,reason:'This evidence has not yet appeared'};
  if(save.characterRoute==='investigator'&&save.patrolDuty?.onDuty)
   return {ok:false,reason:'This work is outside your assigned Hillsdale patrol'};
 }

 if(!root.FE_WASHINGTON_TIME?.canSpend?.(save,action.seconds) ||
   (save.phase==='day'&&root.FE_WASHINGTON_TIME.phaseSecondsRemaining(save)<=action.seconds))
  return {ok:false,reason:'Insufficient time in this duty window'};
 return {ok:true,id,action,seconds:action.seconds};
}
function apply(save,world,id,where,{spentSeconds}={}){
 const result=preview(save,world,id,where);if(!result.ok)return result;
 if(spentSeconds!==result.seconds)return {ok:false,reason:'The full action duration has not been charged'};
 const action=result.action;
 const sceneObservation=root.FE_ASYLUM_EVIDENCE?.EXHIBITS?.[id]?
  root.FE_ASYLUM_EVIDENCE.describe(world,id,CASE_ID):null;
 if(id==='stationMemo'){
  if(!save.casePermissions)save.casePermissions={};
  save.casePermissions[CASE_ID]={incidentId:CASE_ID,access:'coroner-report',issuedBy:'station-sergeant',
   scope:'copy-only',date:save.gameDate,rank:'patrolman'};
 }
 const record=root.FE_ASYLUM_INCIDENT.observe(save,{incidentId:CASE_ID,eventId:'asylum:'+id,
  source:sceneObservation?.source||action.source,
  description:sceneObservation?.description||action.text,
  at:root.FE_WASHINGTON_TIME.now(save)?.iso||save.gameDate});
 if(!record.ok)return record;
 if(id==='medical'){
  const allowed=root.FE_MORGUE_REGISTRY.requestReport(world,BODY_ID,{
   route:save.characterRoute,permission:permission(save)});
  if(!allowed.ok)return allowed;
  save.morgueExaminations=Array.isArray(save.morgueExaminations)?save.morgueExaminations:[];
  if(!save.morgueExaminations.some(x=>x.caseId===CASE_ID))
   save.morgueExaminations.push({caseId:CASE_ID,source:action.source,date:allowed.report.examinedAt,
    publicFinding:allowed.report.findings.join(' ')});
 }
 root.FE_MISSIONS?.start?.(save,{id:'inquiry:'+CASE_ID+':'+save.characterRoute,
  templateId:'asylum-inquiry',date:save.gameDate,locationId:action.location});
 if(id==='wardMemo'||id==='policeMemo'){
  const missionId='inquiry:'+CASE_ID+':'+save.characterRoute;
  root.FE_MISSIONS?.step?.(save,missionId,'file',{eventId:'asylum:'+id+':'+CASE_ID,at:save.gameDate});
  if(id==='wardMemo'){
   if(!save.wardmanStanding)save.wardmanStanding={version:1,workplaceTrust:50,familyPressure:20,documentedConcerns:[]};
   if(!save.wardmanStanding.documentedConcerns.includes(CASE_ID)){
    save.wardmanStanding.documentedConcerns.push(CASE_ID);
    save.wardmanStanding.workplaceTrust=Math.min(100,save.wardmanStanding.workplaceTrust+2);
   }
  }
 }
 root.FE_LIFE_HISTORY?.record?.(save,{id:'asylum:'+id+':'+CASE_ID,date:save.gameDate,
  source:sceneObservation?.source||action.source,
  text:sceneObservation?.description||action.text});
 return {ok:true,actionId:id,observation:record.observation||null};
}
const api=Object.freeze({CASE_ID,BODY_ID,TIME,ARRIVAL,EXAM,FINDINGS,ACTIONS,advanceWorld,visible,preview,apply,permission,seen});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_ASYLUM_STORY=api;
})(typeof window!=='undefined'?window:globalThis);
