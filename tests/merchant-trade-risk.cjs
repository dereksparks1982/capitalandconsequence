'use strict';
/* Single-campaign cargo risk, finite exchange, hull/cargo policy split, and
 * no double restoration or claims after a sunken merchant vessel. */
const assert=require('node:assert/strict');
const empire=require('../industrial-empire.js');
const trade=require('../merchant-trade.js');
const nav=require('../merchant-navigation.js');
const minute=s=>Math.floor(Date.parse(s+'T09:00:00Z')/60000);
const addDays=(d,n)=>{let x=new Date(d+'T00:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
function roll(key){let h=2166136261;for(const c of String(key)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0)/4294967296}
function make(day){
 return {gameDate:day,characterRoute:'industrialist',personalCash:150000,companyCash:1234,
  paused:false,phase:'day',worldCalendarStatus:'ready',worldCalendar:{worldMinute:minute(day)}};
}
// Find a reproducible bad-weather crossing. This exercises the actual engine
// outcome rather than injecting an imaginary loss result.
let badDay=null;
for(let k=0;k<400;k++){
 const day=addDays('1878-05-01',k),landing=addDays(day,nav.plan('New York','Havana','schooner').days),
  month=Number(landing.slice(5,7));
 const risk=.048*(1+(100-8)/65)*(month>=6&&month<=11?2:1);
 const threshold=risk*.17+.002*.22;
 if(roll('1|'+day+'|Havana|trade')<threshold){badDay=day;break}
}
assert(badDay,'fixture must provide at least one deterministic storm/piracy loss');
const s=make(badDay);assert(empire.buyShip(s,'schooner').ok);
const e=empire.ensure(s),f=e.fleet,ship=f.ships[0];
ship.port='New York';ship.condition=8;
f.ports.push('New York','Havana');
const q=trade.quote(s,ship,'Havana','machinery',5,true,f);
assert(q.ok,q.reason);
assert(q.cargoInsurance>0&&q.insurance>0);
const before=JSON.stringify(s);
assert(!trade.quote({...s,personalCash:0},ship,'Havana','machinery',0,true,f).ok);
assert.equal(JSON.stringify(s),before,'bad quotes must not purchase or pay');
assert(empire.dispatchTrade(s,ship.id,'Havana','machinery',5,true).ok);
const trip=ship.trip,amount=trip.tradeLot.purchase;
assert.equal(amount,q.purchase);
assert.equal(f.cash,2500-q.due);
s.gameDate=trip.eta;s.worldCalendar.worldMinute=minute(trip.eta);
empire.advance(s);
assert.equal(ship.status,'lost','fixed risky route causes actual ship loss');
assert.equal(ship.trip,null);
assert.equal((f.tradeHold.Havana||[]).length,0,'no cargo magically survives a sunken ship');
const cargoClaim=f.ledger.filter(x=>x.label.includes('Separate cargo loss insurance'));
const hullClaim=f.ledger.filter(x=>x.label.includes('Hull insurance settlement'));
assert.equal(cargoClaim.length,1);
assert.equal(cargoClaim[0].amount,Math.round(amount*.7));
assert.equal(hullClaim.length,1);
assert.equal(hullClaim[0].amount,Math.round(empire.PRICE.schooner*.72));
const ledger=JSON.stringify(f.ledger),money=f.cash;
empire.advance(s);
assert.equal(JSON.stringify(f.ledger),ledger,'ship loss, cargo, and claims must settle once');
assert.equal(f.cash,money);
assert.equal(s.companyCash,1234,'insurance belongs to fleet treasury not Federal Electric');
assert(!empire.sellTrade(s,'Havana',1).ok,'lost goods can never be sold');
assert(!empire.dispatchTrade(s,ship.id,'Baltimore','machinery',1,true).ok);
assert.equal(trade.remaining(s,'New York','machinery'),trade.stockFor('New York','machinery')-5);
const oldWeek=trade.week(s);
s.gameDate=addDays(badDay,14);s.worldCalendar.worldMinute=minute(s.gameDate);
assert(trade.week(s)>oldWeek);
assert.equal(trade.remaining(s,'New York','machinery'),trade.stockFor('New York','machinery'),'port supply refreshes only with a new calendar week');
// A company-account identity check must deny phantom payouts.
const wrong={...s,characterRoute:'wardman'};
assert(!empire.sellTrade(wrong,'Havana',1).ok);
console.log('merchant cargo loss: authentic risk route, separate insured hull/cargo settlement, scarce supply, no phantom warehouse or double claims passed');
