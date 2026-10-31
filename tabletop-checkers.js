/* Capital & Consequence · American checkers / English draughts.
 * Original rules implementation; no third-party assets or network dependency.
 * Eight-by-eight dark-square board. Red moves first from near side.
 * Men advance forward, kings both ways; jumps are compulsory, including
 * multiple jumps, and crowning ENDS the current turn.
 */
(function(root){'use strict';
const VENUES=Object.freeze({hillsdale:['neighborhood-street'],workingPoker:['card-room']});
const copy=x=>JSON.parse(JSON.stringify(x));
const hash=x=>{let h=2166136261;for(const ch of String(x)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const row=i=>Math.floor(i/8),col=i=>i%8;
const dark=i=>(row(i)+col(i))%2===1;
const own=(p,side)=>!!p&&p.toLowerCase()===side;
const crowned=p=>p==='R'||p==='B';
const opposite=side=>side==='r'?'b':'r';
const direction=p=>crowned(p)?[-1,1]:[p==='r'?-1:1];
const index=(r,c)=>r>=0&&r<8&&c>=0&&c<8?r*8+c:-1;
function initial(){
 const board=Array(64).fill(null);
 for(let i=0;i<64;i++)if(dark(i)){
  if(row(i)<3)board[i]='b';
  if(row(i)>4)board[i]='r';
 }
 return board;
}
function fresh(){return {board:initial(),turn:'r',forced:null,quiet:0,ply:0,history:[],status:'playing',winner:null,reason:null}}
function options(position){
 if(!position||!Array.isArray(position.board)||position.board.length!==64||position.status!=='playing')return [];
 const board=position.board,side=position.turn,captures=[],steps=[];
 for(let from=0;from<64;from++){
  const p=board[from];if(!own(p,side)||position.forced!==null&&position.forced!==from)continue;
  for(const dr of direction(p))for(const dc of [-1,1]){
   const next=index(row(from)+dr,col(from)+dc);
   if(next<0||!dark(next))continue;
   if(!board[next]){if(position.forced===null)steps.push({from,to:next,capture:null});continue;}
   const beyond=index(row(from)+2*dr,col(from)+2*dc);
   if(beyond>=0&&dark(beyond)&&own(board[next],opposite(side))&&!board[beyond])
    captures.push({from,to:beyond,capture:next});
  }
 }
 return captures.length?captures:position.forced!==null?[]:steps;
}
function outcome(position){
 if(position.quiet>=80)return {winner:null,reason:'80 quiet half-moves'};
 if(position.ply>=320)return {winner:null,reason:'320-ply limit'};
 const remaining=position.board.filter(p=>own(p,position.turn)).length;
 if(remaining===0||options(position).length===0)return {winner:opposite(position.turn),reason:remaining?'no legal moves':'no pieces'};
 return null;
}
function apply(position,from,to){
 const legal=options(position).find(x=>x.from===from&&x.to===to);
 if(!legal)return {ok:false,reason:'Illegal move. Captures are compulsory and an unfinished jump must continue.'};
 const b=position.board,side=position.turn,piece=b[from];
 b[from]=null;b[to]=piece;
 if(legal.capture!==null)b[legal.capture]=null;
 const crown=!crowned(piece)&&(side==='r'?row(to)===0:row(to)===7);
 if(crown)b[to]=side.toUpperCase();
 const move={from,to,captured:legal.capture,piece,king:crown,side};
 position.history.push(move);position.ply++;
 position.quiet=legal.capture!==null||crown?0:position.quiet+1;
 // A newly crowned man never makes another jump on the promotion turn.
 if(legal.capture!==null&&!crown){
  position.forced=to;
  if(options(position).some(x=>x.capture!==null))return {ok:true,move,continues:true,finished:false};
 }
 position.forced=null;position.turn=opposite(side);
 const end=outcome(position);
 if(end){position.status='finished';position.winner=end.winner;position.reason=end.reason;}
 return {ok:true,move,continues:false,finished:!!end};
}
function state(save){
 if(!save||typeof save!=='object')throw Error('A saved Washington profile is required');
 let s=save.checkersCircuit;
 if(!s||s.version!==1||!Array.isArray(s.results)||!s.records||typeof s.records!=='object'){
  s=save.checkersCircuit={version:1,nextId:1,active:null,fixtures:{},results:[],records:{},lastMinute:null};
 }else{
  s.fixtures=s.fixtures&&typeof s.fixtures==='object'?s.fixtures:{};
  if(!Number.isSafeInteger(s.nextId)||s.nextId<1)s.nextId=1;
 }
 return s;
}
function venue(locationId,roomId){return !!VENUES[locationId]?.includes(roomId)}
function now(save){return root.FE_WASHINGTON_TIME?.now?.(save)?.iso||String(save.gameDate||'')+'T08:00'}
function receipt(s,g,pos,reason,at){
 if(s.results.some(r=>r.id===g.id))return null;
 const winner=pos.winner===null?null:pos.winner==='r'?g.playerId:g.opponentId;
 const row={id:g.id,game:'checkers',variant:'american-checkers',at,locationId:g.locationId,roomId:g.roomId,
  red:{id:g.playerId,name:g.playerName},black:{id:g.opponentId,name:g.opponentName},
  winnerId:winner,reason:reason||pos.reason||'completed',moves:copy(pos.history),
  standings:{[g.playerId]:winner===g.playerId?'win':winner?'loss':'draw',
   [g.opponentId]:winner===g.opponentId?'win':winner?'loss':'draw'}};
 s.results.push(row);
 for(const [id,v] of Object.entries(row.standings)){
  const standing=s.records[id]||(s.records[id]={played:0,wins:0,losses:0,draws:0});
  standing.played++;standing[v==='win'?'wins':v==='loss'?'losses':'draws']++;
 }
 return copy(row);
}
function finish(save,reason,at){
 const s=state(save),g=s.active;if(!g)return null;
 const pos=g.position;
 if(reason==='resigned'){pos.winner='b';pos.status='finished'}
 else if(reason==='opponent-left'){pos.winner='r';pos.status='finished'}
 else if(pos.status!=='finished')return null;
 const r=receipt(s,g,pos,reason||pos.reason,at||now(save));
 s.active=null;
 if(r)save.lastCheckersResult='Checkers at '+g.venueName+': '+g.playerName+' versus '+g.opponentName+
  (r.winnerId?' · '+(r.winnerId===g.playerId?g.playerName:g.opponentName)+' won.':' · draw.');
 return r;
}
function present(p,player,room){return Array.isArray(p)&&p.some(x=>x.id===player&&x.roomId===room)}
function start(save,{locationId,roomId,venueName,playerId,playerName,opponentId,opponentName,present:visitors,at}={}){
 if(!venue(locationId,roomId)||!opponentId||!playerId||playerId===opponentId||!present(visitors,opponentId,roomId))
  return {ok:false,reason:'A real opponent and a checkers board must both be present in this room.'};
 const s=state(save);
 if(s.active)return {ok:false,reason:'Finish the current checkers game before accepting another.'};
 const id='checkers-'+s.nextId++;
 s.active={id,locationId,roomId,venueName:venueName||locationId,playerId,playerName,
  opponentId,opponentName,startedAt:at||now(save),aiDepth:Math.max(2,Math.min(5,Number(save.checkersAiDepth)||4)),position:fresh()};
 return {ok:true,id};
}
function legal(save,from){const p=state(save).active?.position;return p?options(p).filter(m=>m.from===from):[]}
function pick(position,seed,depth=4){
 const ai=typeof module==='object'&&module.exports?
  require('./vendor/rapid-draughts-ai/search.js'):root.FE_DRAUGHTS_AI;
 if(!ai?.choose)throw Error('Offline alpha-beta checkers AI must be loaded before game play.');
 return ai.choose(position,{options,apply,depth,seed,limit:depth<=2?4000:16000});
}
function npcTurn(pos,seed,depth=4){
 const moves=[];let safety=0;
 while(pos.status==='playing'&&pos.turn==='b'&&safety++<20){
  const move=pick(pos,seed+':'+safety,depth);if(!move)break;
  const result=apply(pos,move.from,move.to);
  if(!result.ok)throw Error('Checkers NPC attempted an illegal move');
  moves.push(result.move);
 }
 return moves;
}
function play(save,from,to,{locationId,roomId,present:visitors,at}={}){
 const s=state(save),g=s.active;
 if(!g||g.locationId!==locationId||g.roomId!==roomId)return {ok:false,reason:'No active checkers match at this table.'};
 if(!present(visitors,g.opponentId,roomId))return {ok:false,reason:'Opponent departed.',receipt:finish(save,'opponent-left',at)};
 if(g.position.turn!=='r')return {ok:false,reason:'Wait for the black pieces to move.'};
 const step=apply(g.position,from,to);if(!step.ok)return step;
 if(g.position.status==='finished')return {ok:true,move:step.move,opponent:[],continues:false,receipt:finish(save,null,at)};
 const opponent=step.continues?[]:npcTurn(g.position,g.id+':'+g.position.ply,g.aiDepth||4);
 const ended=g.position.status==='finished';
 return {ok:true,move:step.move,opponent,continues:step.continues,receipt:ended?finish(save,null,at):null};
}
function simulate(id,a,b,locationId,roomId,at){
 const pos=fresh();let safety=0;
 while(pos.status==='playing'&&safety++<320){
  const m=pick(pos,id+':'+safety,2);if(!m)break;
  const done=apply(pos,m.from,m.to);if(!done.ok)throw Error('NPC checkers simulation made an illegal move');
 }
 if(pos.status!=='finished'){pos.status='finished';pos.reason='simulation limit';pos.winner=null;}
 const g={id,playerId:a.id,playerName:a.name,opponentId:b.id,opponentName:b.name,locationId,roomId};
 const resultState={results:[],records:{}};
 return receipt(resultState,g,pos,pos.reason,at);
}
function tick(save,{now:time,presentAt}={}){
 if(!time?.iso||!Number.isSafeInteger(save?.worldCalendar?.worldMinute)||typeof presentAt!=='function')return {started:0,settled:0};
 const s=state(save),minute=save.worldCalendar.worldMinute;
 if(s.lastMinute===minute)return {started:0,settled:0};
 s.lastMinute=minute;let started=0,settled=0;
 for(const [locationId,rooms] of Object.entries(VENUES))for(const roomId of rooms){
  const atTable=presentAt(locationId).filter(x=>x.roomId===roomId);
  const key=time.date+':'+locationId+':'+roomId,fixture=s.fixtures[key];
  if(fixture?.status==='scheduled'&&minute>=fixture.dueMinute){
   const a=atTable.find(x=>x.id===fixture.red),b=atTable.find(x=>x.id===fixture.black);
   if(a&&b){
    const r=simulate('checkers-npc-'+hash(key+':'+a.id+':'+b.id),a,b,locationId,roomId,time.iso);
    if(r&&!s.results.some(x=>x.id===r.id)){
     s.results.push(r);
     for(const [id,v] of Object.entries(r.standings)){
      const row=s.records[id]||(s.records[id]={played:0,wins:0,losses:0,draws:0});
      row.played++;row[v==='win'?'wins':v==='loss'?'losses':'draws']++;
     }
     save.lastCheckersResult='Checkers at '+locationId+': '+a.name+' versus '+b.name+
      (r.winnerId?' · '+(r.winnerId===a.id?a.name:b.name)+' won.':' · draw.');
     settled++;
    }
    fixture.status='finished';
   }else fixture.status='cancelled';
  }
  if(!fixture&&atTable.length>=2){
   const chess=save.chessCircuit,chessFixture=chess?.fixtures?.[key];
   const occupied=new Set();
   if(chessFixture?.status==='scheduled'){occupied.add(chessFixture.white);occupied.add(chessFixture.black);}
   if(chess?.active&&chess.active.locationId===locationId&&chess.active.roomId===roomId)occupied.add(chess.active.opponentId);
   if(s.active&&s.active.locationId===locationId&&s.active.roomId===roomId)occupied.add(s.active.opponentId);
   const candidates=atTable.filter(x=>!occupied.has(x.id));
   if(candidates.length>=2){
    s.fixtures[key]={status:'scheduled',red:candidates[0].id,black:candidates[1].id,dueMinute:minute+12};started++;
   }
  }
 }
 return {started,settled};
}
const api=Object.freeze({VENUES,initial,fresh,options,apply,venue,state,legal,start,play,pick,npcTurn,simulate,abandon:save=>finish(save,'resigned'),departed:save=>finish(save,'opponent-left'),tick});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CHECKERS=api;
})(typeof window!=='undefined'?window:globalThis);
