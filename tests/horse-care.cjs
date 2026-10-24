'use strict';
const assert=require('node:assert/strict'),care=require('../horse-care.js');
assert.equal(care.FEED_CENTS,20);assert.equal(care.BOARD_CENTS,25);
const s={gameDate:'1878-01-02',personalCash:10,companyCash:500,
 transport:{version:2,assets:[
  {id:'h1',kind:'horse',owner:'personal',locationId:'westLivery',status:'stabled',purchasedDate:'1878-01-02'},
  {id:'w1',kind:'carriage',owner:'personal',locationId:'westLivery',status:'stabled',purchasedDate:'1878-01-04'}],
  events:[],journeys:[]}};
function day(d){s.gameDate=d;return care.settleDay(s)}
assert.equal(day('1878-01-02').accruedCents,45,'Stable horse owes feed and boarding');
assert.equal(day('1878-01-03').accruedCents,45);
assert.equal(day('1878-01-04').accruedCents,55,'Stored wagon adds storage on its purchase date');
assert.equal(s.personalCash,10,'No hidden daily debit');
const sat=day('1878-01-05');
assert.equal(sat.accruedCents,55);
assert.equal(sat.paidCents,200);
assert.equal(s.personalCash,8);
assert.equal(s.companyCash,500,'Private horse cannot debit Federal Electric');
assert.equal(s.washingtonCommerce.accounts.fodder,80,'Feed suppliers receive actual payment');
assert.equal(s.liveryTrade.tills.westLivery,120,'Only paid commercial boarding/storage goes to this stable');
const snapshot=JSON.stringify(s);
assert.equal(day('1878-01-05').repeated,true);
assert.equal(JSON.stringify(s),snapshot,'Saturday settlement is idempotent');
s.transport.assets[0].locationId='factory';s.transport.assets[0].status='stabled';
s.transport.assets[1].locationId='factory';s.transport.assets[1].status='stabled';
assert.equal(day('1878-01-06').accruedCents,20,'Private factory shed requires feed but no commercial boarding');
assert.equal(day('1878-01-07').accruedCents,20);
s.transport.assets[0].status='missing';
assert.equal(day('1878-01-08').accruedCents,0,'Missing animal does not eat fabricated feed');
s.transport.assets[0].status='stabled';
s.personalCash=.05;
day('1878-01-09');day('1878-01-10');day('1878-01-11');
const insufficient=day('1878-01-12');
assert.equal(insufficient.paidCents,5);
assert.equal(insufficient.arrearsCents,95,'Unpaid feed bill persists instead of borrowing from company');
assert.equal(s.personalCash,0);
const prev=s.washingtonCommerce.accounts.fodder;
assert.equal(prev,85,'Only actual feed money reached the seller');
s.personalCash=2;s.gameDate='1878-01-19';
const cleared=care.settleDay(s);
assert.equal(cleared.paidCents,115,'Arrears plus newly incurred feed are paid from real cash');
assert.equal(cleared.arrearsCents,0);
assert.equal(s.personalCash,.85);
const fresh={gameDate:'1878-01-05',personalCash:0,companyCash:100};
assert.equal(care.settleDay(fresh).skipped,true,'No free horse and no invented bill for player without assets');
console.log('PASS horse feed and carriage storage, private shed exemption, Saturday payouts, underfunded debts and replay safety');
