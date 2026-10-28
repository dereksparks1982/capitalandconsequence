'use strict';
const assert=require('node:assert/strict'),talk=require('../npc-scripted-talk.js');
const asker={id:'madamStar',name:'Madam Star',occupation:'Star Club proprietor'};
const eddie={id:'eddieDoyle',name:'Eddie Doyle',occupation:'Bookmaker'};
const star=talk.answer(asker,'What do you think of the Star Club?');
assert.equal(star.handled,true);assert.match(star.reply,/my establishment/i);
assert.notEqual(star.reply,talk.answer(eddie,'Tell me about the Star Club').reply);
assert.equal(talk.answer({id:'foremanSullivan',name:'Sullivan'},'Is the Star Club worth visiting?').handled,true);
assert.match(talk.answer(eddie,'What is a Corvette?').reply,/don't know what you mean/);
assert.equal(talk.answer(eddie,'Tell me the mayor\'s private diary').handled,false);
assert.match(talk.answer(eddie,'Tell me the mayor\'s private diary').reply,/Couldn't tell you/);
assert.equal(talk.answer(eddie,'Where are we?',{place:'Star Club'}).reply,'We are at Star Club.');
assert.match(talk.answer({id:'alexiRurik',name:'Alexi',language:'ru'},'What is a computer?').reply,/Я не понимаю/);
assert.equal(talk.answer(asker,'What is your name?').reply,'My name is Madam Star.');
console.log('PASS character-specific open questions, Star Club perspectives, ignorance and era boundaries');
const at=(activity='')=>({date:'1878-01-03',place:'National Theatre',activity});
const who=(id)=>({id,name:id,occupation:'Washington resident'});
assert.match(talk.answer(who('charlieWhitcomb'),'what do you do',at()).reply,/I own Federal Electric/);
assert.match(talk.answer(who('samHarlan'),'tell me about your work',at()).reply,/Hillsdale beat/);
assert.match(talk.answer(who('eliCrowe'),'where do you work',at()).reply,/Le Paon d'Or/);
assert.match(talk.answer(who('claraMorris'),'your job',at()).reply,/National Theatre/);
assert.match(talk.answer(who('foremanSullivan'),'where do you live',at()).reply,/rent a small room/);
const live=talk.answer(who('samHarlan'),'what are you doing today',at('walking the Hillsdale beat'));
assert.equal(live.kind,'observed-activity');
assert.match(live.reply,/walking the Hillsdale beat/);
assert.ok(!talk.answer(who('samHarlan'),'what are you doing today',at()).reply.includes('walking the Hillsdale beat'),
 'An unknown activity cannot be invented');
assert.equal(talk.answer(who('edwinBooth'),'meet me tomorrow',at()).kind,'no-unearned-commitment');
assert.equal(talk.answer(who('edwinBooth'),'smartphone',at()).kind,'unknown-era');
assert.match(talk.answer(who('alexiRurik'),'where do you live',at()).reply,/Не знаю/);
console.log('PASS individual work and observed activity, no invented plans, eras, unknown homes');



// Boy Mercer is named, speaks in contradictory first-person boasts, and never
// grants employment, property, money, verified history, or actual appointments.
const boy={id:'boyMercer',name:'Boy Mercer',occupation:'unattached drifter'};
const firstBoy=talk.answer(boy,'Where do you live?',{date:'1878-01-03',history:[]});
const againBoy=talk.answer(boy,'Where do you live?',{date:'1878-01-03',
 history:[{user:'Where do you live?',reply:firstBoy.reply}]});
assert.equal(firstBoy.kind,'boy-mercer-unverified-story');
assert.equal(firstBoy.reliable,false);
assert.notEqual(firstBoy.reply,againBoy.reply,'Boy tells mutually inconsistent accounts');
assert.match(firstBoy.reply,/Willard/);
assert.match(againBoy.reply,/never set foot/i);
assert.equal(talk.answer(boy,'tell me about your job',{history:[]}).kind,'boy-mercer-unverified-story');
assert.equal(talk.answer(boy,'what is a smartphone',{date:'1878-01-03'}).kind,'unknown-era',
 'Boy cannot actually know future technology');
console.log('PASS Boy Mercer knowingly unreliable fictional dialogue with persistent contradictions');
