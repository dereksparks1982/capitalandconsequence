'use strict';
const assert=require('node:assert/strict');
const travel=require('../capital-travel-system.js');
const route=[{x:.15,y:.2},{x:.48,y:.2},{x:.48,y:.7}];
const dry=travel.weatherEstimate(route,'Clear'),rain=travel.weatherEstimate(route,'Rain showers'),
 ice=travel.weatherEstimate(route,'Ice and sleet'),fog=travel.weatherEstimate(route,'morning fog');
assert.equal(dry.weather,'clear');
assert.equal(rain.weather,'rain');
assert.equal(ice.weather,'ice');
assert.equal(fog.weather,'fog');
assert.equal(dry.guidePixels,rain.guidePixels);
assert.equal(rain.guidePixels,ice.guidePixels);
for(const mode of ['walk','horse','carriage']){
 assert.equal(dry.weatherExtraMinutes[mode],0);
 assert.ok(rain.minutes[mode]>=dry.minutes[mode]);
 assert.ok(ice.minutes[mode]>rain.minutes[mode]);
 assert.ok(ice.weatherExtraMinutes[mode]>0);
}
const original=JSON.stringify(route);
const stale=travel.weatherEstimate(route,'heavy snow');
assert.ok(stale.minutes.walk>=dry.minutes.walk);
assert.equal(JSON.stringify(route),original,'Weather never moves approved routes');
global.S={gameDate:'1878-05-03',paused:false,turnSerial:4,
 transport:{journeys:[]}};
let charges=0;
global.window={
 FederalElectricCity:{getLocation:id=>['factory','workingPoker'].includes(id)?{id}:null},
 FE_CALENDAR_BRIDGE:{moment:()=>({iso:'1878-05-03T09:00'})},
 advanceWorldTime:seconds=>(charges++,seconds)
};
require('../journey-planner.js');
const ok=window.FE_TRAVEL.recordProvisional('factory','workingPoker',
 'storm-journey-1','walk',ice.minutes.walk,{
 guidePixels:ice.guidePixels,routeType:'provisional-street-network',
 weather:ice.weather,weatherExtraMinutes:ice.weatherExtraMinutes.walk
});
assert.equal(ok,true);
assert.equal(charges,1,'Only one game-clock charge is allowed');
const receipt=S.transport.journeys[0];
assert.equal(receipt.temporaryGameMinutes,ice.minutes.walk);
assert.equal(receipt.weather,'ice');
assert.equal(receipt.weatherExtraMinutes,ice.weatherExtraMinutes.walk);
assert.equal(receipt.guidePixels,dry.guidePixels);
assert.equal(receipt.miles,null);
assert.equal(window.FE_TRAVEL.recordProvisional('factory','workingPoker',
 'storm-journey-1','walk',ice.minutes.walk),false);
assert.equal(charges,1,'Duplicate trip cannot debit time');
console.log('PASS weather-aware times, unchanged road geometry, one paid trip and immutable weather receipt');
