'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../tabletop-checkers.js'),AI=require('../vendor/rapid-draughts-ai/search.js');
const p=()=>C.fresh();
const board=()=>Array(64).fill(null);
assert.equal(C.initial().filter(Boolean).length,24,'American draughts has twelve players on each side');
assert.equal(C.options(p()).length,7,'Opening red side has seven legal diagonal moves');
for(const [place,room] of [['hillsdale','neighborhood-street'],['workingPoker','card-room'],
 ['commercePoker','club-room'],['russianTradeHall','meeting-hall'],
 ['universityMaryland','engineering-hall']])
 assert.equal(C.venue(place,room),true,'Only a registered tabletop location may host checkers: '+place);
assert.equal(C.venue('star','star-room'),false,'No unscheduled table appears at the Star Club');
assert.equal(C.venue('russianTradeHall','office'),false,'Checkers cannot appear in an unregistered room');
assert.equal(typeof AI.choose,'function');
for(const depth of [2,3,4,5]){
 const game=p();game.turn='b';
 const move=AI.choose(game,{options:C.options,apply:C.apply,depth,seed:'level-'+depth,limit:16000});
 assert.ok(C.options(game).some(x=>x.from===move.from&&x.to===move.to),'Every AI difficulty makes legal moves');
}
{
 const pos=p();pos.board=board();pos.board[40]='r';pos.board[33]='b';pos.board[19]='b';pos.board[5]='b';
 assert.deepEqual(C.options(pos),[{from:40,to:26,capture:33}],'Mandatory jump removes all regular moves');
 assert.equal(C.apply(pos,40,26).continues,true);
 assert.equal(pos.forced,26);
 assert.deepEqual(C.options(pos),[{from:26,to:12,capture:19}]);
 assert.equal(C.apply(pos,26,12).continues,false);
 assert.equal(pos.turn,'b');assert.equal(pos.board[33],null);assert.equal(pos.board[19],null);
}
{
 const pos=p();pos.board=board();pos.board[8]='r';pos.board[10]='b';pos.board[21]='r';
 const initial=C.options(pos);assert.ok(initial.some(m=>m.from===8&&m.to===1));
 const result=C.apply(pos,8,1);assert.equal(result.ok,true);
 assert.equal(pos.board[1],'R');assert.equal(pos.forced,null);assert.equal(pos.turn,'b','Crowning finishes the turn');
}
{
 const pos=p();pos.board=board();pos.board[26]='R';pos.board[17]='b';
 const opts=C.options(pos);
 assert.ok(opts.some(x=>x.from===26&&x.to===8&&x.capture===17),'Kings capture toward the far side');
}
const table={locationId:'hillsdale',roomId:'neighborhood-street'};
const at=[{id:'sam',name:'Sam',roomId:table.roomId}];
const save={gameDate:'1878-01-02',phase:'day',characterRoute:'industrialist',checkersAiDepth:4};
assert.equal(C.start(save,{...table,playerId:'p1',opponentId:'sam',present:[]}).ok,false,'No remote challenger');
const opened=C.start(save,{...table,playerId:'player:p1',playerName:'Charles',
 opponentId:'sam',opponentName:'Sam',present:at});
assert.equal(opened.ok,true);
assert.equal(save.checkersCircuit.active.aiDepth,4);
const m=C.options(save.checkersCircuit.active.position)[0];
const reply=C.play(save,m.from,m.to,{...table,present:at,at:'1878-01-02T09:15'});
assert.equal(reply.ok,true);assert.ok(reply.opponent.length>0,'Real NPC answers using alpha-beta');
assert.equal(save.checkersCircuit.active.position.turn,'r');
const surrendered=C.abandon(save);
assert.equal(surrendered.winnerId,'sam');assert.equal(C.abandon(save),null,'No duplicate result on leaving');
assert.equal(save.checkersCircuit.records['player:p1'].losses,1);
const here={id:'visitorA',name:'Visitor A',roomId:table.roomId};
const there={id:'visitorB',name:'Visitor B',roomId:table.roomId};
const presentAt=id=>id==='hillsdale'?[here,there]:[];
const npc={gameDate:'1878-01-02',worldCalendar:{worldMinute:1000}};
assert.equal(C.tick(npc,{now:{iso:'1878-01-02T08:00',date:'1878-01-02'},presentAt}).started,1);
assert.equal(C.tick(npc,{now:{iso:'1878-01-02T08:00',date:'1878-01-02'},presentAt}).started,0);
npc.worldCalendar.worldMinute+=12;
assert.equal(C.tick(npc,{now:{iso:'1878-01-02T08:12',date:'1878-01-02'},presentAt}).settled,1);
assert.equal(npc.checkersCircuit.results.length,1);
assert.ok(npc.checkersCircuit.results[0].moves.length>5,'NPC match contains actual legal history');
assert.equal(C.tick(npc,{now:{iso:'1878-01-02T08:12',date:'1878-01-02'},presentAt}).settled,0);
const absent={gameDate:'1878-01-02',worldCalendar:{worldMinute:1000}};
C.tick(absent,{now:{iso:'1878-01-02T08:00',date:'1878-01-02'},presentAt});
absent.worldCalendar.worldMinute+=12;
C.tick(absent,{now:{iso:'1878-01-02T08:12',date:'1878-01-02'},presentAt:()=>[here]});
assert.equal(absent.checkersCircuit.results.length,0);
assert.equal(absent.checkersCircuit.fixtures['1878-01-02:hillsdale:neighborhood-street'].status,'cancelled');
const shared=require('../shared-world.js');
const calendar=require('../world-clock.js');
const campaign={sharedWorldId:'wCheckersAI',characterRoute:'industrialist',gameDate:'1878-01-02',
 phase:'day',worldCalendar:calendar.create('1878-01-02T09:00'),checkersCircuit:JSON.parse(JSON.stringify(npc.checkersCircuit))};
campaign.checkersCircuit.active={id:'private-match',opponentId:'sam',playerId:'player:p1'};
const world=shared.capture(campaign,shared.create(campaign.sharedWorldId,campaign),'p1');
assert.equal(world.checkersCircuit.active,null,'Shared world never exposes a private turn');
assert.equal(world.checkersCircuit.results.length,1);
const sam={sharedWorldId:'wCheckersAI'};
shared.attach(sam,world);
assert.equal(sam.checkersCircuit.active,null);assert.equal(sam.checkersCircuit.results.length,1);
shared.attach(campaign,world);
assert.equal(campaign.checkersCircuit.active.id,'private-match','Owner resumes private table');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const i1=html.indexOf('vendor/rapid-draughts-ai/search.js?'),i2=html.indexOf('tabletop-checkers.js?'),
 i3=html.indexOf('app.js?'),i4=html.indexOf('tabletop-checkers-ui.js?');
assert.ok(i1>0&&i1<i2&&i2<i3&&i4>i3,'Offline AI must load before checkers, after which room UI loads');
assert.ok(html.includes('tabletop-checkers.css?'),'Original overhead physical board stylesheet present');
const license=fs.readFileSync(path.join(__dirname,'..','vendor/rapid-draughts-ai/LICENSE'),'utf8');
assert.ok(license.includes('Copyright (c) 2023 loks0n'),'Actual original MIT license retained');
console.log('PASS checkers alpha-beta AI, legal rules/multiple jumps/crowning, scheduled NPC matches, shared-world privacy and offline licensing');
