'use strict';
const assert=require('node:assert/strict'),fish=require('../fishing-engine.js');
const sites=Object.keys(fish.SITES);assert.equal(sites.length,6);
let landed=0;
const save={personalCash:0};assert.equal(fish.outfit(save).ok,false,'No free equipment');
save.personalCash=6;assert.equal(fish.outfit(save).ok,true);assert.equal(save.personalCash,5.25);
assert.equal(fish.outfit(save).ok,false,'Tackle cannot be bought twice');
assert.equal(fish.cast(save,'nonexistent','1878-01-05').ok,false);
assert.equal(fish.cast(save,'babcockLake','1889-01-01').ok,false);
for(const site of sites){
 const state={personalCash:3};assert.equal(fish.outfit(state).ok,true);
 const first=fish.cast(state,site,'1878-01-05');assert.equal(first.ok,true,site);
 const snapshot=JSON.stringify(state);
 assert.equal(fish.cast(state,site,'1878-01-05').ok,false,'No duplicated hooked fish');
 assert.equal(JSON.stringify(state),snapshot,'Rejected actions must not mutate save');
 let finished=false;
 for(let i=0;i<50;i++){
  const s=state.fishing.session;if(!s){finished=true;break;}
  const move=s.tension>59?'hold':'reel';
  const result=fish.act(state,move);assert.equal(result.ok,true);
 }
 assert.ok(finished||!state.fishing.session,'All fishing fights terminate');
 assert.ok(state.fishing.history.some(x=>['catch','break','escape'].includes(x.kind)));
 if(state.fishing.history.some(x=>x.kind==='catch'))landed++;
 assert.deepEqual(JSON.parse(JSON.stringify(state)).fishing,state.fishing,'Catch and session survive autosave');
}
assert.ok(landed>=1,'At least one of the six playable banks yields a landable fish');
const p={personalCash:2};fish.outfit(p);assert.equal(fish.cast(p,sites[0],'1878-01-05').ok,true);
assert.equal(fish.act(p,'unknown').ok,false);
assert.equal(fish.abandon(p).ok,true);assert.equal(fish.act(p,'reel').ok,false);
p.fishing.catches.push({id:'creel-test',name:'Perch'});
assert.equal(fish.release(p,'creel-test').ok,true);assert.equal(fish.release(p,'creel-test').ok,false);
console.log('PASS fishing tackle, choices, six sites, save persistence, no double catches');
