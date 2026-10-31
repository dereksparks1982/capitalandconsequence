/* Capital & Consequence: the Wardman inheritance paper trail.
 * Documented family financial incentive, NOT proof of an asylum murder.
 * Edmund receives his own addressed papers at the real asylum reception.
 */
(function(root){'use strict';
const CASE='asylum-ward-death-1878';
const ACTIONS=Object.freeze({
 familyEstateLetter:Object.freeze({seconds:600,label:'Read Wardman family settlement notice · 10 minutes'}),
 familyEstateWitness:Object.freeze({seconds:600,label:'Obtain a clerk-witnessed delivery copy · 10 minutes'})
});
const deny=reason=>({ok:false,reason});
const days=(a,b)=>Math.floor((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000);
function has(save,id){return !!save?.incidentObservations?.records?.some(e=>e.incidentId===CASE&&e.eventId==='asylum:'+id)}
function preview(save,world,id){
 if(!Object.hasOwn(ACTIONS,id))return deny('Unknown family estate action.');
 if(save?.characterRoute!=='wardman')return deny('Only Edmund can inspect his own family correspondence.');
 if(save.paused||save.phase!=='day')return deny('The asylum reception registry is closed.');
 const p=save.wardmanStanding;
 if(p?.status==='patient'||p?.careerEnded)return deny('Edmund cannot visit reception while confined.');
 if(!world?.incidents?.[CASE]||!world?.institutionalRecords?.[CASE]?.replacement)
  return deny('The institutional documents have not been posted.');
 if(!has(save,'familyCompare')||!save?.familyRecords?.comparison?.changed)
  return deny('Compare the director’s revised duty book before asking for family correspondence.');
 if(id==='familyEstateLetter'){
  if(!p?.petition)return deny('There is no filed family petition to which this notice refers.');
  if(has(save,id))return deny('The addressed family letter is already in Edmund’s private record.');
 }else{
  if(!has(save,'familyEstateLetter')||!save?.wardmanInheritance?.receivedAt)
   return deny('The original addressed letter must be received first.');
  if(has(save,id))return deny('An independent copy has already been signed.');
  if(days(save.gameDate,save.wardmanInheritance.receivedAt)<1)
   return deny('The clerk must check the original delivery book on a later business day.');
 }
 return {ok:true,seconds:ACTIONS[id].seconds};
}
function apply(save,world,id,seconds){
 const can=preview(save,world,id);if(!can.ok)return can;
 if(seconds!==can.seconds)return deny('The full inquiry time has not elapsed.');
 const now=save.gameDate;
 let state=save.wardmanInheritance;
 if(!state||state.version!==1)state=save.wardmanInheritance={version:1,
  receivedAt:null,witnessAt:null,records:[],verified:false};
 let description='';
 if(id==='familyEstateLetter'){
  state.receivedAt=now;
  description='A reception clerk delivered family counsel’s letter addressed to Edmund. It cites a Wardman family settlement: if he is adjudged incapable, a trustee may control his income and voting interests. The signed enclosure identifies a financial incentive, not proof of wrongdoing or murder.';
 }else{
  state.witnessAt=now;state.verified=true;
  description='An independent reception clerk compared the letter to the dated incoming-mail register and signed a delivery certificate. The delivery is now independently corroborated; the letter’s allegations and legal conclusions remain disputed.';
  const p=root.FE_WARDMAN_POLITICS?.ensure?.(save);
  if(p)p.workplaceTrust=Math.min(100,p.workplaceTrust+2);
 }
 state.records.push({id,date:now,source:'personally received Wardman family correspondence',text:description});
 return {ok:true,source:'Wardman family correspondence',description,verified:state.verified};
}
function proof(save){return !!save?.wardmanInheritance?.verified&&!!save.wardmanInheritance.witnessAt&&
 has(save,'familyEstateLetter')&&has(save,'familyEstateWitness')}
function summary(save){
 if(save?.characterRoute!=='wardman')return null;
 const s=save.wardmanInheritance;
 return {receivedAt:s?.receivedAt||null,witnessAt:s?.witnessAt||null,
  verified:proof(save),records:Array.isArray(s?.records)?s.records.map(x=>({...x})):[]};
}
const api=Object.freeze({CASE,ACTIONS,preview,apply,proof,summary});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WARDMAN_INHERITANCE=api;
})(typeof window!=='undefined'?window:globalThis);
