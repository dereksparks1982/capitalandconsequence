/* Capital & Consequence: Edmund's institutional family pressure and documented responses.
 * Confinement is never an automatic outcome of a single family dispute.
 * The institution retains a recorded petition with its factual provenance.
 */
(function(root){'use strict';
 const CASE='asylum-ward-death-1878';
 const CHOICES=Object.freeze({
  familyPublic:Object.freeze({label:'Request a witnessed family discussion · 10 minutes',
   response:'Requested a witnessed discussion and a copy of the institution memorandum.',
   trust:5,pressure:8}),
  familyPrivate:Object.freeze({label:'Agree to speak with your brother privately · 10 minutes',
   response:'Accepted a private meeting without surrendering the original memorandum.',
   trust:-4,pressure:15}),
  familyDecline:Object.freeze({label:'Decline and preserve the official record · 10 minutes',
   response:'Declined the private meeting and lodged a formal request to retain the record.',
   trust:2,pressure:11})
 });
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 function ensure(save){
  if(!save||save.characterRoute!=='wardman')throw Error('Only Edmund has Wardman family standing');
  if(!save.wardmanStanding||save.wardmanStanding.version!==1)
   save.wardmanStanding={version:1,workplaceTrust:50,familyPressure:20,documentedConcerns:[]};
  const p=save.wardmanStanding;
  if(!Array.isArray(p.documentedConcerns))p.documentedConcerns=[];
  if(!Array.isArray(p.familyMeetings))p.familyMeetings=[];
  if(!Array.isArray(p.familyEvents))p.familyEvents=[];
  if(typeof p.workplaceTrust!=='number')p.workplaceTrust=50;
  if(typeof p.familyPressure!=='number')p.familyPressure=20;
  if(!p.status)p.status='employed';
  return p;
 }
 function isReady(save,id=CASE){
  if(!save||save.characterRoute!=='wardman')return false;
  return !!save.incidentObservations?.records?.some(x=>x.incidentId===id&&x.eventId==='asylum:wardMemo');
 }
 function canDecide(save,choice,id=CASE){
  if(!Object.hasOwn(CHOICES,choice))return {ok:false,reason:'Unknown family response'};
  if(!isReady(save,id))return {ok:false,reason:'Complete a factual institutional memorandum before discussing the report'};
  const p=ensure(save);
  if(p.familyMeetings.some(m=>m.incidentId===id))return {ok:false,reason:'This family meeting has already been recorded'};
  return {ok:true};
 }
 function decide(save,choice,id=CASE){
  const allowed=canDecide(save,choice,id);if(!allowed.ok)return allowed;
  const p=ensure(save),option=CHOICES[choice];
  p.workplaceTrust=clamp(p.workplaceTrust+option.trust,0,100);
  p.familyPressure=clamp(p.familyPressure+option.pressure,0,100);
  const meeting={id:'family:'+id,incidentId:id,choice,date:save.gameDate,
   summary:option.response,witnessPresent:choice==='familyPublic',trustDelta:option.trust,
   pressureDelta:option.pressure};
  p.familyMeetings.push(meeting);
  if(p.familyPressure>=60&&p.workplaceTrust<=40&&!p.petition)
   p.petition={status:'threatened',date:save.gameDate,incidentId:id,
    reason:'Contested family allegations; no medical or judicial finding'};
  return {ok:true,meeting:{...meeting},workplaceTrust:p.workplaceTrust,
   familyPressure:p.familyPressure,petition:p.petition?{...p.petition}:null};
 }
 function advance(save){
  if(save?.characterRoute!=='wardman')return {events:[]};
  const p=ensure(save),created=[];
  const today=Date.parse(String(save.gameDate||'')+'T00:00:00Z');
  if(!Number.isFinite(today))return {events:[]};
  for(const meeting of p.familyMeetings){
   if(!meeting?.incidentId||!CHOICES[meeting.choice])continue;
   const started=Date.parse(String(meeting.date)+'T00:00:00Z');
   if(!Number.isFinite(started)||today<started)continue;
   const days=Math.floor((today-started)/86400000);
   const scheduled=meeting.choice==='familyPrivate'?
    [{day:2,trust:-3,pressure:12,text:'A private family letter questions Edmund’s reliability.'},
     {day:7,trust:-8,pressure:25,text:'An allegation has been drafted for institutional review.'}]:
    meeting.choice==='familyDecline'?
    [{day:2,trust:-1,pressure:7,text:'The family renews its request for a private meeting.'},
     {day:7,trust:-3,pressure:12,text:'A family complaint is recorded, without any medical finding.'}]:
    [{day:2,trust:1,pressure:3,text:'An independent observer confirms that a witnessed meeting occurred.'}];
   for(const item of scheduled){
    const id='family:'+meeting.incidentId+':'+item.day+'d';
    if(days<item.day||p.familyEvents.some(v=>v.id===id))continue;
    p.workplaceTrust=clamp(p.workplaceTrust+item.trust,0,100);
    p.familyPressure=clamp(p.familyPressure+item.pressure,0,100);
    const event={id,at:save.gameDate,summary:item.text,trustDelta:item.trust,pressureDelta:item.pressure};
    p.familyEvents.push(event);created.push({...event});
    root.FE_LIFE_HISTORY?.record?.(save,{id,date:save.gameDate,source:'Wardman family correspondence',text:item.text});
   }
  }
  if(p.familyPressure>=60&&p.workplaceTrust<=40&&!p.petition)
   p.petition={status:'threatened',date:save.gameDate,incidentId:CASE,
    reason:'Disputed family allegations; no medical or judicial conclusion'};
  return {events:created,petition:p.petition?{...p.petition}:null};
 }
 function canReview(save){
  if(save?.characterRoute!=='wardman')return {ok:false,reason:'Only Edmund may contest his family petition'};
  const p=ensure(save);
  if(p.petition?.status!=='threatened')return {ok:false,reason:'No threatened commitment petition requires a review'};
  return {ok:true};
 }
 function requestReview(save){
  const allow=canReview(save);if(!allow.ok)return allow;
  const p=ensure(save);
  p.petition.status='review-requested';p.petition.reviewRequestedAt=save.gameDate;
  p.petition.reviewBasis='Independent examination requested; family opinion is not a medical diagnosis';
  p.workplaceTrust=clamp(p.workplaceTrust+3,0,100);
  p.familyPressure=clamp(p.familyPressure-5,0,100);
  return {ok:true,petition:{...p.petition},workplaceTrust:p.workplaceTrust,
   familyPressure:p.familyPressure};
 }
 const api=Object.freeze({CHOICES,ensure,isReady,canDecide,decide,advance,canReview,requestReview});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WARDMAN_POLITICS=api;
})(typeof window!=='undefined'?window:globalThis);
