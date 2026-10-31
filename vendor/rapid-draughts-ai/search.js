/* rapid-draughts alpha-beta search adaptation for Capital & Consequence.
 * Source: https://github.com/loks0n/rapid-draughts (MIT, Copyright 2023 loks0n).
 * Inspired by src/computer/alpha-beta.ts and src/english/computer.ts.
 * Adapter uses the game's own 8x8 American-checkers board and mandatory
 * multi-jump sequences. No network, package install, or imported artwork.
 * Full upstream MIT license: vendor/rapid-draughts-ai/LICENSE.
 */
(function(root){'use strict';
const clone=p=>({board:p.board.slice(),turn:p.turn,forced:p.forced,quiet:p.quiet,
 ply:p.ply,history:[],status:p.status,winner:p.winner,reason:p.reason});
const same=(p,side)=>!!p&&p.toLowerCase()===side;
const other=s=>s==='r'?'b':'r';
const centered=i=>{const x=i%8,y=Math.floor(i/8);return (3.5-Math.abs(x-3.5))+(3.5-Math.abs(y-3.5))};
function evaluate(p,side,legal){
 if(p.status==='finished')return p.winner===null?0:p.winner===side?100000-p.ply:-100000+p.ply;
 let total=0;
 for(let i=0;i<64;i++){
  const x=p.board[i];if(!x)continue;
  const r=Math.floor(i/8),king=x===x.toUpperCase();
  const score=(king?180:100)+centered(i)*4+(king?0:(x==='r'?7-r:r)*2)+
   (!king&&((x==='r'&&r===7)||(x==='b'&&r===0))?5:0);
  total+=same(x,side)?score:-score;
 }
 if(legal?.length)total+=p.turn===side?Math.min(legal.length,10): -Math.min(legal.length,10);
 return total;
}
function ordered(moves){return moves.slice().sort((a,b)=>Number(b.capture!==null)-Number(a.capture!==null)||a.from-b.from||a.to-b.to)}
function search(p,depth,alpha,beta,side,tools,budget){
 if(budget.count++>=budget.limit)return evaluate(p,side);
 if(p.status==='finished')return evaluate(p,side);
 const moves=tools.options(p);
 if(!moves.length)return p.turn===side?-90000+p.ply:90000-p.ply;
 // From rapid-draughts: finish forcing capture sequences at the leaf so the
 // search does not stop with a man suspended in the middle of a jump.
 if(depth<=0&&p.forced===null&&!moves.some(x=>x.capture!==null))return evaluate(p,side,moves);
 const maximize=p.turn===side;
 let best=maximize?-Infinity:Infinity;
 for(const m of ordered(moves)){
  const next=clone(p),before=next.turn;
  const result=tools.apply(next,m.from,m.to);
  if(!result.ok)throw Error('AI generated illegal checkers move');
  const score=search(next,depth-(next.turn===before?0:1),alpha,beta,side,tools,budget);
  if(maximize){if(score>best)best=score;if(best>alpha)alpha=best;}
  else{if(score<best)best=score;if(best<beta)beta=best;}
  if(alpha>=beta||budget.count>=budget.limit)break;
 }
 return Number.isFinite(best)?best:evaluate(p,side,moves);
}
function choose(position,{options,apply,depth=4,limit=16000,seed=''}={}){
 if(typeof options!=='function'||typeof apply!=='function')throw Error('Checkers search requires legal move generation and application');
 const moves=ordered(options(position));
 if(!moves.length)return null;
 const maxDepth=Math.max(2,Math.min(5,Math.round(Number(depth)||4)));
 const budget={count:0,limit:Math.max(100,Math.min(60000,Math.trunc(Number(limit)||16000)))};
 const tools={options,apply},side=position.turn;
 let best=null,bestScore=-Infinity;
 for(const move of moves){
  const next=clone(position),before=next.turn;
  const result=apply(next,move.from,move.to);
  if(!result.ok)throw Error('Invalid move from checkers AI rules adapter');
  const score=search(next,maxDepth-(next.turn===before?0:1),-Infinity,Infinity,side,tools,budget);
  // Deterministic tie variation avoids lockstep NPC-only fixtures.
  const tie=String(seed)+':'+move.from+':'+move.to;
  let hashed=0;for(let i=0;i<tie.length;i++)hashed=(Math.imul(hashed,31)+tie.charCodeAt(i))|0;
  const adjusted=score+(hashed>>>0)%100/10000;
  if(adjusted>bestScore){bestScore=adjusted;best=move;}
  if(budget.count>=budget.limit)break;
 }
 return best;
}
const api=Object.freeze({choose,evaluate,search});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_DRAUGHTS_AI=api;
})(typeof window!=='undefined'?window:globalThis);
