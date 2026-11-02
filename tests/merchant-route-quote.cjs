'use strict';
/* Offline preflight: quotes do not mutate commerce or bypass port discoveries.
 * Shipping dispatch continues to be exclusively the original merchant engine.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const quote=require('../merchant-route-quote.js');
const empire=require('../industrial-empire.js');
const nav=require('../merchant-navigation.js');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const save={gameDate:'1878-03-10',characterRoute:'industrialist',paused:false,phase:'day',
 personalCash:100000,componentWorks:{warehouse:{'telegraph-fitting':5}},
 worldCalendarStatus:'ready',worldCalendar:{worldMinute:Math.floor(Date.parse('1878-03-10T09:00:00Z')/60000)}};
assert(empire.buyShip(save,'schooner').ok);
const fleet=empire.ensure(save).fleet;
fleet.ports.push('New York','Liverpool');
const initial=JSON.stringify(save);
const proposal=quote.quote(save,1,'Liverpool','electric',true);
assert(proposal.ok,proposal.reason);
assert.equal(JSON.stringify(save),initial,'a quotation must not debit cargo or cash');
assert.equal(proposal.days,nav.plan('Baltimore','Liverpool','schooner').days);
assert.equal(proposal.nauticalMiles,nav.plan('Baltimore','Liverpool','schooner').nauticalMiles);
assert.equal(proposal.eta,quote.addDays(save.gameDate,proposal.days));
assert.equal(proposal.due,110+Math.ceil(empire.PRICE.schooner*.0075));
assert.equal(proposal.insurance,Math.ceil(empire.PRICE.schooner*.0075));
assert.equal(proposal.cargo,'electric');
assert(proposal.legs.length>1);
assert(!quote.quote(save,1,'Hong Kong','freight').ok,'unverified port must remain unavailable');
assert(!quote.quote(save,1,'Baltimore','freight').ok,'same-port voyage must be rejected');
assert(!quote.quote(save,999,'Liverpool','freight').ok);
assert(!quote.quote({...save,paused:true},1,'Liverpool','freight').ok);
assert(!quote.quote({...save,phase:'report'},1,'Liverpool','freight').ok);
assert(!quote.quote({...save,componentWorks:{warehouse:{}}},1,'Liverpool','electric').ok);
assert(!quote.quote(save,1,'Liverpool','fictional-cargo').ok);
assert.equal(quote.addDays('nonsense',4),null);
assert.equal(quote.addDays('1878-03-10',0),null);
const paid=empire.dispatch(save,1,'Liverpool','electric',true);
assert(paid.ok,paid.message);
assert.equal(fleet.ships[0].trip.eta,proposal.eta);
assert.equal(fleet.ships[0].trip.nauticalMiles,proposal.nauticalMiles);
assert.equal(fleet.ships[0].trip.insured,proposal.insured);
assert.equal(save.componentWorks.warehouse['telegraph-fitting'],0);
assert.equal(fleet.cash,2500-proposal.due);
assert(!quote.quote(save,1,'New York','freight').ok,'already departed ship cannot be requoted');
const map=read('merchant-world-map.js'),html=read('index.html');
assert(map.includes("startsWith('quote:')"),'map route quote action missing');
assert(map.includes('Proposed voyage from '),'map route preview line missing');
assert(map.includes('Route Proposal · Not Dispatched'),'separate preview wording missing');
assert(map.includes('empire.dispatch(session.save'),'departure must delegate to original engine');
assert(html.includes('merchant-route-quote.js'));
assert(html.indexOf('merchant-route-quote.js')<html.indexOf('merchant-world-map.js'));
console.log('merchant route quote: cash/insurance, available cargo, verified ports, no mutation and actual dispatch receipt validated');
