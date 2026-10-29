/* Capital & Consequence: formal challenge and duel simulation.
 * A duel must originate from a recorded dispute, not a random combat menu.
 * Player skills influence but never guarantee the shot or the opponent's miss.
 */
(function(root){
'use strict';
const VENUES=Object.freeze({
 working:Object.freeze({locationId:'workingPoker',opponent:'Mickey Dunn',skill:22}),
 middle:Object.freeze({locationId:'commercePoker',opponent:'Walter Briggs',skill:43}),
 elite:Object.freeze({locationId:'embassyPoker',opponent:'Harrison Vale',skill:68})
});
const clamp=(n,low,high)=>Math.min(high,Math.max(low,n));
const ROUNDS_LIMIT=3;
function ensure(save){
 if(!save||typeof save!=='object')throw Error('Player save required');
 if(!save.duels||save.duels.version!==1||!Array.isArray(save.duels.history))
  save.duels={version:1,pending:[],history:[],injuries:[]};
 const state=save.duels;
 if(!Array.isArray(state.pending))state.pending=[];
 if(!Array.isArray(state.injuries))state.injuries=[];
 return state;
}
function offer(save,{sessionId,circle,conduct,hands,gameDate}={}){
 const venue=VENUES[circle];
 if(!venue||conduct!=='rude'||!Number.isSafeInteger(hands)||hands<1||
  typeof sessionId!=='string'||!sessionId||sessionId.length>128)return null;
 const state=ensure(save),id='card-dispute:'+sessionId;
 const found=state.pending.find(x=>x.id===id)||state.history.find(x=>x.id===id);
 if(found)return found;
 const challenge={id,source:'poker-conduct',sessionId,circle,locationId:venue.locationId,
  opponent:venue.opponent,opponentSkill:venue.skill,
  date:typeof gameDate==='string'?gameDate:save.gameDate,status:'pending'};
 state.pending.push(challenge);
 if(state.pending.length>12)state.pending.shift();
 return challenge;
}
function pendingAt(save,locationId){
 const duels=ensure(save);
 return duels.pending.find(x=>x.locationId===locationId&&x.status==='pending')||null;
}
function normalizeRoll(roll){return Number.isFinite(roll)?clamp(roll,0,0.999999):Math.random()}
function exchange({marksmanship=0,observation=0,opponentSkill=30,
 aim=0,action='shoot',timely=true,rolls=[]}={}){
 if(!['shoot','wide','yield'].includes(action))return null;
 const marks=clamp(Number(marksmanship)||0,0,100),
  eyes=clamp(Number(observation)||0,0,100),
  foe=clamp(Number(opponentSkill)||0,0,100),
  accuracy=clamp(Number(aim)||0,0,1);
 if(action==='yield')return Object.freeze({action,player:'yielded',opponent:'held-fire',
  result:'yielded',accuracy:0,playerChance:0,opponentChance:0});
 const playerChance=clamp(.08+marks*.0055+eyes*.0015+accuracy*.25-(timely?0:.44),.02,.92);
 const opponentChance=clamp(.15+foe*.006,.12,.83);
 const playerHit=action==='shoot'&&!!timely&&normalizeRoll(rolls[0])<playerChance;
 const opponentHit=normalizeRoll(rolls[1])<opponentChance;
 const player=playerHit?(normalizeRoll(rolls[2])<.08?'killed':'wounded'):
  action==='wide'?'fired-wide':'missed';
 const opponent=opponentHit?(normalizeRoll(rolls[3])<.08?'killed':'wounded'):'missed';
 const result=opponent==='killed'?'player-killed':
  player==='killed'?'opponent-killed':
  opponent==='wounded'?'player-wounded':
  player==='wounded'?'opponent-wounded':
  action==='wide'?'fired-wide':'honor-exchanged';
 return Object.freeze({action,player,opponent,result,
  accuracy,playerChance,opponentChance});
}
function settle(save,challengeId,outcome,{rounds=1,elapsedMinutes=10}={}){
 const state=ensure(save);
 if(!outcome||typeof outcome.result!=='string'||
  !Number.isSafeInteger(rounds)||rounds<1||rounds>ROUNDS_LIMIT||
  !Number.isSafeInteger(elapsedMinutes)||elapsedMinutes<1||elapsedMinutes>60)return null;
 const index=state.pending.findIndex(p=>p.id===challengeId);
 if(index<0||state.history.some(r=>r.id===challengeId))return null;
 const challenge=state.pending[index];
 const record={...challenge,status:'resolved',result:outcome.result,
  playerShot:outcome.player,opponentShot:outcome.opponent,
  rounds,elapsedMinutes,endedOn:save.gameDate||challenge.date};
 state.pending.splice(index,1);
 state.history.unshift(record);if(state.history.length>80)state.history.length=80;
 if(['player-wounded','player-killed'].includes(outcome.result))
  state.injuries.unshift({id:record.id,kind:outcome.result,date:record.endedOn,
   opponent:record.opponent,treated:false});
 if(state.injuries.length>32)state.injuries.length=32;
 return record;
}
const api=Object.freeze({VENUES,ROUNDS_LIMIT,ensure,offer,pendingAt,exchange,settle});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_DUELS=api;
})(typeof window!=='undefined'?window:globalThis);
