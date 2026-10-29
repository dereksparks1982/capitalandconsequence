'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../poker.js'),'utf8');
const memo=require('../poker-memory.js');
const save={};
memo.remember(save,'earlier-game','working',
 [{name:'Mickey Dunn',hands:10,raises:9,folds:1,calls:1}],{hands:10,raises:8,calls:2},10);
const nodes=Object.fromEntries(['pokerModal','pokerRoomName','pokerPot','pokerBoard',
 'pokerSeats','pokerLog','pokerCall','pokerRaise','pokerActions','pokerNext',
 'pokerBusinessClock'].map(id=>[id,{textContent:'',style:{},innerHTML:'',disabled:false,className:''}]));
const exits=[];
const window={addEventListener(){},
 FE_POKER_EXIT:(...args)=>exits.push(args),
 opener:{FE_POKER_MEMORY_SUMMARY:(room,name)=>memo.summary(save,room,name),
 FE_POKER_PLAYER_HABITS:room=>memo.playerHabits(save,room)}};
const fakeMath=Object.create(Math);fakeMath.random=()=>.38;
const patched=src.replace("window.FE_POKER={start,action:player,newHand,leave,setEtiquette};})();",
 "window.FE_POKER={start,action:player,newHand,leave,setEtiquette};window.__TEST={snapshot:()=>G};})();");
vm.runInNewContext(patched,{window,Math:fakeMath,Date,
 document:{querySelector:selector=>nodes[selector.slice(1)]||null},
 setInterval:()=>1,clearInterval:()=>{}});
window.FE_POKER.start('working');
assert.match(nodes.pokerSeats.innerHTML,/Past play: Often raises/);
assert.equal(window.__TEST.snapshot().pastPlayer.raises,8);
let steps=0;
while(!window.__TEST.snapshot().done&&steps++<120)
 window.FE_POKER.action('call');
assert.equal(window.__TEST.snapshot().done,true,'Normal poker hand still finishes');
window.FE_POKER.leave();
assert.equal(exits.length,1,'Actual session must settle once');
const observed=exits[0][5];
assert.ok(observed&&Array.isArray(observed.patrons));
assert.equal(observed.patrons.length,3);
assert.ok(observed.patrons.every(p=>Number.isSafeInteger(p.hands)&&p.hands>0));
assert.equal(JSON.stringify(observed).includes('hole'),false);
assert.equal(JSON.stringify(observed).includes('deck'),false);
assert.equal(memo.remember(save,'completed-session','working',
 observed.patrons,observed.player,exits[0][2]),true);
assert.equal(memo.summary(save,'working','Mickey Dunn').sessions,2);
console.log('PASS repeated poker table reads observed habits, plays a real hand and settles public-only session memory');
