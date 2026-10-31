'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const checkers=require('../tabletop-checkers.js');
const nodes=Object.create(null);
function node(tag='div'){
 const e={tagName:tag.toUpperCase(),children:[],className:'',hidden:false,disabled:false,dataset:{},textContent:'',
  style:{},value:'',onclick:null,classList:{add(){},remove(){}},
  append(...c){this.children.push(...c)},appendChild(x){this.children.push(x);return x},
  replaceChildren(...x){this.children=[...x]},
  setAttribute(k,v){this[k]=v}};
 Object.defineProperty(e,'id',{get(){return this._id},set(v){this._id=v;nodes[v]=this}});
 Object.defineProperty(e,'innerHTML',{set(html){
  this._html=html;for(const id of [...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1])){const item=node();item.id=id}
 },get(){return this._html||''}});
 return e;
}
const overlay=node('div');overlay.id='cityRoomOverlay';overlay.hidden=false;
const anchor=node('div');const document={getElementById:id=>nodes[id]||null,
 querySelector:sel=>sel==='#cityRoomOverlay .city-room-placeholder'?anchor:null,createElement:node};
const here={locationId:'hillsdale',roomId:'neighborhood-street'};
const visitors=[{id:'samHarlan',name:'Sam Harlan',roomId:here.roomId}];
const S={gameDate:'1878-01-02',phase:'day',characterRoute:'industrialist',checkersAiDepth:4,paused:false};
let seconds=0,saves=0;
const window={FE_CHECKERS:checkers,FE_CITY:{currentLocation:()=>here},FE_NPC_AI:{visibleAt:()=>visitors},
 FE_CHARACTERS:{get:()=>({characterName:'Charles Whitcomb'})},
 FE_WASHINGTON_TIME:{canSpend:()=>true,now:()=>({iso:'1878-01-02T09:00'})},
 FederalElectricCity:{getLocation:()=>({name:'Hillsdale / Barry Farm'})},
 advanceWorldTime:n=>{seconds+=n;return n}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','tabletop-checkers-ui.js'),'utf8'),
 {window,document,S,save:()=>{saves++;return true},activeProfileId:()=>'charlie',console});
const all=(n,test,out=[])=>{if(test(n))out.push(n);for(const child of n.children||[])all(child,test,out);return out};
window.FE_CHECKERS_UI.refresh();
assert.equal(nodes.cityRoomCheckers.hidden,false);
const fields=all(nodes.feCheckersGuests,x=>x.tagName==='SELECT');
assert.equal(fields.length,2,'NPC and difficulty selectors both shown');
fields[0].value='samHarlan';fields[1].value='3';
const challenge=all(nodes.feCheckersGuests,x=>x.tagName==='BUTTON'&&x.textContent.includes('Challenge to Checkers'))[0];
assert.ok(challenge);challenge.onclick();
assert.equal(seconds,60);assert.equal(S.checkersCircuit.active.aiDepth,3);
assert.equal(nodes.feCheckersMatch.hidden,false);
const board=all(nodes.feCheckersMatch,x=>x.className.includes('fe-checkers-square'));
assert.equal(board.length,64,'Real 64 square overhead table');
assert.equal(board.filter(x=>x.className.includes('fe-checkers-selectable')).length,4,
 'Only the four front-rank red men have legal opening moves on the actual tabletop');
assert.equal(board.filter(x=>x['aria-pressed']==='true').length,0);
assert.equal(board.filter(x=>x['aria-label'].includes('red man')).length,12);
assert.equal(all(nodes.feCheckersMatch,x=>x.className.includes('fe-chess-person')).length,2,'Two physical player portraits');
const legal=checkers.options(S.checkersCircuit.active.position)[0];
board[legal.from].onclick();
const changed=all(nodes.feCheckersMatch,x=>x.className.includes('fe-checkers-square'));
changed[legal.to].onclick();
assert.equal(seconds,120,'A real turn spends exactly a minute');
assert.ok(S.checkersCircuit.active.position.ply>=2,'Opponent replies instead of self-play');
assert.ok(all(nodes.feCheckersMatch,x=>x.className.includes('fe-checkers-move-history'))
 .some(x=>x.children.some(y=>y.textContent.includes('Red '))),
 'The tabletop includes the actual played moves in a player-readable journal');
assert.equal(saves,2);
window.FE_CHECKERS_UI.beforeClose();
assert.equal(S.checkersCircuit.results[0].winnerId,'samHarlan');
assert.equal(S.checkersCircuit.results.length,1);
overlay.hidden=true;window.FE_CHECKERS_UI.refresh();
assert.equal(nodes.cityRoomCheckers.hidden,true);
console.log('PASS checkers DOM: NPC selection, adjustable AI, tabletop 64 squares, real human move, AI response, saved room departure');
