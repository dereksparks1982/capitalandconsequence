'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const context={window:{}};vm.runInNewContext(read('city.js'),context);
const city=context.window.FederalElectricCity,access=require('../city-access.js');
const fair=city.getLocation('washingtonFairgrounds'),actor={kind:'player',route:'industrialist'};
assert.equal(fair.map.n,9,'Fair pin #9 unchanged');
assert.equal(fair.availableFrom,'1878-10-01','late-1878 event gate is owner-approved');
assert.equal(fair.storyEvent,'worlds-fair-1878');
assert.equal(fair.defaultRoom,'public-approach','Arriving at a mapped place is not entry to its event');
const grounds=city.getRoom(fair.id,'fairgrounds');
assert.equal(grounds.restricted,true);assert.equal(grounds.storyGate,'worlds-fair-1878');
for(const date of ['1878-01-02','1878-06-01','1878-09-30']){
 assert.equal(access.canLocation(city,actor,fair.id,date).ok,true,'Fair map visitability in '+date);
 assert.equal(access.canRoom(city,actor,fair.id,'public-approach',date).ok,true,'Fair public approach in '+date);
 const status=access.canRoom(city,actor,fair.id,'fairgrounds',date);
 assert.equal(status.ok,false,'Fair event must remain closed in '+date);assert.match(status.reason,/1878/);
 assert.equal(access.rooms(city,actor,fair.id,date).includes('fairgrounds'),false);
}
assert.equal(access.canRoom(city,actor,fair.id,'fairgrounds',null).ok,false,'Unknown date cannot bypass story timing');
for(const date of ['1878-10-01','1878-11-01','1878-12-31'])
 assert.equal(access.canRoom(city,actor,fair.id,'fairgrounds',date).ok,true,'late-1878 window allows event shell');
for(const id of ['capitalSpeedway','potomacKennelTrack','washingtonAirport','franciscanMonastery']){
 const loc=city.getLocation(id);
 assert.equal(loc.availableFrom,undefined,'Unrelated alternate-history map remains year independent: '+id);
 assert.equal(access.canRoom(city,actor,id,loc.defaultRoom,'1878-01-02').ok,true,id+' still visitable in 1878');
}
assert.equal(access.canRoom(city,actor,'factory','executive-office','1878-01-02').ok,true);
assert.equal(access.canRoom(city,{route:'investigator'},'factory','executive-office','1878-01-02').ok,false);
const app=read('app.js');
assert.match(app,/if\(room\.storyGate\)/,'Map arrival enforces event');
assert.match(app,/if\(room\?\.storyGate&&!dev/,'Normal room entry enforces event');
assert.match(app,/if\(targetRoom\.storyGate&&/,'Journey preflight enforces event');
assert.match(app,/!!room\.storyGate&&!cityRoomSession\.dev/,'Room menu disables unready event');
console.log('PASS Fair public site vs late-1878 exposition story gate and other city visitability');
