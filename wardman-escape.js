/* Edmund Wardman: fictional asylum escape branch.
 * Distinct from a lawful discharge. No route map or operative escape methods
 * are offered; this is a consequential story decision in existing room UI.
 */
(function(root){'use strict';
const CASE='asylum-ward-death-1878';
const ACTIONS=Object.freeze({
 wardEscapeInspect:{seconds:600,label:'Study the ward restrictions · 10 minutes'},
 wardEscapeQuiet:{seconds:900,label:'Prepare a cautious attempt · 15 minutes'},
 wardEscapeRisk:{seconds:900,label:'Prepare a reckless attempt · 15 minutes'},
 wardEscapeAttempt:{seconds:1800,label:'Attempt to leave confinement · 30 minutes'},
 wardEscapeSurrender:{seconds:600,label:'Return voluntarily to asylum custody · 10 minutes'}
});
const deny=reason=>({ok:false,reason});
const day=d=>Date.parse(String(d)+'T12:00:00Z');
const days=(a,b)=>Math.floor((day(a)-day(b))/86400000);
function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function roll(save){return hash((save?.sharedWorldId||'')+'|wardman|patient-ward|escape')%100}
function ensure(save){
 if(save?.characterRoute!=='wardman')return null;
 if(!save.wardmanEscape||save.wardmanEscape.version!==1)
  save.wardmanEscape={version:1,stage:'confined',observedAt:null,preparedAt:null,
   method:null,attemptedAt:null,outcome:null,roll:null,odds:null,events:[],surrenderedAt:null};
 return save.wardmanEscape;
}
function preview(save,id){
 if(!Object.hasOwn(ACTIONS,id))return deny('Unknown patient-ward action.');
 if(save?.characterRoute!=='wardman')return deny('Only Edmund may decide this.');
 const p=save.wardmanStanding,escape=save.wardmanEscape,stage=escape?.stage||'confined';
 if(p?.careerEnded)return deny('Edmund’s playable career has ended.');
 if(id==='wardEscapeSurrender'){
  if(p?.status!=='escaped'||stage!=='escaped'||p.petition?.status!=='enforced')
   return deny('No outstanding escape and contested custody order are recorded.');
  if(save.phase!=='day')return deny('Present yourself to asylum reception during business hours.');
  return {ok:true};
 }
 if(p?.status!=='patient'||p.petition?.status!=='enforced')
  return deny('A formally enforced confinement order is required.');
 if(id==='wardEscapeInspect'){
  if(stage!=='confined')return deny('The initial restrictions are already documented.');
 }else if(id==='wardEscapeQuiet'||id==='wardEscapeRisk'){
  if(stage!=='observed')return deny('Examine the restrictions before planning an escape.');
 }else if(id==='wardEscapeAttempt'){
  if(stage!=='prepared')return deny('Choose one approach before attempting to leave.');
  if(save.phase!=='night')return deny('The campaign escape scene occurs during Washington Night.');
  if(days(save.gameDate,escape.preparedAt)<1)return deny('Wait until at least the following Washington night.');
 }
 return {ok:true};
}
function apply(save,world,id,seconds){
 const allowed=preview(save,id);if(!allowed.ok)return allowed;
 if(seconds!==ACTIONS[id].seconds)return deny('Full action time must be spent.');
 if(!save.sharedWorldId||!world?.incidents?.[CASE])return deny('No active shared asylum incident.');
 const p=root.FE_WARDMAN_POLITICS.ensure(save),s=ensure(save),date=save.gameDate;
 let description='',escaped=false,returned=false;
 if(id==='wardEscapeInspect'){
  s.stage='observed';s.observedAt=date;
  description='Edmund studied the locked ward, the staff schedule and the old service-passage records. He found a possible opportunity, but no safe route or guaranteed helper.';
 }else if(id==='wardEscapeQuiet'||id==='wardEscapeRisk'){
  s.stage='prepared';s.method=id==='wardEscapeQuiet'?'cautious':'reckless';s.preparedAt=date;
  description=s.method==='cautious'?
   'Edmund prepared a cautious attempt and kept his remaining paperwork intact. He has made no escape yet.':
   'Edmund chose an aggressive attempt without preserving his standing. Failure may strengthen his family’s case against him.';
 }else if(id==='wardEscapeAttempt'){
  s.attemptedAt=date;
  const odds=s.method==='cautious'?62:76;
  s.roll=roll(save);s.odds=odds;
  if(s.roll<odds){
   s.stage='escaped';s.outcome='escaped';p.status='escaped';p.absconder=true;
   p.familyPressure=Math.min(100,(p.familyPressure||0)+12);
   save.currentLocation={locationId:'blackwoodAsylum',roomId:'reception'};
   escaped=true;
   description='Edmund got out of the patient ward and reached the asylum reception exit. He is outside confinement, but the petition order is still enforced and he is considered absent without permission. His freedom is not a lawful discharge.';
  }else{
   s.stage='caught';s.outcome='caught';
   p.familyPressure=Math.min(100,(p.familyPressure||0)+18);
   p.workplaceTrust=Math.max(0,(p.workplaceTrust||0)-10);
   description='Edmund’s attempt failed. Ward staff returned him to the patient ward and recorded the incident. He remains able to use the established formal appeal process.';
  }
 }else{
  s.stage='returned';s.surrenderedAt=date;p.status='patient';p.absconder=false;
  save.currentLocation={locationId:'blackwoodAsylum',roomId:'patient-ward'};
  returned=true;
  description='Edmund presented himself voluntarily and returned to patient custody. His original institutional appeal remains unresolved; surrender is not an admission of murder or incapacity.';
 }
 s.events.push({id,date,source:'Edmund witnessed asylum custody incident',text:description});
 root.FE_LIFE_HISTORY?.record?.(save,{id:'wardman-escape:'+id,date,
  source:'Edmund patient-ward record',text:description});
 return {ok:true,source:'Edmund patient-ward record',description,
  outcome:s.outcome,escaped,returned};
}
function summary(save){
 if(save?.characterRoute!=='wardman')return null;
 const s=save.wardmanEscape;
 return {stage:s?.stage||'confined',method:s?.method||null,outcome:s?.outcome||null,
  absconder:!!save?.wardmanStanding?.absconder,
  events:Array.isArray(s?.events)?s.events.map(x=>({...x})):[]};
}
const api=Object.freeze({CASE,ACTIONS,ensure,roll,preview,apply,summary});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WARDMAN_ESCAPE=api;
})(typeof window!=='undefined'?window:globalThis);
