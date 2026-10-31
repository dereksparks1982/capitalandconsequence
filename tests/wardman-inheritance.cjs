'use strict';
const assert=require('node:assert/strict');
globalThis.FE_WASHINGTON_TIME={now:s=>({iso:s.gameDate+'T10:00'}),canSpend:()=>true,
 phaseSecondsRemaining:()=>32000};
globalThis.FE_ASYLUM_INCIDENT={publicFile:(w,id)=>w.incidents[id],
 observe:(s,v)=>{(s.incidentObservations.records).push({...v});return {ok:true,observation:v}}};
globalThis.FE_LIFE_HISTORY=require('../life-history.js');
globalThis.FE_WARDMAN_POLITICS=require('../wardman-politics.js');
globalThis.FE_WARDMAN_RECORDS=require('../wardman-records.js');
globalThis.FE_WARDMAN_INHERITANCE=require('../wardman-inheritance.js');
const story=globalThis.FE_ASYLUM_STORY=require('../asylum-story.js');
const caseId=story.CASE_ID,room={locationId:'blackwoodAsylum',roomId:'reception'};
const save={characterRoute:'wardman',phase:'day',paused:false,sharedWorldId:'ward-inherit',
 gameDate:'1878-01-12',familyRecords:{version:1,comparison:{changed:true}},
 wardmanStanding:{version:1,status:'employed',workplaceTrust:26,familyPressure:80,
  petition:{status:'threatened'},familyMeetings:[],documentedConcerns:[]},
 incidentObservations:{version:1,records:[{incidentId:caseId,eventId:'asylum:familyCompare'}]}};
const world={incidents:{[caseId]:{id:caseId,at:'1878-01-05T09:00'}},
 institutionalRecords:{[caseId]:{replacement:{enteredBy:'directors office'}}},
 worldTruth:{[caseId]:{culpritRole:'outside-visitor'}}};
const allowed=id=>story.preview(save,world,id,room);
assert.equal(allowed('familyEstateWitness').ok,false);
assert.equal(FE_WARDMAN_RECORDS.proof(save).score,2);
const first=allowed('familyEstateLetter');
assert.equal(first.ok,true,first.reason);
assert.equal(story.apply(save,world,'familyEstateLetter',room,{spentSeconds:0}).ok,false);
assert.equal(story.apply(save,world,'familyEstateLetter',room,{spentSeconds:600}).ok,true);
assert.equal(allowed('familyEstateLetter').ok,false);
assert.equal(allowed('familyEstateWitness').ok,false,'Delivery copy needs another day');
assert.equal(FE_WARDMAN_INHERITANCE.proof(save),false,'One letter is not authenticated evidence');
save.gameDate='1878-01-13';
assert.equal(allowed('familyEstateWitness').ok,true);
assert.equal(story.apply(save,world,'familyEstateWitness',room,{spentSeconds:600}).ok,true);
assert.equal(FE_WARDMAN_INHERITANCE.proof(save),true);
assert.equal(FE_WARDMAN_RECORDS.proof(save).score,4,'Independent clerk adds 2 corroboration points');
assert.equal(save.wardmanStanding.workplaceTrust,28);
assert.equal(save.lifeHistory.events.length,2);
assert.equal(allowed('familyEstateWitness').ok,false,'Clerk certificate cannot be multiplied');
const preserved=JSON.parse(JSON.stringify(save));
assert.equal(FE_WARDMAN_INHERITANCE.proof(preserved),true);
assert.equal(FE_WARDMAN_INHERITANCE.summary(preserved).records.length,2);
assert.equal(world.worldTruth[caseId].culpritRole,'outside-visitor');
assert.equal(FE_WARDMAN_INHERITANCE.summary(preserved).records.some(e=>e.text.includes('outside-visitor')),false);
const confined={...save,wardmanStanding:{...save.wardmanStanding,status:'patient'}};
assert.equal(FE_WARDMAN_INHERITANCE.preview(confined,world,'familyEstateLetter').ok,false);
assert.equal(story.preview({...save,characterRoute:'investigator'},world,'familyEstateLetter',room).ok,false);
console.log('PASS Wardman family financial motive, delayed authenticated mail, evidence weighting, save persistence, secrecy and real room access');
