'use strict';
const assert=require('node:assert/strict'),commerce=require('../washington-commerce.js');
const works=require('../component-works.js');
const account={balanceCents:600,earnedCents:600};
const s={gameDate:'1878-01-12',companyCash:100,lastRevenue:0,
 componentWorks:works.createState(),
 npcSimulation:{agents:{foremanSullivan:{economy:account}}}};
assert.equal(commerce.RENT_CENTS,25);
assert.equal(commerce.GOODS.find(g=>g.id==='milk').units,2,'Two quarts, not half-quart bottles');
assert.equal(commerce.GOODS.find(g=>g.id==='bread').units,1,'One bread loaf per week');
assert.equal(commerce.settleSaturday({...s,gameDate:'1878-01-13'}).ok,false,'No Sunday weekly purchases');
const first=commerce.settleSaturday(s);
assert.equal(first.ok,true);assert.equal(first.rentCents,25);
assert.equal(first.groceriesCents,279);
assert.equal(account.balanceCents,296,'$6 less rent and staples leaves $2.96 to save');
assert.equal(s.companyCash,100.25,'Rent transfers into company cash once');
assert.equal(s.componentWorks.cashCents,10025);
assert.equal(s.lastRevenue,.25);
assert.equal(Object.values(s.washingtonCommerce.accounts).reduce((a,b)=>a+b,0),279,'Every purchase credits a merchant account');
const paid=s.washingtonCommerce.purchases;
assert.equal(paid.filter(x=>x.good==='milk').length,1);
assert.equal(paid.find(x=>x.good==='milk').units,2);
assert.equal(paid.filter(x=>x.good==='bread').length,1);
assert.equal(paid.some(x=>x.good==='clothing'||x.good==='cobbler'),false,'No weekly clothing or shoe purchases');
const saved=JSON.stringify(s);
assert.equal(commerce.settleSaturday(s).repeated,true);
assert.equal(JSON.stringify(s),saved,'Reload/repeat cannot multiply purchases');
s.gameDate='1878-01-19';account.balanceCents+=600;
const next=commerce.settleSaturday(s);
assert.equal(next.groceriesCents,279);
assert.equal(s.companyCash,100.50);
const short={gameDate:'1878-01-12',companyCash:0,lastRevenue:0,componentWorks:works.createState(),
 npcSimulation:{agents:{foremanSullivan:{economy:{balanceCents:20,earnedCents:0}}}}};
const low=commerce.settleSaturday(short);
assert.equal(low.rentCents,20,'Cannot extract money the resident does not have');
assert.equal(low.groceriesCents,0);
assert.equal(short.companyCash,.20);
console.log('PASS real 1878 milk/bread/food shopping, company rent, vendor receipts, durable clothes and fixed-money accounting');
