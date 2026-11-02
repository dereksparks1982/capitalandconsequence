'use strict';
const assert=require('node:assert/strict');
const duty=require('../orderly-duty.js');
const book=require('../ward-service-register.js');
const date='1878-02-05',station={locationId:duty.VENUE,roomId:duty.STATION},
 ward={locationId:duty.VENUE,roomId:duty.WARD};
const fixture=()=>({characterRoute:'wardman',phase:'day',paused:false,personalCash:6.75,notes:[]});
function supplyProfile(){
 for(let i=0;i<100;i++){
  const save=fixture();
  const issued=duty.assign(save,{...station,date,profileId:'ward-supply-'+i,spentSeconds:300});
  if(issued.task.id==='supplies')return {save,profile:'ward-supply-'+i,issued};
 }
 throw Error('No valid supply-shortage assignment');
}
const {save,issued,profile}=supplyProfile();
assert.equal(book.read(save).service['WARD-0001'],undefined);
assert.equal(book.preview(save,{action:'handover',date,...station}).ok,false);
assert.equal(duty.attend(save,{...ward,choiceId:'request',spentSeconds:600}).ok,true);
assert.equal(Object.keys(book.read(save).requests).length,0,'Request must not be filed before station paperwork');
assert.equal(duty.file(save,{...station,spentSeconds:300}).ok,true);
let state=book.read(save);
assert.equal(Object.keys(state.requests).length,1);
const id=Object.keys(state.requests)[0];
assert.equal(state.requests[id].status,'awaiting-stores');
assert.equal(state.requests[id].received,false);
assert.equal(state.service['WARD-0001'].taskId,'supplies');
assert.equal(state.service['WARD-0001'].choiceId,'request');
assert.equal(book.preview(save,{action:'followup',id,date,...station}).ok,false,'No instant same-day follow-up');
assert.equal(book.preview(save,{action:'escalate',id,date,...station}).ok,false,'No instant escalation');
for(let n=0;n<2;n++){
 const assignment=duty.assign(save,{...station,date,profileId:profile,spentSeconds:300});
 assert.equal(assignment.ok,true);
 assert.equal(duty.attend(save,{...ward,choiceId:assignment.task.choices[0].id,spentSeconds:600}).ok,true);
 assert.equal(duty.file(save,{...station,spentSeconds:300}).ok,true);
}
assert.equal(duty.summary(save).totalAssignments,3);
assert.equal(book.read(save).service['WARD-0003']?.wageCents,35);
const emptyCheck=JSON.stringify(save);
assert.equal(book.preview(save,{action:'handover',date,...station}).seconds,300);
assert.equal(JSON.stringify(save),emptyCheck,'Reading shift reports cannot mutate files');
const hand=book.transact(save,{action:'handover',date,...station,spentSeconds:300,token:'ward:handover:1'});
assert.equal(hand.ok,true);
assert.equal(hand.record.services.length,3);
assert.equal(hand.record.supplyRequests.includes(id),true);
assert.equal(hand.record.managerDecision,null);
assert.equal(book.transact(save,{action:'handover',date,...station,spentSeconds:300,token:'ward:handover:1'}).repeated,true);
assert.equal(book.transact(save,{action:'handover',date,...station,spentSeconds:300,token:'ward:handover:2'}).ok,false);
const next='1878-02-06';
const snapshot=JSON.stringify(save);
assert.equal(book.transact(save,{action:'followup',id,date:next,...station,spentSeconds:0,token:'ward:fake'}).ok,false);
assert.equal(JSON.stringify(save),snapshot);
const follow=book.transact(save,{action:'followup',id,date:next,...station,spentSeconds:300,token:'ward:follow'});
assert.equal(follow.ok,true);
assert.equal(book.read(save).requests[id].status,'follow-up-filed');
assert.equal(book.read(save).requests[id].received,false,'No fictional supplies arrive after filing');
assert.equal(book.transact(save,{action:'followup',id,date:next,...station,spentSeconds:300,token:'ward:follow'}).repeated,true);
assert.equal(book.preview(save,{action:'escalate',id,date:next,...station}).ok,false,'Must wait for two elapsed days');
const third='1878-02-07';
const escalated=book.transact(save,{action:'escalate',id,date:third,...station,spentSeconds:300,token:'ward:escalate'});
assert.equal(escalated.ok,true);
assert.equal(book.read(save).requests[id].status,'referred-to-supervisor');
assert.equal(book.read(save).requests[id].escalated,third);
assert.equal(book.read(save).requests[id].received,false);
assert.equal(book.transact(save,{action:'escalate',id,date:third,...station,spentSeconds:300,token:'ward:other'}).ok,false);
assert.equal(book.read(JSON.parse(JSON.stringify(save))).requests[id].events.length,3);
const fake=fixture();fake.wardServiceRegister=book.read(save);
fake.wardmanStanding={status:'patient'};
assert.equal(book.preview(fake,{action:'escalate',id,date:third,...station}).ok,false);
fake.wardmanStanding={status:'orderly'};fake.characterRoute='criminal';
assert.equal(book.preview(fake,{action:'escalate',id,date:third,...station}).ok,false);
assert.equal(book.preview(save,{action:'handover',date:'1878-99-99',...station}).ok,false);
assert.equal(save.personalCash,7.80,'Existing wage stream unchanged by administrative report actions');
console.log('PASS Edmund real supplies work, 3-service station handover, dated follow-up/escalation, no magical stock/manager decision, wages and save-safe receipts');
