'use strict';
const assert=require('node:assert/strict');
const weekly=require('../npc-weekly-schedule.js');
const calendar=require('../npc-calendar.js');
const itinerary=require('../npc-itinerary.js');
const economy=require('../npc-economy.js');
const clock=require('../world-clock.js');
const worker={id:'foremanSullivan',traits:{caution:81},
 places:['factory','factory',null,null],activities:['work','work',null,null]};
const star={id:'madamStar',places:['star','star','star','star'],
 activities:['opening','visiting','receiving guests','closing']};
const at=(date,weekday,minuteOfDay)=>({date,weekday,minuteOfDay});
assert.equal(weekly.segments.length,7);
assert.equal(weekly.registered.length,16);
assert.equal(weekly.atMinute(worker,6,730).locationId,'oldChinatown','Sullivan shopping location');
const boy={id:'boyMercer',places:['races','oldChinatown','workingPoker',null],activities:['boasting','chatting','talking',null]};
assert.equal(weekly.atMinute(boy,1,600).locationId,'races','Boy is out at the grounds during the morning');
assert.equal(weekly.atMinute(boy,1,790).locationId,'oldChinatown','Boy visits a market in the afternoon');
assert.equal(weekly.atMinute(boy,1,1200).locationId,'workingPoker','Boy seeks listeners among the card-room crowd');

assert.equal(weekly.atMinute(worker,6,730).activity,'shopping for weekly necessities');
assert.equal(calendar.signature(at('1890-01-03',5,599)),'1890-01-03|0');
assert.equal(calendar.signature(at('1890-01-03',5,600)),'1890-01-03|0@600');
assert.equal(calendar.signature(at('1890-01-03',5,720)),'1890-01-03|1');
assert.equal(calendar.signature(at('1890-01-03',5,750)),'1890-01-03|1@750');
assert.equal(calendar.signature(at('1890-01-03',5,1170)),'1890-01-03|2@1170');
assert.equal(calendar.signature(at('1890-01-03',5,1320)),'1890-01-03|3');
assert.equal(calendar.signature(at('1890-01-04',6,90)),'1890-01-03|3',
 '1 AM belongs to the prior evening, not a second household period');
const lunch=calendar.at(at('1890-01-03',5,720),worker);
const afternoon=calendar.at(at('1890-01-03',5,750),worker);
assert.equal(lunch.activity,'taking a meal at the workshop');
assert.equal(afternoon.activity,'finishing ordered parts for dispatch');
assert.equal(lunch.economyKey,afternoon.economyKey,
 'No new wage or shopping period at 12:30');
assert.equal(calendar.at(at('1890-01-04',6,720),worker).locationId,'oldChinatown',
 'Sullivan shops on Saturday rather than taking a factory shift');
assert.equal(calendar.at(at('1890-01-05',0,720),worker).locationId,null,
 'Sunday is an actual day off');
const actor={};
const args=p=>({date:p.day,key:p.economyKey,slot:p.slot,weekday:p.weekday,seed:31,
 defaultLocation:p.locationId,defaultActivity:p.activity,rest:false});
assert.equal(economy.actionFor(worker,actor,args(lunch)).repeated,false);
assert.equal(economy.actionFor(worker,actor,args(afternoon)).repeated,true);
assert.equal(actor.economy.shiftsWorked,1,'Work cannot pay twice when routine changes');
const reloaded=JSON.parse(JSON.stringify(actor));
assert.equal(economy.actionFor(worker,reloaded,args(afternoon)).repeated,true);
assert.equal(reloaded.economy.shiftsWorked,1,'Save reload cannot settle the same work again');
let world={worldCalendarStatus:'ready',worldCalendar:clock.create('1890-01-03T08:30')};
assert.equal(itinerary.next(worker,world).iso,'1890-01-03T08:00');
world.worldCalendar=clock.create('1890-01-04T01:30');
assert.equal(itinerary.next(star,world).iso,'1890-01-03T22:00');
assert.equal(itinerary.next(star,world).untilIso,'1890-01-04T08:00');
world.worldCalendar=clock.create('1890-01-05T08:30');
assert.equal(itinerary.next(worker,world).iso,'1890-01-06T08:00');
for(const id of weekly.registered){
 const def={id,places:['factory','factory',null,null],activities:['work','work',null,null]};
 for(let day=0;day<7;day++)for(const m of [0,479,480,599,600,719,720,749,750,1019,1020,1169,1170,1319,1320,1439]){
  const plan=weekly.atMinute(def,day,m);
  assert.ok(plan.locationId===null||typeof plan.locationId==='string');
  assert.ok(Number.isInteger(plan.slot)&&plan.slot>=0&&plan.slot<=3);
 }
}
assert.throws(()=>weekly.atMinute(worker,1,-1));
assert.throws(()=>weekly.atMinute(worker,7,720));
console.log('PASS 16 NPC seven-window routines, no second shift, overnight, weekends and public itinerary');
