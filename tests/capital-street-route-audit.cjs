'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const streets=require('../capital-street-network.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../city.js'),'utf8'),ctx);
const pins=ctx.window.FederalElectricCity.mapLocations();
assert.equal(pins.length,40);
let checked=0;
for(const a of pins)for(const b of pins){
 if(a.id===b.id)continue;
 const route=streets.streetRoute(a,b);
 assert.ok(route?.points?.length>=2,'Missing street path '+a.id+' to '+b.id);
 assert.deepEqual(route.points[0],{x:a.x,y:a.y});
 assert.deepEqual(route.points.at(-1),{x:b.x,y:b.y});
 const result=streets.validateItinerary(route.points);
 assert.equal(result.ok,true,'Restricted crossing on '+a.id+' to '+b.id);
 checked++;
}
assert.equal(checked,1560);
const throughWhiteHouse=[{x:.37,y:.37},{x:.45,y:.37}];
const bad=streets.validateItinerary(throughWhiteHouse);
assert.equal(bad.ok,false);
assert.equal(bad.reason,'restricted-crossing');
assert.equal(bad.landmark,'White House grounds');
assert.equal(streets.validateItinerary([]).reason,'invalid-waypoints');
assert.equal(streets.validateItinerary([{x:0,y:0},{x:NaN,y:.1}]).ok,false);
const visiting=streets.validateItinerary([{x:.37,y:.37},{x:.41,y:.37}]);
assert.equal(visiting.ok,true,'Visiting the landmark remains possible');
console.log('PASS all 1560 Washington street paths and restricted-compound transit audit');
