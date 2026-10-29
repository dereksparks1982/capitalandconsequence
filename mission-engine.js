/* Capital & Consequence: durable mission stages and externally verified work.
 * Missions retain stable identities, choice histories and explicit terminal states.
 * This foundational slice mirrors Edmund's actually completed ward work. It does
 * not invent a murder, issue police orders or independently charge game time.
 */
(function(root){'use strict';
const TEMPLATES=Object.freeze({
 'asylum-inquiry':Object.freeze({label:'District Asylum · Unexplained Death',routes:Object.freeze(['wardman','investigator']),
  initial:'inquiry',transitions:Object.freeze({inquiry:Object.freeze({})})}),
 'ward-round':Object.freeze({label:'District Asylum · Ordinary Ward Service',route:'wardman',
  initial:'assigned',transitions:Object.freeze({
   assigned:Object.freeze({attend:'awaiting-report'}),
   'awaiting-report':Object.freeze({file:'completed'})
  })})
});
function ensure(save){
 if(!save||typeof save!=='object')throw Error('Playable mission save required');
 if(!save.missions||save.missions.version!==1||!save.missions.active||!Array.isArray(save.missions.history))
  save.missions={version:1,active:{},history:[]};
 return save.missions;
}
function find(save,id){const m=ensure(save);return m.active[id]||m.history.find(x=>x.id===id)||null}
function start(save,{id,templateId,date,locationId}={}){
 const spec=TEMPLATES[templateId];
 if(!spec||(spec.routes?!spec.routes.includes(save?.characterRoute):save?.characterRoute!==spec.route))return {ok:false,reason:'Mission not available to this career'};
 if(typeof id!=='string'||!/^[-\w:]{3,100}$/.test(id))return {ok:false,reason:'Invalid mission identity'};
 const store=ensure(save),old=find(save,id);
 if(old)return {ok:true,status:'existing',mission:{...old}};
 const mission={id,templateId,title:spec.label,stage:spec.initial,status:'active',
  date:String(date||save.gameDate),locationId:String(locationId||''),
  choices:[],appliedEffects:[],completedAt:null};
 store.active[id]=mission;
 return {ok:true,status:'created',mission:{...mission}};
}
function step(save,id,action,{eventId,at,choiceId}={}){
 const store=ensure(save),mission=store.active[id],spec=TEMPLATES[mission?.templateId];
 if(!mission){
  const completed=store.history.find(m=>m.id===id);
  return completed?{ok:true,status:'duplicate',mission:{...completed}}:{ok:false,reason:'Unknown or completed mission'};
 }
 if(!spec||(spec.routes?!spec.routes.includes(save.characterRoute):save.characterRoute!==spec.route))return {ok:false,reason:'Wrong career'};
 const next=spec.transitions[mission.stage]?.[action];
 if(!next)return {ok:false,reason:'This mission action is unavailable at the present stage'};
 if(typeof eventId!=='string'||!eventId||eventId.length>120)return {ok:false,reason:'Verified source event ID required'};
 if(mission.appliedEffects.includes(eventId))return {ok:true,status:'duplicate',mission:{...mission}};
 // The source action has already been validated and timed by its work engine.
 // Neither mission bookkeeping nor reloading should charge time or wages.
 mission.appliedEffects.push(eventId);
 mission.choices.push({eventId,action,choiceId:choiceId||null,at:String(at||save.gameDate)});
 mission.stage=next;
 if(next==='completed'){
  mission.status='completed';mission.completedAt=String(at||save.gameDate);
  delete store.active[id];store.history.push(mission);
 }
 return {ok:true,status:mission.status,mission:{...mission}};
}
function abandon(save,id,reason='Withdrawn'){
 const store=ensure(save),mission=store.active[id];
 if(!mission)return {ok:false,reason:'Only active missions can be abandoned'};
 mission.status='abandoned';mission.stage='abandoned';
 mission.choices.push({eventId:'abandon:'+id,action:'abandon',at:String(save.gameDate),reason:String(reason).slice(0,180)});
 delete store.active[id];store.history.push(mission);
 return {ok:true,mission:{...mission}};
}
function syncWard(save,kind,result){
 if(save?.characterRoute!=='wardman'||!result?.ok)return {ok:false,reason:'No verified orderly duty'};
 const p=result.assignment||result.log;
 if(!p||typeof p.id!=='string')return {ok:false,reason:'Missing underlying ward assignment'};
 const id='ward:'+p.id;
 if(kind==='assign')return start(save,{id,templateId:'ward-round',date:p.date,locationId:'blackwoodAsylum'});
 if(kind==='attend')return step(save,id,'attend',{eventId:'ward:'+p.id+':attend',at:p.date,choiceId:p.choiceId});
 if(kind==='file')return step(save,id,'file',{eventId:'ward:'+p.id+':file',at:p.date,choiceId:p.choiceId});
 return {ok:false,reason:'Unknown ward action'};
}
function pages(save){
 const store=ensure(save),all=[...Object.values(store.active),...store.history];
 if(!all.length)return [];
 return [{id:'missions',section:'Assignments',title:'Assigned Work & Outcomes',
  kicker:'Work actually accepted or completed by this character',paragraphs:[],
  items:all.slice(-60).reverse().map(m=>({heading:m.date+' · '+m.title,
   text:m.id+' · '+m.status+' · '+m.stage+(m.choices.length?' · '+m.choices.map(c=>c.action+(c.choiceId?' ('+c.choiceId+')':'')).join(', '):'')}))}];
}
const api=Object.freeze({TEMPLATES,ensure,find,start,step,abandon,syncWard,pages});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_MISSIONS=api;
})(typeof window!=='undefined'?window:globalThis);
