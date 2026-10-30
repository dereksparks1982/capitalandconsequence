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
const a=setup();charter(a);
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
