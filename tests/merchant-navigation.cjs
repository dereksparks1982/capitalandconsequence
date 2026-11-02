'use strict';
/* Offline regression: original EcoClipper chart, saved-clock voyages and fleet accounting.
 * No network, Actions, or Electron UI are required for this focused source test.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const nav=require('../merchant-navigation.js');
const chart=require('../merchant-chart.js');
const empire=require('../industrial-empire.js');
const image=path.join(__dirname,'..',nav.MAP);
assert(fs.existsSync(image),'bundled reference map is missing');
assert.deepEqual(Object.keys(nav.PORTS).sort(),Object.keys(empire.PORTS).sort());
assert.equal(nav.LANES.length,7);
for(const a of Object.keys(nav.PORTS))for(const b of Object.keys(nav.PORTS)){
 if(a===b)continue;
 for(const type of ['schooner','steamer']){
  const p=nav.plan(a,b,type);
  assert(p, a+' to '+b+' lacks navigable shipping lanes');
  assert(p.points.length>=2);
  assert(p.nauticalMiles>0);
  assert(p.days>=2);
  assert.equal(p.days,empire.dayFor(a,b,type));
  assert.deepEqual(p.points[0],nav.PORTS[a]);
  assert.deepEqual(p.points[p.points.length-1],nav.PORTS[b]);
  assert(p.points.every(point=>point.length===2&&point[0]>=0&&point[0]<=800&&point[1]>=0&&point[1]<=600));
 }
}
assert(nav.plan('New York','Liverpool','steamer').days < nav.plan('New York','Liverpool','schooner').days);
assert(nav.plan('New York','Liverpool','schooner').days>=20);
assert(nav.plan('Hamburg','Singapore','schooner').days>=65);
assert.equal(nav.plan('Baltimore','Baltimore','schooner'),null);
assert.equal(nav.plan('Ghost Port','Liverpool','schooner'),null);
const date='1878-03-10';
const start=Math.floor(Date.parse(date+'T09:00:00Z')/60000);
const save={gameDate:date,worldCalendarStatus:'ready',worldCalendar:{worldMinute:start},
 characterRoute:'industrialist',personalCash:100000,paused:false,phase:'day'};
let result=empire.buyShip(save,'schooner');assert(result.ok,result.message);
let e=empire.ensure(save),ship=e.fleet.ships[0];assert.equal(ship.port,'Baltimore');
e.fleet.ports.push('New York','Liverpool','Hamburg','Singapore');
const cashBefore=e.fleet.cash;
result=empire.dispatch(save,ship.id,'Liverpool','freight',false);
assert(result.ok,result.message);
assert.equal(ship.status,'at-sea');
assert(ship.trip?.routePoints?.length>2);
assert.equal(ship.trip.nauticalMiles,nav.plan('Baltimore','Liverpool','schooner').nauticalMiles);
assert.equal(ship.trip.departMinute,start);
assert.equal(e.fleet.cash,cashBefore-110);
const track=ship.trip.routePoints.map(p=>p.slice());
const atStart=nav.position(ship,save);
assert.equal(atStart.progress,0);
const halfMinute=Math.floor((start+Date.parse(ship.trip.eta+'T00:00:00Z')/60000)/2);
save.worldCalendar.worldMinute=halfMinute;
const middle=nav.position(ship,save);
assert(middle.progress>.45&&middle.progress<.55);
assert(Math.hypot(middle.x-atStart.x,middle.y-atStart.y)>15);
assert.deepEqual(ship.trip.routePoints,track,'rendering must not mutate saved voyage');
const html=chart.render(save,e.fleet,String(ship.id),true);
assert(html.includes('SHIPPING-LINES-ECOCLIPPER-small.jpg'));
assert(html.includes('merchant-ship'));
assert(html.includes('data-empire-action="ship-info:'));
assert(html.includes('1878')||html.includes('1878 navigation survey'));
assert.equal(e.fleet.cash,cashBefore-110,'view must not create vessel revenue');
save.gameDate=ship.trip.eta;
save.worldCalendar.worldMinute=Math.floor(Date.parse(save.gameDate+'T12:00:00Z')/60000);
empire.advance(save);
assert.equal(ship.status,'in-port');
assert.equal(ship.port,'Liverpool');
assert.equal(ship.trip,null);
assert.equal(e.fleet.cash>cashBefore-110,false,'upkeep and freight posting must be audited, not presumed');
const snapshot=JSON.stringify(e.fleet);
empire.advance(save);
assert.equal(JSON.stringify(e.fleet),snapshot,'same-day arrival and freight revenue must not double-settle');
console.log('merchant navigation: all port pairs, image coordinates, shipping time, saved positions, freight and arrival validated');
