'use strict';
const assert=require('node:assert/strict');
global.FE_CAPITAL_STREETS=require('../capital-street-network.js');
const travel=require('../capital-travel-system.js');
const origin={x:.618,y:.28};
const before=JSON.stringify(origin);
let checked=0;
for(let xi=0;xi<=10;xi++)for(let yi=0;yi<=10;yi++){
 const destination={x:xi/10,y:yi/10},saved=JSON.stringify(destination);
 const points=travel.route(origin,destination),time=travel.estimate(points);
 assert.ok(points.length>=2,'Moved pin must retain a route at '+xi+','+yi);
 assert.match(points.routeType,/^provisional-street-/,'Moved pin must use the road graph');
 assert.ok(points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
 assert.deepEqual(points.at(-1),destination,'Piece must arrive at the edited pin');
 assert.ok(time.minutes.walk>=5&&time.minutes.walk<=120);
 assert.ok(time.minutes.horse<=time.minutes.walk&&time.minutes.carriage<=time.minutes.walk);
 assert.equal(JSON.stringify(destination),saved,'Travel cannot mutate the edited pin');
 checked++;
}
assert.equal(checked,121);
assert.equal(JSON.stringify(origin),before,'Factory default must remain unchanged');
console.log('PASS 121 edited-pin placements across the entire guide, including off-print edges');
