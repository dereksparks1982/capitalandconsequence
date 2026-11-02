'use strict';
// Focused regression for the 1878 passenger voyage, saved storm exposure,
// return ocean/feeder sequence and genuinely paid harbour lodging.
const assert=require('node:assert/strict');
const sea=require('../merchant-passenger-sea.js');
const nav=require('../merchant-navigation.js');
const minute=s=>Math.floor(Date.parse(s)/60000);
function passenger(at='1878-11-18T09:00:00Z'){
 return {characterRoute:'industrialist',gameDate:at.slice(0,10),phase:'day',
  paused:false,personalCash:5000,companyCash:2500,
  currentLocation:{locationId:'potomacFishingBank',roomId:'passenger-pier'},
  worldCalendarStatus:'ready',worldCalendar:{worldMinute:minute(at)}};
}
const s=passenger();
assert(!sea.lodgingQuote(s).ok,'no lodging available from Washington');
const first=sea.embark(s,'Liverpool','schooner');
assert(first.ok);
const trip=sea.ensure(s).voyage, originalArrival=trip.arrivalMinute;
const weather=trip.weather;
assert(weather&&weather.triggerMinute>trip.departMinute);
assert.equal(sea.position(s).feeder,true);
s.worldCalendar.worldMinute=weather.triggerMinute-1;
assert(!sea.sync(s).ok);
assert.equal(trip.arrivalMinute,originalArrival);
s.worldCalendar.worldMinute=weather.triggerMinute;
assert(!sea.sync(s).ok);
assert.equal(trip.weather.observed,true);
assert.equal(trip.arrivalMinute,originalArrival+weather.delayMinutes);
const count=s.passengerSea.history.filter(x=>x.kind==='weather-delay').length;
for(let k=0;k<20;k++)sea.sync(s);
assert.equal(s.passengerSea.history.filter(x=>x.kind==='weather-delay').length,count);
assert.equal(s.passengerSea.history.filter(x=>x.kind==='weather-delay').length,weather.delayMinutes?1:0);
if(weather.delayMinutes){
 s.worldCalendar.worldMinute=originalArrival;
 assert(!sea.sync(s).ok,'a rough-sea delay cannot allow early port arrival');
}
s.worldCalendar.worldMinute=trip.arrivalMinute;s.gameDate=trip.etaDate;
assert(sea.sync(s).ok);
assert.equal(s.passengerSea.port,'Liverpool');
assert(!sea.lodgingQuote(s).ok,'must stand at foreign lodging first');
assert(sea.move(s,'lodging',6,7).ok);
assert(sea.lodgingQuote(s).ok);
const pre=s.personalCash,company=s.companyCash;
assert(!sea.payLodging(s,59).ok,'no charge for incomplete rest');
const rest=sea.payLodging(s,240);assert(rest.ok,rest.reason);
assert.equal(s.personalCash,Math.round((pre-sea.LODGING_COST)*100)/100);
assert.equal(s.companyCash,company,'company treasury never pays personal lodging');
assert(!sea.payLodging(s,240).ok,'same-minute receipt cannot be paid twice');
s.worldCalendar.worldMinute+=240;
assert(sea.payLodging(s,120).ok,'second completed rest after elapsed clock time');
s.currentLocation.roomId='quay';
assert(!sea.lodgingQuote(s).ok,'fake presence blocked');
assert(!sea.payLodging(s,90).ok,'no remote room charge');
s.currentLocation.roomId='lodging';
s.paused=true;assert(!sea.lodgingQuote(s).ok);
s.paused=false;
s.phase='report';assert(!sea.lodgingQuote(s).ok);
s.phase='day';
assert(sea.lodgingQuote(s).ok);
const back=sea.embark(s,'Baltimore','steamer');assert(back.ok);
const ret=sea.ensure(s).voyage, ocean=ret.seaDays*1440, feeder=ret.transferDays*1440;
assert(ret.returning);
assert.equal(sea.position(s).feeder,false,'return must begin with an ocean crossing');
assert(!sea.lodgingQuote(s).ok,'not ashore while aboard');
assert(!sea.payLodging(s,90).ok,'no shipboard lodging receipt');
s.worldCalendar.worldMinute=ret.departMinute+ocean-1;
sea.sync(s);
assert.equal(sea.position(s).feeder,false,'feeder is not before the end of ocean crossing');
s.worldCalendar.worldMinute=ret.departMinute+ocean+(ret.weather.observed?ret.weather.delayMinutes:0);
sea.sync(s);
assert.equal(sea.position(s).feeder,true,'return feeder runs after ocean and any sea delay');
const pt=sea.position(s).coordinates, bp=nav.PORTS.Baltimore;
assert(Math.hypot(pt.x-bp[0],pt.y-bp[1])<.001,'return ship at Baltimore when feeder begins');
s.worldCalendar.worldMinute=ret.arrivalMinute;s.gameDate=ret.etaDate;
assert(sea.sync(s).ok);
assert.equal(s.currentLocation.locationId,'potomacFishingBank');
assert.equal(s.currentLocation.roomId,'passenger-pier');
assert.equal(s.personalCash>=0,true);
assert.equal(s.companyCash,company);
// Weather is not historical meteorology, and reload cannot re-roll a crossing.
for(const date of ['1878-01-02','1878-07-14','1878-11-20']){
 const key=minute(date+'T12:00:00Z'),legs=nav.plan('Baltimore','Liverpool','schooner').legs;
 assert.equal(sea.modeledDelay('Baltimore','Liverpool','schooner',key,legs),
  sea.modeledDelay('Baltimore','Liverpool','schooner',key,legs));
}
console.log('passenger weather and physical lodging: ETA, logged event, outward/return orientation, cash and save integrity passed');
