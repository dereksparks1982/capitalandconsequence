'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('app.js'),index=read('index.html'),css=read('styles.css');
const engine=read('capital-travel-system.js'),journey=read('journey-planner.js');
assert.match(index,/id="capitalTravelMode"/);
assert.match(index,/id="capitalTravelEstimate"/);
assert.match(index,/value="walk"/);assert.match(index,/value="horse"/);assert.match(index,/value="carriage"/);
assert.ok(index.indexOf('capital-travel-system.js?v=')<index.indexOf('app.js?v='),
 'Travel system must initialize before the map handlers');
assert.match(css,/\.capital-travel-overlay/);
assert.match(app,/function capitalTravelPath\(/);
assert.match(app,/titleMapDisplayCoordinate\(v,img\)/,'Waypoints use actual map pin display anchors');
assert.match(app,/FE_CAPITAL_TRAVEL\.animate\(/,'Go There animates before committing arrival');
assert.match(app,/return enterMapDestination\(id,null,null,mode,minutes\)/,
 'A completed animation enters the existing true destination room');
assert.match(app,/recordProvisional\(prior\.locationId,place\.id,null,travelMode,provisionalMinutes\)/,
 'The authoritative player journey receives the selected mode and duration');
assert.match(app,/FE_CAPITAL_TRAVEL\?\.cancel\?\.\(\)/,'Closing the map cancels the journey preview');
assert.match(engine,/estimatedMiles:null/,'No invented historic mileage');
assert.match(journey,/MODE_GAME_MINUTES/);
assert.ok(!/\.title-map-marker\s*\{/.test(engine),
 'The route engine must not modify registered map pin geometry');
console.log('PASS Capital Travel map hooks, animation-first arrival, fixed-pins, and script integration');
