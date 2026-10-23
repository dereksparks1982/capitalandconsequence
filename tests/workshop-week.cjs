'use strict';
const assert=require('node:assert/strict'),works=require('../component-works.js');
const s=works.createOpeningOrders(works.createState());
assert.equal(s.orders.length,3,'A tangible railway batch begins on the first 1878 day');
assert.equal(s.orders.every(o=>o.customer==='Capital Railway Telegraph'&&o.deadline==='1878-01-12'),true);
const gross=s.orders.reduce((sum,o)=>sum+o.quantity*o.priceCents,0);
assert.equal(gross,3080,'Two keys, two relays and three contacts sell for $30.80');
const materialCents=s.orders.reduce((sum,o)=>sum+
 Object.entries(works.PRODUCTS[o.productId].inputs).reduce((cost,[k,units])=>cost+
 units*o.quantity*works.MATERIALS[k].costCents,0),0);
assert.equal(materialCents,540,'Input replacement cost is $5.40');
const minutes=s.orders.reduce((sum,o)=>sum+o.quantity*works.PRODUCTS[o.productId].minutes,0);
assert.equal(minutes,1740,'29 hours of two-person workshop production');
assert.equal(works.renewStandingOrders(s,'1878-01-07'),false,'No duplicate batch during the first full week');
for(const o of s.orders){
 assert.equal(works.assemble(s,o.id,o.quantity,'make:'+o.id).ok,true);
 s.date='1878-01-12';
 assert.equal(works.ship(s,o.id,o.quantity,'ship:'+o.id).ok,true);
}
const ledger=JSON.stringify(s);
assert.equal(works.renewStandingOrders(s,'1878-01-12'),false,'No renewal Saturday');
assert.equal(JSON.stringify(s),ledger);
s.date='1878-01-14';
assert.equal(works.renewStandingOrders(s,'1878-01-14'),true,'Delivered batch renews Monday');
assert.equal(s.orders.length,6);
assert.equal(s.orders.slice(3).every(o=>o.deadline==='1878-01-19'),true);
assert.equal(works.renewStandingOrders(s,'1878-01-14'),false);
assert.equal(s.orders.length,6,'Cannot duplicate weekly commitments');
console.log('PASS first 1878 weekly railway contract, cash and material arithmetic, output hours, renewal and no duplicate orders');
