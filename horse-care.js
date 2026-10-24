/* Capital & Consequence: earned daily horse/vehicle care and Saturday bills.
 * Personal horses use the owner's money. Only settled payments credit suppliers.
 * All rates are provisional 1878 game-economy estimates.
 */
(function(root){
 'use strict';
 const FEED_CENTS=20, BOARD_CENTS=25, VEHICLE_STORAGE_CENTS=10;
 const LIVERIES=['westLivery','eastLivery'];
 function settleDay(save){
  const date=save?.gameDate;
  if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+'T12:00:00Z')))
   return {ok:false,reason:'Dated civil day required for animal care'};
  const assets=save.transport?.assets;
  if((!assets||!assets.length)&&!save.horseCare)return {ok:true,skipped:true};
  if(assets&&!Array.isArray(assets))throw Error('Invalid owned animal register');
  const care=save.horseCare||(save.horseCare={version:1,owed:{feed:0,westLivery:0,eastLivery:0},entries:{},settlements:{}});
  if(care.version!==1||!care.owed||!care.entries||!care.settlements)throw Error('Invalid animal care accounts');
  if(care.entries[date])return {...care.entries[date],repeated:true};
  const totals={feed:0,westLivery:0,eastLivery:0};
  for(const a of assets||[]){
   if(!a||(a.kind!=='horse'&&a.kind!=='carriage')||
      a.status==='missing'||a.status==='stolen'||(a.purchasedDate&&a.purchasedDate>date))continue;
   // First rental day was paid at hire. Additional days follow the rented
   // animal wherever it is and credit the issuing brother's stable.
   if(a.owner==='rental'){
    if(a.hiredDate<date&&LIVERIES.includes(a.hiredAt)&&Number.isSafeInteger(a.dailyRateCents))
     totals[a.hiredAt]+=a.dailyRateCents;
    continue;
   }
   if(a.owner!=='personal')continue;
   const stable=LIVERIES.includes(a.locationId)?a.locationId:null;
   if(a.kind==='horse')totals.feed+=FEED_CENTS;
   if(stable)totals[stable]+=a.kind==='horse'?BOARD_CENTS:VEHICLE_STORAGE_CENTS;
  }
  for(const key of Object.keys(totals)){
   const previous=care.owed[key]||0;
   if(!Number.isSafeInteger(previous)||previous<0)throw Error('Invalid unpaid animal care liability');
   care.owed[key]=previous+totals[key];
  }
  let paidCents=0;
  const transfers={feed:0,westLivery:0,eastLivery:0};
  const saturday=new Date(date+'T12:00:00Z').getUTCDay()===6;
  if(saturday){
   let cash=Math.round(save.personalCash*100);
   if(!Number.isSafeInteger(cash)||cash<0)throw Error('Invalid personal purse');
   for(const key of ['feed','westLivery','eastLivery']){
    const paid=Math.min(cash,care.owed[key]);
    cash-=paid;care.owed[key]-=paid;paidCents+=paid;transfers[key]=paid;
   }
   save.personalCash=cash/100;
   if(transfers.feed){
    const market=save.washingtonCommerce||(save.washingtonCommerce={version:1,accounts:{},purchases:[],settlements:{}});
    if(market.version!==1||!market.accounts)throw Error('Invalid feed supplier ledger');
    market.accounts.fodder=(market.accounts.fodder||0)+transfers.feed;
   }
   if(transfers.westLivery||transfers.eastLivery){
    const book=save.liveryTrade||(save.liveryTrade={version:1,receipts:{},tills:{westLivery:0,eastLivery:0}});
    if(book.version!==1||!book.tills)throw Error('Invalid stable accounts');
    for(const stable of LIVERIES)book.tills[stable]=(book.tills[stable]||0)+transfers[stable];
   }
  }
  const arrearsCents=Object.values(care.owed).reduce((a,b)=>a+b,0);
  const receipt={ok:true,date,accruedCents:Object.values(totals).reduce((a,b)=>a+b,0),
   paidCents,arrearsCents,transfers,saturday};
  care.entries[date]=receipt;
  if(saturday)care.settlements[date]=receipt;
  return {...receipt,repeated:false};
 }
 const api=Object.freeze({FEED_CENTS,BOARD_CENTS,VEHICLE_STORAGE_CENTS,settleDay});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_HORSE_CARE=api;
})(typeof window!=='undefined'?window:globalThis);
