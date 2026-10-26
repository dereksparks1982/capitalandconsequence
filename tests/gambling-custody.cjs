'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const cash=require('../cash-custody.js');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function world(route='industrialist'){
 return {gameDate:'1878-01-02',characterRoute:route,companyCash:1250,personalCash:180,
  unaccountedFunds:0,corporateMisuseCount:0};
}
const player=world();
assert.equal(cash.transfer(player,'collectCompany',620,'factory','industrialist').ok,true);
const owned=cash.stake(player,'company',60,'washingtonArena');
assert.equal(owned.ok,true,'Licensed boxing reserves physically carried business funds');
assert.equal(cash.balances(player).companyCarried,560);
assert.equal(player.personalCash,180);
assert.equal(player.unaccountedFunds,60);
assert.equal(cash.settle(player,owned.ticket,110).ok,true);
assert.equal(cash.balances(player).companyCarried,670,'Boxing winnings stay company property');
assert.equal(player.personalCash,180);
assert.equal(player.unaccountedFunds,0,'Company principal reappears, so shortfall is closed');
assert.equal(cash.settle(player,owned.ticket,110).ok,false,'Boxing cannot pay twice');
const wrongTicket={...owned.ticket,custodyId:owned.ticket.custodyId+100000};
assert.equal(cash.settle(player,wrongTicket,99999).ok,false,'Forged bettor cannot mint funds');
const wrongFunding=cash.stake(player,'company',25,'workingPoker');
assert.equal(wrongFunding.ok,true);
assert.equal(cash.settle(player,{...wrongFunding.ticket,funding:'personal'},2500).ok,false,
 'Forged ownership cannot redirect business money into a personal wallet');
assert.equal(cash.settle(player,{...wrongFunding.ticket,stake:1},2500).ok,false,
 'Modified escrow amount cannot mint extra winnings');
assert.equal(cash.settle(player,wrongFunding.ticket,0).ok,true,'Forfeited poker stake remains lost');
assert.equal(player.unaccountedFunds,25);
const before=JSON.stringify(cash.balances(player)),misuse=player.corporateMisuseCount;
const open=cash.stake(player,'company',100,'commercePoker');
assert.equal(open.ok,true);
assert.equal(cash.cancel(player,open.ticket).ok,true,'Undealt poker stake can be returned');
assert.equal(JSON.stringify(cash.balances(player)),before,'Refund returns precisely the originating cash');
assert.equal(player.corporateMisuseCount,misuse,'Void does not invent a company gambling offense');
assert.equal(player.unaccountedFunds,25,'Earlier genuine lost money persists');
assert.equal(cash.cancel(player,open.ticket).ok,false,'No duplicate canceled ticket refund');
assert.equal(cash.settle(player,open.ticket,100).ok,false,'Canceled ticket cannot later win');
const personal=cash.stake(player,'personal',50,'embassyPoker');
assert.equal(personal.ok,true);
assert.equal(cash.settle(player,personal.ticket,120).ok,true);
assert.equal(player.personalCash,250,'Personal poker profit remains personal cash');
const long=cash.stake(player,'company',20,'races');
assert.equal(long.ok,true);
for(let j=0;j<280;j++){
 const gift=cash.transfer(player,'depositChecking',.01,'districtBank','industrialist');
 assert.equal(gift.ok,true);
}
assert.ok(!player.cashCustody.history.some(x=>x.id===long.ticket.custodyId),
 'Activity history is bounded before old outstanding bets settle');
assert.equal(cash.settle(player,long.ticket,37).ok,true,
 'Escrow settles even after the bet receipt is pruned from visible activity');
assert.equal(cash.settle(player,long.ticket,37).ok,false,'Pruned history cannot pay twice');
const investigator=world('investigator');
investigator.cashCustody={version:1,companyCarried:500,businessBank:0,personalChecking:0,personalSavings:0,
 history:[],nextId:1};
assert.equal(cash.stake(investigator,'company',50,'washingtonArena').ok,false,
 'Someone playing the investigator cannot use Federal Electric funds');
assert.equal(cash.stake(investigator,'personal',50,'washingtonArena').ok,true,
 'Other careers retain their personal gambling rights');
const boxing=read('boxing.js'),racing=read('racing.js'),app=read('app.js'),html=read('index.html');
assert.ok(boxing.includes("FE_CASH_CUSTODY?.stake?.(S,funding,wager,'washingtonArena')"));
assert.ok(boxing.includes("FE_CASH_CUSTODY?.settle?.(S,bet.custodyTicket,payout)"));
assert.ok(racing.includes("FE_CASH_CUSTODY?.stake?.(S,funding,wager,'races')"));
assert.ok(racing.includes("FE_CASH_CUSTODY?.settle?.(S,bet.custodyTicket,payout)"));
assert.ok(html.includes('id="pokerFunding"')&&html.includes('id="cityRoomCompanyCash"'));
assert.ok(app.includes('FE_CASH_CUSTODY?.stake?.(S,funding,stake,pokerCustodyLocation(circle))'),
 'Poker uses the same physical custody ledger');
assert.ok(app.includes('FE_CASH_CUSTODY?.cancel?.(S,booked.ticket)'),
 'Blocked popups return original escrow without false cash creation');
assert.ok(app.includes('FE_CASH_CUSTODY?.settle?.(S,entry.custodyTicket,entry.stake+delta)'),
 'Poker popup pays back stake plus delta, not just net profit');
assert.ok(app.includes('FE_CASH_CUSTODY?.cancel?.(S,pending.custodyTicket)'),
 'Undealt recovery refunds original ownership');
assert.ok(app.includes('FE_CASH_CUSTODY?.settle?.(S,pending.custodyTicket,0)'),
 'Forfeited open games settle lost cash only once');
assert.ok(app.includes('FE_CASH_CUSTODY?.stake?.(S,funding,stake,pokerCustodyLocation(circle))'),
 'Simulated poker also takes a true stake');
console.log('PASS physical licensed-boxing, horse and poker wagers, owned payouts, voids, forfeits, long games, anti-duplication');
