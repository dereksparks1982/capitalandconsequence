/* A supernatural exception to Washington's ordinary information rules.
 * The fortune-teller can sense a TRUE private fact without having heard it.
 * Never fabricates a crime, changes case truth or publishes secrets to NPCs.
 */
(function(root){
'use strict';
const HINTS=Object.freeze({
 theft:{subject:'something taken and not returned',saying:'There is an object in another person’s hands that does not belong there. The room was quiet, but the taking was not unseen.'},
 violence:{subject:'a violent act',saying:'Blood and anger leave impressions that no washing removes. Someone remembers a blow that others have yet to understand.'},
 killing:{subject:'a death kept private',saying:'One life ended before its appointed hour. There is a silence at your shoulder that does not belong to the living.'},
 fraud:{subject:'a dishonest bargain',saying:'You have put your hand into money that was entrusted to another purpose. Ink on the ledger cannot hide it from every eye.'},
 bribery:{subject:'a secret payment',saying:'A coin changed hands in a place where no receipt was meant to exist. Even gold can cast a dark shadow.'},
 betrayal:{subject:'a broken confidence',saying:'A promise was broken where nobody was listening. The person betrayed does not yet know the whole of it.'},
 affair:{subject:'a concealed relationship',saying:'There is a closeness you keep behind a closed door. The one who trusts you sees only the door.'},
 blackmail:{subject:'a secret being used as leverage',saying:'Someone has made a weapon of a whispered truth. That whisper is heavier than the paper that bears it.'},
 illicitWager:{subject:'hidden gambling',saying:'I see money passing in the shadow of a fighting ring, away from the eyes that would condemn it. The wager may be over, but its price is not.'},
 mystery:{subject:'a death with hidden truth',saying:'There is a death whose story has been told badly. Look to the thing that caused the wound, rather than the person most loudly accused.'},
 asylum:{subject:'a secret of the asylum',saying:'Behind an institutional door, someone knows more than the official account admits. A locked room can keep a body, but not a truth.'}
});
const VALID=new Set(Object.keys(HINTS));
function ledger(save){
 if(!save||typeof save!=='object')return null;
 if(!save.occultPrivateEvents||save.occultPrivateEvents.version!==1||!Array.isArray(save.occultPrivateEvents.events))
  save.occultPrivateEvents={version:1,events:[]};
 return save.occultPrivateEvents;
}
function record(save,{id,kind,actorId,subjectId,minute}={}){
 if(!id||typeof id!=='string'||id.length>110||!VALID.has(kind)||!save)return {ok:false,reason:'A confirmed private event and kind are required.'};
 const state=ledger(save);
 if(state.events.some(e=>e.id===id))return {ok:true,duplicate:true};
 const at=Number.isSafeInteger(minute)?minute:
  Number.isSafeInteger(save?.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null;
 const event={id,kind,actorId:String(actorId||save.characterRoute||'').slice(0,70),
  subjectId:subjectId?String(subjectId).slice(0,70):null,minute:at};
 state.events.push(event);
 if(state.events.length>80)state.events.splice(0,state.events.length-80);
 return {ok:true,event};
}
function trueSecrets(save,sharedWorld=null){
 const out=[];
 const add=(kind,key,priority=3,person=null)=>{if(VALID.has(kind)&&!out.some(e=>e.key===key))
  out.push({kind,key,priority,person,saying:HINTS[kind].saying})};
 const crime=ledger(save)?.events||[];
 const worldMinute=Number.isSafeInteger(save?.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null;
 for(const e of crime.slice(-40)){
  if(VALID.has(e.kind)&&(worldMinute===null||e.minute===null||e.minute<=worldMinute))
   add(e.kind,'private:'+e.id,8,e.subjectId||e.actorId);
 }
 // Recorded industrialist misconduct is NOT available to ordinary residents.
 // The reader alone may see it, even if the books still hide the loss.
 if(save?.characterRoute==='industrialist'&&
   (Number(save.corporateMisuseCount)>0||Number(save.unaccountedFunds)>0))
  add('fraud','secret:company-irregular-withdrawals',7);
 const notes=Array.isArray(save?.notes)?save.notes.slice(-25):[];
 if(notes.some(x=>x?.source==='private financial record'&&/diverted|unexplained corporate shortfall/i.test(String(x.text||''))))
  add('fraud','secret:unreported-ledger-entry',7);
 if(save?.characterRoute==='criminal'&&
  notes.some(x=>x?.source==='personal betting record'&&/Private prizefight|Cockfight/.test(String(x.text||''))))
  add('illicitWager','secret:private-fight-wager',7);
 const events=save?.underworld?.events;
 if(save?.characterRoute==='criminal'&&
  [events?.privateFight?.bet,events?.cockfight?.bet].some(b=>b?.settled===true))
  add('illicitWager','secret:underground-wager-receipt',7);
 // The reader can sense an aspect of an unresolved death, never its culprit,
 // name, exact time, or evidence thread. The investigation remains playable.
 const cases=save?.detectiveCases?.cases;
 if(Array.isArray(cases)){
  const ongoing=cases.filter(c=>c?.status==='open'&&c?.truth?.method);
  if(ongoing.length)add('mystery','secret:homicide:'+String(ongoing.at(-1).id),5);
 }
 const shared=sharedWorld||save?.sharedWorld;
 if(shared?.worldTruth&&typeof shared.worldTruth==='object'){
  for(const [id,truth] of Object.entries(shared.worldTruth)){
   const at=typeof truth?.at==='string'?Date.parse(truth.at+'Z')/60000:null;
   if(shared.incidents?.[id]&&(worldMinute===null||!Number.isFinite(at)||at<=worldMinute))
    add('asylum','secret:institutional-truth:'+id,5);
  }
 }
 return out.sort((a,b)=>b.priority-a.priority||a.key.localeCompare(b.key));
}
function hash(value){let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function vision(save,session,sharedWorld=null){
 if(!save||!session||!Array.isArray(session.cards))return null;
 const secrets=trueSecrets(save,sharedWorld);
 if(!secrets.length)return null;
 const seed=session.encounterId||session.minute||session.cards.map(c=>c.id).join('|');
 // Usually an established significant secret surfaces. Sometimes she stays
 // vague or silent, so the effect is surprising rather than a constant spoiler.
 if(hash(String(seed)+'|second-sight-frequency')%10>=7)return null;
 const relevant=secrets.filter(s=>s.priority===secrets[0].priority);
 const chosen=relevant[hash(String(seed)+'|which-secret')%relevant.length];
 const cardIndex=hash(String(seed)+'|which-card')%session.cards.length;
 return Object.freeze({key:chosen.key,kind:chosen.kind,cardIndex,
  saying:chosen.saying});
}
const api=Object.freeze({HINTS,ledger,record,trueSecrets,vision});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_TAROT_SECOND_SIGHT=api;
})(typeof window!=='undefined'?window:globalThis);
