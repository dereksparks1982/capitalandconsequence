/* Eli Crowe main story: a witnessed choice at Le Paon d'Or.
 * No generated police knowledge or unearned murder evidence. */
(function(root){'use strict';
const ID='main:peacock-favor',VENUE='secondNightclub',ROOM='doorman-post';
const ACTIONS=Object.freeze({
 hear:{seconds:600,label:'Hear the anxious patron · 10 minutes'},
 return:{seconds:600,label:'Return the sealed envelope · 10 minutes'},
 manager:{seconds:600,label:'Give the envelope to the manager · 10 minutes'},
 sell:{seconds:600,label:'Sell the envelope to the stranger · 10 minutes'},
 followUp:{seconds:600,label:'Face the consequences · 10 minutes'}
});
const CHOICES=Object.freeze({
 return:{trust:3,exposure:0,cashCents:0,text:'The patron recovered the unopened envelope and thanked Eli for safeguarding it.'},
 manager:{trust:2,exposure:1,cashCents:0,text:'The floor manager signed a receipt for the sealed envelope, taking responsibility for its return.'},
 sell:{trust:-4,exposure:4,cashCents:250,text:'A stranger paid Eli $2.50 for the sealed envelope. Eli still does not know its contents.'}
});
const deny=reason=>({ok:false,reason});
const days=(now,then)=>Math.floor((Date.parse(now+'T12:00:00Z')-Date.parse(then+'T12:00:00Z'))/86400000);
function ensure(save){
 if(save?.characterRoute!=='criminal')return null;
 if(!save.peacockStory||save.peacockStory.version!==1)
  save.peacockStory={version:1,stage:'unmet',offeredAt:null,choice:null,choiceAt:null,finishedAt:null,
   events:[],outcome:null,trust:0,exposure:0,cashCents:0};
 return save.peacockStory;
}
function preview(save,id,locationId,roomId,{dev=false}={}){
 if(!Object.hasOwn(ACTIONS,id))return deny('Unknown story action.');
 if(save?.characterRoute!=='criminal')return deny('Only Eli may work this story.');
 if(save.paused||save.phase!=='night')return deny('The patron only visits after dark.');
 if(dev||locationId!==VENUE||roomId!==ROOM)return deny('Visit the actual nightclub doorman post.');
 if(save.doormanDuty?.pending)return deny('Finish your waiting ordinary patron first.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(save.gameDate||''))return deny('Invalid Washington date.');
 const state=save.peacockStory,stage=state?.stage||'unmet';
 if(id==='hear'){
  if(stage!=='unmet')return deny('The meeting has already occurred.');
  if((save.doormanDuty?.totalSegments||0)<2)return deny('Work two paid door contacts first.');
 }else if(Object.hasOwn(CHOICES,id)){
  if(stage!=='offered')return deny('The envelope was not offered to Eli.');
  if(days(save.gameDate,state.offeredAt)<1)return deny('The decision can be made on a later night.');
 }else if(id==='followUp'){
  if(stage!=='decided')return deny('There is no decision awaiting consequences.');
  if(days(save.gameDate,state.choiceAt)<1)return deny('Come back another night.');
 }
 return {ok:true,seconds:ACTIONS[id].seconds,label:ACTIONS[id].label};
}
function apply(save,id,locationId,roomId,{spentSeconds,dev=false}={}){
 const permission=preview(save,id,locationId,roomId,{dev});if(!permission.ok)return permission;
 if(spentSeconds!==permission.seconds)return deny('Full scene time has not been spent.');
 const state=ensure(save),date=save.gameDate;
 let description='',cashDeltaCents=0;
 if(id==='hear'){
  state.stage='offered';state.offeredAt=date;
  description='An anxious patron asks Eli to safeguard a sealed, addressed envelope until the next night. A stranger watching from the street offers money for it. Eli has no knowledge of its contents.';
  root.FE_MISSIONS?.start?.(save,{id:ID,templateId:'peacock-favor',date,locationId:VENUE});
 }else if(Object.hasOwn(CHOICES,id)){
  const option=CHOICES[id];state.stage='decided';state.choice=id;state.choiceAt=date;
  state.trust+=option.trust;state.exposure+=option.exposure;state.cashCents+=option.cashCents;
  cashDeltaCents=option.cashCents;description=option.text;
  if(cashDeltaCents)save.personalCash=(Math.round((Number.isFinite(save.personalCash)?save.personalCash:0)*100)+cashDeltaCents)/100;
  root.FE_MISSIONS?.step?.(save,ID,'choose',{eventId:'peacock:choice:'+id,choiceId:id,at:date});
 }else{
  state.stage='resolved';state.finishedAt=date;
  state.outcome=state.choice==='sell'?'buyer-traced':state.choice==='manager'?'manager-receipt':'patron-protected';
  description=state.choice==='sell'?
   'The patron returned and discovered her envelope missing. Eli witnessed her complaint but no police report is automatically created. The stranger has disappeared.':
   state.choice==='manager'?
   'The patron recovered her envelope from the manager. A receipt protects the handoff, but the stranger recognized Eli.':
   'The patron returned and confirmed the envelope was intact. Eli gained her trust, but the stranger remembers being refused.';
  root.FE_MISSIONS?.step?.(save,ID,'followUp',{eventId:'peacock:followup:'+state.outcome,choiceId:state.outcome,at:date});
 }
 const entry={id:'peacock:'+id,date,source:'witnessed Golden Peacock door encounter',
  description,cashDeltaCents,locationId:VENUE,roomId:ROOM};
 state.events.push(entry);
 root.FE_LIFE_HISTORY?.record?.(save,{id:'main-story:'+entry.id,date,source:entry.source,text:description});
 return {ok:true,description,source:entry.source,outcome:state.outcome,stage:state.stage,cashDeltaCents};
}
function summary(save){
 if(save?.characterRoute!=='criminal')return null;
 const s=save.peacockStory;
 return {stage:s?.stage||'unmet',choice:s?.choice||null,outcome:s?.outcome||null,
  trust:s?.trust||0,exposure:s?.exposure||0,cashCents:s?.cashCents||0,
  events:Array.isArray(s?.events)?s.events.map(x=>({...x})) : []};
}
const api=Object.freeze({ID,VENUE,ROOM,ACTIONS,CHOICES,ensure,preview,apply,summary});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PEACOCK_STORY=api;
})(typeof window!=='undefined'?window:globalThis);
