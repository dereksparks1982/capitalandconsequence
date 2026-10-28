'use strict';
const assert=require('node:assert/strict'),eco=require('../npc-economy.js');
const worker={id:'foremanSullivan',traits:{caution:81,sociability:45}};
const state={goal:'maintain-machinery',energy:88};
const ctx={date:'1890-01-03',key:'1890-01-03|0',slot:0,weekday:5,seed:1290,
 defaultLocation:'factory',defaultActivity:'checking machines',rest:false};
const first=eco.actionFor(worker,state,ctx);
assert.equal(first.repeated,false);
assert.equal(first.action.kind,'work');
assert.equal(state.economy.shiftsWorked,1);
assert.equal(state.economy.balanceCents,2100,'Workshop wages cannot be minted by NPC planning');
assert.equal(state.economy.earnedCents,0,'Payroll comes from Federal Electric at close');
const saved=JSON.stringify(state.economy),other=eco.actionFor(worker,state,ctx);
assert.equal(other.repeated,true);
assert.equal(JSON.stringify(state.economy),saved,'No double wages after a repeat');
const clone=JSON.parse(JSON.stringify(state));
assert.equal(eco.actionFor(worker,clone,ctx).repeated,true,'Autosave survives repeat');
const late={...ctx,key:'1890-01-03|3',slot:3,defaultLocation:null,defaultActivity:null};
eco.actionFor(worker,state,late);
assert.ok(state.economy.history.length===2);
assert.ok(state.economy.balanceCents>=0);
const book={id:'eddieDoyle',traits:{caution:45,sociability:91}};
const money={energy:80};
for(let i=0;i<30;i++)eco.actionFor(book,money,{date:'1890-01-03',key:'1890-01-03|'+i,slot:1,weekday:6,seed:i,defaultLocation:'races',defaultActivity:'at the track'});
assert.ok(money.economy.wageredCents>=0);
assert.ok(money.economy.betsWon+money.economy.betsLost<=30);
assert.equal(typeof eco.pressure(money.economy),'number');
const alexi={id:'alexiRurik',traits:{caution:78,sociability:39}};
const courier={energy:83};
const shift=eco.actionFor(alexi,courier,{date:'1890-01-03',key:'courier|0',slot:0,weekday:5,seed:4,
 defaultLocation:'russianTradeHall',defaultActivity:'arranging deliveries',rest:false});
assert.equal(shift.action.kind,'work');
// Boy has no permanent wage: one erratic delivery day, card wins/losses,
// and no settlement duplication when a save or render replays the same key.
const boy={id:'boyMercer',traits:{caution:36,honesty:4,sociability:90}};
const bc={energy:90};
const odd=eco.actionFor(boy,bc,{date:'1890-01-08',weekday:3,slot:1,
 key:'1890-01-08|1',seed:42,defaultLocation:'secondNightclub',
 defaultActivity:'unloading liquor barrels from a horse-drawn delivery wagon'});
assert.equal(odd.action.kind,'odd-job');
assert.ok(bc.economy.earnedCents>=80&&bc.economy.earnedCents<=135);
assert.ok(bc.economy.shiftsWorked===1);
const snapshot=JSON.stringify(bc.economy);
assert.equal(eco.actionFor(boy,bc,{date:'1890-01-08',weekday:3,slot:1,
 key:'1890-01-08|1',seed:42,defaultLocation:'secondNightclub'}).repeated,true);
assert.equal(JSON.stringify(bc.economy),snapshot,'Autosave cannot repeat a delivery payment');
const card=eco.actionFor(boy,bc,{date:'1890-01-08',weekday:3,slot:2,
 key:'1890-01-08|2',seed:42,defaultLocation:'workingPoker',
 defaultActivity:'playing cards for small stakes'});
assert.ok(['card-win','card-loss','card-cheating','card-cheating-caught'].includes(card.action.kind));
assert.ok(card.action.stakeCents>0,'Card games use actual Boy-owned money');
assert.equal(bc.economy.wageredCents,card.action.stakeCents);
assert.equal(bc.economy.shiftsWorked,1,'Playing cards is not another wage shift');

console.log('PASS NPC earned shifts, household costs, credit, idempotence and Russian courier');
