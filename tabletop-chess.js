/* Capital & Consequence chess. Own scheduling/AI/receipts; move legality from BSD-2-Clause chess.js. */
(function(root){'use strict';
const Chess=typeof module==='object'&&module.exports?require('./vendor/chessjs/chess.js').Chess:root.Chess;
if(typeof Chess!=='function')throw Error('chess.js v0.10.3 must load before tabletop-chess.js');
const clone=x=>JSON.parse(JSON.stringify(x));
const VENUES=Object.freeze({
 hillsdale:['neighborhood-street'],universityMaryland:['engineering-hall'],
 russianTradeHall:['meeting-hall'],commercePoker:['club-room'],
 workingPoker:['card-room'],star:['main-parlor']
});
const PIECES={p:100,n:320,b:330,r:500,q:900,k:20000};
function venue(locationId,roomId){return !!VENUES[locationId]?.includes(roomId)}
function state(save){
 if(!save||typeof save!=='object')throw Error('Saved player required');
 const s=save.chessCircuit;
 if(!s||s.version!==1||!Array.isArray(s.results)||!s.records||typeof s.records!=='object'){
  save.chessCircuit={version:1,nextId:1,active:null,fixtures:{},results:[],records:{},lastMinute:null};
 }else{
  s.fixtures=s.fixtures&&typeof s.fixtures==='object'?s.fixtures:{};
  if(!Number.isSafeInteger(s.nextId)||s.nextId<1)s.nextId=1;
 }
 return save.chessCircuit;
}
function reconstruct(moves){
 const board=new Chess();
 for(const move of moves||[])if(!board.move(move))throw Error('Saved chess move sequence is invalid');
 return board;
}
function legal(save,from){const game=state(save).active;if(!game)return [];return reconstruct(game.moves).moves({square:from,verbose:true}).map(x=>x.to)}
function hash(x){let h=2166136261;for(const c of String(x)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function pick(board,seed){
 const candidates=board.moves({verbose:true});if(!candidates.length)return null;
 let best=null,bestScore=-1e10;
 for(const m of candidates){
  const played=board.move({from:m.from,to:m.to,promotion:'q'});if(!played)continue;
  const center=3.5-Math.abs(m.to.charCodeAt(0)-97-3.5);
  const score=(m.captured?PIECES[m.captured]||0:0)*2+
   (m.promotion?PIECES[m.promotion]||0:0)+
   (board.in_checkmate()?100000:board.in_check()?35:0)+center*3+
   (hash(seed+':'+m.from+':'+m.to)%100)/500;
  board.undo();
  if(score>bestScore){bestScore=score;best=m}
 }
 return best?{from:best.from,to:best.to,promotion:'q'}:null;
}
function dateAt(save){return root.FE_WASHINGTON_TIME?.now?.(save)?.iso||String(save.gameDate||'')+'T08:00'}
function result(s,data){
 if(s.results.some(x=>x.id===data.id))return null;
 s.results.push(clone(data));
 for(const [id,outcome] of Object.entries(data.standings||{})){
  if(!s.records[id])s.records[id]={played:0,wins:0,losses:0,draws:0};
  const row=s.records[id];row.played++;if(outcome==='win')row.wins++;
  else if(outcome==='loss')row.losses++;else row.draws++;
 }
 return data;
}
function settle(save,why,at){
 const s=state(save),g=s.active;if(!g)return null;
 const board=reconstruct(g.moves);
 let winner=null,reason=why||'completed';
 if(reason==='forfeit')winner=g.opponentId;
 else if(board.in_checkmate())winner=board.turn()==='w'?g.opponentId:g.playerId;
 else if(board.in_draw()||board.in_stalemate())reason='draw';
 else if(reason!=='agreed-draw')return null;
 const data={id:g.id,game:'chess',at:at||dateAt(save),locationId:g.locationId,roomId:g.roomId,
  white:{id:g.playerId,name:g.playerName},black:{id:g.opponentId,name:g.opponentName},
  winnerId:winner,reason,moves:clone(g.moves),standings:{
   [g.playerId]:winner===g.playerId?'win':winner?'loss':'draw',
   [g.opponentId]:winner===g.opponentId?'win':winner?'loss':'draw'
  }};
 s.active=null;
 if(!result(s,data))return null;
 save.lastChessResult='Chess at '+g.venueName+': '+g.playerName+' versus '+g.opponentName+
  (winner?' — '+(winner===g.playerId?g.playerName:g.opponentName)+' won.':' — drawn.') ;
 return clone(data);
}
function start(save,{locationId,roomId,venueName,opponentId,opponentName,playerId,playerName,present,at}={}){
 if(!venue(locationId,roomId)||!opponentId||!playerId||opponentId===playerId||!Array.isArray(present)||
  !present.some(x=>x.id===opponentId&&x.roomId===roomId))return {ok:false,reason:'A willing opponent must actually be in this room.'};
 const s=state(save);if(s.active)return {ok:false,reason:'Finish your current chess game first.'};
 const id='chess-'+(s.nextId++);
 s.active={id,locationId,roomId,venueName:venueName||locationId,playerId,playerName,opponentId,opponentName,
  startedAt:at||dateAt(save),moves:[],ply:0};
 return {ok:true,id};
}
function play(save,from,to,{locationId,roomId,present,at}={}){
 const s=state(save),g=s.active;
 if(!g||g.locationId!==locationId||g.roomId!==roomId)return {ok:false,reason:'No chess game at this table.'};
 if(!present?.some(x=>x.id===g.opponentId&&x.roomId===roomId)){
  const receipt=settle(save,'forfeit',at);
  return {ok:false,reason:'Your opponent left the table. This game is recorded as forfeited.',receipt};
 }
 const board=reconstruct(g.moves);
 if(board.turn()!=='w')return {ok:false,reason:'Wait for the opponent.'};
 const move=board.move({from,to,promotion:'q'});
 if(!move)return {ok:false,reason:'Illegal chess move.'};
 g.moves.push(move.san);g.ply++;
 if(board.game_over())return {ok:true,player:move.san,receipt:settle(save,'completed',at)};
 const reply=pick(board,g.id+':'+g.ply);
 if(reply){const answer=board.move(reply);g.moves.push(answer.san);g.ply++;}
 const receipt=board.game_over()?settle(save,'completed',at):null;
 return {ok:true,player:move.san,opponent:reply?g.moves[g.moves.length-1]:null,receipt};
}
function abandon(save,at){
 if(!state(save).active)return null;
 return settle(save,'forfeit',at);
}
function npcGame(id,a,b,place,room,at){
 const board=new Chess(),moves=[];
 for(let ply=0;ply<160&&!board.game_over();ply++){
  const m=pick(board,id+':'+ply);if(!m)break;
  moves.push(board.move(m).san);
 }
 const winner=board.in_checkmate()?(board.turn()==='w'?b.id:a.id):null;
 const reason=winner?'checkmate':board.game_over()?'draw':'agreed-draw';
 return {id,game:'chess',at,locationId:place,roomId:room,white:{id:a.id,name:a.name},black:{id:b.id,name:b.name},winnerId:winner,reason,moves,
  standings:{[a.id]:winner===a.id?'win':winner?'loss':'draw',[b.id]:winner===b.id?'win':winner?'loss':'draw'}};
}
function tick(save,{now,presentAt}={}){
 if(!now?.iso||!Number.isSafeInteger(save?.worldCalendar?.worldMinute)||typeof presentAt!=='function')return {started:0,settled:0};
 const s=state(save),minute=save.worldCalendar.worldMinute;
 if(s.lastMinute===minute)return {started:0,settled:0};
 s.lastMinute=minute;
 let started=0,settled=0;
 for(const [locationId,rooms] of Object.entries(VENUES))for(const roomId of rooms){
  const here=presentAt(locationId).filter(x=>x.roomId===roomId);
  const key=now.date+':'+locationId+':'+roomId;
  const fixture=s.fixtures[key];
  if(fixture?.status==='scheduled'&&minute>=fixture.dueMinute){
   const a=here.find(x=>x.id===fixture.white),b=here.find(x=>x.id===fixture.black);
   if(a&&b&&!(s.active&&[s.active.opponentId,s.active.playerId].some(id=>id===a.id||id===b.id))){
    const match=npcGame('chess-npc-'+hash(key+':'+a.id+':'+b.id),a,b,locationId,roomId,now.iso);
    if(result(s,match)){
     save.lastChessResult='Chess at '+locationId+': '+a.name+' versus '+b.name+
      (match.winnerId?' — '+(match.winnerId===a.id?a.name:b.name)+' won.':' — drawn.');
     settled++;
    }
    fixture.status='finished';
   }else fixture.status='cancelled';
  }
  if(!s.fixtures[key]&&here.length>=2){
   const willing=here.filter(x=>!s.active||![s.active.playerId,s.active.opponentId].includes(x.id));
   if(willing.length>=2){s.fixtures[key]={status:'scheduled',white:willing[0].id,black:willing[1].id,dueMinute:minute+15};started++;}
  }
 }
 return {started,settled};
}
const api=Object.freeze({VENUES,venue,state,reconstruct,legal,pick,start,play,abandon,tick,npcGame});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_CHESS=api;
})(typeof window!=='undefined'?window:globalThis);
