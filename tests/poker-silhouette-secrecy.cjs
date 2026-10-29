'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../poker.js'),'utf8');
const style=fs.readFileSync(path.join(__dirname,'../styles.css'),'utf8');
const page=fs.readFileSync(path.join(__dirname,'../poker.html'),'utf8');
const marker="window.FE_POKER={start,action:player,newHand,leave,setEtiquette};})();";
assert.ok(source.includes(marker),'Poker engine exports must remain unchanged');
const testSource=source.replace(marker,
 "window.FE_POKER={start,action:player,newHand,leave,setEtiquette};"+
 "window.__POKER_TEST={setGame:g=>G=g,render};})();");
const elements=Object.fromEntries(['pokerPot','pokerBoard','pokerSeats','pokerLog',
 'pokerCall','pokerRaise','pokerActions','pokerNext'].map(id=>
 [id,{textContent:'',innerHTML:'',style:{},disabled:false}]));
const win={addEventListener(){}};
const sandbox={window:win,document:{querySelector:query=>elements[query.slice(1)]||null},
 setInterval:()=>1,clearInterval:()=>{},Date,Math};
vm.runInNewContext(testSource,sandbox);
const card=(r,s)=>({r,s,v:'23456789TJQKA'.indexOf(r)+2});
const p=(name,fold=false)=>({name,chips:75,style:'steady',hole:[card('A','♠'),card('K','♦')],
 fold,allIn:false,bet:0,acted:true,raiseOpen:false});
const players=[p('You'),p('Mickey Dunn'),p('Joe Rourke',true),p('Frank Bell')];
const game={players,board:[],pot:12,currentBet:0,turnIndex:1,done:false,log:[]};
win.__POKER_TEST.setGame(game);
function markup(i){
 const html=elements.pokerSeats.innerHTML;
 const start=html.indexOf('class="p-seat seat-'+i);
 const end=html.indexOf('class="p-seat seat-'+(i+1),start+1);
 return html.slice(start,end<0?undefined:end);
}
win.__POKER_TEST.render(false);
assert.equal((elements.pokerSeats.innerHTML.match(/class="poker-portrait(?: poker-portrait-player)?"/g)||[]).length,4,
 'Each table seat has one temporary silhouette');
assert.equal((markup(0).match(/class="p-card/g)||[]).length,2,'Player sees both cards');
assert.equal((markup(0).match(/class="p-card[^"]* back"/g)||[]).length,0,'Player cards are face up');
for(const i of [1,2,3])
 assert.equal((markup(i).match(/class="p-card[^"]* back"/g)||[]).length,2,
  'Opponents must be concealed before showdown');
win.__POKER_TEST.render(true);
for(const i of [1,3])
 assert.equal((markup(i).match(/class="p-card[^"]* back"/g)||[]).length,0,
  'Live contenders reveal their cards at a contested showdown');
assert.equal((markup(2).match(/class="p-card[^"]* back"/g)||[]).length,2,
 'A folded hand remains concealed at showdown');
players[1].fold=true;players[3].fold=true;
win.__POKER_TEST.render(true);
for(const i of [1,2,3])
 assert.equal((markup(i).match(/class="p-card[^"]* back"/g)||[]).length,2,
  'A winner by folds has no reason to reveal opponents cards');
assert.match(style,/\.p-seat \.poker-portrait\{/);
assert.match(style,/\.p-seat \.poker-portrait-head\{/);
assert.match(page,/poker\.js\?v=20261029-v0717-silhouettes/);
assert.match(page,/styles\.css\?v=20261029-v0717-poker/);
console.log('PASS poker patron silhouettes, private cards, live showdown, folded secrecy and table styles');
