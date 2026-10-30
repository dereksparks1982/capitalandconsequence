'use strict';
// Exercise the real in-game poker resolver using valid escrow and no fake money.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const cash=require('../cash-custody.js');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
function extract(start,end){
 const i=app.indexOf(start),j=app.indexOf(end,i);
 assert.ok(i>=0&&j>i,'Cannot isolate live poker handler: '+start);
 return app.slice(i,j);
}
const handlers=extract('function pokerSessions(){','function playPokerCircle(')+
 extract('function resolveUnfinishedPoker(token){','const unresolvedPokerResolve=');
const S={pokerSessions:{version:1,pending:[],settled:[]},outcomeEvents:[],notes:[],
 personalCash:100,gameDate:'1878-01-02',turnSerial:1,characterRoute:'industrialist'};
let saves=0,renders=0;
const ctx={S,window:{FE_CASH_CUSTODY:cash,updateCashHeader(){}},
 activeProfileId:()=>'test-profile',pokerCircleName:circle=>({working:'Neighborhood Game',middle:'Commerce Club',elite:'Embassy Room'}[circle]),cash:n=>'$'+Number(n).toFixed(2),
 displayDate:()=>S.gameDate,save(){saves++},render(){renders++}};
vm.createContext(ctx);vm.runInContext(handlers+'\nthis.resolve=resolveUnfinishedPoker;',ctx);
const opened=cash.stake(S,'personal',25,'workingPoker');
assert.equal(opened.ok,true);
S.pokerSessions.pending.push({id:'claimed',profileId:'test-profile',circle:'working',
 stake:25,gameDate:S.gameDate,claimed:true,funding:'personal',custodyTicket:opened.ticket});
assert.equal(S.personalCash,75);
assert.equal(ctx.resolve('claimed'),true);
assert.equal(S.personalCash,75,'A forfeit keeps its already-reserved stake, never debits twice');
assert.equal(ctx.resolve('claimed'),false,'No duplicate forfeiture');
assert.equal(cash.settle(S,opened.ticket,1000).ok,false,'Closed wager cannot pay later');
assert.equal(S.outcomeEvents[0].type,'poker-forfeit');
const undealt=cash.stake(S,'personal',20,'commercePoker');
assert.equal(undealt.ok,true);
assert.equal(S.personalCash,55);
S.pokerSessions.pending.push({id:'undealt',profileId:'test-profile',circle:'middle',
 stake:20,gameDate:S.gameDate,claimed:false,funding:'personal',custodyTicket:undealt.ticket});
assert.equal(ctx.resolve('undealt'),true);
assert.equal(S.personalCash,75,'Undealt poker returns only its own reserved stake');
assert.equal(ctx.resolve('undealt'),false,'Refund cannot duplicate');
assert.equal(cash.settle(S,undealt.ticket,1000).ok,false,'Canceled stake cannot pay out');
assert.equal(S.outcomeEvents[1].type,'poker-undealt-canceled');
assert.equal(S.outcomeEvents.length,2);
assert.equal(S.pokerSessions.pending.length,0);
assert.equal(S.pokerSessions.settled.length,2);
assert.ok(saves>=2&&renders>=2);
console.log('PASS real poker escrow, single forfeit, canceled undealt refund and no replay settlement');
