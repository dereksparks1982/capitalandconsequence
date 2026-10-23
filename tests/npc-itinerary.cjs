'use strict';
const assert=require('node:assert/strict'),clock=require('../world-clock.js');
const itinerary=require('../npc-itinerary.js');
const worker={id:'foremanSullivan',places:['factory','factory',null,null],
 activities:['preparing','overseeing',null,null]};
let s={worldCalendarStatus:'ready',worldCalendar:clock.create('1890-01-03T08:30')};
let w=itinerary.next(worker,s);
assert.equal(w.locationId,'factory');assert.equal(w.ongoing,true);
assert.equal(w.from,clock.parseMinute('1890-01-03T08:00'));
s.worldCalendar=clock.create('1890-01-05T08:30'); // Sunday, no foreman at factory.
w=itinerary.next(worker,s);
assert.equal(w.iso,'1890-01-06T08:00');assert.equal(w.ongoing,false);
const police={id:'inspectorHayes',places:['metropolitanPolice','metropolitanPolice','washingtonArena',null],
 activities:['reports','office','arena',null]};
assert.equal(itinerary.publicPlace(police,6,0),null);
assert.equal(itinerary.publicPlace(police,5,2),'washingtonArena');
const star={id:'madamStar',places:['star','star','star','star'],activities:['open','open','party','late']};
s.worldCalendar=clock.create('1890-01-04T01:30');
w=itinerary.next(star,s);
assert.equal(w.iso,'1890-01-03T22:00','Overnight presence belongs to yesterday');
assert.equal(w.untilIso,'1890-01-04T08:00');
assert.equal(w.ongoing,true);
assert.ok(itinerary.label(w.from).includes('10:00 PM'));
assert.equal(itinerary.next(worker,{worldCalendarStatus:'legacy-unmapped',worldCalendar:null}),null);
assert.equal(itinerary.next(worker,{worldCalendarStatus:'ready',worldCalendar:clock.create('1890-01-03T07:59')}).iso,'1890-01-03T08:00');
const restart=JSON.parse(JSON.stringify(s));
assert.deepEqual(itinerary.next(star,restart),itinerary.next(star,s));
assert.throws(()=>itinerary.windows(star,s.worldCalendar,15));
assert.throws(()=>itinerary.publicPlace({},1,1));
console.log('PASS NPC familiar public itineraries, weekend absences and overnight windows');
