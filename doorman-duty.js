/* Capital & Consequence v0.6.57-dev: ordinary nighttime door work.
 * The proprietor's name and nightclub history are not yet settled.
 * One modest wage per completed shift segment; never a criminal promotion.
 */
(function(root){
 'use strict';
 const ROOM='doorman-post',VENUE='secondNightclub',WAGE_CENTS=30,MAX_SEGMENTS=4;
 const ENCOUNTERS=Object.freeze([
  Object.freeze({id:'unexpected-guest',title:'Visitor without an invitation',
   description:'A visitor approaches the door and asks whether admission is possible.',
   choices:Object.freeze([
    Object.freeze({id:'refer',label:'Refer the visitor to the floor manager',result:'Referred an uninvited guest to the floor manager.'}),
    Object.freeze({id:'decline',label:'Politely decline admission',result:'Declined entry without creating a disturbance.'})
   ])}),
  Object.freeze({id:'coat-parcel',title:'Delivery at the entrance',
   description:'A courier arrives with a wrapped delivery addressed to the establishment.',
   choices:Object.freeze([
    Object.freeze({id:'receipt',label:'Record the parcel and accept custody',result:'Signed for the delivery and logged the parcel at the door.'}),
    Object.freeze({id:'manager',label:'Ask the manager to collect it',result:'Called for management to receive the parcel.'})
   ])}),
  Object.freeze({id:'crowded-entrance',title:'Crowded entrance',
   description:'Several patrons are waiting and the doorway is becoming obstructed.',
   choices:Object.freeze([
    Object.freeze({id:'line',label:'Organize a waiting line',result:'Moved the queue away from the street and kept the entrance clear.'}),
    Object.freeze({id:'wait',label:'Ask waiting patrons for patience',result:'Kept the visitors informed while the entrance cleared.'})
   ])}),
  Object.freeze({id:'wrong-address',title:'Someone looking for another address',
   description:'A passerby mistakes this door for a nearby club and asks to go inside.',
   choices:Object.freeze([
    Object.freeze({id:'directions',label:'Give directions to the right address',result:'Directed the passerby to the correct establishment.'}),
    Object.freeze({id:'staff',label:'Check with another employee first',result:'Confirmed the mistake with staff and helped the passerby.'})
   ])}),
  Object.freeze({id:'tense-visitor',title:'Agitated patron',
   description:'An impatient visitor argues about having to wait at the entrance.',
   choices:Object.freeze([
    Object.freeze({id:'calm',label:'Speak calmly and ask the visitor to wait',result:'De-escalated a complaint about the wait.'}),
    Object.freeze({id:'supervisor',label:'Call for the floor manager',result:'Asked the floor manager to settle the dispute.'})
   ])})
 ]);
 const BY_ID=new Map(ENCOUNTERS.map(e=>[e.id,e]));
 function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
 function ensure(save){
  if(!save||typeof save!=='object')throw Error('A saved city life is required');
  if(!save.doormanDuty||save.doormanDuty.version!==1||!Array.isArray(save.doormanDuty.logs))
   save.doormanDuty={version:1,nextId:1,pending:null,segmentsByDate:{},totalSegments:0,wagesEarnedCents:0,logs:[],lastAction:null};
  return save.doormanDuty;
 }
 function access(save,locationId,roomId){
  if(save?.characterRoute!=='criminal')return {ok:false,reason:'This job belongs to the nightclub doorman.'};
  if(save.paused||save.phase!=='night')return {ok:false,reason:'The nightclub door shift is worked during Washington Night.'};
  if(locationId!==VENUE||roomId!==ROOM)return {ok:false,reason:'You must be at the nightclub doorman’s post.'};
  return {ok:true};
 }
 function begin(save,{locationId,roomId,date,profileId,spentSeconds}){
  const can=access(save,locationId,roomId);if(!can.ok)return can;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||!profileId)return {ok:false,reason:'A valid date and profile are required.'};
  const duty=ensure(save);
  if(duty.pending)return {ok:false,reason:'Finish the visitor at the door before taking another segment.'};
  if((duty.segmentsByDate[date]||0)>=MAX_SEGMENTS)return {ok:false,reason:'Your paid shift segments for this night are complete.'};
  if(spentSeconds!==600)return {ok:false,reason:'Ten charged minutes are required to watch the entrance.'};
  const seq=duty.nextId++,encounter=ENCOUNTERS[hash(profileId+'|'+date+'|'+seq)%ENCOUNTERS.length];
  duty.pending={id:'DOOR-'+String(seq).padStart(4,'0'),date,typeId:encounter.id,
   status:'awaiting-response',description:encounter.description};
  duty.lastAction='Attended the door and met a visitor.';
  return {ok:true,incident:{...duty.pending},encounter};
 }
 function respond(save,{locationId,roomId,choiceId,spentSeconds}){
  const can=access(save,locationId,roomId);if(!can.ok)return can;
  const duty=ensure(save),p=duty.pending,encounter=BY_ID.get(p?.typeId);
  if(!p||!encounter)return {ok:false,reason:'There is no waiting visitor.'};
  const choice=encounter.choices.find(c=>c.id===choiceId);
  if(!choice)return {ok:false,reason:'That choice is not available for this visitor.'};
  if(spentSeconds!==300)return {ok:false,reason:'Five charged minutes are required to finish the contact.'};
  const previous=Number.isFinite(save.personalCash)?save.personalCash:0;
  const log={...p,status:'completed',choiceId:choice.id,result:choice.result,wageCents:WAGE_CENTS};
  duty.logs.push(log);if(duty.logs.length>80)duty.logs.shift();
  duty.pending=null;duty.totalSegments++;
  duty.segmentsByDate[p.date]=(duty.segmentsByDate[p.date]||0)+1;
  const dates=Object.keys(duty.segmentsByDate).sort();for(const old of dates.slice(0,-60))delete duty.segmentsByDate[old];
  duty.wagesEarnedCents+=WAGE_CENTS;
  save.personalCash=Math.round((previous*100+WAGE_CENTS))/100;
  duty.lastAction=choice.result+' Earned $'+(WAGE_CENTS/100).toFixed(2)+' for the completed segment.';
  return {ok:true,log,wageCents:WAGE_CENTS};
 }
 function encounter(save){return BY_ID.get(ensure(save).pending?.typeId)||null}
 function summary(save){const d=ensure(save);return {totalSegments:d.totalSegments,wagesEarnedCents:d.wagesEarnedCents,
  pending:d.pending?{...d.pending}:null,segmentsByDate:{...d.segmentsByDate},logs:d.logs.map(e=>({...e})),lastAction:d.lastAction};}
 const api=Object.freeze({VENUE,ROOM,WAGE_CENTS,MAX_SEGMENTS,ENCOUNTERS,ensure,access,begin,respond,encounter,summary});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_DOORMAN_DUTY=api;
})(typeof window!=='undefined'?window:globalThis);
