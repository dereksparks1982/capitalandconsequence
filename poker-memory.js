/* Capital & Consequence: only observable poker betting habits persist.
 * No hole cards, deck order, opponent private motives or hidden odds saved.
 */
(function(root){
'use strict';
const ROSTERS=Object.freeze({
 working:Object.freeze(['Mickey Dunn','Joe Rourke','Frank Bell']),
 middle:Object.freeze(['Walter Briggs','Charles Webb','Eddie Doyle']),
 elite:Object.freeze(['Harrison Vale','Sen. Robert Whitmore','August Belmont III'])
});
function ensure(save){
 if(!save||typeof save!=='object')throw Error('Player save required');
 if(!save.pokerMemory||save.pokerMemory.version!==1)
  save.pokerMemory={version:1,sessions:[],patrons:{},player:{}};
 const state=save.pokerMemory;
 if(!Array.isArray(state.sessions))state.sessions=[];
 if(!state.patrons||typeof state.patrons!=='object')state.patrons={};
 if(!state.player||typeof state.player!=='object')state.player={};
 return state;
}
function safeCount(n){return Number.isSafeInteger(n)&&n>=0?Math.min(500,n):0}
function counts(raw){
 return {folds:safeCount(raw?.folds),calls:safeCount(raw?.calls),
  checks:safeCount(raw?.checks),raises:safeCount(raw?.raises),
  hands:safeCount(raw?.hands)};
}
function add(previous,next){
 const a=counts(previous),b=counts(next),out={};
 for(const k of Object.keys(a))out[k]=Math.min(100000,a[k]+b[k]);
 return out;
}
function remember(save,sessionId,room,rows,player,hands){
 if(typeof sessionId!=='string'||!sessionId||sessionId.length>128||
  !Object.hasOwn(ROSTERS,room)||!Array.isArray(rows)||
  !Number.isSafeInteger(hands)||hands<1||hands>500)return false;
 const data=ensure(save);
 if(data.sessions.includes(sessionId))return false;
 const seen=new Set();
 for(const row of rows){
  if(!row||!ROSTERS[room].includes(row.name)||seen.has(row.name))continue;
  seen.add(row.name);
  const key=room+':'+row.name;
  const record=data.patrons[key]||{name:row.name,room,sessions:0,stats:counts(null)};
  record.stats=add(record.stats,row);record.sessions++;
  data.patrons[key]=record;
 }
 data.player[room]=add(data.player[room],player);
 data.sessions.push(sessionId);
 if(data.sessions.length>512)data.sessions.splice(0,data.sessions.length-512);
 return true;
}
function summary(save,room,name){
 if(!save||!ROSTERS[room]?.includes(name))return null;
 const data=ensure(save);
 const item=data.patrons[room+':'+name];
 if(!item)return null;
 const {folds,calls,checks,raises,hands}=item.stats;
 const actions=Math.max(1,folds+calls+checks+raises);
 const trait=actions<5?'Not enough past hands':
  raises/actions>.38?'Often raises':
  folds/actions>.38?'Often folds':'Usually plays steadily';
 return {name,room,sessions:item.sessions,folds,calls,checks,raises,hands,trait};
}
function playerHabits(save,room){
 if(!save||!Object.hasOwn(ROSTERS,room))return counts(null);
 return counts(ensure(save).player[room]);
}
const api=Object.freeze({ensure,remember,summary,playerHabits,ROSTERS});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_POKER_MEMORY=api;
})(typeof window!=='undefined'?window:globalThis);
