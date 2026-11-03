'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const sea=require('../merchant-passenger-sea.js'),ship=require('../merchant-shipboard.js');
const life=require('../merchant-shipboard-life.js');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const minute=Math.floor(Date.parse('1878-03-10T09:00:00Z')/60000);
function make(type){
 const s={characterRoute:'industrialist',gameDate:'1878-03-10',phase:'day',paused:false,
  personalCash:500,companyCash:2500,currentLocation:{locationId:'potomacFishingBank',roomId:'passenger-pier'},
  worldCalendarStatus:'ready',worldCalendar:{worldMinute:minute}};
 assert(sea.embark(s,'Liverpool',type).ok);
 return s;
}
for(const type of ['schooner','steamer']){
 const s=make(type),st=life.ensure(s);
 assert.equal(st.people.length,3);assert.equal(st.conversations.length,0);
 const before=s.worldCalendar.worldMinute,cash=s.personalCash,company=s.companyCash;
 for(const p of life.PEOPLE){
  const position=life.position(s,p.id);
  assert(position&&ship.allowed(ship.tile(s,position.deck,position.x,position.y)),'NPC at valid deck tile');
  const after=life.positionAt(s,p.id,before+4);
  assert(after&&ship.allowed(ship.tile(s,after.deck,after.x,after.y)));
  const path=life.findRoute(s,position,after);
  assert(path.length>0,'every four-minute move must have a legal deck connection');
  assert(path.length<=2,'no NPC teleport between four-minute ticks');
 }
 assert.equal(s.worldCalendar.worldMinute,before,'NPC updates never advance time');
 assert.equal(s.personalCash,cash);assert.equal(s.companyCash,company,'no phantom NPC wage or bill');
 assert.deepEqual(life.ensure(JSON.parse(JSON.stringify(s))).conversations,[]);
 const far=life.offerTalk(s,'cards','voyage');
 assert(!far.ok,'cannot speak to an unseen passenger from the cabin');
 const invalid=life.offerTalk(s,'traveler','unsupported');assert(!invalid.ok);
}
const s=make('steamer'),actor=life.position(s,'traveler'),me=ship.ensure(s);
assert(actor&&me);
me.deck=actor.deck;me.x=actor.x;me.y=actor.y; // Establish real same-room presence for engine model testing.
const original=s.worldCalendar.worldMinute,personal=s.personalCash,company=s.companyCash;
const offer=life.offerTalk(s,'traveler','voyage');
assert(offer.ok,offer.reason);
assert(!life.finishTalk(s,offer).ok,'no unearned conversation without elapsed time');
s.worldCalendar.worldMinute+=2;
const result=life.finishTalk(s,offer);
assert(result.ok,result.reason);assert(result.record.answer.length>10);
assert.equal(life.ensure(s).conversations.length,1);
assert(!life.finishTalk(s,offer).ok,'no repeated payment/duplicate talk');
assert(!life.offerTalk(s,'traveler','voyage').ok,'conversation cooldown');
assert.equal(s.companyCash,company);assert.equal(s.personalCash,personal);
assert(s.worldCalendar.worldMinute>original,'only the caller advances the authoritative clock');
const reload=JSON.parse(JSON.stringify(s));
assert.deepEqual(life.ensure(reload).conversations,life.ensure(s).conversations);
reload.currentLocation={locationId:'foreignHarbor',roomId:'quay'};
assert.equal(life.ensure(reload),null,'people cannot be summoned in foreign harbour');
const ui=read('merchant-passenger-ui.js'),app=read('app.js'),html=read('index.html');
assert(ui.includes('function nearbyPeople()')&&ui.includes('ship-talk:'));
assert(app.includes('shipTalk:(id,topic)=>')&&app.includes('service.finishTalk(S,offer)'));
assert(html.indexOf('merchant-shipboard-life.js')<html.indexOf('merchant-passenger-ui.js'));
console.log('living voyage: three moving people, legal map paths, conversation location, real elapsed clock, cooldown and save continuity PASS');
