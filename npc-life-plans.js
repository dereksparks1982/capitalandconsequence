/* Capital & Consequence: persistent, per-resident follow-through for NPC goals.
 * A plan remembers intentions and verifies ACTUAL logged activity, not a
 * successful contract, friendship, promotion, purchase or hidden world event.
 * No autonomous clock, speculative travel or player-facing AI interface.
 */
(function(root){
 'use strict';
 const MARGIN=13, HISTORY_LIMIT=12;
 const SOCIAL_GOALS=Object.freeze(new Set([
  'cultivate-trusted-contacts','expand-connections','develop-contacts',
  'help-neighbors','maintain-acquaintances','protect-allies',
  'make-new-acquaintances','earn-colleagues-trust','build-professional-standing',
  'maintain-business-contacts','protect-local-trust'
 ]));
 function ensure(agent){
  if(!agent||typeof agent!=='object')throw Error('NPC private plan state required');
  let p=agent.lifePlan;
  if(!p||p.version!==1){
   p={version:1,goal:null,status:'uncommitted',attempts:0,encounters:0,
    lastChoiceKey:null,lastChoice:null,evidenceKeys:[],history:[]};
   agent.lifePlan=p;
  }
  if(!Array.isArray(p.evidenceKeys))p.evidenceKeys=[];
  if(!Array.isArray(p.history))p.history=[];
  p.evidenceKeys=p.evidenceKeys.slice(-16);
  p.history=p.history.slice(-HISTORY_LIMIT);
  p.attempts=Math.max(0,Math.min(9999,Number.isSafeInteger(p.attempts)?p.attempts:0));
  p.encounters=Math.max(0,Math.min(9999,Number.isSafeInteger(p.encounters)?p.encounters:0));
  return p;
 }
 function commit(def,agent,choice,key){
  if(!def||!Array.isArray(def.goals)||!def.goals.length||!agent||!choice||
    typeof key!=='string'||!key||typeof choice.goal!=='string')
   throw Error('NPC goal, resident and reached schedule key required');
  const p=ensure(agent);
  if(p.lastChoiceKey===key&&p.lastChoice)return {...p.lastChoice};
  // Fatigue pauses effort rather than deleting a resident's career aspiration.
  if(choice.rest){
   const result={...choice,reason:choice.reason||'fatigue'};
   p.lastChoiceKey=key;p.lastChoice={...result};
   return result;
  }
  if(!def.goals.includes(choice.goal))throw Error('Unknown private NPC goal');
  const old=def.goals.includes(p.goal)?p.goal:null;
  const suggested=choice.goal;
  const oldScore=choice.scores?.find(r=>r.goal===old)?.score;
  const contender=Number(choice.score);
  const switchNow=!old||old===suggested||
   !Number.isFinite(oldScore)||!Number.isFinite(contender)||contender-oldScore>=MARGIN;
  const goal=switchNow?suggested:old;
  if(goal!==old){
   if(old)p.history.push({type:'revision',from:old,to:goal,key,
    reason:'material-priority-change'});
   p.goal=goal;p.status='considering';p.attempts=0;p.encounters=0;p.evidenceKeys=[];
  }
  p.lastChoiceKey=key;
  const held=goal!==suggested;
  const result={...choice,goal,
   score:held?oldScore:choice.score,reason:held?'sustained-commitment':choice.reason};
  p.lastChoice={...result};
  if(p.history.length>HISTORY_LIMIT)p.history.splice(0,p.history.length-HISTORY_LIMIT);
  return result;
 }
 function record(def,agent,choice,action,actual,key){
  if(!def||!agent||!choice||!action||typeof key!=='string'||!key)
   throw Error('Recorded resident action and schedule key required');
  const p=ensure(agent);
  if(choice.rest||!def.goals?.includes(choice.goal)||p.goal!==choice.goal||
    !actual?.locationId||!actual?.roomId)return false;
  if(p.evidenceKeys.includes(key+'|action'))return false;
  const verified=actual.locationId===action.locationId&&
   ['work','personal','wager-win','wager-loss'].includes(action.kind);
  // A venue visit is not proof that a trade was won or a friendship formed.
  if(!verified)return false;
  p.evidenceKeys.push(key+'|action');
  p.attempts=Math.min(9999,p.attempts+1);
  p.status=p.attempts===1?'first-observed-effort':'following-through';
  p.history.push({type:'observed-effort',key,kind:action.kind,at:actual.locationId,
   roomId:actual.roomId,goal:p.goal});
  if(p.history.length>HISTORY_LIMIT)p.history.splice(0,p.history.length-HISTORY_LIMIT);
  p.evidenceKeys=p.evidenceKeys.slice(-16);
  return true;
 }
 function witness(def,agent,record,key){
  if(!def||!agent||!record||typeof key!=='string'||!key)
   throw Error('Actual resident encounter required');
  const p=ensure(agent);
  if(!p.goal||!SOCIAL_GOALS.has(p.goal)||p.evidenceKeys.includes(key+'|social'))return false;
  if(record.type!=='private-encounter'||!record.roomId||!record.locationId||
    ![record.actorId,record.partnerId].includes(def.id))return false;
  if(agent.status!=='present'||agent.locationId!==record.locationId||agent.roomId!==record.roomId)
   return false;
  p.evidenceKeys.push(key+'|social');
  p.encounters=Math.min(9999,p.encounters+1);
  p.status='following-through';
  p.history.push({type:'observed-contact',key,at:record.locationId,roomId:record.roomId,
   goal:p.goal});
  if(p.history.length>HISTORY_LIMIT)p.history.splice(0,p.history.length-HISTORY_LIMIT);
  p.evidenceKeys=p.evidenceKeys.slice(-16);
  return true;
 }
 const api=Object.freeze({ensure,commit,record,witness,MARGIN});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_LIFE_PLANS=api;
})(typeof window!=='undefined'?window:globalThis);
