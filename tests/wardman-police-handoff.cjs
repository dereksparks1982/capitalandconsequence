'use strict';
const assert=require('node:assert/strict');
globalThis.FE_WASHINGTON_TIME={
 now:save=>({iso:save.gameDate+'T14:00'}),
 canSpend:()=>true,phaseSecondsRemaining:()=>30000};
globalThis.FE_WORLD_CLOCK={calendar:clock=>({iso:clock.iso})};
globalThis.FE_SHARED_WORLD=require('../shared-world.js');
globalThis.FE_ASYLUM_INCIDENT=require('../asylum-incident.js');
globalThis.FE_ASYLUM_EVIDENCE=require('../asylum-evidence.js');
globalThis.FE_WARDMAN_POLITICS=require('../wardman-politics.js');
globalThis.FE_WARDMAN_RECORDS=require('../wardman-records.js');
globalThis.FE_WARDMAN_POLICE=require('../wardman-police-evidence.js');
globalThis.FE_MORGUE_REGISTRY=require('../morgue-registry.js');
globalThis.FE_MISSIONS=require('../mission-engine.js');
globalThis.FE_LIFE_HISTORY=require('../life-history.js');
const story=globalThis.FE_ASYLUM_STORY=require('../asylum-story.js');
const CASE=story.CASE_ID,id='wBridgeCase001';
const sam={characterRoute:'investigator',sharedWorldId:id,gameDate:'1878-01-09',
 phase:'day',paused:false,turnSerial:1,
 worldCalendar:{version:1,worldMinute:20000,iso:'1878-01-09T14:00'},
 incidentObservations:{version:1,records:[]},
 npcSimulation:null,otherLives:null,notes:[],patrolDuty:{reportsFiled:2,onDuty:false},
 casePermissions:{[CASE]:{issuedBy:'station-sergeant',incidentId:CASE}}};
const original=FE_SHARED_WORLD.capture(sam,FE_SHARED_WORLD.create(id,sam),'sam');
assert.equal(original.institutionalRecords[CASE].replacement.folio,'WARD-1878-005');
assert.equal(original.institutionalRecords[CASE].policeCertificate,undefined);
const observed=(s,name)=>FE_ASYLUM_INCIDENT.observe(s,{incidentId:CASE,
 eventId:'asylum:'+name,source:'authenticated authorized police work',
 description:'Document physically inspected and recorded',at:FE_WASHINGTON_TIME.now(s).iso,
 locationId:'metropolitanPolice',roomId:'station-duty-room'});
for(const name of ['stationMemo','medical','statementFolio','policeMemo'])
 assert.equal(observed(sam,name).ok,true);
const inquiry={locationId:'blackwoodAsylum',roomId:'reception'},
 station={locationId:'metropolitanPolice',roomId:'station-duty-room'},
 patient={locationId:'blackwoodAsylum',roomId:'patient-ward'};
function doAction(save,world,name,room){
 const allowed=story.preview(save,world,name,room);
 assert.equal(allowed.ok,true,name+': '+allowed.reason);
 const done=story.apply(save,world,name,room,{spentSeconds:allowed.seconds});
 assert.equal(done.ok,true,name+': '+done.reason);
 return done;
}
const wardman={characterRoute:'wardman',sharedWorldId:id,gameDate:'1878-01-09',
 phase:'day',paused:false,
 incidentObservations:{version:1,records:[]},
 wardmanStanding:{version:1,status:'patient',workplaceTrust:25,familyPressure:85,
  petition:{status:'enforced',enforcedAt:'1878-01-08'}},
 familyRecords:{version:1,actions:[],original:null,comparison:null,witness:null,
  hearing:{result:'adverse-order'},appeal:{at:'1878-01-08T14:00',result:'denied'}}};
assert.equal(story.preview(wardman,original,'familyPatientPoliceCopy',patient).ok,false,
 'No private notes may teleport between characters');
const outsider={...sam,characterRoute:'industrialist'};
assert.equal(story.preview(outsider,original,'policeWardmanCompare',inquiry).ok,false);
const compare=doAction(sam,original,'policeWardmanCompare',inquiry);
assert.match(compare.bridgeOutcome.description,/Sam compared/);
const signed=doAction(sam,original,'policeWardmanCertify',station);
assert.equal(signed.bridgeOutcome.ok,true);
assert.equal(original.institutionalRecords[CASE].policeCertificate,undefined,
 'Sam personal station work cannot alter an already-saved world');
assert.equal(sam.wardmanPoliceFiling.caseId,CASE);
const forged=JSON.parse(JSON.stringify(sam));
forged.incidentObservations.records=forged.incidentObservations.records.filter(x=>
 x.eventId!=='asylum:policeWardmanCertify');
const isolated=JSON.parse(JSON.stringify(original));
assert.equal(FE_WARDMAN_POLICE.publish(isolated,forged,'forged'),false,
 'A statement cannot be made public without authenticated action provenance');
assert.equal(isolated.institutionalRecords[CASE].policeCertificate,undefined);
const published=FE_SHARED_WORLD.capture(sam,original,'sam');
const certificate=published.institutionalRecords[CASE].policeCertificate;
assert.ok(certificate);
assert.equal(certificate.id,'wardman-police-certificate:'+CASE);
assert.equal(published.events.filter(x=>x.type==='asylum-register-certified').length,1);
assert.equal(FE_SHARED_WORLD.capture(sam,published,'sam').events.filter(x=>x.type==='asylum-register-certified').length,1,
 'The official certificate can never be issued twice');
assert.equal(wardman.familyRecords.policeExtract,undefined,
 'Shared record is public but the personal document was never given to Edmund');
FE_SHARED_WORLD.attach(wardman,published);
assert.equal(wardman.familyRecords.policeExtract,undefined,
 'Loading the shared campaign does not grant private police evidence');
assert.equal(FE_WARDMAN_RECORDS.proof(wardman).police,false);
const copy=doAction(wardman,published,'familyPatientPoliceCopy',patient);
assert.equal(copy.bridgeOutcome.released,false);
assert.equal(wardman.familyRecords.policeExtract.certificateId,certificate.id);
assert.equal(FE_WARDMAN_RECORDS.proof(wardman).police,true);
assert.equal(story.preview(wardman,published,'familyPatientPoliceCopy',patient).ok,false);
const reopened=doAction(wardman,published,'familyReopenAppeal',patient);
assert.equal(reopened.bridgeOutcome.released,true);
assert.equal(wardman.wardmanStanding.status,'employed');
assert.equal(wardman.wardmanStanding.petition.status,'dismissed');
assert.equal(wardman.familyRecords.reopening.result,'overturned');
assert.deepEqual(wardman.currentLocation,{locationId:'blackwoodAsylum',roomId:'reception'});
assert.equal(story.preview(wardman,published,'familyReopenAppeal',patient).ok,false,
 'An accepted independent rehearing cannot be repeated');
assert.equal(published.worldTruth[CASE].culpritRole!==undefined,true);
assert.equal(JSON.stringify(certificate).includes('culpritRole'),false,
 'No private murder solution is included in the police certificate');
console.log('PASS Sam public police certification, private-source rejection, one shared record, Wardman patient copy, earned one-time rehearing and release');
