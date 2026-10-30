'use strict';
const assert=require('node:assert/strict');
const bridge=require('../calendar-bridge.js');
globalThis.FE_WORLD_CLOCK=require('../world-clock.js');
globalThis.FE_WASHINGTON_TIME=require('../washington-time.js');
globalThis.FE_SHARED_WORLD=require('../shared-world.js');
globalThis.FE_ASYLUM_INCIDENT=require('../asylum-incident.js');
globalThis.FE_ASYLUM_EVIDENCE=require('../asylum-evidence.js');
globalThis.FE_WARDMAN_POLITICS=require('../wardman-politics.js');
globalThis.FE_MORGUE_REGISTRY=require('../morgue-registry.js');
globalThis.FE_MISSIONS=require('../mission-engine.js');
globalThis.FE_LIFE_HISTORY=require('../life-history.js');
const story=globalThis.FE_ASYLUM_STORY=require('../asylum-story.js');
const casework=globalThis.FE_ASYLUM_CASEWORK=require('../asylum-casework.js');
function make(route,id,date,minute){
 const save={characterRoute:route,sharedWorldId:id,gameDate:date,phase:'day',paused:false,
  turnSerial:1,npcSimulation:{},otherLives:{},reputation:50,notes:[]};
 bridge.start(save,date,minute);
 if(route==='investigator')save.patrolDuty={reportsFiled:2,onDuty:false};
 return save;
}
function source(save,name){
 return FE_ASYLUM_INCIDENT.observe(save,{incidentId:story.CASE_ID,
  eventId:'asylum:'+name,source:'authorized '+name+' record',
  description:'A physically obtained case document.',at:FE_WASHINGTON_TIME.now(save).iso,
  locationId:save.characterRoute==='investigator'?'metropolitanPolice':'blackwoodAsylum',
  roomId:save.characterRoute==='investigator'?'station-duty-room':'orderly-station'});
}
const encountered=new Set(),atStation={locationId:'metropolitanPolice',roomId:'station-duty-room'},
 atWard={locationId:'blackwoodAsylum',roomId:'orderly-station'};
