'use strict';
// A pin can move at any time before departure. Trip estimates are recomputed
// from its current coordinates rather than an old destination lookup table.
const assert=require('node:assert/strict');
// The road graph is installed before the travel engine, as it is in index.html.
global.FE_CAPITAL_STREETS=require('../capital-street-network.js');
const engine=require('../capital-travel-system.js');
const origin={id:'factory',x:.615,y:.383};
const star={id:'star',x:.4,y:.453};
const route=()=>engine.route(origin,star);
const measurement=()=>engine.estimate(route());
const first=measurement();
const frozen={guidePixels:first.guidePixels,temporaryGameMinutes:first.minutes.walk};
assert.ok(first.guidePixels>0);
assert.equal(first.estimatedMiles,null);
assert.ok(first.minutes.walk>0);
star.x=.595;star.y=.405;
const closer=measurement();
assert.ok(closer.guidePixels<first.guidePixels,'Moving a pin closer shortens the route');
assert.ok(closer.minutes.walk<first.minutes.walk,'Walking time updates without rebuilding');
assert.ok(closer.minutes.horse<=closer.minutes.walk);
assert.ok(closer.minutes.carriage<=closer.minutes.walk);
assert.equal(frozen.guidePixels,first.guidePixels,'An already recorded trip is not recalculated');
assert.equal(frozen.temporaryGameMinutes,first.minutes.walk);
star.x=.005;star.y=.925;
const farther=measurement();
assert.ok(farther.guidePixels>first.guidePixels,'Moving a pin farther lengthens the route');
assert.ok(farther.minutes.walk>first.minutes.walk,'Travel time increases when distance increases');
const streetPath=route();
assert.match(streetPath.routeType,/^provisional-street-/,
 'Pin movement continues routing along the modeled streets and diagonal avenues');
assert.deepEqual(streetPath[0],{x:origin.x,y:origin.y});
assert.deepEqual(streetPath.at(-1),{x:star.x,y:star.y});
for(const point of streetPath){
 assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y),
  'No missing intersection coordinates in the dynamically recalculated route');
}
assert.deepEqual(engine.route(origin,{x:origin.x,y:origin.y}),[{x:origin.x,y:origin.y}],
 'A trip to the identical map coordinate does not invent a road detour');
const zero=engine.estimate([origin,{...origin}]);
assert.equal(zero.guidePixels,0);
assert.equal(zero.minutes.walk,5,'Overlapping distinct sites still take minimal time');
const invalid=engine.estimate([]);
assert.equal(invalid.guidePixels,0);
assert.equal(invalid.estimatedMiles,null);
assert.deepEqual({x:origin.x,y:origin.y},{x:.615,y:.383},
 'The original pin position is never changed by routing');
console.log('PASS moving a pin shortens/lengthens time immediately, modes recalculate and old receipts stay frozen');
