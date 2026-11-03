/* Casual draughts aboard a legitimately underway passenger vessel.
 * Reuses Washington's existing American checkers / rapid-draughts engine;
 * neither a second rules implementation nor a fake cash-winning minigame.
 */
(function(root){
'use strict';
const ship=typeof module==='object'&&module.exports?require('./merchant-shipboard.js'):root.FE_SHIPBOARD;
const life=typeof module==='object'&&module.exports?require('./merchant-shipboard-life.js'):root.FE_SHIPBOARD_LIFE;
const checkers=typeof module==='object'&&module.exports?require('./tabletop-checkers.js'):root.FE_CHECKERS;
const yes=(reason,extra={})=>({ok:true,reason,...extra});
const no=reason=>({ok:false,reason});
const copy=x=>JSON.parse(JSON.stringify(x));
function ensure(save){
 const interior=ship.ensure(save);if(!interior)return null;
 if(!interior.draughts||interior.draughts.version!==1)
  interior.draughts={version:1,nextId:0,active:null,results:[]};
 const st=interior.draughts;
 if(!Array.isArray(st.results))st.results=[];
 if(!Number.isSafeInteger(st.nextId)||st.nextId<0)st.nextId=0;
 return st;
}
function opponentClose(save,minute){
 const st=ship.ensure(save);if(!st||!ship.at(save,'cards'))return false;
 const other=life.positionAt(save,'cards',minute);
 return !!other&&other.deck===st.deck&&Math.abs(other.x-st.x)+Math.abs(other.y-st.y)<=1;
}
function offerStart(save){
 const gate=ship.stationOffer(save,'cards',600);if(!gate.ok)return gate;
 if(!checkers?.fresh||!checkers?.options||!checkers?.apply||!checkers?.pick)
  return no('The original checkers rules are not loaded.');
 const st=ensure(save);if(st.active)return no('Finish or resign your previous draughts match first.');
 const minute=save.worldCalendar.worldMinute;
 if(!opponentClose(save,minute)||!opponentClose(save,minute+10))
  return no('Wait until the card-table passenger is present for a full opening game.');
 return yes('An opponent can play draughts.',{seconds:600});
}
function start(save){
 const st=ensure(save),minute=save.worldCalendar.worldMinute;
 if(!st||st.active||!opponentClose(save,minute))return no('A present opponent and free board are required.');
 const id=++st.nextId;
 st.active={id,position:checkers.fresh(),startedMinute:minute,opponent:'cards',status:'playing'};
 return yes('The passenger accepts a no-stakes game of American checkers.',{id,match:copy(st.active)});
}
function offerMove(save,from,to){
 const gate=ship.stationOffer(save,'cards',300);if(!gate.ok)return gate;
 const st=ensure(save),match=st?.active;
 if(!match||match.position.status!=='playing')return no('No unfinished draughts match.');
 if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||from>63||to<0||to>63)
  return no('Choose two squares on the board.');
 if(match.position.turn!=='r')return no('Wait for the other side to finish.');
 if(!checkers.options(match.position).some(m=>m.from===from&&m.to===to))return no('Illegal draughts move. Forced captures and multiple jumps apply.');
 const minute=save.worldCalendar.worldMinute;
 if(!opponentClose(save,minute)||!opponentClose(save,minute+5))
  return no('The opponent has left the table. You may resume when they return or resign.');
 return yes('A legal checkers move is available.',{seconds:300});
}
function finish(st,match,reason){
 if(st.results.some(r=>r.id===match.id))return null;
 const outcome={id:match.id,reason,winner:match.position.winner,ply:match.position.ply,
  startedMinute:match.startedMinute,endedMinute:match.endedMinute,moves:match.position.history.slice(-60)};
 st.results.push(outcome);st.results=st.results.slice(-25);st.active=null;
 return outcome;
}
function play(save,from,to){
 const st=ensure(save),match=st?.active;
 if(!match||!ship.at(save,'cards'))return no('No match at this shipboard table.');
 const step=checkers.apply(match.position,from,to);
 if(!step.ok)return step;
 let opponent=[],receipt=null;
 if(match.position.status==='playing'&&!step.continues){
  const seed=[save.passengerSea.voyage.id,match.id,match.position.ply].join(':');
  try{opponent=checkers.npcTurn(match.position,seed,2)}
  catch(error){return no('The computer player could not complete its legal move. This match remains open.')}
 }
 if(match.position.status==='finished'){
  match.endedMinute=save.worldCalendar.worldMinute;
  receipt=finish(st,match,match.position.reason||'completed');
 }
 return yes(step.continues?'Continue your forced jump.':receipt?'The draughts game has ended.':'Your move and the opponent response were recorded.',{
  continues:step.continues,opponent,receipt,position:match.position});
}
function resign(save){
 const st=ensure(save),match=st?.active;
 if(!match)return no('There is no draughts match to leave.');
 match.position.status='finished';match.position.winner='b';match.position.reason='resigned';
 match.endedMinute=save.worldCalendar?.worldMinute||0;
 const receipt=finish(st,match,'resigned');
 return yes('You resigned this casual game. No cash changed hands.',{receipt});
}
const api=Object.freeze({ensure,opponentClose,offerStart,start,offerMove,play,resign});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_SHIP_CHECKERS=api;
})(typeof window!=='undefined'?window:globalThis);
