'use strict';
/* One-time offline regression: 1878 passage length and permanent fictional manifests. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const nav=require('../merchant-navigation.js');
const empire=require('../industrial-empire.js');
const sea=require('../merchant-passenger-sea.js');
const records=require('../merchant-manifest.js');
const life=require('../merchant-shipboard-life.js');
const shipboard=require('../merchant-shipboard.js');
const minute=date=>Math.floor(Date.parse(date+'T00:00:00Z')/60000);
const advanceDate=(save,minutes)=>{
 save.worldCalendar.worldMinute=minutes;
 save.gameDate=new Date(minutes*60000).toISOString().slice(0,10);
};
assert.equal(nav.plan('Liverpool','New York','schooner').days,38,'westbound sailing benchmark');
assert.equal(nav.plan('Liverpool','New York','steamer'),null,'steamships are not available');
assert.ok(nav.plan('Hamburg','Singapore','schooner').days>=90,'intercontinental months');
assert.ok(nav.plan('New York','Hong Kong','schooner').days>=120,'multi-ocean months');
assert.ok(nav.plan('New York','Hong Kong','schooner').days>=120,'multi-ocean sail takes months');
assert.ok(nav.plan('Baltimore','Philadelphia','schooner').days<10,'coastal voyages remain days');
const save={characterRoute:'industrialist',paused:false,phase:'day',personalCash:300000,
 gameDate:'1878-02-01',worldCalendarStatus:'ready',
 worldCalendar:{worldMinute:minute('1878-02-01')},
 currentLocation:{locationId:'potomacFishingBank',roomId:'passenger-pier'}};
assert.equal(empire.buyShip(save,'schooner').ok,true);
const ownerShip=empire.ensure(save).fleet.ships[0];
assert.equal(empire.dispatch(save,ownerShip.id,'Philadelphia','freight',false).ok,true);
const voyage=records.records(save)[0];
assert.equal(voyage.kind,'merchant');
assert.equal(voyage.status,'at-sea');
assert.equal(voyage.passengers.length,2);
assert.equal(voyage.cargo.kind,'freight');
assert.equal(ownerShip.trip.registryId,voyage.id);
empire.ensure(save);empire.ensure(save);
assert.equal(records.records(save).length,1,'no duplicate render or load voyages');
save.gameDate='1878-02-15';save.worldCalendar.worldMinute=minute(save.gameDate);
empire.advance(save);
assert.equal(voyage.status,'arrived');
assert.ok(voyage.passengers.every(p=>p.status==='disembarked'));
assert.ok(records.records(save,'Philadelphia').length===1,'port search');
const q=sea.quote(save,'Liverpool','schooner');
assert.equal(q.ok,true,q.reason);
assert.ok(q.days>14);
assert.equal(sea.embark(save,'Liverpool','schooner').ok,true);
const pax=records.records(save).find(v=>v.kind==='passenger');
assert.ok(pax);
assert.equal(pax.passengers[0].name,'Charles Whitecomb');
assert.equal(pax.passengers[0].role,'player');
assert.equal(pax.status,'at-sea');
const deckNames=shipboard.decks(save).flatMap(d=>life.onDeck(save,d.id).map(p=>p.label));
assert.ok(pax.passengers.some(p=>deckNames.includes(p.name)),'registered travelers visible on deck');
sea.ensure(save);sea.ensure(save);
assert.equal(records.records(save).length,2,'no duplicate passenger register');
advanceDate(save,save.passengerSea.voyage.arrivalMinute+4000);
let out=sea.sync(save);
if(!out.ok){advanceDate(save,save.passengerSea.voyage.arrivalMinute+4000);out=sea.sync(save)}
assert.equal(out.ok,true,out.reason);
assert.equal(pax.status,'arrived');
assert.ok(pax.passengers.every(p=>p.status==='disembarked'));
assert.equal(records.records(save,'Charles Whitecomb').length,1);
assert.equal(records.records(save).length,2);
const restored=JSON.parse(JSON.stringify(save));
assert.equal(records.records(restored).length,2);
assert.equal(records.records(restored,pax.id)[0].id,pax.id);
assert.ok(records.archive(restored,'Charles Whitecomb').includes('fictional'));
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert.ok(html.indexOf('merchant-manifest.js?v=20261103-v07105-sail-only')<
 html.indexOf('industrial-empire.js?v=20261103-v07105-sail-only'),'manifest script loaded first');
console.log('PASS multi-week/month duration, ship cargo, permanent NPC passenger rolls, clocks, sailing-only fleet');
