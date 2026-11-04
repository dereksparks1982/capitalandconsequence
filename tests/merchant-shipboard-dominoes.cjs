'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ship=require('../merchant-shipboard.js'),sea=require('../merchant-passenger-sea.js');
const domino=require('../merchant-shipboard-dominoes.js');
const now=Math.floor(Date.parse('1878-03-10T09:00:00Z')/60000);
function voyage(){
 const s={characterRoute:'industrialist',phase:'day',paused:false,gameDate:'1878-03-10',
  personalCash:500,companyCash:2500,currentLocation:{locationId:'potomacFishingBank',roomId:'passenger-pier'},
  worldCalendarStatus:'ready',worldCalendar:{worldMinute:now}};
 const boarded=sea.embark(s,'Liverpool','schooner');assert(boarded.ok,boarded.reason);
 const interior=ship.ensure(s);interior.deck='lower';interior.x=3;interior.y=4;
 assert(ship.at(s,'cards'));return s;
}
const s=voyage(),cash=s.personalCash,company=s.companyCash,clock=s.worldCalendar.worldMinute;
assert(domino.offer(s,'start').ok);
assert(domino.act(s,'start').ok);
let d=domino.ensure(s),h=d.hand;
assert.equal(h.player.length,7);assert.equal(h.opponent.length,7);assert.equal(h.boneyard.length,14);
const bones=[...h.player,...h.opponent,...h.boneyard];
assert.equal(new Set(bones.map(b=>b.a+':'+b.b)).size,28,'complete unique double-six set');
assert.equal(new Set(bones.flatMap(b=>[b.a,b.b])).size,7,'pips zero through six included');
assert(!domino.offer(s,'start').ok,'cannot start a second unfinished hand');
const original=JSON.stringify(h);
assert(!domino.offer(s,'play',999,'left').ok,'reject invalid index');
assert(!domino.offer(s,'draw').ok,'cannot draw from a fully playable opening hand');
assert(!domino.offer(s,'pass').ok,'cannot pass an opening hand');
assert.equal(JSON.stringify(h),original,'failed offers do not mutate the hand');
assert(domino.offer(s,'play',0,'left').ok);
assert(domino.act(s,'play',0,'left').ok);
assert.equal(h.chain.length>=1,true,'table begins to populate');
assert.equal(h.player.length,6,'player spent one bone');
assert.equal(s.worldCalendar.worldMinute,clock,'game engine does not advance an independent clock');
assert.equal(s.personalCash,cash,'no personal gambling wagers');
assert.equal(s.companyCash,company,'no company money');
const restored=JSON.parse(JSON.stringify(s));
assert.deepEqual(domino.ensure(restored).hand,domino.ensure(s).hand,'save/load preserves a live hand');
let turns=0;
while(h.status==='playing'&&turns++<240){
 const index=h.player.findIndex(b=>domino.options(h,b).length);
 const kind=index>=0?'play':h.boneyard.length?'draw':'pass';
 const side=index>=0?domino.options(h,h.player[index])[0]:undefined;
 const offer=domino.offer(s,kind,index,side);assert(offer.ok,offer.reason);
 const result=domino.act(s,kind,index,side);assert(result.ok,result.reason);
}
assert.notEqual(h.status,'playing','double-six hand must terminate');
assert.equal(d.history.length,1,'one settled hand produces one history entry');
assert.equal(s.companyCash,company);assert.equal(s.personalCash,cash);
assert.equal(s.worldCalendar.worldMinute,clock);
assert(!domino.offer(s,'play',0,'left').ok,'settled hand cannot be changed');
assert(domino.offer(s,'start').ok,'may start a new hand after finishing');
assert(domino.act(s,'start').ok);
assert(domino.resign(s).ok);assert.equal(d.history.length,2);
assert.equal(d.hand.status,'resigned');
const b=voyage();const blocked=domino.ensure(b);
blocked.hand={id:1,player:[{a:0,b:1}],opponent:[{a:2,b:3}],
 boneyard:[],chain:[{a:6,b:6}],left:6,right:6,status:'playing',turns:5,
 consecutivePasses:0,startedMinute:now,endedMinute:null,reason:null};
assert(domino.offer(b,'pass').ok);
assert(domino.act(b,'pass').ok);
assert.equal(blocked.hand.status,'won','lowest pip count wins blocked match');
assert.equal(blocked.history[0].reason,'Both players blocked; lowest pip count wins.');
const foreign=JSON.parse(JSON.stringify(s));foreign.currentLocation={locationId:'foreignHarbor'};
assert.equal(domino.ensure(foreign),null,'no table after disembarking');
assert(!domino.offer(foreign,'start').ok);
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ui=read('merchant-passenger-ui.js'),app=read('app.js'),html=read('index.html');
assert(ui.includes('function shipDominoes()')&&ui.includes("ship-domino:play:"));
assert(app.includes('shipDomino:(kind,index,side)=>')&&app.includes("advanceWorldSimulation(offer.seconds,true,'passenger-shipboard')"));
assert(html.indexOf('merchant-shipboard-dominoes.js')<html.indexOf('merchant-passenger-ui.js'));
assert(read('merchant-shipboard.js').includes("dominoes?.hand?.status==='playing'"));
assert(read('merchant-shipboard-checkers.js').includes("dominoes?.hand?.status==='playing'"));
console.log('passenger dominoes PASS: lawful draw/play/pass, blocking, saved hands, no cash/clock mutation, UI/action hooks');