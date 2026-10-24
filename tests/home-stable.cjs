'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const move=require('../horse-custody.js'),access=require('../city-access.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../city.js'),'utf8'),ctx);
const city=ctx.window.FederalElectricCity;
assert.equal(city.getRoom('home','private-stable').name,'Private Stable and Carriage House');
assert.equal(access.canRoom(city,{route:'industrialist'},'home','private-stable','1878-01-02').ok,true);
assert.equal(access.canRoom(city,{route:'criminal'},'home','private-stable','1878-01-02').ok,false);
const s={paused:false,gameDate:'1878-01-02',currentLocation:{locationId:'eastLivery',roomId:'service-desk'},
 companyCash:2500,personalCash:300,
 transport:{version:2,assets:[
 {id:'horse1',owner:'personal',kind:'horse',name:'Farm horse',status:'stabled',locationId:'eastLivery'},
 {id:'wagon1',owner:'personal',kind:'carriage',name:'Wagon',status:'stabled',locationId:'eastLivery'}],
 events:[],journeys:[]}};
const trip=(from,to,id,paid=true)=>{
 s.transport.journeys.push({id,from,to,calendarApplied:paid,temporaryGameMinutes:60});
 return move.onArrival(s,from,to,paid);
};
// Do not secretly send Charlie's horse to his factory when he buys it.
assert.equal(move.prepare(s,'horse1','eastLivery').ok,true);
assert.equal(s.horseCustody.to,undefined,'No forced factory destination');
assert.equal(trip('eastLivery','home','trip-home').ok,true);
assert.equal(s.transport.assets[0].locationId,'home');
assert.equal(s.transport.assets[1].locationId,'eastLivery','Wagon stays without a paired horse');
assert.equal(s.horseCustody,undefined);
s.currentLocation={locationId:'home',roomId:'private-stable'};
// Walking to Federal Electric means horse stays at HOME.
assert.equal(trip('home','factory','walk-to-factory').ok,false);
assert.equal(s.transport.assets[0].locationId,'home');
assert.equal(move.prepare(s,'horse1','home').ok,true);
assert.equal(trip('home','factory','ride-to-factory').ok,true);
assert.equal(s.transport.assets[0].locationId,'factory','Horse shelters at works while Charlie is there');
assert.equal(s.transport.assets[0].status,'stabled');
s.currentLocation={locationId:'factory',roomId:'rear-stable'};
assert.equal(trip('factory','home','walk-back').ok,false);
assert.equal(s.transport.assets[0].locationId,'factory','Walking home cannot teleport horse');
assert.equal(move.prepare(s,'horse1','factory').ok,true);
assert.equal(trip('factory','home','ride-back').ok,true);
assert.equal(s.transport.assets[0].locationId,'home');
const snapshot=JSON.stringify(s);
assert.equal(move.onArrival(s,'factory','home',true).ok,false);
assert.equal(JSON.stringify(s),snapshot);
// Pairing a carriage requires the vehicle at the same place as the horse.
assert.equal(move.prepare(s,'horse1','home','wagon1').ok,false);
s.transport.assets[1].locationId='home'; // simulate a prior individually validated wagon transfer
assert.equal(move.prepare(s,'horse1','home','wagon1').ok,true);
assert.equal(trip('home','westLivery','horse-and-wagon').ok,true);
assert.equal(s.transport.assets[0].locationId,'westLivery');
assert.equal(s.transport.assets[1].locationId,'westLivery');
assert.equal(s.transport.events.filter(e=>e.journeyId==='horse-and-wagon').length,2);
assert.equal(s.companyCash,2500);
assert.equal(s.personalCash,300);
const src=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
assert.ok(src.includes('window.FE_HORSE_STABLE_UI?.render?.(location.id,room.id,S'));
console.log('PASS home stable, ride to factory, walk leaves horse, ride home, two-asset carriage trips and private access');
