/* Capital & Consequence: consequences after recorded formal duels.
 * Statements are first-hand player reports, not omniscient police knowledge.
 * Opponent conditions persist; time never advances from Date.now().
 */
(function(root){
'use strict';
const DAY=86400000;
function dateNumber(date){
 if(typeof date!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date))return null;
 const n=Date.parse(date+'T00:00:00Z');
 return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===date?Math.floor(n/DAY):null;
}
function ensure(save){
 if(!save||typeof save!=='object')throw Error('Player save required');
 if(!save.duelAftermath||save.duelAftermath.version!==1)
  save.duelAftermath={version:1,events:[],people:{},reports:[]};
 const state=save.duelAftermath;
 if(!Array.isArray(state.events))state.events=[];
 if(!state.people||typeof state.people!=='object')state.people={};
 if(!Array.isArray(state.reports))state.reports=[];
 return state;
}
function record(save,duel){
 if(!duel||duel.status!=='resolved'||typeof duel.id!=='string'||!duel.id||
  !['missed','fired-wide','wounded','killed','yielded'].includes(duel.playerShot)||
  !['missed','wounded','killed','held-fire'].includes(duel.opponentShot))return null;
 const state=ensure(save);
 const existing=state.events.find(e=>e.duelId===duel.id);
 if(existing)return existing;
 const condition=duel.playerShot==='killed'?'deceased':
  duel.playerShot==='wounded'?'injured':'unharmed';
 const playerCondition=duel.opponentShot==='killed'?'fatal':
  duel.opponentShot==='wounded'?'injured':'unharmed';
 const occurred=duel.endedOn||save.gameDate||null;
 const event={duelId:duel.id,opponent:duel.opponent||'Unknown opponent',
  place:duel.locationId,date:occurred,
  opponentCondition:condition,playerCondition,
  status:'unreported',witnesses:[],reportId:null};
 // Opponent injuries and deaths are recorded from the actual exchange.
 // A hurt table patron cannot magically return healthy the same day.
 const key=duel.opponent;
 if(typeof key==='string'&&key&&condition!=='unharmed'){
  const prev=state.people[key];
  if(!prev||prev.status!=='deceased')
   state.people[key]={status:condition,since:occurred,sourceDuel:duel.id,
    recoveryDays:condition==='injured'?3+Math.min(5,Math.floor((duel.opponentSkill||30)/15)):null};
 }
 state.events.unshift(event);
 if(state.events.length>80)state.events.length=80;
 return event;
}
function advance(save,gameDate){
 const state=ensure(save),today=dateNumber(gameDate);
 if(today===null)return [];
 const recovered=[];
 for(const [name,person] of Object.entries(state.people)){
  if(person.status!=='injured')continue;
  const injured=dateNumber(person.since);
  if(injured===null||today-injured<(person.recoveryDays||4))continue;
  person.status='recovered';person.recoveredOn=gameDate;
  recovered.push({name,date:gameDate});
 }
 return recovered;
}
function opponentStatus(save,name,gameDate){
 if(!save||!name)return 'unharmed';
 if(gameDate)advance(save,gameDate);
 return ensure(save).people[name]?.status||'unharmed';
}
function untreated(save){return ensure(save).events.find(e=>e.playerCondition==='injured'&&!e.treatedOn)||null}
function treat(save,duelId,gameDate){
 const state=ensure(save),event=state.events.find(e=>e.duelId===duelId);
 if(!event||event.playerCondition!=='injured'||event.treatedOn||dateNumber(gameDate)===null)return null;
 event.treatedOn=gameDate;
 const injury=save.duels?.injuries?.find(i=>i.id===duelId);
 if(injury)injury.treated=true;
 return event;
}
function report(save,duelId,gameDate){
 const state=ensure(save),event=state.events.find(e=>e.duelId===duelId);
 if(!event||event.reportId||dateNumber(gameDate)===null)return null;
 // A voluntary report creates a case intake, not an arrest or proof of guilt.
 const id='police-intake:'+duelId;
 const entry={id,duelId,date:gameDate,source:'player-statement',
  locationId:'metropolitanPolice',status:'intake',accused:event.opponent,
  evidence:['player-statement'],independentWitnesses:0};
 state.reports.unshift(entry);if(state.reports.length>64)state.reports.length=64;
 event.reportId=id;event.status='reported';
 return entry;
}
function visible(save,locationId,date){
 if(!save||!locationId)return {available:false};
 if(date)advance(save,date);
 const state=ensure(save);
 return {available:true,
  injury:locationId==='governmentHospital'?untreated(save):null,
  reportable:locationId==='metropolitanPolice'?
   state.events.find(e=>!e.reportId):null,
  pendingReportCount:state.reports.filter(r=>r.status==='intake').length,
  people:Object.keys(state.people).length};
}
const api=Object.freeze({ensure,record,advance,opponentStatus,untreated,treat,report,visible});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_DUEL_AFTERMATH=api;
})(typeof window!=='undefined'?window:globalThis);
