'use strict';
const assert=require('node:assert/strict');
const F=require('../whitcomb-family.js'),C=require('../corporate-governance.js');
const book=require('../personal-book-pages.js');
const copy=o=>JSON.parse(JSON.stringify(o));
function mk(){
 return {characterRoute:'industrialist',gameDate:'1878-01-02',
  currentLocation:{locationId:'factory',roomId:'executive-office'},paused:false,phase:'day',
  companyCash:2500,personalCash:600,componentWorks:{cashCents:250000},
  ledger:[{},{},{},{}],brokerage:{visits:3},reputation:55,stocks:{},portfolio:{}};
}
const s=mk(),startCash=s.companyCash;
const initial=F.report(s),initialCorp=C.ownership(s);
assert.equal(initial.principalCents,750000);
assert.equal(initial.nextDue,'1878-02-02');
assert.equal(s.companyCash,startCash,'founding loan already funded existing factory, no double-credit');
assert.equal(initialCorp.founder,7500);
assert.equal(initialCorp.family,2500);
assert.equal(initialCorp.founderPercent,75);
assert.equal(initialCorp.familyPercent,25);
assert.equal(initialCorp.issued,10000);
assert.equal(C.canManage(s),true);
const orig=copy(s);
assert.equal(F.pay(s,4500,'no-invoice').ok,false);
assert.deepEqual(s,orig);
assert.equal(C.incorporate(s,'charter').ok,true);
const board=C.ensure(s).directors;
assert.equal(board[1].id,'whitcomb-father');
assert.equal(C.appoint(s,'vale',1,'remove-father').ok,false,'family block on board seat');
assert.equal(C.appoint(s,'vale',2,'replace-other').ok,true,'other seats remain elective');
assert.equal(C.ownership(s).family,2500,'incorporation cannot dilute family');
s.gameDate='1878-02-01';
C.advanceDay(s);assert.equal(F.report(s).overdueCents,0,'nothing due before actual monthly date');
s.gameDate='1878-02-02';
C.advanceDay(s);
const due=F.report(s);
assert.equal(due.overdueCents,4500);assert.equal(due.interestDueCents,2500);
assert.equal(due.principalDueCents,2000);assert.equal(due.nextDue,'1878-03-02');
C.advanceDay(s);
assert.equal(F.report(s).overdueCents,4500,'repeat same day cannot mint another invoice');
const before=copy(s);
s.currentLocation.roomId='shop-floor';
assert.equal(F.pay(s,4500,'remote').ok,false);
s.currentLocation.roomId='executive-office';
s.paused=true;assert.equal(F.pay(s,4500,'paused').ok,false);s.paused=false;
s.companyCash=20;
assert.equal(F.pay(s,4500,'poor').ok,false);
s.companyCash=before.companyCash;
assert.equal(F.report(s).overdueCents,4500,'failed payment cannot forgive debt');
const pay=F.pay(s,4500,'family:pay:1');
assert.equal(pay.ok,true);
assert.equal(pay.interestPaidCents,2500);
assert.equal(pay.principalPaidCents,2000);
assert.equal(F.report(s).principalCents,748000);
assert.equal(F.report(s).overdueCents,0);
assert.equal(F.pay(s,4500,'family:pay:1').repeated,true);
assert.equal(s.companyCash,2425-45);
assert.equal(s.componentWorks.cashCents,238000);
assert.equal(F.report(s).status,'current');
const pages=book.buildPages(s);
assert(pages.some(p=>p.id==='whitcomb-family-finance'));
assert(pages.some(p=>p.id==='whitcomb-family-payments'));
assert(!book.buildPages({...s,characterRoute:'wardman'}).some(p=>p.id==='whitcomb-family-finance'),
 'Charles family accounts must not leak to a different protagonist');
