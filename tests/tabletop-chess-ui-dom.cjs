'use strict';
/* DOM-light smoke for the actual chess parlor click path. No browser install. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),core=require('../tabletop-chess.js');
const nodes=Object.create(null);
function node(tag='div'){
 const e={tagName:tag.toUpperCase(),children:[],className:'',hidden:false,
  dataset:{},style:{},classList:{add(){},remove(){}},
  appendChild(child){this.children.push(child);return child},
  replaceChildren(...children){this.children=[...children]},
  setAttribute(key,value){this[key]=value},
  textContent:'',value:'',onclick:null};
 Object.defineProperty(e,'id',{set(v){this._id=v;nodes[v]=this},get(){return this._id}});
 Object.defineProperty(e,'innerHTML',{set(html){
  this._html=html;const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
  for(const id of ids){const child=node('div');child.id=id}
 },get(){return this._html||''}});
 return e;
}
const overlay=node('section');overlay.id='cityRoomOverlay';overlay.hidden=false;
const place={locationId:'hillsdale',roomId:'neighborhood-street'},anchor=node('main');
const document={
 getElementById:id=>nodes[id]||null,
 querySelector:selector=>selector==='#cityRoomOverlay .city-room-placeholder'?anchor:null,
 createElement:tag=>node(tag)
};
const S={gameDate:'1878-01-02',characterRoute:'industrialist',paused:false,phase:'day',worldCalendar:{version:1,worldMinute:1000}};
let saves=0,seconds=0,visitors=[{id:'samHarlan',name:'Samuel “Sam” Harlan',roomId:'neighborhood-street'}];
const window={FE_CHESS:core,FE_CITY:{currentLocation:()=>place},FE_NPC_AI:{visibleAt:()=>visitors},
 FE_CHARACTERS:{get:()=>({characterName:'Charles Whitcomb'})},
 FE_WASHINGTON_TIME:{canSpend:()=>true,now:()=>({iso:'1878-01-02T09:00'})},
 FederalElectricCity:{getLocation:()=>({name:'Hillsdale / Barry Farm'})},
 advanceWorldTime:s=>{seconds+=s;return s}};
const ctx={window,document,S,save:()=>{saves++},activeProfileId:()=>'p1',console};
vm.runInNewContext(fs.readFileSync(path.join(root,'tabletop-chess-ui.js'),'utf8'),ctx,{filename:'tabletop-chess-ui.js'});
const ui=window.FE_CHESS_UI;
const find=(node,p)=>{if(p(node))return node;for(const child of node.children||[]){const found=find(child,p);if(found)return found;}return null};
const all=(node,p)=>{let found=[];if(p(node))found.push(node);for(const child of node.children||[])found.push(...all(child,p));return found};
ui.refresh();
assert.equal(nodes.cityRoomChess.hidden,false);
const lounge=nodes.feChessLounge;
const choose=find(lounge,x=>x.tagName==='SELECT');
assert.ok(choose,'A local NPC selection list exists');
choose.value='samHarlan';
const start=find(lounge,x=>x.tagName==='BUTTON'&&x.textContent.startsWith('Challenge to Chess'));
assert.ok(start,'Chess challenge button is visible');
start.onclick();
assert.equal(seconds,60,'Starting the match costs one minute');
assert.equal(S.chessCircuit.active.opponentId,'samHarlan','Only the present resident is the opponent');
assert.equal(saves,1,'A challenge autosaves');
assert.equal(nodes.feChessGame.hidden,false,'Top-down table becomes visible');
let board=nodes.feChessGame;
assert.equal(all(board,x=>x.className.includes('fe-chess-square')).length,64,'All 64 squares are rendered');
assert.equal(all(board,x=>x.className.includes('fe-chess-person')).length,2,'Opponent and player have separate portrait seats');
find(board,x=>x.dataset.square==='e2').onclick();
board=nodes.feChessGame;
find(board,x=>x.dataset.square==='e4').onclick();
assert.equal(seconds,120,'One legal move costs another minute');
assert.equal(S.chessCircuit.active.moves.length,2,'Player and legal opponent moves are saved');
assert.equal(saves,2,'Chess moves autosave');
ui.beforeClose();
assert.equal(S.chessCircuit.results.length,1,'Leaving room records a player resignation');
assert.equal(S.chessCircuit.results[0].winnerId,'samHarlan');
visitors=[{id:'samHarlan',name:'Samuel Harlan',roomId:'neighborhood-street'}];
ui.refresh();
const second=find(nodes.feChessLounge,x=>x.tagName==='BUTTON'&&x.textContent.startsWith('Challenge to Chess'));
const select2=find(nodes.feChessLounge,x=>x.tagName==='SELECT');select2.value='samHarlan';
second.onclick();
visitors=[];
ui.refresh();
const departed=find(nodes.feChessGame,x=>x.tagName==='BUTTON'&&x.textContent==='Record Opponent Departure');
assert.ok(departed,'Room records real NPC departure rather than ghost turns');
departed.onclick();
assert.equal(S.chessCircuit.results.length,2);
assert.equal(S.chessCircuit.results[1].winnerId,'player:p1','Opponent absence awards the player victory');
overlay.hidden=true;ui.refresh();assert.equal(nodes.cityRoomChess.hidden,true,'Room close conceals the game panel');
console.log('TABLETOP_CHESS_UI_DOM_OK: real start, board, move, leave and opponent-departure paths passed');
