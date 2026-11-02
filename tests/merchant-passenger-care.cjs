'use strict';
/* Passenger-specific health safety: recovery at sea must not make a free
 * Washington hospital teleport and cabin rest must use existing needs rules.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const medical=require('../medical-records.js');
const needs=require('../character-needs.js');
const sea=require('../merchant-passenger-sea.js');
const base=Math.floor(Date.parse('1878-03-10T09:00:00Z')/60000);
const save={characterRoute:'industrialist',gameDate:'1878-03-10',
 worldCalendarStatus:'ready',worldCalendar:{worldMinute:base},
 currentLocation:{locationId:'potomacFishingBank',roomId:'passenger-pier'},
 personalCash:200,companyCash:3000,phase:'day',paused:false};
const booking=sea.embark(save,'Liverpool','steamer');
assert(booking.ok,booking.reason);
assert.equal(save.currentLocation.locationId,'passengerVessel');
needs.ensure(save);
const starting=needs.ensure(save).meters.energy;
save.sleepingAboardPassenger=true;
save.worldCalendar.worldMinute+=120;
needs.sync(save);
assert.equal(needs.ensure(save).meters.energy,starting,'sleeping should not drain energy');
save.sleepingAboardPassenger=false;
const rested=needs.finishSleep(save,120);
assert(rested.ok);
assert(rested.energy>=starting,'cabin sleep must restore using existing human needs');
save.characterNeeds.meters.energy=0;
const beforeCash=save.personalCash,beforeCompany=save.companyCash;
const c=medical.collapse(save,'passengerVessel');
assert(c.ok,c.reason);
assert.equal(c.event.setting,'maritime');
assert.equal(c.event.feeCents,450);
assert.equal(Math.round((beforeCash-save.personalCash)*100),450);
assert.equal(save.companyCash,beforeCompany,'medical expense must not charge Federal Electric');
const conscious=medical.wake(save,120*60);
assert(conscious.ok);
assert.equal(save.currentLocation.locationId,'passengerVessel','shipboard recovery must not teleport');
assert.equal(medical.pending(save),null);
save.worldCalendar.worldMinute=save.passengerSea.voyage.arrivalMinute;
save.gameDate=save.passengerSea.voyage.etaDate;
assert(sea.sync(save).ok);
save.characterNeeds.meters.energy=0;
const c2=medical.collapse(save,'foreignHarbor');
assert(c2.ok);
assert.equal(c2.event.setting,'maritime');
assert(medical.wake(save,120*60).ok);
assert.equal(save.currentLocation.locationId,'foreignHarbor');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
assert(app.includes('galleyMeal:')&&app.includes('galleyWater:')&&app.includes('cabinRest:'));
assert(app.includes('FE_CHARACTER_NEEDS?.eatPrepared'));
assert(app.includes('sleepingAboardPassenger=true'));
const ui=fs.readFileSync(path.join(__dirname,'..','merchant-passenger-ui.js'),'utf8');
assert(ui.includes('cabin-rest')&&ui.includes('galley-meal')&&ui.includes('galley-water'));
console.log('passenger medical and rest: personal doctor fee, on-board/foreign recovery, cabin energy and galley controls validated');
