'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const intent=require('../npc-intentions.js'),mobility=require('../npc-mobility.js'),access=require('../city-access.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../city.js'),'utf8'),ctx);
const city=ctx.window.FederalElectricCity,date='1890-01-03';
const def={id:'alexiRurik'},actor={kind:'npc',id:'alexiRurik',onDuty:false};
const personal={kind:'personal',slot:1,locationId:'races'};
assert.equal(intent.plan(def,{goal:'find-honest-work'},personal),'russianTradeHall');
assert.equal(intent.plan(def,{goal:'protect-allies'},personal),'russianTradeHall');
assert.equal(intent.plan(def,{goal:'establish-independence'},personal),'oldChinatown');
for(const kind of ['work','wager-win','wager-loss','rest','household']){
 assert.equal(intent.plan(def,{goal:'find-honest-work'},{...personal,kind}),null,'No paid or private action hijacking');
}
assert.equal(intent.plan(def,{goal:'unknown'},personal),null);
const base={date,key:'1890-01-03|1',seed:123,slot:1,defaultLocation:'races',defaultActivity:'spectating',preferredDestination:'russianTradeHall'};
const reached=mobility.visit(city,actor,base);
assert.equal(reached.locationId,'russianTradeHall');
assert.equal(reached.reason,'goal-directed');
assert.deepEqual(mobility.visit(city,actor,base),reached,'No reroll for saved planning key');
const onShift=mobility.visit(city,{...actor,onDuty:true,workplaceId:'races'},base);
assert.equal(onShift.locationId,'races','Shift cannot be overridden by personal intent');
const priority=mobility.visit(city,actor,{...base,priorityDestination:true});
assert.equal(priority.locationId,'races','A settled wager has location priority');
for(const forbidden of ['home','licensedGamingHall','privateFightHall','notAPlace']){
 const result=mobility.visit(city,actor,{...base,preferredDestination:forbidden});
 assert.notEqual(result.locationId,forbidden,'Intentions cannot bypass '+forbidden);
}
assert.equal(access.canRoom(city,actor,'factory','executive-office',date).ok,false);
assert.equal(city.mapLocations().length,40);
console.log('PASS NPC goal destinations, work and wager precedence, restricted doors and stable replay');
