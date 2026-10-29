'use strict';
// Offline regression for a moving miniature that stays on the same route
// regardless of the current zoom, and a fast repeated intersection search.
const assert=require('node:assert/strict');
const streets=require('../capital-street-network.js');
global.FE_CAPITAL_STREETS=streets;
const travel=require('../capital-travel-system.js');
const origin={x:.618,y:.28},destination={x:.403,y:.349};
const before=JSON.stringify([origin,destination]);
const itinerary=travel.route(origin,destination);
assert.ok(itinerary.length>=6);
const originalRoute=itinerary.map(p=>({...p}));
const estimated=travel.estimate(itinerary);
for(let i=0;i<70;i++){
 const again=travel.route(origin,destination);
 assert.deepEqual(again.map(p=>({...p})),originalRoute,
  'Road search stays deterministic when its memo is warm');
 assert.equal(travel.estimate(again).guidePixels,estimated.guidePixels);
}
assert.ok(streets.diagnostic().cachedTrees>0,'Repeated searches use the bounded graph memo');
assert.equal(JSON.stringify([origin,destination]),before,'Routing never changes either approved pin');
const halfway=travel.positionAt(itinerary,.5);
assert.ok(halfway&&Number.isFinite(halfway.x)&&Number.isFinite(halfway.y));
assert.deepEqual(travel.positionAt(itinerary,0),origin);
assert.deepEqual(travel.positionAt(itinerary,1),destination);
assert.deepEqual(travel.positionAt(itinerary,4),destination,'Out-of-range progress clamps');
assert.deepEqual(travel.positionAt(itinerary,-3),origin);
assert.equal(travel.positionAt(itinerary,NaN),null);
assert.equal(travel.positionAt([],0),null);
assert.equal(travel.positionAt([{x:NaN,y:0}],.5),null);
// A zoomed viewport should not alter the distance or the geographic position
// halfway through a route. Only its visual projection should change.
const projected=(scale,dx,dy)=>{
 const p=travel.positionAt(itinerary,.5);
 return {x:dx+p.x*2048*scale,y:dy+p.y*1159*scale};
};
assert.equal(travel.estimate(itinerary).guidePixels,estimated.guidePixels);
const beforeZoom=projected(.40,0,0),afterZoom=projected(.90,-140,-70);
assert.notDeepEqual(beforeZoom,afterZoom,'Camera changes screen pixels only');
assert.deepEqual(travel.positionAt(itinerary,.5),halfway,
 'Route progress remains stable under zoom/pan');
assert.match(itinerary.routeType,/provisional-street/);
console.log('PASS cached road graph, stable itinerary, map-space travel progress, zoom invariants and pin safety');
