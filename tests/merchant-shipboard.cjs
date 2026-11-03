'use strict';
// Moving-vessel integration: no new clock and no instant geography changes.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ship=require('../merchant-shipboard.js'),sea=require('../merchant-passenger-sea.js');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const now=Math.floor(Date.parse('1878-03-10T09:00:00Z')/60000);
function make(type){
 const s={characterRoute:'industrialist',phase:'day',paused:false,gameDate:'1878-03-10',
  personalCash:500,companyCash:2500,currentLocation:{locationId:'potomacFishingBank',roomId:'passenger-pier'},
  worldCalendarStatus:'ready',worldCalendar:{worldMinute:now}};
 const boarded=sea.embark(s,'Liverpool',type);assert(boarded.ok,boarded.reason);
 return s;
}
for(const type of ['schooner','steamer']){
 const s=make(type),p=ship.ensure(s),minute=s.worldCalendar.worldMinute,cash=s.personalCash,company=s.companyCash;
 assert(ship.at(s,'rest'),'board at actual passenger berth');
 assert(!ship.at(s,'meal'),'not at galley');
 assert(!ship.deckOffer(s,'upper').ok,'no deck teleport');
 assert(!ship.moveOffer(s,11,1).ok,'no long-distance cursor movement');
 assert(!ship.moveOffer(s,0,0).ok,'walls block');
 assert(ship.moveOffer(s,p.x+1,p.y).ok);
 assert(ship.move(s,p.x+1,p.y).ok);
 assert.equal(s.worldCalendar.worldMinute,minute,'module cannot create new clock ticks');
 assert.equal(s.personalCash,cash);assert.equal(s.companyCash,company);
 const copy=JSON.parse(JSON.stringify(s));
 assert.equal(ship.ensure(copy).x,p.x,'walk position persists on disk');
 assert.equal(ship.ensure(copy).voyageId,p.voyageId);
 assert.equal(ship.decks(s).length,type==='steamer'?3:2);
 for(const deck of ship.decks(s)){
  assert.equal(deck.rows.length,9);
  assert(deck.rows.every(row=>row.length===12));
  assert.equal(deck.rows.filter(row=>row.includes('H')).length,1);
 }
}
const s=make('steamer'),p=ship.ensure(s);
function walkPath(points){for(const [x,y] of points){const offer=ship.moveOffer(s,x,y);assert(offer.ok,offer.reason);assert(ship.move(s,x,y).ok)}}
walkPath([[3,4],[3,3],[4,3],[5,3],[6,3],[6,2]]);
assert(ship.deckOffer(s,'main').ok);
assert(ship.changeDeck(s,'main').ok);
assert.equal(ship.ensure(s).deck,'main');
walkPath([[6,3],[5,3],[4,3],[3,3],[3,4]]);
assert(ship.at(s,'cards'));
assert(!ship.cardOffer(s,'hit').ok);
assert(ship.cardOffer(s,'start').ok);
const fleetCash=s.companyCash,personal=s.personalCash;
const pct=sea.position(s).progress;
assert(ship.cardAct(s,'start').ok);
assert(!ship.cardOffer(s,'start').ok);
assert.equal(ship.ensure(s).game.round.player.length,2);
assert(ship.cardOffer(s,'stand').ok);
assert(ship.cardAct(s,'stand').ok);
assert.equal(ship.ensure(s).game.history.length,1);
assert(!ship.cardOffer(s,'stand').ok);
assert.equal(s.companyCash,fleetCash,'casual game cannot affect company');
assert.equal(s.personalCash,personal,'casual game has no stakes');
assert.equal(sea.position(s).progress,pct,'card engine cannot move vessel directly');
s.worldCalendar.worldMinute+=600;
assert(sea.position(s).progress>pct,'ship progresses only from real elapsed game time');
const restored=JSON.parse(JSON.stringify(s));
assert.deepEqual(ship.ensure(restored).game.history,ship.ensure(s).game.history);
assert(!ship.stationOffer(s,'rest',600).ok,'no sleeping from card table');
s.paused=true;assert(!ship.cardOffer(s,'start').ok);s.paused=false;
s.phase='report';assert(!ship.cardOffer(s,'start').ok);s.phase='day';
s.worldCalendar.worldMinute=s.passengerSea.voyage.arrivalMinute-1;
assert(!ship.cardOffer(s,'start').ok,'no card session beyond arrival');
assert(!ship.moveOffer(s,3,3).ok,'no walking while docked');
// A rough-sea delay must become effective before arrival. Do not bypass it.
if(s.passengerSea.voyage.weather?.delayMinutes){
 s.worldCalendar.worldMinute=s.passengerSea.voyage.weather.triggerMinute;
 assert(!sea.sync(s).ok);
}
s.worldCalendar.worldMinute=s.passengerSea.voyage.arrivalMinute;
s.gameDate=s.passengerSea.voyage.etaDate;
assert(sea.sync(s).ok);assert.equal(ship.ensure(s),null);
const app=read('app.js'),html=read('index.html'),ui=read('merchant-passenger-ui.js');
assert(app.includes("shipCard:(choice)=>")&&app.includes("passenger-shipboard"));
assert(app.includes('const arrival=window.FE_PASSENGER_SEA?.sync?.(S);'),'ambient real-time ticks must dock the vessel');
assert(app.includes("stationOffer?.(S,'meal'")&&app.includes("stationOffer?.(S,'water'"));
assert(app.includes("stationOffer?.(S,'rest'"));
assert(ui.includes('function shipScene()')&&ui.includes('ship-walk:')&&ui.includes('ship-deck:'));
assert(html.indexOf('merchant-shipboard.js')<html.indexOf('merchant-passenger-ui.js'));
assert(html.includes('title-map-1938.jpg'));
assert(read('merchant-navigation.js').includes(require('../merchant-navigation.js').MAP),'Shipboard uses owner-selected chart');
console.log('shipboard: physical decks, station and crew gates, casual card hand, persistence, one clock and original maps PASS');
