'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const streets=require('../capital-street-network.js');
global.FE_CAPITAL_STREETS=streets;
const travel=require('../capital-travel-system.js');
const a={x:.618,y:.28},b={x:.403,y:.349};
const road=travel.route(a,b);
assert.ok(road.length>=6,'Moving piece follows street intersections, not an arbitrary shortcut');
assert.match(road.routeType,/provisional-street/,'A labeled street road was actually used');
assert.deepEqual({x:road[0].x,y:road[0].y},a);
assert.deepEqual({x:road.at(-1).x,y:road.at(-1).y},b);
assert.ok(road.some((p,i)=>i>0&&i<road.length-1&&
  p.x!==road[i-1].x&&p.y!==road[i-1].y),
  'Capital city has modeled diagonal road avenues');
const estimate=travel.estimate(road);
assert.ok(estimate.guidePixels>0);
assert.equal(estimate.estimatedMiles,null,'Road geometry does not pretend to prove actual miles');
const nearer=travel.route(a,{x:.6,y:.28});
assert.ok(travel.estimate(nearer).guidePixels<estimate.guidePixels);
assert.ok(road.accessPixels>=0);
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../city.js'),'utf8'),ctx);
const pins=ctx.window.FederalElectricCity.mapLocations();
assert.equal(pins.length,40);
for(const p of pins){
 if(p.id==='factory')continue;
 const r=travel.route(a,{x:p.x,y:p.y});
 assert.ok(r.length>=2,'All 40 pin locations obtain a modeled road journey: '+p.id);
 assert.ok(r.routeType.startsWith('provisional-street-'),
  'Road model must not silently fall back for a known Washington pin: '+p.id);
 const m=travel.estimate(r);
 assert.ok(m.minutes.walk>=5&&m.minutes.walk<=120,'Bounded in-game minutes: '+p.id);
}
const rect={x0:.398,x1:.424,y0:.356,y1:.384};
const whiteHouseCrossing=travel.route({x:.37,y:.37},{x:.47,y:.37});
for(let i=1;i<whiteHouseCrossing.length;i++){
 const p=whiteHouseCrossing[i-1],q=whiteHouseCrossing[i];
 const midpoint={x:(p.x+q.x)/2,y:(p.y+q.y)/2};
 assert.ok(midpoint.x<=rect.x0||midpoint.x>=rect.x1||
  midpoint.y<=rect.y0||midpoint.y>=rect.y1,
  'Transit avoids central landmark instead of walking through its building');
}
console.log('PASS integrated graph across all 40 pins, diagonal roads, landmark avoidance and dynamic time');
