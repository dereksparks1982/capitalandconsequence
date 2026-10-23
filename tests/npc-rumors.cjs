'use strict';
const assert=require('node:assert/strict'),rumors=require('../npc-rumors.js');
const speaker={id:'madamStar',traits:{sociability:82}},listener={id:'eddieDoyle',traits:{sociability:91}};
const actor=(roomId='star-room')=>({status:'present',locationId:'star',roomId,relationships:{}});
const from=actor(),to=actor(),fact={factId:'introduced:industrialist',source:'direct-introduction',confidence:1};
assert.equal(rumors.coPresent(from,to),true);
assert.equal(rumors.coPresent(from,actor('private-room')),false,'Separate club rooms do not transmit words');
assert.equal(rumors.coPresent({...from,status:'off-duty'},to),false,'Absent speaker cannot gossip');
assert.equal(rumors.coPresent({...from,roomId:null},to),false,'Unmapped room is not evidence of colocation');
assert.equal(rumors.coPresent({...from,locationId:'factory'},to),false,'No remote communication');
assert.equal(rumors.shareable(fact),true);
assert.equal(rumors.shareable({...fact,factId:'private:police-record'}),false);
assert.equal(rumors.shareable({...fact,factId:'confidential:deposition'}),false);
assert.equal(rumors.shareable({...fact,factId:'sealed:captain'}),false);
assert.equal(rumors.shareable({...fact,source:'unpublished-case'}),false);
assert.equal(rumors.shareable({...fact,confidence:.39}),false);
assert.equal(rumors.chance(speaker,listener,from,to,{...fact,source:'private-record'}),0);
assert.equal(rumors.chance(speaker,listener,from,actor('private-room'),fact),0);
const baseline=rumors.chance(speaker,listener,from,to,fact);
const liked=rumors.chance(speaker,listener,{...from,relationships:{eddieDoyle:70}},
 {...to,relationships:{madamStar:70}},fact);
const hostile=rumors.chance(speaker,listener,{...from,relationships:{eddieDoyle:-100}},
 {...to,relationships:{madamStar:-100}},fact);
assert.ok(liked>baseline,'Affection raises voluntary disclosure likelihood');
assert.ok(hostile<baseline,'Hostility deters confidential conversation');
assert.ok(baseline<=75&&baseline>=0,'No guaranteed transmission');
assert.ok(rumors.chance(speaker,listener,from,to,{...fact,confidence:.50})<baseline,'Rumor reliability affects willingness');
assert.equal(rumors.chance(speaker,listener,from,to,fact),baseline,'Deterministic repeat');
console.log('PASS NPC same-room rumor integrity, confidential knowledge withholding and relationship-sensitive hearsay');
