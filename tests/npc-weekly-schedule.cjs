'use strict';
const assert=require('node:assert/strict'),weekly=require('../npc-weekly-schedule.js');
const def=(id,places=['factory','factory',null,null])=>({id,places,activities:['work','work',null,null]});
assert.equal(weekly.at(def('foremanSullivan'),1,0).locationId,'factory');
assert.equal(weekly.at(def('foremanSullivan'),6,0).locationId,null);
assert.equal(weekly.at(def('foremanSullivan'),6,1).locationId,'oldChinatown','Assistant shops on Saturday without a factory shift');
assert.equal(weekly.at(def('eliCrowe'),1,2).locationId,'secondNightclub');
assert.equal(weekly.at(def('samHarlan'),1,0).locationId,'hillsdale');
assert.equal(weekly.at(def('edmundWardman'),1,0).locationId,'blackwoodAsylum');
assert.equal(weekly.at(def('foremanSullivan'),0,0).locationId,null);
assert.equal(weekly.at(def('madamStar'),5,3).locationId,'star');
assert.equal(weekly.at(def('madamStar'),0,0).locationId,null);
assert.equal(weekly.at(def('inspectorHayes'),5,2).locationId,'washingtonArena');
assert.equal(weekly.at(def('inspectorHayes'),6,0).locationId,null);
for(const id of weekly.registered)for(let day=0;day<7;day++)for(let slot=0;slot<4;slot++){
 const result=weekly.at(def(id),day,slot);
 assert.ok(result.locationId===null||typeof result.locationId==='string');
}
assert.equal(weekly.registered.length,22);
assert.equal(weekly.at(def('newResident'),1,0).locationId,'factory');
assert.throws(()=>weekly.at(def('newResident'),7,0));
console.log('PASS 22 named NPC weekly workdays, weekend routines, and unknown-NPC fallback');
