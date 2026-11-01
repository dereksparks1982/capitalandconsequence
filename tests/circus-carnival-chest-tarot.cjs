'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const tour=require('../circus-tour.js'),game=require('../circus-carnival.js'),tarot=require('../tarot-deck.js'),interpret=require('../tarot-interpretation.js');
const at=Math.floor(Date.UTC(1878,4,4,12)/60000);
global.FederalElectricCity={listLocations:()=>[{id:'races',name:'Capital Race Grounds'}]};
global.FE_CIRCUS_TOUR=tour;
const S={worldCalendarStatus:'ready',worldCalendar:{worldMinute:at},characterRoute:'industrialist',gameDate:'1878-05-04',
 currentLocation:{locationId:'races',roomId:'grounds'},personalCash:20,companyCash:88,
 characterNeeds:{meters:{health:80,energy:23}},medicalRecords:{patients:{'player:industrialist':{collapses:2}}}};
const event=tour.active(S);
assert.ok(event&&event.locationId==='races','spring circus is actually in town at Capital Race Grounds');
assert.equal(tour.attended(S),false);
assert.ok(game.available(S));
const original=S.personalCash;
assert.ok(game.start(S,'not-a-booth').ok===false);
assert.equal(S.personalCash,original);
const started=game.start(S,'rings');
assert.equal(started.ok,true);
assert.equal(S.personalCash,original-.05);
assert.equal(game.start(S,'balloons').ok,false,'no second paid game while one is unfinished');
let awarded=[],throws=0,result=null;
for(let i=0;i<game.GAMES.rings.attempts;i++){
 const hint=game.preview(game.ensure(S).active);
 assert.ok(['left side','middle','right side'].includes(hint.zone));
 // Actively choose a peg with visual information rather than RNG alone.
 const choice=hint.zone==='left side'?0:hint.zone==='middle'?2:4;
 result=game.throwAt(S,choice,item=>{awarded.push(item);return {ok:true}});
 assert.ok(result.ok);throws++;
}
assert.equal(throws,3);assert.equal(result.finished,true);
assert.equal(game.ensure(S).active,null);
assert.equal(game.ensure(S).history.length,1);
assert.equal(S.personalCash,original-.05,'round and prize never debit twice');
assert.ok(game.throwAt(S,0,()=>{throw Error('Should not grant twice')}).ok===false);
for(const key of Object.keys(game.GAMES)){
 assert.ok(game.GAMES[key].attempts>=3);
 assert.ok(game.GAMES[key].feeCents>0);
}
assert.ok(tour.attend(S,event.id).ok);
assert.equal(tour.attended(S),true);
S.currentLocation={locationId:'home',roomId:'bedroom'};
assert.equal(game.start(S,'cans').ok,false,'no carnival game can start remotely');
const registry={S,window:{},document:{},activeProfileId:()=> 'profile-1',currentCityLocation:()=>S.currentLocation,save:()=>true};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../personal-effects.js'),'utf8'),registry);
const effects=registry.window.FE_PERSONAL_EFFECTS;
assert.equal(effects.containers['bedroom-chest'].room,'bedroom');
const item={id:'midway-test-prize',name:'Painted Wooden Horse',kind:'collectible',description:'Won at the show'};
assert.equal(effects.acquire(item).ok,true);
assert.equal(effects.transfer(item.id,'bedroom-chest').ok,true);
assert.equal(effects.list('bedroom-chest').length,1);
assert.equal(effects.carried().length,0);
assert.equal(effects.transfer(item.id,'left-pocket').ok,true);
S.currentLocation={locationId:'races',roomId:'grounds'};
assert.equal(effects.transfer(item.id,'bedroom-chest').ok,false,'cannot teleport belongings home');
assert.equal(effects.list('bedroom-chest').length,0,'cannot remotely inspect locked chest');
const before=S.personalCash;
const sitting=tarot.reading(S,{readerId:'visiting-fortune-teller',encounterId:'circus-reading-May-04',feeCents:10});
assert.equal(sitting.ok,true);
assert.equal(S.personalCash,before-.1);
const first=interpret.interpret(S,sitting.session);
assert.equal(first.ok,true);
assert.equal(first.reading.passages.length,3);
assert.ok(first.reading.focus.includes('repeated'),'life-history collapse must affect reading');
assert.equal(first.reading.characterRoute,'industrialist');
assert.match(first.reading.intro,/shuffles, cuts the deck and draws the cards herself/i);
S.characterNeeds.meters.energy=100;
assert.deepEqual(interpret.interpret(S,sitting.session).reading,first.reading,'stored reading does not rewrite the past');
assert.equal(tarot.reading(S,{readerId:'visiting-fortune-teller',encounterId:'circus-reading-May-04',feeCents:10}).replayed,true);
assert.equal(S.personalCash,before-.1,'no charge to replay a prior reading');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert.match(app,/FE_BEDROOM_CHEST\?\.render/);
assert.match(app,/FE_CARNIVAL_UI\?\.render/);
assert.match(app,/FE_TAROT_WAGON_UI\?\.render/);
assert.match(html,/circus-carnival\.js\?v=/);
assert.match(html,/bedroom-chest-ui\.js\?v=/);
console.log('PASS six midway games, paid attempts, lasting prizes, home-only chest, fortune teller draws and personal saved readings');
