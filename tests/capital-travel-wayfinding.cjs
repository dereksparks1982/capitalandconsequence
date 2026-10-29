'use strict';
const assert=require('node:assert/strict');
global.FE_CAPITAL_STREETS=require('../capital-street-network.js');
const travel=require('../capital-travel-system.js');
const a={x:.618,y:.28},b={x:.403,y:.349};
const path=travel.route(a,b),estimate=travel.estimate(path);
assert.ok(path.routeType.startsWith('provisional-street'));
assert.ok(path.turns>=1&&path.turns<50,'Wayfinding reports realistic approximate turn count');
assert.ok(Array.isArray(path.namedRoads));
assert.ok(path.namedRoads.length>=1,'Known modeled diagonal appears in route metadata');
assert.ok(path.namedRoads.every(n=>/Avenue corridor$/.test(n)));
assert.ok(path.namedRoads.includes('New York Avenue corridor'));
assert.ok(estimate.guidePixels>0);
global.S={paused:false,turnSerial:2,transport:{journeys:[]}};
global.window={
 FederalElectricCity:{getLocation:id=>['factory','star'].includes(id)?{id}:null},
 FE_CALENDAR_BRIDGE:{moment:()=>({iso:'1878-01-02T08:00'})},
 advanceWorldTime:seconds=>seconds
};
require('../journey-planner.js');
const good=window.FE_TRAVEL.recordProvisional('factory','star','wayfinding-1','walk',
 estimate.minutes.walk,{guidePixels:estimate.guidePixels,routeType:path.routeType,
  accessPixels:path.accessPixels,turns:path.turns,
  namedRoads:[...path.namedRoads,'Unauthorized Invented Street','New York Avenue corridor']});
assert.equal(good,true);
const record=S.transport.journeys[0];
assert.equal(record.turns,path.turns);
assert.deepEqual(record.namedRoads,path.namedRoads,'Only legitimate named road labels are persisted');
assert.equal(record.guidePixels,estimate.guidePixels);
assert.equal(record.temporaryGameMinutes,estimate.minutes.walk);
const snapshot=JSON.stringify(record);
b.x+=.09;b.y+=.03;
const updated=travel.route(a,b);
assert.notDeepEqual(updated.map(p=>[p.x,p.y]),path.map(p=>[p.x,p.y]));
assert.equal(JSON.stringify(S.transport.journeys[0]),snapshot,
 'Previous route descriptions and time never change when a pin is moved');
console.log('PASS named road/turn wayfinding, validated saved journey snapshots and live pin routing');
