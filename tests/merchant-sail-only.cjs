'use strict';
/* Sail-only owner directive: no powered vessels in the 1878 maritime game. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const nav=require('../merchant-navigation.js');
const sea=require('../merchant-passenger-sea.js');
const ship=require('../merchant-shipboard.js');
const empire=require('../industrial-empire.js');
const trade=require('../merchant-trade.js');
const manifest=require('../merchant-manifest.js');
const minute=Math.floor(Date.parse('1878-03-10T09:00:00Z')/60000);
assert.equal(nav.plan('Liverpool','New York','schooner').days,38);
assert.ok(nav.plan('Hamburg','Singapore','schooner').days>=90);
assert.ok(nav.plan('New York','Hong Kong','schooner').days>=120);
assert.ok(nav.plan('Baltimore','Philadelphia','schooner').days<10);
assert.equal(nav.plan('Liverpool','New York','steamer'),null);
assert.equal(nav.sailingDays(3000,'steamer'),null);
assert.equal(sea.BOAT_RATES.steamer,undefined);
assert.equal(trade.CAPACITY.steamer,undefined);
assert.equal(empire.PRICE.steamer,undefined);
const save={characterRoute:'industrialist',phase:'day',paused:false,gameDate:'1878-03-10',
 personalCash:180000,companyCash:5000,currentLocation:{locationId:'potomacFishingBank',roomId:'passenger-pier'},
 worldCalendarStatus:'ready',worldCalendar:{worldMinute:minute}};
const before=save.personalCash;
assert.equal(empire.buyShip(save,'steamer').ok,false);
assert.equal(save.personalCash,before,'rejecting powered ships cannot debit money');
assert.equal(sea.quote(save,'Liverpool','steamer').ok,false);
assert.equal(sea.embark(save,'Liverpool','steamer').ok,false);
assert.equal(save.personalCash,before);
assert.equal(empire.buyShip(save,'schooner').ok,true);
const vessel=empire.ensure(save).fleet.ships[0];
assert.equal(vessel.type,'schooner');
assert.equal(empire.dispatch(save,vessel.id,'Philadelphia','freight',false).ok,true);
assert.ok(vessel.trip.eta>save.gameDate,'real calendar voyage');
assert.equal(manifest.records(save)[0].type,'schooner','merchant manifest preserves sailing type');
const berth=sea.quote(save,'Liverpool');
assert.equal(berth.ok,true,berth.reason);
assert.equal(berth.type,'schooner');
assert.ok(berth.days>20,'transatlantic ticket lasts weeks');
assert.equal(sea.embark(save,'Liverpool').ok,true);
assert.equal(save.passengerSea.voyage.type,'schooner');
assert.equal(ship.decks(save).length,2,'sailing vessel has berth and weather deck');
assert.ok(ship.ensure(save),'walkable schooner on board');
assert.equal(manifest.records(save).length,2);
assert.ok(manifest.records(save).every(m=>m.type==='schooner'));
const UI=fs.readFileSync(path.join(__dirname,'../merchant-passenger-ui.js'),'utf8');
const world=fs.readFileSync(path.join(__dirname,'../merchant-world-map.js'),'utf8');
const holdings=fs.readFileSync(path.join(__dirname,'../industrial-empire.js'),'utf8');
const chart=fs.readFileSync(path.join(__dirname,'../merchant-chart.js'),'utf8');
for(const [name,code] of [['Ticket office',UI],['Shipping world map',world],
 ['Fleet holdings',holdings],['Fleet chart',chart]]){
 assert.doesNotMatch(code,/Steamship|Buy Steamship|buy-steamer|buy:steamer/i,name+' must not offer steamships');
}
assert.match(UI,/Sailing schooner/);
assert.match(world,/Sailing Passage From Washington/);
assert.match(holdings,/Buy Schooner/);
assert.match(chart,/Acquire a sailing schooner/);
const bible=fs.readFileSync(path.join(__dirname,'../COMPANY_BIBLE.md'),'utf8');
assert.match(bible,/a new game with every development build/i);
assert.match(bible,/backward|compatibility with earlier builds/i);
console.log('PASS sail-only routes, real weeks/months, no-powered-ship gate, ticket, fleet, deck and UI contract');