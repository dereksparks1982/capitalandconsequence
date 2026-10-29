'use strict';
const assert=require('node:assert/strict');
const travel=require('../capital-travel-system.js');
assert.deepEqual(travel.arrivalEstimate('1878-01-02T08:30',50),
 {iso:'1878-01-02T09:20',date:'1878-01-02',time:'9:20 AM',nextDay:false});
assert.deepEqual(travel.arrivalEstimate('1878-01-02T23:42',35),
 {iso:'1878-01-03T00:17',date:'1878-01-03',time:'12:17 AM',nextDay:true});
assert.equal(travel.arrivalEstimate('1878-01-02T12:00',0).time,'12:00 PM');
assert.equal(travel.arrivalEstimate('1878-01-02T00:00',1).time,'12:01 AM');
assert.equal(travel.arrivalEstimate('1878-02-28T23:59',2).date,'1878-03-01');
assert.equal(travel.arrivalEstimate('1880-02-28T23:59',2).date,'1880-02-29');
for(const invalid of ['1878-02-29T11:00','1878-13-02T12:00',
 '1878-01-02T24:00','1878-01-02T12:60','2026-10-29','garbage'])
 assert.equal(travel.arrivalEstimate(invalid,20),null,'Invalid saved time '+invalid);
for(const min of [-1,1.5,NaN,Infinity,1441])
 assert.equal(travel.arrivalEstimate('1878-01-02T08:00',min),null);
const save={worldCalendar:{worldMinute:1},currentLocation:{locationId:'factory'}};
const before=JSON.stringify(save);
travel.arrivalEstimate('1878-01-02T08:00',100);
assert.equal(JSON.stringify(save),before,'ETA preview must never change game state');
const fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const begin=app.indexOf('function renderCapitalTravelChoice(id){');
const end=app.indexOf('function openTitleMapLocation(id){',begin);
assert.ok(begin>0&&end>begin);
const ui=app.slice(begin,end);
assert.match(ui,/FE_WASHINGTON_TIME\?\.now\?\.\(S\)/,'ETA uses saved world time');
assert.match(ui,/FE_CAPITAL_TRAVEL\?\.arrivalEstimate\?\.\(nowIso,minutes\)/);
assert.match(ui,/Object\.entries\(length\.minutes\)/,'Compare travel modes');
assert.match(ui,/gameMinutes\+'m':'unavailable'/,'Unavailable rides must not show bookable times');
console.log('PASS saved-calendar travel ETA, midnight/leap boundaries, all mode comparisons and pure previews');
