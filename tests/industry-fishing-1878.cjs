'use strict';
const assert=require('node:assert/strict');
const skills=require('../skills.js'),works=require('../component-works.js');
const fishing=require('../fishing-engine.js'),boats=require('../fishing-vessels.js');
const empire=require('../industrial-empire.js');
const make=()=>({gameDate:'1878-01-02',phase:'day',paused:false,characterRoute:'industrialist',
 personalCash:500000,companyCash:10000,inventoryByGrade:{standard:0},
 componentWorks:works.createState('1878-01-02')});
const save=make();
assert.equal(empire.buy(save,'steel').ok,true);
assert.equal(empire.buy(save,'rail').ok,true);
assert.equal(empire.millAction(save,'rails').ok,true);
assert.equal(empire.repairRails(save).ok,true);
const e=empire.ensure(save);
assert.equal(e.steel.rails,0,'Railway purchases physically available mill rails');
assert.ok(e.steel.cash>0&&e.rail.cash>0,'Subsidiaries keep separate operating cash');
assert.ok(skills.level(save,'metallurgy')>0,'Mill work can train metallurgy');
const bought=empire.buyShip(save,'schooner');
assert.equal(bought.ok,true);
assert.equal(empire.dispatch(save,bought.vessel?.id||1,'Hamburg','freight',false).ok,false,'Unknown port cannot be used at the beginning');
assert.equal(empire.dispatch(save,1,'Philadelphia','freight',true).ok,true,'Established local voyage can sail');
assert.equal(empire.ensure(save).fleet.ships[0].status,'at-sea');
save.gameDate='1878-01-12';empire.advance(save);
assert.notEqual(empire.ensure(save).fleet.ships[0].status,'at-sea','Completed voyages resolve on the game calendar');
assert.ok(empire.ensure(save).rail.ledger.length>5,'Railway has daily freight/passenger receipts and upkeep');
const cargoSave=make();cargoSave.componentWorks.warehouse['telegraph-key']=10;
assert.equal(empire.buyShip(cargoSave,'schooner').ok,true);
const before=cargoSave.componentWorks.warehouse['telegraph-key'];
assert.equal(empire.dispatch(cargoSave,1,'Philadelphia','electric',false).ok,true,'Owned ship can carry 1878 electrical components');
assert.equal(cargoSave.componentWorks.warehouse['telegraph-key'],before-5,'Actual warehouse components leave storage exactly once');
cargoSave.gameDate='1878-01-12';empire.advance(cargoSave);
const arriving=empire.ensure(cargoSave).fleet.ships[0];
if(arriving.status!=='lost'){
 const old=cargoSave.componentWorks.cashCents;
 assert.equal(empire.sellElectric(cargoSave,'Philadelphia').ok,true,'Foreign consignee receives the components');
 assert.ok(cargoSave.componentWorks.cashCents>old,'Proceeds go to 1878 Federal Electric company books');
 assert.equal(empire.sellElectric(cargoSave,'Philadelphia').ok,false,'No second sale of the same consignment');
}
const fishSave=make();
assert.equal(boats.buy(fishSave,'skiff').ok,true,'1878 skiff exists');
assert.equal(boats.buy(fishSave,'trawler').ok,false,'Steam trawler is gated to a later date');
const hull=boats.ensure(fishSave).vessels[0];
const trip=boats.work(fishSave,hull.id,'potomacFishingBank');
assert.equal(trip.ok,true,'Fishing boat actually works an eligible fishing ground');
assert.ok(hull.condition<95||trip.loss,'Fishing craft experiences wear and occasional danger');
assert.equal(boats.work(fishSave,hull.id,'potomacFishingBank').ok,false,'No unlimited same-day hauls');
assert.ok(skills.level(fishSave,'seamanship')>0,'Fishing boat operation trains skill');
const angler=make();const w=fishing.ensure(angler);w.gear=true;
skills.ensure(angler).values.fishing=100;w.skill=100;
let rare=0,casts=20000;
for(let i=0;i<casts;i++){
 const a=fishing.cast(angler,'potomacFishingBank','1878-01-02');
 assert.equal(a.ok,true);
 if(a.session.fishId==='legendary')rare++;
 w.session=null;
}
assert.ok(rare>=45&&rare<=150,'Skill-100 legendary strike should approximate 0.5%, found '+rare+'/'+casts);
console.log('PASS 1878 steel/rail, finite warehouse cargo shipping, voyages, boat upkeep, skill gains and 0.5% legendary catches');
