'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
global.FE_CAPITAL_STREETS=require('../capital-street-network.js');
const travel=require('../capital-travel-system.js');
const box={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../city.js'),'utf8'),box);
const places=Object.fromEntries(box.window.FederalElectricCity.mapLocations().map(p=>[p.id,p]));
const guidePixels=(from,to)=>travel.estimate(travel.route(places[from],places[to])).guidePixels;
assert.ok(guidePixels('factory','workingPoker')<=683,
 'Road-entrance selection must not restore the old, longer route to working poker');
assert.ok(guidePixels('factory','capitolAirport')<=440,
 'Capital Airport approach must remain shorter than nearest-edge-only routing');
assert.ok(guidePixels('factory','secondNightclub')<=563,
 'Club route should weigh walking from its actual pin to the street');
assert.equal(guidePixels('factory','workingPoker'),guidePixels('workingPoker','factory'),
 'Distance must not depend on origin direction');
assert.equal(guidePixels('factory','capitolAirport'),guidePixels('capitolAirport','factory'));
const coords=JSON.stringify([places.factory,places.workingPoker,places.capitolAirport]);
for(let n=0;n<30;n++)guidePixels('factory','workingPoker');
assert.equal(JSON.stringify([places.factory,places.workingPoker,places.capitolAirport]),coords,
 'Routing may never move the registered pins');
console.log('PASS door-to-door road approach optimization, symmetric distances and immutable pins');
