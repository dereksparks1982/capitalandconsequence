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
s.ai.cooldown=100000;s.roundMs=10;B.step(s,30,{});assert.equal(s.final,'decision');
const ko=B.create();ko.player.x=8;ko.opponent.x=9;ko.opponent.health=4;B.punch(ko);assert.equal(ko.final,'knockout');
const edge=B.create();edge.player.x=1;edge.player.y=1;
assert.equal(B.move(edge,edge.player,-1,0),false);
console.log('PASS boxing practice movement, guard, punches, round fatigue, endings and collision');
