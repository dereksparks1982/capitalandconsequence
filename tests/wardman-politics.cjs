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
const waiting=prepared();p.decide(waiting,'familyPrivate');
waiting.gameDate='1878-01-07';
assert.equal(p.advance(waiting).events.length,1);
assert.equal(p.advance(waiting).events.length,0,'Same-day saves do not double-apply pressure');
assert.equal(waiting.wardmanStanding.familyPressure,47);
waiting.gameDate='1878-01-12';
assert.equal(p.advance(waiting).events.length,1);
assert.equal(waiting.wardmanStanding.workplaceTrust,37);
assert.equal(waiting.wardmanStanding.familyPressure,72);
assert.equal(waiting.wardmanStanding.petition.status,'threatened','Confinement remains a threat, not an automatic sentence');
assert.equal(p.canReview(waiting).ok,true);
assert.equal(p.requestReview(waiting).ok,true);
assert.equal(waiting.wardmanStanding.petition.status,'review-requested');
assert.equal(p.requestReview(waiting).ok,false);
const protectedOne=prepared();p.decide(protectedOne,'familyPublic');
protectedOne.gameDate='1878-01-12';p.advance(protectedOne);
assert.equal(protectedOne.wardmanStanding.petition,undefined,'Witnessed meeting prevents unsupported automatic petition');
console.log('PASS family choices, dated consequences, petition safeguards and independent review');
