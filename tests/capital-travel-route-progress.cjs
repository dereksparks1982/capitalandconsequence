'use strict';
const assert=require('node:assert/strict');
global.FE_CAPITAL_STREETS=require('../capital-street-network.js');
const travel=require('../capital-travel-system.js');
const src={x:.618,y:.280},dest={x:.403,y:.349};
const before=JSON.stringify([src,dest]);
const route=travel.route(src,dest);
const full=travel.estimate(route).guidePixels;
assert.ok(route.length>=6);
let previous=-1;
for(let i=0;i<=20;i++){
 const fraction=i/20;
 const prefix=travel.routePrefix(route,fraction);
 const end=prefix.at(-1);
 assert.ok(prefix.length>=1,'Each animated frame has a visible origin');
 const position=travel.positionAt(route,fraction);
 assert.ok(Math.hypot(end.x-position.x,end.y-position.y)<1e-10,
  'Traveled trail meets moving pawn, including at street turns');
 const meters=travel.estimate(prefix).guidePixels;
 assert.ok(meters>=previous,'Completed guide pixels never decrease');
 assert.ok(meters<=full+1,'Progress must not extend beyond the destination');
 previous=meters;
}
assert.deepEqual(travel.routePrefix(route,0),[src]);
assert.deepEqual(travel.routePrefix(route,1),route.map(p=>({...p})));
assert.equal(travel.routePrefix(route,NaN).length,0);
assert.equal(travel.routePrefix([],0).length,0);
assert.equal(JSON.stringify([src,dest]),before);
console.log('PASS completed dotted route grows monotonically, meets pawn and leaves fixed pins unchanged');
