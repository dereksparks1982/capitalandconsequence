'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
global.FE_CAPITAL_STREETS=require('../capital-street-network.js');
const travel=require('../capital-travel-system.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../city.js'),'utf8'),ctx);
const pins=ctx.window.FederalElectricCity.mapLocations();
assert.equal(pins.length,40,'All approved Washington destinations remain registered');
const original=JSON.stringify(pins);
let checked=0;
for(let i=0;i<pins.length;i++)for(let j=0;j<pins.length;j++){
 if(i===j)continue;
 const a=pins[i],b=pins[j];
 const route=travel.route(a,b),estimate=travel.estimate(route);
 assert.ok(route.length>=2,'Missing street route '+a.id+' to '+b.id);
 assert.match(route.routeType,/^provisional-street-/,'No straight-line fallback between registered locations');
 assert.deepEqual(route[0],{x:a.x,y:a.y});
 assert.deepEqual(route.at(-1),{x:b.x,y:b.y});
 assert.ok(route.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
 assert.ok(estimate.guidePixels>=0&&estimate.minutes.walk>=5&&estimate.minutes.walk<=120);
 assert.ok(estimate.minutes.horse<=estimate.minutes.walk);
 assert.ok(estimate.minutes.carriage<=estimate.minutes.walk);
 if(j>i){
  const reverse=travel.route(b,a),back=travel.estimate(reverse);
  assert.ok(Math.abs(back.guidePixels-estimate.guidePixels)<=1,
   'Opposite directions must use the same guide-pixel distance: '+a.id+' '+b.id);
 }
 checked++;
}
assert.equal(checked,1560,'All 40 x 39 ordered destination pairs checked');
assert.equal(JSON.stringify(pins),original,'No routing operation may rewrite approved pin defaults');
assert.ok(global.FE_CAPITAL_STREETS.diagnostic().cachedTrees<=48,'Road cache has a strict upper bound');
console.log('PASS all 1560 directed Washington journeys, reverse-distance agreement, stable pins and bounded cache');
