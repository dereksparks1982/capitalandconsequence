'use strict';
const assert=require('node:assert/strict');
globalThis.FE_WASHINGTON_TIME={now:s=>({iso:s.gameDate+'T11:00'}),
 canSpend:()=>true,phaseSecondsRemaining:()=>29000};
globalThis.FE_WORLD_CLOCK={calendar:clock=>({iso:clock.iso})};
globalThis.FE_SHARED_WORLD={valid:(w,id)=>w?.id===id&&!!w.clock,
 recordEvent:(w,event)=>{w.events.push(event);return {status:'recorded'}}};
globalThis.FE_ASYLUM_INCIDENT={publicFile:(w,id)=>w.incidents?.[id]||null,
 observe:(s,row)=>{(s.incidentObservations||(s.incidentObservations={version:1,records:[]})).records.push(row);return {ok:true,observation:row}}};
globalThis.FE_LIFE_HISTORY=require('../life-history.js');
globalThis.FE_WARDMAN_POLITICS=require('../wardman-politics.js');
globalThis.FE_WARDMAN_INHERITANCE=require('../wardman-inheritance.js');
globalThis.FE_WARDMAN_RECORDS=require('../wardman-records.js');
globalThis.FE_WARDMAN_ESTATE_POLICE=require('../wardman-estate-police.js');
const story=globalThis.FE_ASYLUM_STORY=require('../asylum-story.js'),CASE=story.CASE_ID;
const world={id:'wTrustBridge',clock:{iso:'1878-01-11T14:00'},incidents:{[CASE]:{id:CASE,at:'1878-01-05T09:00'}},
 institutionalRecords:{},events:[]};
FE_WARDMAN_RECORDS.advanceWorld(world);
assert.equal(world.institutionalRecords[CASE].trustDocket.filedAt,'1878-01-10T09:00');
assert.equal(world.events.filter(e=>e.type==='civil-trust-filing').length,1);
const police={characterRoute:'investigator',gameDate:'1878-01-11',phase:'day',paused:false,
 sharedWorldId:world.id,patrolDuty:{onDuty:false},
 casePermissions:{[CASE]:{issuedBy:'station-sergeant'}},
 incidentObservations:{version:1,records:[
 {incidentId:CASE,eventId:'asylum:policeWardmanCompare'},
 {incidentId:CASE,eventId:'asylum:policeWardmanCertify'}]}};
const station={locationId:'metropolitanPolice',roomId:'station-duty-room'};
function doAction(s,id,place){
 const check=story.preview(s,world,id,place);assert.equal(check.ok,true,id+': '+check.reason);
 assert.equal(story.apply(s,world,id,place,{spentSeconds:0}).ok,false);
 const done=story.apply(s,world,id,place,{spentSeconds:check.seconds});
 assert.equal(done.ok,true,id+': '+done.reason);return done;
}
assert.equal(story.preview(police,world,'policeEstateCompare',station).ok,false);
doAction(police,'policeEstateAbstract',station);
assert.equal(FE_WARDMAN_ESTATE_POLICE.publish(world,police,'sam'),false,'Unsigned comparison cannot become public');
doAction(police,'policeEstateCompare',station);
assert.equal(world.institutionalRecords[CASE].trustCertificate,undefined,'Character action is not an atomic world publication');
assert.equal(FE_WARDMAN_ESTATE_POLICE.publish(world,police,'sam'),true);
assert.equal(FE_WARDMAN_ESTATE_POLICE.publish(world,police,'sam'),false,'Certificate cannot be issued twice');
const inmate={characterRoute:'wardman',gameDate:'1878-01-12',phase:'day',paused:false,sharedWorldId:world.id,
 wardmanStanding:{version:1,status:'patient',workplaceTrust:25,familyPressure:75,petition:{status:'enforced'}},
 incidentObservations:{version:1,records:[]}};
const patient={locationId:'blackwoodAsylum',roomId:'patient-ward'};
assert.equal(story.preview(inmate,world,'familyEstatePoliceCopy',{locationId:'blackwoodAsylum',roomId:'reception'}).ok,false);
assert.equal(FE_WARDMAN_ESTATE_POLICE.proof(inmate),false,'No automatic awareness of public papers');
doAction(inmate,'familyPatientEstatePoliceCopy',patient);
assert.equal(FE_WARDMAN_ESTATE_POLICE.proof(inmate),true);
assert.equal(FE_WARDMAN_RECORDS.proof(inmate).score,3);
assert.equal(story.preview(inmate,world,'familyPatientEstatePoliceCopy',patient).ok,false);
assert.equal(world.worldTruth,undefined);
assert.equal(JSON.stringify(world.institutionalRecords[CASE].trustCertificate).includes('culprit'),false);
console.log('PASS public civil trust filing, sworn Sam comparison, one shared certificate, Edmund in-person patient delivery and non-omniscience');
