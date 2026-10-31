/* Capital & Consequence: Eli Crowe Act IV, Debts Come Due.
 * Three-night source-bound nightclub incident; no criminal omniscience.
 */
(function(root){'use strict';
const ID='main:peacock-debts',VENUE='secondNightclub',ROOM='doorman-post';
const ACTIONS=Object.freeze({
 summons:{seconds:600,label:'Hear the regular’s demand · 10 minutes'},
 settle:{seconds:900,label:'Settle the disputed debt · $3 · 15 minutes'},
 defy:{seconds:900,label:'Refuse the demand · 15 minutes'},
 disclose:{seconds:900,label:'Tell the manager about the demand · 15 minutes'},
 consequence:{seconds:600,label:'Face the regular’s reply · 10 minutes'}
});
const CHOICES=Object.freeze({
 settle:{cost:300,trust:1,exposure:-2},
 defy:{cost:0,trust:-2,exposure:5},
 disclose:{cost:0,trust:2,exposure:1}
});
const deny=reason=>({ok:false,reason});
function days(now,then){const a=Date.parse(now+'T12:00:00Z'),b=Date.parse(then+'T12:00:00Z');
 return Number.isFinite(a)&&Number.isFinite(b)?Math.floor((a-b)/86400000):-1}
function ensure(save){
 if(save?.characterRoute!=='criminal')return null;
 if(!save.peacockDebts||save.peacockDebts.version!==1)save.peacockDebts={
  version:1,stage:'unmet',summonedAt:null,decision:null,decidedAt:null,
  completedAt:null,outcome:null,trust:0,exposure:0,costCents:0,events:[]};
 return save.peacockDebts;
}
function preview(save,id,locationId,roomId,{dev=false}={}){
 if(!Object.hasOwn(ACTIONS,id))return deny('Unknown debt scene.');
 if(save?.characterRoute!=='criminal')return deny('Only Eli may take this action.');
 if(save?.paused||save.phase!=='night')return deny('The contact attends the club at night.');
 if(dev||locationId!==VENUE||roomId!==ROOM)return deny('Attend the genuine nightclub door.');
 if(save.doormanDuty?.pending)return deny('Finish your current paid nightclub visitor first.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(save.gameDate||''))return deny('Missing Washington date.');
 const state=save.peacockDebts,stage=state?.stage||'unmet';
 if(id==='summons'){
  if(stage!=='unmet')return deny('Eli has already heard this demand.');
  if(save.peacockNetwork?.stage!=='resolved'||!save.peacockNetwork.completedAt)
   return deny('First complete The Keeper of Secrets.');
  if(days(save.gameDate,save.peacockNetwork.completedAt)<1)return deny('The regular has not returned yet.');
 }else if(Object.hasOwn(CHOICES,id)){
  if(stage!=='summoned')return deny('No witnessed demand has been made.');
  if(days(save.gameDate,state.summonedAt)<1)return deny('Return to the club on a later night.');
  if(id==='settle'&&Math.round((save.personalCash||0)*100)<300)
   return deny('Eli needs $3 of personal cash to settle the demand.');
 }else if(id==='consequence'){
  if(stage!=='decided')return deny('Eli has not made a choice.');
  if(days(save.gameDate,state.decidedAt)<1)return deny('A later night is required for the reply.');
 }
 return {ok:true,seconds:ACTIONS[id].seconds};
}
function apply(save,id,locationId,roomId,{spentSeconds,dev=false}={}){
 const gate=preview(save,id,locationId,roomId,{dev});if(!gate.ok)return gate;
 if(spentSeconds!==gate.seconds)return deny('Full action time has not been spent.');
 const s=ensure(save),at=save.gameDate;let description='',cashDeltaCents=0;
 if(id==='summons'){
  s.stage='summoned';s.summonedAt=at;
  description='A regular confronts Eli over the earlier Peacock affair. He claims a third party lost money and demands $3. Eli hears the demand but has seen no proof that the debt is genuine.';
  root.FE_MISSIONS?.start?.(save,{id:ID,templateId:'peacock-debts',date:at,locationId:VENUE});
 }else if(Object.hasOwn(CHOICES,id)){
  const c=CHOICES[id];s.stage='decided';s.decision=id;s.decidedAt=at;
  s.trust+=c.trust;s.exposure+=c.exposure;s.costCents+=c.cost;
  if(c.cost){save.personalCash=(Math.round((save.personalCash||0)*100)-c.cost)/100;cashDeltaCents=-c.cost}
  description=id==='settle'?
   'Eli paid $3 of his own money to end the immediate dispute. The regular took the payment, with no admission that the claimed debt was legitimate.':
   id==='defy'?
   'Eli refused to pay for an unverified claim. The regular left angry and said he would remember this refusal.':
   'Eli brought the demand to the floor manager, who entered it in the club register. No police complaint or criminal conviction followed automatically.';
  root.FE_MISSIONS?.step?.(save,ID,'decide',{eventId:'peacock-debts:'+id,choiceId:id,at});
 }else{
  s.stage='resolved';s.completedAt=at;
  s.outcome=s.decision==='settle'?'paid-without-admission':
   s.decision==='defy'?'feud-unresolved':'manager-witnessed';
  description=s.decision==='settle'?
   'The regular acknowledged receiving the $3. He made no further demand tonight, but his alleged business partners remain unknown.':
   s.decision==='defy'?
   'The regular appeared briefly with another stranger. No attack occurred, but he refused further dealings with Eli.':
   'The manager confirmed the written nightclub record. The regular withdrew the public demand but disputed the manager’s version.';
  root.FE_MISSIONS?.step?.(save,ID,'conclude',{eventId:'peacock-debts:outcome:'+s.outcome,choiceId:s.outcome,at});
 }
 const entry={id,date:at,source:'Eli witnessed Golden Peacock encounter',text:description,cashDeltaCents};
 s.events.push(entry);
 root.FE_LIFE_HISTORY?.record?.(save,{id:'main-debts:'+id,date:at,source:entry.source,text:description});
 return {ok:true,stage:s.stage,description,cashDeltaCents,outcome:s.outcome};
}
function summary(save){
 if(save?.characterRoute!=='criminal')return null;
 const s=save.peacockDebts;
 return {stage:s?.stage||'unmet',decision:s?.decision||null,outcome:s?.outcome||null,
  trust:s?.trust||0,exposure:s?.exposure||0,costCents:s?.costCents||0,
  events:Array.isArray(s?.events)?s.events.map(e=>({...e})):[]};
}
const api=Object.freeze({ID,VENUE,ROOM,ACTIONS,CHOICES,preview,apply,summary,ensure});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PEACOCK_DEBTS=api;
})(typeof window!=='undefined'?window:globalThis);
