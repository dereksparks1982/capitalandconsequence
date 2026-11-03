'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ship=require('../merchant-shipboard.js'),sea=require('../merchant-passenger-sea.js');
const now=Math.floor(Date.parse('1878-03-10T09:00:00Z')/60000);
function aboard(type){
 const s={characterRoute:'industrialist',paused:false,phase:'day',gameDate:'1878-03-10',
  personalCash:500,companyCash:2500,currentLocation:{locationId:'potomacFishingBank',roomId:'passenger-pier'},
  worldCalendarStatus:'ready',worldCalendar:{worldMinute:now}};
 const b=sea.embark(s,'Liverpool',type);assert(b.ok,b.reason);return s;
}
for(const type of ['steamer','schooner']){
 const s=aboard(type),p=ship.ensure(s),x=p.x,y=p.y,
  personal=s.personalCash,company=s.companyCash,minute=s.worldCalendar.worldMinute;
 assert.deepEqual(ship.findPath(s,x,y),[],'already standing at tile');
 assert.equal(ship.findPath(s,0,0),null,'wall forbidden');
 if(type==='steamer')assert.equal(ship.findPath(s,9,6),null,'crew-only X is forbidden');
 assert.equal(ship.findPath(s,100,100),null,'out of bounds');
 assert.equal(ship.findPath(s,3.4,5),null,'integer coordinates only');
 assert(!ship.pathOffer(s,x,y).ok,'no movement to same tile');
 const steps=ship.findPath(s,6,2);assert(steps?.length>0,'hatch reachable');
 let last={x,y};
 for(const step of steps){
  assert.equal(Math.abs(step.x-last.x)+Math.abs(step.y-last.y),1,'orthogonal steps');
  assert(ship.allowed(ship.tile(s,p.deck,step.x,step.y)),'no wall or crew crossing');
  last=step;
 }
 const quote=ship.pathOffer(s,6,2);assert(quote.ok,quote.reason);
 assert.equal(quote.seconds,steps.length*60,'one full game minute per tile');
 assert(ship.walkTo(s,6,2).ok);
 assert.equal(p.x,6);assert.equal(p.y,2);
 assert.equal(s.personalCash,personal);assert.equal(s.companyCash,company);
 assert.equal(s.worldCalendar.worldMinute,minute,'engine never runs another timer');
 assert(!ship.pathOffer(s,0,0).ok);
 assert(ship.deckOffer(s,type==='steamer'?'main':'upper').ok,'stair action still required');
 s.paused=true;assert(!ship.pathOffer(s,6,3).ok);s.paused=false;
 s.passengerSea.voyage.arrivalMinute=s.worldCalendar.worldMinute+1;
 assert(!ship.pathOffer(s,6,3).ok,'cannot walk through arrival');
}
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ui=read('merchant-passenger-ui.js'),app=read('app.js');
assert(ui.includes('ship.findPath(save,x,y)')&&ui.includes('ship-go:'));
assert(app.includes('shipWalkTo:(x,y)=>')&&app.includes("advanceWorldSimulation(quote.seconds,true,'passenger-shipboard')"));
assert(read('index.html').includes('title-map-1938.jpg'));
console.log('passenger pathfinding PASS: legal shortest deck routes, no restricted tiles, correct clock & stair gating');