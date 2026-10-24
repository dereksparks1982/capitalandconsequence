/* 1878 Washington livery transactions: a horse or wagon is a paid,
 * physically placed owned asset, not a teleporting menu reward.
 * Two rival stablekeepers are brothers; names and feud cause remain undecided.
 */
(function(root){
 'use strict';
 const STABLES=Object.freeze({
  westLivery:Object.freeze({name:'Western Livery',brother:'western',prices:Object.freeze({
   'work-horse':10000,'saddle-horse':12000,'wagon':7500,'carriage':9000})}),
  eastLivery:Object.freeze({name:'Eastern Livery',brother:'eastern',prices:Object.freeze({
   'work-horse':9000,'saddle-horse':11000,'wagon':6000,'carriage':9500})})
 });
 const NAMES=Object.freeze({'work-horse':'Workhorse','saddle-horse':'Riding horse',
  'wagon':'Delivery wagon','carriage':'Passenger carriage'});
 const safeToken=t=>typeof t==='string'&&/^[A-Za-z0-9:_-]{1,80}$/.test(t);
 const weekday=d=>new Date(d+'T12:00:00Z').getUTCDay();
 function quote(stableId,item){
  const s=STABLES[stableId],amount=s?.prices?.[item];
  return s&&Number.isSafeInteger(amount)?{ok:true,stableId,item,name:NAMES[item],priceCents:amount}:
   {ok:false,reason:'This stable does not sell that item'};
 }
 function buy(save,stableId,item,token,spend){
  if(!save||!STABLES[stableId]||!safeToken(token))
   return {ok:false,reason:'Unrecognized livery purchase'};
  const book=save.liveryTrade||(save.liveryTrade={version:1,receipts:{},tills:{westLivery:0,eastLivery:0}});
  if(book.version!==1||!book.receipts||!book.tills)throw Error('Invalid livery book');
  if(book.receipts[token])return {...book.receipts[token],repeated:true};
  if(save.paused||save.phase!=='day'||save.currentLocation?.locationId!==stableId||
    save.currentLocation?.roomId!=='service-desk')
   return {ok:false,reason:'Visit the chosen livery service desk to buy'};
  const offer=quote(stableId,item);if(!offer.ok)return offer;
  const clock=root.FE_WASHINGTON_TIME?.now?.(save);
  const seconds=15*60;
  if(!clock||weekday(clock.date)===0||clock.minuteOfDay<540||
    (1020-clock.minuteOfDay)*60-(save.worldCalendarRemainder||0)<=seconds)
   return {ok:false,reason:'Livery purchases require fifteen minutes before 5 PM, Monday-Saturday'};
  const personalCents=Math.round(save.personalCash*100);
  if(!Number.isSafeInteger(personalCents)||personalCents<offer.priceCents)
   return {ok:false,reason:'Not enough personal cash for this purchase'};
  if(typeof spend!=='function'||spend(seconds,true)!==seconds)
   return {ok:false,reason:'Purchase time could not be charged'};
  const transport=save.transport||(save.transport={version:2,assets:[],events:[],journeys:[]});
  if(!Array.isArray(transport.assets)||!Array.isArray(transport.events))throw Error('Invalid transport inventory');
  const id='livery:'+token;
  if(transport.assets.some(a=>a.id===id))throw Error('Duplicate physical livery asset ID');
  const kind=item.includes('horse')?'horse':'carriage';
  const asset={id,name:offer.name,kind,model:item,owner:'personal',
   locationId:stableId,status:'stabled',condition:100,purchasedDate:clock.date};
  transport.assets.push(asset);
  transport.events.push({id:'purchase:'+token,assetId:id,type:'purchase',from:stableId,to:stableId,
   date:clock.date,priceCents:offer.priceCents});
  save.personalCash=(personalCents-offer.priceCents)/100;
  book.tills[stableId]=(book.tills[stableId]||0)+offer.priceCents;
  const receipt={ok:true,token,id,stableId,item,priceCents:offer.priceCents,
   date:clock.date,elapsedSeconds:seconds};
  book.receipts[token]=receipt;
  return {...receipt,repeated:false};
 }
 const api=Object.freeze({STABLES,NAMES,quote,buy});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_LIVERY_TRADE=api;
})(typeof window!=='undefined'?window:globalThis);
