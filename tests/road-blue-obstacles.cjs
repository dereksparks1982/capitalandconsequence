'use strict';
const assert=require('node:assert/strict');
const streets=require('../capital-street-network.js');
global.FE_CAPITAL_STREETS=streets;
const travel=require('../capital-travel-system.js');
const start={x:.11,y:.33},end={x:.19,y:.33};
const base=travel.route(start,end);
assert.ok(base.length>=2&&base.routeType.startsWith('provisional-street-'));
const baseline=travel.estimate(base).guidePixels;
const blue={x0:.145,y0:.325,x1:.155,y1:.335};
assert.equal(streets.setBuildings([blue]),true,'A blue building changes the walkable graph');
const altered=travel.route(start,end);
assert.ok(altered.length>=2,'Street graph finds a detour when a mapped building blocks the direct road');
assert.equal(streets.validateItinerary(altered).ok,true,'Travel never cuts through the painted building');
assert.ok(travel.estimate(altered).guidePixels>baseline,'Building imposes a real detour');
assert.ok(streets.diagnostic().blueBuildings===1&&streets.diagnostic().excludedEdges>0);
assert.equal(streets.setBuildings([blue]),false,'Unchanged paint cannot trash graph memo each frame');
assert.equal(streets.setBuildings([]),true);
assert.deepEqual(travel.route(start,end).map(p=>({...p})),base.map(p=>({...p})),
 'Erasing blue obstacles restores precisely the original route');
assert.equal(streets.diagnostic().blueBuildings,0);
const barrier={x0:0,y0:0,x1:1,y1:1};
streets.setBuildings([barrier]);
assert.deepEqual(travel.route(start,end),[],
 'An impassable painted city cannot trigger the old right-angle fallback through buildings');
streets.setBuildings([]);
assert.deepEqual(start,{x:.11,y:.33});assert.deepEqual(end,{x:.19,y:.33});
console.log('PASS blue building obstacles change routing, detour, block teleports and erase cleanly');
