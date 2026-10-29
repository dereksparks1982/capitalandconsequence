'use strict';
const assert=require('node:assert/strict');
const travel=require('../capital-travel-system.js');
for(const minutes of [0,4,5,17,43,120]){
 assert.equal(travel.remainingMinutes(minutes,0),minutes);
 assert.equal(travel.remainingMinutes(minutes,1),0);
 assert.equal(travel.remainingMinutes(minutes,2),0);
 assert.equal(travel.remainingMinutes(minutes,-1),minutes);
 let previous=minutes;
 for(let i=1;i<=100;i++){
  const left=travel.remainingMinutes(minutes,i/100);
  assert.ok(left<=previous&&left>=0,'Remaining minutes never run backwards');
  previous=left;
 }
}
assert.equal(travel.remainingMinutes(43,.25),33);
assert.equal(travel.remainingMinutes(43,.5),22);
assert.equal(travel.remainingMinutes(43,.75),11);
for(const [minutes,progress] of [[-1,.5],[2.5,.5],[Infinity,.5],[1441,.5],[30,NaN],[30,Infinity]])
 assert.equal(travel.remainingMinutes(minutes,progress),null);
const save={worldCalendar:{worldMinute:443412,history:[]},currentLocation:{locationId:'factory'}};
const snapshot=JSON.stringify(save);
travel.remainingMinutes(30,.45);
assert.equal(JSON.stringify(save),snapshot,
 'Progress display must not debit the world clock or change character location');
const fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const start=app.indexOf('async function travelFromTitleMap(event){');
const end=app.indexOf('function buildTitleMapMarkers(){',start);
assert.ok(start>=0&&end>start);
const action=app.slice(start,end);
assert.match(action,/FE_CAPITAL_TRAVEL\?\.remainingMinutes\?\.\(minutes,fraction\)/);
assert.match(action,/in-game minutes remaining/);
assert.match(action,/milestone!==lastMilestone/,
 'Progress announcements must not update every animation frame');
assert.match(action,/return enterMapDestination\(id,null,null,mode,minutes,\{/,
 'Only a completed actual arrival invokes the paid transaction');
console.log('PASS journey remaining time, bounded milestones, and zero progress-time clock debits');
