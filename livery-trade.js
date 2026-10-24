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

 // Hires are actual rented assets at the issuing stable, not free teleportation.
 // These provisional one-day prices include the first day's feed and service.
 const HIRES=Object.freeze({
  horse:Object.freeze({label:'Hire a riding horse',priceCents:100,items:[['horse','Rented riding horse',100]]}),
  'horse-and-buggy':Object.freeze({label:'Hire horse and buggy',priceCents:250,
   items:[['horse','Rented harness horse',100],['carriage','Rented buggy',150]]}),
  'horse-and-wagon':Object.freeze({label:'Hire horse and wagon',priceCents:220,
   items:[['horse','Rented workhorse',90],['carriage','Rented wagon',130]]})
 });
 function hire(save,stableId,service,token,spend){
  if(!save||!STABLES[stableId]||!HIRES[service]||!safeToken(token))
   return {ok:false,reason:'Unknown livery hire'};
  const book=save.liveryTrade||(save.liveryTrade={version:1,receipts:{},tills:{westLivery:0,eastLivery:0}});
  if(!book.receipts||!book.tills)throw Error('Invalid livery register');
  if(book.receipts[token])return {...book.receipts[token],repeated:true};
  if(save.paused||save.phase!=='day'||save.currentLocation?.locationId!==stableId||
     save.currentLocation?.roomId!=='service-desk')
   return {ok:false,reason:'Hire at the actual livery counter'};
  const moment=root.FE_WASHINGTON_TIME?.now?.(save),seconds=900;
  if(!moment||weekday(moment.date)===0||moment.minuteOfDay<540||
    (1020-moment.minuteOfDay)*60-(save.worldCalendarRemainder||0)<=seconds)
   return {ok:false,reason:'The livery hires horses Monday-Saturday, 9 AM-5 PM'};
  const offer=HIRES[service],money=Math.round(save.personalCash*100);
  if(!Number.isSafeInteger(money)||money<offer.priceCents)
   return {ok:false,reason:'Not enough personal cash for hire'};
  if(typeof spend!=='function'||spend(seconds,true)!==seconds)
   return {ok:false,reason:'Horse hire time could not advance'};
  const transport=save.transport||(save.transport={version:2,assets:[],events:[],journeys:[]});
  if(!Array.isArray(transport.assets)||!Array.isArray(transport.events))throw Error('Invalid vehicle registry');
  const ids=[];
  for(let i=0;i<offer.items.length;i++){
   const [kind,name,dailyRateCents]=offer.items[i];
   const id='hire:'+token+':'+i;
   if(transport.assets.some(a=>a.id===id))throw Error('Duplicate hire asset');
   const item={id,kind,name,model:service,owner:'rental',locationId:stableId,status:'stabled',
    hiredAt:stableId,hiredDate:moment.date,purchasedDate:moment.date,dailyRateCents};
   transport.assets.push(item);ids.push(id);
   transport.events.push({id:'hire:'+token+':'+i,assetId:id,type:'hire',date:moment.date,
    from:stableId,to:stableId,priceCents:i===0?offer.priceCents:0});
  }
  save.personalCash=(money-offer.priceCents)/100;
  book.tills[stableId]=(book.tills[stableId]||0)+offer.priceCents;
  const result={ok:true,kind:'hire',token,stableId,service,ids,priceCents:offer.priceCents,
   elapsedSeconds:seconds,date:moment.date};
  book.receipts[token]=result;
  return {...result,repeated:false};
 }
 function returnHire(save,assetId,token,spend){
  if(!save||!safeToken(token)||!assetId)return {ok:false,reason:'Unknown return'};
  const book=save.liveryTrade;
  if(book?.receipts?.[token])return {...book.receipts[token],repeated:true};
  const asset=save.transport?.assets?.find(a=>a.id===assetId&&a.owner==='rental');
  if(!asset)return {ok:false,reason:'No hired animal or vehicle to return'};
  const site=asset.hiredAt;
  if(save.paused||save.phase!=='day'||save.currentLocation?.locationId!==site||
    save.currentLocation.roomId!=='service-desk')
   return {ok:false,reason:'Return hired equipment to the issuing livery desk'};
  // The rented horse must arrive with the buggy or wagon rented with it.
  const group=save.transport.assets.filter(a=>a.owner==='rental'&&a.id.split(':').slice(0,-1).join(':')===
    asset.id.split(':').slice(0,-1).join(':'));
  if(group.some(a=>a.locationId!==site||!['stabled','tethered'].includes(a.status)))
   return {ok:false,reason:'The entire hired team must be returned together'};
  const moment=root.FE_WASHINGTON_TIME?.now?.(save),seconds=600;
  if(!moment||weekday(moment.date)===0||moment.minuteOfDay<540||
    (1020-moment.minuteOfDay)*60-(save.worldCalendarRemainder||0)<=seconds)
   return {ok:false,reason:'Returns are accepted Monday-Saturday before 5 PM'};
  if(typeof spend!=='function'||spend(seconds,true)!==seconds)
   return {ok:false,reason:'Return could not complete'};
  const ids=group.map(a=>a.id);
  save.transport.assets=save.transport.assets.filter(a=>!ids.includes(a.id));
  for(const id of ids)save.transport.events.push({id:'return:'+token+':'+id,assetId:id,
   type:'return',date:moment.date,from:site,to:site});
  if(ids.includes(save.horseCustody?.assetId)||ids.includes(save.horseCustody?.vehicleId))
   delete save.horseCustody;
  const result={ok:true,kind:'return',token,stableId:site,assetIds:ids,elapsedSeconds:seconds};
  book.receipts[token]=result;
  return {...result,repeated:false};
 }
 const api=Object.freeze({STABLES,NAMES,HIRES,quote,buy,hire,returnHire});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_LIVERY_TRADE=api;
})(typeof window!=='undefined'?window:globalThis);
