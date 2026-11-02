'use strict';
const assert=require('node:assert/strict');
const catalog=require('../household-food-catalog.js');
global.FE_FOOD_CATALOG=catalog;
const commerce=require('../washington-commerce.js');
global.FE_WASHINGTON_COMMERCE=commerce;
const needs=require('../character-needs.js');
global.FE_CHARACTER_NEEDS=needs;
const clock={date:'1878-02-05',minuteOfDay:720};
global.FE_WASHINGTON_TIME={now:()=>({...clock}),
 phaseSecondsRemaining:save=>((save.phase==='day'?1020:1320)-clock.minuteOfDay)*60};
const star=require('../star-dining.js');
const mk=()=>({
 characterRoute:'industrialist',gameDate:'1878-02-05',phase:'day',paused:false,
 currentLocation:{locationId:'star',roomId:'dining-room'},personalCash:5,
 notes:[],worldCalendarStatus:'ready',
 worldCalendar:{worldMinute:Math.floor(Date.parse('1878-02-05T12:00:00Z')/60000)}
});
const s=mk(),place={locationId:'star',roomId:'dining-room'};
const before=JSON.stringify(s);
assert.equal(star.remaining(s,'1878-02-05','tea-and-bread'),12);
assert.equal(star.preview(s,'tea-and-bread',place).ok,true);
assert.equal(JSON.stringify(s),before,'Looking at menu cannot charge money or create stock');
assert.equal(star.preview(s,'tea-and-bread',{locationId:'star',roomId:'brandy-room'}).ok,false,
 'Brandy Room cannot bypass Dining Room service');
assert.equal(star.preview({...s,currentLocation:{locationId:'factory',roomId:'workshop'}},'tea-and-bread',place).ok,false);
assert.equal(star.preview({...s,personalCash:.02},'tea-and-bread',place).ok,false);
assert.equal(star.transact(s,{menuId:'tea-and-bread',token:'star:wrong:1',
 spentSeconds:0,date:'1878-02-05',...place}).ok,false,'No meal with missing elapsed time');
assert.equal(JSON.stringify(s),before);
const can=star.preview(s,'tea-and-bread',place);
clock.minuteOfDay+=can.seconds/60;
s.worldCalendar.worldMinute+=can.seconds/60;
const first=star.transact(s,{menuId:'tea-and-bread',token:'star:meal:1',
 spentSeconds:can.seconds,date:can.date,...place});
assert.equal(first.ok,true,first.reason);
assert.equal(first.elapsedSeconds,1200);
assert.equal(s.personalCash,4.82,'Pay personal treasury only');
assert.equal(s.washingtonCommerce.accounts['star:dining'],18,'Same merchant ledger captures cafe sale');
assert.equal(star.remaining(s,'1878-02-05','tea-and-bread'),11);
assert.equal(s.characterNeeds.meters.hunger,100,'Meal nourishes using existing hunger meters');
assert.equal(s.characterNeeds.meters.thirst,100);
const charged=JSON.stringify(s);
assert.equal(star.transact(s,{menuId:'tea-and-bread',token:'star:meal:1',
 spentSeconds:can.seconds,date:can.date,...place}).repeated,true);
assert.equal(JSON.stringify(s),charged,'Replay does not duplicate meal or cafe income');
assert.equal(star.preview(s,'roast-beef',place).ok,false,'Meal cooldown cannot be sidestepped by ordering another dish');
clock.minuteOfDay+=31;s.worldCalendar.worldMinute+=31;
assert.equal(star.preview(s,'roast-beef',place).ok,true);
const secondCan=star.preview(s,'roast-beef',place);
clock.minuteOfDay+=secondCan.seconds/60;s.worldCalendar.worldMinute+=secondCan.seconds/60;
const second=star.transact(s,{menuId:'roast-beef',token:'star:meal:2',
 spentSeconds:secondCan.seconds,date:secondCan.date,...place});
assert.equal(second.ok,true);
assert.equal(s.washingtonCommerce.accounts['star:dining'],85);
assert.equal(star.remaining(s,'1878-02-05','roast-beef'),7);
const reload=JSON.parse(JSON.stringify(s));
assert.equal(star.read(reload).history.length,2);
assert.equal(star.remaining(reload,'1878-02-05','tea-and-bread'),11);
assert.equal(star.preview({...reload,starDining:{...reload.starDining,
 days:{'1878-02-05':{portions:{'tea-and-bread':0}}}}},'tea-and-bread',place).ok,false,
 'One finite kitchen dish sold out, not replaced by infinite free portions');
const other=mk();other.personalCash=5;
clock.minuteOfDay=720;
assert.equal(star.remaining(other,'1878-02-05','tea-and-bread'),12,'Different save is private');
clock.minuteOfDay=1006;s.phase='day';s.worldCalendar.worldMinute+=100;
assert.equal(star.preview(s,'tea-and-bread',place).ok,false,'Dinner cannot cross 5 PM phase boundary');
clock.minuteOfDay=1306;s.phase='night';
assert.equal(star.preview(s,'tea-and-bread',place).ok,false,'Venue service cannot cross 10 PM closing');
s.paused=true;clock.minuteOfDay=750;
assert.equal(star.preview(s,'tea-and-bread',place).ok,false,'Paused character cannot buy meals');
console.log('PASS Star Club finite paid in-room dining, real needs, personal treasury to merchant till, saved cooldown, date, time, replay and private room guards');
