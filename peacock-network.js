/* Capital & Consequence: Eli's second consequential club story.
 * Real witness conversations only. Private leverage is not a police report.
 */
(function(root){'use strict';
const ID='main:peacock-network',VENUE='secondNightclub',ROOM='doorman-post';
const ACTIONS=Object.freeze({
 meet:{label:'Meet the discreet club regular · 10 minutes',seconds:600},
 protect:{label:'Warn the patron about the stranger · 10 minutes',seconds:600},
 leverage:{label:'Demand payment for remaining silent · 10 minutes',seconds:600},
 report:{label:'Record the approach with the floor manager · 10 minutes',seconds:600},
 consequence:{label:'Face the regular at the door · 10 minutes',seconds:600}
});
const CHOICES=Object.freeze({
 protect:{cashCents:0,trust:3,exposure:0,
 text:'Eli warned the patron about the person who had approached the club. The patron requested discretion and promised to remember the favor.'},
 leverage:{cashCents:500,trust:-5,exposure:5,
 text:'Eli demanded $5 to keep quiet about the stranger. The club regular paid, and both now have grounds to distrust one another.'},
 report:{cashCents:0,trust:1,exposure:1,
 text:'Eli made a dated entry with the floor manager about a suspicious approach, without accusing anyone of a crime.'}
});
const deny=reason=>({ok:false,reason});
const days=(a,b)=>Math.floor((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000);
function ensure(save){
 if(save?.characterRoute!=='criminal')return null;
 if(!save.peacockNetwork||save.peacockNetwork.version!==1)
  save.peacockNetwork={version:1,stage:'unmet',metAt:null,choice:null,choiceAt:null,
   completedAt:null,outcome:null,events:[],cashCents:0,trust:0,exposure:0};
 return save.peacockNetwork;
}
function preview(save,id,locationId,roomId,{dev=false}={}){
 if(!Object.hasOwn(ACTIONS,id))return deny('Unknown club intrigue.');
 if(save?.characterRoute!=='criminal')return deny('This conversation belongs to Eli.');
 if(save.paused||save.phase!=='night')return deny('The regular appears after dark.');
 if(dev||locationId!==VENUE||roomId!==ROOM)return deny('Go to the actual Golden Peacock door.');
 if(save.doormanDuty?.pending)return deny('Finish the ordinary door contact first.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(save.gameDate||''))return deny('Invalid Washington date.');
 const first=save.peacockStory,story=save.peacockNetwork,stage=story?.stage||'unmet';
 if(id==='meet'){
  if(stage!=='unmet')return deny('This meeting has already occurred.');
  if(first?.stage!=='resolved'||!first.finishedAt)return deny('Finish A Favor with a Price first.');
  if(days(save.gameDate,first.finishedAt)<1)return deny('The regular has not appeared yet.');
 }else if(Object.hasOwn(CHOICES,id)){
  if(stage!=='met')return deny('No regular has confided in Eli yet.');
  if(days(save.gameDate,story.metAt)<1)return deny('The choice becomes available on a later night.');
 }else if(id==='consequence'){
  if(stage!=='chosen')return deny('No confirmed decision awaits an outcome.');
  if(days(save.gameDate,story.choiceAt)<1)return deny('The consequences will arrive on a later night.');
 }
 return {ok:true,id,seconds:ACTIONS[id].seconds,label:ACTIONS[id].label};
}
function apply(save,id,locationId,roomId,{spentSeconds,dev=false}={}){
 const check=preview(save,id,locationId,roomId,{dev});if(!check.ok)return check;
 if(spentSeconds!==check.seconds)return deny('The complete encounter time must be spent.');
 const s=ensure(save),date=save.gameDate;
 let text='',cashDeltaCents=0;
 if(id==='meet'){
  s.stage='met';s.metAt=date;
  text='A regular at the Peacock recognizes Eli from the envelope dispute. He says a stranger has been asking about patrons and offers to meet Eli again. Eli has observed only the conversation, not any alleged wrongdoing.';
  root.FE_MISSIONS?.start?.(save,{id:ID,templateId:'peacock-network',date,locationId:VENUE});
 }else if(Object.hasOwn(CHOICES,id)){
  const c=CHOICES[id];s.stage='chosen';s.choice=id;s.choiceAt=date;
  s.trust+=c.trust;s.exposure+=c.exposure;s.cashCents+=c.cashCents;
  text=c.text;cashDeltaCents=c.cashCents;
  if(cashDeltaCents)save.personalCash=(Math.round((Number.isFinite(save.personalCash)?save.personalCash:0)*100)+cashDeltaCents)/100;
  root.FE_MISSIONS?.step?.(save,ID,'choose',{eventId:'peacock-network:decision:'+id,choiceId:id,at:date});
 }else{
  s.stage='resolved';s.completedAt=date;
  s.outcome=s.choice==='leverage'?'hostile-debt':s.choice==='report'?'manager-record':'quiet-ally';
  text=s.choice==='leverage'?
   'The regular now refuses to trust Eli and warns that the payment is being discussed at the club. No police case has automatically opened.':
   s.choice==='report'?
   'The manager confirms that Eli submitted a written account. No charge was filed; the stranger remains unidentified.':
   'The regular thanks Eli privately. He is willing to speak again, but has supplied no proof of a crime.';
  root.FE_MISSIONS?.step?.(save,ID,'consequence',{eventId:'peacock-network:outcome:'+s.outcome,choiceId:s.outcome,at:date});
 }
 s.events.push({id,date,source:'firsthand Golden Peacock encounter',text,cashDeltaCents});
 root.FE_LIFE_HISTORY?.record?.(save,{id:'peacock-network:'+id,date,source:'firsthand Golden Peacock encounter',text});
 return {ok:true,description:text,stage:s.stage,outcome:s.outcome,cashDeltaCents};
}
function summary(save){
 if(save?.characterRoute!=='criminal')return null;
 const s=save.peacockNetwork;
 return {stage:s?.stage||'unmet',outcome:s?.outcome||null,trust:s?.trust||0,
  exposure:s?.exposure||0,events:Array.isArray(s?.events)?s.events.map(x=>({...x})):[]};
}
const api=Object.freeze({ID,VENUE,ROOM,ACTIONS,CHOICES,ensure,preview,apply,summary});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PEACOCK_NETWORK=api;
})(typeof window!=='undefined'?window:globalThis);
