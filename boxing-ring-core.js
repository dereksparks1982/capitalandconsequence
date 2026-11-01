/* Original offline top-down sparring simulation. No career/economy writes. */
(function(root){'use strict';
const C=root.FE_ROOM_BUILDER_CORE;
const limit=(v,min,max)=>Math.max(min,Math.min(max,v));
const dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const RULES=Object.freeze({rounds:3,roundMs:35000,breakMs:3000,punchCost:12,punchDelay:440,windup:680,stepCost:.45,exhaustedStepDelay:270});
function character(x,y,max,face){return {x,y,face,health:100,stamina:max,maxStamina:max,moveWait:0,punchWait:0};}
function create(energy=80){
 if(!C)throw Error('Room engine missing');
 const room=C.makeRoom('washington-arena','practice-ring',14,10);
 for(let y=1;y<9;y++)for(let x=1;x<13;x++)room.floor[C.index(room,x,y)]='floor_ochre';
 const max=70+Math.round(limit(Number(energy)||0,0,100)*.3);
 return {room,phase:'fighting',round:1,roundMs:RULES.roundMs,breakMs:0,elapsed:0,
  player:character(4,5,max,'right'),opponent:character(9,5,98,'left'),
  ai:{windup:0,cooldown:1000,moveWait:0,guard:false},
  blocking:false,hits:0,blocks:0,opponentHits:0,roundPoints:{player:0,opponent:0},scorecards:[],winner:null,final:null,message:'Round 1. Watch the opponent.'};
}
function move(s,actor,dx,dy){
 if(!Number.isInteger(dx)||!Number.isInteger(dy)||Math.abs(dx)+Math.abs(dy)!==1)return false;
 const x=actor.x+dx,y=actor.y+dy,other=actor===s.player?s.opponent:s.player;
 if(x<=0||x>=s.room.widthTiles-1||y<=0||y>=s.room.heightTiles-1||C.blocked(s.room,x,y))return false;
 if(other.x===x&&other.y===y)return false;
 actor.x=x;actor.y=y;actor.face=dx>0?'right':dx<0?'left':dy>0?'front':'back';
 return true;
}
function recordRound(s){
 const p=s.roundPoints.player,o=s.roundPoints.opponent;
 const playerScore=p===o?10:p>o?10:9;
 const opponentScore=p===o?10:o>p?10:9;
 s.scorecards.push({round:s.round,player:playerScore,opponent:opponentScore});
 s.roundPoints={player:0,opponent:0};
}
function decisionWinner(s){
 const totals=s.scorecards.reduce((a,r)=>({player:a.player+r.player,opponent:a.opponent+r.opponent}),{player:0,opponent:0});
 return totals.player===totals.opponent?'draw':totals.player>totals.opponent?'player':'opponent';
}
function facingTarget(fighter,target){
 const dx=target.x-fighter.x,dy=target.y-fighter.y;
 if(fighter.face==='right')return dx>0&&Math.abs(dy)<=1;
 if(fighter.face==='left')return dx<0&&Math.abs(dy)<=1;
 if(fighter.face==='front')return dy>0&&Math.abs(dx)<=1;
 if(fighter.face==='back')return dy<0&&Math.abs(dx)<=1;
 return false;
}
function finish(s,method,winner=null){
 s.phase='finished';s.final=method;s.winner=winner;s.blocking=false;
 const outcome=winner==='player'?'You win':winner==='opponent'?'Opponent wins':winner==='draw'?'Draw':'Bout over';
 s.message=outcome+' by '+method+'.';
}
function punch(s){
 const p=s?.player,o=s?.opponent;
 if(!p||s.phase!=='fighting'||s.blocking||p.punchWait>0||p.stamina<RULES.punchCost)return false;
 p.punchWait=RULES.punchDelay;p.stamina-=RULES.punchCost;
 if(dist(p,o)>2||!facingTarget(p,o)){s.message='Punch missed. Face your opponent and get closer.';return true;}
 o.health=Math.max(0,o.health-(s.ai.guard?2:10));
 s.hits++;s.roundPoints.player+=s.ai.guard?1:3;s.message=s.ai.guard?'Opponent blocked your punch.':'Punch landed.';
 if(o.health<=0)finish(s,'knockout','player');
 return true;
}
function newRound(s){
 s.round++;
 if(s.round>RULES.rounds){finish(s,'decision',decisionWinner(s));return;}
 for(const f of [s.player,s.opponent]){
  const cap=Math.max(42,f.maxStamina-10);
  f.stamina=Math.min(cap,f.stamina+(cap-f.stamina)*.55);
  f.maxStamina=cap;
 }
 s.player.x=4;s.player.y=5;s.opponent.x=9;s.opponent.y=5;
 s.player.punchWait=0;s.player.moveWait=0;s.ai={windup:0,cooldown:1000,moveWait:0,guard:false};
 s.phase='fighting';s.roundMs=RULES.roundMs;
 s.message='Round '+s.round+'. Some stamina returned, but fatigue remains.';
}
function step(s,ms,keys={}){
 if(!s||s.phase==='finished')return s;
 const dt=limit(Number(ms)||0,0,100);s.elapsed+=dt;
 if(s.phase==='break'){
  s.breakMs=Math.max(0,s.breakMs-dt);
  if(s.breakMs===0)newRound(s);
  return s;
 }
 const p=s.player,o=s.opponent,a=s.ai;
 p.punchWait=Math.max(0,p.punchWait-dt);p.moveWait=Math.max(0,p.moveWait-dt);
 a.moveWait=Math.max(0,a.moveWait-dt);
 s.blocking=Boolean(keys.block)&&p.stamina>=2;
 if(s.blocking)p.stamina=Math.max(0,p.stamina-dt*.012);
 if(p.stamina<2)s.blocking=false;
 if(p.moveWait===0){
  const dx=Math.sign(keys.dx||0),dy=Math.sign(keys.dy||0);
  if(dx||dy){
   const moved=(dx&&move(s,p,dx,0))||(dy&&move(s,p,0,dy));
   if(moved){
    const tired=p.stamina<8;
    p.stamina=Math.max(0,p.stamina-RULES.stepCost);
    p.moveWait=tired?RULES.exhaustedStepDelay:140;
   }
  }
 }
 let distance=dist(p,o);
 if(distance>1&&a.moveWait===0){
  let best=null;
  for(const [dx,dy] of [[0,1],[1,0],[0,-1],[-1,0]]){
   const goal={x:p.x+dx,y:p.y+dy};
   if(C.blocked(s.room,goal.x,goal.y))continue;
   const route=C.path(s.room,{x:o.x,y:o.y},goal);
   if(route?.length&&(!best||route.length<best.length))best=route;
  }
  if(best&&move(s,o,best[0].x-o.x,best[0].y-o.y))a.moveWait=310;
 }
 distance=dist(p,o);
 a.guard=distance<=2&&a.windup===0&&Math.floor(s.elapsed/1100)%5===3;
 if(a.windup>0){
  a.windup=Math.max(0,a.windup-dt);
  if(a.windup===0){
   if(distance<=2&&o.stamina>=6&&a.target&&dist(p,a.target)<=1){
    o.stamina-=6;
    if(s.blocking){p.health=Math.max(0,p.health-1);p.stamina=Math.max(0,p.stamina-4);
     s.blocks++;s.roundPoints.player+=1;s.message='Blocked! Guard absorbed most of the punch.';}
    else{p.health=Math.max(0,p.health-9);s.opponentHits++;s.roundPoints.opponent+=3;s.message='Opponent connected.';}
    if(p.health===0){finish(s,'referee stoppage','opponent');return s;}
   }else s.message='Opponent missed. You moved out of the punch line.';
   a.cooldown=950;
  }
 }else{
  a.cooldown=Math.max(0,a.cooldown-dt);
  if(distance<=2&&a.cooldown===0&&o.stamina>=6){
   a.windup=RULES.windup;a.guard=false;a.target={x:p.x,y:p.y};
   s.message='Punch coming! Hold RIGHT CLICK to block.';
  }
 }
 s.roundMs=Math.max(0,s.roundMs-dt);
 if(s.roundMs===0){
  recordRound(s);
  if(s.round>=RULES.rounds)finish(s,'decision',decisionWinner(s));
  else{s.phase='break';s.breakMs=RULES.breakMs;s.blocking=false;
   s.message='End of round '+s.round+'. Partial stamina recovery at the bell.';}
 }
 return s;
}
const api=Object.freeze({RULES,create,move,punch,step,dist,decisionWinner,facingTarget});
root.FE_TOPDOWN_BOXING=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
