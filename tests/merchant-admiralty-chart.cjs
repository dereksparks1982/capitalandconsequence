'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const nav=require('../merchant-navigation.js');
const root=path.join(__dirname,'..');
assert.equal(nav.MAP,'assets/artwork/Chart_of_the_world_showing_tracks_followed_by_sailing_and_low_powered_steam_vessels_RMG_E0798.tiff.jpg');
const file=path.join(root,nav.MAP);
assert(fs.existsSync(file),'New chart JPG must exist');
assert(fs.statSync(file).size<=25*1024*1024,'Chart JPG exceeds 25MB');
assert.deepEqual(nav.CHART,{width:800,height:434,nativeWidth:3840});
assert.deepEqual(nav.DISPLAY_PORTS.Baltimore,[289,182],'Port overlay corrected against actual coastline');
assert.deepEqual(Object.keys(nav.DISPLAY_PORTS).sort(),Object.keys(nav.PORTS).sort());
for(const a of Object.keys(nav.PORTS))for(const b of Object.keys(nav.PORTS)){
 if(a===b)continue;
 const r=nav.route(a,b),visual=nav.displayRoute(a,b);
 assert(visual&&visual.points.length>=2,'Missing visible route '+a+' to '+b);
 assert.equal(visual.nauticalMiles,r.nauticalMiles,'Artwork may not change shipping mileage');
 assert.deepEqual(visual.points[0],nav.DISPLAY_PORTS[a]);
 assert.deepEqual(visual.points.at(-1),nav.DISPLAY_PORTS[b]);
 assert(visual.points.every(p=>p[0]>=0&&p[0]<=800&&p[1]>=0&&p[1]<=434));
}
assert(nav.displayRoute('Hamburg','Singapore').points.some(p=>p[0]>485&&p[1]>335),
 'Eastern shipping path should pass around southern Africa');
const depart=Math.floor(Date.parse('1878-03-10T00:00:00Z')/60000);
const trip={from:'Baltimore',to:'Liverpool',departMinute:depart,eta:'1878-04-30',
 routePoints:nav.route('Baltimore','Liverpool').points.map(p=>p.slice())};
const ship={status:'at-sea',port:'Baltimore',trip};
const save={gameDate:'1878-03-30',worldCalendarStatus:'ready',worldCalendar:{worldMinute:depart+14400}};
const prior=JSON.stringify(ship),before=nav.position(ship,save),after=nav.displayPosition(ship,save);
assert.equal(after.progress,before.progress);
assert.deepEqual([after.x,after.y],Object.values(nav.xyAt(nav.displayRoute('Baltimore','Liverpool').points,before.progress)));
assert.equal(JSON.stringify(ship),prior,'Do not overwrite saved voyage points');
const mark={x:200.3,y:411.1},shown=nav.savedMarkToDisplay(mark);
assert(Math.abs(nav.displayMarkToSaved(...shown)[1]-mark.y)<0.001,'Saved map pin round-trip');
const c=require('../merchant-chart.js').render(save,{ships:[ship],ports:[]},null,true);
assert(c.includes(nav.MAP)&&c.includes('viewBox="0 0 800 434"'));
const world=fs.readFileSync(path.join(root,'merchant-world-map.js'),'utf8');
const desk=fs.readFileSync(path.join(root,'career-shell.js'),'utf8');
assert(desk.includes(nav.MAP)&&world.includes('nav.displayPosition('));
assert(world.includes('nav.displayRoute(')&&world.includes('nav.displayMarkToSaved('));
assert(world.includes('function sharpZoomLimit()')&&world.includes('view.chartVersion=2')&&
 world.includes('nav.CHART.height/600'),'Zoom cap and old camera need explicit compatibility');
for(const src of [world,desk,fs.readFileSync(path.join(root,'merchant-chart.js'),'utf8')])
 assert(!src.includes('SHIPPING-LINES-ECOCLIPPER-small.jpg'),'Old image still used in live scene');
console.log('PASS Admiralty chart: 25MB ceiling, zoom ratio, 8 ports, saved ship and user mark display');
