'use strict';
const assert=require('node:assert/strict');
globalThis.FE_WASHINGTON_TIME={now:s=>({iso:s.gameDate+'T20:30'}),
 canSpend:()=>true,phaseSecondsRemaining:()=>12000};
globalThis.FE_ASYLUM_INCIDENT={publicFile:(w,id)=>w.incidents?.[id]||null,
 observe:(s,row)=>{(s.incidentObservations||(s.incidentObservations={version:1,records:[]})).records.push({...row});return {ok:true,observation:row}}};
globalThis.FE_LIFE_HISTORY=require('../life-history.js');
globalThis.FE_WARDMAN_POLITICS=require('../wardman-politics.js');
globalThis.FE_WARDMAN_RECORDS=require('../wardman-records.js');
globalThis.FE_WARDMAN_ESCAPE=require('../wardman-escape.js');
globalThis.FE_WARDMAN_CUSTODY=require('../wardman-custody.js');
const story=globalThis.FE_ASYLUM_STORY=require('../asylum-story.js');
const CASE=story.CASE_ID,patient={locationId:'blackwoodAsylum',roomId:'patient-ward'};
const reception={locationId:'blackwoodAsylum',roomId:'reception'};
const world={incidents:{[CASE]:{id:CASE,at:'1878-01-05T09:00'}}};
function make(id){
 return {characterRoute:'wardman',sharedWorldId:id,gameDate:'1878-01-16',
 phase:'day',paused:false,wardmanStanding:{version:1,status:'patient',
 petition:{status:'enforced'},familyPressure:70,workplaceTrust:25}};
}
function act(save,id,room){
 const p=story.preview(save,world,id,room);assert.equal(p.ok,true,id+': '+p.reason);
 assert.equal(story.apply(save,world,id,room,{spentSeconds:0}).ok,false);
 const r=story.apply(save,world,id,room,{spentSeconds:p.seconds});assert.equal(r.ok,true,id+': '+r.reason);
 return r;
}
assert.equal(story.preview({...make('not-edmund'),characterRoute:'investigator'},world,'wardEscapeInspect',patient).ok,false);
assert.equal(story.preview({...make('employed'),wardmanStanding:{status:'employed',petition:{status:'dismissed'}}},world,'wardEscapeInspect',patient).ok,false);
assert.equal(story.preview(make('blocked'),world,'wardEscapeAttempt',patient).ok,false);
function find(success){
 for(let i=0;i<600;i++){
  const s=make('wesc'+i);
  if((FE_WARDMAN_ESCAPE.roll(s)<62)===success)return s;
 }
 throw Error('Missing stable seeded outcome');
}
const free=find(true),caught=find(false);
for(const s of [free,caught]){
 act(s,'wardEscapeInspect',patient);act(s,'wardEscapeQuiet',patient);
 s.phase='night';
 assert.equal(story.preview(s,world,'wardEscapeAttempt',patient).ok,false,'Must wait one night');
 s.gameDate='1878-01-17';
 const r=act(s,'wardEscapeAttempt',patient);
 assert.equal(FE_WARDMAN_ESCAPE.summary(s).outcome,s===free?'escaped':'caught');
 assert.equal(story.preview(s,world,'wardEscapeAttempt',patient).ok,false,'No rerolls');
 assert.equal(s.lifeHistory.events.length,3,'Exactly three private story records');
 assert.equal(s.wardmanStanding.petition.status,'enforced','Escape is not an acquittal');
 if(s===free){
  assert.equal(r.escapeOutcome.escaped,true);
  assert.equal(s.wardmanStanding.status,'escaped');
  assert.deepEqual(s.currentLocation,reception);
  assert.equal(FE_WARDMAN_CUSTODY.advance(s).events.length,0,'No artificial lawful-discharge declaration');
  s.phase='day';act(s,'wardEscapeSurrender',reception);
  assert.equal(s.wardmanStanding.status,'patient');
  assert.equal(s.wardmanStanding.absconder,false);
  assert.deepEqual(s.currentLocation,patient);
 }else{
  assert.equal(r.escapeOutcome.escaped,false);
  assert.equal(s.wardmanStanding.status,'patient');
  assert.equal(s.wardmanStanding.familyPressure,88);
 }
}
console.log('PASS Edmund confirmed custody, planned attempt, clock and room checks, seeded outcomes, escape vs discharge, surrender and life-history persistence');
