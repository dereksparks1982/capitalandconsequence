'use strict';
const assert=require('node:assert/strict');
const a=require('../duel-aftermath.js');
const save={gameDate:'1878-05-03',duels:{injuries:[]}},round={
 id:'card-dispute:42',status:'resolved',opponent:'Mickey Dunn',
 locationId:'workingPoker',date:'1878-05-03',endedOn:'1878-05-03',
 playerShot:'wounded',opponentShot:'wounded',opponentSkill:22
};
const entry=a.record(save,round);
assert.equal(entry.opponentCondition,'injured');
assert.equal(entry.playerCondition,'injured');
assert.equal(a.record(save,round),entry,'Repeated settlement is idempotent');
assert.equal(save.duelAftermath.events.length,1);
assert.equal(a.visible(save,'workingPoker','1878-05-03').injury,null);
assert.equal(a.visible(save,'governmentHospital','1878-05-03').injury.duelId,round.id);
assert.equal(a.visible(save,'metropolitanPolice','1878-05-03').reportable.duelId,round.id);
save.duels.injuries.push({id:round.id,treated:false});
assert.equal(a.treat(save,round.id,'1878-05-03').treatedOn,'1878-05-03');
assert.equal(save.duels.injuries[0].treated,true);
assert.equal(a.treat(save,round.id,'1878-05-03'),null,'No repeated medical treatment');
const report=a.report(save,round.id,'1878-05-03');
assert.equal(report.source,'player-statement');
assert.equal(report.independentWitnesses,0);
assert.equal(report.status,'intake','A statement alone cannot justify automatic arrest');
assert.equal(a.report(save,round.id,'1878-05-03'),null);
assert.equal(a.visible(save,'metropolitanPolice','1878-05-03').reportable,null);
assert.equal(a.opponentStatus(save,'Mickey Dunn','1878-05-04'),'injured');
assert.equal(a.opponentStatus(save,'Mickey Dunn','1878-05-09'),'recovered');
const dead={...round,id:'card-dispute:43',playerShot:'killed',opponentShot:'missed',endedOn:'1878-05-10'};
assert.equal(a.record(save,dead).opponentCondition,'deceased');
assert.equal(a.opponentStatus(save,'Mickey Dunn','1878-06-30'),'deceased','Dead patrons never heal back to life');
assert.equal(save.duelAftermath.reports.length,1);
assert.equal(a.record(save,{...dead,id:'nope',status:'pending'}),null);
console.log('PASS duel injuries, dated recovery, treatment, witnessed-only police intake, death permanence and deduplication');
