'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../poker.js'),'utf8');
const after=require('../duel-aftermath.js');
const save={gameDate:'1878-05-03'};
const make=(id,who,shot)=>after.record(save,{id,status:'resolved',opponent:who,
 endedOn:save.gameDate,locationId:'workingPoker',playerShot:shot,opponentShot:'missed'});
make('duel-1','Mickey Dunn','wounded');make('duel-2','Joe Rourke','killed');
const elements=Object.fromEntries(['pokerModal','pokerRoomName','pokerPot','pokerBoard',
 'pokerSeats','pokerLog','pokerCall','pokerRaise','pokerActions','pokerNext',
 'pokerBusinessClock'].map(k=>[k,{textContent:'',style:{},innerHTML:'',className:'',disabled:false}]));
const ctx={window:{opener:{FE_POKER_OPPONENT_STATUS:(tier,name)=>after.opponentStatus(save,name,save.gameDate)},addEventListener(){}},
 document:{querySelector:sel=>elements[sel.slice(1)]||null},
 setInterval:()=>1,clearInterval:()=>{},Math,Date};
vm.runInNewContext(source.replace("window.FE_POKER={start,action:player,newHand,leave,setEtiquette};})();",
 "window.FE_POKER={start,action:player,newHand,leave,setEtiquette};window.__TEST={state:()=>G};})();"),ctx);
ctx.window.FE_POKER.start('working');
assert.deepEqual(Array.from(ctx.window.__TEST.state().players,p=>p.name),['You','Frank Bell'],
 'Injured and dead poker patrons must be absent from the next table');
assert.equal(elements.pokerSeats.innerHTML.includes('Mickey Dunn'),false);
assert.equal(elements.pokerSeats.innerHTML.includes('Joe Rourke'),false);
save.gameDate='1878-05-09';
ctx.window.FE_POKER.start('working');
assert.deepEqual(Array.from(ctx.window.__TEST.state().players,p=>p.name),['You','Mickey Dunn','Frank Bell'],
 'An injured patron may return after healing; a deceased patron never returns');
console.log('PASS named duel opponents absent or recovered at genuine poker tables');
