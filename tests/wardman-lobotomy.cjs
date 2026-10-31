'use strict';
const assert=require('node:assert/strict');
globalThis.FE_WASHINGTON_TIME={now:s=>({iso:s.gameDate+'T10:00'}),
 canSpend:()=>true,phaseSecondsRemaining:()=>36000};
globalThis.FE_ASYLUM_INCIDENT={
 publicFile:(w,id)=>w.incidents?.[id]||null,
 observe:(s,row)=>{if(!s.incidentObservations)s.incidentObservations={version:1,records:[]};
 s.incidentObservations.records.push({...row});return {ok:true,observation:row}}
};
globalThis.FE_LIFE_HISTORY={record:(s,r)=>(s.historyTest||(s.historyTest=[])).push(r)};
globalThis.FE_WARDMAN_POLITICS=require('../wardman-politics.js');
globalThis.FE_WARDMAN_RECORDS=require('../wardman-records.js');
globalThis.FE_WARDMAN_CUSTODY=require('../wardman-custody.js');
const story=globalThis.FE_ASYLUM_STORY=require('../asylum-story.js');
const place={locationId:'blackwoodAsylum',roomId:'patient-ward'};
const world={incidents:{[story.CASE_ID]:{id:story.CASE_ID,at:'1878-01-05T09:00'}},
 worldTruth:{[story.CASE_ID]:{culpritRole:'director'}}};
const make=id=>({characterRoute:'wardman',sharedWorldId:id,phase:'day',paused:false,
 gameDate:'1878-01-16',wardmanStanding:{version:1,status:'patient',
 workplaceTrust:20,familyPressure:85,documentedConcerns:[],petition:{status:'enforced'}}});
function doAction(save,id){
 const check=story.preview(save,world,id,place);
 assert.equal(check.ok,true,id+': '+check.reason);
 assert.equal(story.apply(save,world,id,place,{spentSeconds:0}).ok,false);
 const result=story.apply(save,world,id,place,{spentSeconds:check.seconds});
 assert.equal(result.ok,true,id+': '+result.reason);return result;
}
const free=make('employee');free.wardmanStanding.status='employed';
assert.equal(story.preview(free,world,'wardAssault',place).ok,false);
assert.equal(story.preview({...make('cop'),characterRoute:'investigator'},world,'wardAssault',place).ok,false);
const peaceful=make('peaceful');doAction(peaceful,'wardCooperate');
peaceful.gameDate='1878-01-22';
assert.equal(FE_WARDMAN_CUSTODY.advance(peaceful).events.length,0);
function stage(id){
 const save=make(id);doAction(save,'wardDisobey');
 assert.equal(FE_WARDMAN_CUSTODY.summary(save).stage,'ordinary');
 doAction(save,'wardAssault');
 assert.equal(FE_WARDMAN_CUSTODY.summary(save).stage,'review-pending');
 assert.equal(save.wardmanStanding.custodyRisk.reviewDate,'1878-01-19');
 assert.equal(story.preview(save,world,'wardSabotage',place).ok,false);
 return save;
}
const secured=stage('secured');
const before=FE_WARDMAN_CUSTODY.threshold(secured);
doAction(secured,'wardCooperate');doAction(secured,'wardCounsel');
assert.ok(FE_WARDMAN_CUSTODY.threshold(secured)<before);
assert.equal(story.preview(secured,world,'wardCounsel',place).ok,false);
secured.gameDate='1878-01-18';
assert.equal(FE_WARDMAN_CUSTODY.advance(secured).events.length,0);
secured.wardmanStanding.status='employed';secured.gameDate='1878-01-19';
assert.equal(FE_WARDMAN_CUSTODY.advance(secured).events.length,1);
assert.equal(secured.wardmanStanding.custodyRisk.outcome,'released-before-review');
assert.equal(FE_WARDMAN_CUSTODY.advance(secured).events.length,0);
function candidate(operated){
 for(let i=0;i<500;i++){
  const s=make('seed-'+operated+'-'+i);
  if((FE_WARDMAN_CUSTODY.roll(s)<71)===operated)return s;
 }throw Error('Missing deterministic outcome');
}
const injured=candidate(true);doAction(injured,'wardDisobey');doAction(injured,'wardAssault');
injured.gameDate='1878-01-19';
assert.equal(FE_WARDMAN_CUSTODY.advance(injured).events[0].outcome,'lobotomy');
assert.equal(injured.wardmanStanding.careerEnded,'experimental-lobotomy');
assert.equal(story.preview(injured,world,'familyPatientAppeal',place).ok,false);
doAction(injured,'wardFateRecord');
assert.equal(FE_WARDMAN_CUSTODY.advance(injured).events.length,0);
const rejected=candidate(false);doAction(rejected,'wardDisobey');doAction(rejected,'wardAssault');
rejected.gameDate='1878-01-19';
assert.equal(FE_WARDMAN_CUSTODY.advance(rejected).events[0].outcome,'rejected');
assert.equal(rejected.wardmanStanding.careerEnded,undefined);
assert.equal(world.worldTruth[story.CASE_ID].culpritRole,'director');
console.log('PASS Wardman confinement, documented risk, mitigation, discharge, seeded lobotomy or rejection and murder-truth isolation');
