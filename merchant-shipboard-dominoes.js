/* Capital & Consequence: complete zero-stakes double-six dominoes on the moving passenger ship.
 * All duration is charged externally by the ONE authoritative world clock.
 */
(function(root){
'use strict';
const ship=typeof module==='object'&&module.exports?require('./merchant-shipboard.js'):root.FE_SHIPBOARD;
const no=reason=>({ok:false,reason}),yes=(reason,details={})=>({ok:true,reason,...details});
const SECONDS=Object.freeze({start:600,play:300,draw:180,pass:180});
function ensure(save){
 const interior=ship.ensure(save);if(!interior)return null;
 const trip=save.passengerSea.voyage;
 if(!interior.dominoes||interior.dominoes.version!==1||interior.dominoes.voyageId!==trip.id)
  interior.dominoes={version:1,voyageId:trip.id,nextId:0,hand:null,history:[]};
 const d=interior.dominoes;
 if(!Number.isSafeInteger(d.nextId)||d.nextId<0)d.nextId=0;
 if(!Array.isArray(d.history))d.history=[];
 return d;
}
function shuffled(trip,id){
 const bones=[];for(let a=0;a<=6;a++)for(let b=a;b<=6;b++)bones.push({a,b});
 let seed=2166136261;
 for(const c of [trip.id,trip.from,trip.to,trip.departMinute,id].join('|'))
  seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 for(let i=bones.length-1;i>0;i--){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const j=seed%(i+1);[bones[i],bones[j]]=[bones[j],bones[i]];
 }
 return bones;
}
function options(hand,bone){
 if(!hand||!bone)return [];
 if(!hand.chain.length)return ['left'];
 return ['left','right'].filter(side=>bone.a===(side==='left'?hand.left:hand.right)||
  bone.b===(side==='left'?hand.left:hand.right));
}
const pips=bones=>bones.reduce((sum,b)=>sum+b.a+b.b,0);
function canPlay(hand,bones){return bones.some(b=>options(hand,b).length>0)}
function place(hand,bone,side){
 if(!options(hand,bone).includes(side))return false;
 if(!hand.chain.length){hand.left=bone.a;hand.right=bone.b;hand.chain.push({...bone});return true}
 const match=side==='left'?hand.left:hand.right;
 const other=bone.a===match?bone.b:bone.a;
 if(side==='left'){hand.left=other;hand.chain.unshift({a:other,b:match})}
 else {hand.right=other;hand.chain.push({a:match,b:other})}
 return true;
}
function finish(save,d,hand,reason,forced=null){
 if(hand.status!=='playing')return;
 const player=pips(hand.player),opponent=pips(hand.opponent);
 hand.status=forced||(hand.player.length===0?'won':hand.opponent.length===0?'lost':
  player===opponent?'draw':player<opponent?'won':'lost');
 hand.reason=reason;hand.endedMinute=save.worldCalendar.worldMinute;
 d.history.push({id:hand.id,result:hand.status,reason,
  playerPips:player,opponentPips:opponent,turns:hand.turns,
  startedMinute:hand.startedMinute,endedMinute:hand.endedMinute});
 d.history=d.history.slice(-30);
}
function opponentTurn(save,d,h){
 if(h.status!=='playing')return;
 let index=h.opponent.findIndex(b=>options(h,b).length>0);
 // Draw-until-playable rules. The opponent never conjures or duplicates bones.
 while(index<0&&h.boneyard.length){
  h.opponent.push(h.boneyard.shift());
  index=h.opponent.findIndex(b=>options(h,b).length>0);
 }
 if(index>=0){
  const bone=h.opponent.splice(index,1)[0];
  place(h,bone,options(h,bone)[0]);h.consecutivePasses=0;
  if(!h.opponent.length)finish(save,d,h,'Opponent played the last bone.');
 }else {
  h.consecutivePasses++;
  if(h.consecutivePasses>=2&&h.boneyard.length===0)
   finish(save,d,h,'Both players blocked; lowest pip count wins.');
 }
}
function offer(save,kind,index,side){
 const seconds=SECONDS[kind];
 if(!seconds)return no('Unknown dominoes action.');
 const station=ship.stationOffer(save,'cards',seconds);if(!station.ok)return station;
 const d=ensure(save),h=d?.hand;
 if(kind==='start'){
  if(h?.status==='playing')return no('Finish your current dominoes hand first.');
  if(ship.ensure(save).game?.round?.status==='playing')
   return no('Finish your current game of Twenty-One before setting out dominoes.');
  if(root.FE_SHIP_CHECKERS?.ensure?.(save)?.active)
   return no('Finish or resign your draughts match before setting out dominoes.');
 }else{
  if(h?.status!=='playing')return no('Deal a dominoes hand first.');
  if(kind==='play'&&(!Number.isInteger(index)||index<0||index>=h.player.length||
      !options(h,h.player[index]).includes(side)))
   return no('The selected bone cannot be played on that end.');
  if(kind==='draw'&&(!h.boneyard.length||canPlay(h,h.player)))
   return no('Draw only when no tile in your hand fits and the boneyard is not empty.');
  if(kind==='pass'&&(h.boneyard.length||canPlay(h,h.player)))
   return no('You may pass only when you cannot play and the boneyard is empty.');
 }
 return yes('Dominoes turn is available.',{seconds});
}
function act(save,kind,index,side){
 // Recheck after shared-clock advancement, since a voyage may dock.
 if(!ship.at(save,'cards'))return no('Stand at the passenger saloon card table.');
 const d=ensure(save);if(!d)return no('You are not aboard this voyage.');
 if(kind==='start'){
  if(d.hand?.status==='playing'||ship.ensure(save).game?.round?.status==='playing'||
   root.FE_SHIP_CHECKERS?.ensure?.(save)?.active)
   return no('Finish the existing table game before dealing dominoes.');
  const id=++d.nextId,bones=shuffled(save.passengerSea.voyage,id);
  d.hand={id,player:bones.slice(0,7),opponent:bones.slice(7,14),
   boneyard:bones.slice(14),chain:[],left:null,right:null,
   status:'playing',turns:0,consecutivePasses:0,reason:null,
   startedMinute:save.worldCalendar.worldMinute,endedMinute:null};
  return yes('Shuffled a complete double-six set and dealt seven bones apiece.',{hand:d.hand});
 }
 const h=d.hand;if(h?.status!=='playing')return no('No unfinished dominoes hand.');
 if(kind==='play'){
  if(!Number.isInteger(index)||index<0||index>=h.player.length||
   !options(h,h.player[index]).includes(side))return no('The bone cannot match that end.');
  const bone=h.player.splice(index,1)[0];place(h,bone,side);
  h.turns++;h.consecutivePasses=0;
  if(!h.player.length)finish(save,d,h,'Charles played the last bone.');
  else opponentTurn(save,d,h);
  return yes(h.status==='playing'?'Bone placed; your opponent has replied.':
   'Dominoes finished: '+h.status+'. No wagers were made.',{hand:h});
 }
 if(kind==='draw'){
  if(!h.boneyard.length||canPlay(h,h.player))return no('A playable tile must be placed before drawing.');
  h.player.push(h.boneyard.shift());h.turns++;
  return yes('Drew one bone. If it fits, play it; otherwise draw again or pass.',{hand:h});
 }
 if(kind==='pass'){
  if(h.boneyard.length||canPlay(h,h.player))return no('You may not pass while you can play or draw.');
  h.turns++;h.consecutivePasses++;
  if(h.consecutivePasses>=2)finish(save,d,h,'Both players blocked; lowest pip count wins.');
  else opponentTurn(save,d,h);
  return yes(h.status==='playing'?'You passed; opponent has replied.':
   'Dominoes finished: '+h.status+'. No wagers were made.',{hand:h});
 }
 return no('Unknown dominoes action.');
}
function resign(save){
 if(!ship.at(save,'cards'))return no('Return to the domino table to resign.');
 const d=ensure(save),h=d?.hand;
 if(h?.status!=='playing')return no('No active dominoes hand to resign.');
 finish(save,d,h,'Charles resigned the hand.','resigned');
 return yes('Left the dominoes table. No wagers or cash transferred.',{hand:h});
}
const api=Object.freeze({ensure,shuffled,options,pips,offer,act,resign});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_SHIP_DOMINOES=api;
})(typeof window!=='undefined'?window:globalThis);
