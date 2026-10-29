'use strict';
const assert=require('node:assert/strict');
const market=require('../washington-commerce.js'),npc=require('../npc-economy.js');
const person={id:'chenMei',traits:{caution:72,sociability:76}},actor={};
const save={gameDate:'1878-01-14',personalCash:6,npcSimulation:{agents:{chenMei:actor}}};
const w=market.ensure(save),startingStock=Object.values(w.stock).reduce((a,b)=>a+b,0);
const context={date:'1878-01-14',key:'1878-01-14|1',slot:1,weekday:1,seed:12,
 defaultLocation:'oldChinatown',defaultActivity:'meeting merchants',rest:false,save};
const move=npc.actionFor(person,actor,context);
assert.equal(move.repeated,false);
assert.equal(move.action.marketReceiptId,null,
 'Accounting for an NPC job cannot make purchases before physical arrival');
assert.equal(w.purchases.length,0,'No ghost sales before actual observed shopping');
assert.equal(Object.values(w.stock).reduce((a,b)=>a+b,0),startingStock,
 'Routine bookkeeping does not decrement actual market inventory');
// The city arrival system authorizes actual physical purchasing. Model that
// explicitly here, with the same shared receipt and merchant payment engine.
actor.locationId='oldChinatown';actor.status='present';actor.activity='shopping for groceries';
const bought=market.purchase(save,'chenMei','bread',{
 date:context.date,token:'market-arrival|chenMei|1878-01-14'});
assert.equal(bought.ok,true);
const r=w.purchases.find(x=>x.id===bought.receipt.id);
assert.ok(r&&r.buyer==='chenMei');
assert.equal(Object.values(w.stock).reduce((a,b)=>a+b,0),startingStock-1,'Autonomous purchase consumes shared stock');
assert.equal(w.accounts[r.vendor],r.cents,'Merchant receives cash from actual NPC wallet');
const after=JSON.stringify(save);
assert.equal(npc.actionFor(person,actor,context).repeated,true);
assert.equal(JSON.stringify(save),after,'Same observed NPC period cannot shop twice');
const p=market.purchase(save,'player',r.good,{date:context.date});
assert.equal(p.ok,true);assert.equal(w.stock[r.good],market.ensure(save).stock[r.good]);
assert.equal(w.accounts[r.vendor],r.cents*2);
assert.equal(w.purchases.length,2,'Player and autonomous residents share one purchase ledger');
const saved=JSON.parse(JSON.stringify(save));
assert.equal(saved.washingtonCommerce.purchases.length,2);
assert.ok(saved.npcSimulation.agents.chenMei.economy.balanceCents>=0);
console.log('PASS no phantom NPC accounting purchases; observed NPC and player use finite shared stock and paid tills');
