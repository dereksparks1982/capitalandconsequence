'use strict';
/* Owner-approved Mitchell world atlas replaces the deliberately removed Admiralty art.
 * Full-resolution scan must actually ship with the Linux game; do not fake the
 * artwork's existence or bypass the voyage/port/overlay assertions.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const nav=require('../merchant-navigation.js');
const root=path.join(__dirname,'..');
const expected='assets/artwork/maps/Mitchell_1880_Map/mitchell-world-1880.jpg';
assert.equal(nav.MAP,expected);
assert.equal(nav.PREVIEW,'assets/artwork/maps/Mitchell_1880_Map/mitchell-world-1880-preview.jpg');
const file=path.join(root,nav.MAP),preview=path.join(root,nav.PREVIEW);
assert(fs.existsSync(file),'The uploaded full-resolution owner-selected Mitchell JPEG must be bundled');
assert(fs.existsSync(preview),'The Mitchell preview must also be bundled for the smaller desk chart');
const stat=fs.statSync(file);
assert(stat.size>=10000000&&stat.size<=25000000,'Full-resolution original must not silently regress to the thumbnail');
assert.deepEqual(nav.CHART,{width:800,height:492,nativeWidth:9664});
function jpegSize(buffer){
 assert(buffer[0]===0xff&&buffer[1]===0xd8,'Not a JPEG');
 let pos=2;
 while(pos+9<buffer.length){
  if(buffer[pos++]!==0xff)continue;
  let code=buffer[pos++];
  while(code===0xff)code=buffer[pos++];
  if(code===0xd9||code===0xda)break;
  if(code===0x01||(code>=0xd0&&code<=0xd7))continue;
  const len=buffer.readUInt16BE(pos);
  if(len<2||pos+len>buffer.length)break;
  if((code>=0xc0&&code<=0xcf)&&![0xc4,0xc8,0xcc].includes(code)){
   return {width:buffer.readUInt16BE(pos+5),height:buffer.readUInt16BE(pos+3)};
  }
  pos+=len;
 }
 return null;
}
assert.deepEqual(jpegSize(fs.readFileSync(file)),{width:9664,height:5944},
 'Bundled JPEG must be the actual Wikimedia 9664 x 5944 source, not a scaled copy');
assert.deepEqual(Object.keys(nav.DISPLAY_PORTS).sort(),Object.keys(nav.PORTS).sort());
const world=fs.readFileSync(path.join(root,'merchant-world-map.js'),'utf8');
const desk=fs.readFileSync(path.join(root,'career-shell.js'),'utf8');
const overview=fs.readFileSync(path.join(root,'merchant-chart.js'),'utf8');
const camera=fs.readFileSync(path.join(root,'merchant-chart-camera.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merchant-world-map.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(world.includes('nav.MAP')&&world.includes('9664')===false,
 'Viewer should load the full map through nav.MAP without hardcoded image dimensions');
assert(desk.includes(nav.PREVIEW)&&overview.includes('nav.PREVIEW'),
 'Small desk and fleet images must use the lightweight preview');
assert(world.includes('Mitchell 1880 atlas ports')&&world.includes('nav.displayPosition('));
assert(css.includes('width:800px;height:492px'));
assert(camera.includes('saved.chartVersion!==3')&&camera.includes('function limit('));
assert(html.indexOf('merchant-navigation.js')<html.indexOf('merchant-world-map.js'));
assert(html.indexOf('merchant-chart-camera.js')<html.indexOf('merchant-world-map.js'));
assert(html.includes('title-map-1938.jpg'),'Do not replace the approved Washington city map');
const oldDeleted='Chart_of_the_world_showing_tracks_followed_by_sailing_and_low_powered_steam_vessels_RMG_E0798';
for(const x of [world,desk,overview,fs.readFileSync(path.join(root,'merchant-navigation.js'),'utf8')])
 assert(!x.includes(oldDeleted),'The deleted Admiralty art must not be referenced by live runtime code');
for(const a of Object.keys(nav.PORTS))for(const b of Object.keys(nav.PORTS)){
 if(a===b)continue;
 const r=nav.route(a,b),display=nav.displayRoute(a,b);
 assert(display&&display.points.length>=2);
 assert.equal(display.nauticalMiles,r.nauticalMiles,
  'A visual map change cannot alter the paid sailing distance');
 assert.deepEqual(display.points[0],nav.DISPLAY_PORTS[a]);
 assert.deepEqual(display.points.at(-1),nav.DISPLAY_PORTS[b]);
 assert(display.points.every(point=>point[0]>=0&&point[0]<=800&&point[1]>=0&&point[1]<=492),
  'Route must remain inside Mitchell image');
}
assert(nav.displayRoute('Hamburg','Singapore').points.some(p=>p[0]>=500&&p[1]>=350),
 'East Indies route must navigate around the Cape, not across Africa');
const depart=Math.floor(Date.parse('1878-03-10T00:00:00Z')/60000);
const trip={from:'Baltimore',to:'Liverpool',departMinute:depart,eta:'1878-04-30',
 routePoints:nav.route('Baltimore','Liverpool').points.map(p=>p.slice())};
const ship={status:'at-sea',port:'Baltimore',trip};
const save={gameDate:'1878-03-30',worldCalendarStatus:'ready',
 worldCalendar:{worldMinute:depart+14400}};
const old=JSON.stringify(ship),from=nav.position(ship,save),shown=nav.displayPosition(ship,save);
assert.equal(shown.progress,from.progress);
assert.deepEqual([shown.x,shown.y],Object.values(nav.xyAt(nav.displayRoute('Baltimore','Liverpool').points,from.progress)));
assert.equal(JSON.stringify(ship),old,'Viewing a vessel cannot alter its saved voyage geometry');
const mark={x:200.3,y:411.1},mapped=nav.savedMarkToDisplay(mark);
assert(Math.abs(nav.displayMarkToSaved(...mapped)[1]-mark.y)<.001);
const fleet=require('../merchant-chart.js').render(save,{ships:[ship],ports:[]},null,true);
assert(fleet.includes(nav.PREVIEW)&&fleet.includes('viewBox="0 0 800 492"'));
console.log('PASS Mitchell 1880: original JPEG dimensions, preview, 8 calibrated ports, preserved wind-powered travel, live chart and no restored Admiralty');