assert.equal(C.vote(s,'ipo','ipo-board').passed,true);
s.currentLocation.locationId='brokerOffice';
const terms=C.prospectus(s,3000,500,100);
assert.equal(terms.ok,true);
assert.equal(terms.founderShares,7000);
assert.equal(terms.familyShares,2500);
assert.equal(terms.familyPercent,19.23);
assert.equal(terms.founderPercent,53.85);
const preview=JSON.stringify(s);
C.prospectus(s,3000,500,100);assert.equal(JSON.stringify(s),preview);
assert.equal(C.listing(s,3000,500,100,'first-ipo').ok,true);
assert.equal(C.listing(s,3000,500,100,'first-ipo').repeated,true);
assert.equal(C.ownership(s).issued,13000);
assert.equal(C.ownership(s).family,2500,'family cannot lose shares during founder secondary sale');
assert.equal(C.ownership(s).founder,7000);
assert.equal(C.ensure(s).publicShares,3500);
s.currentLocation.locationId='factory';s.companyCash=5000;
assert.equal(C.vote(s,'dividend','first-dividend').passed,true);
const row=C.ensure(s).dividends.at(-1),total=row.totalCents;
assert.equal(row.founderCents,Math.floor(total*7000/13000));
assert.equal(row.familyCents,Math.floor(total*2500/13000));
assert.equal(F.report(s).dividendIncomeCents,row.familyCents);
assert.equal(C.vote(s,'dividend','first-dividend').repeated,true);
assert.equal(F.report(s).dividendIncomeCents,row.familyCents,'replay cannot pay father twice');
// Corporate UI takes its payment token from the family receipt counter rather
// than the corporate register, so multiple partial payments remain possible.
const split=mk();F.ensure(split);split.gameDate='1878-02-02';F.advanceDay(split);
const firstToken='family-payment:'+F.ensure(split).nextId;
assert.equal(F.pay(split,1500,firstToken).ok,true);
assert.equal(F.report(split).overdueCents,3000);
const secondToken='family-payment:'+F.ensure(split).nextId;
assert.notEqual(secondToken,firstToken);
assert.equal(F.pay(split,3000,secondToken).ok,true);
assert.equal(F.report(split).overdueCents,0);
assert.equal(split.companyCash,2455);
assert.equal(F.pay(split,1500,firstToken).repeated,true);
assert.equal(split.companyCash,2455,'old token cannot double pay an installment');
const other=mk();other.characterRoute='wardman';
C.advanceDay(other);
assert.equal(other.whitcombFamily,undefined,'other protagonist does not incur Charlie family loan');
const stored=copy(s);
assert.equal(C.ensure(stored).familyShares,2500);
assert.equal(F.report(stored).principalCents,748000);
// Contrasting failed venture: six consecutive past-due cycles trigger
// collateral enforcement, never retroactively transfer public float.
const bad=mk();C.ensure(bad);F.ensure(bad);
for(const date of ['1878-02-02','1878-03-02','1878-04-02','1878-05-02','1878-06-02','1878-07-02','1878-08-02']){
 bad.gameDate=date;C.advanceDay(bad);
}
assert.equal(F.report(bad).status,'repossessed');
assert.equal(C.canManage(bad),false);
assert.equal(C.ensure(bad).president,'whitcomb-father');
assert.equal(C.ownership(bad).family,2500,'a loan is not a disguised automatic share issue');
assert.equal(C.ownership(bad).founder,7500,'pledged property seizure does not fabricate a transfer of shares');
assert.equal(bad.characterRoute,'industrialist','career remains playable after dispossession');
assert(F.report(bad).letters.some(l=>l.kind==='warning'));
assert(F.report(bad).letters.some(l=>l.kind==='foreclosure'));
const n=F.report(bad).installments;
C.advanceDay(bad);
assert.equal(F.report(bad).status,'repossessed');
console.log('PASS Whitcomb founding loan, monthly interest, real cash repayment, father voting IPO/dividend, protected family director, personal book and collateral seizure');
