'use strict';
const assert=require('node:assert/strict');
const tour=require('../circus-tour.js');
globalThis.FederalElectricCity={listLocations:()=>[{id:'races'}]};
globalThis.FE_CIRCUS_TOUR=tour;
const carnival=require('../circus-carnival.js');
const minute=Math.floor(Date.UTC(1878,4,4,12)/60000);
const save={worldCalendarStatus:'ready',worldCalendar:{worldMinute:minute},gameDate:'1878-05-04',
 currentLocation:{locationId:'races',roomId:'grounds'},phase:'day',paused:false,
 personalCash:10,characterRoute:'industrialist'};
assert.equal(!!tour.active(save),true);
assert.equal(Object.keys(carnival.GAMES).length,7,'Six original carnival games plus one additional clockwork challenge');
const before=save.personalCash;
const opened=carnival.start(save,'clockwork');
assert.equal(opened.ok,true);
assert.equal(Math.round(save.personalCash*100),Math.round(before*100)-9,'A new challenge costs a real nine-cent booth fee');
const initial=carnival.preview(carnival.ensure(save).active);
assert.equal(initial.movesRemaining,2);
assert.ok(initial.movingLane>=1&&initial.movingLane<=5);
const snapshot=JSON.stringify(save);
assert.equal(carnival.advanceTarget(save,0).ok,false);
assert.equal(JSON.stringify(save),snapshot,'Rejecting a free duck movement cannot change the save');
const moves=[];
for(let n=0;n<2;n++){
 // Real Washington time stores whole minutes and a separate seconds remainder.
 save.worldCalendarRemainder=(save.worldCalendarRemainder||0)+30;
 if(save.worldCalendarRemainder>=60){save.worldCalendar.worldMinute++;save.worldCalendarRemainder-=60;}
 const changed=carnival.advanceTarget(save,30);
 assert.equal(changed.ok,true);
 moves.push(changed.lane);
}
assert.equal(carnival.advanceTarget(save,30).ok,false,'No infinite free or paid target shuffling');
assert.equal(carnival.preview(carnival.ensure(save).active).movesRemaining,0);
const current=carnival.preview(carnival.ensure(save).active);
const shot=carnival.throwAt(save,current.movingLane-1,()=>({ok:true}));
assert.equal(shot.ok,true);assert.equal(shot.finished,false);assert.equal(shot.points,4);
assert.equal(carnival.preview(carnival.ensure(save).active).movesRemaining,2,'Each new shot has its own maximum of two adjustments');
for(let i=1;i<4;i++){
 const view=carnival.preview(carnival.ensure(save).active);
 const result=carnival.throwAt(save,view.movingLane-1,()=>({ok:true}));
 assert.equal(result.ok,true);
 if(i===3)assert.equal(result.finished,true);
}
assert.equal(carnival.ensure(save).active,null);
const record=carnival.ensure(save).history.at(-1);
assert.equal(record.key,'clockwork');
assert.equal(record.plays.length,4);
assert.equal(record.moves.length,2);
assert.equal(record.totalMechanismMoves,2);
assert.equal(record.score,16,'Exact target timing wins four physical aim checks');
assert.equal(record.tier==='big'||record.tier==='rare',true);
assert.equal(Math.round(save.personalCash*100),Math.round(before*100)-9,'Finished game cannot pay another booth fee');
assert.equal(carnival.throwAt(save,1).ok,false,'No repeated post-round prize');
const restored=JSON.parse(JSON.stringify(save));
assert.equal(carnival.ensure(restored).history[0].plays.length,4);
assert.equal(carnival.ensure(restored).history[0].moves.length,2,'Clockwork timing survives save reload');
assert.equal(carnival.start({...save,currentLocation:{locationId:'factory'}},'clockwork').ok,false,'Cannot play remotely');
const original={...save,carnivalGames:{version:1,serial:0,history:[],active:null}};
const rings=carnival.start(original,'rings');
assert.equal(rings.ok,true);
assert.equal(carnival.preview(carnival.ensure(original).active).movesRemaining,undefined,
 'Original ring toss still uses exactly the earlier ordinary booth mechanics');
assert.equal(carnival.advanceTarget(original,30).ok,false,'New moving-target mechanic never mutates existing six booths');
console.log('PASS original midway preserved; paid clockwork duck waits, 5 real aiming lanes, bounded turns, recorded target motion, one-time prizes and save reload');
