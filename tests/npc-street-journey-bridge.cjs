'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../npc-ai.js'),'utf8');
const from=source.indexOf(' function recordNpcArrival('),to=source.indexOf(' function stepOnce(',from);
assert.ok(from>=0&&to>from);
const observedCalls=[];
const context={S:{gameDate:'1878-05-03',turnConditions:{weather:'rain'}},
 window:{FE_NPC_STREET_TRAVEL:{plan:(a,b,save)=>{
  observedCalls.push([a,b,save.gameDate]);
  return {minutes:57,guidePixels:412,weather:'rain',
   routeType:'provisional-street-network',
   routePoints:[{x:.4,y:.3},{x:.5,y:.4},{x:.6,y:.5}]};
 }}},
 autonomous:()=>[{id:'resident'}],shopAtObservedMarket:()=>null,
 observedDate:()=> '1878-05-03'};
const api=vm.runInNewContext('(function(){'+source.slice(from,to)+
 'return {journeyArrival,finishJourneys};})()',context);
const a={locationId:'factory',roomId:'floor'};
const target={locationId:'star',roomId:'salon',activity:'hosting guests'};
const start=api.journeyArrival(a,target,1000,995);
assert.equal(start.status,'travelling');
assert.equal(a.journey.arrivesAt,1052);
assert.equal(a.journey.guidePixels,412);
assert.equal(a.journey.weather,'rain');
assert.equal(a.journey.routePoints.length,3);
assert.equal(api.finishJourneys({agents:{resident:a}},1051),false);
assert.equal(api.finishJourneys({agents:{resident:a}},1052),true);
assert.equal(a.locationId,'star');
assert.equal(a.lastArrival.gameMinutes,57);
assert.equal(a.lastArrival.routeType,'provisional-street-network');
assert.equal(a.journeyHistory.length,1);
assert.equal(observedCalls.length,1,'One actual departure produces exactly one route plan');
assert.equal(api.finishJourneys({agents:{resident:a}},1052),false);
console.log('PASS actual NPC journey bridge uses provisional street length, saves one arrival, no early teleport');
