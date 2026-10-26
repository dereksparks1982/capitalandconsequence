'use strict';
const assert=require('node:assert/strict');
const market=require('../washington-commerce.js');
const receipts=require('../npc-household-receipts.js');
function state(){
 return {gameDate:'1878-01-12',personalCash:9,companyCash:100,lastRevenue:0,
  npcSimulation:{agents:{
   chenMei:{economy:{balanceCents:500},needs:{version:1,hunger:72}},
   liWen:{economy:{balanceCents:400},needs:{version:1,hunger:40}},
   foremanSullivan:{economy:{balanceCents:600,earnedCents:600}}
  }},componentWorks:{cashCents:10000}};
}
const save=state(),initial=market.ensure(save);
assert.equal(receipts.sync(save,'chenMei').added,0);
assert.equal(save.npcSimulation.agents.chenMei.householdReceipts.history.length,0);
const bread=market.purchase(save,'chenMei','bread',{date:save.gameDate,token:'test|chen|bread'});
const soap=market.purchase(save,'chenMei','soap',{date:save.gameDate,token:'test|chen|soap'});
const another=market.purchase(save,'liWen','milk',{date:save.gameDate,token:'test|li|milk'});
const player=market.purchase(save,'player','eggs',{date:save.gameDate});
assert.ok([bread,soap,another,player].every(x=>x.ok));
const before={
 stock:JSON.stringify(save.washingtonCommerce.stock),
 accounts:JSON.stringify(save.washingtonCommerce.accounts),
 wallet:save.npcSimulation.agents.chenMei.economy.balanceCents,
 hunger:save.npcSimulation.agents.chenMei.needs.hunger,
 playerCash:save.personalCash,
 bag:JSON.stringify(save.washingtonCommerce.playerBag)
};
const added=receipts.sync(save,'chenMei');
assert.equal(added.changed,true);assert.equal(added.added,2);
const home=save.npcSimulation.agents.chenMei.householdReceipts;
assert.equal(home.foodPurchases,1);
assert.equal(home.maintenancePurchases,1);
assert.equal(home.spentCents,bread.receipt.cents+soap.receipt.cents);
assert.equal(home.history[0].good,'bread');
assert.equal(home.history[0].category,'food');
assert.equal(home.history[1].category,'household-maintenance');
assert.equal(home.lastFoodDate,save.gameDate);
assert.equal(home.lastPurchaseId,player.receipt.id,'Unrelated sales advance observed global receipt horizon');
assert.equal(receipts.sync(save,'liWen').added,1);
assert.equal(save.npcSimulation.agents.liWen.householdReceipts.foodPurchases,1);
assert.equal(receipts.sync(save,'foremanSullivan').added,0);
assert.equal(receipts.sync(save,'someoneWhoIsNotAnNPC').added,0);
assert.equal(receipts.sync(save,'player').added,0);
assert.equal(JSON.stringify(save.washingtonCommerce.stock),before.stock,'No second stock removal');
assert.equal(JSON.stringify(save.washingtonCommerce.accounts),before.accounts,'No second merchant payment');
assert.equal(save.npcSimulation.agents.chenMei.economy.balanceCents,before.wallet,'No second charge');
assert.equal(save.npcSimulation.agents.chenMei.needs.hunger,before.hunger,
 'Acquiring food does not fabricate eating');
assert.equal(save.personalCash,before.playerCash,'Player money untouched');
assert.equal(JSON.stringify(save.washingtonCommerce.playerBag),before.bag,'Player inventory untouched');
const frozen=JSON.stringify(save);
assert.equal(receipts.sync(save,'chenMei').changed,false,'Repeated same-time read has no new acquisition');
assert.equal(JSON.stringify(save),frozen,'No changed bytes on repeat');
const clone=JSON.parse(frozen);
assert.equal(receipts.sync(clone,'chenMei').added,0,'Reload never duplicates household evidence');
assert.equal(JSON.stringify(clone),frozen);
const secondBread=market.purchase(save,'chenMei','bread',{date:save.gameDate,token:'test|chen|bread2'});
assert.equal(secondBread.ok,true);
assert.equal(receipts.sync(save,'chenMei').added,1);
assert.equal(home.foodPurchases,2);
const formerly=home.foodPurchases;
const forged={id:999,date:save.gameDate,buyer:'chenMei',good:'bread',units:1,cents:9999,vendor:'bakery'};
save.washingtonCommerce.purchases.push(forged);
assert.equal(receipts.sync(save,'chenMei').added,0,'Inconsistent fake purchase cannot become provisions');
assert.equal(home.foodPurchases,formerly);
const saturday=state(),settled=market.settleSaturday(saturday);
assert.equal(settled.ok,true);
const originalWallet=saturday.npcSimulation.agents.foremanSullivan.economy.balanceCents;
const recorded=receipts.sync(saturday,'foremanSullivan');
const goods=saturday.washingtonCommerce.purchases.filter(p=>p.buyer==='foremanSullivan');
assert.equal(recorded.added,goods.length,'Saturday receipts include paid food and household goods');
assert.equal(saturday.npcSimulation.agents.foremanSullivan.economy.balanceCents,originalWallet);
assert.equal(saturday.companyCash,100.25,'Weekly rent transfers only once');
assert.equal(saturday.npcSimulation.agents.foremanSullivan.householdReceipts.spentCents,settled.groceriesCents);
assert.ok(saturday.npcSimulation.agents.foremanSullivan.householdReceipts.foodPurchases>0);
assert.equal(receipts.sync(saturday,'foremanSullivan').added,0);
assert.equal(market.settleSaturday(saturday).repeated,true);
assert.equal(receipts.sync(saturday,'foremanSullivan').added,0);
console.log('PASS individual NPC paid household acquisitions, genuine Sullivan groceries, private buyer separation, no meal invention or double charge');
