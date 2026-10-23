'use strict';
const assert=require('node:assert/strict'),language=require('../npc-language.js'),social=require('../npc-social.js');
const alexi={id:'alexiRurik',language:'ru',traits:{caution:78}};
const pavel={id:'pavelOrlov',languages:['en','ru'],traits:{caution:69}};
const chen={id:'chenMei',traits:{caution:72}};
assert.deepEqual(language.spoken(alexi),['ru']);
assert.deepEqual(language.spoken(pavel),['en','ru']);
assert.deepEqual(language.spoken(chen),['en']);
assert.equal(language.common(alexi,chen),null,'Russian-only witness cannot instantly share English hearsay');
assert.equal(language.common(alexi,pavel),'ru');
assert.equal(language.common(pavel,chen),'en');
assert.equal(language.understands(alexi,'en'),false);
assert.equal(language.understands(pavel,'ru'),true);
assert.deepEqual(language.spoken({languages:['en','ru','en','BAD']}),['en','ru']);
function agent(){return {locationId:'russianTradeHall',roomId:'main-room',status:'present',relationships:{}}}
function world(seed){return {seed,agents:{alexiRurik:agent(),pavelOrlov:agent(),chenMei:agent()},events:[]}}
const ctx={key:'1890-01-03|2',date:'1890-01-03',turn:1};
for(let seed=1;seed<30;seed++){
 const isolated=world(seed);const before=social.meet(isolated,[alexi,chen],ctx);
 assert.equal(before.length,0,'No conversational relationship from no shared language');
 const together=world(seed),after=social.meet(together,[alexi,pavel],ctx);
 if(after.length){
  assert.equal(after[0].actorId,'alexiRurik');
  assert.equal(after[0].partnerId,'pavelOrlov');
  assert.ok(together.agents.alexiRurik.social.encounters>=1);
  break;
 }
 if(seed===29)throw Error('Expected some bilingual conversations across thirty deterministic periods');
}
console.log('PASS Russian speech barrier, bilingual intermediary and saved in-room social compatibility');
