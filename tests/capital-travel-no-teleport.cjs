'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const from=app.indexOf('function capitalTravelStreetReady(points){');
const to=app.indexOf('function capitalTravelMeasurement(id){',from);
assert.ok(from>=0&&to>from,'A shared street-ready condition must be defined');
const predicate=app.slice(from,to);
assert.match(predicate,/points\.routeType\.startsWith\('provisional-street-'\)/,
 'Only graph-backed road itineraries qualify for map departure');
const render=app.slice(app.indexOf('function renderCapitalTravelPreview('),
 app.indexOf('function renderCapitalTravelChoice('));
assert.match(render,/!capitalTravelStreetReady\(points\)/,
 'The preview must not depict a shortcut when road data is missing');
const choice=app.slice(app.indexOf('function renderCapitalTravelChoice('),
 app.indexOf('function openTitleMapLocation('));
assert.match(choice,/!capitalTravelStreetReady\(points\)/,
 'The existing travel notice must disclose unavailable road navigation');
const start=app.indexOf('async function travelFromTitleMap(');
const end=app.indexOf('function buildTitleMapMarkers(',start);
const depart=app.slice(start,end);
assert.match(depart,/if\(!capitalTravelStreetReady\(points\)\|\|!measurement\)/,
 'Cross-city travel must refuse missing street paths');
assert.doesNotMatch(depart,/if\(points\.length<2\)return enterMapDestination/,
 'Missing path must never become an uncharged direct teleport');
assert.match(depart,/No journey was recorded|You have not traveled or been charged/,
 'The player receives a refusal message');
console.log('PASS graph-backed routing required for preview and paid cross-city travel');
