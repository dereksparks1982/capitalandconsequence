'use strict';
const assert=require('node:assert/strict');
const cases=require('../police-casework.js');
const after=require('../duel-aftermath.js');
const save={gameDate:'1878-05-03'};
const dispute={id:'card-dispute:19',status:'resolved',opponent:'Mickey Dunn',
 locationId:'workingPoker',endedOn:'1878-05-03',playerShot:'wounded',opponentShot:'missed'};
after.record(save,dispute);
assert.equal(cases.status(save,'1878-05-03').totalReports,0);
assert.equal(cases.review(save,'police-intake:card-dispute:19','1878-05-06','metropolitanPolice'),null,
 'A report cannot appear without a player statement');
const report=after.report(save,'card-dispute:19','1878-05-03');
assert.equal(report.status,'intake');
assert.equal(cases.due(save,'1878-05-03'),null,'A statement is not reviewed instantly');
assert.equal(cases.due(save,'1878-05-02'),null,'Travel backward cannot advance investigation');
assert.equal(cases.due(save,'1878-05-04').id,report.id);
assert.equal(cases.review(save,report.id,'1878-05-04','workingPoker'),null,
 'Player must visit the police station');
assert.equal(cases.review(save,'police-intake:other','1878-05-04','metropolitanPolice'),null);
assert.equal(cases.status(save,'1878-05-04').pendingIntakes,1);
const reviewed=cases.review(save,report.id,'1878-05-04','metropolitanPolice');
assert.equal(reviewed.status,'awaiting-corroboration');
assert.equal(reviewed.review.independentWitnesses,0);
assert.equal(reviewed.review.chargesFiled,false);
assert.equal(reviewed.review.arrestWarrant,false);
assert.equal(reviewed.source,'player-statement');
assert.equal(cases.review(save,report.id,'1878-05-04','metropolitanPolice'),null,
 'One report cannot produce multiple case reviews');
assert.equal(cases.status(save,'1878-05-05').readyToReview,null);
assert.equal(cases.status(save,'1878-05-05').awaitingEvidence,1);
console.log('PASS submitted personal statements receive a later case-desk review without manufactured evidence, charges, or warrants');
