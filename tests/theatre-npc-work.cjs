'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../city.js'),'utf8'),{window:root});
const city=root.FederalElectricCity;
const access=require('../city-access.js'),mobility=require('../npc-mobility.js');
const economy=require('../npc-economy.js'),weekly=require('../npc-weekly-schedule.js');
const troupe=['edwinBooth','josephJefferson','johnMcCullough','claraMorris','johnTRaymond','charlesHanford','williamRapley'];
let rehearsals=0,stage=0;
for(const id of troupe){
 const def={id,places:['nationalTheatre','nationalTheatre','nationalTheatre',null],
  activities:['rehearsing a theatrical role','preparing the stage','performing on stage',null],traits:{sociability:65,caution:70}};
 const actor={kind:'npc',id,workplaceId:'nationalTheatre',onDuty:true};
 assert.equal(access.canRoom(city,actor,'nationalTheatre','theatre-lobby','1878-01-02').ok,true);
 assert.equal(access.canRoom(city,actor,'nationalTheatre','backstage','1878-01-02').ok,true);
 assert.equal(access.canRoom(city,actor,'nationalTheatre','manager-office','1878-01-02').ok,id==='williamRapley');
 const state={};
 const morning=weekly.at(def,3,0);
 const worked=economy.actionFor(def,state,{
  key:'1878-01-02|0',date:'1878-01-02',slot:0,weekday:3,seed:43,
  defaultLocation:morning.locationId,defaultActivity:morning.activity,rest:false
 });
 assert.equal(worked.action.kind,'work');
 assert.equal(worked.action.activity,morning.activity,'Stage artist keeps specific scripted duty');
 assert.equal(state.economy.balanceCents,0,'No invented theatrical salary');
 assert.equal(state.economy.earnedCents,0,'No invented ticket or box-office revenue');
 for(const slot of [0,1,2]){
  const location=mobility.visit(city,actor,{
   date:'1878-01-02',slot,seed:31,key:'theatre|'+slot,
   defaultLocation:'nationalTheatre',defaultActivity:'rehearsing or performing'
  });
  assert.equal(location.locationId,'nationalTheatre');
  assert.notEqual(location.roomId,'theatre-lobby','Staff do not spend an entire workday pretending to work in the lobby');
  if(id==='williamRapley')assert.equal(location.roomId,'manager-office','The proprietor has an authorized private office');
  else if(id==='charlesHanford')assert.equal(location.roomId,'backstage','Apprentice works behind the stage');
  else{
   assert.ok(['auditorium','backstage'].includes(location.roomId),'Actors use actual auditorium/rehearsal rooms');
   if(location.roomId==='backstage')rehearsals++;
   else stage++;
  }
 }
}
assert.ok(rehearsals>0&&stage>0,'Independent character schedules create actual room variety');
assert.equal(access.canRoom(city,{kind:'player',route:'industrialist'},'nationalTheatre','backstage','1878-01-02').ok,false);
assert.equal(access.canRoom(city,{kind:'npc',id:'chenMei',onDuty:true,workplaceId:'oldChinatown'},
 'nationalTheatre','backstage','1878-01-02').ok,false);
const merchant={kind:'npc',id:'chenMei',workplaceId:'oldChinatown',onDuty:true};
for(let seed=1;seed<=30;seed++){
 const loc=mobility.visit(city,merchant,{date:'1878-01-02',slot:1,seed,key:'business|'+seed,
  defaultLocation:'oldChinatown',defaultActivity:'dealing with customers',preferredDestination:'brokerOffice',sociability:99});
 assert.equal(loc.locationId,'oldChinatown','Daytime workers do not drift to the broker on random leave');
}
console.log('PASS seven theater workers retain distinct duties, backstage authorization and realistic business-shift attendance');
