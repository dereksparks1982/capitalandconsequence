'use strict';
/* Historical Washington character condition and break-spam regression.
 * Pure JS, offline, no browser, no extra game clock or Actions. */
const assert=require('node:assert/strict');
const needs=require('../character-needs.js');
const start=Math.floor(Date.parse('1878-01-02T08:00:00Z')/60000);
function save(){
 return {worldCalendarStatus:'ready',worldCalendar:{worldMinute:start},paused:false,
  characterRoute:'industrialist',personalCash:600};
}
const s=save();
assert.equal(needs.minute(s),start);
const created=needs.ensure(s);
assert.deepEqual(created.meters,{hunger:82,thirst:85,energy:80,health:100});
assert.equal(created.lastMinute,start);
assert.equal(needs.sync(s).events.length,0);
const snapshot=JSON.stringify(s);
needs.sync(s);assert.equal(JSON.stringify(s),snapshot,'same-minute sync must never drain needs');
const first=needs.availability(s,'coffee');
assert.equal(first.ok,true,'first coffee is allowed');
assert.equal(needs.take(s,'coffee','executive-office').ok,true);
assert.equal(needs.availability(s,'water').ok,false,'switching items must not bypass shared break cooldown');
assert.equal(needs.availability(s,'rest').remaining,90);
assert.equal(needs.take(s,'water','factory-break-room').ok,false,'factory and desk use same state');
s.worldCalendar.worldMinute+=90;
assert.equal(needs.availability(s,'water').ok,true,'water available after shared cooldown');
assert.equal(needs.availability(s,'coffee').ok,false,'coffee still on its own three-hour cooldown');
assert.equal(needs.take(s,'water','factory-break-room').ok,true);
assert.equal(s.characterNeeds.meters.thirst<=100,true,'thirst restoration bounded');
assert.equal(needs.availability(s,'snack').ok,false,'after factory water desk snack must wait');
assert.equal(needs.take(s,'snack','executive-office').ok,false);
s.worldCalendar.worldMinute+=90;
assert.equal(needs.availability(s,'coffee').ok,true);
assert.equal(needs.take(s,'snack','executive-office').ok,true);
const restored=JSON.parse(JSON.stringify(s));
assert.equal(needs.availability(restored,'rest').ok,false,'save/load preserves shared cooldown');
assert.equal(needs.availability(restored,'snack').ok,false,'save/load preserves specific cooldown');
assert.equal(restored.characterNeeds.entries.length,3);
assert.equal(restored.characterNeeds.entries[1].source,'factory-break-room');
assert.match(needs.status(restored,'rest'),/Available at/);
assert.notEqual(needs.formatClock(start),'unknown','1878 dates use negative Unix minutes, still valid');
assert.equal(needs.formatClock(start),'8:00 AM');
assert.equal(needs.formatClock(start+300),'1:00 PM');
assert.equal(needs.formatDuration(90),'1h 30m');
const hungry=save();needs.ensure(hungry);
hungry.worldCalendar.worldMinute+=360;
const firstAlerts=needs.sync(hungry).events.map(e=>e.kind);
assert.ok(firstAlerts.includes('hunger'));
assert.ok(firstAlerts.includes('thirst'));
assert.equal(firstAlerts.includes('energy'),false,'fatigue has a slower warning threshold');
assert.equal(needs.sync(hungry).events.length,0,'warnings do not spam every second');
hungry.worldCalendar.worldMinute+=60;
assert.equal(needs.sync(hungry).events.length,0,'warnings do not spam each minute');
hungry.worldCalendar.worldMinute+=180;
assert.deepEqual(needs.sync(hungry).events.map(e=>e.kind),['energy'],
 'fatigue warning arrives later and only once');
assert.equal(needs.sanitize({version:1,meters:{hunger:200,thirst:-44,energy:NaN},
 lastMinute:start,sharedUntil:start+90,cooldowns:{coffee:start+180},entries:[]},start).meters.hunger,100);
const legacy=save();legacy.characterNeeds={version:999,meters:{hunger:-100}};
assert.equal(needs.ensure(legacy).meters.hunger,82,'older/broken saves migrate without fake starvation');
const injury=save();needs.ensure(injury);
assert.equal(needs.applyInjury(injury,32,'sparring').health,68);
assert.equal(needs.treat(injury,12,'hospital').health,80);
const severe=save();needs.ensure(severe);severe.worldCalendar.worldMinute+=1200;needs.sync(severe);
assert.ok(severe.characterNeeds.meters.health<100,'prolonged deprivation damages health');
assert.ok(severe.characterNeeds.meters.health>=0);
const legacyNeeds=needs.sanitize({version:1,meters:{hunger:51,thirst:46,energy:79}},start);
assert.equal(legacyNeeds.meters.health,100,'old saves gain safe full health');
const slept=save();needs.ensure(slept);
slept.characterNeeds.meters.energy=4;slept.characterNeeds.meters.hunger=15;slept.characterNeeds.meters.thirst=14;
slept.worldCalendar.worldMinute+=1440;
needs.overnight(slept);
assert.equal(slept.characterNeeds.meters.energy,90,'sleep restores energy');
assert.equal(slept.characterNeeds.meters.hunger,15,'sleep is not a meal');
assert.equal(slept.characterNeeds.meters.thirst,14,'sleep does not provide water');
assert.equal(needs.sync(slept).events.length,2,'overnight skips time decay; low needs notify next morning');
const unmapped={worldCalendarStatus:'legacy-unmapped',worldCalendar:null};
assert.equal(needs.availability(unmapped,'water').ok,false,'unknown calendar never fakes passage of time');
console.log('PASS dated conditions, 1878 time math, break cooldowns across desk/factory, saved restoration and one-time warnings');
