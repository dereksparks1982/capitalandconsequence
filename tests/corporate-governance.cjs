'use strict';
const assert=require('node:assert/strict');
const C=require('../corporate-governance.js');
function setup(){
 return {gameDate:'1878-01-02',phase:'day',paused:false,characterRoute:'industrialist',
 currentLocation:{locationId:'factory'},companyCash:2500,personalCash:600,reputation:55,ledger:[{},{},{},{}],
 brokerage:{visits:3},portfolio:{},stocks:{PWR:{issuedShares:400,price:4.50,sector:'Railroads',
 history:[{date:'1878-01-01',close:4.50}]}}};
}
function charter(s){
 assert.equal(C.incorporate(s,'charter').ok,true);
 assert.equal(C.incorporate(s,'charter').repeated,true);
 assert.equal(s.companyCash,2425);
 assert.equal(C.ownership(s).founderPercent,100);
 assert.equal(C.vote(s,'ipo','approval').passed,true);
 s.currentLocation.locationId='brokerOffice';
}
const previewSave=setup();
const unopened=C.prospectus(previewSave,3000,500,100);
assert.equal(unopened.ok,false,'Private firm has no exchange listing');
assert.match(unopened.reason,/Incorporate/);
const stored=JSON.stringify(previewSave);
const draft=C.prospectus(previewSave,3000,500,100);
assert.equal(JSON.stringify(previewSave),stored,'Prospectus is strictly read-only');
assert.equal(draft.companyProceedsCents,285000);
assert.equal(draft.founderProceedsCents,47500);
assert.equal(draft.feesCents,17500);
assert.equal(draft.issuedShares,13000);
assert.equal(draft.founderShares,9500);
const a=setup();charter(a);
const prospectus=C.prospectus(a,5000,9000,100);
assert.equal(prospectus.ok,true,'Approved offering should be ready at broker');
assert.equal(prospectus.majorityLost,true,'Massive founder sale yields a loss-of-control warning');
assert.equal(prospectus.founderPercent,6.67);
assert.equal(prospectus.companyProceedsCents,475000);
assert.equal(prospectus.founderProceedsCents,855000);
const beforeQuote=JSON.stringify(a);
assert.equal(C.prospectus(a,5000,9000,100).ok,true);
assert.equal(JSON.stringify(a),beforeQuote,'Read-only prospectus must not mutate approved offering');

const before=C.ownership(a);
assert.equal(C.listing(a,-1,0,100,'invalid').ok,false);
assert.deepEqual(C.ownership(a),before);
assert.equal(C.listing(a,5000,9000,100,'ipo').ok,true);
assert.equal(C.listing(a,5000,9000,100,'ipo').repeated,true);
assert.equal(C.ownership(a).issued,15000);
assert.equal(C.ownership(a).founder,1000);
assert.equal(a.companyCash,7175);
assert.equal(a.personalCash,9150);
assert.equal(a.stocks.FEC.issuedShares,15000);
assert.equal(C.ensure(a).events.at(-1).underwritingFeesCents,70000,'Underwriter fees are recorded in the corporate minute book');
assert.equal(C.ensure(a).events.at(-1).founderPercent,6.67,'IPO records actual post-offering control');
assert.equal(a.stocks.FEC.history.length,0,'FEC must not gain invented pre-IPO market history');

assert.equal(a.stocks.FEC.sharesOffered,14000);
assert.equal(C.marketFill(a,1,100).ok,true);
assert.equal(C.marketFill(a,-1,100).ok,true);
assert.equal(C.ownership(a).founder,1000);
a.stocks.FEC.sharesOffered=0;C.syncListing(a);
assert.equal(a.stocks.FEC.sharesOffered,0,'no invented shares after reload');
assert.equal(C.tender(a,'future',0,'bad').ok,false,'no missing securities');
assert.equal(C.tender(a,'PWR',0,'tender').ok,true);
assert.equal(C.increaseStake(a,'PWR',90,0,'raise').ok,true);
assert.equal(C.squeezeOut(a,'PWR','compulsory').ok,true);
assert.equal(C.ensure(a).acquisitions[0].status,'wholly-owned');
const cashBefore=a.personalCash;
assert.equal(C.squeezeOut(a,'PWR','compulsory').repeated,true);
assert.equal(a.personalCash,cashBefore,'no repeated settlement');
const loss=setup();charter(loss);
assert.equal(C.listing(loss,5000,9000,100,'public').ok,true);
for(let i=1;i<=42;i++){
 const d=new Date('1878-01-02T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);
 loss.gameDate=d.toISOString().slice(0,10);
 C.advanceDay(loss);
 if(C.ensure(loss).president!=='charles')break;
}
const corporate=C.ensure(loss);
assert.notEqual(corporate.president,'charles','a majority can remove president');
assert.equal(corporate.votes.some(v=>v.resolution==='remove-president'&&v.passed),true,'formal removal vote');
assert.equal(C.ownership(loss).founder,1000,'dismissal does not confiscate shares');
assert.equal(C.canManage(loss),false,'dismissed president cannot manage factory');
const family=setup();charter(family);family.currentLocation.locationId='factory';
const record=C.ensure(family);record.directors[1].loyalty=10;record.directors[2].loyalty=10;
record.status='public';record.offeringDate=family.gameDate;record.issuedShares+=5000;record.publicShares+=5000;
family.companyCash=100;family.gameDate='1878-01-03';
assert.equal(C.advanceDay(family).kind,'loss-of-control');
assert.equal(C.ownership(family).founderPercent,66.67,'controlling owner can be fired as president');
console.log('PASS corporate charter, IPO, float, tender, squeeze-out, hostile majority and board votes');
