'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../npc-ai.js'),'utf8');
const from=source.indexOf(' function shopAtObservedMarket(');
const until=source.indexOf(' function calendarOnce(',from);
assert.ok(from>0&&until>from,'Production market integration is present');
const purchases=[],stock={bread:1,potatoes:1,eggs:1};
const S={npcSimulation:{agents:{resident:{}}}};
const market={purchase:(save,id,good,opts)=>{
 if(purchases.some(x=>x.token===opts.token))return {ok:false,repeated:true};
 if(!stock[good])return {ok:false,reason:'sold out'};
 const wallet=save.npcSimulation.agents[id].economy;
 const cents={bread:5,potatoes:15,eggs:24}[good];
 if(wallet.balanceCents<cents)return {ok:false,reason:'no cash'};
 wallet.balanceCents-=cents;stock[good]--;
 const receipt={id:purchases.length+1,buyer:id,good,token:opts.token};
 purchases.push(receipt);return {ok:true,receipt};
}};
const receipts={available:agent=>agent.provisions||0,sync:(save,id)=>{save.npcSimulation.agents[id].provisions++}};
const window={FE_WASHINGTON_COMMERCE:market,FE_NPC_HOUSEHOLD_RECEIPTS:receipts};
const shop=vm.runInNewContext('(function(){'+source.slice(from,until)+
 'return shopAtObservedMarket;})()',{S,window});
function actor(overrides={}){
 return {status:'present',locationId:'oldChinatown',activity:'shopping for weekly supplies',
  needs:{hunger:88},economy:{balanceCents:120},provisions:0,...overrides};
}
const def={id:'resident'},a=actor();S.npcSimulation.agents.resident=a;
assert.equal(shop(def,a,'1878-01-03','day|1').good,'bread');
assert.equal(a.economy.balanceCents,115);
assert.equal(a.provisions,1);
assert.equal(shop(def,a,'1878-01-03','day|1'),null,'No duplicate purchase');
const traveler=actor({status:'travelling'});S.npcSimulation.agents.resident=traveler;
assert.equal(shop(def,traveler,'1878-01-03','day|2'),null);
const notMarket=actor({locationId:'factory'});S.npcSimulation.agents.resident=notMarket;
assert.equal(shop(def,notMarket,'1878-01-03','day|2'),null);
const fed=actor({needs:{hunger:20}});S.npcSimulation.agents.resident=fed;
assert.equal(shop(def,fed,'1878-01-03','day|2'),null);
const poor=actor({economy:{balanceCents:0}});S.npcSimulation.agents.resident=poor;
assert.equal(shop(def,poor,'1878-01-03','day|2'),null);
const alternative=actor();S.npcSimulation.agents.resident=alternative;
assert.equal(shop(def,alternative,'1878-01-03','day|2').good,'potatoes',
 'Exhausted bread stock leads to a real alternative purchase');
assert.equal(purchases.length,2,'Only two physical sales took place');
console.log('PASS NPC observed market shopping, affordability, stock, transit and replay');
