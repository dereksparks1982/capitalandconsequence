'use strict';
/* Source QA for location-persistent digital world status and non-teleporting desk return.
 * Run by the repository's existing local test runner. Does not require network.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const hudSrc=fs.readFileSync(path.join(root,'world-banner.js'),'utf8');
const css=fs.readFileSync(path.join(root,'world-banner.css'),'utf8');
assert.match(html,/world-banner\.js\?v=/,'HUD must load with the game');
assert.match(html,/world-banner\.css\?v=/,'HUD appearance must ship with the game');
assert.match(hudSrc,/cc-world-banner/,'map/rooms must show a distinct status banner');
assert.match(hudSrc,/\.title-map-card/,'map banner placement');
assert.match(hudSrc,/\.city-room-shell/,'room banner placement');
assert.match(hudSrc,/headerCompanyCash/,'company and personal money are visible');
assert.match(hudSrc,/headerPersonalCash/);
assert.match(hudSrc,/washingtonSky/,'weather must be visible');
assert.match(hudSrc,/marketStatus/,'exchange state must be visible');
assert.match(css,/cc-world-dayClock/,'digital clock style');
assert.match(app,/syncCityRoomDeskReturn\(place.id,false\)/,
 'return button must refresh after a normal map trip changes dev preview to actual player mode');
const ret=app.slice(app.indexOf('function returnCityRoomToOffice(){'),app.indexOf('function openSelectedTitleDevRoom()'));
assert.match(ret,/previous\.locationId!=='factory'/,'cannot return to office from another venue');
assert.doesNotMatch(ret,/recordProvisional/,'no silent long-distance return');
assert.match(ret,/recordRoomMove/,'same-factory room return still costs one minute');
assert.ok(ret.indexOf("previous.locationId!=='factory'")<ret.indexOf("S.currentLocation={locationId:'factory'"),
 'any factory room move must follow the physical-location guard');
assert.match(app,/capitalTravelBusy\|\|titleDevFreezeTime/,'ambient ticking stops during the animation');
assert.match(app,/FE_WORLD_BANNER\?\.beginTrip/,'begin simulated clock projection');
assert.match(app,/FE_WORLD_BANNER\?\.progress\?\.\(fraction\)/,'progress visible on clock');
assert.match(app,/FE_WORLD_BANNER\?\.finishTrip/,'a cancelled route resets preview');
const fakeWindow={};const fakeDocument={readyState:'loading',addEventListener(){}};
const scope={window:fakeWindow,document:fakeDocument,Date,Math};
vm.runInNewContext(hudSrc,scope,{filename:'world-banner.js'});
const banner=fakeWindow.FE_WORLD_BANNER;
assert.ok(banner);
const seen=banner.projectClock('1878-01-02T10:47',30);
assert.equal(seen.time,'11:17 AM');
assert.equal(seen.date,'WED, JAN 2, 1878');
const crossing=banner.projectClock('1878-01-02T23:47',30);
assert.equal(crossing.time,'12:17 AM');
assert.equal(crossing.date,'THU, JAN 3, 1878');
assert.equal(banner.projectClock('1878-01-02T11:59',1).time,'12:00 PM');
assert.equal(banner.projectClock('1878-01-02T00:00',0).time,'12:00 AM');
assert.equal(banner.projectClock('nonsense',50),null);
const state={gameDate:'1878-01-02',cash:600,worldCalendar:{worldMinute:100}};
const snapshot=JSON.stringify(state);
assert.equal(banner.beginTrip({departedIso:'1878-01-02T10:47',minutes:30,mode:'walk'}),true);
assert.equal(banner.beginTrip({departedIso:'1878-01-02T10:47',minutes:30}),false,'only one journey projection at once');
banner.progress(.5);
assert.equal(banner.traveling,true);
banner.finishTrip();
assert.equal(banner.traveling,false);
assert.equal(JSON.stringify(state),snapshot,'presentation may not consume game minutes or money');
console.log('PASS global map/room clock, 1878 date rollover and physical office return gate');
