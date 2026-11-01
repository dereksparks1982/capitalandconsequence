'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root={},scope={window:root,globalThis:root,module:{exports:{}},Math,Date};
for(const file of ['room-builder-catalog.js','room-builder-core.js','boxing-ring-core.js']){
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),scope,{filename:file});
}
const B=root.FE_TOPDOWN_BOXING,s=B.create(80);
assert.equal(s.player.maxStamina,94);
assert.equal(B.punch(s),true);assert.equal(s.player.stamina,82);
assert.equal(B.punch(s),false,'Punch cooldown prevents repeated clicks');
B.step(s,200,{dx:1});assert.equal(s.player.x,5);
s.player.x=8;s.opponent.x=9;s.ai.cooldown=0;s.ai.windup=0;
B.step(s,50,{});assert.ok(s.ai.windup>0,'Opponent must telegraph');
B.step(s,100,{block:true});B.step(s,100,{block:true});B.step(s,100,{block:true});
B.step(s,100,{block:true});B.step(s,100,{block:true});B.step(s,100,{block:true});B.step(s,100,{block:true});
assert.equal(s.blocks,1,'Right-click hold blocks incoming punch');
const spent=s.player.stamina;B.step(s,100,{});assert.ok(s.player.stamina<=spent,'No mid-round stamina recovery');
s.player.stamina=19;s.ai.windup=0;s.ai.cooldown=100000;s.roundMs=10;
B.step(s,30,{});assert.equal(s.phase,'break');
for(let i=0;i<30;i++)B.step(s,100,{});
assert.equal(s.round,2);assert.ok(s.player.stamina>19);assert.ok(s.player.stamina<s.player.maxStamina);
const cap=s.player.maxStamina;s.ai.cooldown=100000;s.roundMs=10;B.step(s,30,{});
for(let i=0;i<30;i++)B.step(s,100,{});
assert.equal(s.round,3);assert.ok(s.player.maxStamina<cap);
s.ai.cooldown=100000;s.roundMs=10;B.step(s,30,{});assert.equal(s.final,'decision');assert.equal(s.winner,'player');assert.equal(s.scorecards.length,3);
const ko=B.create();ko.player.x=8;ko.opponent.x=9;ko.opponent.health=4;B.punch(ko);assert.equal(ko.final,'knockout');assert.equal(ko.winner,'player');
const unanimous=B.create();
for(let n=0;n<3;n++){unanimous.roundPoints.opponent=5;unanimous.roundMs=1;B.step(unanimous,10,{});
 if(n<2)for(let i=0;i<30;i++)B.step(unanimous,100,{});}
assert.equal(unanimous.winner,'opponent','Scorecards must be able to award opponent victory');
assert.equal(unanimous.scorecards.length,3);
const tied=B.create();for(let n=0;n<3;n++){tied.roundMs=1;B.step(tied,10,{});if(n<2)for(let i=0;i<30;i++)B.step(tied,100,{});}
assert.equal(tied.winner,'draw','Equal rounds yield a draw');
const edge=B.create();edge.player.x=1;edge.player.y=1;
assert.equal(B.move(edge,edge.player,-1,0),false);
console.log('PASS boxing practice movement, guard, punches, round fatigue, endings and collision');
