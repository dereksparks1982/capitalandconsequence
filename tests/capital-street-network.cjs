'use strict';
const assert=require('node:assert/strict');
const streets=require('../capital-street-network.js');
assert.ok(streets.nodeCount>250,'Guide has a connected road-intersection mesh');
assert.ok(streets.edgeCount>500,'Guide road corridors are distinct from the old four-point route');
const factory={x:.618,y:.280},star={x:.403,y:.349},home={x:.586,y:.414};
const itinerary=streets.streetRoute(factory,star);
assert.ok(itinerary,'Factory to Star Club must have a route');
assert.match(itinerary.type,/provisional-street/);
assert.deepEqual(itinerary.points[0],factory,'Route leaves from the exact pin');
assert.deepEqual(itinerary.points.at(-1),star,'Route arrives at the exact pin');
assert.ok(itinerary.points.length>=6,'Follows several genuine graph intersections');
assert.ok(itinerary.intersections>=3,'Travel is routed through more than a single turn');
const changed={x:.520,y:.365};
const rerouted=streets.streetRoute(factory,changed);
assert.ok(rerouted,'New positions can be routed without a rebuild');
assert.deepEqual(rerouted.points.at(-1),changed,'New pin is now the destination');
assert.notDeepEqual(rerouted.points,itinerary.points,'Changing destination modifies itinerary');
assert.deepEqual(factory,{x:.618,y:.280},'Original guide pin was not moved');
const reverse=streets.streetRoute(star,factory);
assert.ok(reverse);
assert.deepEqual(reverse.points[0],star);assert.deepEqual(reverse.points.at(-1),factory);
const far=streets.streetRoute({x:0,y:0},home);
assert.ok(far,'Off-guide provisional locations still connect through the closest road');
assert.equal(far.type,'provisional-street-access','Long access is disclosed, not called surveyed');
for(const candidate of [
 {x:.35,y:.11},{x:.11,y:.326},{x:.885,y:.488},{x:.801,y:.306},
 {x:.731,y:.660},{x:.724,y:.720},{x:.312,y:.358}
]){
 const r=streets.streetRoute(factory,candidate);
 assert.ok(r&&r.points.length>=2,'All registered guide areas receive a walkable route');
 assert.deepEqual(r.points.at(-1),candidate);
}
assert.equal(streets.streetRoute(null,star),null);
assert.equal(streets.streetRoute(factory,{x:NaN,y:.2}),null);
console.log('PASS street intersections, named diagonal corridors, shortest routes, changed pins and provisional access');
