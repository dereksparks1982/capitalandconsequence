'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const family=require('../whitcomb-family.js'),intro=require('../whitcomb-intro.js');
const walk=require('../whitcomb-alexandria-walk.js');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const s={characterRoute:'industrialist',gameDate:'1878-01-02',phase:'day',paused:false,
 personalCash:800,companyCash:2500,currentLocation:{locationId:'factory',roomId:'executive-office'},
 worldCalendarStatus:'ready',worldCalendar:{worldMinute:-48399990}};
family.ensure(s);assert(intro.begin(s).ok);
assert.equal(walk.scene(s),'alexandria');assert.equal(walk.ensure(s).zone,'office');
assert(!walk.canWalk(s,11,0).ok,'no teleport to blocked map');
assert(!walk.cross(s,'quay').ok,'no skipping locations by tab');
assert(!walk.inspect(s).ok,'cannot invent inspection away from a station');
for(const zone of Object.keys(walk.SHAPE)){
 const grid=walk.rows(zone);assert.equal(grid.length,9);
 assert(grid.every(r=>r.length===12));
 assert(!walk.passable('#'));assert(!walk.passable('~'));
}
const before={minute:s.worldCalendar.worldMinute,cash:s.companyCash,personal:s.personalCash};
function follow(points){for(const [x,y] of points){assert(walk.canWalk(s,x,y).ok,'walk '+x+','+y);assert(walk.move(s,x,y).ok)}}
follow([[4,4],[5,4],[6,4],[7,4]]);assert(walk.inspect(s).ok,'father account records');
follow([[8,4],[9,4],[10,4]]);assert.deepEqual(walk.exits(s),['courtyard']);
assert(walk.cross(s,'courtyard').ok);assert.equal(walk.ensure(s).x,1);
assert(!walk.cross(s,'warehouse').ok,'must reach service hatch');
follow([[2,4],[3,4],[4,4],[5,4],[6,4],[6,3],[6,2]]);
assert.deepEqual(walk.exits(s),['warehouse']);
assert(walk.cross(s,'warehouse').ok);assert.equal(walk.ensure(s).zone,'warehouse');
const restored=JSON.parse(JSON.stringify(s));assert.equal(walk.ensure(restored).zone,'warehouse');
assert(walk.cross(s,'courtyard').ok);assert.equal(walk.ensure(s).zone,'courtyard');
assert(intro.choose(s,'clear-accounts').ok,'old financial choice preserved');
assert.equal(walk.scene(s),'departure');assert.equal(walk.ensure(s).zone,'quay');
assert(intro.choose(s,'mother-letter').ok,'old departure choice preserved');
assert.equal(walk.scene(s),'cabin');assert.equal(walk.ensure(s).zone,'cabin');
assert(walk.move(s,3,3).ok);assert(walk.inspect(s).ok,'cabin berth');
assert(intro.choose(s,'reserve').ok);assert.equal(walk.scene(s),null,'arrival is unchanged factory chapter');
assert(!walk.move(s,4,3).ok,'no intro walking after arriving Washington');
assert.deepEqual(before,{minute:s.worldCalendar.worldMinute,cash:s.companyCash,personal:s.personalCash},
 'pre-campaign navigation must not start Washington clock, spend money, or mint trade goods');
assert.equal(s.whitcombIntro.history.length,3);
const ui=read('whitcomb-intro-ui.js'),html=read('index.html'),app=read('app.js');
assert(ui.includes('function renderPlace(save)'));assert(ui.includes("handleStep(move[0],move[1])"));
assert(html.indexOf('whitcomb-alexandria-walk.js')<html.indexOf('whitcomb-intro-ui.js'));
assert(app.includes("},()=>save(true));"));
console.log('Alexandria: four explorable prototype sections, actual gates, saved position, original story decisions, unchanged clock and cash PASS');
