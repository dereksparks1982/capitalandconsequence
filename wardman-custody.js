/* Alternate-history 1878 District Asylum: Edmund's severe custody consequences.
 * Experimental lobotomy is fictional in this era, with no operative details.
 * A witnessed pattern, warning, outside review and seeded risk are required.
 */
(function(root){'use strict';
const CASE='asylum-ward-death-1878';
const ACTIONS=Object.freeze({
 wardDisobey:{seconds:600,severity:2,description:'Edmund openly defied a patient-ward instruction. The refusal was witnessed and recorded.'},
 wardSabotage:{seconds:900,severity:3,description:'Edmund damaged asylum property while attempting escape. The damage and his conduct were recorded.'},
 wardAssault:{seconds:900,severity:6,description:'Edmund struck an attendant in a violent confrontation. Witnesses recorded the incident.'},
 wardCooperate:{seconds:900,safeguard:1,description:'Edmund cooperated with the ward staff and requested an entry recording his improved conduct.'},
 wardCounsel:{seconds:1200,safeguard:2,description:'Edmund requested an outside medical opinion and protection from experimental intervention.'},
 wardFateRecord:{seconds:600,description:'Edmund’s final clinical review finding was entered into his private casebook.'}
});
const deny=reason=>({ok:false,reason}),clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const day=iso=>Date.parse(String(iso)+'T12:00:00Z');
const addDays=(iso,n)=>new Date(day(iso)+n*86400000).toISOString().slice(0,10);
function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function roll(s){return hash((s?.sharedWorldId||'')+'|edmund|experimental-lobotomy')%100}
function ensure(save){
 const p=root.FE_WARDMAN_POLITICS?.ensure?.(save);if(!p)return null;
 if(!p.custodyRisk||p.custodyRisk.version!==1)
  p.custodyRisk={version:1,stage:'ordinary',incidents:[],safeguards:[],actions:[],
   notice:null,reviewDate:null,outcome:null,review:null};
 return p.custodyRisk;
}
const score=c=>(c?.incidents||[]).reduce((n,x)=>n+x.severity,0);
const protection=c=>(c?.safeguards||[]).reduce((n,x)=>n+x.weight,0);
function threshold(save){
 const p=save?.wardmanStanding||{},c=p.custodyRisk;
 const police=!!root.FE_WARDMAN_RECORDS?.proof?.(save)?.police;
 return clamp(15+score(c)*6+(p.familyPressure>=70?8:0)-protection(c)*15-(police?20:0),5,88);
}
function preview(save,id){
 if(!Object.hasOwn(ACTIONS,id))return deny('Unknown custody action.');
 if(save?.characterRoute!=='wardman')return deny('Only Edmund may perform this action.');
 const p=save.wardmanStanding,c=p?.custodyRisk;
 if(p?.status!=='patient')return deny('Edmund is not currently confined.');
 if(c?.actions?.some(x=>x.id===id))return deny('Already documented.');
 if(id==='wardFateRecord')return c?.outcome?{ok:true}:deny('No completed clinical review exists.');
 if(c?.outcome==='lobotomy')return deny('The lobotomy permanently ended Edmund’s playable career.');
 if(c?.outcome)return deny('The independent review has already concluded.');
 if(ACTIONS[id].severity&&c?.stage==='review-pending')
  return deny('New misconduct is not permitted during the pending procedure review.');
 return {ok:true};
}
function apply(save,world,id,seconds){
 const permission=preview(save,id);if(!permission.ok)return permission;
 const spec=ACTIONS[id];if(seconds!==spec.seconds)return deny('Full action time was not spent.');
 if(!save.sharedWorldId||!world?.incidents?.[CASE])return deny('No valid campaign incident exists.');
 const p=root.FE_WARDMAN_POLITICS.ensure(save),c=ensure(save),date=save.gameDate;
 let description=spec.description;
 if(spec.severity){
  c.incidents.push({id,date,severity:spec.severity,source:'witnessed ward incident'});
  p.workplaceTrust=clamp(p.workplaceTrust-3*spec.severity,0,100);
  p.familyPressure=clamp(p.familyPressure+4*spec.severity,0,100);
  if(c.stage!=='review-pending'&&score(c)>=8&&c.incidents.length>=2&&
     c.incidents.some(x=>x.id==='wardAssault')){
   c.stage='review-pending';c.notice=date;c.reviewDate=addDays(date,3);
   description+=' The asylum director has recommended an experimental lobotomy, under the game’s fictional 1878 charter. An outside review is set for '+c.reviewDate+'. Edmund can document peaceful conduct, seek an independent opinion or successfully appeal confinement before that date.';
  }
 }else if(spec.safeguard){
  c.safeguards.push({id,date,weight:spec.safeguard,
   source:id==='wardCounsel'?'independent medical request':'documented cooperation'});
 }
 c.actions.push({id,date,source:'patient-ward custody record'});
 root.FE_LIFE_HISTORY?.record?.(save,{id:'wardman-custody:'+id+':'+CASE,date,
  source:'patient-ward custody record',text:description});
 return {ok:true,source:'District Asylum custody register',description,stage:c.stage,reviewDate:c.reviewDate};
}
function advance(save){
 if(save?.characterRoute!=='wardman')return {events:[]};
 const p=save.wardmanStanding,c=p?.custodyRisk;
 if(c?.stage!=='review-pending'||c.outcome)return {events:[]};
 if(p.status==='escaped'){
  c.stage='suspended';c.outcome='absconded-before-review';
  const description='The experimental intervention is suspended while Edmund is absent under an unresolved legal custody order. He has not been discharged.';
  root.FE_LIFE_HISTORY?.record?.(save,{id:'wardman-custody:absconded:'+CASE,
   date:save.gameDate,source:'custody register',text:description});
  return {events:[{description}]};
 }
 if(p.status!=='patient'){
  c.stage='cancelled';c.outcome='released-before-review';
  const description='Lawful discharge cancelled the proposed experimental operation.';
  root.FE_LIFE_HISTORY?.record?.(save,{id:'wardman-custody:cancelled:'+CASE,
   date:save.gameDate,source:'clinical review',text:description});
  return {events:[{description}]};
 }
 if(!c.reviewDate||save.gameDate<c.reviewDate)return {events:[]};
 const risk=threshold(save),outcome=roll(save)<risk?'lobotomy':'rejected';
 c.stage='completed';c.outcome=outcome;
 c.review={date:save.gameDate,source:'outside institutional review',
  misconductScore:score(c),protectionScore:protection(c),riskPercent:risk,outcome};
 let description;
 if(outcome==='lobotomy'){
  p.permanentDisability=true;p.careerEnded='experimental-lobotomy';
  description='The fictional asylum carried out an experimental lobotomy. Edmund survived but lost his independent working life. His playable career has permanently ended.';
 }else{
  description='The outside review rejected the proposed lobotomy. Edmund remains confined under a separate order and may continue his normal petition appeal.';
 }
 if(!Array.isArray(save.notes))save.notes=[];
 save.notes.push({date:save.gameDate,source:'independent clinical review',text:description});
 root.FE_LIFE_HISTORY?.record?.(save,{id:'wardman-custody:review:'+CASE,
  date:save.gameDate,source:'independent clinical review',text:description});
 return {events:[{description,outcome}]};
}
function summary(save){
 if(save?.characterRoute!=='wardman')return null;
 const c=save?.wardmanStanding?.custodyRisk;
 return {stage:c?.stage||'ordinary',misconduct:c?.incidents?.length||0,
  protection:c?.safeguards?.length||0,reviewDate:c?.reviewDate||null,
  outcome:c?.outcome||null,careerEnded:!!save?.wardmanStanding?.careerEnded};
}
const api=Object.freeze({CASE,ACTIONS,ensure,score,threshold,roll,preview,apply,advance,summary});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WARDMAN_CUSTODY=api;
})(typeof window!=='undefined'?window:globalThis);
