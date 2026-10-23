/* Capital & Consequence v0.6.56-dev: Samuel Harlan's first routine patrol.
 * Deterministic, profile-local data; no automatic arrests, casebook authority
 * or omniscient police dispatch. Minutes are charged by the caller first.
 */
(function(root){
 'use strict';
 const STREETS=Object.freeze([
  Object.freeze({id:'hillsdale',name:'Barry Farm neighborhood street'}),
  Object.freeze({id:'oldChinatown',name:'Chinatown market street'})
 ]);
 const INCIDENTS=Object.freeze([
  Object.freeze({id:'wagon-obstruction',name:'Wagon blocking the crossing',
   description:'A wagon has stopped across a busy crossing. Nearby pedestrians ask you to clear the way.',
   choices:Object.freeze([
    Object.freeze({id:'warning',label:'Ask the driver to move',record:'Asked the driver to clear the crossing; issued a verbal warning.'}),
    Object.freeze({id:'summons',label:'Record an ordinance summons',record:'Recorded an obstruction summons for the station ledger.'})
   ])}),
  Object.freeze({id:'shop-dispute',name:'Disagreement outside a shop',
   description:'Two customers are arguing outside a shop. You hear raised voices but have not witnessed an assault.',
   choices:Object.freeze([
    Object.freeze({id:'mediate',label:'Separate and speak with both',record:'Separated the parties and recorded their accounts without an arrest.'}),
    Object.freeze({id:'sergeant',label:'Refer the dispute to your sergeant',record:'Recorded the complaint for supervisor review.'})
   ])}),
  Object.freeze({id:'lost-property',name:'Found property',
   description:'A resident hands you a small personal item found on the pavement. Its owner is not present.',
   choices:Object.freeze([
    Object.freeze({id:'custody',label:'Take into station custody',record:'Accepted the item for the station property register.'}),
    Object.freeze({id:'witness',label:'Record the finder’s account',record:'Recorded where the item was found and the finder’s description.'})
   ])}),
  Object.freeze({id:'street-noise',name:'Noise complaint',
   description:'Residents complain of a noisy gathering. You can hear the commotion but no immediate violence.',
   choices:Object.freeze([
    Object.freeze({id:'advise',label:'Ask the group to quiet down',record:'Spoke with the group about the complaint; no summons issued.'}),
    Object.freeze({id:'record',label:'Record the complaint',record:'Recorded the names offered by the complainants for station follow-up.'})
   ])}),
  Object.freeze({id:'street-assistance',name:'Resident requests directions',
   description:'A pedestrian appears lost and approaches your uniform to ask for directions.',
   choices:Object.freeze([
    Object.freeze({id:'assist',label:'Help the pedestrian',record:'Provided directions and completed a routine welfare contact.'}),
    Object.freeze({id:'observe',label:'Note the encounter',record:'Entered a brief duty-book note about the street contact.'})
   ])})
 ]);
 const SCENE_BY_ID=new Map(INCIDENTS.map(x=>[x.id,x]));
 const BEATS=new Set(STREETS.map(x=>x.id));
 function hash(key){let h=2166136261;for(const ch of String(key)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
 function isDate(x){return /^\d{4}-\d{2}-\d{2}$/.test(x||'')}
 function starter(){return {version:1,nextId:1,beatMinutes:0,walks:0,summons:0,
  contacts:0,reportsFiled:0,pending:null,logs:[],lastAction:null}}
 function ensure(save){
  if(!save||typeof save!=='object')throw Error('Patrol needs a save');
  const old=save.patrolDuty;
  if(!old||old.version!==1||!Array.isArray(old.logs))save.patrolDuty=starter();
  return save.patrolDuty;
 }
 function access(save,action,locationId,roomId=null){
  if(save?.characterRoute!=='investigator')return {ok:false,reason:'Patrol duty belongs to the appointed patrolman.'};
  if(save.paused||save.phase==='report'||(action!=='report'&&save.phase!=='day'))return {ok:false,reason:'The duty window is closed.'};
  if(action==='walk'&&!BEATS.has(locationId))return {ok:false,reason:'Travel to a designated neighborhood street to walk the beat.'};
  if(action==='report'&&(locationId!=='metropolitanPolice'||roomId!=='station-duty-room'))return {ok:false,reason:'Return to the patrolmen’s duty room at the Metropolitan Police station to complete the report.'};
  if(action==='respond'&&!BEATS.has(locationId))return {ok:false,reason:'You must remain on the street where the incident occurred.'};
  return {ok:true};
 }
 function walk(save,{locationId,date,profileId,spentSeconds}){
  const allow=access(save,'walk',locationId);
  if(!allow.ok)return allow;
  if(!isDate(date)||typeof profileId!=='string'||!profileId)return {ok:false,reason:'A dated officer profile is required.'};
  const duty=ensure(save);
  if(duty.pending)return {ok:false,reason:'Finish the pending street incident before beginning another patrol.'};
  if(spentSeconds!==600)return {ok:false,reason:'Ten charged minutes are required for a patrol circuit.'};
  const serial=duty.nextId++,scene=INCIDENTS[hash(profileId+'|'+date+'|'+locationId+'|'+serial)%INCIDENTS.length];
  const incident={id:'PAT-'+String(serial).padStart(4,'0'),typeId:scene.id,
   locationId,date,description:scene.description,status:'awaiting-response',
   disposition:null,dispositionId:null,requiresReport:true};
  duty.pending=incident;duty.walks++;duty.beatMinutes+=10;
  duty.lastAction='Walked '+STREETS.find(x=>x.id===locationId).name+' and encountered: '+scene.name+'.';
  return {ok:true,incident:{...incident},scene};
 }
 function respond(save,{locationId,choiceId,spentSeconds}){
  const allow=access(save,'respond',locationId);if(!allow.ok)return allow;
  const duty=ensure(save),pending=duty.pending,scene=SCENE_BY_ID.get(pending?.typeId);
  if(!pending||pending.status!=='awaiting-response'||pending.locationId!==locationId||!scene)
   return {ok:false,reason:'No unresolved encounter at this street location.'};
  const choice=scene.choices.find(x=>x.id===choiceId);
  if(!choice)return {ok:false,reason:'That response is not available for this situation.'};
  if(spentSeconds!==300)return {ok:false,reason:'Five charged minutes are required to handle the incident.'};
  pending.status='awaiting-report';pending.disposition=choice.record;pending.dispositionId=choice.id;
  duty.contacts++;
  if(scene.id==='wagon-obstruction'&&choice.id==='summons')duty.summons++;
  duty.lastAction=pending.disposition+' Return to the station to file the report.';
  return {ok:true,incident:{...pending}};
 }
 function report(save,{locationId,roomId,spentSeconds}){
  const allow=access(save,'report',locationId,roomId);if(!allow.ok)return allow;
  const duty=ensure(save),pending=duty.pending;
  if(!pending||pending.status!=='awaiting-report')return {ok:false,reason:'There is no completed incident waiting for a station report.'};
  if(spentSeconds!==300)return {ok:false,reason:'Five charged minutes are required for written paperwork.'};
  const record={...pending,status:'filed',reportText:pending.disposition};
  duty.logs.push(record);if(duty.logs.length>80)duty.logs.shift();
  duty.reportsFiled++;duty.pending=null;
  duty.lastAction='Filed '+record.id+': '+record.disposition;
  return {ok:true,record};
 }
 function scene(save){const incident=ensure(save).pending;return incident?SCENE_BY_ID.get(incident.typeId)||null:null}
 function summary(save){const duty=ensure(save);return {walks:duty.walks,beatMinutes:duty.beatMinutes,
  contacts:duty.contacts,summons:duty.summons,reportsFiled:duty.reportsFiled,
  pending:duty.pending?{...duty.pending}:null,lastAction:duty.lastAction,logs:duty.logs.map(x=>({...x}))};}
 const api=Object.freeze({STREETS,INCIDENTS,ensure,access,walk,respond,report,scene,summary});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_PATROL=api;
})(typeof window!=='undefined'?window:globalThis);
