'use strict';
const assert=require('node:assert/strict'),p=require('../wardman-politics.js');
function prepared(){
 return {characterRoute:'wardman',gameDate:'1878-01-05',wardmanStanding:{
  version:1,workplaceTrust:52,familyPressure:20,documentedConcerns:['asylum-ward-death-1878']},
  incidentObservations:{version:1,records:[
   {incidentId:'asylum-ward-death-1878',eventId:'asylum:wardMemo'}
  ]}};
}
const unprepared=prepared();unprepared.incidentObservations.records.length=0;
assert.equal(p.canDecide(unprepared,'familyPrivate').ok,false);
assert.equal(p.decide({characterRoute:'investigator'},'familyPublic').ok,false);
for(const [choice,trust,pressure] of [['familyPublic',57,28],['familyPrivate',48,35],['familyDecline',54,31]]){
 const s=prepared(),res=p.decide(s,choice);
 assert.equal(res.ok,true);assert.equal(s.wardmanStanding.workplaceTrust,trust);
 assert.equal(s.wardmanStanding.familyPressure,pressure);
 assert.equal(res.petition,null,'A single dispute cannot arbitrarily confine Edmund');
 assert.equal(s.wardmanStanding.familyMeetings.length,1);
 assert.equal(p.decide(s,choice).ok,false,'No repeated family meeting rewards');
 assert.equal(p.canDecide(JSON.parse(JSON.stringify(s)),'familyPublic').ok,false);
}
console.log('PASS family choices persist, one meeting per case, no automatic confinement');
