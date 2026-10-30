'use strict';
// Extensive offering checks with real source, no desktop/browser dependency.
const assert=require('node:assert/strict');
const C=require('../corporate-governance.js');
function base(){
 return {gameDate:'1878-02-05',phase:'day',paused:false,characterRoute:'industrialist',
 currentLocation:{locationId:'factory',roomId:'executive-office'},
 companyCash:2500,personalCash:600,reputation:55,
 ledger:[{},{},{},{}],brokerage:{visits:2},portfolio:{},stocks:{},
 componentWorks:{cashCents:250000}};
}
function ready(s){
 assert.equal(C.incorporate(s,'inc').ok,true);
 assert.equal(C.vote(s,'ipo','board').passed,true);
 s.currentLocation.locationId='brokerOffice';return s;
}
let s=ready(base());
const before=JSON.stringify(s);
for(const [n,founder,price] of [[499,0,100],[10001,0,100],[500,10001,100],
 [1000,-1,100],[1000,0,99],[1000,0,2501],[1000,0,0],[1000,0,NaN],
 [1000.5,0,100],[1000,0,100.5]])
 assert.equal(C.prospectus(s,n,founder,price).ok,false,'Reject impossible share or price terms');
assert.equal(JSON.stringify(s),before,'Invalid quotes must leave save untouched');
for(const change of [
 a=>{a.brokerage.visits=1},a=>{a.ledger=[]},a=>{a.reputation=49},
 a=>{a.companyCash=749.99},a=>{a.paused=true},a=>{a.phase='night'},
 a=>{a.currentLocation.locationId='factory'},a=>{a.characterRoute='investigator'},
 a=>{C.ensure(a).authorizations.ipo=null},a=>{C.ensure(a).president='harlow'}
]){
 let next=ready(base());change(next);const before=JSON.stringify(next);
 assert.equal(C.prospectus(next,3000,500,100).ok,false);
 assert.equal(C.listing(next,3000,500,100,'disallowed').ok,false);
 assert.equal(JSON.stringify(next),before,'Failed underwriting cannot spend cash, consume shares or issue receipts');
}
s=ready(base());
const plan=C.prospectus(s,3000,500,100);
assert.equal(plan.ok,true);
assert.equal(plan.companyProceedsCents,285000);
assert.equal(plan.founderProceedsCents,47500);
assert.equal(plan.feesCents,17500);
assert.equal(plan.founderPercent,73.08);
assert.equal(plan.majorityLost,false);
assert.equal(s.companyCash,2425);
assert.equal(C.listing(s,3000,500,100,'issue').ok,true);
assert.equal(s.companyCash,5275);
assert.equal(s.componentWorks.cashCents,527500);
assert.equal(s.personalCash,1075);
assert.equal(C.ensure(s).issuedShares,13000);
assert.equal(C.ownership(s).founder,9500);
assert.equal(C.ownership(s).public,3500);
assert.equal(s.stocks.FEC.price,1);
assert.equal(s.stocks.FEC.sharesOffered,3500);
assert.equal(s.stocks.FEC.history.length,0);
assert.equal(C.listing(s,3000,500,100,'issue').repeated,true);
assert.equal(s.companyCash,5275,'Same receipt cannot raise a second round');
assert.equal(C.marketFill(s,1,100).ok,true);
assert.equal(C.ownership(s).founder,9600);
assert.equal(C.ownership(s).public,3400);
assert.equal(C.marketFill(s,-1,100).ok,true);
assert.equal(C.ownership(s).founder,9500);
assert.equal(C.ownership(s).public,3500);
assert.equal(C.marketFill(s,1,4000).ok,false,'Cannot buy more than actual outside float');
assert.equal(C.marketFill(s,-1,10).ok,false,'Cannot sell shares absent from personal account');
assert.equal(C.prospectus(s,3000,500,100).ok,false,'No second IPO after listing');
console.log('PASS IPO prospectus, independent bank/founder flows, dilution, readiness, anti-double-issue and genuine outside float');