for(let seed=0;seed<72;seed++){
 const id='wcasebook'+seed;
 const edmund=make('wardman',id,'1878-01-05',14*60);
 const first=FE_SHARED_WORLD.create(id,edmund);
 const world=FE_SHARED_WORLD.capture(edmund,first,'edmund-'+seed);
 assert.equal(story.visible(world).id,story.CASE_ID);
 const truth=world.worldTruth[story.CASE_ID].culpritRole;
 encountered.add(truth);
 const culprit=world.incidentScene[story.CASE_ID].persons.find(p=>p.role===truth);
 assert.ok(culprit&&culprit.moments.some(m=>m.time==='1878-01-05T09:00'&&m.at==='private-ward'));
 const sam=make('investigator',id,'1878-01-05',15*60);
 sam.casePermissions={[story.CASE_ID]:{issuedBy:'station-sergeant',incidentId:story.CASE_ID}};
 assert.equal(casework.dossier(sam,world).ready,false);
 assert.equal(casework.dossier(sam,world).intersection.length,0,'No omniscient culprit before investigating');
 assert.equal(casework.dossier(sam,world).suspects.every(s=>s.statement===null),true,
  'Police cannot read sealed suspect statements before checking the station folio');
 assert.equal(casework.dossier(edmund,world).suspects.every(s=>s.statement===null),true,
  'Ward staff cannot read testimony before opening their register');

 assert.equal(casework.canFile(sam,world,atStation,culprit.personId).ok,false);
 for(const action of ['statementFolio','clothingAccount']){
  assert.equal(source(sam,action).ok,true);
 }
 assert.equal(casework.dossier(sam,world).suspects.every(s=>typeof s.statement==='string'),true,
  'Authenticated folio unlocks the testimony but not the solution');
 assert.equal(casework.dossier(sam,world).ready,false);

 assert.equal(casework.dossier(sam,world).ready,false,'Two independent sources still insufficient');
 for(const action of ['bellStatement','policeMemo','medical'])assert.equal(source(sam,action).ok,true);
 for(const action of ['wardRoster','passageMark','visitorRegister','wardMemo'])assert.equal(source(edmund,action).ok,true);
 const police=casework.dossier(sam,world),orderly=casework.dossier(edmund,world);
 assert.equal(police.ready,true);assert.equal(orderly.ready,true);
 assert.deepEqual(police.intersection,[culprit.personId]);
 assert.deepEqual(orderly.intersection,[culprit.personId]);
 assert.equal(police.leads.every(l=>l.candidates.length===2),true,'Individual leads stay ambiguous');
 assert.equal(JSON.stringify(police).includes('"culpritRole"'),false);
 assert.equal(JSON.stringify(police).includes('"worldTruth"'),false);
 assert.equal(sam.incidentObservations.records.some(x=>x.eventId==='asylum:wardRoster'),false);
 assert.equal(edmund.incidentObservations.records.some(x=>x.eventId==='asylum:medical'),false);
 const saveBefore=JSON.stringify(sam);
 assert.equal(casework.file(sam,world,atStation,culprit.personId,{spentSeconds:0}).ok,false);
 assert.equal(JSON.stringify(sam),saveBefore,'Unpaid filings never change records');
 if(seed===0){
  assert.equal(casework.canFile(sam,world,{locationId:'factory'},culprit.personId).ok,false);
  sam.patrolDuty.onDuty=true;
  assert.equal(casework.canFile(sam,world,atStation,culprit.personId).ok,false);
  sam.patrolDuty.onDuty=false;
 }
 const suspect=seed%2===0?culprit.personId:police.suspects.find(x=>x.id!==culprit.personId).id;
 const permitted=casework.canFile(sam,world,atStation,suspect);
 assert.equal(permitted.ok,true);
 assert.equal(permitted.supported,suspect===culprit.personId);
 bridge.spend(sam,600);
 assert.equal(casework.file(sam,world,atStation,suspect,{spentSeconds:600}).ok,true);
 assert.equal(casework.file(sam,world,atStation,suspect,{spentSeconds:600}).ok,false,'No repeat allegation');
 assert.equal(world.incidents[story.CASE_ID].referral,undefined,'Profile filing alone must not mutate prior world snapshot');
 const published=FE_SHARED_WORLD.capture(sam,world,'sam-'+seed);
 assert.equal(published.incidents[story.CASE_ID].referral.accusedId,suspect);
 assert.equal(published.events.filter(e=>e.type==='police-case-referral').length,1);
 assert.equal(FE_SHARED_WORLD.capture(sam,published,'sam-'+seed).events.filter(e=>e.type==='police-case-referral').length,1);
 assert.equal(published.incidents[story.CASE_ID].status,'reported','A report alone is not a verdict');
 assert.equal(casework.review(published),null,'Do not decide before a later day');
 const next=make('wardman',id,'1878-01-06',12*60);
 const reviewed=FE_SHARED_WORLD.capture(next,published,'edmund-'+seed);
 const expected=suspect===culprit.personId?'corroborated':'unsupported';
 assert.equal(reviewed.incidents[story.CASE_ID].referral.decision,expected);
 assert.equal(reviewed.events.filter(e=>e.type.startsWith('case-referral-')).length,1);
 assert.equal(reviewed.incidents[story.CASE_ID].status,expected==='corroborated'?'referred-for-formal-inquiry':'reported');
 assert.equal(casework.review(reviewed),null,'Review is idempotent');
 const restored=JSON.parse(JSON.stringify(sam));
 FE_SHARED_WORLD.attach(restored,JSON.parse(JSON.stringify(reviewed)));
 assert.equal(restored.asylumCasebook.review,expected);
 assert.equal(restored.reputation,expected==='corroborated'?53:42);
 assert.equal(restored.patrolDuty.caseCautions||0,expected==='corroborated'?0:1);
 const snapshot=JSON.stringify(restored);
 FE_SHARED_WORLD.attach(restored,reviewed);
 assert.equal(JSON.stringify(restored),snapshot,'The same police review cannot change reputation twice');
 // Edmund's own account remains personal, even after the outside police review.
 assert.equal(casework.file(edmund,world,atWard,culprit.personId,{spentSeconds:600}).ok,true);
 assert.equal(edmund.asylumCasebook.concerns.length,1);
 assert.equal(edmund.asylumCasebook.referrals.length,0);
 assert.equal(world.incidents[story.CASE_ID].referral,undefined);
 if(truth==='director')assert.equal(edmund.wardmanStanding.familyPressure,32);
}
assert.deepEqual([...encountered].sort(),['attendant','director','outside-visitor','patient']);
console.log('PASS 72 shared-world cases: four changing culprits, separate Sam/Edmund clues, sourced referrals, wrong accusation, delayed official reviews, one-time penalties and no conviction');
