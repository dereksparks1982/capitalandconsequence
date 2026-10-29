'use strict';
const assert=require('node:assert/strict');
const custody=require('../horse-custody.js');
const routing=require('../capital-travel-system.js');
let charged=0;
const save={paused:false,gameDate:'1878-01-02',turnSerial:1,
 currentLocation:{locationId:'factory',roomId:'executive-office'},
 transport:{journeys:[],events:[],assets:[
  {id:'horse1',owner:'personal',kind:'horse',status:'stabled',locationId:'factory'},
  {id:'carriage1',owner:'personal',kind:'carriage',status:'stabled',locationId:'factory'}
 ]}};
global.S=save;
global.window={
 FederalElectricCity:{getLocation:id=>['factory','races','home'].includes(id)?{id}:null,
  getRoom:()=>({})},
 FE_CALENDAR_BRIDGE:{moment:()=>({iso:'1878-01-02T09:00'})},
 advanceWorldTime:seconds=>{charged+=seconds;return seconds}
};
require('../journey-planner.js');
const ledger=window.FE_TRAVEL;
const measured=routing.estimate(routing.route({x:.615,y:.383},{x:.811,y:.492}));
assert.ok(measured.guidePixels>0);
assert.equal(measured.estimatedMiles,null);
assert.equal(ledger.recordProvisional('factory','races','walk-measured','walk',measured.minutes.walk),true);
assert.equal(charged,measured.minutes.walk*60);
assert.equal(save.transport.journeys.at(-1).mode,'walk');
assert.equal(save.transport.assets[0].locationId,'factory');
assert.equal(ledger.recordProvisional('factory','races','walk-measured','walk',measured.minutes.walk),false);
assert.equal(charged,measured.minutes.walk*60,'Replay cannot charge journey twice');
const prepared=custody.prepare(save,'horse1','factory');
assert.equal(prepared.ok,true);
const before=charged;
assert.equal(ledger.recordProvisional('factory','home','horse-route','horse',measured.minutes.horse),true);
assert.equal(charged-before,measured.minutes.horse*60);
assert.equal(save.transport.journeys.at(-1).mode,'horse');
assert.equal(custody.onArrival(save,'factory','home',true).ok,true);
assert.equal(save.transport.assets[0].locationId,'home');
assert.equal(save.transport.assets[1].locationId,'factory',
 'A horse journey cannot teleport a carriage');
save.currentLocation={locationId:'home',roomId:'front'};
const walkHome=custody.prepare(save,'horse1','home');
assert.equal(walkHome.ok,true);
assert.equal(ledger.recordProvisional('home','races','walk-again','walk',5),true);
assert.equal(custody.onArrival(save,'home','races',true).ok,false,
 'Walking cannot transfer a previously prepared horse');
assert.equal(save.transport.assets[0].locationId,'home');
assert.equal(ledger.recordProvisional('home','races','bad-carriage','carriage',15),false,
 'Carriage travel cannot proceed unless horse and vehicle have been prepared');
assert.equal(ledger.recordProvisional('factory','races','wrong-origin','horse',15),false);
console.log('PASS pixel-based journey time, physical horse custody, no walking teleport and replay-safe charges');
