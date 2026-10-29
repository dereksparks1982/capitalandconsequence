'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const script=fs.readFileSync(path.join(__dirname,'../poker.js'),'utf8');
const marker="window.FE_POKER={start,action:player,newHand,leave,setEtiquette};})();";
assert.ok(script.includes(marker));
const patched=script.replace(marker,
 "window.FE_POKER={start,action:player,newHand,leave,setEtiquette};"+
 "window.__POKER_TEST={snapshot:()=>G};})();");
const elements=Object.fromEntries(['pokerBusinessClock','pokerModal','pokerRoomName',
 'pokerPot','pokerBoard','pokerSeats','pokerLog','pokerCall','pokerRaise',
 'pokerActions','pokerNext'].map(id=>[id,{textContent:'',innerHTML:'',style:{},
 className:'',disabled:false}]));
let settlement=null;
const win={addEventListener(){},FE_POKER_EXIT:(...args)=>{settlement=args}};
const deterministicMath=Object.create(Math);
deterministicMath.random=()=>.38;
const ctx={window:win,document:{querySelector:sel=>elements[sel.slice(1)]||null},
 Math:deterministicMath,Date,setInterval:()=>1,clearInterval:()=>{}};
vm.runInNewContext(patched,ctx);
win.FE_POKER.start('working');
assert.match(elements.pokerRoomName.textContent,/Boiler Room/);
assert.ok(elements.pokerSeats.innerHTML.includes('poker-portrait'));
assert.equal(win.__POKER_TEST.snapshot().players.length,4);
assert.equal((elements.pokerSeats.innerHTML.match(/class="poker-dealer"/g)||[]).length,1,
 'Exactly one real dealer button is displayed at the poker table');
assert.equal((elements.pokerSeats.innerHTML.match(/ is-turn/g)||[]).length,1,
 'The current acting seat is highlighted without moving any seat');
let moves=0;
while(!win.__POKER_TEST.snapshot().done&&moves++<100){
 const g=win.__POKER_TEST.snapshot();
 assert.equal(g.turnIndex,0,'Only the human should be prompted by the poker loop');
 win.FE_POKER.action('call');
}
assert.ok(win.__POKER_TEST.snapshot().done,'A real hand reaches settlement');
assert.equal(win.__POKER_TEST.snapshot().completedHands,1);
assert.equal(elements.pokerNext.style.display,'inline-block');
win.FE_POKER.newHand();
assert.equal(win.__POKER_TEST.snapshot().handNo,2,'Deal Next Hand still works');
win.FE_POKER.leave();
assert.ok(settlement&&settlement.length===6,'Session settlement preserves original five arguments plus public action summary');
console.log('PASS real poker hand, silhouette seating, existing betting, next hand and session settlement');
