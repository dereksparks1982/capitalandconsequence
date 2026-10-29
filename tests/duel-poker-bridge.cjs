'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const duels=require('../duel-engine.js');
const begin=src.indexOf('window.FE_POKER_SETTLE=(token,circle,');
const end=src.indexOf('function unresolvedPoker()',begin);
assert.ok(begin>=0&&end>begin,'Poker settlement source must be integrated');
const settlement=src.slice(begin,end);
const save={gameDate:'1878-03-12',turnSerial:12,notes:[],outcomeEvents:[],
 pokerSessions:{pending:[{id:'rude-1',circle:'working',profileId:'profile1',
 claimed:true,stake:25,custodyTicket:'ticket1'},
 {id:'normal-1',circle:'middle',profileId:'profile1',claimed:true,stake:100,custodyTicket:'ticket2'}],
 settled:[]}};
let saved=0,refreshes=0,results=[];
const context={
 S:save,window:{FE_DUELS:duels,FE_DUEL_UI:{refresh(){refreshes++}},
 FE_CASH_CUSTODY:{settle:()=>({ok:true})},updateCashHeader(){}},
 pokerSessions:()=>save.pokerSessions,
 activeProfileId:()=> 'profile1',
 recordPokerResult:(...args)=>results.push(args),
 clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),
 displayDate:()=>save.gameDate,
 save:()=>{saved++;return true},
 console:{warn(){}},
};
vm.runInNewContext(settlement,context);
assert.equal(context.window.FE_POKER_SETTLE('rude-1','working',4,2,33,'rude'),true);
assert.equal(duels.pendingAt(save,'workingPoker').opponent,'Mickey Dunn');
assert.equal(save.duels.pending.length,1);
assert.equal(refreshes,1,'The city room receives a new challenge immediately');
assert.equal(context.window.FE_POKER_SETTLE('rude-1','working',4,2,33,'rude'),false,
 'Same session must never issue duplicate challenge');
assert.equal(context.window.FE_POKER_SETTLE('normal-1','middle',0,3,40,'courteous'),true);
assert.equal(duels.pendingAt(save,'commercePoker'),null);
assert.equal(save.duels.pending.length,1);
assert.equal(results.length,2);
console.log('PASS actual poker settlement generates one earned rude-table duel and none for courteous play');
