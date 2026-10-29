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
 const api=Object.freeze({CHOICES,ensure,isReady,canDecide,decide});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WARDMAN_POLITICS=api;
})(typeof window!=='undefined'?window:globalThis);
