'use strict';
const assert=require('node:assert/strict');
const bridge=require('../calendar-bridge.js');
globalThis.FE_WORLD_CLOCK=require('../world-clock.js');
globalThis.FE_WASHINGTON_TIME=require('../washington-time.js');
globalThis.FE_SHARED_WORLD=require('../shared-world.js');
globalThis.FE_ASYLUM_INCIDENT=require('../asylum-incident.js');
globalThis.FE_ASYLUM_EVIDENCE=require('../asylum-evidence.js');
globalThis.FE_WARDMAN_POLITICS=require('../wardman-politics.js');
globalThis.FE_WARDMAN_RECORDS=require('../wardman-records.js');
globalThis.FE_MORGUE_REGISTRY=require('../morgue-registry.js');
globalThis.FE_MISSIONS=require('../mission-engine.js');
globalThis.FE_LIFE_HISTORY=require('../life-history.js');
const story=globalThis.FE_ASYLUM_STORY=require('../asylum-story.js');
const orderly=require('../orderly-duty.js');
const CASE=story.CASE_ID;
const ward={locationId:'blackwoodAsylum',roomId:'orderly-station'};
const patient={locationId:'blackwoodAsylum',roomId:'patient-ward'};
const reception={locationId:'blackwoodAsylum',roomId:'reception'};
const hospital={locationId:'governmentHospital',roomId:'reception'};
function scenario(id,preserve){
 const save={characterRoute:'wardman',sharedWorldId:id,gameDate:'1878-01-05',
  phase:'day',paused:false,turnSerial:1,npcSimulation:{},otherLives:{},notes:[]};
 bridge.start(save,'1878-01-05',9*60+20);
 let world=FE_SHARED_WORLD.capture(save,FE_SHARED_WORLD.create(id,save),'edmund-'+id);
 assert.equal(story.visible(world).id,CASE);
 function action(name,where){
  const ready=story.preview(save,world,name,where);
  assert.equal(ready.ok,true,name+': '+ready.reason);
  const elapsed=bridge.spend(save,ready.seconds);
  assert.equal(elapsed,ready.seconds/60);
  const out=story.apply(save,world,name,where,{spentSeconds:ready.seconds});
  assert.equal(out.ok,true,name+': '+out.reason);
  return out;
 }
 function day(when,minute=13*60){
  bridge.start(save,when,minute);
  world=FE_SHARED_WORLD.capture(save,world,'edmund-'+id);
  FE_WARDMAN_POLITICS.advance(save);
  return world;
 }
 action('wardRecord',ward);
 if(preserve){
  assert.equal(story.apply(save,world,'familyPreserve',ward,{spentSeconds:0}).ok,false,
   'Paperwork cannot be completed without full elapsed minutes');
  action('familyPreserve',ward);
  assert.equal(save.familyRecords.original.folio,'WARD-1878-005');
 }
 action('wardCorridor',patient);
 action('passageMark',patient);
 action('visitorRegister',reception);
 action('wardMemo',ward);
 action('familyPrivate',reception);
 assert.equal(save.wardmanStanding.petition,undefined,'Private meeting alone creates no confinement');
 day('1878-01-07');
 assert.equal(world.institutionalRecords[CASE].revisionDate,'1878-01-07T08:30');
 assert.equal(world.events.filter(x=>x.type==='institution-record-amendment').length,1);
 assert.equal(FE_WARDMAN_RECORDS.summary(save,world).amended,false,
  'No unearned knowledge of amended papers');
 assert.equal(story.preview(save,world,'familyPreserve',ward).ok,false,
  'A late copy cannot masquerade as the genuine original');
 action('familyCompare',ward);
 assert.equal(FE_WARDMAN_RECORDS.summary(save,world).amended,true);
 assert.equal(world.institutionalRecords[CASE].original.folio,'WARD-1878-005',
  'Shared original remains immutable when director changes the public entry');
 assert.equal(save.familyRecords.comparison.changed,true);
 return {save,worldRef:()=>world,day,action};
}
const defended=scenario('wfamilydefense',true);
defended.action('familyWitness',reception);
defended.day('1878-01-12');
assert.equal(defended.save.wardmanStanding.petition.status,'threatened');
defended.action('familyReview',reception);
assert.equal(defended.save.wardmanStanding.petition.status,'review-requested');
assert.equal(story.preview(defended.save,defended.worldRef(),'familyHearing',hospital).ok,false,
 'Hearing cannot occur the day the petition is requested');
defended.day('1878-01-14');
defended.action('familyHearing',hospital);
assert.equal(defended.save.wardmanStanding.petition.status,'dismissed',
 'Dated original, comparison and witness defeat the uncorroborated family petition');
assert.equal(defended.save.wardmanStanding.status,'employed');
assert.equal(story.preview(defended.save,defended.worldRef(),'familyHearing',hospital).ok,false);
const pending=scenario('wfamilypending',false);
pending.day('1878-01-12');
pending.action('familyReview',reception);
pending.day('1878-01-14');
pending.action('familyHearing',hospital);
assert.equal(pending.save.wardmanStanding.petition.status,'adverse-order');
assert.equal(pending.save.wardmanStanding.petition.enforcementDate,'1878-01-16');
assert.equal(story.preview(pending.save,pending.worldRef(),'familyAppeal',reception).ok,true);
pending.day('1878-01-15');
pending.action('familyWitness',reception);
pending.action('familyAppeal',reception);
assert.equal(pending.save.wardmanStanding.petition.status,'dismissed',
 'New porter corroboration allows reversal of adverse order');
pending.day('1878-01-16');
assert.notEqual(pending.save.wardmanStanding.status,'patient','Reversed petition cannot confine Edmund');
const failed=scenario('wfamilyconfined',false);
failed.day('1878-01-12');
failed.action('familyReview',reception);
failed.day('1878-01-14');
failed.action('familyHearing',hospital);
failed.day('1878-01-15');
assert.notEqual(failed.save.wardmanStanding.status,'patient','No early forced transfer');
failed.day('1878-01-16');
assert.equal(failed.save.wardmanStanding.status,'patient');
assert.equal(failed.save.wardmanStanding.petition.status,'enforced');
assert.deepEqual(failed.save.currentLocation,{locationId:'blackwoodAsylum',roomId:'patient-ward'});
assert.equal(orderly.access(failed.save,'assign','blackwoodAsylum','orderly-station').ok,false);
assert.equal(story.preview(failed.save,failed.worldRef(),'familyWitness',reception).ok,false);
assert.equal(story.preview(failed.save,failed.worldRef(),'familyPatientAppeal',patient).ok,true);
failed.action('familyPatientAppeal',patient);
assert.equal(failed.save.familyRecords.appeal.result,'denied','One unsupported patient appeal cannot conjure exonerating proof');
assert.equal(story.preview(failed.save,failed.worldRef(),'familyPatientAppeal',patient).ok,false,
 'No repeated appeal spam');
assert.equal(failed.worldRef().worldTruth[CASE].culpritRole!==undefined,true);
assert.equal(FE_ASYLUM_EVIDENCE.roster(failed.worldRef()).every(x=>x.culpritRole===undefined),true,
 'Private murderer identity is never exposed through the family petition');
console.log('PASS Wardman original register, dated alteration, hearing, new-evidence appeal, confinement, employment restriction and source privacy');
